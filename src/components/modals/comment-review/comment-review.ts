import {Component, OnInit} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import { App } from '../../../providers/app';
import {
  _DELETE_RESPONSE, _FILE, _POST_CREATE, _POST_CREATE_RESPONSE, PostData,
  User,
  File, _POST, _POST_EDIT, _POST_EDIT_RESPONSE,
} from 'angular-backend';
import {ShareService} from '../../../providers/share-service';


@Component({
  selector: 'comment-review-component',
  styleUrls: ['comment-review.scss'],
  templateUrl: 'comment-review.html',
})
export class CommentReviewComponent implements OnInit {


  formGroup: FormGroup;

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

  post: _POST = <_POST>{};

  constructor(
    public  app          : App,
    private fb: FormBuilder,
    public  activeModal: NgbActiveModal,
    private user: User,
    private postData: PostData,
    public  share: ShareService,
    public  file          : File,
  ) {


  }

  ngOnInit() {
    this.createForm();
    this.formGroup.valueChanges
      .debounceTime(1000)
      .subscribe( () => {
        this.onValueChanged();
      });
  }

  createForm() {
    if ( this.isCreate() ) {
      this.primary_photo_idx = null;
      this.formGroup = this.fb.group({
        content: ['', [Validators.required] ]
      });
    }
    else {
      this.primary_photo_idx = this.post.files.length && this.post.files[0].idx ? this.post.files[0].idx : null;
      this.formGroup = this.fb.group({
        content: [ this.post.content, [ Validators.required ] ]
      });
    }
  }

  isCreate() {
    return this.post === void 0 || this.post.idx === void 0;
  }


  onClickDismiss() {
    this.activeModal.dismiss();
  }

  onClickSubmit() {
    if ( this.isCreate() ) this.createPost();
    else this.editPost();
  }


  createPost() {
    if ( this.formGroup.value.content.length == 0 ) return this.formErrors.content = "Comment is required";
    if ( ! this.primary_photo_idx ) {
      return this.photoError = "사진을 업로드해야 합니다."
    }

    let create = <_POST_CREATE> this.formGroup.value;
    create.post_config_id = 'review';
    create.file_hooks = [ this.primary_photo_idx ];
    if( this.user.logged ) create.name = this.user.info.name;
    else {
      this.activeModal.dismiss();
      this.app.alertModal( "회원 로그인을 해 주세요.", "로그인 필수");
    }
    this.postData.create( create ).subscribe( ( res: _POST_CREATE_RESPONSE ) => {
      this.activeModal.close();
      this.app.alertModal( "Success Write Comment");
    }, err => this.postData.alert( err ) );
  }

  editPost() {

    if ( this.formGroup.value.content.length == 0 ) return this.formErrors.content = "내용을 입력해 주세요>";
    if ( ! this.primary_photo_idx ) {
      return this.photoError = "사진을 업로드해야 합니다."
    }

    let edit = <_POST_EDIT> this.formGroup.value;
    edit.idx = this.post.idx;
    edit.file_hooks = [ this.primary_photo_idx ];
    if( this.user.logged ) edit.name = this.user.info.name;
    else {
      this.activeModal.dismiss();
      this.app.alertModal( "To write comment you must log-in", "Must Log-in first");
    }
    this.postData.edit( edit ).subscribe( ( res: _POST_EDIT_RESPONSE ) => {
      this.activeModal.close();
      this.app.alertModal( "Success Update Comment");
    }, err => this.postData.alert( err ) );
  }


  onClickDeletePhoto() {
    this.file.delete( this.primary_photo_idx).subscribe( (res:_DELETE_RESPONSE) => {
      this.primary_photo_idx = null;
    }, err => {
      this.file.alert(err);
    });
  }

  onChangeFileUpload( fileInput ) {
    this.photoError = null;
    let file = fileInput.files[0];
    this.file.uploadPostFile( file ).subscribe(res => {
      this.primary_photo_idx = res.data.idx;
    }, err => {
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
