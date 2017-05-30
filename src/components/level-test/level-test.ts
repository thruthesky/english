import {Component} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from "@angular/forms";
import {App} from './../../providers/app';
import {FirebaseChat} from './../../providers/firebase';
import {User, PostData, _POST_CREATE, _POST_CREATE_RESPONSE, _POST} from "angular-backend";
import {ShareService} from "../../providers/share-service";

@Component({
  selector: 'level-test-component',
  templateUrl: 'level-test.html',
  styleUrls: ['./level-test.scss']
})
export class LevelTestComponent {

  uid:string;
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
      'required': 'Name is required.',
    },
    phone: {
      'required': 'phone is required.',
    },
    date: {
      'required': 'Date is required.',
    },
    time: {
      'required': 'time is required.',
    }


  };

  constructor(public app: App,
              private user: User,
              private fb: FormBuilder,
              private fc: FirebaseChat,
              private postData: PostData,
              public share: ShareService,
  ) {


    this.uid = this.app.getClientId();


    this.form = fb.group({
      name:   ['', [Validators.required]],
      phone:  ['', [Validators.required]],
      date:   ['', [Validators.required]],
      time:   ['', [Validators.required]]
    });





    for (let i = 0; i < 100; i++) {
      let d = (new Date);
      let newDate = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i);
      if (newDate.getDay() == 0 || newDate.getDay() == 6) continue;
      //console.log(newDate.toString());
      let date = newDate.getMonth() + '-' + newDate.getDate();
      let day = {date: date, day: app.DAYS[newDate.getDay()]};
      this.days.push(day);
      if ( ! this.selectedDay ) {
        this.selectedDay = date;
        this.form.patchValue({date: day.date + " (" + day.day + ")" });
      }
      if (this.days.length >= 3) break;
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

  onClickSubmitLevelTest(){
    console.log("onClickSubmitLevelTest::", this.form.value);
    // console.log("formError::", this.formErrors);
    // console.log("form.value::", this.form.value);

    if ( this.form.value.name.length == 0 ) return this.formErrors.name = "Name is required";
    if ( this.form.value.phone.length == 0 ) return this.formErrors.phone = "Phone is required";
    if ( this.form.value.time.length == 0 ) return this.formErrors.time = "Time is required";

    if(this.form.status == 'INVALID') return this.formValid = false;

    this.createPost();

    this.formValid  = true;
  }



  createPost() {
    console.log('createPost::');
    let p = "레벨 테스트 신청: " + this.form.value.name + "님께서 " + this.form.value.date + " " + this.form.value.time + "에 레벨테스트를 신청하였습니다.";
    let create = <_POST_CREATE> {
      title: p,
      content: p,
      post_config_id: 'qna'
    };
    if( this.user.logged ) create.name = this.user.info.name;
    else {
      create.password = this.form.value.name+this.form.value.phone;
      create.name = 'anonymous';
    }
    this.postData.create( create ).subscribe( ( res: _POST_CREATE_RESPONSE ) => {
      this.share.posts.unshift( res.data );
      this.fc.sendLevelTest( this.form.value, this.uid ).then( res => {
        console.log('message::', res);
        this.app.confirmation("Message Sent Success");
        this.form.reset();
      }, err => {
        console.log('messageError', err);
      }).catch( e => {
        console.log('ErrorOnCatch', e);
      });
      console.log( res );
    }, err => this.postData.alert( err ) );
  }




  onValueChanged() {
    if (!this.form) return;
    this.formValid = true;
    const form = this.form;
    for (const field in this.formErrors) {
      this.formErrors[field] = '';        // clear previous error message (if any)
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }
}
