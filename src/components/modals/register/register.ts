import { Component } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { App } from '../../../providers/app';

import { LMS } from '../../../providers/lms';
import { ChangePasswordComponent } from '../change-password/change-password';

import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';

import {
    User,
    File,
    _USER_CREATE,
    _USER_EDIT,
    _RESPONSE,
    _USER_RESPONSE,
    _USER_DATA_RESPONSE,
    _USER_CREATE_RESPONSE,
    _USER_EDIT_RESPONSE,
    _DELETE_RESPONSE
} from 'angular-backend';
@Component({
    selector:'register-component',
    templateUrl: 'register.html',
    styleUrls: ['register.scss']
})

export class RegisterComponent {
    login: boolean = false;
    result: _RESPONSE = <_RESPONSE> {};
    loading     : boolean = false;
    userData: _USER_RESPONSE = null;
    primary_photo_idx: number = null;
    form: FormGroup;
    constructor (
        private app          : App,
        private activeModal  : NgbActiveModal,
        private lms          : LMS,
        public  user         : User,
        private file         : File,
        private fb           : FormBuilder,
        private modal: NgbModal,
    ) {
        if ( this.user.logged ) this.loadUserData();

        this.form = fb.group({
            name: [ '', [ Validators.required, Validators.minLength(3), Validators.maxLength(32) ] ],
            email: [ '', [ Validators.required, this.emailValidator ] ],
            nickname: [],
            mobile: [],
            birthday: [],
            gender: [],
            id: [],
        });

        if ( ! this.user.logged ) {
            this.form.addControl( 'id', new FormControl('', [ Validators.required, Validators.minLength(3), Validators.maxLength(32)] ) );
            this.form.addControl( 'password', new FormControl('', [ Validators.required, Validators.minLength(5), Validators.maxLength(128)] ) );
        }
        
        this.form.valueChanges
            .debounceTime( 1000 )
            .subscribe( res => this.onValueChanged( res ) );
    }
    onClickChangePasswordr(){
        this.activeModal.close();
        this.modal.open( ChangePasswordComponent );
    }
    onChangeFileUpload( fileInput ) {
        let file = fileInput.files[0];
        this.file.uploadPrimaryPhoto( file ).subscribe(res => {
            this.primary_photo_idx = res.data.idx;
        }, err => {
            this.file.alert(err);
        });
    }

  
    onEnterRegister(event){
        if( event.keyCode == 13){
            if( this.user.logged ) this.updateProfile( callback => this.updateLMSprofile() );
            else this.register( callback => this.lmsRegister() );
        }
    }

    onClickDismiss() {
        this.activeModal.close();
    }

    onClickRegister() {
        this.register( callback => this.lmsRegister() );


    }
    onClickUpdate() {
        this.updateProfile( callback => this.updateLMSprofile() );
    }

    onValueChanged(data?: any) {
        if ( ! this.form ) return;
        const form = this.form;
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
    loadUserData() {
        this.loading = true;
        this.user.data().subscribe( (res: _USER_DATA_RESPONSE) => {
            this.getDataSuccess( res );
        }, error => {
            this.error( error );
        } );
    }
    register( callback? ) {
        this.loading = true;
        let register = <_USER_CREATE> this.form.value;
        register.file_hooks = [ this.primary_photo_idx ];
        if( register['birthday']) {
            let date = this.splitBirthday( register['birthday']);
            delete register['birthday'];
            register.birth_year = date[0];
            register.birth_month = date[1];
            register.birth_day = date[2];
        }
        this.user.register( register ).subscribe( (res: _USER_CREATE_RESPONSE ) => {
            //this.successRegister( res );
            callback();
        }, error => {
            this.error( error );
        } );

    }    

    getDataSuccess( res:any ) {
        try {
            console.log(res);
            this.userData = res.data.user;
            this.form.patchValue( this.userData );
            console.log("chemy chemy:",this.form.value);
            let birthday = this.getConcatBirthdate();
            this.form.patchValue( {birthday:birthday});
            this.primary_photo_idx = this.userData.primary_photo.idx;
        }catch(e){

        }
        
    }
    getConcatBirthdate( ) {
        if( this.userData.birth_month.length < 2 ) this.userData.birth_month = "0"+ this.userData.birth_month;
        if( this.userData.birth_day.length < 2 ) this.userData.birth_day = "0"+ this.userData.birth_day;
        return this.userData.birth_year + "-" + this.userData.birth_month + "-" +this.userData.birth_day;
    }
    successRegister( res: _USER_CREATE_RESPONSE) {

        console.log("user register success: ", res );
        this.loading = false;
        this.activeModal.close();
    }

    error( error ) {
        this.loading = false;
        this.result = error;
        console.log( this.result );
        return this.user.errorResponse( error );
    }

    lmsRegister(){
        this.lms.register( this.form, res =>{
            console.log(' registered on centerX ' + res );
            this.activeModal.close();
        }, error => console.error(' error on registration ' + error ) )
    }

    splitBirthday( date ) {
        if( date )
        {
            let newdate = date.split("-");
            return newdate;
        }
    }

    updateProfile( callback? ){
        this.loading = true;
        let edit = <_USER_EDIT> this.form.value;
        delete edit['password'];
        let date = this.splitBirthday( edit['birthday']);
        delete edit['birthday'];
        edit.birth_year = date[0];
        edit.birth_month = date[1];
        edit.birth_day = date[2];
        this.user.edit( edit ).subscribe( (res: any) => {
            callback();
            this.successUpdate( res );
        }, error => {
            this.error( error );
        } );
    }
    onClickDeletePhoto() {
        console.log("FileFormComponent::onClickDeleteFile(file): ", this.primary_photo_idx);

        this.file.delete( this.primary_photo_idx).subscribe( (res:_DELETE_RESPONSE) => {
            console.log("file delete: ", res);
            this.primary_photo_idx = <any> {};
        }, err => this.file.alert(err) );
    }
    successUpdate( res: _USER_EDIT_RESPONSE) {

        console.log("user update success: ", res );
        this.loading = false;
        this.activeModal.close();
    }
    updateLMSprofile(){
        this.lms.update( this.form , res =>{
            console.log(' lms user updated ' + res );
            this.activeModal.close();
        }, err =>{})
    }


    validateError( name ) {
        this.app.alert( name + ' is required ...' );
        return false;
    }
    emailValidator(c: AbstractControl): { [key: string]: any } {
    if ( c.value.length < 8 ) {
      return { 'minlength' : '' };
    }
    if ( c.value.length > 64 ) {
      return { 'maxlength' : '' };
    }
    let re = new RegExp( /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/ ).test( <string> c.value );
    if ( re ) return;
    else return { 'malformed': '' };
  }

  formErrors = {
    id: '',
    password: '',
    name: '',
    email: ''
  };
  validationMessages = {
    id: {
      'required':      'ID is required.',
      'minlength':     'ID must be at least 3 characters long.',
      'maxlength':     'ID cannot be more than 32 characters long.'
    },
    name: {
      'required':      'Name is required.',
      'minlength':     'Name must be at least 3 characters long.',
      'maxlength':     'Name cannot be more than 32 characters long.'
    },
    password: {
      'required': 'Password is required.',
      'minlength':     'Password must be at least 5 characters long.',
      'maxlength':     'Password cannot be more than 128 characters long.'
    },
    email: {
      'required':     'Email is required.',
      'minlength':     'Email must be at least 8 characters long.',
      'maxlength':     'Email cannot be more than 32 characters long.',
      'malformed':    'Email must be in valid format. valudator error'
    }
    
  };

}