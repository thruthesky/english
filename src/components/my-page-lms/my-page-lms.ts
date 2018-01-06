import { Component } from '@angular/core';
import {LMS, LMS_URL} from '../../providers/lms';
import { App } from '../../providers/app';

@Component({
    selector: 'my-page-lms-component',
    templateUrl: 'my-page-lms.html',
    styleUrls: ['./my-page-lms.scss']
})
export class MyPageLMSComponent {


    data = {};

    constructor(
        public app: App,
        private lms: LMS,
    ) {

        this.lms.getLMSInformation(data => {
            if ( ! data) return alert("Error on retrieving the LMS Information");
            console.log(data);
            this.data = data;

            data.latest_comments.forEach((res) => {
                console.log(res);
                if (  res.icon.match(/.\/data/g))  res.icon = res.icon.replace(/.\/data/g,
                    LMS_URL + '/data');
            });
        }, error => {
            alert("Error on retrieving the LMS Information" + error);
        });

    }

}

