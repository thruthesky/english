import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { App } from '../../../providers/app';

import { FindIdModal } from '../find-id/find-id';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password';
import { RegisterComponent } from '../register/register';

import {
    User,
    _RESPONSE, 
    _USER_LOGIN,
    _USER_LOGIN_RESPONSE
} from 'angular-backend';

@Component({
    selector: 'login-component',
    templateUrl: 'login.html',
    styleUrls: ['login.scss']
})

export class LoginModal implements OnInit {
    loading: boolean = false;
    result: _RESPONSE = <_RESPONSE> {};
    saveid:boolean = false;
    form: FormGroup;
    constructor( 
      public activeModal  : NgbActiveModal,
      private app: App,
      private modal: NgbModal,
      private fb: FormBuilder,
      private user : User ){ this.createForm(); }
  createForm() {
    this.form = this.fb.group({
        id:['',[ Validators.required]],
        password:['',[ Validators.required]]
    });
  }
  onClickDismiss(){
    this.activeModal.close('close');
  }


  onClickForgotPassword(){
      this.activeModal.close();
      this.modal.open( ForgotPasswordComponent )
  }

  onClickFindId(){
      this.activeModal.close();
      this.modal.open( FindIdModal );
  }
  

  onClickRegister(){
      this.activeModal.close();
      this.modal.open( RegisterComponent );
  }

  ngOnInit(){
      let id = localStorage.getItem('saveid');
      if( id ) {
          this.form['id'] = id;
          this.saveid = true;
      }
  }
  onClickLogin(){
    if ( this.validate() == false ) return;
    let loginData = this.form.value;
    this.loading = true;
    this.user.login( loginData ).subscribe( ( res: _USER_LOGIN_RESPONSE ) => {
        this.success( res );
    }, error => {

        this.error( error );
    });
  }


  success( res: _USER_LOGIN_RESPONSE) {

    this.loading = false;
    this.activeModal.close('success');
  }

  error( error ) {
    this.loading = false;
    this.result = error;
    return this.user.errorResponse( error );

  }

  onEnterLogin(event){
       if( event.keyCode == 13){
           this.onClickLogin();
       }
  }

  validate(){
    let loginData = this.form.value;
    if( loginData.id && loginData.id.match(/[.#$\[\]]/g) ) return this.errorResult(' valid id ');
    if( ! loginData.id ) return this.errorResult( 'id ' );
    if( ! loginData.password ) return this.errorResult( 'password ' );
    return true;
  }

  errorResult ( name ) {
       this.result = <any>{ message: name + "is required ..." };
       return false;
  }
  validateError( name ) {
      this.app.alert( name + ' is required ...' );
      return false;
  }
}