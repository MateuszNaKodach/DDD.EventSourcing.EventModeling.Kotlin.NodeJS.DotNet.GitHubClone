using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using EventModelingGitHubCloneDotNet.Shared.Application;
using EventModelingGitHubCloneDotNet.Slices.Automation.RequiredApprovesBranchProtectionRules.Command;
using EventModelingGitHubCloneDotNet.Slices.Automation.RequiredApprovesBranchProtectionRules.Event;
using EventModelingGitHubCloneDotNet.Slices.Automation.RequiredApprovesBranchProtectionRules.State;
using EventStore.Client;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace EventModelingGitHubCloneDotNet.Slices.Automation.RequiredApprovesBranchProtectionRules
{
    public class BranchProtectionRuleAutomation : BackgroundService
    {
        private readonly EventStoreClient _eventStore;
        private readonly IEventSerializer _eventSerializer;
        private readonly IRequiredApprovesRepository _requiredApprovesRepository;
        private readonly IPullRequestReviewsRepository _pullRequestReviewsRepository;
        private readonly IPullRequestBranchProtectionRules _pullRequestBranchProtectionRules;
        private readonly ILogger<BranchProtectionRuleAutomation> _logger;

        public BranchProtectionRuleAutomation(EventStoreClient eventStore, IEventSerializer eventSerializer,
            IRequiredApprovesRepository requiredApprovesRepository,
            IPullRequestReviewsRepository pullRequestReviewsRepository,
            IPullRequestBranchProtectionRules pullRequestBranchProtectionRules,
            ILogger<BranchProtectionRuleAutomation> logger)
        {
            _eventStore = eventStore;
            _eventSerializer = eventSerializer;
            _requiredApprovesRepository = requiredApprovesRepository;
            _pullRequestReviewsRepository = pullRequestReviewsRepository;
            _pullRequestBranchProtectionRules = pullRequestBranchProtectionRules;
            _logger = logger;
        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation($"Started!");
            stoppingToken.Register(() =>
                _logger.LogInformation("Stopping!"));

            return _eventStore.SubscribeToAllAsync(
                HandleEvent,
                subscriptionDropped: SubscriptionDropped,
                cancellationToken: stoppingToken
            );
        }

        private async Task HandleEvent(StreamSubscription subscription, ResolvedEvent resolvedEvent,
            CancellationToken cancellationToken)
        {
            var domainEvent = _eventSerializer.Deserialize(resolvedEvent);
            if (domainEvent == null)
            {
                return;
            }

            _logger.LogInformation($"Handled event: {domainEvent}");
            switch (domainEvent)
            {
                case PullRequestWasOpened opened:
                    await HandleEvent(opened);
                    break;
                case RequiredPullRequestReviewsWereConfigured configured:
                    await HandleEvent(configured);
                    break;
                case PullRequestWasApproved approved:
                    await HandleEvent(approved);
                    break;
            }
        }

        private async Task HandleEvent(PullRequestWasOpened opened)
        {
            if (await _pullRequestReviewsRepository.FindByRepositoryAndPullRequest(opened.RepositoryId, opened.PullRequestId) != null)
            {
                return;
            }
            var reviews = new PullRequestReviewApproves
            {
                RepositoryId = opened.RepositoryId,
                PullRequestId = opened.PullRequestId,
                TargetBranch = opened.TargetBranch
            };
            var rules = await _requiredApprovesRepository.FindBy(opened.RepositoryId, opened.TargetBranch);
            await _pullRequestReviewsRepository.Save(reviews);
            await InvokeCommandIfPossible(rules, reviews);
        }

        private async Task HandleEvent(PullRequestWasApproved approved)
        {
            var reviewsBeforeApproved =
                await _pullRequestReviewsRepository.FindByRepositoryAndPullRequest(approved.RepositoryId,
                    approved.PullRequestId);
            if (reviewsBeforeApproved == null)
            {
                return;
            }

            var reviewsAfterApproved = reviewsBeforeApproved.WithApproveFrom(approved.Reviewer);
            var rules = await _requiredApprovesRepository.FindBy(approved.RepositoryId, reviewsAfterApproved.TargetBranch);
            await _pullRequestReviewsRepository.Save(reviewsAfterApproved);
            await InvokeCommandIfPossible(rules, reviewsBeforeApproved, reviewsAfterApproved);
        }

        private async Task HandleEvent(RequiredPullRequestReviewsWereConfigured configured)
        {
            var ruleBeforeConfigured =
                await _requiredApprovesRepository.FindBy(configured.RepositoryId, configured.Branch);
            var ruleAfterConfigured = ruleBeforeConfigured == null
                ? new RequiredApprovesBranchProtectionRule
                {
                    RepositoryId = configured.RepositoryId,
                    Branch = configured.Branch,
                    RequiredApprovingReviews = configured.RequiredApprovingReviews,
                }
                : ruleBeforeConfigured.WithRequiredApprovingReviews(configured.RequiredApprovingReviews);
            await _requiredApprovesRepository.Save(ruleAfterConfigured);
            var branchReviews =
                await _pullRequestReviewsRepository.FindAllByRepositoryAndTargetBranch(configured.RepositoryId,
                    configured.Branch);
            await InvokeCommandIfPossible(ruleAfterConfigured, branchReviews);
        }

        private async Task InvokeCommandIfPossible(
            RequiredApprovesBranchProtectionRule ruleAfterConfigured,
            IEnumerable<PullRequestReviewApproves> branchReviewsList
        )
        {
            
            foreach (var branchReviews in branchReviewsList)
            {
                await InvokeCommandIfPossible(ruleAfterConfigured, branchReviews);
            }
        }

        private async Task InvokeCommandIfPossible(
            RequiredApprovesBranchProtectionRule? rules,
            PullRequestReviewApproves branchReviews
            )
        {
            if (rules == null)
            {
                return;
            }
            if (branchReviews.Approves < rules.RequiredApprovingReviews)
            {
                await _pullRequestBranchProtectionRules.Unsatisfy(
                    new UnsatisfyPullRequestProtectionRule
                    (
                        branchReviews.RepositoryId,
                        branchReviews.PullRequestId
                    )
                );
            }
            else
            {
                await _pullRequestBranchProtectionRules.Satisfy(
                    new SatisfyPullRequestProtectionRule
                    (
                        branchReviews.RepositoryId,
                        branchReviews.PullRequestId
                    )
                );
            }
        }

        private async Task InvokeCommandIfPossible(
            RequiredApprovesBranchProtectionRule? rules,
            PullRequestReviewApproves? reviewsBeforeApproved,
            PullRequestReviewApproves reviewsAfterApproved
        )
        {
            if (rules == null)
            {
                return;
            }

            var alreadySatisfied = (reviewsBeforeApproved?.Approves ?? 0) >= (rules?.RequiredApprovingReviews ?? 0);
            if (alreadySatisfied)
            {
                return;
            }

            var satisfiedAfter = rules != null && reviewsAfterApproved.Approves >= rules.RequiredApprovingReviews;
            if (satisfiedAfter)
            {
                await _pullRequestBranchProtectionRules.Satisfy(
                    new SatisfyPullRequestProtectionRule
                    (
                        reviewsAfterApproved.RepositoryId,
                        reviewsAfterApproved.PullRequestId
                    )
                );
            }
        }

        private void SubscriptionDropped(
            StreamSubscription subscription,
            SubscriptionDroppedReason reason,
            Exception? exception
        )
        {
            if (exception != null)
            {
                _logger.LogError($"Dropped due to: {reason}", exception);
            }
            else
            {
                _logger.LogInformation($"Dropped due to: {reason}");
            }
        }
    }
}