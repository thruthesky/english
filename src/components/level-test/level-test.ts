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
      console.log(newDate.toString());
      this.days.push({date: newDate.getMonth() + '-' + newDate.getDate(), day: app.DAYS[newDate.getDay()]});
      if (this.days.length >= 5) break;
    }


    this.form.valueChanges
      .debounceTime(1000)
      .subscribe( res => {
        this.onValueChanged(res);

      } );

  }

  onClickSubmitLevelTest(){
    console.log("this.form::", this.form.status);

    console.log("formError::", this.formErrors);
    if(this.form.status == 'INVALID') return this.formValid = false;

    this.fc.sendLevelTest(this.form.value)
    this.formValid  = true;
  }



  onValueChanged(data?: any) {
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
