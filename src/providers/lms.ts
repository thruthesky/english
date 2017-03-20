import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
export const LMS_URL = "https://englishfordevelopers.com/api";
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
    constructor( private http: Http ) {

    }
    get url() {
        return LMS_URL;
    }
    getTeachers( success: (teachers: TEACHERS) => void ) {
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

    register( data, success, failure: ( error : string ) => void ){
        let url = LMS_ENDPOINT_URL + `?id=${data['id']}&name=${data['name']}&nickname=${data['nickname']}&email=${data['email']}&mobile=${data['mobile']}&classid=${data['classid']}&domain=${domain}&domain_key=empty&function=user_insert`;

        this.http.get( url ).subscribe( re =>{
            console.log( ' user_insert :: ' + re );
            if( re ) success( re );
            else failure( ' error on lms registration ' );
        })
    }

    update( data, success, failure: ( error: string) => void ){
        let url = LMS_ENDPOINT_URL + `?id=${data['id']}&name=${data['name']}&nickname=${data['nickname']}&email=${data['email']}&mobile=${data['mobile']}&classid=${data['classid']}&domain=${domain}&domain_key=empty&function=user_update`;

        this.http.get( url ).subscribe( re =>{
            console.log( ' user_update :: ' + re );
            if( re ) success( re );
            else failure( ' error on lms update user ' );
        })
    }

    getReservationsByMonthYear( data, success ) {
        // let url = LMS_ENDPOINT_URL + `?id=${data['id']}&name=${data['name']}&nickname=${data['nickname']}&email=${data['email']}&mobile=${data['mobile']}&classid=${data['classid']}&domain=${domain}&domain_key=empty&function=reservation_list`;
        // console.log('url: ', url);
        //Mock Test Reservation list
        // url = "https://englishfordevelopers.com/api/ajax.php?id=k402486&email=k402486@naver.com&classid=${data[%27classid%27]}&domain=englishcoffeeonline.onlineenglish.kr&domain_key=empty&function=reservation_list";
        //Mock Test Reservation list by month year
        let m = parseInt(data['m']) < 10 ? '0' + data['m'] :  data['m'];
        
        let url = `https://englishfordevelopers.com/api/ajax.php?id=k402486&email=k402486@naver.com&classid=${data['classid']}&domain=englishcoffeeonline.onlineenglish.kr&domain_key=empty&function=class_list_by_month&Y=${data['Y']}&m=${m}`;
        this.http.get( url ).subscribe( re =>{
            let json = null;
            try {
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
        });
    }
    // getReservations( data, success ) {
    //     let url = LMS_ENDPOINT_URL + `?id=${data['id']}&name=${data['name']}&nickname=${data['nickname']}&email=${data['email']}&mobile=${data['mobile']}&classid=${data['classid']}&domain=${domain}&domain_key=empty&function=reservation_list`;
    //     console.log('url: ', url);
    //     //Mock Test Reservation list
    //     // url = "https://englishfordevelopers.com/api/ajax.php?id=k402486&email=k402486@naver.com&classid=${data[%27classid%27]}&domain=englishcoffeeonline.onlineenglish.kr&domain_key=empty&function=reservation_list";
    //     //Mock Test Reservation list by month year
    //     url = "https://englishfordevelopers.com/api/ajax.php?id=k402486&email=k402486@naver.com&classid=${data[%27classid%27]}&domain=englishcoffeeonline.onlineenglish.kr&domain_key=empty&function=class_list_by_month&Y=2017&m=03";
    //     this.http.get( url ).subscribe( re =>{
    //         let json = null;
    //         try {
    //             json = JSON.parse( re['_body'] );
    //         }
    //         catch ( e ) {
    //             alert("Parse ERROR on lms::getTeachers()");
    //         }

    //         if ( json['code'] ) {
    //             alert( json['message'] );
    //         }
    //         else {
    //             console.log(json);
    //             success( json['data'] );
    //         }
    //     });
    // }
}