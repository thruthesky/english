import {Component} from '@angular/core';
import {LMS, LMS_URL} from "../../providers/lms";
import {App} from "../../providers/app";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
    selector: 'my-page-achievement-component',
    templateUrl: 'my-page-achievement.html',
    styleUrls: ['./my-page-achievement.scss']
})
export class MyPageAchievementComponent {

    error = null;
    loading = true;
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


    show = {};


    first_class = {};
    last_class = {};

    single = false;



    constructor(public app: App,
                private lms: LMS,
                public sanitizer: DomSanitizer) {


        this.lms.getFirstAndLastClasses(data => {
            this.loading = false;

            if (data['first_class'] === void 0) {
                this.error = "<div class='title'><i class='fa fa-warning'></i> 앗, 아직 수업을 하지 않았습니다.</div>" +
                    "<div class='desc'>레벨테스트는 정상적인 수업을 1개 이상 진행해야지만 결과를 볼 수 있습니다.</div>";
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

            if (this.first_class['idx'] == this.last_class['idx']) {
                this.single = true;
            }


        }, () => {
            this.loading = false;
            this.error = "앗, 레벨테스트 정보를 가져오는 데 실패하였습니다. 서버 에러가 발생하였습니다.";
        });


    }


    pre(session) {
        if (!session.icon) {
            return;
        }
        const re = session.icon.match(/<img.*?src=['"](.*?)['"]/);
        if (!re) {
            return;
        }
        session.icon = re[1].replace(/.\/data/g, LMS_URL + '/data');

        const b = <string>session.class_begin;
        session.class_begin = b.substr(0, 2) + '시 ' + b.substr(2, 2) + '분';
    }


}
