import { Component } from '@angular/core';
import {LMS, LMS_URL} from "../../providers/lms";
import {App} from "../../providers/app";

@Component({
    selector: 'my-page-leveltest-component',
    templateUrl: 'my-page-leveltest.html',
    styleUrls: ['./my-page-leveltest.scss']
})
export class MyPageLeveltestComponent {


    error = null;
    loading = true;
    data = {};
    first_class = {};
    last_class = {};

    single = false;

    constructor(
        public app: App,
        private lms: LMS,
    ) {

        this.lms.getFirstAndLastClasses(data => {
            this.loading = false;
            // if ( ! data) {
            //     this.error = "앗, 수업 예약 정보가 없습니다.";
            //     // return alert("LMS Information is empty...");
            // }
            console.log(data);
            if ( data['first_class'] === void 0 ) {
                this.error = "<div class='title'><i class='fa fa-warning'></i> 앗, 아직 수업을 하지 않았습니다.</div><div class='desc'>레벨테스트는 정상적인 수업을 1개 이상 진행해야지만 결과를 볼 수 있습니다.</div>";
                return;
            }
                if (data['first_class']) {
                    this.first_class = data['first_class'];
                    this.pre(data['first_class']);
                }
                if (data['last_class']) {
                    this.last_class = data['last_class'];
                    this.pre(data['last_class']);
                }

                if ( this.first_class['idx'] == this.last_class['idx'] ) {
                    this.single = true;
                }

            // console.log("first_class", this.first_class);
            // console.log("last_class", this.last_class);
                // if (  data.icon.match(/.\/data/g) )
                //     data.icon = data.icon.replace(/.\/data/g, LMS_URL + '/data');


            // let re = data.icon.match(/<img.*?src=['"](.*?)['"]/);
            // if(!re) return;
            // data.icon = re[1].replace(/.\/data/g, LMS_URL + '/data');
            //
            // let b = <string>data.class_begin;
            // data.class_begin = b.substr(0, 2) + '시 ' + b.substr(2, 2) + '분';

        }, error => {
            this.loading = false;
            this.error = "앗, 레벨테스트 정보를 가져오는 데 실패하였습니다. 서버 에러가 발생하였습니다.";
            // alert("Error on retrieving the LMS Information" + error);
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
