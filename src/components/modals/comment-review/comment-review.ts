import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup} from "@angular/forms";


@Component({
  selector: 'comment-review-component',
  templateUrl: 'comment-review.html',
})
export class CommentReviewComponent {


  formGroup: FormGroup;

  constructor(
    private fb: FormBuilder
  ){
    this.formGroup = this.fb.group({
      content: []
    });
  }

}
