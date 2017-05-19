import { Component, OnInit  } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginModal } from '../../components/modals/login/login';
import { RegisterComponent } from '../../components/modals/register/register';

import { User } from 'angular-backend';
import { App } from '../../providers/app';
@Component({
    selector: 'header-component',
    templateUrl: 'header.html',
    styleUrls: ['header.scss']
})
export class HeaderComponent implements OnInit {
    event:any = {};
    random;
    ctr: number = 0;
    uid;


    more: boolean = false;
    constructor(
        public user        : User,
        private modal      : NgbModal,
        public app         : App,
        // public share       : ShareService
    ) {
    
    }
    ngOnInit() {}


    onClickLogin(){
        let modalRef = this.modal.open( LoginModal );
        modalRef;
    }

    onClickRegister() {
        let modalRef = this.modal.open ( RegisterComponent );
        modalRef;
    }

    onClickLogout() {
    //   this.share.class_info = null;
      this.app.myEvent.emit( {
          eventType: "logout-success"
      } );

      //this.user.logout();

      this.app.logout( a => {} );
      
    }

    onClickUpdateProfile(){
        // console.log('uid ' + JSON.stringify(this.user.loginUser));
        let modalRef = this.modal.open( RegisterComponent );
        modalRef.result.then(() => {}).catch( () =>console.log('exit '));
    }

    onClickMoreMenu() {
        this.more = ! this.more;
    }

    onClickMenu( name ) {
        this.app.scrollTo( name );
    }

    onClickPanelMenu( name ) {
        this.more = false;
        this.app.scrollTo( name );
    }


}
