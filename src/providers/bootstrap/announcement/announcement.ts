import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AnnouncementContent } from './announcement-content';

export interface ANNOUNCEMENT_OPTION {
  content: string;
  'class'?: string;
  timeout?: number;
}

@Injectable()
export class Announcement {
  modalRef = null;
  constructor(private modalService: NgbModal) {
  }

  open( option: ANNOUNCEMENT_OPTION, yesCallback?, noCallback?): NgbModalRef {

    if ( this.modalRef ) this.modalRef.close();
    let modalOption = {};
    if (option.class) modalOption['windowClass'] = option.class;
    else modalOption['windowClass'] = 'enhance-modal';
    modalOption['backdrop'] = true;
    modalOption['size'] = 'lg';
    this.modalRef = this.modalService
      .open( AnnouncementContent, modalOption);

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
