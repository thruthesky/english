import { Component } from '@angular/core';
import {LMS, LMS_URL} from "../../providers/lms";
import {App} from "../../providers/app";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
    selector: 'my-page-achievement-component',
    templateUrl: 'my-page-achievement.html',
    styleUrls: ['./my-page-achievement.scss']
})
export class MyPageAchievementComponent {

    error = null;
    loading = true;
    data: {
        max_score?: number;
        no_of_classes?: number;
        no_of_failure?: number;
        no_of_success?: number;
        rates?: {
            expression?: number;
            grammar?: number;
            pronounciation?: number;
            speed?: number;
            vocabulary?: number;
        }
    } = {};
    limit = 50;
    no_of_points = 1;
    no_of_max_points = 1;
    performance_percentage = 1;
    average_level = '';

    expression_percentage = 1;
    grammar_percentage = 1;
    pronounciation_percentage = 1;
    speed_percentage = 1;
    vocabulary_percentage = 1;


    show = {};
    
    constructor(
        public app: App,
        private lms: LMS,
        public sanitizer: DomSanitizer
    ) {
        // for testing only

        // let dt = new Date();

        // for (let num = 1; num <= this.limit; num++) {
        //     let nd = new Date(dt.setDate((dt.getDate() + num )))
        //     this.data.push({
        //         rate_level: Math.ceil(Math.random() * 9),
        //         kdate: this.m[nd.getMonth()] + '/' + nd.getDay()
        //     });
        // }
        // this.pre(this.data);

        // end of testing

        this.lms.getLatestPastSession(this.limit, data => {
            this.loading = false;
            // if ( ! data) return alert("No Data Found...");
            // console.log(data);

            if ( data['no_of_success'] < 1 ) {
                this.error = "<i class='fa fa-warning'></i> 앗, 수업정보가 없습니다.<br>아직 수업을 하지 않아서 (또는 정상적으로 수업이 이루어지지 않아서) 수업 학업성취도를 보여드릴 수가 없습니다.<br>수업을 먼저 예약해 보세요.";
                return;
            }


            this.data = data;
            const rate = data['rates'];
            this.no_of_max_points = data['max_score'];
            this.no_of_points = rate['expression'] +  rate['grammar'] + rate['speed'] + rate['vocabulary'] + rate['pronounciation'];

            this.expression_percentage = Math.floor(rate['expression'] * 100 / (data['no_of_success'] * 9));
            this.grammar_percentage = Math.floor(rate['grammar'] * 100 / (data['no_of_success'] * 9));
            this.pronounciation_percentage = Math.floor(rate['pronounciation'] * 100 / (data['no_of_success'] * 9));
            this.speed_percentage = Math.floor(rate['speed'] * 100 / (data['no_of_success'] * 9));
            this.vocabulary_percentage = Math.floor(rate['vocabulary'] * 100 / (data['no_of_success'] * 9));


            this.performance_percentage = Math.floor(this.no_of_points * 100 / data['max_score']);
            const level = parseInt(this.performance_percentage.toString()[0], 10);
            if ( level === 9 ) {
                this.average_level = '8-9';
            } else if ( level === 0) {
                this.average_level = '1';
            } else {
                this.average_level = `${level}-${level + 1}`;
            }

        }, error => {
            this.loading = false;
            this.error = "앗, 레벨테스트 정보를 가져오는 데 실패하였습니다. 서버 에러가 발생하였습니다.";
            // alert("Error on retrieving the Class Sessions" + error);
        });

    }




}
