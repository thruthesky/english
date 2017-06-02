import { Component } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {RegisterComponent} from "../register/register";

@Component({
  selector: 'required-info-component',
  templateUrl: 'required-info.html'
})
export class RequiredInfoComponent {


  constructor(
    public activeModal: NgbActiveModal,
    private modal      : NgbModal
  ) {

  }
  onClickDismiss(){
    this.activeModal.close();
  }

  onClickUpdate() {
    this.modal.open ( RegisterComponent, { windowClass: 'enhance-modal' } );
    this.activeModal.close('close::toUpdate');
  }



}
