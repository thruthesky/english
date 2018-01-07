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
            s['style'] = this.sanitizer.bypassSecurityTrustStyle('width: ' + (100 / data.length) + '%');
        });
    }



}
