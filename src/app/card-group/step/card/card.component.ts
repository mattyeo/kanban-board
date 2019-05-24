import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Card } from '../../../models/card.model';
import { CardService } from '../../../services/card.service';
import { faTrashAlt, faEdit } from '@fortawesome/free-regular-svg-icons';
import { ModalManager } from 'ngb-modal';
import { FormControl, Validators } from '@angular/forms';
import { CardDictionary } from '../../../dictionaries/Card.dictionary';
import { Step } from '../../../models/step.model';
import { StepService } from '../../../services/step.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html'
})
export class CardComponent implements OnInit {
  @ViewChild('editCardModal') editCardModal;
  @ViewChild('deleteCardModal') deleteCardModal;
  @ViewChild('moveCardModal') moveCardModal;

  private modalRef;

  @Input() card: Card;
  @Input() stepId: string;
  @Input() cardGroupId: string;

  cardTitle: FormControl;
  cardDescription: FormControl;
  cardPriority: FormControl;

  newStep: FormControl;
  stepList: Step[];

  faTrashAlt = faTrashAlt;
  faEdit = faEdit;

  constructor(private stepService: StepService, public cardService: CardService, private modalService: ModalManager) { }

  ngOnInit() {
    this.cardTitle = new FormControl(this.card.title, Validators.required);
    this.cardDescription = new FormControl(this.card.description, Validators.required);
    this.cardPriority = new FormControl(this.card.priority, Validators.required)
    this.newStep = new FormControl('');

    this.stepService.getSteps(this.cardGroupId).subscribe(data => {
      this.stepList = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Step
      })
      this.stepList.forEach((value, index) => {
        if (value.id == this.stepId) {
          this.stepList.splice(index, 1);
        }
      })
    })
  }

  getCardPriority(): string {
    return this.card.priority;
  }

  hasCardLowPriority(): boolean {
    return this.getCardPriority() == CardDictionary.LowPriority;
  }

  hasCardMediumPriority(): boolean {
    return this.getCardPriority() == CardDictionary.MediumPriority;
  }

  hasCardHighPriority(): boolean {
    return this.getCardPriority() == CardDictionary.HighPriority;
  }

  isUpdateCardModalFormValid() {
    return this.cardTitle.valid && this.cardDescription.valid && this.cardPriority.valid;
  }

  openEditCardModal() {
    this.modalRef = this.modalService.open(this.editCardModal, {
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

  closeUpdateCardModal() {
    this.modalService.close(this.editCardModal);
  }

  updateCard() {
    if (this.isUpdateCardModalFormValid()) {
      this.card.title = this.cardTitle.value;
      this.card.description = this.cardDescription.value;
      this.card.priority = this.cardPriority.value;
      this.cardService.updateCard(this.cardGroupId, this.stepId, this.card);
      this.modalService.close(this.editCardModal);
    } else {
      this.cardTitle.markAsTouched();
      this.cardDescription.markAsTouched();
      this.cardPriority.markAsTouched();
    }
  }

  openDeleteCardModal() {
    this.modalRef = this.modalService.open(this.deleteCardModal, {
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

  closeDeleteCardModal() {
    this.modalService.close(this.deleteCardModal);
  }

  deleteCard() {
    this.cardService.deleteCard(this.cardGroupId, this.stepId, this.card);
  }

  openMoveCardModal() {
    this.modalRef = this.modalService.open(this.moveCardModal, {
      size: "md",
      modalClass: 'modal',
      hideCloseButton: false,
      centered: true,
      backdrop: true,
      animation: false,
      keyboard: true,
      closeOnOutsideClick: false,
      backdropClass: "modal-backdrop"
    });
  }

  closeMoveCardModal() {
    this.modalService.close(this.moveCardModal);
  }

  saveMoveCard() {
    this.cardService.moveCardToStep(this.cardGroupId, this.stepId, this.newStep.value, this.card);
    this.closeMoveCardModal();
  }

  uppercaseFirstLetter(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
