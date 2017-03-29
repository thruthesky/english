import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
//import { Forum } from '../../../backend-angular-api/forum';
// import { FORUM_DATA_REQUEST_DATA } from '../../../backend-angular-api/interface';
import { App } from '../../../providers/app';
//import { POST_CREATE, USER } from './../../../angular-backend/interface';
//import { Post } from './../../../angular-backend/post';
//import { User } from './../../../angular-backend/model/user';

import { User, PostData, POST_LIST_RESPONSE, POST_CREATE, USER, PostConfig, CONFIGS, CONFIG, LIST, PAGINATION_OPTION } from './../../../angular-backend/angular-backend';
@Component({
    selector: 'qna-post-component',
    templateUrl: 'post.html',
    styleUrls: ['post.scss']
})

export class QnaPostComponent implements OnInit {
    form: POST_CREATE = <POST_CREATE> {}
    postConfigs: CONFIGS = [];
    pageOption: PAGINATION_OPTION = {
        limitPerPage: 5,
        currentPage:1,
        numberPerNav: 4, //
        totalRecord: 0
    };
    searchQuery = <LIST>{
        limit: this.pageOption['limitPerPage']
    };
    constructor(
        private activeModal  : NgbActiveModal,
        private app          : App,
        private post         : PostData,
        private user         : User,
        private postConfig: PostConfig,       
        // private forum        : Forum
    ) {
        this.searchQuery['order'] = 'idx ASC';
    }


    ngOnInit() {
        this.loadPostConfig();
        if ( this.user.logged ) this.getUserData();
    }
    loadPostConfig() {
        this.postConfigs = [];

        this.searchQuery.page = this.pageOption.currentPage;

        this.postConfig.list( this.searchQuery ).subscribe( (res: POST_LIST_RESPONSE ) => {

        console.log("config list:",res);

        this.postConfigs = res.data.configs;
        this.pageOption.totalRecord = parseInt(res.data.total);


        this.postConfigs.map( (config: CONFIG) => {
            config.created = ( new Date( parseInt(config.created) * 1000 ) ).toString();
        });
        }, err => this.error( err ) );
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
       this.form.post_config_id = '1'; //Fake test only
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