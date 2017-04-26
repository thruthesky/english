import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { User, USER_DATA_RESPONSE, USER_FIELDS } from '../angular-backend/angular-backend';
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
    userData: USER_FIELDS = null;
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
                // console.log(re);
                let json = null;
                try {
                    json = JSON.parse( re['_body'] );
                }
                catch ( e ) {
                    alert("Parse ERROR on lms::getTeachers()");
                }

                //console.log(json);
                success( json['data'] );
            });
        }
        catch(e) {
            alert(e);
        }
        
    }

    register( data, success, failure: ( error : string ) => void ){
        data = data.value;
        let domain = this.getDomain();
        console.log("res:", domain );
        let url = LMS_ENDPOINT_URL + `?id=${data['id']}&name=${data['name']}&nickname=${data['nickname']}&email=${data['email']}&mobile=${data['mobile']}&classid=${data['classid']}&domain=${domain}&domain_key=empty&function=user_insert`;

        this.http.get( url ).subscribe( re =>{
            console.log( ' user_insert :: ' + re );
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
        let domain = this.getDomain();
        console.log("res:", domain );
        console.log('data:',data);
        let url = LMS_ENDPOINT_URL + `?id=${data['id']}&name=${data['name']}&nickname=${data['nickname']}&email=${data['email']}&mobile=${data['mobile']}&classid=${data['classid']}&domain=${domain}&domain_key=empty&function=user_update`;
        console
        this.http.get( url ).subscribe( re =>{
            console.log( ' user_update :: ' + re );
            if( re ) success( re );
            else failure( ' error on lms update user ' );
        })
    }
    loadUserData() {
        this.user.data().subscribe( (res: USER_DATA_RESPONSE) => {
            this.userData = res.data.user;
        }, error => {
            this.error( error );
        } );
    }
    error( error ) {
        console.log( error );
        return this.user.errorResponse( error );
    }
    getReservationsByMonthYear( data, success, error ) {
        //update website
        try {
            if ( this.user.logged ) {
                this.loadUserData();
                setTimeout(()=>{
                    let m = parseInt(data['m']) < 10 ? '0' + data['m'] :  data['m'];
                    console.log(this.userData);
                    let domain = this.getDomain();
                    console.log("res:", domain );
                    let url = '';
                    if( this.userData && this.userData.id ) url = LMS_URL + `/ajax.php?id=${this.userData.id}&email=${this.userData.email}&domain=${domain}&domain_key=empty&function=class_list_by_month&Y=${data['Y']}&m=${m}&classid=${data['classid']}`;
                    else return error();
                    // let url = LMS_URL + `/ajax.php?id=k402486&email=k402486@naver.com&classid=${data['classid']}&domain=englishcoffeeonline.onlineenglish.kr&domain_key=empty&function=class_list_by_month&Y=${data['Y']}&m=${m}`;
                    this.http.get( url ).subscribe( re =>{
                        console.log("URI:",re['url']);
                        let json = null;
                        try {
                            console.log('success:',json);
                            json = JSON.parse( re['_body'] );
                            if ( json['code'] ) {
                                alert( json['message'] );
                            }
                            else {
                                console.log(json);
                                success( json['data'] );
                            }
                        }
                        catch ( e ) {
                            alert("Parse ERROR on lms::getReservationsByMonthYear()");
                        }
                    }, err => {
                        error();
                        // alert("error on class list by month");
                    });
                },1000);
            }else {
                error();
            }
        }catch(e) {
            console.log(e);
        }
    }
}