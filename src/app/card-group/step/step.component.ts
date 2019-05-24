import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Card } from '../../models/card.model';
import { CardService } from '../../services/card.service';
import { Step } from '../../models/step.model';
import { StepService } from '../../services/step.service';

import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { ModalManager } from 'ngb-modal';
import { FormControl, Validators } from '@angular/forms';
import { CardDictionary } from 'src/app/dictionaries/Card.dictionary';

@Component({
  selector: 'app-step',
  templateUrl: './step.component.html'
})
export class StepComponent implements OnInit {
  @ViewChild('addCardModal') addCardModal;
  @ViewChild('deleteStepModal') deleteStepModal;
  private modalRef;

  @Input() step: Step;
  @Input() cardGroupId: string;
  cards: Card[];

  cardTitle: FormControl;
  cardDescription: FormControl;
  cardPriority: FormControl;

  faTrashAlt = faTrashAlt;
  faPlus = faPlus;

  constructor(public cardService: CardService, public stepService: StepService, private modalService: ModalManager) { }

  ngOnInit() {
    this.cardTitle = new FormControl('', Validators.required);
    this.cardDescription = new FormControl('', Validators.required);
    this.cardPriority = new FormControl('low', Validators.required);

    this.cardService.getCards(this.cardGroupId, this.step).subscribe(data => {
      this.cards = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Card;
      });
    })
  }

  openAddCardModal() {
    this.resetNewCardValues();
    this.modalRef = this.modalService.open(this.addCardModal, {
      size: "md",
      modalClass: 'modal',
      hideCloseButton: false,
      centered: true,
      backdrop: true,
      animation: false,
      keyboard: true,
      closeOnOutsideClick: false,
      backdropClass: "modal-backdrop"
    })
  }

  closeAddCardModal() {
    this.modalService.close(this.addCardModal);
  }

  createCard() {
    if (this.isFormValid()) {
      var newCard = new Card();
      newCard.title = this.cardTitle.value;
      newCard.description = this.cardDescription.value;
      newCard.priority = this.cardPriority.value;
      this.cardService.addCard(this.cardGroupId, this.step.id, newCard);
      this.modalService.close(this.addCardModal);
      this.resetNewCardValues();
    } else {
      this.cardTitle.markAsTouched();
      this.cardDescription.markAsTouched();
      this.cardPriority.markAsTouched();
    }
  }

  openDeleteStepModal() {
    this.modalRef = this.modalService.open(this.deleteStepModal, {
      size: "md",
      modalClass: 'modal',
      hideCloseButton: false,
      centered: true,
      backdrop: true,
      animation: false,
      keyboard: true,
      closeOnOutsideClick: false,
      backdropClass: "modal-backdrop"
    })
  }

  closeDeleteStepModal() {
    this.modalService.close(this.deleteStepModal);
  }

  deleteStep() {
    this.stepService.deleteStep(this.cardGroupId, this.step);
  }

  isFormValid(): boolean {
    return this.cardTitle.valid && this.cardDescription.valid && this.cardPriority.valid;
  }

  resetNewCardValues() {
    this.cardTitle.reset();
    this.cardDescription.reset();
    this.cardPriority.setValue('low');
  }

  uppercaseFirstLetter(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
