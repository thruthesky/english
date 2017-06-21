import { Component, OnInit  } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginModal } from '../../components/modals/login/login';
import { RegisterComponent } from '../../components/modals/register/register';
import { LMS } from '../../providers/lms';
import { User } from 'angular-backend';
import { App } from '../../providers/app';
import { ShareService } from '../../providers/share-service';
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
        private lms     : LMS,
        private modal      : NgbModal,
        public app         : App,
        public share       : ShareService
    ) {
    
    }


    ngOnInit() {
        
    }

    onClickLogin(){
        let modalRef = this.modal.open( LoginModal, { windowClass: 'enhance-modal'} );
        modalRef;
    }

    onClickRegister() {
        let modalRef = this.modal.open ( RegisterComponent, { windowClass: 'enhance-modal' } );
        modalRef;
    }

    onClickLogout() {
    //   this.app.myEvent.emit( {
    //       eventType: "logout-success"
    //   } );

      this.app.logout( a => {} );
      
    }

    onClickUpdateProfile(){
        let modalRef = this.modal.open( RegisterComponent, { windowClass: 'enhance-modal' } );
        modalRef.result.then(() => {}).catch( () => {});
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
