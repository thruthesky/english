import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'announcement-content',
  templateUrl: './announcement.html',
  styles: [`
    .modal-close {
      position: absolute;
      top: 0;
      right: 0;
      cursor: pointer;
    }
  `]
})
export class AnnouncementContent {

  content: string = '';
  constructor(public activeModal: NgbActiveModal) {}
}


