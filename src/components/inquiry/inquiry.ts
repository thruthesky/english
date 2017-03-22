import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QnaPostComponent } from '../modals/qna_post/post';
//import { Post } from './../../angular-backend/post';
// import { POST_RESPONSE } from './../../angular-backend/interface';
import { App } from '../../providers/app';
import { PostData, POST, POSTS, POST_RESPONSE } from './../../angular-backend/angular-backend';

@Component({
    selector: 'inquiry-component',
    templateUrl: 'inquiry.html',
    styleUrls: ['./inquiry.scss']
})
export class InquiryComponent {
    postList: POSTS = [];
    constructor( private modal: NgbModal,
                private post: PostData,
                private app: App ) {
                this.getPostList();
                this.listenEvents();
    }
    listenEvents(){
        this.app.myEvent.subscribe( item =>{
            if( item.eventType == 'post'  ){
              this.getPostList()
            }
        });
    }
    getPostList() {
        this.post.list().subscribe( (res: POST_RESPONSE) => {
            this.getDataSuccess( res );
            console.log("getPostList:",res);
        }, error => {
            this.error( error );
        } );
    }

    getDataSuccess( res: POST_RESPONSE ) {
        
        console.log(res);
        
        try {
            res.data.posts.forEach( ( re:POST )=> {
                re['created'] = new Date(parseInt(re.created)).toLocaleDateString();
            });
            this.postList = res.data.posts;
        }
        catch ( e ) {
            alert("CRITICAL: server returned wrong value");
        }
    }

    error( error ) {
        return this.post.errorResponse( error );
    }
    onClickPost() {
        this.modal.open( QnaPostComponent ).result.then( () => {
        }).catch( e => console.log('exit ' + e ) );
    }


}