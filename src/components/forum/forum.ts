import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs/Subject';
import { ForumPostComponent} from '../modals/forum-post/forum-post';
import 'rxjs/add/operator/debounceTime';
import {
  PostData,
  File
} from 'angular-backend';

import { PostListComponent } from './components/post-list-component/post-list-component';

@Component({
  selector: 'forum-component',
  templateUrl: './forum.html',
  styleUrls:['./forum.scss']
})
export class ForumComponent {
  post_config_id: string = null;
  no_of_items_in_one_page: number = 5;
  active: boolean = false;
  post_config_id_qna = 'qna';
  @ViewChild('postListComponent') postListComponent: PostListComponent;

  constructor(
    private activated: ActivatedRoute,
    private modal: NgbModal,
    private file: File,
    private postData: PostData )
  {
  }

  ngOnInit() {
        this.post_config_id = this.post_config_id_qna;
   
  }
  onClickPost() {
    let modalRef = this.modal.open( ForumPostComponent );
    modalRef.componentInstance['post_config_id'] = this.post_config_id;
    modalRef.result.then( () => {
      this.postListComponent.loadPostData( );
    }).catch( e => console.log('exit ' + e ) );
  }
}
