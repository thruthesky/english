import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ShareService } from '../../../../providers/share-service';
import { ForumPostComponent} from '../../../modals/forum-post/forum-post';
import {
    PostData,
    _LIST, _POST_LIST_RESPONSE,
    _POST, _POSTS,
    _FILE
} from '../../../../angular-backend/angular-backend';
@Component({
    selector: 'post-list-component',
    templateUrl: 'post-list-component.html'
})
export class PostListComponent  {
    @Input() no_of_items_in_one_page: number = 0;
    constructor(
        public share: ShareService,
        private postData: PostData,
        private modal: NgbModal,
    ) {

    }
    onClickEdit(post) {
        console.log("My post:",post);
        let modalRef = this.modal.open( ForumPostComponent );
        modalRef.componentInstance['post'] = post;
        modalRef.result.then( () => {
        }).catch( e => console.log('exit ' + e ) );
    }
    onClickDelete(id) {
        console.log("My post id:",id);
    }
    load( id ) {
        this.share.post_config_id = id;
        let req: _LIST = {
            where: 'parent_idx=?',
            bind: '0',
            order: 'idx desc',
            extra: {
                post_config_id: this.share.post_config_id,
                user: true,
                meta: true,
                file: true,
                comment: true
            }
        };
        this.postData.list( req ).subscribe((res: _POST_LIST_RESPONSE ) => {
                console.log( res.data.posts );
                this.share.posts = res.data.posts;
        }, err => this.postData.alert(err));
    }

}
