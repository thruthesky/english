import { Injectable } from '@angular/core';
import {ModalDismissReasons, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { ConfirmContent } from './confirm-content';

export interface CONFIRM_OPTION {
  title: string;
  content: string;
  confirm: string;
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
    this.modalRef.componentInstance['confirm'] = option.confirm;
    this.modalRef.componentInstance['cancel'] = option.cancel;

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

  openConfirmModal( option , resultCallback?: (result) => void, dismissCallback?: (reason) => void ) {
    let modalOption = {};
    if (option.class) modalOption['windowClass'] = option.class;
    else modalOption['windowClass'] = 'enhance-modal';
    modalOption['backdrop'] = false;

    this.modalRef = this.modalService
      .open( ConfirmContent, modalOption );

    if ( option.title ) this.modalRef.componentInstance['title'] = option.title;
    if ( option.content ) this.modalRef.componentInstance['content'] = option.content;
    if ( option.confirm ) this.modalRef.componentInstance['confirm'] = option.confirm;
    if ( option.cancel ) this.modalRef.componentInstance['cancel'] = option.cancel;

    this.modalRef.result.then((result) => {
      if ( resultCallback ) resultCallback( result );
    }, (reason) => {
      if ( dismissCallback ) dismissCallback( this.getDismissReason( reason ) );
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

}
