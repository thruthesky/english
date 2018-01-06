import { Component } from '@angular/core';
import {LMS, LMS_URL} from "../../providers/lms";
import {App} from "../../providers/app";

@Component({
    selector: 'my-page-achievement-component',
    templateUrl: 'my-page-achievement.html',
    styleUrls: ['./my-page-achievement.scss']
})
export class MyPageAchievementComponent {

    data = [];
    limit = 10
    constructor(
        public app: App,
        private lms: LMS,
    ) {

        this.lms.getLatestPastSession(this.limit, data => {
            if ( ! data) return alert("No Data Found...");
            console.log(data);
            this.data = data;

        }, error => {
            alert("Error on retrieving the Class Sessions" + error);
        });

    }
}
