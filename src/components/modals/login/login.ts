import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { App } from '../../../providers/app';

import { FindIdModal } from '../find-id/find-id';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password';
import { RegisterComponent } from '../register/register';

import {
    User,
    _RESPONSE,
    _USER_LOGIN,
    _USER_LOGIN_RESPONSE
} from 'angular-backend';

@Component({
    selector: 'login-component',
    templateUrl: 'login.html',
    styleUrls: ['login.scss']
})

export class LoginModal implements OnInit {
    loading: boolean = false;
    result: _RESPONSE = <_RESPONSE>{};
    saveid: boolean = false;
    form: FormGroup;
    constructor(
        public activeModal: NgbActiveModal,
        public app: App,
        private modal: NgbModal,
        private fb: FormBuilder,
        private user: User) {
            this.createForm();

    }

    ngOnInit() {
        let id = localStorage.getItem('saveid');
        if (id) {
            this.form['id'] = id;
            this.saveid = true;
        }


            this.app.initializeNaverLogin();
    }
    createForm() {
        this.form = this.fb.group({
            id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(32)]],
            password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(128)]]
        });
        this.form.valueChanges
            .debounceTime(1000)
            .subscribe(res => this.onValueChanged(res));
    }
    onValueChanged(data?: any) {
        if (!this.form) return;
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
    onClickDismiss() {
        this.activeModal.close('close');
    }


    onClickForgotPassword() {
        this.activeModal.close();
        this.modal.open(ForgotPasswordComponent, { windowClass: 'enhance-modal' } )
    }

    onClickFindId() {
        this.activeModal.close();
        this.modal.open(FindIdModal, { windowClass: 'enhance-modal' } );
    }


    onClickRegister() {
        this.activeModal.close();
        this.modal.open(RegisterComponent, { windowClass: 'enhance-modal' } );
    }

    onClickLogin() {
        if (this.validate() == false) return;
        let loginData = this.form.value;
        this.loading = true;
        this.user.login(loginData).subscribe((res: _USER_LOGIN_RESPONSE) => {
            this.success(res);
            let checkRequired =   this.modal.open(RegisterComponent, { windowClass: 'enhance-modal' } );
            checkRequired.componentInstance.checkRequired = true;
        }, error => {
            this.error(error);
        });
    }

    success(res: _USER_LOGIN_RESPONSE) {
        this.app.myEvent.emit({
            eventType: "login-success"
        });
        this.loading = false;
        this.activeModal.close('success');
    }
    error(error) {
        this.loading = false;
        if ( error['message'] == 'user-not-exist' ) error['message'] = "아이디를 잘못입력하셨습니다.";
        else if ( error['message'] == 'wrong-password' ) error['message'] = '비밀번호를 잘못입력하셨습니다.';
        this.result = error;
        return this.user.errorResponse(error);
    }
    onEnterLogin(event) {
        if (event.keyCode == 13) {
            this.onClickLogin();
        }
    }

    validate() {
        let loginData = this.form.value;
        if (loginData.id && loginData.id.match(/[.#$\[\]]/g)) return this.errorResult(' valid id ');
        if (!loginData.id) return this.errorResult('id ');
        if (!loginData.password) return this.errorResult('password ');
        return true;
    }

    errorResult(name) {
        this.result = <any>{ message: name + "는 필수입니다." };
        return false;
    }
    validateError(name) {
        this.app.alert(name + '는 필수입니다.');
        return false;
    }
    formErrors = {
        id: '',
        password: ''
    };
    validationMessages = {
        id: {
            'required': '아이디를 입력하세요.',
            'minlength': '아이디는 3 글자 이상 입력해야합니다.',
            'maxlength': 'ID cannot be more than 32 characters long.'
        },
        password: {
            'required': '비밀번호를 입력하세요.',
            'minlength': '비밀번호는 5 글자 이상 입력해야 합니다.',
            'maxlength': 'Password cannot be more than 128 characters long.'
        },
    };

    onClickNaverLogin() {
      this.app.onClickLoginWithNaver();
      this.activeModal.close('close::naver');
    }

    onClickFacebookLogin() {
      this.app.onClickLoginWithFacebook();
      this.activeModal.close('close::facebook');
    }

    onClickKakaoLogin() {
      this.app.onClickLoginWithKakao();
      this.activeModal.close('close::kakao');
    }




}
