import { EventStoreDBClient } from '@eventstore/db-client';

export async function streamLastEvent(eventStore: EventStoreDBClient, streamName: string) {
  return (await eventStore.readStream(streamName, { direction: 'backwards', fromRevision: 'end', maxCount: 1 }))[0];
}

export async function eventsInStream(eventStore: EventStoreDBClient, streamName: string) {
  return (await eventStore.readStream(streamName)).length;
}
