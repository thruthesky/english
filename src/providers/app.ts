import { Injectable, NgZone, EventEmitter } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { User } from 'angular-backend';
export interface SOCIAL_LOGIN {
    providerId: string;
    uid: string;
    displayName: string;
    email: string;
    photoURL: string;
};

@Injectable()
export class App {
    public myEvent: EventEmitter<any>;
    width: number = 0;
    scrollId: string = null;
    headerHeight = 10;
    constructor(
        private ngZone: NgZone,

        public afAuth: AngularFireAuth,
        private backendUser: User

     ) {
        this.myEvent = new EventEmitter();
    }
    /**
    * Everytime window resizes, this is set.
    */
    setWidth( width ) {
        this.width = width;
        this.renderPage();
        // console.log("setWidth(): ", this.width);


        this.makeSureHeaderHeight();
        setTimeout( () => this.makeSureHeaderHeight(), 5000 );
        setTimeout( () => this.makeSureHeaderHeight(), 15000 );

    }


    makeSureHeaderHeight() {
        
        let header = document.querySelector( 'header nav' );
        if ( ! header ) return;
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

    get widthSize() : 'small' | 'big' {
        let size : 'small' | 'big' = 'small';
        if ( this.getWidth() >= 768 ) size = 'big';
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
    isCordova () { 
        if ( !! window['cordova'] ) return true;
        if ( document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1 ) return true;
        return false;
    }

    /**
     * @note No need to cache for speedup since it is only being called once every bounce time.
     */
    scrolled( event? ) {
        // console.log(event);
        let windowTop = this.getWindowOffset().top;
        // console.log(`windows offset: `, windowTop);
        let selectedId = null;
        let parts = this.getParts();
        // console.log(parts);
        if ( parts && parts.length ) {
            for ( let i = 0, len = parts.length; i < len; i ++ ) {
                let part = parts[i];
                selectedId = part.id;
                if ( i < len - 1 ) {
                    let nextPart = parts[i + 1];
                    
                    if ( nextPart.top > windowTop + this.marginTop ) break;
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
        if ( nodesArray && nodesArray.length ) {
            for ( let i = 0, len = nodesArray.length; i < len; i ++ ) {
                let el = nodesArray[i];
                let pos = this.getOffset( el );
                if ( el.id == 'intro' ) pos.top = 0;
                parts.push( { id: el.id, top: pos.top } );
            }
        }
        return parts;
    }




    scrollTo( id ) {
        
        let parts = this.getParts();
        // console.log(parts);
        if ( parts && parts.length ) {
            for ( let i = 0, len = parts.length; i < len; i ++ ) {
                if ( parts[i]['id'] == id ) {
                    console.log("parts:i, ", parts[i]);
                    //  window.scrollTo( 0, parts[i]['top'] - HEADER_HEIGHT+1 );
                    this.scrollToY( parts[i]['top'] - this.headerHeight, 2000, 'easeInOutQuint' );

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




    alert( str ) {
        alert( str );
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
    scrollToY( scrollTargetY, speed?, easing? ) {

        // first add raf shim
        // http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
        window['requestAnimFrame'] = ( function() {
            return  window.requestAnimationFrame          ||
                    window.webkitRequestAnimationFrame    ||
                    window['mozRequestAnimationFrame']    ||
                    function( callback ){
                        window.setTimeout(callback, 1000 / 60);
                    };
        }) ();


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

            if ( p < 1 ) {
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




    getSocialLogin() {
        let currentUser = firebase.auth().currentUser;
        if (currentUser) {
            let user: SOCIAL_LOGIN = {} as SOCIAL_LOGIN;
            // console.log("currentUser: ", currentUser);
            currentUser['providerData'].forEach((profile) => {
                user.providerId = profile.providerId;
                user.uid = profile.uid;
                user.displayName = profile.displayName;
                user.email = profile.email;
                user.photoURL = profile.photoURL;
            });
            return user;
        }
        else return null;

    }


    logout( callback ) {
        
        this.afAuth.auth.signOut()
            .then( (v) => {
                this.backendUser.logout();
                callback(v);
            });
            
    }
}