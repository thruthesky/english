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
        let url = LMS_ENDPOINT_URL + `?id=${data['id']}&name=${data['name']}&nickname=${data['nickname']}&email=${data['email']}&mobile=${data['mobile']}&classid=${data['classid']}&domain=${domain}&domain_key=empty&function=user_insert`;

        this.http.get( url ).subscribe( re =>{
            console.log( ' user_insert :: ' + re );
            if( re ) success( re );
            else failure( ' error on lms registration ' );
        })
    }

    update( data, success, failure: ( error: string) => void ){
        data = data.value;
        let url = LMS_ENDPOINT_URL + `?id=${data['id']}&name=${data['name']}&nickname=${data['nickname']}&email=${data['email']}&mobile=${data['mobile']}&classid=${data['classid']}&domain=${domain}&domain_key=empty&function=user_update`;

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
        if ( this.user.logged ) {
            this.loadUserData();
            setTimeout(()=>{
                console.log(this.userData);
                let m = parseInt(data['m']) < 10 ? '0' + data['m'] :  data['m'];
                let url = LMS_URL + `/ajax.php?id=${this.userData.id}&email=${this.userData.email}&classid=${data['classid']}&domain=${domain}&domain_key=empty&function=class_list_by_month&Y=${data['Y']}&m=${m}`;
                // let url = LMS_URL + `/ajax.php?id=k402486&email=k402486@naver.com&classid=${data['classid']}&domain=englishcoffeeonline.onlineenglish.kr&domain_key=empty&function=class_list_by_month&Y=${data['Y']}&m=${m}`;
                this.http.get( url ).subscribe( re =>{
                    let json = null;
                    try {
                        console.log('success:',json);
                        json = JSON.parse( re['_body'] );
                    }
                    catch ( e ) {
                        alert("Parse ERROR on lms::getTeachers()");
                    }

                    if ( json['code'] ) {
                        alert( json['message'] );
                    }
                    else {
                        console.log(json);
                        success( json['data'] );
                    }
                }, err => {
                    error();
                    // alert("error on class list by month");
                });
            },1000);
        }else {
            error();
        }
    }
    
    
}