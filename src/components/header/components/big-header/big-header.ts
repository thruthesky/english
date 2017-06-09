import { Component, Input, Output, EventEmitter } from '@angular/core';
import { User } from 'angular-backend';
import { App } from '../../../../providers/app';
import { LMS } from './../../../../providers/lms';
import { ShareService } from '../../../../providers/share-service';
@Component({
    selector: 'big-header-component',
    templateUrl: 'big-header.html',
    styleUrls: ['big-header.scss']
})
export class BigHeaderComponent {
    more: boolean = false;
    @Input() login: boolean;
    @Output() logout = new EventEmitter(); // @todo ambiguious, where does it go?
    @Output() onLogin = new EventEmitter();
    @Output() register = new EventEmitter();
    @Output() profile = new EventEmitter();
    @Output() classroom = new EventEmitter();
    constructor(
        public user: User,
        public app: App,
        public share: ShareService,
        public lms: LMS
    ) {

    }

    ngOnInit() {
      this.app.initializeNaverLogin();
    }


    onClickVe() {
        this.lms.openVe();
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
