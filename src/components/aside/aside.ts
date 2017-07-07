import { Component, Output, EventEmitter } from '@angular/core';
import { App } from '../../providers/app';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GuideKakaoComponent } from '../modals/guide-kakao/guide-kakao';
import { GuideSaehaComponent } from '../modals/guide-saeha/guide-saeha';
@Component({
  moduleId: module.id,
  selector: 'aside-component',
  templateUrl: 'aside.html',
  styleUrls: ['aside.scss']
})
export class AsideComponent{
  @Output() kakao = new EventEmitter<void>();
  @Output() saeha = new EventEmitter<void>();
  constructor( public app: App,
          private modal: NgbModal,) {}
  onClickKakao() {
    if ( this.app.widthSize === 'small') this.kakao.emit();
  }
  onClickSaeha() {
    if ( this.app.widthSize === 'small') this.saeha.emit();
  }
}
