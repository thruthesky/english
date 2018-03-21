import { Injectable, NgZone, EventEmitter } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';


import { Message } from './message';


import {
  User, Meta,
  _USER_LOGIN_RESPONSE,
  _USER_CREATE,
  _USER_DATA_RESPONSE
} from 'angular-backend';

import { LMS } from './lms';

// import * as config from './../app/config';

import { Alert, ALERT_OPTION } from './bootstrap/alert/alert';
import { Confirm, CONFIRM_OPTION} from './bootstrap/confirm/confirm';
import { Announcement, ANNOUNCEMENT_OPTION } from './bootstrap/announcement/announcement';
import { Reminder, REMINDER_OPTION } from './bootstrap/reminder/reminder';
import { FirebaseChat } from "./firebase";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { RegisterComponent } from "../components/modals/register/register";

import { ShareService } from '../providers/share-service';


import { Subject } from 'rxjs/Subject';

import { _ClassInformation } from '../components/reservation/reservation-interface';
import {split} from "ts-node/dist";





export interface SOCIAL_LOGIN {
    provider: string;
    uid: string;
    name: string;
    email: string;
};


export interface _ANNOUNCEMENT {
  key?: string;
  photo_idx?: number;
  photo_url?: string;
}

export type _ANNOUNCEMENTS = _ANNOUNCEMENT[];

export interface _SITE_CONFIGURATION {
  company_name_variation?: string;
  company_name?: string;
  company_email?: string;
  phone_number?: number;
  copyright_line1?: string;
  copyright_line2?: string;
  copyright_line3?: string;
  copyright_line4?: string;
  company_name_eul?: string;
  company_name_en?: string;
  company_name_wa?: string;
  reminder_key?: string;
  reminder_title?: string;
  reminder_message?: string;
  announcement_key?: string;
  announcement_message?: string;
  announcement_photo_idx?: number;
  announcement_photo_url?: string;
  announcements: _ANNOUNCEMENTS;
  atg_credit_card?: string;
  payment_banner_info?: string;
  logo_idx?: number;
  logo_url?: string;
}



export enum DAYS_EN { 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' };
// export const is_chrome = /chrome/.test( navigator.userAgent.toLowerCase() );

@Injectable()
export class App {

    useFacebook: boolean = false;

    config: _SITE_CONFIGURATION = <_SITE_CONFIGURATION>{};
    teachers_status = {};
    teacher_config = 'teachers-status';

    defaultLogoUrl: string = "/assets/images/logo/logo24.png";
    logoUrl: string = this.defaultLogoUrl;



    site_config = 'site_config';
    DAYS = ['일', '월', '화', '수', '목', '금', '토'];

    public myEvent: EventEmitter<any>;
    width: number = 0;
    scrollId: string = null;
    headerHeight = 64; // 109 for small.
    socialLogin: SOCIAL_LOGIN = null;


    firstVisit: boolean = false;
    keyVisitCount: string = 'vistCount7';
    keyLoginCount: string = 'loginCount7';
    keyClassInfo: string = 'ClassInfo7';



    loginCount = new Subject<number>();

    paymentOption = null;

    d: Date = (new Date);
    today: string = '' + this.d.getFullYear() + (this.d.getMonth() + 1) + this.d.getDate();
    announcementKeys = '';

    constructor(
        private ngZone: NgZone,
        private alertService: Alert,
        private confirmService: Confirm,
        private announcementService: Announcement,
        private reminderService: Reminder,
        public afAuth: AngularFireAuth,
        public user: User,
        public meta: Meta,
        private fc: FirebaseChat,
        private modal: NgbModal,
        private lms: LMS,
        public share: ShareService,
        private message: Message
    ) {
        this.myEvent = new EventEmitter();
        this.checkFirstVisit();
        this.increaseVisitCount();


        if ( window['use_facebook'] !== void 0 && window['use_facebook'] ) this.useFacebook = true;

        /**
         * Payment Customizing. See # https://docs.google.com/document/d/1pRx_T5DwH9fZRZMgj43IGjqppROL8SAUkx7SzmN6fpQ/edit#heading=h.wiz92gphk3qm
         *
         *
         */

         this.paymentOption = window['payment_customization'];

         // console.log( this.paymentOption );


    }
    /**
    * Everytime window resizes, this is set.
    */
    setWidth(width) {
        this.width = width;
        this.renderPage();

        if (this.widthSize == 'big') this.headerHeight = 64;
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
        //console.log("headerHeight: ", this.headerHeight);
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
        //console.log("clicked id: ", id);

        let parts = this.getParts();
        if (parts && parts.length) {
            for (let i = 0, len = parts.length; i < len; i++) {
                if (parts[i]['id'] == id) {
                    // console.log("top of the section: ", parts[i]['top']);
                    let p = parts[i]['top'] - this.headerHeight;
                    // console.log('scroll To Y: ', p);
                    // console.log("headerHeight: ", this.headerHeight);
                    this.scrollToY(p);
                    break;
                }
            }
        }


    }

    /**
     * @note No need to cache for speedup since it is only being called once every bounce time.
     */
    scrolled(event?) {
        let windowTop = Math.ceil(this.getWindowOffset().top);
        let selectedId = null;
        let parts = this.getParts();
        if (parts && parts.length) {
            for (let i = 0, len = parts.length; i < len; i++) {
                let part = parts[i];
                selectedId = part.id;
                if (i < len - 1) {
                    let nextPart = parts[i + 1];
                    let pTop = Math.ceil(nextPart.top);
                    // console.log(`if (${pTop} > ${windowTop} + ${this.marginTop}) break;`);
                    if (pTop > (windowTop + this.marginTop)) break;
                }
            }
        }
        //console.log("selectedId:", selectedId)
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
            speed = speed || 1000,
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
        let hostname = window.location.hostname;
        hostname = hostname.replace("www.", "");
        hostname = hostname.replace("WWW.", "");
        naver_id_login.setDomain("." + hostname);
        naver_id_login.setState("loginRequest");

        // naver_id_login.setPopup();
        naver_id_login.init_naver_id_login();
    }

    /**
     * This will be called only one time after naver login.
    */
    checkLoginWithNaver() {
        let naver_id_login = window['naver_id_login'];
        let naver_access_token = naver_id_login.oauthParams.access_token;

        // User has just logged in with naver id. ( 방금 로그인 )
        if (naver_access_token) {
            history.pushState('', document.title, window.location.pathname);
            naver_id_login.get_naver_userprofile(() => {
                let nickname = naver_id_login.getProfileData('nickname');
                let id = naver_id_login.getProfileData('id');
                this.socialLogin = {
                    provider: 'naver.com',
                    name: nickname,
                    uid: id,
                    email: id + '@naver.com'
                };
                this.socialLoginSuccessHandler(() => {
                    /**
                     * After Naver login, resize IE window with full with. The code below works only on IE. it's not working on Chrome, Firefox.
                     */
                    window.resizeTo(
                        window.screen.availWidth,
                        window.screen.availHeight
                    );
                });
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

    socialLoginSuccessHandler(callback?) {
        this.backendLogin(r => this.backendSuccess(r, callback), e => this.backendFailed(e, callback));
    }

    /**
     * All login including 'social login naver/kakao/facebook' and 'registration' comes here.
     *
     * Must call this method for all logins. This may be the last thing to do on each login.
     */
    loginSuccess() {
        this.increaseLoginCount();
    }

    /**


     */
    // registerSuccess( name ) {
    //     this.message.send( "회원 가입", `${name}님이 가입하였습니다.`);
    // }
    backendSuccess(res: _USER_LOGIN_RESPONSE, callback?) {


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
            this.loginSuccess();
            if (callback) callback();
        }, error => alert(' error on CenterX registration ' + error))
    }
    backendFailed(e, callback?) {
        let user = this.getSocialLogin();
        let id = user.uid + '@' + user.provider;



        if (e['code'] == -40102) {              // user not exists ==> register. This is the only place for social login to register into backend.

            /**
             * @WARNING @BUG the callbacks of success, error in this.bakendRegister( 'success', 'error' )
             *                  Are NOT called !!
             *                  But this is harmless.
             */
            this.backendRegister(r => {
                this.backendSuccess(r, callback);
            }, e => this.backendFailed(e, callback));
        }
        else {
            // alert("backendFailed: " + this.user.alert(e));
            if (callback) callback();
            console.error("backendFailed: " + this.user.alert(e));
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
            this.message.send( "회원 가입", `${user.name}님이 가입하였습니다.`);
            // this.fc.newRegisteredUser(req);
            this.backendSuccess(r);
        }, e => this.backendFailed(e));
    }



    errorHandler(e) {
        alert('errorHandler() : ' + e);
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

    alertModal(content: string = 'Notification Message', title: string = '알림') {
        let option: ALERT_OPTION = {
            title: title,
            content: content,
            class: 'alert-modal enhance-modal',
        };
        this.showModal(option);
    }

    private showConfirmModal(option: CONFIRM_OPTION, resultCallback?: (result) => void, dismissCallback?: (reason) => void) {
        this.confirmService.openConfirmModal(option, result => {
            //console.info("openMobileUpload:: " + result);
            if (resultCallback) resultCallback(result);
        }, reason => {
            if (dismissCallback) dismissCallback(reason);
        });
    }


    confirmModal(option: CONFIRM_OPTION, resultCallback?: (result) => void, dismissCallback?: (reason) => void) {
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
        //console.log(e);
        this.toast(e.message);
    }

    showRequiredInfoModal() {

      this.user.data().subscribe( (res: _USER_DATA_RESPONSE) => {
        if ( res.code == 0 && res.data.user ) {
          let user = res.data.user;
          if ( !user.name || !user.nickname || !user.mobile || !user.email ) {
            let activeModal = this.modal.open(RegisterComponent, {windowClass: 'enhance-modal'});
            activeModal.componentInstance.checkRequired = true;
          }
        }
      }, error => {
        this.error( error );
      });


    }

    getSiteConfig() {

        let config = localStorage.getItem(this.site_config);
        //console.log('config:: ', config);
        if (config) {
            try {
                this.config = JSON.parse(config);
                this.preConfig();
            } catch (e) { }
        }


        this.meta.config().subscribe((res) => {

            //console.log('meta.config', res);
            if (res && res.data && res.data.config) {
                // console.log('meta.config::config', res);
                config = res.data.config;
                try {
                    this.config = JSON.parse(config);
                } catch (e) { }
                //console.log('meta.config:json:', this.config);
                localStorage.setItem(this.site_config, config);
                this.preConfig();
                this.showAnnouncement();
                //this.showReminder();
            }

        }, error => this.meta.errorResponse(error));


    }



    getTeacherStatus() {

      // localStorage.setItem( this.site_config, '' );
      let config = localStorage.getItem(this.teacher_config);
      // console.log('config:: ', config);
      if (config) {
        try {
          this.teachers_status = JSON.parse(config);
          // console.log('metaData',this.metaData);
        } catch (e) {
        }
      }

      this.meta.config(this.teacher_config).subscribe((res) => {
        // console.log('meta.teacher_config.config', res);
        if (res && res.data && res.data.config) {
          // console.log('meta.config::config', res);
          config = res.data.config;
          try {
            this.teachers_status = JSON.parse(config);
            // console.log('metaData::config',this.metaData);
          } catch (e) {
          }
          localStorage.setItem(this.teacher_config, config);
        }
      }, error => this.meta.errorResponse(error));
    }

    preConfig() {

        if (this.config.logo_url) this.logoUrl = this.config.logo_url;
        else this.config.logo_url = this.defaultLogoUrl;

        if (this.config.company_name_variation === '1') this.config['company_name_eul'] = this.config.company_name + '을';
        else this.config['company_name_eul'] = this.config.company_name + '를';

        if (this.config.company_name_variation === '1') this.config['company_name_en'] = this.config.company_name + '은';
        else this.config['company_name_en'] = this.config.company_name + '는';

        if (this.config.company_name_variation === '1') this.config['company_name_wa'] = this.config.company_name + '과';
        else this.config['company_name_wa'] = this.config.company_name + '와';


        if (this.config.company_name_variation === '1') this.config['company_name_ga'] = this.config.company_name + '이';
        else this.config['company_name_ga'] = this.config.company_name + '가';

    }





    get siteInfo(): _SITE_CONFIGURATION {
        let data = localStorage.getItem(this.site_config);
        if (data) {
            try {
                return JSON.parse(data);
            }
            catch (e) { }
        }
        return <_SITE_CONFIGURATION>{};
    }


    checkFirstVisit() {
        let vc = localStorage.getItem(this.keyVisitCount);

        if (!vc) {
            this.firstVisit = true;
        }
        else if (parseInt(vc) <= 3) { // It assumes as "first vist" until thuser visits 3 times. (세번째 방문까지는 첫번째 방문으로 인정한다.)
            this.firstVisit = true;
        }

    }
    increaseVisitCount() {
        let vc = localStorage.getItem(this.keyVisitCount);
        let num = 0;
        if (!vc) num = 1;
        else num = parseInt(vc) + 1;
        localStorage.setItem(this.keyVisitCount, '' + num);
    }
    setVisitCount(num: number) {
        localStorage.setItem(this.keyVisitCount, '' + num);
    }


    /**
     * count on login
     */
    increaseLoginCount() {
        let vc = localStorage.getItem(this.keyLoginCount);
        let num = 0;
        if (!vc) num = 1;
        else num = parseInt(vc) + 1;
        localStorage.setItem(this.keyLoginCount, '' + num);

        this.loginCount.next(num);
    }

    /**
     * Returns the number of login.
     */
    getLoginCount(): number {
        let vc = localStorage.getItem(this.keyLoginCount);
        let num = 0;
        if (!vc) num = 1;
        else num = parseInt(vc);
        return num;
    }

    set classInfo(obj) {
        if (obj == void 0) return;
        let json;
        try {
            json = JSON.stringify(obj);
        }
        catch (e) {
            return;
        }
        localStorage.setItem(this.keyClassInfo, json);
    }

    /**
     * @todo @check it may need to memory cache.
     */
    get classInfo(): _ClassInformation {
        let str = localStorage.getItem( this.keyClassInfo );
        if ( ! str ) return null;
        try {
            return JSON.parse( str );
        }
        catch ( e ) {
            return null;
        }
    }


    get isNewStudent() {

        // console.log("class infos: ", this.classInfo );
        // if ( this.classInfo ) {
        //     let count = 0;
        //     if ( this.classInfo.no_of_past ) count += parseInt( this.classInfo.no_of_past );
        //     if ( this.classInfo.no_of_reservation ) count += parseInt( this.classInfo.no_of_reservation );
        //     if ( count >= 3 ) return false;
        // }

        if ( this.noOfClasses >= 3 ) return false;

        return true;
    }


    get noOfClasses(): number {
        if ( this.classInfo ) {
            let count = 0;
            if ( this.classInfo.no_of_past ) count += parseInt( this.classInfo.no_of_past );
            if ( this.classInfo.no_of_reservation ) count += parseInt( this.classInfo.no_of_reservation );
            return count;
        }
        return 0;
    }



  showAnnouncement() {
    if ( this.config && this.config.announcements && this.config.announcements.length ) {
      this.nextAnnouncement();
    }
    else {
      this.showReminder();
    }
  }

  nextAnnouncement( ctr: number = 0 ) {
    const ls_key = 'popup-announcements';

    //localStorage.setItem( ls_key, '' );
    if ( this.config.announcements.length === 0 ) return this.showReminder();
    let v = this.config.announcements.shift();
    let arrPopups = [];

    let popups = localStorage.getItem( ls_key );
    if ( popups ) arrPopups = popups.split(',');
    let anKey = v.key + '+' + this.today;
    //console.log('arrPopups::', arrPopups);


    if ( v.key && v.photo_url && arrPopups[ctr] !== anKey ) {
      let option: ANNOUNCEMENT_OPTION = {
        content: v.photo_url,
      };
      this.announcementService.open(option, () => {
        arrPopups[ctr] = anKey;
        localStorage.setItem( ls_key, arrPopups.toString() );
        this.nextAnnouncement(ctr + 1);
      }, reason => this.nextAnnouncement( ctr + 1 ));
    }
    else this.nextAnnouncement( ctr + 1 );
  }


  showReminder() {
    const ls_key = 'popup-reminder';
    let popup = localStorage.getItem( ls_key );
    let reminderKey = this.config.reminder_key + '+' + this.today;
    if ( this.config && this.config.reminder_key && this.config.reminder_message && popup !== reminderKey ) {

      let option: REMINDER_OPTION = {
        title: this.config.reminder_title,
        content: this.config.reminder_message
      };
      this.reminderService.open(option, result => {
        localStorage.setItem( ls_key, reminderKey);
      }, reason => {
      });
    }
  }





}
