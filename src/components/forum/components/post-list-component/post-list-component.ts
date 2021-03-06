import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { App } from './../../../../providers/app';
import { ShareService } from '../../../../providers/share-service';
import { ForumPostComponent} from '../../../modals/forum-post/forum-post';
import { PostViewModal} from '../../../modals/post-view/post-view';
import {
    User,
    PostData,
    _LIST,
    _POST_LIST_RESPONSE,
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
    searchQuery = <_LIST>{
        limit: this.pageOption['limitPerPage'],
        extra: {file: true}
    };
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

        // this.searchPostChangeDebounce
        // .debounceTime(300)
        // .subscribe(() => this.onChangedPostSearch());
        // this.testOpenPost('post147');
    }


    testOpenPost(id) {

        setTimeout(() => {
            //console.log("check id: ", id);
            if ( $("#post147").length ) $("#post147").click();
            else this.testOpenPost(id);
        }, 200);


    }

    onClickEdit( _post ) {
        if( _post.deleted == '1' ) return;
        if( this.user.logged ) this.showEditPostForm( _post );
        else {
            let password = prompt("비밀번호를 입력하세요.");
            let req: _POST_EDIT = { idx: _post.idx, password: password };
            this.postData.edit( req ).subscribe( (res: _POST_EDIT_RESPONSE ) => {
                this.showEditPostForm( _post );
            }, e => {
                if ( e.code == -40109 ) alert("비밀번호가 틀립니다.");
                else this.postData.alert( e );
             } );
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
        title: '글 삭제',
        content: '정말 삭제하시겠습니까??',
        confirm: '예',
        cancel: '아니오'
      };
      if( this.user.logged ) {
        let req: _POST_EDIT = { idx: parseInt( _post.idx) };
        this.app.confirmModal( option , () => {
            this.postData.delete( req ).subscribe( (res: _DELETE_RESPONSE) => {
                _post.title = '삭제되었습니다.';
                _post.content = '삭제되었습니다.';
                _post.deleted = 1;
                this.posts = this.posts.filter( post => post.idx !== _post.idx );
            }, err => this.postData.alert( err ) );
        });
      }
      else {
          let password = prompt("비밀번호를 입력하세요.");
          let req: _POST_EDIT = { idx: parseInt( _post.idx), password: password };
          this.app.confirmModal( option , () => {
            this.postData.delete( req ).subscribe( (res: _DELETE_RESPONSE) => {
                _post.title = '삭제되었습니다.';
                _post.content = '삭제되었습니다.';
                _post.deleted = 1;
            }, err => this.postData.alert( err ) );
        });
      }
    }
    loadPostData() {
        this.posts = [];
        this.searchQuery.page = this.pageOption.currentPage;
        this.searchQuery.where = "parent_idx=? and deleted is null and cast(? as integer)";
        this.searchQuery.bind  = '0,1';
        this.searchQuery.extra['post_config_id'] = this.post_config_id ? this.post_config_id : null;
        this.searchQuery.extra['comment'] = true;

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

    onPostPageClick( $event ) {
        this.pageOption['currentPage'] = $event;
        this.loadPostData();
    }
    onClickView( post ) {

        if ( post.name === "anonymous" && !this.app.isAdmin()) {
          let password = prompt("비밀번호를 입력하세요.");
          if( password == void 0 || password.length == 0) return;
          let req: _POST_EDIT = { idx: post.idx, password: password };
          this.postData.edit( req ).subscribe( (res: _POST_EDIT_RESPONSE ) => {
            // console.log('res::',res);
            return this.viewPost(post);
          }, e => {
            if ( e.code == -40109 ) alert("비밀번호가 틀립니다.");
            else this.postData.alert( e );
            return;
          } );
        }

        if ( post.name != this.user.info.name && !this.app.isAdmin() ) {
           return this.app.alertModal("본인게시글만 열람이 가능합니다.");
        }

        this.viewPost(post);


    }

    viewPost( post ) {
      let modalRef = this.modal.open( PostViewModal, { windowClass: 'enhance-modal' }  );
      modalRef.componentInstance['post'] = post;
      modalRef.result.then( () => {
      }).catch( e => {} );
    }

}
