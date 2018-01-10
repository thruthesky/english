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
    first_class = {};
    last_class = {};

    constructor(
        public app: App,
        private lms: LMS,
    ) {

        this.lms.getFirstAndLastClasses(data => {
            if ( ! data) return alert("LMS Information is empty...");
            console.log(data);
            if ( data ) {
                if (data['first_class']) {
                    this.first_class = data['first_class'];
                    this.pre(data['first_class']);
                }
                if (data['last_class']) {
                    this.last_class = data['last_class'];
                    this.pre(data['last_class']);
                }
            } else {
                alert("No past class yet...");
            }

            console.log("first_class", this.first_class);
            console.log("last_class", this.last_class);
                // if (  data.icon.match(/.\/data/g) )
                //     data.icon = data.icon.replace(/.\/data/g, LMS_URL + '/data');


            // let re = data.icon.match(/<img.*?src=['"](.*?)['"]/);
            // if(!re) return;
            // data.icon = re[1].replace(/.\/data/g, LMS_URL + '/data');
            //
            // let b = <string>data.class_begin;
            // data.class_begin = b.substr(0, 2) + '시 ' + b.substr(2, 2) + '분';

        }, error => {
            alert("Error on retrieving the LMS Information" + error);
        });

    }


    pre(session) {
        if (!session.icon) { return; }
        const re = session.icon.match(/<img.*?src=['"](.*?)['"]/);
        if (!re) { return; }
        session.icon = re[1].replace(/.\/data/g, LMS_URL + '/data');

        const b = <string>session.class_begin;
        session.class_begin = b.substr(0, 2) + '시 ' + b.substr(2, 2) + '분';
    }

}
