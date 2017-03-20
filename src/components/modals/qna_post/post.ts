import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
//import { Forum } from '../../../backend-angular-api/forum';
// import { FORUM_DATA_REQUEST_DATA } from '../../../backend-angular-api/interface';
import { App } from '../../../providers/app';
//import { POST_CREATE, USER } from './../../../angular-backend/interface';
//import { Post } from './../../../angular-backend/post';
//import { User } from './../../../angular-backend/user';

import { User, PostData, POST_CREATE, USER } from './../../../angular-backend/angular-backend';
@Component({
    selector: 'qna-post-component',
    templateUrl: 'post.html'
})

export class QnaPostComponent implements OnInit {
    form: POST_CREATE = <POST_CREATE> {}

    constructor(
        private activeModal  : NgbActiveModal,
        private app          : App,
        private post         : PostData,
        private user         : User       
        // private forum        : Forum
    ) {}


    ngOnInit() {
        if ( this.user.logged ) this.getUserData();
    }
    getUserData() {
        this.user.data().subscribe( (res: USER) => {
            this.getDataSuccess( res );
        }, error => {
            this.error( error );
        } );
    }
    getDataSuccess( res ) {
        console.log(res['data']['user']);
        this.form.name = res['data']['user'].nickname;
        this.form.password = res['data']['user'].nickname;
        
    }
    onClickDismiss(){
        this.activeModal.close();
    }

    onClickPost() {
       this.form.post_config_id = '6'; //Fake test only
       this.post.create( this.form ).subscribe( (res) => {
            console.log( res );
            this.app.myEvent.emit( { eventType:"post" } );
            this.onClickDismiss();
        }, error => {
            this.error( error );
        } );
    }
    error( error ) {
        return this.post.errorResponse( error );
    }
}