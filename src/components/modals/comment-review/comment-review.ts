import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

import { App } from '../../../providers/app';
import {
  _DELETE_RESPONSE, _FILE, _POST_CREATE, _POST_CREATE_RESPONSE, _USER_RESPONSE, PostData,
  User,
  File,
} from "angular-backend";
import {ShareService} from "../../../providers/share-service";


@Component({
  selector: 'comment-review-component',
  styleUrls: ['comment-review.scss'],
  templateUrl: 'comment-review.html',
})
export class CommentReviewComponent {


  formGroup: FormGroup;
  files: Array<_FILE> = [];

  loading     : boolean = false;
  primary_photo_idx: number = null;
  photoError: string = null;

  formValid = true;
  validationMessages = {
    content: {
      'required': 'Comment is required.',
    },
  };

  formErrors = {
    content: '',
  };

  constructor(
    public  app          : App,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private user: User,
    private postData: PostData,
    public share: ShareService,
    public file          : File,
  ){
    this.formGroup = this.fb.group({
      content: ['', Validators.required]
    });


    this.formGroup.valueChanges
      .debounceTime(1000)
      .subscribe( () => {
        this.onValueChanged();
      } );
  }


  onClickDismiss(){
    this.activeModal.close();
  }

  onClickSubmit(){

    if ( this.formGroup.value.content.length == 0 ) return this.formErrors.content = "Comment is required";
    if ( ! this.primary_photo_idx ) {
      return this.photoError = "Photo is required"
    }


    let create = <_POST_CREATE> this.formGroup.value;
    create.post_config_id = 'review';
    create.file_hooks = [ this.primary_photo_idx ];
    if( this.user.logged ) create.name = this.user.info.name;
    else {
      this.activeModal.close();
      this.app.alertModal( "To write comment you must log-in", "Must Log-in first");
    }
    this.postData.create( create ).subscribe( ( res: _POST_CREATE_RESPONSE ) => {
      this.activeModal.close();
      this.app.alertModal( "Success Write Comment");
    }, err => this.postData.alert( err ) );
  }

  onClickDeletePhoto() {
    this.loading = true;
    this.file.delete( this.primary_photo_idx).subscribe( (res:_DELETE_RESPONSE) => {
      this.primary_photo_idx = null;
      this.loading = false;
    }, err => {
      this.loading = false;
      this.file.alert(err)
    });
  }

  onChangeFileUpload( fileInput ) {
    this.loading = true;
    this.photoError = null;
    let file = fileInput.files[0];
    this.file.uploadPostFile( file ).subscribe(res => {
      this.primary_photo_idx = res.data.idx;
      this.loading = false;
    }, err => {
      this.loading = false;
      this.file.alert(err);
    });
  }


  onValueChanged() {
    if (!this.formGroup) return;
    this.formValid = true;
    const form = this.formGroup;
    for (const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }


}
