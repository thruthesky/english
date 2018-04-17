import { Component } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { FirebaseChat } from '../../../providers/firebase';
import { ShareService } from '../../../providers/share-service';

import { LMS } from '../../../providers/lms';
import { Message } from '../../../providers/message';


import {
  User,
  File, _POST_CREATE, _POST_CREATE_RESPONSE, PostData,
} from 'angular-backend';
import {App} from "../../../providers/app";
@Component({
  selector: 'level-test-form-component',
  templateUrl: 'level-test-form.html',
  styleUrls: ['level-test-form.scss']
})

export class LevelTestFormComponent {

  name;
  phone;
  email;

  holidays = [];

  selectedDay;
  selectedTime;
  agreement;

  errorMessage;
  days = [];
  times = {};
  constructor(
    public app: App,
    private activeModal: NgbActiveModal,
    private lms: LMS,
    public user: User,
    public file: File,
    private fc: FirebaseChat,
    public share: ShareService,
    private message: Message,
    private postData: PostData,
  ) {


    this.lms.getAllHolidays(holidays => {
      if ( holidays && holidays.length ) {
        holidays.forEach( holiday => {
         this.holidays.push(holiday['date']);
        });
      }
      // console.log("Holidays:: ", this.holidays);
    });


    const d = (new Date);
    const today = '' + d.getFullYear() + this.app.add0((d.getMonth() + 1)) + this.app.add0(d.getDate());
    // console.log("today:: ", today);
    for (let i = 0; i < 100; i++) {
      const newDate = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i);
      if (newDate.getDay() == 0 || newDate.getDay() == 6) continue;
      const hdate = '' + newDate.getFullYear() + this.app.add0((newDate.getMonth() + 1)) + this.app.add0(newDate.getDate());
      // console.log("hdate::", hdate);
      // if (this.holidays.includes(hdate)) continue;


      let currentTime = 2;
      if ( today == hdate ) {
        if ( d.getHours() > 13) currentTime = d.getHours() - 11;
      }

      let times = [];
      for (let x = currentTime; x <= 11; x++) {
        times.push(`오후 ${x}시`);
        times.push(`오후 ${x}시 30분`);
      }
      if ( !times.length ) continue;

      const date = '' + newDate.getFullYear() + '-' + this.app.add0((newDate.getMonth() + 1)) + '-' + this.app.add0(newDate.getDate());
      this.times[date] = times;

      const day = { date: date, day: app.DAYS[newDate.getDay()] };
      this.days.push(day);
      if (!this.selectedDay) {
        this.selectedDay = date;
      }




      if (this.days.length >= 2) break;
    }

    // console.log("DAYS:: ", this.days);
    // console.log("TIMES:: ", this.times);
  }

  onClickDismiss() {
    this.activeModal.close();
  }

  onClickSubmit() {
    this.errorMessage = '';
    if ( !this.name ) {
      this.errorMessage = "이름을 입력하세요.";
      return;
    }
    if ( !this.phone ) {
      this.errorMessage = "전화번호를 입력하세요.";
      return;
    }
    if ( !this.email ) {
      this.errorMessage = "이메일 주소를 입력하세요.";
      return;
    }
    if ( !this.selectedTime ) {
      this.errorMessage = "시간을 선택하세요.";
      return;
    }
    if ( !this.agreement ) {
      this.errorMessage = "개인정보 수집에 동의를 해 주세요.";
      return;
    }


    let p = `레벨 테스트 신청: ${this.name} 님께서 ${this.selectedDay} ${this.selectedTime} 에 레벨테스트를 신청하였습니다.`;
    let create = <_POST_CREATE>{
      title: p,
      content: p,
      post_config_id: 'leveltest',
      mobile: this.phone,
      email: this.email
    };
    if (this.user.logged) create.name = this.user.info.name;
    else {
      create.password = this.name + this.phone;
      create.name = 'anonymous';
    }
    this.postData.create(create).subscribe((res: _POST_CREATE_RESPONSE) => {
      this.share.posts.unshift(res.data);
      this.message.send('Level Test Form', p);
      let levelTestValue = {
        date: this.selectedDay,
        time: this.selectedTime,
        name: this.name,
        phone: this.phone
      };
      levelTestValue['ipAddress'] = window['client_ip_address'] ? window['client_ip_address'] : 'unknown ip';
      this.fc.sendLevelTest(levelTestValue).then(() => {
        this.app.alertModal("레벨테스트가 신청되었습니다. 관리자가 확인 후 레벨테스트를 예약하고 연락을 드릴 것입니다.");
        this.onClickDismiss();
      }, err => {
      });
    }, err => this.postData.alert(err));

  }

}
