import { Component, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../../../../angular-backend/model/user';
import { App } from '../../../../../providers/app';
@Component({
    selector: 'pl-small-header-component',
    templateUrl: 'pl-small-header.html',
    styleUrls: ['./pl-small-header.scss']
})
export class PlSmallHeaderComponent {
    event:any = {};
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
}