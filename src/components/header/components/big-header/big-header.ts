import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
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
    @Output() logout = new EventEmitter();
    @Output() onLogin = new EventEmitter();
    @Output() register = new EventEmitter();
    @Output() profile = new EventEmitter();
    @Output() classroom = new EventEmitter();
    @ViewChild('pLogo') pLogo;
    @ViewChild('pMenu') pMenu;
    @ViewChild('pLogin') pLogin;
    @ViewChild('pClass') pClass;
    constructor(
        public user: User,
        public app: App,
        public shared: ShareService,
        public lms: LMS
    ) {

    }

    ngOnInit() {
        // this.app.initializeNaverLogin();
    }

    ngAfterViewInit() {



        if (this.app.firstVisit) {
            setTimeout(() => this.nextHelp('logo'), 3000);
        }
        else if ( ! this.user.logged && this.app.getLoginCount() < 3 ) {
            setTimeout(() => this.pLogin.open(), 2000);
        }

        this.app.loginCount.subscribe(n => {
            //console.log("login count: ", n);
            if (n <= 3) {
                setTimeout(() => this.pClass.open(), 2000);
            }
        });

    }

    nextHelp(name) {
        this.closeAllHelp();
        if (name == 'logo') this.pLogo.open();
        else if (name == 'login') {
            this.pLogin.open();
        }
        else if (name == 'menu') {
            this.pMenu.open();
        }
        else if (name == 'close') { // if user click on close, then no more baloon help show.
            this.app.setVisitCount(5);
            this.app.firstVisit = false;
        }
    }

    closeAllHelp() {
        if (this.pLogo) {
            this.pLogo.close();
            this.pMenu.close();
            this.pLogin.close();
        }
    }

    onClickVe() {
        this.lms.openVe();
    }


    onClickLogout() {

        this.logout.emit();
    }
    onClickUpdateProfile() {
        this.profile.emit();
    }
    onClickMoreMenu() {
        this.more = !this.more;
        this.closeAllHelp();
    }
    onClickPanelMenu(name, page = null) {
        this.shared.page = page ? page : 'main';
        this.more = false;
        this.app.scrollTo(name);
    }
    onClickLogin() {
        setTimeout(() => { if (this.pLogin) this.pLogin.close(); }, 2000);
        this.onLogin.emit();
    }
    // onClickGotoClassRoom() {
    //     this.classroom.emit();
    // }

    onClickRegister() {
        this.register.emit();
    }
}
