import {Component, OnInit, ViewChild} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ForumPostComponent} from '../modals/forum-post/forum-post';
import 'rxjs/add/operator/debounceTime';
import { PostListComponent } from './components/post-list-component/post-list-component';

@Component({
  selector: 'forum-component',
  templateUrl: './forum.html',
  styleUrls: ['./forum.scss']
})
export class ForumComponent implements  OnInit {
  post_config_id: string = null;
  no_of_items_in_one_page: number = 5;
  active: boolean = false;
  post_config_id_qna = 'qna';
  @ViewChild('postListComponent') postListComponent: PostListComponent;

  constructor( private modal: NgbModal ) {
  }

  ngOnInit() {
        this.post_config_id = this.post_config_id_qna;
  }
  onClickPost() {
    let modalRef = this.modal.open( ForumPostComponent, { windowClass: 'enhance-modal'} );
    modalRef.componentInstance['post_config_id'] = this.post_config_id;
    modalRef.result.then( () => {
      this.postListComponent.loadPostData( );
    }).catch( e => {} );
  }
}
