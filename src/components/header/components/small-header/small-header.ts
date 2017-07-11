import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';

import { User } from 'angular-backend';
import { App } from '../../../../providers/app';
import { LMS } from './../../../../providers/lms';
import {ShareService} from '../../../../providers/share-service';
@Component({
    selector: 'small-header-component',
    templateUrl: 'small-header.html'
})
export class SmallHeaderComponent implements OnInit {
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
        public app: App,
        public lms: LMS,
        public shared: ShareService
    ) {
    }

    ngOnInit() {
        this.app.initializeNaverLogin();
    }

    onClickLogout() {
        this.more = false;
        this.logout.emit();
    }
    onClickUpdateProfile() {
        this.more = false;
        this.profile.emit();
    }


    onClickMoreMenu() {
        this.more = !this.more;
    }
    onClickPanelMenu(name, page = null) {
          this.shared.page = page ? page : 'main';
          this.more = false;
          this.app.scrollTo(name);
    }
    onClickLogin() {
        this.more = false;
        this.onLogin.emit();
    }

    onClickRegister() {
        this.more = false;
        this.register.emit();
    }

    onClickVe() {
        this.more = false;
        this.lms.openVe();
    }

    onClickKakao() {
      window.open('https://open.kakao.com/o/s3H2K1s', '_blank');
    }


}
