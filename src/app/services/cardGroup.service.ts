import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { CardGroup } from '../models/cardGroup.model';
import { CollectionDictionary } from '../dictionaries/Collection.dictionary';
import { Step } from '../models/step.model';
import { firestore } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class CardGroupService {
  
  constructor(public afs: AngularFirestore) { }

  getCardGroups() {
    return this.afs.collection(CollectionDictionary.cardGroup).snapshotChanges();
  }

  addCardGroup(cardGroup: CardGroup) {
    cardGroup.id = this.afs.createId();

    const batch = this.afs.firestore.batch();

    var cardRef = this.afs.collection(CollectionDictionary.cardGroup).doc(cardGroup.id).ref;
    batch.set(cardRef, {
      title: cardGroup.title,
      dueDate: cardGroup.dueDate
    }, { merge: true });

    var stepArray = ["To Do", "In Progress", "Test", "Done"];
    stepArray.forEach(stepName => {
      var newStep = new Step();
      newStep.id = this.afs.createId();
      newStep.date = firestore.Timestamp.now()

      var stepRef = this.afs.collection(`${CollectionDictionary.cardGroup}/${cardGroup.id}/${CollectionDictionary.step}`).doc(newStep.id).ref;
      batch.set(stepRef, {
        date: newStep.date,
        name: stepName,
      }, { merge: true });
    })
    batch.commit();
  }
}
