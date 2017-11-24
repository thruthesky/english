import { Component, EventEmitter, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Message } from './../../../providers/message';
import {
    PostData,
    User,
    File,
    _FILE,
    _POST, _POST_CREATE,
    _POST_CREATE_RESPONSE,
    _POST_EDIT,
    _POST_EDIT_RESPONSE,
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
    userName: string = null;

    category: string = '레벨테스트';
    constructor(
        public share: ShareService,
        private fb: FormBuilder,
        public file: File,
        private postData: PostData,
        private activeModal  : NgbActiveModal,
        public  user         : User,
        private message: Message
    ) {
        if ( this.user.logged ) this.userName = user.info.name;
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
                title: [ '', [] ],
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
        this.message.send( "질문", post.title );
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
        let create: _POST_CREATE = Object.assign({}, this.formGroup.value );
        create['title'] = '(' + this.category + ') ' + create['title'];
        create.post_config_id = this.post_config_id;
        create.file_hooks = this.files.map( (f:_FILE) => f.idx );
        if( this.user.logged ) create.name = this.userName;
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
        if( this.user.logged ) edit.name = this.userName;
        else edit.name = 'anonymous';
        this.postData.edit( edit ).subscribe( ( res: _POST_EDIT_RESPONSE ) => {
            Object.assign( this.post, res.data );
            this.editSuccess( res.data );
        }, err => this.postData.alert( err ) );
    }

    isCreate() {
        return this.post === void 0 || this.post.idx === void 0;
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
    content: {
      'required':      '내용을 입력하십시오.'
    },
    password: {
      'required':      '비밀번호를 입력하십시오.',
      'minlength':     '비밀번호는 5자리 이상이어야 합니다.',
      'maxlength':     'Password cannot be more than 128 characters long.'
    }
  };
}


