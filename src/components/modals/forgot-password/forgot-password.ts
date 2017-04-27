import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'forgotpassword-component',
    templateUrl: 'forgot-password.html'
})

export class ForgotPasswordComponent{


    email: string;
    constructor( 
        private activeModal : NgbActiveModal
        ){}
    onClickDismiss(){
        this.activeModal.close();
    }

    /**
     * @description: user needs to provide valid registered email.
     */

    onClickResetPassword(){
    }
}