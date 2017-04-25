import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { User, _USER_PASSWORD_CHANGE, _USER_PASSWORD_CHANGE_RESPONSE } from '../../../angular-backend/angular-backend';
@Component({
    selector: 'change-password-component',
    templateUrl: 'change-password.html',
    styleUrls: ['change-password.scss']
})

export class ChangePasswordComponent{
    formGroup: FormGroup;
    constructor( private activeModal : NgbActiveModal,
                 private fb: FormBuilder,
                 private user: User  ){}
    
    ngOnInit() {
        this.createForm();
    }
    createForm() {
        this.formGroup = this.fb.group({
            old_password:[],
            new_password:[]
        });
    }
    onClickCancel() {
        console.log("Change Password Click Cancel");
    }
    onClickDismiss() {
        this.activeModal.close();
    }
    onClickChangePassword() {
        let req: _USER_PASSWORD_CHANGE = {
            old_password: this.formGroup.get('old_password').value,
            new_password:this.formGroup.get('new_password').value
        };
        this.user.changePassword( req ).subscribe( ( res: _USER_PASSWORD_CHANGE_RESPONSE ) => {
            console.log("Change Password Success");
            this.activeModal.close();
        }, err => this.user.alert( err ));
    }
    onEnterChangePassword( event ){
        if( event.keyCode == 13 ) this.onClickChangePassword();
    }
}