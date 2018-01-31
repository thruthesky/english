import {Component} from '@angular/core';
import {LMS, LMS_URL} from "../../providers/lms";
import {App} from "../../providers/app";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
    selector: 'my-page-leveltest-component',
    templateUrl: 'my-page-leveltest.html',
    styleUrls: ['./my-page-leveltest.scss']
})
export class MyPageLeveltestComponent {


    error = null;
    loading = true;

    rates: {
        expression?: number;
        grammar?: number;
        pronounciation?: number;
        speed?: number;
        vocabulary?: number;
    };


    limit = 50;
    no_of_points = 1;
    no_of_max_points = 45;
    performance_percentage = 1;
    average_level = 0;

    expression_percentage = 1;
    grammar_percentage = 1;
    pronounciation_percentage = 1;
    speed_percentage = 1;
    vocabulary_percentage = 1;


    show = {};


    first_class = {};

    single = false;


    comment = ['',
        `영어를 처음 접하는 단계입니다. 이제 막 알파벳을 배웠거나, 조금 읽을수 있는 수준입니다.
영어습득 속도와 향상이 굉장히 빠르며, 금방 읽고, 쓰고, 말하는 수준까지 도달할수 있습니다. 지속적으로 선생님과의 수업과 예습,복습이 중요한 단계입니다.
`,
        `영어에 대한 지식이 많다고 생각하지만, 실전에서는 떠오르지 않거나, 생각만 하는편입니다.또는 그동안 영어에 무관심하여 처음 배우는 것과 다름없는 없습니다.
문장단위로 이해가 어려우며, 아는 단어들을 조합하여 이해하며, 문장 전체의 의미가 아닌 단어단위로 이해하여, 다른의미로 받아들이기 쉽습니다.
계속된 반복학습이 필요하며, 질문에 답변시 문장보다는 간단한 단어로 대답 할수 있습니다
`,
        `익숙한 단어 또는 표현은 이해가 가능하지만, 아직도 본인의 생각이나 하고싶은 표현을 하는데에는 어려움이 많습니다.
시제나 단수,복수등의 구분이 어렵고, 완벽한 문장완성이 아직 미숙합니다. 학생의 이해를 위해서는 문장을 반복하거나 단순화시켜야 할 때가 많고, 질문 역시 간단해야
이해가 가능한 경우가 많습니다.
`,
        `평소 잘 알고 학습한 상황들에 대해서 문장들을 잘 이해할 수 있고, 여전히 제한된 어휘력을 갖고 있지만, 남들이 이해할 수 있도록 자기의 생각을 표현할 수 있는 상태입니다.
간단한 문장이나 질문을 만들 수 있지만, 여전히 명확한 이해를 위해서는 선생님의 반복이 필요한 단계입니다.
`,
        `자신이 마주치게 되는 거의 모든 말들을 이해할수 있는 단계입니다. 표현함에 있어
다소 어려움은 존재하지만, 다른 이들에게 자신의 생각을 전달 할 수 있습니다.
읽고 이해함에 있어 문법이해수준이 향상되었으며, 어휘력 역시 좋은 편입니다.
`,
        `상대방의 말을 쉽게 이해하고, 복잡한 질문에도 답할 수 있으며, 자신의 생각을 표현함에있어서 큰 어려움이 없는 상태입니다. 문장 구조의 문법적인 형태들에 대한 기초적인
구사력을 습득한 상태이며, 어휘력이 좋기 때문에 더 복잡한 어휘나 다양한 표현들을이해하고 구사할 수 있는 수준입니다.
`,
        `일반적인 상황에서 완벽하게 상대방의 말을 이해하고, 자신의 생각을 말하며, 질문을 할수있으며, 문법지식과 어휘력이 좋기 때문에 읽고 이해하거나, 자신의 생각을 표현하는데 있어
별 무리가 없는 상태입니다. 자신감 있게 자신의 의사를 표출할 수 있으며, 거의 유창한 단계라고 볼 수 있습니다.
`,
        `다향한 상황에서도 상대방의 말을 완벽하게 이해할 수 있으며, 자신의 생각을 다향한 방법으로 표현할 수 있는 능력을 갖춘 상태입니다. 수준 있는 글이나 복잡한 구조의
글들을 읽고 이해하는데 전혀 문제가 없으므로, 유창하고 자신감 있게 영어를 구사할 수 있는 수준입니다.
`,
        `실제 교양 있는 원어민에 버금갈 정도로 사적인 주제뿐만 아니라 일반적이고 사회적인내용에 이르기까지 유창하고 또한 자연스럽게 대화할수 있는 상태입니다. 이미 영어구사에
있어 상당한 수준에 이르렀기 때문에 아주 쉽게 수준 있는 내용들을 읽고 이해할수 있으며,숙달된 문법지식과 구조분석력이 작문에도 그대로 드러나는 수준이라고 말할 수 있습니다.
따라서 원어민들과 함께 일하는 전문적인 업무 환경에서도 능동적으로 잘 대처할수있습니다.
`];

    constructor(public app: App,
                private lms: LMS,
                public sanitizer: DomSanitizer) {

        this.lms.getFirstAndLastClasses(data => {
            this.loading = false;
            // if ( ! data) {
            //     this.error = "앗, 수업 예약 정보가 없습니다.";
            //     // return alert("LMS Information is empty...");
            // }
            // console.log(data);
            if (data['first_class'] === void 0) {
                this.error = "<div class='title'><i class='fa fa-warning'></i> 앗, 아직 수업을 하지 않았습니다.</div>" +
                    "<div class='desc'>레벨테스트는 정상적인 수업을 1개 이상 진행해야지만 결과를 볼 수 있습니다.</div>";
                return;
            }

            if (data['first_class']) {
                this.first_class = data['first_class'];
                this.pre(data['first_class']);
                // console.log("first_class", this.first_class);

                this.rates = {
                    expression: parseInt(this.first_class['rate_expression'], 10),
                    grammar: parseInt(this.first_class['rate_grammar'], 10),
                    speed: parseInt(this.first_class['rate_speed'], 10),
                    vocabulary: parseInt(this.first_class['rate_vocabulary'], 10),
                    pronounciation: parseInt(this.first_class['rate_pronounciation'], 10)
                };

                // console.log("rates:: ", this.rates);


                this.no_of_points = this.rates['expression'] + this.rates['grammar'] + this.rates['speed'] +
                    this.rates['vocabulary'] + this.rates['pronounciation'];
                this.performance_percentage = Math.floor(this.no_of_points * 100 / this.no_of_max_points);
                // console.log("rate", this.rates);

                this.expression_percentage = Math.floor(this.rates['expression'] * 100 / 9);
                this.grammar_percentage = Math.floor(this.rates['grammar'] * 100 / 9);
                this.pronounciation_percentage = Math.floor(this.rates['pronounciation'] * 100 / 9);
                this.speed_percentage = Math.floor(this.rates['speed'] * 100 / 9);
                this.vocabulary_percentage = Math.floor(this.rates['vocabulary'] * 100 / 9);

                this.average_level = Math.floor(this.performance_percentage / 100 * 9);
                console.log("average_level::", this.average_level);
            }


        }, error => {
            this.loading = false;
            this.error = "앗, 레벨테스트 정보를 가져오는 데 실패하였습니다. 서버 에러가 발생하였습니다.";
            // alert("Error on retrieving the LMS Information" + error);
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
