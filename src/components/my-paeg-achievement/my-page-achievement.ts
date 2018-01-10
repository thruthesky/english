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
            if ( ! data) return alert("No Data Found...");
            console.log(data);
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
            alert("Error on retrieving the Class Sessions" + error);
        });

    }




}
