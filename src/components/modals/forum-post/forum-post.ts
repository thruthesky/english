import { Component, EventEmitter, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
    PostData,
    File,
    NUMBERS,
    _FILE,
    _POST, _POST_CREATE, _POST_CREATE_RESPONSE,
    _POST_EDIT, _POST_EDIT_RESPONSE
} from './../../../angular-backend/angular-backend';
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

    post_config_id: string;
    post: _POST = <_POST>{};


    formGroup: FormGroup;
    files: Array<_FILE> = [];

    
    constructor(
        public share: ShareService,
        private fb: FormBuilder,
        public file: File,
        private postData: PostData,
        private activeModal  : NgbActiveModal
    ) {
    }

    ngOnInit() {
        this.createForm();
    }
    createForm() {

        if ( this.isCreate() ) {
            this.files = [];
            this.formGroup = this.fb.group({
                title: [],
                content: []
            });
        }
        else { // edit
            this.files = this.post.files ? this.post.files : [];
            this.formGroup = this.fb.group({
                title: [ this.post.title ],
                content: [ this.post.content ]
            });
        }
        

    }

    onSubmit() {
        console.log( this.formGroup.value );
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
        console.log("emit: ", post);
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
        console.log("create:",create)
        this.postData.create( create ).subscribe( ( res: _POST_CREATE_RESPONSE ) => {
            this.share.posts.unshift( res.data );
            console.log( res );
            this.createSuccess( res.data );
        }, err => this.postData.alert( err ) );
    }

    editPost() {
        let edit = <_POST_EDIT> this.formGroup.value;
        edit.idx = this.post.idx;
        edit.file_hooks = this.files.map( (f:_FILE) => f.idx );
        console.log('post-form-conpoment::editPost()', edit);
        this.postData.edit( edit ).subscribe( ( res: _POST_EDIT_RESPONSE ) => {
            console.log( 'after edit: ', res );
            Object.assign( this.post, res.data ); // two-way binding.
            //this.post = res.data;
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

}
/////////////////////////////

// import { Component, OnInit } from '@angular/core';
// import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// import { App } from '../../../providers/app';
// import { FormBuilder, FormGroup } from '@angular/forms';
// import {
//     PostData,
//     File,
//     NUMBERS,
//     _FILE,
//     _POST, _POST_CREATE, _POST_CREATE_RESPONSE,
//     _POST_EDIT, _POST_EDIT_RESPONSE
// } from './../../../angular-backend/angular-backend';
// import { ShareService } from '../../../providers/share-service';
// @Component({
//     selector: 'forum-post-component',
//     templateUrl: 'forum-post.html',
//     styleUrls: ['forum-post.scss']
// })

// export class ForumPostComponent implements OnInit {
  
//     constructor(
//         private activeModal  : NgbActiveModal,
//         private app          : App,
//         private post         : PostData,
//     ) {
//     }

//     ngOnInit() {
//     }
//     onClickDismiss(){
//         this.activeModal.close();
//     }
    
//     onClickPost() {
//        this.post.create( this.form ).subscribe( (res) => {
//             console.log( res );
//             this.app.myEvent.emit( { eventType:"post" } );
//             this.onClickDismiss();
//         }, error => {
//             this.error( error );
//         } );
//     }
//     error( error ) {
//         return this.post.errorResponse( error );
//     }
// }

////////////////////////

