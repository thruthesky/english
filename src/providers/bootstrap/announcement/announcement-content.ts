import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'announcement-content',
  template: `
    <!--<div class="modal-header">-->
      <!--<h4 class="modal-title">{{ title }}</h4>-->
      <!--<button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">-->
        <!--<span aria-hidden="true">&times;</span>-->
      <!--</button>-->
    <!--</div>    -->
    <div class="modal-body">
      <img class="w-100" src="{{content}}">
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="activeModal.close('confirm')">Dont Show</button>
      <button type="button" class="btn btn-secondary" (click)="activeModal.dismiss('cancel')">Close</button>
    </div>
  `
})
export class AnnouncementContent {

  content: string = '';
  constructor(public activeModal: NgbActiveModal) {}
}


