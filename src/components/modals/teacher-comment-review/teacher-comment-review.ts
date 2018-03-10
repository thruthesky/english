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


@Component({
  selector: 'teacher-comment-review-component',
  styleUrls: ['teacher-comment-review.scss'],
  templateUrl: 'teacher-comment-review.html',
})
export class TeacherCommentReviewComponent implements OnInit {

  idx_teacher: number = null;
  teacher: any = null;
  rate = 3;

  loader = true;

  constructor(
    public app: App,
    public lms: LMS,
    public activeModal: NgbActiveModal,
    public share: ShareService,
  ) {


  }

  ngOnInit() {

    console.log(this.lms.url);
    console.log('IDX_TEACHER::', this.idx_teacher);
    console.log('TEACHER::', this.teacher);

    if ( this.idx_teacher ) {
      this.lms.isMyTeacher(this.idx_teacher, res => {
        console.log(res);
        if ( res > 0 ) {
          console.log("Y");
          this.loader = false;

        } else {
          console.log("N");
          this.activeModal.dismiss();
          this.app.alertModal("No Past Class Yet with Teacher " + this.teacher.nickname, "Not Your Teacher");
        }
      });
    }
  }





  onClickDismiss() {
    this.activeModal.dismiss();
  }



  onClickSubmit() {

  }




}
