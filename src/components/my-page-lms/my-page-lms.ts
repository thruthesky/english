import { Component } from '@angular/core';
import { LMS, LMS_URL } from '../../providers/lms';
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
            if (!data) return alert("LMS Information is empty...");
            console.log(data);

            data.latest_comments.forEach((res) => {

                let re = res.icon.match(/<img.*?src=['"](.*?)['"]/);
                if (!re) return;
                res.icon = re[1].replace(/.\/data/g, LMS_URL + '/data');

                let b = <string>res.class_begin;
                res.class_begin = b.substr(0, 2) + '시 ' + b.substr(2, 2) + '분';
            });

            this.data = data;
        }, error => {
            alert("Error on retrieving the LMS Information" + error);
        });

    }

}

