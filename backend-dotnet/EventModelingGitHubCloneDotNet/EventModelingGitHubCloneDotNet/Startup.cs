using System;
using EventModelingGitHubCloneDotNet.Shared.Application;
using EventModelingGitHubCloneDotNet.Shared.Domain;
using EventModelingGitHubCloneDotNet.Shared.Infrastructure;
using EventModelingGitHubCloneDotNet.Slices.Automation.RequiredApprovesBranchProtectionRules;
using EventModelingGitHubCloneDotNet.Slices.Automation.RequiredApprovesBranchProtectionRules.Command;
using EventModelingGitHubCloneDotNet.Slices.Read.PullRequestComments.Core;
using EventModelingGitHubCloneDotNet.Slices.Write.AddSinglePullRequestComment.Core;
using EventStore.Client;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;

namespace EventModelingGitHubCloneDotNet
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            var eventStoreConnectionString = Environment.GetEnvironmentVariable("EVENTSTORE_CONNECTION_STRING") ??
                                             "esdb://localhost:2113?tls=false";

            EventStoreClient eventStore =
                new EventStoreClient(EventStoreClientSettings.Create(eventStoreConnectionString));
            IClock clock = Environment.GetEnvironmentVariable("CLOCK") == "SYSTEM"
                ? new SystemDefaultClock()
                : new FixedClock(DateTime.Now);
            services.AddSingleton(clock);
            services.AddSingleton<IGuidGenerator>(new GuidGenerator());
            
            //Write Slices
            services.AddSinglePullRequestCommentSlice(eventStore, clock);

            //Read Slices
            services.AddPullRequestCommentsSlice(eventStore);

            //Automation Slices
            services.AddRequiredApprovesBranchProtectionRulesSlice(
                eventStore,
                new HttpClientPullRequestBranchProtectionRules()
            );


            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1",
                    new OpenApiInfo
                    {
                        Title = "DotNet | GitHub Clone REST API | ZycieNaKodach.pl", Version = "v1",
                        Contact = new OpenApiContact {Email = "mateusz@zycienakodach.pl"}
                    });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseCors(builder =>
                builder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            //app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints => { endpoints.MapControllers(); });

            // Enable middleware to serve generated Swagger as a JSON endpoint.
            app.UseSwagger();

            // Enable middleware to serve swagger-ui (HTML, JS, CSS etc.), specifying the Swagger JSON endpoint.
            app.UseSwaggerUI(c => { c.SwaggerEndpoint("/swagger/v1/swagger.json", "GitHub Clone"); });
        }
    }
}
