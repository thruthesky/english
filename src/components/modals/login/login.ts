import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { App } from '../../../providers/app';

import { User } from './../../../angular-backend/user';


import { FindIdModal } from '../find-id/find-id';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password';
import { RegisterComponent } from '../register/register';


import {
    RESPONSE, 
    USER_LOGIN,
    USER_LOGIN_RESPONSE
} from './../../../angular-backend/interface';

@Component({
    selector: 'login-component',
    templateUrl: 'login.html'
})

export class LoginModal implements OnInit {
    loading: boolean = false;
    result: RESPONSE = <RESPONSE> {};
    saveid:boolean = false;
    form = <USER_LOGIN> {};
    // form = {};
    constructor( 
      public activeModal  : NgbActiveModal,
      private app: App,
      private modal: NgbModal,
      private user : User
      ){
          // this.onClickLogin();
      }

  onClickDismiss(){
    this.activeModal.close();
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

    this.loading = true;
    this.user.login( this.form ).subscribe( ( res: USER_LOGIN_RESPONSE ) => {
        this.success( res );
    }, error => {

        this.error( error );
    });
  }


  success( res: USER_LOGIN_RESPONSE) {

    this.loading = false;
    this.activeModal.close();
  }

  error( error ) {
    this.loading = false;
    this.result = error;

    console.log( this.result );
    return this.user.errorResponse( error );

  }

  onEnterLogin(event){
       if( event.keyCode == 13){
           this.onClickLogin();
       }
  }

  validate(){
    if( this.form.id && this.form.id.match(/[.#$\[\]]/g)) return this.errorResult(' valid id ');
    if( ! this.form.id )return this.errorResult( 'id ' );
    if( ! this.form.password ) return this.errorResult( 'password ' );
    return true;
  }

  errorResult ( name ) {
       this.result = <any>{message: name + "is required ..."}
       return false;
  }
  validateError( name ) {
      this.app.alert( name + ' is required ...' );
      return false;
  }

}