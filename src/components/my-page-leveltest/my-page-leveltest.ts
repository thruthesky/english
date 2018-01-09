import { Component } from '@angular/core';
import {LMS, LMS_URL} from "../../providers/lms";
import {App} from "../../providers/app";

@Component({
    selector: 'my-page-leveltest-component',
    templateUrl: 'my-page-leveltest.html',
    styleUrls: ['./my-page-leveltest.scss']
})
export class MyPageLeveltestComponent {


    data = {};

    constructor(
        public app: App,
        private lms: LMS,
    ) {

        this.lms.getFirstClass(data => {
            if ( ! data) return alert("LMS Information is empty...");
            console.log(data);
            this.data = data;
                // if (  data.icon.match(/.\/data/g) )
                //     data.icon = data.icon.replace(/.\/data/g, LMS_URL + '/data');


            let re = data.icon.match(/<img.*?src=['"](.*?)['"]/);
            if(!re) return;
            data.icon = re[1].replace(/.\/data/g, LMS_URL + '/data');

            let b = <string>data.class_begin;
            data.class_begin = b.substr(0, 2) + '시 ' + b.substr(2, 2) + '분';

        }, error => {
            alert("Error on retrieving the LMS Information" + error);
        });

    }

}
