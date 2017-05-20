import { Component, Input, Output, EventEmitter } from '@angular/core';


import * as firebase from 'firebase/app';

import { User, _USER_LOGIN_RESPONSE, _USER_CREATE } from 'angular-backend';
import { App } from '../../../../providers/app';
@Component({
    selector: 'small-header-component',
    templateUrl: 'small-header.html',
    styleUrls: ['small-header.scss']
})
export class SmallHeaderComponent {
    event: any = {};
    more: boolean = false;
    @Input() login: boolean;
    @Output() logout = new EventEmitter();
    @Output() onLogin = new EventEmitter();
    @Output() register = new EventEmitter();
    @Output() profile = new EventEmitter();
    @Output() classroom = new EventEmitter();
    constructor(
        public user: User,
        public app: App
    ) {
        // this.onClickMoreMenu();
    }

    ngOnInit() {
        this.app.initializeNaverLogin();
    }

    onClickLogout() {
        this.logout.emit();
    }
    onClickUpdateProfile() {
        this.profile.emit();
    }


    onClickMoreMenu() {
        this.more = !this.more;
    }
    onClickPanelMenu(name) {
        this.more = false;
        this.app.scrollTo(name);
    }
    onClickLogin() {
        this.onLogin.emit();
    }
    onClickGotoClassRoom() {
        this.classroom.emit();
    }

    onClickRegister() {
        this.register.emit();
    }


}