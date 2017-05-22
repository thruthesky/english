import { Injectable, NgZone, EventEmitter } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { User, _USER_LOGIN_RESPONSE, _USER_CREATE } from 'angular-backend';



export interface SOCIAL_LOGIN {
    provider: string;
    uid: string;
    name: string;
    email: string;
};

@Injectable()
export class App {
    public myEvent: EventEmitter<any>;
    width: number = 0;
    scrollId: string = null;
    headerHeight = 10;
    socialLogin: SOCIAL_LOGIN = null;

    constructor(
        private ngZone: NgZone,

        public afAuth: AngularFireAuth,
        public user: User

    ) {
        this.myEvent = new EventEmitter();
    }
    /**
    * Everytime window resizes, this is set.
    */
    setWidth(width) {
        this.width = width;
        this.renderPage();
        // console.log("setWidth(): ", this.width);


        this.makeSureHeaderHeight();
        setTimeout(() => this.makeSureHeaderHeight(), 5000);
        setTimeout(() => this.makeSureHeaderHeight(), 15000);

    }


    makeSureHeaderHeight() {

        let header = document.querySelector('header nav');
        if (!header) return;
        //console.log(header);
        //console.log( header.clientHeight );
        this.headerHeight = header.clientHeight;
    }

    renderPage() {
        this.ngZone.run(() => {
            // console.log('ngZone.run()');
        });
    }
    private getWidth() {
        return this.width;
    }

    get widthSize(): 'small' | 'big' {
        let size: 'small' | 'big' = 'small';
        if (this.getWidth() >= 768) size = 'big';
        // console.log('size: ', size);
        return size;
    }

    get marginTop() {
        return this.headerHeight;
        // let margin_top = HEADER_HEIGHT;
        // if ( this.widthSize == 'big' ) margin_top += BIG_HEADER_HEIGHT;
        // return margin_top;
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
     * @note No need to cache for speedup since it is only being called once every bounce time.
     */
    scrolled(event?) {
        // console.log(event);
        let windowTop = this.getWindowOffset().top;
        // console.log(`windows offset: `, windowTop);
        let selectedId = null;
        let parts = this.getParts();
        // console.log(parts);
        if (parts && parts.length) {
            for (let i = 0, len = parts.length; i < len; i++) {
                let part = parts[i];
                selectedId = part.id;
                if (i < len - 1) {
                    let nextPart = parts[i + 1];

                    if (nextPart.top > windowTop + this.marginTop) break;
                }
                // console.log( 'id:' + part.id + ', pos: ', pos);
            }
        }
        // console.log('selected: ', selectedId);
        this.scrollId = selectedId;

        this.renderPage();
        // console.log( this.getOffset(parts) );
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

        let parts = this.getParts();
        // console.log(parts);
        if (parts && parts.length) {
            for (let i = 0, len = parts.length; i < len; i++) {
                if (parts[i]['id'] == id) {
                    console.log("parts:i, ", parts[i]);
                    //  window.scrollTo( 0, parts[i]['top'] - HEADER_HEIGHT+1 );
                    this.scrollToY(parts[i]['top'] - this.headerHeight, 2000, 'easeInOutQuint');

                    break;
                }
            }
        }
        return;
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
                console.log('scroll done');
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
            // console.log("currentUser: ", currentUser);
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
        console.log("checkLoginWithNaver")
        let naver_id_login = window['naver_id_login'];
        let naver_access_token = naver_id_login.oauthParams.access_token;
        if (naver_access_token) {
            console.log(`Has access token: ${naver_access_token} Going to remove hash`);
            history.pushState('', document.title, window.location.pathname);
        }


        // user has logged in with naver id.
        if (naver_access_token) naver_id_login.get_naver_userprofile(() => {
            console.log("Got naver user profile");
            console.log("nickname: ", naver_id_login.getProfileData('nickname'));
            //console.log("age: ", naver_id_login.getProfileData('age'));

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
                console.log(JSON.stringify(authObj));
                // Get user informaton
                Kakao.API.request({
                    url: '/v1/user/me',
                    success: (res) => {
                        console.log(res);

                        let nickname = res.properties['nickname'];
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
        console.log("Social login success => Going to login to backend()");
        this.backendLogin(r => this.backendSuccess(r), e => this.backendFailed(e));
    }
    backendSuccess(res: _USER_LOGIN_RESPONSE) {
        console.log("Backend login or register success: " + res);
        this.renderPage();
        //this.router.navigateByUrl('/');
    }
    backendFailed(e) {
        console.log("Backend login failed.");
        let user = this.getSocialLogin();
        let id = user.uid + '@' + user.provider;
        if (e['code'] == -40102) {              // user not exists ==> register
            console.log("User not exists. going to register.");
            this.backendRegister(r => this.backendSuccess(r), e => this.backendFailed(e));
        }
        else {
            alert(this.user.getErrorString(e));
        }
    }


    backendLogin(success, fail) {
        let user = this.getSocialLogin();
        console.log("login success => going to log in backend: ", user);
        let id = user.uid + '@' + user.provider;
        // login
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
        this.user.register(req).subscribe(r => this.backendSuccess(r), e => this.backendFailed(e));
    }



    errorHandler(e) {
        console.log('error: ', e);
        // this.error = e.message;
        // this.app.zoneRun();
    }


    getUniqueId() {
        let str = (Date.now().toString(36) + Math.random().toString(36).substr(2, 5));
        return str.substr( 2 );

    }


    /**
     * This is a unique id of each user(web browser).
     * This will not be regenerated.
     * So, you can use it to track a user.
     * 
     */
    getClientId() {

        let uid = localStorage.getItem('client-uid');
        if ( uid ) return uid;
        else {
            uid = this.getUniqueId();
            localStorage.setItem('client-uid', uid);
            return uid;
        }
    }

    isAdmin() : boolean {
        if ( this.user.logged && this.user.info.admin ) return true;
        else return false;
    }
}