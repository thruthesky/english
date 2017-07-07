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
      <button type="button" class="btn btn-secondary border-0 rounded-0 black pointer" (click)="activeModal.close('confirm')">오늘 하루 보이지 않기</button>
      <button type="button" class="btn btn-secondary  border-0 rounded-0 black pointer" (click)="activeModal.dismiss('cancel')">닫기 <i class="fa fa-times"></i></button>
    </div>
  `
})
export class AnnouncementContent {

  content: string = '';
  constructor(public activeModal: NgbActiveModal) {}
}


