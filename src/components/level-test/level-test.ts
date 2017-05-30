import {Component} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from "@angular/forms";
import {App} from './../../providers/app';
import {FirebaseChat} from './../../providers/firebase';

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
    studentName: '',
    name: '',
    phone: '',
    date: '',
    time: ''
  };

  validationMessages = {
    studentName: {
      'required': 'Student is required.',
    },
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
              private fb: FormBuilder,
              private fc: FirebaseChat
  ) {


    this.uid = this.app.getClientId();

    this.form = fb.group({
      studentName: [this.app.user.info.id, [Validators.required]],
      name: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      date: ['', [Validators.required]],
      time: ['', [Validators.required]]
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
    // console.log("this.form::", this.form.status);
    // console.log("formError::", this.formErrors);
    // console.log("form.value::", this.form.value);

    if ( this.form.value.name.length == 0 ) return this.formErrors.name = "Name is required";
    if ( this.form.value.phone.length == 0 ) return this.formErrors.phone = "Phone is required";
    if ( this.form.value.time.length == 0 ) return this.formErrors.time = "Time is required";

    if(this.form.status == 'INVALID') return this.formValid = false;

    this.fc.sendLevelTest( this.form.value, this.uid ).then( res => {
      console.log('message::', res);
      this.app.confirmation("Message Sent Success");
      this.form.reset();
    }, err => {
      console.log('messageError', err);
    }).catch( e => {
      console.log('ErrorOnCatch', e);
    });

    this.formValid  = true;
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
