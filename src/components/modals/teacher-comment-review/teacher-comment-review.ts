import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { App } from '../../../providers/app';
import {
  _DELETE_RESPONSE, _POST_CREATE, _POST_CREATE_RESPONSE, PostData,
  User,
  File, _POST, _POST_EDIT, _POST_EDIT_RESPONSE,
} from 'angular-backend';
import { ShareService } from '../../../providers/share-service';
import {LMS} from "../../../providers/lms";
import {ReviewService} from "../../../providers/review-service";


@Component({
  selector: 'teacher-comment-review-component',
  styleUrls: ['teacher-comment-review.scss'],
  templateUrl: 'teacher-comment-review.html',
})
export class TeacherCommentReviewComponent implements OnInit {

  teacher: any = null;
  data: any = null;

  comment = '';
  rate = 3;

  loader = true;
  sending = false;

  errorMessage: string = null;

  constructor(
    public app: App,
    public lms: LMS,
    public user: User,
    public activeModal: NgbActiveModal,
    public share: ShareService,
    public review: ReviewService
  ) {


  }

  ngOnInit() {

    console.log(this.lms.url);
    console.log('TEACHER::', this.teacher);
    console.log('Data::', this.data);

    if ( this.teacher.idx ) {
      this.lms.isMyTeacher(this.teacher.idx, res => {
        console.log(res);
        if ( res > 0 ) {
          console.log("Y");
          this.loader = false;
          if (this.data) {
            this.rate = this.data.rate;
            this.comment = this.data.comment;
          }

        } else {
          console.log("N");
          this.activeModal.dismiss();
          this.app.alertModal("선생님과 수업을 해야지만 후기를 작성 할 수 있습니다.", "Not Your Teacher");
        }
      });
    }
  }

  onClickDismiss() {
    this.activeModal.dismiss();
  }

  onClickSubmit() {
    this.sending = true;
    this.errorMessage = '';


    if ( !this.comment || this.comment.length < 10 ) {
      this.errorMessage = "Minimum comment cant be less than 10 character.";
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
    if ( this.data && this.data['documentID']) {
      this.editReview(data);
    } else {
      this.createReview(data);
    }

  }

  createReview(data) {
    this.review.create( data , re => {
      console.log("onClickSubmit:: ", re);
      this.activeModal.close("reviewCreated");
      alert("Review Successfully Created.");
    });
  }

  editReview(data) {
    data['id'] = this.data.documentID;
    this.review.edit( data, re => {
      console.log("editReview", re);
      this.activeModal.close("reviewUpdated");
      alert("Review Success Updated.");
    });
  }





}
