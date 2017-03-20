import { Component, OnInit, Output, EventEmitter  } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginModal } from '../modals/login/login';
import { RegisterComponent } from '../modals/register/register';

import { User } from '../../angular-backend/user';

import { App } from '../../providers/app';

@Component({
    selector: 'header-component',
    templateUrl: 'header.html'
})
export class HeaderComponent implements OnInit {
    event:any = {};
    random;
    ctr: number = 0;
    uid;

    @Output() onLogin = new EventEmitter();
    @Output() onLogout = new EventEmitter();

    more: boolean = false;
    //login: boolean = false;



    constructor(
        public user        : User,
        private modal       : NgbModal,
        private app         : App
    ) {
        // userTest.run();
        // console.log('header :: constructor(), loginUser: ', user.loginUser);
        // this.login = user.isLogin();
        // console.log("user login status: ", this.login);

        // this.onClickRegister();



    }

    ngOnInit() {
        // this.onClickRegister();
    }

    onClickLogin(){
        let modalRef = this.modal.open( LoginModal );
        modalRef;
        // modalRef.result.then( (x) => {
        //     //console.log( this.user.isLogin() );
        //     //this.login = this.user.isLogin();
        //     //console.log("user login status: ", this.login);
        //     if ( this.user.logged ) {
        //         this.onLogin.emit();
        //     }
        // }).catch( () => console.log('exit') );

    }


    
    onClickGotoClassRoom(){
        // window.open(
        //     `https://video.withcenter.com/room/${this.user.loginUser.name}/testroom`,
        //     '_blank'
        // );
    }

    onClickRegister() {
        let modalRef = this.modal.open ( RegisterComponent );
        modalRef;
        // modalRef.result.then( (x) => {
        //     // console.log( this.user.loginUser );
        //     //this.login = this.user.isLogin();
        //     console.log("user login status: ", this.user.logged);
        // }).catch( () =>console.log('exit '));
    }





    onClickLogout() {

        
        
      this.user.logout();
      
    }


    onClickUpdateProfile(){
        // console.log('uid ' + JSON.stringify(this.user.loginUser));
        let modalRef = this.modal.open( RegisterComponent );
        modalRef.result.then(() => {}).catch( () =>console.log('exit '));
    }

    onClickMoreMenu() {
        this.more = ! this.more;
    }

    /**
     * ================= ScrollSpy + Affix ======================
     */

    onClickMenu( name ) {
        this.app.scrollTo( name );
    }

    onClickPanelMenu( name ) {
        this.more = false;
        this.app.scrollTo( name );
    }


}
