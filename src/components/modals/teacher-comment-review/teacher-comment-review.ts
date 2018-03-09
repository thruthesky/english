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
  }





  onClickDismiss() {
    this.activeModal.dismiss();
  }






}
