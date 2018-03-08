import {Component, OnInit} from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ShareService } from './../../../providers/share-service';


@Component({
    selector: 'teacher-comment-view-component',
    templateUrl: 'teacher-comment-view.html',
    styleUrls: ['teacher-comment-view.scss']
})

export class TeacherCommentViewComponent implements OnInit {

    idx_teacher: number = null;

    constructor(
        private activeModal: NgbActiveModal,
        public share: ShareService,
    ) {

    }

  ngOnInit() {
    console.log("IDX TEACHER::", this.idx_teacher);
  }

  onClickWriteReview() {
      this.activeModal.close("writeReview");
  }



    onClickDismiss() {
      this.activeModal.dismiss();
    }

}
