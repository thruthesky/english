import { Component, Input } from '@angular/core';
@Component({
    selector: 'post-view-component',
    templateUrl: 'post-view-component.html'
})
export class PostViewComponent {
    @Input() post;
    showPostEditForm: boolean = false;
    showCommentForm: boolean = false;
}