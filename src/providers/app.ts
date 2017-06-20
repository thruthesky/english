import { Injectable, NgZone, EventEmitter } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import {User, Meta, _USER_LOGIN_RESPONSE, _USER_CREATE, _META_LIST_RESPONSE, _LIST} from 'angular-backend';

import { LMS } from './lms';

// import * as config from './../app/config';

import { Alert } from './bootstrap/alert/alert';
import { Confirm } from './bootstrap/confirm/confirm';
import { FirebaseChat } from "./firebase";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { RegisterComponent } from "../components/modals/register/register";

import { ShareService } from '../providers/share-service';


export interface SOCIAL_LOGIN {
    provider: string;
    uid: string;
    name: string;
    email: string;
};

export interface ALERT_OPTION {
    title?: string;
    content: string;
    'class'?: string;
    timeout?: number;
}

export interface _SITE_CONFIGURATION {
  company_name_variation?: string;
  company_name?: string;
  company_email?: string;
  phone_number?: number;
  copyright_line1?: string;
  copyright_line2?: string;
  copyright_line3?: string;
  copyright_line4?: string;
}


export enum DAYS_EN { 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' };
// export const is_chrome = /chrome/.test( navigator.userAgent.toLowerCase() );

@Injectable()
export class App {

    config: _SITE_CONFIGURATION = {};


    site_config = 'site_config';
    DAYS = ['일', '월', '화', '수', '목', '금', '토'];

    public myEvent: EventEmitter<any>;
    width: number = 0;
    scrollId: string = null;
    headerHeight = 64; // 109 for small.
    socialLogin: SOCIAL_LOGIN = null;

    constructor(
        private ngZone: NgZone,
        private alertService: Alert,
        private confirmService: Confirm,
        public afAuth: AngularFireAuth,
        public user: User,
        public meta: Meta,
        private fc: FirebaseChat,
        private modal: NgbModal,
        private lms: LMS,
        private share: ShareService
    ) {
        this.myEvent = new EventEmitter();
    }
    /**
    * Everytime window resizes, this is set.
    */
    setWidth(width) {
        this.width = width;
        this.renderPage();

        if ( this.widthSize == 'big' ) this.headerHeight = 64;
        else this.headerHeight = 109;




        // this.makeSureHeaderHeight();
        // setTimeout(() => this.makeSureHeaderHeight(), 1000);
        // setTimeout(() => this.makeSureHeaderHeight(), 3000);
        // setTimeout(() => this.makeSureHeaderHeight(), 5000);
        // setTimeout(() => this.makeSureHeaderHeight(), 7500);
        // setTimeout(() => this.makeSureHeaderHeight(), 10000);
        // setTimeout(() => this.makeSureHeaderHeight(), 15000);
        // setTimeout(() => this.makeSureHeaderHeight(), 20000);
        // setTimeout(() => this.makeSureHeaderHeight(), 30000);
        // setTimeout(() => this.makeSureHeaderHeight(), 60000);
    }


    makeSureHeaderHeight() {

        let header = document.querySelector('header nav');
        if (!header) return;
        this.headerHeight = header.clientHeight;
        console.log("headerHeight: ", this.headerHeight);
    }

    renderPage() {
        this.ngZone.run(() => {
        });
    }
    private getWidth() {
        return this.width;
    }

    get widthSize(): 'small' | 'big' {
        let size: 'small' | 'big' = 'small';
        if (this.getWidth() >= 768) size = 'big';
        return size;
    }

    get marginTop() {
        return this.headerHeight;
    }



    /**
     * @warning This may return false if this is called before 'deviceready'event fired.
     *  so, be sure you call it after 'deviceready' event.
     */
    isCordova() {
        if (!!window['cordova']) return true;
        if (document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1) return true;
        return false;
    }

    /**
     * Returns the array of 'section#names' and its top position in the document.
     *
     */
    getParts() {
        let nodes = document.querySelectorAll('section.part');
        let nodesArray = Array.from(nodes);
        let parts = [];
        if (nodesArray && nodesArray.length) {
            for (let i = 0, len = nodesArray.length; i < len; i++) {
                let el = nodesArray[i];
                let pos = this.getOffset(el);
                if (el.id == 'intro') pos.top = 0;
                parts.push({ id: el.id, top: pos.top });
            }
        }
        return parts;
    }




    scrollTo(id) {
        console.log("clicked id: ", id);
        let parts = this.getParts();
        if ( parts && parts.length) {
            for (let i = 0, len = parts.length; i < len; i++) {
                if (parts[i]['id'] == id) {
                    console.log("top of the section: ", parts[i]['top']);
                    let p = parts[i]['top'] - this.headerHeight;
                    console.log('scroll To Y: ', p);
                    console.log("headerHeight: ", this.headerHeight);
                    this.scrollToY(p);
                    break;
                }
            }
        }
        return;
    }
    
    /**
     * @note No need to cache for speedup since it is only being called once every bounce time.
     */
    scrolled(event?) {
        let windowTop = Math.round(this.getWindowOffset().top);
        let selectedId = null;
        let parts = this.getParts();
        if (parts && parts.length) {
            for (let i = 0, len = parts.length; i < len; i++) {
                let part = parts[i];
                selectedId = part.id;
                if (i < len - 1) {
                    let nextPart = parts[i + 1];
                    let pTop = Math.ceil( nextPart.top );
                    console.log(`if (${pTop} > ${windowTop} + ${this.marginTop}) break;`);
                    if (pTop > (windowTop + this.marginTop)) break;
                }
            }
        }
        console.log("selectedId:", selectedId)
        this.scrollId = selectedId;

        this.renderPage();
    }


    /**
     * To get offset of an element.
     */
    getOffset(el) {
        el = el.getBoundingClientRect();
        return {
            left: Math.round(el.left + window.pageYOffset),
            top: Math.round(el.top + window.pageYOffset)
        };

    }

    getWindowOffset() {
        return {
            top: window.pageYOffset || document.documentElement.scrollTop,
            left: window.pageXOffset || document.documentElement.scrollLeft
        };
    }




    alert(str) {
        alert(str);
    }





    /**
    *
    *
    * @code
    *          this.scrollToY( parts[i]['top'] - HEADER_HEIGHT );
    *          scrollToY(0, 1500, 'easeInOutQuint');
    * @endcode
    *
    * @attention the speed and ease does not look like working.
    * @param speed -
    * @param easing - easeOutSine, easeInOutSine, easeInOutQuint
    */
    scrollToY(scrollTargetY, speed?, easing?) {

        // first add raf shim
        // http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
        window['requestAnimFrame'] = (function () {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window['mozRequestAnimationFrame'] ||
                function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
        })();


        // scrollTargetY: the target scrollY property of the window
        // speed: time in pixels per second
        // easing: easing equation to use

        var scrollY = window.pageYOffset,
            scrollTargetY = scrollTargetY || 0,
            speed = speed || 2000,
            easing = easing || 'easeOutSine',
            currentTime = 0;

        // min time .1, max time .8 seconds
        var time = Math.max(.1, Math.min(Math.abs(scrollY - scrollTargetY) / speed, .8));

        // easing equations from https://github.com/danro/easing-js/blob/master/easing.js
        var easingEquations = {
            easeOutSine: function (pos) {
                return Math.sin(pos * (Math.PI / 2));
            },
            easeInOutSine: function (pos) {
                return (-0.5 * (Math.cos(Math.PI * pos) - 1));
            },
            easeInOutQuint: function (pos) {
                if ((pos /= 0.5) < 1) {
                    return 0.5 * Math.pow(pos, 5);
                }
                return 0.5 * (Math.pow((pos - 2), 5) + 2);
            }
        };

        // add animation loop
        function tick() {
            currentTime += 1 / 60;

            var p = currentTime / time;
            var t = easingEquations[easing](p);

            if (p < 1) {
                window['requestAnimFrame'](tick);
                window.scrollTo(0, scrollY + ((scrollTargetY - scrollY) * t));
            } else {
                window.scrollTo(0, scrollTargetY);
            }
        }

        // call it once to get started
        tick();
    }




    /**
     * @warning this method must be called only for registration of backend.
     *          It cannot be used to get user inforamaton since the return values may not be available on other pages.
     */
    getSocialLogin() {
        let currentUser = firebase.auth().currentUser;
        if (currentUser) {
            let user: SOCIAL_LOGIN = {} as SOCIAL_LOGIN;
            currentUser['providerData'].forEach((profile) => {
                user.provider = profile.providerId;
                user.uid = profile.uid;
                user.name = profile.displayName;
                user.email = profile.email;
                //user.photoURL = profile.photoURL;
            });
            return user;
        }
        else if (this.socialLogin) {
            return this.socialLogin;
        }

        else return null;

    }


    logout(callback) {

        this.afAuth.auth.signOut()
            .then((v) => {
                this.user.logout();
                callback(v);
            });

    }



    initializeNaverLogin() {
        let naver_id_login = window['naver_id_login'];
        naver_id_login.setButton("green", 1, 28);
        naver_id_login.setDomain(".englishfordevelopers.com");
        naver_id_login.init_naver_id_login();
    }

    /**
     * This will be called only one time after naver login.
    */
    checkLoginWithNaver() {
        let naver_id_login = window['naver_id_login'];
        let naver_access_token = naver_id_login.oauthParams.access_token;
        if (naver_access_token) {
            history.pushState('', document.title, window.location.pathname);
        }


        // user has logged in with naver id.
        if (naver_access_token) {

            naver_id_login.get_naver_userprofile(() => {
                let nickname = naver_id_login.getProfileData('nickname');
                let id = naver_id_login.getProfileData('id');
                this.socialLogin = {
                    provider: 'naver.com',
                    name: nickname,
                    uid: id,
                    email: id + '@naver.com'
                };
                this.socialLoginSuccessHandler();
            });


        }
    }


    onClickLoginWithNaver() {
        let a = document.querySelector('#naver_id_login a');
        a['click']();
    }


    onClickLoginWithFacebook() {
        this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
            .then(() => this.socialLoginSuccessHandler())
            .catch(e => this.errorHandler(e));
    }

    onClickLoginWithKakao() {
        let Kakao = window['Kakao'];
        // open login popup
        Kakao.Auth.login({
            success: (authObj) => {
                // Get user informaton
                Kakao.API.request({
                    url: '/v1/user/me',
                    success: (res) => {
                        let nickname = null;
                        if (res['properties'] && res['properties']['nickname']) nickname = res['properties']['nickname'];
                        let id = res.id;
                        this.socialLogin = {
                            provider: 'kakaotalk.com',
                            name: nickname,
                            uid: id,
                            email: id + '@kakaotalk.com'
                        };
                        this.socialLoginSuccessHandler();

                    },
                    fail: function (error) {
                        alert(JSON.stringify(error));
                    }
                });

            },
            fail: function (err) {
                alert(JSON.stringify(err));
            }
        });


    }

    socialLoginSuccessHandler() {
        this.backendLogin(r => this.backendSuccess(r), e => this.backendFailed(e));
    }
    backendSuccess(res: _USER_LOGIN_RESPONSE) {


        // id: string;
        // idx: number;
        // name: string;
        // email: string;
        // admin?: number;
        // Center X registration for Social Login Users.
        let data = {
            id: res.data.id,
            name: res.data.name,
            nickname: res.data.name,
            email: res.data.email,
            mobile: '',
            classid: this.share.defaultClassId
        };
        this.lms.register(data, res => {
            this.renderPage();
            this.showRequiredInfoModal();
        }, error => alert(' error on CenterX registration ' + error))
    }
    backendFailed(e) {
        let user = this.getSocialLogin();
        let id = user.uid + '@' + user.provider;
        if (e['code'] == -40102) {              // user not exists ==> register
            this.backendRegister(r => this.backendSuccess(r), e => this.backendFailed(e));
        }
        else {
            alert(this.user.getErrorString(e));
        }
    }


    backendLogin(success, fail) {
        let user = this.getSocialLogin();
        let id = user.uid + '@' + user.provider;
        this.user.logout();
        this.user.login({ id: id, password: id }).subscribe(success, fail);
    }

    backendRegister(success, fail) {
        let user = this.getSocialLogin();
        let id = user.uid + '@' + user.provider;
        let req: _USER_CREATE = {
            id: id,
            password: id,
            email: user.email,
            name: user.name
        };
        this.user.register(req).subscribe(r => {
            this.fc.newRegisteredUser(req);
            this.backendSuccess(r);
        }, e => this.backendFailed(e));
    }



    errorHandler(e) {
        alert('error: ' + e);
    }


    getUniqueId() {
        let str = (Date.now().toString(36) + Math.random().toString(36).substr(2, 5));
        return str.substr(2);

    }


    /**
     * This is a unique id of each user(web browser).
     * This will not be regenerated.
     * So, you can use it to track a user.
     *
     */
    getClientId() {

        let uid = localStorage.getItem('client-uid');
        if (uid) return uid;
        else {
            uid = this.getUniqueId();
            localStorage.setItem('client-uid', uid);
            return uid;
        }
    }

    isAdmin(): boolean {
        if (this.user.logged && this.user.info.admin) return true;
        else return false;
    }

    private showModal(option: ALERT_OPTION) {
        this.alertService.open(option, () => {
        });
    }

    alertModal( content: string = 'Notification Message', title: string = '알림') {
        let option: ALERT_OPTION = {
            title: title,
            content: content,
            class: 'alert-modal enhance-modal',
        };
        this.showModal( option );
    }

    private showConfirmModal(option, resultCallback?: (result) => void, dismissCallback?: (reason) => void) {
        this.confirmService.openConfirmModal(option, result => {
            console.info("openMobileUpload:: " + result);
            if (resultCallback) resultCallback(result);
        }, reason => {
            if (dismissCallback) dismissCallback(reason);
        });
    }


    confirmModal(option, resultCallback?: (result) => void, dismissCallback?: (reason) => void) {
        this.showConfirmModal(option, result => {
            if (resultCallback) resultCallback(result);
        }, reason => {
            if (dismissCallback) dismissCallback(reason);
        });

    }

    toast(content) {
        this.showModal({ content: content, class: 'toast', timeout: 4000 });
    }
    error(e) {
        if (e.code == -80011) e.message = "앗! 인터넷이 연결되지 않았습니다. 인터넷을 연결해 주세요.";
        console.log(e);
        this.toast(e.message);
    }

    showRequiredInfoModal() {
        let activeModal = this.modal.open(RegisterComponent, { windowClass: 'enhance-modal' });
        activeModal.componentInstance.checkRequired = true;
    }

  getSiteConfig() {
    //localStorage.setItem(this.site_config, '');
    let config = localStorage.getItem(this.site_config);
    //console.log('config:: ', config);
    if (config) {
      try {
        this.config = JSON.parse(config);
      } catch(e){}
    }
    
      let q: _LIST = {};
      q.where = 'model = ? AND code = ? AND model_idx = ?';
      q.bind = `${this.site_config},${this.site_config},1`;
    
      console.log('query:: ', q );
      this.meta.list(q).subscribe( (res: _META_LIST_RESPONSE) => {
          console.log("res: ", res);
          
        if(res && res.data && res.data.meta.length){
          //console.log('meta.list', res);
          config = res.data.meta[0].data ;
          localStorage.setItem(this.site_config, config);
          console.log(config);
          this.config = config;
        }
        else {
            // We Don't do anything on config load error.
            // alert("error");
        }
      }, error => {
          // Don't do anything on error.
          // console.error( this.meta.errorResponse(error))
      });
      
  }


  get siteInfo(): _SITE_CONFIGURATION {
    let data = localStorage.getItem( this.site_config );
    if ( data ) {
      try {
        return JSON.parse( data );
      }
      catch (e) {}
    }
    return <_SITE_CONFIGURATION>{};
  }
}
