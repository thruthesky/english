import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'confirm-content',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">{{ title }}</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <!--<i class="fa fa-warning" aria-hidden="true"></i>-->
      {{ content }}
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="activeModal.close('confirm')">{{confirm}}</button>
      <button type="button" class="btn btn-secondary" (click)="activeModal.dismiss('cancel')">{{cancel}}</button>
    </div>
  `
})
export class ConfirmContent {
  title: string = 'Modal Title !';
  content: string = 'Modal Content';
  confirm: string = 'Submit';
  cancel: string = 'Cancel';
  constructor(public activeModal: NgbActiveModal) {}
}


