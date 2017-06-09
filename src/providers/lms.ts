import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { User, _USER_DATA_RESPONSE, _USER_RESPONSE } from 'angular-backend';

import * as config from './../app/config';

export const LMS_URL = "//witheng.com";
export const LMS_ENDPOINT_URL = LMS_URL + "/ajax.php";
export const domain: string = 'englishfordevelopers.onlineenglish.kr';
export interface TEACHER {
    birthday: string;
    classid: string;
    gender: string;
    greeting: string;
    id: string;
    idx: string;
    major: string;
    name: string;
    nickname: string;
    photo: string;
    teaching_year: number;
    url_youtube: string;
};
export type TEACHERS = Array< TEACHER >;
@Injectable()
export class LMS {
    userData: _USER_RESPONSE = null;
    constructor( private http: Http,
                 public user: User ) {

    }
    get url() {
        return LMS_URL;
    }
    getTeachers( success: (teachers: TEACHERS) => void ) {
        try {
            let url = LMS_ENDPOINT_URL + "?function=teacher_list";
            this.http.get( url ).subscribe( re => {
                let json = null;
                try {
                    json = JSON.parse( re['_body'] );
                }
                catch ( e ) {
                    alert("Parse ERROR on lms::getTeachers()");
                }

                success( json['data'] );
            });
        }
        catch(e) {
            // alert(e);
            console.error(e);
        }
        
    }

    register( data, success, failure: ( error : string ) => void ){
        data = data.value;
        let domain = this.getDomain();
        data['classid'] = config.classid;
        let url = LMS_ENDPOINT_URL + `?id=${data['id']}&name=${data['name']}&nickname=${data['nickname']}&email=${data['email']}&mobile=${data['mobile']}&classid=${data['classid']}&domain=${domain}&domain_key=empty&function=user_insert`;
        this.http.get( url ).subscribe( re =>{
            if( re ) success( re );
            else failure( ' error on lms registration ' );
        })
    }
    getDomain( ) {
        let hostname = window.location.hostname
        let domain:string = '';
        if ( hostname.indexOf("witheng.com" ) != -1 ) {
            domain = 'witheng.onlineenglish.kr';
        }
        else if ( hostname.indexOf("witheng.dev" ) != -1 ) {
            domain = 'witheng.onlineenglish.kr';
        }
        else if( hostname.indexOf("onfis.com") != -1 ) {
            domain = 'onfis.onlineenglish.kr';
        }
        else if( hostname.indexOf('iamtalkative') != -1 ) {
            domain = 'talkative.onlineenglish.kr';
        }
        else if( hostname.indexOf("igoodtalk.com") != -1 ) {
            domain = 'igoodtalk.onlineenglish.kr';
        }
        else {
            let parts = hostname.split( '.' );
            domain = parts[0] == 'www' ? parts[1] + '.onlineenglish.kr' : parts[0] + '.onlineenglish.kr';
        }
        return domain;
    }
    update( data, success, failure: ( error: string) => void ){
        data = data.value;
        data['classid'] = config.classid;
        let domain = this.getDomain();
        let url = LMS_ENDPOINT_URL + `?id=${data['id']}&name=${data['name']}&nickname=${data['nickname']}&email=${data['email']}&mobile=${data['mobile']}&classid=${data['classid']}&domain=${domain}&domain_key=empty&function=user_update`;
        this.http.get( url ).subscribe( re =>{
            if( re ) success( re );
            else failure( ' error on lms update user ' );
        })
    }
    loadUserData() {
        this.user.data().subscribe( (res: _USER_DATA_RESPONSE) => {
            this.userData = res.data.user;
        }, error => {
            this.error( error );
        } );
    }
    error( error ) {
        return this.user.errorResponse( error );
    }
    

    getReservationsByMonthYear( data, success, error ) {
        //update website
            if ( this.user.logged ) {
                    let m = parseInt(data['m']) < 10 ? '0' + data['m'] :  data['m'];
                    let domain = this.getDomain();
                    data['classid'] = config.classid;
                    let url = LMS_URL + `/ajax.php?id=${this.user.info.id}&email=${this.user.info.email}&domain=${domain}&domain_key=empty&function=class_list_by_month&Y=${data['Y']}&m=${m}&classid=${data['classid']}`;
                    this.http.get( url ).subscribe( re =>{
                        let json = null;
                        try {
                            json = JSON.parse( re['_body'] );
                        }
                        catch ( e ) {
                            alert("Parse ERROR on lms::getReservationsByMonthYear()");
                        }
                        
                        if ( json['code'] !== void 0 && json['code'] ) {
                            alert( json['message'] );
                        }
                        else {
                            success( json['data'] );
                        }

                    }, err => {
                        error(err);
                    });
            }
            else {
                error();
            }
    }



    getNextClass( success, failure ) {
            let url = LMS_ENDPOINT_URL + `?function=api_next_class&id_member=${this.user.info.id}@` + this.getDomain();
            this.http.get( url ).subscribe( re =>{
                let json = JSON.parse( re['_body'] );
                if( json['data'] ) success( json['data'] );
                else failure( ' error on getting next class ' );
            });
    }

    openVe() {
        this.getNextClass( data => {
            if( !data ) return alert("data is false on openVe()");
            let student_id = this.user.info.id + '@' + this.getDomain();
            let url = `http://onlineenglish.kr/~witheng/etc/ve_open.php?confcode=${data.teacher.classid}&teacher_id=${data.teacher.classid}&student_id=${student_id}&teacher_nickname=${data.teacher.name}&conftype=2&usertype=0&class_no=${data.idx}&class_date=${data.date}&class_begin=${data.class_begin}&class_end=${data.class_end}`;
            window.open( url, "_blank");
        }, error => {
            console.error(error);
            alert("No Next Class Data");
        });
    }

}