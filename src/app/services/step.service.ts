import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { CollectionDictionary } from '../dictionaries/Collection.dictionary';
import { Step } from '../models/step.model';
import { firestore } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class StepService {

  constructor(public afs: AngularFirestore) { }

  getSteps(cardGroupId: string) {
    return this.afs.collection(`${CollectionDictionary.cardGroup}/${cardGroupId}/${CollectionDictionary.step}`).snapshotChanges();
  }

  addStep(cardGroupId: string, step: Step) {
    step.id = this.afs.createId()
    this.afs.collection(`${CollectionDictionary.cardGroup}/${cardGroupId}/${CollectionDictionary.step}`)
      .doc(step.id)
      .set({
        name: step.name,
        date: firestore.Timestamp.fromMillis(Date.now())
      }, { merge: true });
  }

  deleteStep(cardGroupId: string, step: Step) {
    const batch = this.afs.firestore.batch();
    this.afs.collection(`${CollectionDictionary.cardGroup}/${cardGroupId}/${CollectionDictionary.step}/${step.id}/${CollectionDictionary.card}`)
      .get()
      .subscribe(cards => {
        cards.docs.forEach(card => {
          var cardRef = this.afs.collection(`${CollectionDictionary.cardGroup}/${cardGroupId}/${CollectionDictionary.step}/${step.id}/${CollectionDictionary.card}`)
            .doc(card.id).ref
          batch.delete(cardRef);
        })
      })
    var stepRef = this.afs.collection(`${CollectionDictionary.cardGroup}/${cardGroupId}/${CollectionDictionary.step}`)
      .doc(step.id).ref;

    batch.delete(stepRef);
    batch.commit();
  }
}
