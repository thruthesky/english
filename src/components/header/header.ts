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
        // setTimeout(()=>{this.getNextClassData();},5000);
        if( this.user.logged )this.getNextClassData();
        
    }
    getNextClassData() {
        console.log("ARA ARA ARA");
        if( this.share.idx_student ) {
            console.log("yes");
            this.urlClassData();
        } else {
            console.log("no");
            this.lms.getReservationsByMonthYear( { m:this.share.month , Y:this.share.year }, ( res )=> {
                let s_data = res.books.find(i=>{
                    return i.idx_student !== void 0;
                });
                if( s_data.idx_student ) this.share.idx_student = s_data.idx_student;
                this.urlClassData();
            },(e)=>{
                console.log("error in getNextClassData:",e);
            });
        }
    }
    urlClassData() {
        console.log("maybe this time");
        this.lms.getNextClass( {idx_student:this.share.idx_student}, (res)=>{
            console.log("urlClassData result:",res);
            this.share.ve_url = this.share.VE_ENDPOINT_URL + `?confcode=${ res.teacher.classid }&teacher_id=${ res.teacher.classid }&student_id=${res.student.md_id}&teacher_name=${res.teacher_name}&conftype=2&usertype=0&class_no=${res.idx}&class_date=${res.date}&class_begin=${res.class_begin}&class_end=${res.class_end}&usertype=${res.student.usertype}`;
            console.log("My wishite:",this.share.ve_url);
        }, e => {
            console.log(e);
        });
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
    //   this.share.class_info = null;
      this.app.myEvent.emit( {
          eventType: "logout-success"
      } );

      //this.user.logout();

      this.app.logout( a => {} );
      
    }

    onClickUpdateProfile(){
        // console.log('uid ' + JSON.stringify(this.user.loginUser));
        let modalRef = this.modal.open( RegisterComponent, { windowClass: 'enhance-modal' } );
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
