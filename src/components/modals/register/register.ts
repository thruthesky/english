import { Component } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
//import { App } from '../../../providers/app';
import { user_profile } from '../../../app/config';
import { FirebaseChat } from '../../../providers/firebase';

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

    user_profile = user_profile;
    constructor (
        private activeModal  : NgbActiveModal,
        private lms          : LMS,
        public  user         : User,
        public  file          : File,
        private fb           : FormBuilder,
        private fc           : FirebaseChat,
        private modal: NgbModal,
    ) {
        this.form = fb.group({
            name:     [ '', [ Validators.required, Validators.minLength(3), Validators.maxLength(32) ] ],
            email:    [ '', [ Validators.required, this.emailValidator ] ],
            nickname: [ '', [ Validators.required ] ],
            mobile:   [ '', [ Validators.required, this.mobileValidator ] ],
            id:       [ '', [ Validators.required ] ],
        });

        if ( ! this.user.logged ) {
            this.form.addControl( 'password', new FormControl('', [ Validators.required, Validators.minLength(5), Validators.maxLength(128)] ) );
        }
        if ( this.user.logged ) this.loadUserData();
        this.form.valueChanges
            .debounceTime( 1000 )
            .subscribe( res => this.onValueChanged( res ) );
    }

    getUserId( id ) {
        if ( /\@naver\.com$/.test( id ) ) id = `네이버 로그인`;
        else if ( /\@kakaotalk\.com$/.test( id ) ) id = `카카오톡 로그인`;
        else if ( /\@facebook\.com$/.test( id ) ) id = `페이스북 로그인`;
        return id;
    }
    onClickChangePassword(){
        this.activeModal.close();
        this.modal.open( ChangePasswordComponent, { windowClass: 'enhance-modal' } );
    }
    onChangeFileUpload( fileInput ) {
        this.loading = true;
        let file = fileInput.files[0];
        this.file.uploadPrimaryPhoto( file ).subscribe(res => {
            this.primary_photo_idx = res.data.idx;
            this.loading = false;
        }, err => {
            this.loading = false;
            this.file.alert(err);
        });
    }


    onEnterRegister(event){
        if( event.keyCode == 13){
            if( this.user.logged ) this.onClickUpdate();
            else this.onClickRegister();
        }
    }

    onClickRegister() {
        this.register( callback => this.lmsRegister() );
    }
    onClickUpdate() {
        this.updateProfile( callback => this.updateLMSprofile() );
    }


    onClickDismiss() {
        this.activeModal.close();
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
        let msg = {
          id: register.id,
          email: register.email,
          name: register.name
        };
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
            this.fc.newRegisteredUser( msg );
            callback();
        }, error => {
            this.error( error );
        } );

    }

    getDataSuccess( res:any ) {
        try {
            console.log(res);
            this.userData = res.data.user;
            this.form.patchValue( {
                id: this.userData.id,
                name:this.userData.name,
                nickname:this.userData.nickname,
                mobile:this.userData.mobile,
                email:this.userData.email?this.userData.email:''
            } );
            let birthday = this.getConcatBirthdate();
            if( birthday )this.form.patchValue( {birthday:birthday});
            this.primary_photo_idx = this.userData.primary_photo.idx;
            this.loading = false;
        }catch(e){
            console.log(e);
        }

    }
    getConcatBirthdate( ) {
        if ( ! this.userData.birth_year ) return '';
        if ( ! this.userData.birth_month ) return '';
        if ( ! this.userData.birth_day ) return '';
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

    lmsRegister() {
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
        console.log("Hello World:",edit);
        delete edit['password'];
        if( edit['birthday']) {
        let date = this.splitBirthday( edit['birthday']);
            delete edit['birthday'];
            edit.birth_year = date[0];
            edit.birth_month = date[1];
            edit.birth_day = date[2];
        }
        this.user.edit( edit ).subscribe( (res: any) => {
            callback();
            this.successUpdate( res );

        }, error => {
            this.error( error );
        } );
    }
    onClickDeletePhoto() {
        console.log("FileFormComponent::onClickDeleteFile(file): ", this.primary_photo_idx);
        this.loading = true;
        this.file.delete( this.primary_photo_idx).subscribe( (res:_DELETE_RESPONSE) => {
            console.log("file delete: ", res);
            this.primary_photo_idx = null;
            this.loading = false;
        }, err => {
            this.loading = false;
            this.file.alert(err)
        });
    }
    successUpdate( res: _USER_EDIT_RESPONSE) {
        if( res.data.admin == 1) this.user.deleteSessionInfo();
        this.loading = false;
        // this.activeModal.close();
    }
    updateLMSprofile(){
        this.lms.update( this.form , res =>{
            console.log(' lms user updated ' + res );
            this.activeModal.close();
            // alert("Update Success");
        }, err =>{})
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

    mobileValidator(c: AbstractControl): { [key: string]: any } {
        if ( c.value.length < 9 ) {
        return { 'minlength' : '' };
        }
        if ( c.value.length > 15 ) {
        return { 'maxlength' : '' };
        }
        let re = new RegExp( /^(\d+-?)+\d+$/ ).test( <string> c.value );
        if ( re ) return;
        else return { 'malformed': '' };
    }
  formErrors = {
    id: '',
    password: '',
    name: '',
    nickname: '',
    email: '',
    mobile: ''
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
    nickname: {
      'required':      'Nick Name is required.',
      'minlength':     'Nick Name must be at least 3 characters long.',
      'maxlength':     'Nick Name cannot be more than 32 characters long.'
    },
    password: {
      'required': 'Password is required.',
      'minlength':     'Password must be at least 5 characters long.',
      'maxlength':     'Password cannot be more than 128 characters long.'
    },
    email: {
      'required':     'Email is required.',
      'minlength':    'Email must be at least 8 characters long.',
      'maxlength':    'Email cannot be more than 32 characters long.',
      'malformed':    'Email must be in valid format. validator error'
    },
    mobile: {
      'required':     'Mobile is required.',
      'minlength':    'Mobile must be at least 9 characters long.',
      'maxlength':    'Mobile cannot be more than 15 characters long.',
      'malformed':    'Mobile must be in valid format. validator error'
    }

  };
}
