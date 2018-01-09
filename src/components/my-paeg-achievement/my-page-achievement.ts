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

    data = [];
    limit = 40;
    m = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];


    expression = 0;
    vocabulary = 0;
    grammar = 0;
    pronounciation = 0;

    success_sessions = 0;
    failed_sessions = 0;

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
            this.pre(data);

        }, error => {
            alert("Error on retrieving the Class Sessions" + error);
        });

    }

    pre(data) {
        data.forEach( s => {
            if ( s['absent_student'] || s['absent_student'] ) {
                this.failed_sessions ++;
            } else if ( s['rate_level'] > 0 ) {
                this.success_sessions ++;
                this.expression += s['rate_expression'];
                this.vocabulary += s['rate_vocabulary'];
                this.grammar += s['rate_grammar'];
                this.pronounciation += s['rate_pronounciation'];
            }
        });

        console.log("success_sessions", this.success_sessions);
        console.log("failed_sessions", this.failed_sessions);
        console.log("expression", this.expression);
        console.log("vocabulary", this.vocabulary);
        console.log("grammar", this.grammar);
        console.log("pronounciation", this.pronounciation);
    }



}
