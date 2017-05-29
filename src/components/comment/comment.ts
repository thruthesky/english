import { Component } from '@angular/core';
import { App } from './../../providers/app';
@Component({
    selector: 'comment-component',
    templateUrl: 'comment.html',
    styleUrls: ['./comment.scss']
})

export class CommentComponent {


    students: Array<{
        src: string;
        name: string;
        comment: string;
    }> = [
        { name:"박수환", src:"assets/images/comment/comment1.png", comment:"지난 2년간 함께하며 제 영어 실력을 향상 시켜준 Jam 선생님께 진심으로 감사드립니다." },
        { name:"정주은", src:"assets/images/comment/comment2.png", comment:"Fae 선생님을 만난 것은 큰 행운입니다. 덕분에 영어를 마스터 할 수 있었습니다." },
        { name:"김민지", src:"assets/images/comment/comment3.png", comment:"저는 6살때 부터 이 홈페이지에서 1:1 화상여어를 했는데 지금은 초등학교 2학년이에요. 삼육 학원에서 고등학생과 같이 수업을 해요. 한국말하는 것 처럼 영어를 자연스럽게 할 수 있어요. Briana 선생님 덕분이죠." },
        { name:"이진희", src:"assets/images/comment/comment4.png", comment:"Krizelle 선생님께서 잘 리드해 주셔서 영어 두근거림이 사라졌습니다." },
        { name:"김영희", src:"assets/images/comment/comment5.png", comment:"Pia 선생님께서 잘 가르쳐주셔서 영어 말하기 대회에서 입상하였습니다." },
        { name:"쥴리아 정", src:"assets/images/comment/comment6.png", comment:"영어는 참 쉬워요. 좋은 선생님을 만난다면 더욱 빠르게 영어가 늘죠. 고마워요 Stacey 선생님." },
    ];

    constructor( public app: App ) {}
    
}