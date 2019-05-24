import { Component, OnInit, ViewChild } from '@angular/core';
import { CardGroupService } from '../services/cardGroup.service';
import { CardGroup } from '../models/cardGroup.model';

import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { ModalManager } from 'ngb-modal';
import { firestore } from 'firebase';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-card-board',
  templateUrl: './card-board.component.html'
})
export class CardBoardComponent implements OnInit {

  @ViewChild('addCardGroupModal') addCardGroupModal;
  private modalRef;
  cardTitle: FormControl;
  cardDate: FormControl;

  cardGroups: CardGroup[];

  faPlus = faPlus;
  today: string;

  constructor(public cardGroupService: CardGroupService, private modalService: ModalManager) { }

  ngOnInit() {
    this.today = new Date().toISOString().substr(0, 10);
    this.cardTitle = new FormControl('', Validators.required);
    this.cardDate = new FormControl('', Validators.required);
    this.cardGroupService.getCardGroups().subscribe(data => {
      this.cardGroups = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as CardGroup;
      })
      this.cardGroups.sort((d1, d2) => d1.dueDate.toMillis() - d2.dueDate.toMillis());
    });
  }

  openAddCardGroupModal() {
    this.modalRef = this.modalService.open(this.addCardGroupModal, {
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
    this.resetModalFormControls()
  }

  closeAddCardGroupModal() {
    this.modalService.close(this.addCardGroupModal);
    this.resetModalFormControls()
  }

  addCardGroup() {
    if (this.cardDate.valid && this.cardTitle.valid) {
      var cardGroup = new CardGroup;
      cardGroup.title = this.cardTitle.value;
      cardGroup.dueDate = firestore.Timestamp.fromMillis(Date.parse(this.cardDate.value));
      this.cardGroupService.addCardGroup(cardGroup);
      this.closeAddCardGroupModal();
      this.cardDate.reset()
      this.cardTitle.reset()
    } else {
      this.cardDate.markAsTouched();
      this.cardTitle.markAsTouched();
    }
  }

  resetModalFormControls() {
    this.cardDate.reset()
    this.cardTitle.reset()
  }



}
