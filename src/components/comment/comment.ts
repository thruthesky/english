import { Component } from '@angular/core';
import { App } from './../../providers/app';
import { CommentReviewComponent } from "../modals/comment-review/comment-review";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {_LIST, _POST_COMMON_WRITE_FIELDS, _POST_LIST_RESPONSE, _POSTS, PostData} from "angular-backend";
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
  constructor(
    public app: App,
    private modal: NgbModal,
    private postData: PostData,
  ) {
    this.loadPostData();
  }
  onClickWriteReview(){
    if ( ! this.app.user.logged ) return this.app.alertModal( "수업 후기를 작성하기 위해서는 먼저 회원 로그인을 해야 합니다.", "로그인 필요" );
    let modalRef = this.modal.open( CommentReviewComponent, { windowClass: 'enhance-modal' } );
    modalRef.result.then( res => {
    }).catch( e => {} );
  }

  onConfigPageClick( $event ) {
    this.loadPostData( $event );
  }

  loadPostData( page = 1 ) {
    this.app.scrollTo('comment');
    this.posts = [];
    this.searchQuery.page = page;
    this.searchQuery.limit = this.no_of_items_in_one_page;
    this.postData.list( this.searchQuery ).subscribe( (res: _POST_LIST_RESPONSE ) => {
    this.posts = res.data.posts;
    this.no_of_total_items = res.data.total;
    this.no_of_current_page = res.data.page;
    this.posts.map( (post: _POST_COMMON_WRITE_FIELDS) => {
      post.created = ( new Date( parseInt( post.created ) * 1000 ) ).toString();
    });
    }, err => {
      this.app.error( err );
    });
  }
}