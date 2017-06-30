import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ReminderContent } from './reminder-content';

export interface REMINDER_OPTION {
  title: string;
  content: string;
  'class'?: string;
  timeout?: number;
}

@Injectable()
export class Reminder {
  modalRef = null;
  constructor(private modalService: NgbModal) {
  }

  open( option: REMINDER_OPTION, yesCallback?, noCallback?): NgbModalRef {

    if ( this.modalRef ) this.modalRef.close();
    let modalOption = {};
    if (option.class) modalOption['windowClass'] = option.class;
    else modalOption['windowClass'] = 'enhance-modal';
    modalOption['backdrop'] = false;
    //modalOption['size'] = 'lg';
    this.modalRef = this.modalService
      .open( ReminderContent, modalOption);

    this.modalRef.componentInstance['title'] = option.title;
    this.modalRef.componentInstance['content'] = option.content;

    this.modalRef.result.then((result) => {
      if (yesCallback) yesCallback(result);
    }, (reason) => {
      if (noCallback) noCallback(reason);
    });


    if ( option.timeout ) {
      setTimeout(() => {
        this.modalRef.close();
      }, option.timeout);
    }

    return this.modalRef;
  }

}
