import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmContent } from './confirm-content';

export interface CONFIRM_OPTION {
  title: string;
  content: string;
  submit: string;
  cancel: string;
  'class'?: string;
  timeout?: number;
}

@Injectable()
export class Confirm {
  modalRef = null;
  constructor(private modalService: NgbModal) {
  }

  open( option: CONFIRM_OPTION, yesCallback?: () => void, noCallback?: () => void): NgbModalRef {

    if ( this.modalRef ) this.modalRef.close();
    let modalOption = {};
    if (option.class) modalOption['windowClass'] = option.class;
    else modalOption['windowClass'] = 'enhance-modal';
    modalOption['backdrop'] = false;
    this.modalRef = this.modalService
      .open( ConfirmContent, modalOption);

    this.modalRef.componentInstance['title'] = option.title;
    this.modalRef.componentInstance['content'] = option.content;

    this.modalRef.result.then((result) => {
      if (yesCallback) yesCallback();
    }, (reason) => {
      if (noCallback) noCallback();
    });


    if ( option.timeout ) {
      setTimeout( () => {
        this.modalRef.close();
      }, option.timeout);
    }
    return this.modalRef;
  }

}
