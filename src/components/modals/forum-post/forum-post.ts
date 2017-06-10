import { Component, EventEmitter, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { App } from './../../../providers/app';
import {
    PostData,
    User,
    File,
    NUMBERS,
    _FILE,
    _POST, _POST_CREATE,
    _POST_CREATE_RESPONSE,
    _POST_EDIT,
    _POST_EDIT_RESPONSE,
    _USER_RESPONSE,
    _USER_DATA_RESPONSE
} from 'angular-backend';
import { ShareService } from '../../../providers/share-service';
@Component({
    selector: 'forum-post-component',
    templateUrl: 'forum-post.html',
    styleUrls: ['forum-post.scss']
})
export class ForumPostComponent implements OnInit {

    created = new EventEmitter<_POST>();
    edited = new EventEmitter<_POST>();
    cancel = new EventEmitter<void>();

    post_config_id: string = 'qna';
    post: _POST = <_POST>{};


    formGroup: FormGroup;
    files: Array<_FILE> = [];

    userData: _USER_RESPONSE = null;
    constructor(
        public share: ShareService,
        private fb: FormBuilder,
        public file: File,
        private postData: PostData,
        private activeModal  : NgbActiveModal,
        public  user         : User,
        private app: App
    ) {
        if ( this.user.logged ) this.loadUserData();
    }
    loadUserData() {
        this.user.data().subscribe( (res: _USER_DATA_RESPONSE) => {
            this.userData = res.data.user;
        }, error => {
            // this.user.alert( error );
            this.app.error( error );
        } );
    }
    ngOnInit() {
        this.createForm();
        this.formGroup.valueChanges
            .debounceTime( 1000 )
            .subscribe( res => this.onValueChanged( res ) );
    }
    createForm() {

        if ( this.isCreate() ) {
            this.files = [];
            this.formGroup = this.fb.group({
                title: [ '', [ Validators.required ] ],
                content: [ '', [ Validators.required ] ]
            });
        }
        else {
            this.files = this.post.files ? this.post.files : [];
            this.formGroup = this.fb.group({
                title: [ this.post.title, [ Validators.required ] ],
                content: [ this.post.content, [ Validators.required ] ]
            });
        }
        if ( ! this.user.logged ) {
            this.formGroup.addControl( 'password', new FormControl('', [ Validators.required, Validators.minLength(5), Validators.maxLength(128)] ) );
        }
    }

    onSubmit() {
        if ( this.isCreate() ) this.createPost();
        else this.editPost();
  }


    reset() {
        this.files = [];
        this.formGroup.get('title').patchValue('');
        this.formGroup.get('content').patchValue('');
    }

    createSuccess( post: _POST ) {
        this.reset();
        this.created.emit( post );
        this.activeModal.close();
    }
    editSuccess( post: _POST ) {
        this.reset();
        this.edited.emit( post );
        this.activeModal.close();
    }

    onClickCancel() {
        this.cancel.emit();
    }

    createPost() {
        let create = <_POST_CREATE> this.formGroup.value;
        create.post_config_id = this.post_config_id;
        create.file_hooks = this.files.map( (f:_FILE) => f.idx );
        if( this.user.logged ) create.name = this.userData.name;
        else create.name = 'anonymous';
        this.postData.create( create ).subscribe( ( res: _POST_CREATE_RESPONSE ) => {
            this.share.posts.unshift( res.data );
            this.createSuccess( res.data );
        }, err => this.postData.alert( err ) );
    }

    editPost() {
        let edit = <_POST_EDIT> this.formGroup.value;
        edit.idx = this.post.idx;
        edit.file_hooks = this.files.map( (f:_FILE) => f.idx );
        if( this.user.logged ) edit.name = this.userData.name;
        else edit.name = 'anonymous';
        this.postData.edit( edit ).subscribe( ( res: _POST_EDIT_RESPONSE ) => {
            Object.assign( this.post, res.data );
            this.editSuccess( res.data );
        }, err => this.postData.alert( err ) );
    }

    isCreate() {
        return this.post === void 0 || this.post.idx === void 0;
    }
    isEdit() {
        return ! this.isCreate();
    }
    onClickDismiss(){
        this.activeModal.close();
    }
    onValueChanged(data?: any) {
        if ( ! this.formGroup ) return;
        const form = this.formGroup;
        for ( const field in this.formErrors ) {
        this.formErrors[field] = '';
        const control = form.get(field);
          if ( control && control.dirty && ! control.valid ) {
              const messages = this.validationMessages[field];
              for ( const key in control.errors ) {
              this.formErrors[field] += messages[key] + ' ';
              }
          }
        }
    }
  formErrors = {
    title: '',
    content: '',
    password: ''
  };
  validationMessages = {
    title: {
      'required':      'Title is required.'
    },
    content: {
      'required':      'Content is required.'
    },
    password: {
      'required':      'Password is required.',
      'minlength':     'Password must be at least 5 characters long.',
      'maxlength':     'Password cannot be more than 128 characters long.'
    }
  };
}


