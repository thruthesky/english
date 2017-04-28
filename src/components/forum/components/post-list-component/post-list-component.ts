import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ShareService } from '../../../../providers/share-service';
import { ForumPostComponent} from '../../../modals/forum-post/forum-post';
import { Subject } from 'rxjs/Subject';
import {
    PostData,
    _LIST, 
    _POST_LIST_RESPONSE,
    _POST, 
    _POSTS,
    _FILE,
    _DELETE_RESPONSE,
    _POST_COMMON_WRITE_FIELDS
} from 'angular-backend';
@Component({
    selector: 'post-list-component',
    templateUrl: 'post-list-component.html'
})
export class PostListComponent  {
    @Input() no_of_items_in_one_page: number = 0;
    post_config_id: string = '';
    posts: _POSTS = [];
    pageOption = {
        limitPerPage: 3,
        currentPage: 1,
        limitPerNavigation: 4, //
        totalRecord: 0
    };
    searchPostForm: _POST = <_POST> {};
    searchQuery = <_LIST>{
        limit: this.pageOption['limitPerPage'],
        extra: {file: true}
    };
    searchPostChangeDebounce = new Subject();
    constructor(
        public share: ShareService,
        private postData: PostData,
        private modal: NgbModal,
    ) {
        this.searchQuery['order'] = 'idx DESC';
        if ( this.post_config_id !== void 0 ) this.post_config_id = 'qna';
        this.loadPostData();

        this.searchPostChangeDebounce
        .debounceTime(300) // wait 300ms after the last event before emitting last event
        .subscribe(() => this.onChangedPostSearch());
    }
    onClickEdit( _post ) {
        if( _post.deleted == '1' ) return;
        console.log("My post:",_post);
        let modalRef = this.modal.open( ForumPostComponent );
        modalRef.componentInstance['post'] = _post;
        modalRef.result.then( () => {
        }).catch( e => console.log('exit ' + e ) );
    }
    onClickDelete( _post ) {
            if( _post.deleted == '1' ) return;
        console.log( _post.idx );
        this.postData.delete( parseInt( _post.idx) ).subscribe( (res: _DELETE_RESPONSE) => {
        console.log("delete response: ", res);
        _post.deleted = '1';
        }, err => this.postData.alert( err ) );
    }
    loadPostData() {
        this.posts = [];
        this.searchQuery.page = this.pageOption.currentPage;
        this.searchQuery.extra['post_config_id'] = this.post_config_id ? this.post_config_id : null;
        this.postData.list( this.searchQuery ).subscribe( (res: _POST_LIST_RESPONSE ) => {
        this.posts = res.data.posts;

        this.pageOption.totalRecord = res.data.total;
        

        this.posts.map( (post: _POST_COMMON_WRITE_FIELDS) => {
            post.created = ( new Date( parseInt(post.created) * 1000 ) ).toString();
        });


        }, err => this.postData.alert( err ));
    }
    onChangePostSearch() {
        this.searchPostChangeDebounce.next();
    }
    onChangedPostSearch() {
        if (this.searchPostForm.title) {
        if (this.searchPostForm.title.length < 2) return;
        }
        if (this.searchPostForm.content) {
        if (this.searchPostForm.content.length < 2) return;
        }

        let cond = '';
        let bind = '';

        if (this.searchPostForm.title) cond += "title LIKE ? ";
        if (this.searchPostForm.title) bind += `%${this.searchPostForm.title}%`;

        if (this.searchPostForm.content) cond += cond ? "AND content LIKE ? " : "content LIKE ?";
        if (this.searchPostForm.content) bind += bind ? `,%${this.searchPostForm.content}%` : `%${this.searchPostForm.content}%`;

        this.searchQuery.where = cond;
        this.searchQuery.bind = bind;
        this.searchQuery.order= 'idx DESC';
        this.pageOption.currentPage = 1;
        this.loadPostData();
    }
    onPostPageClick( $event ) {
        this.pageOption['currentPage'] = $event;
        this.loadPostData();
    }

}
