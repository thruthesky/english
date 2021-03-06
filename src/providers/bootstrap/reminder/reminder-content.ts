import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'reminder-content',
  template: `
    <div class="modal-header">
      <h4 class="modal-title p-3">{{ title }}</h4>
    </div>
    <div class="modal-body" [innerHTML]="content"></div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary pointer" (click)="activeModal.close('confirm')">오늘 하루 보이지 않기</button>
      <button type="button" class="btn btn-secondary pointer" (click)="activeModal.dismiss('cancel')">닫기 <i class="fa fa-times"></i></button>
    </div>
  `,
  styles: [`
    .modal-header {
      padding: .4em;
      box-sizing: border-box;
      border-radius: 0;
      background-color: rgba(0, 0, 0, 0.8) !important;
      color: white;
    }
    .modal-title {
      color: white;
    }
    .modal-body {
      padding: .8em;
      line-height: 180%;
      text-align: center;
      white-space:pre-line;
    }

    button {
      border: 0;
      border-radius: 0;
      width: 100%;
      font-weight: 100;
      color: yellow;
      background-color: #6d6d6c!important;
      cursor: pointer;
    }
  `]
})
export class ReminderContent {
  title: string = 'Reminders';
  content: string = '';
  constructor(public activeModal: NgbActiveModal) { }
}


