import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { App } from '../../../providers/app';
import {
    _POST,
    _COMMENT, _COMMENT_CREATE, _COMMENT_EDIT, _COMMENT_EDIT_RESPONSE, _DELETE_RESPONSE,
    PostComment
} from 'angular-backend';
@Component({
    selector: 'post-view-component',
    templateUrl: 'post-view.html',
    styleUrls: ['post-view.scss']
})

export class PostViewModal {
    post: _POST = <_POST>{};
    commentContent: string = '';
    commentEditContent: string = '';
    mode: string = '';
    constructor(
        public app: App,
        private activeModal: NgbActiveModal,
        private postComment: PostComment
    ) {
    }
    ngOnInit() {
        // console.log("post on view:", this.post);
    }
    onClickDismiss() {
        this.activeModal.close();
    }


    onClickCreateComment() {

        let req: _COMMENT_CREATE = {
            parent_idx: this.post.idx,
            content: this.commentContent
        };


        this.postComment.create(req).subscribe(res => {

            //console.log(res);

            let post = this.post;
            if (post === void 0) return;
            if (post.comments === void 0) post.comments = [];

            let i = post.comments.findIndex((c: _COMMENT) => c.idx == res.data.parent_idx);
            if (i == -1) post.comments.unshift(res.data);
            else {
                post.comments.splice(i + 1, 0, res.data);
            }

            this.mode = '';
            this.commentContent = '';

            // this.createSuccess(res.data);
        }, err => this.postComment.alert(err));


    }

    onClickEditComment(comment) {



        let req: _COMMENT_EDIT = {
            idx: comment.idx,
            content: this.commentEditContent
        };

        this.postComment.edit(req).subscribe((res: _COMMENT_EDIT_RESPONSE) => {
            Object.assign(comment, res.data); // two-way binding. pass-by-reference.
            comment.mode = '';
        }, err => this.postComment.alert(err));

    }


    onClickDelete(comment) {

        let req = { idx: comment.idx };
        this.postComment.delete(req).subscribe((res: _DELETE_RESPONSE) => {
            comment.deleted = 1;
            comment.content = "Deleted...";
            comment.files = [];
            comment.user = <any>{};
        }, err => this.postComment.alert(err));


    }




}
