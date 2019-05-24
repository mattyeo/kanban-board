import { Step } from './step.model';
import { Timestamp } from '@firebase/firestore-types'

export class CardGroup {
  id: string;
  title: string;
  dueDate: Timestamp; 
  steps: Step[];
}
