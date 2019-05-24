import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { CardGroup } from '../models/cardGroup.model';
import { StepService } from '../services/step.service';
import { Step } from '../models/step.model';
import { faPlus, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { ModalManager } from 'ngb-modal';
import { FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-card-group',
  templateUrl: './card-group.component.html'
})
export class CardGroupComponent implements OnInit {
  @Input() cardGroup: CardGroup;
  steps: Step[];

  @ViewChild('addStepModal') addStepModal;
  private modalRef;
  stepTitle: FormControl;

  faPlus = faPlus;
  faSortDown = faSortDown;

  onlyCardGroupTitleBarVisible: boolean;

  constructor(public stepService: StepService, private modalService: ModalManager) { }

  ngOnInit() {
    this.onlyCardGroupTitleBarVisible = true;
    this.stepTitle = new FormControl('', Validators.required);
    this.stepService.getSteps(this.cardGroup.id).subscribe(data => {
      this.steps = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Step
      })
      this.steps.sort((step1, step2) => {
        return step1.date.toMillis() - step2.date.toMillis();
      })
    })
  }

  getCardGroupVisibility(): boolean {
    return this.onlyCardGroupTitleBarVisible;
  }

  switchCardGroupVisibility() {
    this.onlyCardGroupTitleBarVisible = !this.onlyCardGroupTitleBarVisible;
  }

  openAddStepModal() {
    this.stepTitle.reset();
    this.modalRef = this.modalService.open(this.addStepModal, {
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

  closeAddStepModal() {
    this.stepTitle.reset();
    this.modalService.close(this.addStepModal);
  }

  addStep() {
    if (this.stepTitle.valid) {
      var newStep = new Step();
      newStep.name = this.stepTitle.value;
      this.stepService.addStep(this.cardGroup.id, newStep);
      this.modalService.close(this.addStepModal);
      this.stepTitle.reset();
    } else {
      this.stepTitle.markAsTouched()
    }
  }
}
