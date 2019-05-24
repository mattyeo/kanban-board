import { Card } from './card.model';
import { Timestamp } from '@firebase/firestore-types'

export class Step {
  id: string;
  name: string;
  cards: Card[];
  date: Timestamp;
}
