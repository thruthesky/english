import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User, _USER_PASSWORD_CHANGE, _USER_PASSWORD_CHANGE_RESPONSE } from 'angular-backend';
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
        this.formGroup.valueChanges
            .debounceTime( 1000 )
            .subscribe( res => this.onValueChanged( res ) );
    }
    createForm() {
        this.formGroup = this.fb.group({
            old_password:['', [ Validators.required ] ],
            new_password:['', [ Validators.required ] ]
        });
    }
    onClickCancel() {
        this.activeModal.close();
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
            this.activeModal.close();
        }, err => this.user.alert( err ));
    }
    onEnterChangePassword( event ){
        if( event.keyCode == 13 ) this.onClickChangePassword();
    }
    onValueChanged(data?: any) {
        if ( ! this.formGroup ) return;
        const form = this.formGroup;
        for ( const field in this.formErrors ) {
        this.formErrors[field] = '';        // clear previous error message (if any)
        const control = form.get(field);
          if ( control && control.dirty && ! control.valid ) {
              const messages = this.validationMessages[field];
              for ( const key in control.errors ) {
              this.formErrors[field] += messages[key] + ' ';
              }
          }
        }
    }
    formErrors = {
        old_password: '',
        new_password: ''
    };
    validationMessages = {
        old_password: {
            'required':      'Old Password is required.'
        },
        new_password: {
            'required':      'New Password is required.'
        }
    };
}