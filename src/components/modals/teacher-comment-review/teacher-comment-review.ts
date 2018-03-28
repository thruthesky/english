import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {App} from '../../../providers/app';
import {
  _DELETE_RESPONSE, _POST_CREATE, _POST_CREATE_RESPONSE, PostData,
  User,
  File, _POST, _POST_EDIT, _POST_EDIT_RESPONSE,
} from 'angular-backend';
import {ShareService} from '../../../providers/share-service';
import {LMS} from "../../../providers/lms";
import {ReviewService} from "../../../providers/review-service";
import {toInteger} from "@ng-bootstrap/ng-bootstrap/util/util";
import {Message} from "../../../providers/message";


@Component({
  selector: 'teacher-comment-review-component',
  styleUrls: ['teacher-comment-review.scss'],
  templateUrl: 'teacher-comment-review.html',
})
export class TeacherCommentReviewComponent implements OnInit {


  data: any = null;
  rate_info: {accumulated: number, total_comment: number} = null;

  comment = '';
  rate: string = '5';

  loader = true;
  sending = false;

  errorMessage: string = null;



  // idx_teacher: number = null;
  teacher: any = {};
  comments = [];
  //
  next = null;
  limit = 5;
  //
  showMore = true;
  loading = false;

  stars = [];


  constructor(
    public app: App,
              public lms: LMS,
              public user: User,
              public activeModal: NgbActiveModal,
              public share: ShareService,
              public review: ReviewService,
              private message: Message
  ) {

    this.setStars(5);
  }

  ngOnInit() {
    this.loader = false;
    this.loadReview();
    this.review.getTeacherRate( this.teacher.idx, re => {
      console.log("getTeacherRate", re);
      this.rate_info = re;
    });
  }


  loadReview() {
    this.loading = true;
    const req = {
      idxTeacher: this.teacher.idx,
      limit: this.limit
    };
    if ( this.next ) req['next'] = this.next;
    console.log(req);
    this.review.gets( req, re => {
      console.log("gets re: ", re);
      if ( re['data'].length < this.limit ) this.showMore = false;
      if ( re['data'] && re['data'].length ) {
        re['data'].forEach( v => {
          this.comments.push(v);
        });
      }

      this.next = re['next'];
      this.loading = false;
    });
  }

  onClickDismiss() {
    this.activeModal.dismiss();
  }

  onClickSubmit() {
    this.sending = true;
    this.errorMessage = '';


    if (this.comment.length < 50) {
      this.errorMessage = "Minimum comment cant be less than 50 character.";
      this.sending = false;
      return;
    }

    if (this.comment.length > 300) {
      this.errorMessage = "Maximum comment cant be more than 300 character.";
      this.sending = false;
      return;
    }




    const d = new Date();
    const data = {
      idxStudent: this.user.info.idx,
      studentName: this.user.info.name,
      idxTeacher: this.teacher.idx,
      teacherName: this.teacher.nickname,
      rate: this.rate,
      comment: this.comment,
      date: d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
    };

    /// how to add a review.
    if (this.data && this.data['documentID']) {
      this.editReview(data);
    } else {
      this.createReview(data);
    }

  }

  createReview(data) {

    const m = "Student " + data.studentName + " created comment to Teacher " + data.teacherName;

    this.review.create(data, re => {
      console.log("onClickSubmit:: ", re);
      const summary = {
        idx: this.teacher.idx,
      };

      this.message.send('Student Comment', m);

      if ( this.rate_info ) {
        console.log("rate_info::", this.rate_info);
        summary['accumulated'] = this.rate_info['accumulated'] + this.toNumber(this.rate);
        summary['total_comment'] = ++this.rate_info['total_comment'];
      } else {
        summary['accumulated'] = this.toNumber(this.rate);
        summary['total_comment'] = 1;
      }
      console.log("summary", summary);
      this.review.setTeacherRate(summary, res => {
        console.log("setTeacherRate::reviewCreated::", res);
        this.activeModal.close("reviewCreated");
        alert("Review Successfully Created.");
      });

    });
  }

  editReview(data) {
    const m = "Student " + data.studentName + " edit comment to Teacher " + data.teacherName;

    data['id'] = this.data.documentID;
    this.review.edit(data, re => {
      console.log("editReview", re);
      this.message.send('Student Edit Comment', m);
      const summary = {
        idx: this.teacher.idx,
        accumulated: this.rate_info['accumulated'] - this.data.rate + this.toNumber(this.rate),
        total_comment: this.rate_info['total_comment']
      };
      this.review.setTeacherRate(summary, res => {
        console.log("setTeacherRate::editReview::", res);
        this.activeModal.close("reviewUpdated");
        alert("Review Success Updated.");
      });
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
      this.rate_info['accumulated'] = this.rate_info['accumulated'] - comment.rate;
      const summary = {
        idx: this.teacher.idx,
        accumulated: this.rate_info['accumulated'],
        total_comment: --this.rate_info['total_comment']
      };
      this.review.setTeacherRate(summary, res => {
        console.log("setTeacherRate::onClickDelete::", res);
        comment.documentID = null;
        alert("Comment has been deleted.");
      });


    });
  }

  onClickCommentEdit( comment ) {
    this.comment = comment.comment;
    this.setStars(comment.rate);
    this.rate = comment.rate;
    this.data = comment;
    document.getElementsByTagName('ngb-modal-window').item(0).scrollTo( 0, 0);
  }




  setStars(n) {
    this.stars = this.getStars(n);
  }

  getStars(n , addEmpty = true) {
    const s = [];
    for (let i = 1 ; i <=  n / 2; i++) {
      s.push("fa-star");
    }
    if ( n % 2) { s.push("fa-star-half-o"); }
    if ( addEmpty ) {
      const arr = 5 - Math.ceil(n / 2);
      const emptyStar = Array(arr).fill("fa-star-o");
      return s.concat(emptyStar);
    } else { return s; }
  }



  toNumber(n) {
    if (typeof  n != 'number') {
      return parseInt(n, 10);
    }
    return n;
  }
}
