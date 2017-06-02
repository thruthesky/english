import { Component } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {RegisterComponent} from "../register/register";
import {_USER_DATA_RESPONSE, _USER_RESPONSE, User} from "angular-backend";

@Component({
  selector: 'required-info-component',
  templateUrl: 'required-info.html'
})
export class RequiredInfoComponent {



  userData: _USER_RESPONSE = null;
  constructor(
    public user: User,
    public activeModal: NgbActiveModal,
    private modal      : NgbModal
  ) {

  }
  onClickDismiss(){
    this.activeModal.close();
  }

  onClickUpdate() {
    // this.modal.open ( RegisterComponent, { windowClass: 'enhance-modal' } );
    // this.activeModal.close('close::toUpdate');

  }

  loadUserData() {
    this.user.data().subscribe( (res: _USER_DATA_RESPONSE) => {
      this.userData = res.data.user;
    }, error => {
      this.user.alert( error );
    } );
  }


}
