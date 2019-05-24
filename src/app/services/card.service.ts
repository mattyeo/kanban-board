import { Injectable } from '@angular/core';
import { Step } from '../models/step.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { CollectionDictionary } from '../dictionaries/Collection.dictionary';
import { Card } from '../models/card.model';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor(public afs: AngularFirestore) { }

  getCards(cardGroupId: string, step: Step) {
    return this.afs
      .collection(`${CollectionDictionary.cardGroup}/${cardGroupId}/${CollectionDictionary.step}/${step.id}/${CollectionDictionary.card}`)
      .snapshotChanges();
  }

  addCard(cardGroupId: string, stepId: string, card: Card) {
    card.id = this.afs.createId()
    this.afs.collection(`${CollectionDictionary.cardGroup}/${cardGroupId}/${CollectionDictionary.step}/${stepId}/${CollectionDictionary.card}`)
      .doc(card.id)
      .set({
        title: card.title,
        description: card.description,
        priority: card.priority
      }, { merge: true });
  }

  updateCard(cardGroupId: string, stepId: string, card: Card) {
    this.afs.collection(`${CollectionDictionary.cardGroup}/${cardGroupId}/${CollectionDictionary.step}/${stepId}/${CollectionDictionary.card}`)
      .doc(card.id)
      .set({
        title: card.title,
        description: card.description,
        priority: card.priority
      }, { merge: true })
  }

  deleteCard(cardGroupId: string, stepId: string, card: Card) {
    this.afs
      .collection(`${CollectionDictionary.cardGroup}/${cardGroupId}/${CollectionDictionary.step}/${stepId}/${CollectionDictionary.card}`)
      .doc(card.id)
      .delete()
  }

  moveCardToStep(cardGroupId: string, previousStepId: string, newStepId: string, card: Card) {
    const batch = this.afs.firestore.batch();

    var newStepCardCollection = this.afs.collection(`${CollectionDictionary.cardGroup}/${cardGroupId}/${CollectionDictionary.step}/${newStepId}/${CollectionDictionary.card}`)
      .doc(card.id).ref;
    batch.set(newStepCardCollection, card, { merge: true })

    var oldStepCardCollection = this.afs.collection(`${CollectionDictionary.cardGroup}/${cardGroupId}/${CollectionDictionary.step}/${previousStepId}/${CollectionDictionary.card}`)
      .doc(card.id).ref;
    batch.delete(oldStepCardCollection);

    batch.commit();
  }
}
