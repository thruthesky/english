import {Component} from '@angular/core';
import {FormGroup, FormBuilder, Validators, AbstractControl} from "@angular/forms";
import {App} from './../../providers/app';
import {Message} from './../../providers/message';

import {FirebaseChat} from './../../providers/firebase';
import {
  User, PostData, _POST_CREATE, _POST_CREATE_RESPONSE, _USER_DATA_RESPONSE, _RESPONSE,
  _USER_RESPONSE
} from "angular-backend";
import {ShareService} from "../../providers/share-service";

@Component({
  selector: 'level-test-component',
  templateUrl: 'level-test.html',
  styleUrls: ['./level-test.scss']
})
export class LevelTestComponent {

  uid: string;
  days = [];
  selectedDay;
  form: FormGroup;
  formValid = true;
  formErrors = {
    name: '',
    phone: '',
    date: '',
    time: ''
  };

  validationMessages = {
    name: {
      'required':      '이름을 입력하십시오.',
      'maxlength':     '이름은 32 글자 이하이어야 합니다.'
    },
    phone: {
      'required':     '전화번호를 입력하십시오.',
      'minlength':    '전화번호는 숫자 8 자리 이상이어야 합니다.',
      'maxlength':    '전화번호는 숫자 15 자리 이하이어야 합니다.',
      'malformed':    '잘못된 전화번호 형식입니다.'
    },
    date: {
      'required': 'Date is required.',
    },
    time: {
      'required': 'time is required.',
    }


  };


  data = <_USER_RESPONSE>{};

  constructor(public app: App,
              private user: User,
              private fb: FormBuilder,
              private fc: FirebaseChat,
              private postData: PostData,
              public share: ShareService,
              private message: Message
  ) {


    this.uid = this.app.getClientId();

    this.form = fb.group({
      name:   ['' , [Validators.required, Validators.maxLength(32)]],
      phone:  ['', [Validators.required, this.mobileValidator]],
      date:   ['', [Validators.required]],
      time:   ['', [Validators.required]]
    });

    if ( user.logged ) {
      this.user.data().subscribe((res: _USER_DATA_RESPONSE) => {
        this.data = res.data.user;
        this.form.patchValue( {
          name: this.data.name,
          phone: this.data.mobile,
        });
      }, (err: _RESPONSE) => {
        //console.log('error::', err);
      });
    }


    let d = (new Date);
    //console.log('newDate::', new Date(d.getFullYear(), d.getMonth(), d.getDate()));
    for (let i = 0; i < 100; i++) {
      let newDate = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i);
      if (newDate.getDay() == 0 || newDate.getDay() == 6) continue;
      let date = ( newDate.getMonth() + 1 ) + '-' + newDate.getDate();
      let day = {date: date, day: app.DAYS[newDate.getDay()]};
      this.days.push(day);
      if ( ! this.selectedDay ) {
        this.selectedDay = date;
        this.form.patchValue( {date: day.date + " (" + day.day + ")" } );
      }
      if (this.days.length >= 5) break;
    }





    this.form.valueChanges
      .debounceTime(1000)
      .subscribe( () => {
        this.onValueChanged();
      } );
  }

  getDay( date ) {
    return this.days.find( v => v['date'] == date ).day;
  }

  onClickSubmitLevelTest() {

    if ( this.form.value.name.length == 0 ) {
      this.formErrors.name = "이름을 입력하셔야 합니다.";
      return this.app.alertModal( this.formErrors.name );
    }
    if ( this.form.value.phone.length == 0 ) {
      this.formErrors.phone = "전화번호를 입력하셔야 합니다.";
      return this.app.alertModal( this.formErrors.phone );
    }
    if ( this.form.value.time.length == 0 ) {
      this.formErrors.time = "시간을 입력하셔야 합니다.";
      return this.app.alertModal(this.formErrors.time)
    }
    if (this.form.status == 'INVALID') return this.formValid = false;

    this.createPost();

    this.formValid  = true;
  }



  createPost() {
    let p = "레벨 테스트 신청: " + this.form.value.name + "님께서 " + this.form.value.date + " " + this.form.value.time + "에 레벨테스트를 신청하였습니다.";
    let create = <_POST_CREATE> {
      title: p,
      content: p,
      post_config_id: 'qna',
      mobile: this.form.value.phone
    };
    if( this.user.logged ) create.name = this.user.info.name;
    else {
      create.password = this.form.value.name+this.form.value.phone;
      create.name = 'anonymous';
    }
    this.postData.create( create ).subscribe( ( res: _POST_CREATE_RESPONSE ) => {
      this.share.posts.unshift( res.data );
      this.message.send('레벨테스트', p );
      let levelTestValue = this.form.value;
      levelTestValue['ipAddress'] = window['client_ip_address'] ? window['client_ip_address'] : 'unknown ip';
      this.fc.sendLevelTest( levelTestValue ).then( () => {
        this.app.alertModal("레벨테스트가 신청되었습니다. 관리자가 확인 후 레벨테스트를 예약하고 연락을 드릴 것입니다.");
        this.form.reset();
      }, err => {
      }).catch( e => {
      });
    }, err => this.postData.alert( err ) );
  }




  onValueChanged() {
    if (!this.form) return;
    this.formValid = true;
    const form = this.form;
    for (const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }


  mobileValidator(c: AbstractControl): { [key: string]: any } {
    if ( ! c.value ) return;
    if (c.value && c.value.length && c.value.length < 9) {
      return { 'minlength': '' };
    }
    if (c.value &&  c.value.length &&  c.value.length > 15) {
      return { 'maxlength': '' };
    }
    let re = new RegExp(/^(\d+-?)+\d+$/).test(<string>c.value);
    if (re) return;
    else return { 'malformed': '' };
  }

}
