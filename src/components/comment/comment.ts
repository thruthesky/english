import { Component } from '@angular/core';
import { App } from './../../providers/app';
import { CommentReviewComponent } from "../modals/comment-review/comment-review";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  _DELETE_RESPONSE,
  _LIST, _POST_COMMON_WRITE_FIELDS,_POST_LIST_RESPONSE, _POSTS,
  PostData
} from "angular-backend";
import {CONFIRM_OPTION} from "../../providers/bootstrap/confirm/confirm";
export interface _POST_COMMON_WRITE_FIELDS_SHOWMORE extends _POST_COMMON_WRITE_FIELDS{
    show_more_content?: boolean;
}
@Component({
  selector: 'comment-component',
  templateUrl: 'comment.html',
  styleUrls: ['./comment.scss']
})
export class CommentComponent {


  posts: _POSTS = [];
  searchQuery = <_LIST>{
    order: 'idx DESC',
    extra: { file: true , post_config_id: 'review'}
  };

  no_of_current_page: number = 1;
  no_of_total_items: number = 0;
  no_of_items_in_one_page: number = 10;
  no_of_pages_in_navigator: number = 5;
  userIdx: number = null;

  constructor(
    public app: App,
    private modal: NgbModal,
    private postData: PostData,
  ) {

    if ( this.app.user.logged ) this.userIdx = this.app.user.info.idx;
    this.loadPostData();
  }

  onClickWriteReview() {
    if ( ! this.app.user.logged ) return this.app.alertModal( "수업 후기를 작성하기 위해서는 먼저 회원 로그인을 해야 합니다.", "로그인 필요" );
    let modalRef = this.modal.open( CommentReviewComponent, { windowClass: 'enhance-modal' } );
    modalRef.result.then( res => {
      this.loadPostData();
    }).catch( e => {} );
  }

  onConfigPageClick( $event ) {
    this.loadPostData( $event );
  }

  loadPostData( page = 1 ) {
    this.app.scrollTo('comment');
    this.posts = [];
    this.searchQuery.page = page;
    this.searchQuery.where = "deleted is null and cast(? as integer)";
    this.searchQuery.bind  = '1';
    this.searchQuery.limit = this.no_of_items_in_one_page;
    this.postData.list( this.searchQuery ).subscribe( (res: _POST_LIST_RESPONSE ) => {
      this.posts = res.data.posts;
      this.no_of_total_items = res.data.total;
      this.no_of_current_page = res.data.page;
      this.posts.map( (post: _POST_COMMON_WRITE_FIELDS_SHOWMORE) => {
        post.created = ( new Date( parseInt( post.created ) * 1000 ) ).toString();
        post.show_more_content = false;
      });
    }, err => {
      this.app.error( err );
    });
  }

  onClickDelete( _post ) {

    let option: CONFIRM_OPTION = {
      class: 'enhance-modal',
      title: '글 삭제',
      content: '정말 삭제를 하시겠습니까?',
      confirm: '예',
      cancel: '아니오'
    };
    this.app.confirmModal( option , () => {
      this.postData.delete( parseInt( _post.idx) ).subscribe( (res: _DELETE_RESPONSE) => {
        _post.title = '삭제되었습니다.';
        _post.content = '삭제되었습니다.';
        _post.deleted = 1;
      }, err => this.postData.alert( err ));
    });
  }

  onClickEdit( _post ) {
    if( this.userIdx ) this.showEditPostForm( _post );
  }

  showEditPostForm( _post ) {
    let modalRef = this.modal.open( CommentReviewComponent, { windowClass: 'enhance-modal'} );
    modalRef.componentInstance['post'] = _post;
    modalRef.result.then( () => {
      this.loadPostData();
    }).catch( e => {});
  }
}
