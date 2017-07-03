import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'guide-kakao-component',
    templateUrl: 'guide-kakao.html'
})

export class GuideKakaoComponent{
    constructor( private activeModal : NgbActiveModal ){}
    onClickDismiss(){
        this.activeModal.close();
    }
}