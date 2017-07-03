import { Component, Output, EventEmitter } from '@angular/core';
import { App } from '../../providers/app';
@Component({
  moduleId: module.id,
  selector: 'aside-component',
  templateUrl: 'aside.html',
  styleUrls: ['aside.scss']
})
export class AsideComponent{
  @Output() kakao = new EventEmitter<void>();
  @Output() saeha = new EventEmitter<void>();
  constructor( public app: App) {}
  onClickKakao() {
    if( this.app.widthSize == 'small') this.kakao.emit();
    console.log("onClickKakao");
  }
  onClickSaeha() {
    if( this.app.widthSize == 'small') this.saeha.emit();
    console.log("onClickSaeha");
  }
}
