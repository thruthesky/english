import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { App } from '../../../providers/app';
import {
    _POST
} from 'angular-backend';
@Component({
    selector: 'post-view-component',
    templateUrl: 'post-view.html',
    styleUrls: ['post-view.scss']
})

export class PostViewModal{
    post: _POST = <_POST>{};
    constructor(
        private app         : App,
        private activeModal : NgbActiveModal ){
    }
    ngOnInit() {
    }
    onClickDismiss(){
        this.activeModal.close();
    }
}