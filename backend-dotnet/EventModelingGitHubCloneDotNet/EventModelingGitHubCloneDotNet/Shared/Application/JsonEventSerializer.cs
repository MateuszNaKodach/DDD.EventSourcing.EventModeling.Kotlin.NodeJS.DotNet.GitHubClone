using System;
using System.Collections.Generic;
using System.Text;
using EventModelingGitHubCloneDotNet.Shared.Domain;
using EventStore.Client;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace EventModelingGitHubCloneDotNet.Shared.Application
{
    public class JsonEventSerializer : IEventSerializer
    {
        private static readonly JsonSerializerSettings SerializerSettings = new JsonSerializerSettings
        {
            TypeNameHandling = TypeNameHandling.None,
            ContractResolver = new DefaultContractResolver
            {
                NamingStrategy = new CamelCaseNamingStrategy()
            }
        };

        private readonly IDictionary<string, Type> _eventTypeClasses;

        public JsonEventSerializer(IDictionary<string, Type> eventTypeClasses)
        {
            _eventTypeClasses = eventTypeClasses;
        }

        public IDomainEvent? Deserialize(ResolvedEvent resolvedEvent)
        {
            if (!_eventTypeClasses.ContainsKey(resolvedEvent.Event.EventType))
            {
                return null;
            }
            var type = _eventTypeClasses[resolvedEvent.Event.EventType];
            if (type is null)
            {
                return null;
            }

            return (IDomainEvent) JsonConvert.DeserializeObject(
                Encoding.UTF8.GetString(resolvedEvent.Event.Data.ToArray()), type);
        }

        public EventData Serialize(IDomainEvent domainEvent)
        {
            return new EventData(
                Uuid.NewUuid(),
                domainEvent.GetType().Name,
                Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(domainEvent,
                    SerializerSettings)));
        }
    }
}