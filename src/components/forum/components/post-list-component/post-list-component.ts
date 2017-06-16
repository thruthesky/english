import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { App } from './../../../../providers/app';
import { ShareService } from '../../../../providers/share-service';
import { ForumPostComponent} from '../../../modals/forum-post/forum-post';
import { PostViewModal} from '../../../modals/post-view/post-view';
import { Subject } from 'rxjs/Subject';
import {
    User,
    PostData,
    _LIST,
    _POST_LIST_RESPONSE,
    _POST,
    _POSTS,
    _DELETE_RESPONSE,
    _POST_COMMON_WRITE_FIELDS,
    _POST_EDIT,
    _POST_EDIT_RESPONSE
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
        limitPerPage: 10,
        currentPage: 1,
        limitPerNavigation: 4,
        totalRecord: 0
    };
    searchPostForm: _POST = <_POST> {};
    searchQuery = <_LIST>{
        limit: this.pageOption['limitPerPage'],
        extra: {file: true}
    };
    searchPostChangeDebounce = new Subject();
    userIdx: number = null;
    constructor(
        public share: ShareService,
        private postData: PostData,
        private modal: NgbModal,
        public  user: User,
        private app: App
    ) {
        if ( this.user.logged ) this.userIdx = this.user.info.idx;
        this.searchQuery['order'] = 'idx DESC';
        if ( this.post_config_id !== void 0 ) this.post_config_id = 'qna';
        this.loadPostData();

        this.searchPostChangeDebounce
        .debounceTime(300)
        .subscribe(() => this.onChangedPostSearch());
    }

    onClickEdit( _post ) {
        if( _post.deleted == '1' ) return;
        if( this.user.logged ) this.showEditPostForm( _post );
        else {
            let password = prompt("Input Password");
            let req: _POST_EDIT = { idx: _post.idx, password: password };
            this.postData.edit( req ).subscribe( (res: _POST_EDIT_RESPONSE ) => {

                this.showEditPostForm( _post );
            }, e => this.postData.alert( e ) );
        }
    }
    showEditPostForm( _post ) {
        let modalRef = this.modal.open( ForumPostComponent, { windowClass: 'enhance-modal'} );
        modalRef.componentInstance['post'] = _post;
        modalRef.result.then( () => {
        }).catch( e => {});
    }
    onClickDelete( _post ) {
      let option = {
        class: 'enhance-modal',
        title: 'Deleting Post',
        content: 'Are you sure you want to delete this post?',
        confirm: 'Submit',
        cancel: 'Cancel'
      };
      this.app.confirmModal( option , () => {
          this.postData.delete( parseInt( _post.idx) ).subscribe( (res: _DELETE_RESPONSE) => {
            _post.title = 'Deleted';
            _post.content = 'Deleted';
            _post.deleted = 1;
          }, err => this.postData.alert( err ) );
      });
    }
    loadPostData() {
        this.posts = [];
        this.searchQuery.page = this.pageOption.currentPage;
        this.searchQuery.where = "deleted is null and cast(? as integer)";
        this.searchQuery.bind  = '1';
        this.searchQuery.extra['post_config_id'] = this.post_config_id ? this.post_config_id : null;
        this.postData.list( this.searchQuery ).subscribe( (res: _POST_LIST_RESPONSE ) => {
        this.posts = res.data.posts;

        this.pageOption.totalRecord = res.data.total;

        this.posts.map( (post: _POST_COMMON_WRITE_FIELDS) => {
            post.created = ( new Date( parseInt(post.created) * 1000 ) ).toDateString();
        });
    }, err => {
        this.app.error( err );
    });
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
    onClickShow( data ) {
        let modalRef = this.modal.open( PostViewModal, { windowClass: 'enhance-modal' }  );
        modalRef.componentInstance['post'] = data;
        modalRef.result.then( () => {
        }).catch( e => {} );
    }

}
