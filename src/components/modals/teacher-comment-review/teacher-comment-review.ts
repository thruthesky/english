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


@Component({
  selector: 'teacher-comment-review-component',
  styleUrls: ['teacher-comment-review.scss'],
  templateUrl: 'teacher-comment-review.html',
})
export class TeacherCommentReviewComponent implements OnInit {



  constructor(
    public app: App,
    public activeModal: NgbActiveModal,
    public share: ShareService,
  ) {


  }

  ngOnInit() {

  }





  onClickDismiss() {
    this.activeModal.dismiss();
  }






}
