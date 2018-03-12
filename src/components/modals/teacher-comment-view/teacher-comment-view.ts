import {Component, OnInit} from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ShareService } from './../../../providers/share-service';
import {ReviewService} from "../../../providers/review-service";
import {User} from "angular-backend";


@Component({
    selector: 'teacher-comment-view-component',
    templateUrl: 'teacher-comment-view.html',
    styleUrls: ['teacher-comment-view.scss']
})

export class TeacherCommentViewComponent implements OnInit {

    idx_teacher: number = null;
    comments = [];

    next = null;
    limit = 1;

    showMore = true;
    loading = false;

    constructor(
        private activeModal: NgbActiveModal,
        public share: ShareService,
        public user: User,
        public review: ReviewService
    ) {

    }

  ngOnInit() {
    console.log("IDX TEACHER::", this.idx_teacher);
    this.loadReview();
  }

  loadReview() {
    this.loading = true;
    const req = {
      idxTeacher: this.idx_teacher,
      limit: this.limit
    };
    if ( this.next ) req['next'] = this.next;
    console.log(req);
    this.review.gets( req, re => {
      console.log("gets re: ", re);
      if ( re['data'].length < this.limit ) this.showMore = false;
      if ( re['data'] && re['data'].length ){
        re['data'].forEach( v => {
          this.comments.push(v);
        });
      }

      this.next = re['next'];
      this.loading = false;
    });
  }

  onClickWriteReview() {
      this.activeModal.close({action: "writeReview"});
  }

  onClickDelete( comment ) {
      if ( comment['delete'] ) return;
      comment['delete'] = true;
      console.log(comment.documentID);
      this.review.delete(comment.documentID , () => {
        comment.documentID = null;
        alert("Comment has been deleted");
      });
  }

  onClickCommentEdit( comment ) {
      console.log(comment);
      this.activeModal.close({action: "editReview", data: comment});
  }



    onClickDismiss() {
      this.activeModal.dismiss();
    }

    stars(n) {
      return Array(n).fill('');
    }
}
