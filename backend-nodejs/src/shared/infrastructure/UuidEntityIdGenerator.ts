import { EntityIdGenerator } from '../application/EntityIdGenerator';
import { v4 as uuid } from 'uuid';

export class UuidEntityIdGenerator implements EntityIdGenerator {
  generate(): string {
    return uuid();
  }
}
