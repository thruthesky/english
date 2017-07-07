import { Component, Output, EventEmitter } from '@angular/core';
import { App } from '../../providers/app';
import { LMS } from './../../providers/lms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GuideKakaoComponent } from '../modals/guide-kakao/guide-kakao';
import { GuideSaehaComponent } from '../modals/guide-saeha/guide-saeha';
@Component({
  moduleId: module.id,
  selector: 'aside-component',
  templateUrl: 'aside.html',
  styleUrls: ['aside.scss']
})
export class AsideComponent {
  @Output() kakao = new EventEmitter<void>();
  @Output() saeha = new EventEmitter<void>();

  count: any = "로딩 중";
  constructor(public app: App,
    private lms: LMS,
    private modal: NgbModal, ) {




    this.lms.getTotalClassOfToday(re => {
      console.log("count: ", re);
      if (re == '0' || re == 0) this.count = 0;
      else {
        this.count = parseInt(re) + 1000;
        this.count = this.count.toString().split('').reverse().reduce((t, v, i, a) => {
          return t += v + (i < a.length - 1 && (i + 1) % 3 == 0 ? ',' : '');
        }, '').split('').reverse().join('');
      }
    }, e => {
      console.log("failure");
    });


  }
  onClickKakao() {
    if (this.app.widthSize === 'small') this.kakao.emit();
  }
  onClickSaeha() {
    if (this.app.widthSize === 'small') this.saeha.emit();
  }


  onClickVe() {
    this.lms.openVe();
  }

  onClickInstall() {
    this.app.share.page = 'saeha'
    this.app.scrollTo(name);
  }



}
