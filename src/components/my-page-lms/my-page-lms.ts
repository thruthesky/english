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
    error = null;
    loading = true;

    constructor(
        public app: App,
        private lms: LMS,
    ) {

        this.lms.getLMSInformation(data => {

            this.loading = false;

            
            if ( data['count_past'] < 1 ) {
                this.error = "<div class='title'><i class='fa fa-warning'></i> 앗, 아직 수업을 하지 않았습니다.</div><div class='desc'>정상적인 수업을 해야 수업 정보를 보여드릴 수가 없습니다.<br>수업을 먼저 예약해 보세요.</div>";
                return;
            }
            data.latest_comments.forEach((res) => {

                let re = res.icon.match(/<img.*?src=['"](.*?)['"]/);
                if (!re) return;
                res.icon = re[1].replace(/.\/data/g, LMS_URL + '/data');

                let b = <string>res.class_begin;
                res.class_begin = b.substr(0, 2) + '시 ' + b.substr(2, 2) + '분';
            });

            this.data = data;
        }, error => {
            this.loading = false;
            this.error = "앗, 아직 수업을 하지 않았습니다.<br>레벨테스트는 정상적인 수업을 1개 이상 진행해야지만 결과를 볼 수 있습니다.";
            // alert("Error on retrieving the LMS Information" + error);
        });

    }

    shortDate( date: string ) {
        return date.substr(2);
    }
}

