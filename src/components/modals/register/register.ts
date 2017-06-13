import { Component } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
    userData: _USER_RESPONSE = null;
    primary_photo_idx: number = null;
    form: FormGroup;

    showRequiredError: boolean = false;
    checkRequired:boolean = false;

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
        let file = fileInput.files[0];
        this.file.uploadPrimaryPhoto( file ).subscribe(res => {
            this.primary_photo_idx = res.data.idx;
        }, err => {
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
        this.formErrors[field] = '';
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
        this.user.data().subscribe( (res: _USER_DATA_RESPONSE) => {
          if( res.code == 0 ) {
            this.getDataSuccess( res );
            this.checkRequiredErrorMessage( res.data.user );
          }
        }, error => {
            this.error( error );
        } );
    }
    register( callback? ) {
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
            this.fc.newRegisteredUser( msg );
            callback();
        }, error => {
            this.error( error );
        } );

    }

    checkRequiredErrorMessage( user ) {
      if( ! user.name || ! user.nickname || !user.mobile || ! user.email ) {
        this.showRequiredError = true;
      }
      else if( this.checkRequired && ! this.showRequiredError) {
        this.activeModal.close();
      }
    }

    getDataSuccess( res:any ) {
        try {
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
        }catch(e){
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
        this.activeModal.close();
    }

    error( error ) {
        if ( error.code == -40101 ) error.message = "아이디가 이미 존재합니다. 다른 아이디를 선택하십시오.";
        this.result = error;
        return this.user.errorResponse( error );
    }

    lmsRegister() {
        this.lms.register( this.form, res =>{
            this.activeModal.close();
        }, error => alert(' error on registration ' + error ) )
    }

    splitBirthday( date ) {
        if( date )
        {
            let newdate = date.split("-");
            return newdate;
        }
    }

    updateProfile( callback? ){
        let edit = <_USER_EDIT> this.form.value;
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
        this.file.delete( this.primary_photo_idx).subscribe( (res:_DELETE_RESPONSE) => {
            this.primary_photo_idx = null;
        }, err => {
            this.file.alert(err)
        });
    }
    successUpdate( res: _USER_EDIT_RESPONSE) {
        if( res.data.admin == 1) this.user.deleteSessionInfo();
    }
    updateLMSprofile(){
        this.lms.update( this.form , res =>{
            this.activeModal.close();
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
      'required':      '아이디를 입력하십시오.',
      'minlength':     '아이디는 3 글자 이상이어야 합니다.',
      'maxlength':     '아이디는 32 글자 이하이어야 합니다.'
    },
    name: {
      'required':      '이름을 입력하십시오.',
      'minlength':     '이름은 3 글자 이상이어야 합니다.',
      'maxlength':     '이름은 32 글자 이하이어야 합니다.'
    },
    nickname: {
      'required':      '닉네임을 입력하십시오.',
      'minlength':     '닉에임은 3 글자 이상이어야 합니다.',
      'maxlength':     '닉네임은 32 글자 이하이어야 합니다.'
    },
    password: {
      'required': '비밀번호를 입력하십시오.',
      'minlength':     '비밀번호는 3 글자 이상이어야 합니다.',
      'maxlength':     '비밀번호는 128 글자 이하이어야 합니다.'
    },
    email: {
      'required':     '이메일을 입력하십시오.',
      'minlength':    '이메일은 8 글자 이상이어야 합니다.',
      'maxlength':    '이메일은 32 글자 이하이어야 합니다.',
      'malformed':    '잘못된 형식의 메일 주소입니다.'
    },
    mobile: {
      'required':     '전화번호를 입력하십시오.',
      'minlength':    '전화번호는 숫자 8 자리 이상이어야 합니다.',
      'maxlength':    '전화번호는 숫자 15 자리 이하이어야 합니다.',
      'malformed':    '잘못된 전화번호 형식입니다.'
    }

  };
}
