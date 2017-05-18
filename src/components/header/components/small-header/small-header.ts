import { Component, Input, Output, EventEmitter } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { User, _USER_LOGIN_RESPONSE, _USER_CREATE } from 'angular-backend';
import { App } from '../../../../providers/app';
@Component({
    selector: 'small-header-component',
    templateUrl: 'small-header.html',
    styleUrls: ['small-header.scss']
})
export class SmallHeaderComponent {
    event:any = {};
    more: boolean = false;
    @Input() login: boolean;
    @Output() logout = new EventEmitter();
    @Output() onLogin = new EventEmitter();
    @Output() register = new EventEmitter();
    @Output() profile = new EventEmitter();
    @Output() classroom = new EventEmitter();
    constructor(
        public afAuth: AngularFireAuth,
        public user: User,
        public app: App
    ) {
        // this.onClickMoreMenu();
    }

    onClickLogout(){
        this.logout.emit();
    }
    onClickUpdateProfile(){
        this.profile.emit();
    }


    onClickMoreMenu() {
        this.more = ! this.more;
    }
    onClickPanelMenu( name ) {
        this.more = false;
        this.app.scrollTo( name );
    }
    onClickLogin(){
        this.onLogin.emit();
    }
    onClickGotoClassRoom(){
        this.classroom.emit();
    }

    onClickRegister() {
        this.register.emit();
    }


    onClickLoginWithFacebook() {
        this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
            .then(() => this.successHandler())
            .catch(e => this.errorHandler(e));
    }



    successHandler() {
        console.log("Social login success => Going to login to backend()");
        this.backendLogin(r => this.backendSuccess(r), e => this.backendFailed(e));
    }
    backendSuccess(res: _USER_LOGIN_RESPONSE) {
        console.log("Backend login or register success: " + res);
        this.app.renderPage();
        //this.router.navigateByUrl('/');
    }
    backendFailed(e) {
        console.log("Backend login failed.");
        let user = this.app.getSocialLogin();
        let id = user.uid + '@' + user.providerId;
        if (e['code'] == -40102) {              // user not exists ==> register
            console.log("User not exists. going to register.");
            this.backendRegister(r => this.backendSuccess(r), e => this.backendFailed(e));
        }
        else {
            alert( this.user.getErrorString(e) );
        }
    }


    backendLogin(success, fail) {
        let user = this.app.getSocialLogin();
        console.log("login success => going to log in backend: ", user);
        let id = user.uid + '@' + user.providerId;
        // login
        this.user.logout();
        this.user.login({ id: id, password: id }).subscribe(success, fail);
    }

    backendRegister(success, fail) {
        let user = this.app.getSocialLogin();
        let id = user.uid + '@' + user.providerId;
        let req: _USER_CREATE = {
            id: id,
            password: id,
            email: user.email,
            name: user.displayName
        };
        this.user.register( req ).subscribe( r => this.backendSuccess(r), e => this.backendFailed(e) );
    }



    errorHandler(e) {
        console.log('error: ', e);
        // this.error = e.message;
        // this.app.zoneRun();
    }


}