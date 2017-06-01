import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup} from "@angular/forms";
import {_FILE, _POST_CREATE, _POST_CREATE_RESPONSE, _USER_RESPONSE, PostData, User} from "angular-backend";
import {ShareService} from "../../../providers/share-service";


@Component({
  selector: 'comment-review-component',
  templateUrl: 'comment-review.html',
})
export class CommentReviewComponent {


  formGroup: FormGroup;
  userData: _USER_RESPONSE = null;
  files: Array<_FILE> = [];

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private user: User,
    private postData: PostData,
    public share: ShareService
  ){
    this.formGroup = this.fb.group({
      content: []
    });
  }


  onClickDismiss(){
    this.activeModal.close();
  }

  onClickSubmit(){
    let create = <_POST_CREATE> this.formGroup.value;
    create.post_config_id = 'review';
    create.file_hooks = this.files.map( (f:_FILE) => f.idx );
    if( this.user.logged ) create.name = this.userData.name;
    else create.name = 'anonymous';
    this.postData.create( create ).subscribe( ( res: _POST_CREATE_RESPONSE ) => {
      this.share.posts.unshift( res.data );
      console.log( res );
      this.activeModal.close();
    }, err => this.postData.alert( err ) );
  }

}
