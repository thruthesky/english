import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'confirm-content',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">{{ title }}</h4>
      <button type="button" class="close pointer" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <!--<i class="fa fa-warning" aria-hidden="true"></i>-->
      {{ content }}
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary pointer" (click)="activeModal.close('confirm')">{{confirm}}</button>
      <button type="button" class="btn btn-secondary pointer" (click)="activeModal.dismiss('cancel')">{{cancel}}</button>
    </div>
  `
})
export class ConfirmContent {
  title: string = 'Confirm';
  content: string = 'Are you sure?';
  confirm: string = 'Submit';
  cancel: string = 'Cancel';
  constructor(public activeModal: NgbActiveModal) {}
}


