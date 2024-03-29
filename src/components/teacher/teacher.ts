import { Component, Input } from '@angular/core';
import { LMS } from '../../providers/lms';
import { DomSanitizer } from '@angular/platform-browser';
import { App } from './../../providers/app';
import {TeacherCommentViewComponent} from "../modals/teacher-comment-view/teacher-comment-view";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {TeacherCommentReviewComponent} from "../modals/teacher-comment-review/teacher-comment-review";
import {ReviewService} from "../../providers/review-service";

@Component({
    selector: 'teacher-component',
    templateUrl: 'teacher.html',
    styleUrls: ['./teacher.scss']
})
export class TeacherComponent {

    @Input() teachers;
    playVideo: boolean = false;
    showMore: boolean = false;
    whole_teacher: any = [];
    first_9_teachers;
    rest_teacher;
    teachers_rate: any = {};

    constructor(
      public app: App,
      public lms: LMS,
      public sanitizer: DomSanitizer,
      private modal: NgbModal,
      public review: ReviewService
    ) {
      this.loadTeachersRate();
    }

    ngOnChanges(changes) {
        if (changes['teachers']) {
            if (!this.teachers) return;
            this.teachers.forEach((teacher) => {
                teacher.id = teacher.id.replace('ontue_', '');
                teacher.id = teacher.id.replace('_ontue', '');
                teacher.id = teacher.id.replace(/[0-9]+/, '');
                teacher.play_video = false;
                teacher.show_more_greeting = false;
                if (teacher.birthday && teacher.birthday.length > 4) {
                    teacher.age = (new Date).getFullYear() - teacher.birthday.substr(0, 4);
                }

                if (teacher.url_youtube.match(/http :\/\//g)) teacher.url_youtube = teacher.url_youtube.replace(/http :\/\//g, 'http://');
                if (teacher.url_youtube.match(/^http:\/\//i)) teacher.url_youtube = teacher.url_youtube.replace(/^http:\/\//i, 'https://');//replace http to https
                if (teacher.url_youtube.match(/youtu.be/g)) teacher.url_youtube = teacher.url_youtube.replace(/youtu.be/g, 'youtube.com/embed');//replace youtu.be to youtube.com/embed
                if (teacher.greeting.match(/<img[^>]*>|<br.*>|&nbsp;/g)) teacher.greeting = teacher.greeting.replace(/<img[^>]*>|<br.*>|&nbsp;/g, "");//remove br tag img tag or &nbsp
                if (teacher.greeting.match(/(<([^>]+)>)/g)) teacher.greeting = teacher.greeting.replace(/(<([^>]+)>)/g, "");
                teacher.img_youtube = teacher.url_youtube.replace(/embed/g, "vi");
                teacher.img_youtube = teacher.img_youtube.match(/youtube.com/g, "img.youtube.com")? teacher.img_youtube.replace(/youtube.com/g, "img.youtube.com") + "/mqdefault.jpg":'assets/images/teacher/no-video.jpg';
                teacher.img_youtube = this.sanitizer.bypassSecurityTrustUrl(teacher.img_youtube);
                if( teacher.url_youtube ) {
                    teacher.url_youtube = teacher.url_youtube + "?autoplay=1&loop=1";
                    teacher.url_youtube = this.sanitizer.bypassSecurityTrustResourceUrl(teacher.url_youtube);
                }
                else teacher.url_youtube = false;
            });
        }
        this.first_9_teachers = this.teachers.filter(this.firstDisplayTeacherIndex);

        this.rest_teacher = this.teachers.filter(e => this.first_9_teachers.findIndex(x => e.nickname == x.nickname) == -1);
        this.checkFirstNineTeachers();
        this.whole_teacher = this.first_9_teachers.concat(this.rest_teacher);
        this.teachers = this.first_9_teachers;

    }
    checkFirstNineTeachers() {
        if( this.first_9_teachers.length < 9 ) {
            let diff = 9 - this.first_9_teachers.length;
            let i =0;
            while( i < diff ) {
                let item = this.rest_teacher[i];
                this.rest_teacher.splice(i,1);
                this.first_9_teachers.push(item);
                i++;
            }
        }
    }
    firstDisplayTeacherIndex(query, i) {
        if (query.id == "Fae" ||
            query.id == "Louine" ||
            query.id == "Sofia" ||
            query.id == "maconcepcion" ||
            query.id == "Ellise" ||
            query.id == "Ren" ||
            query.id == "Ghen" ||
            query.id == "Asha" ||
            query.id == "eden") {
            return query;
        }
    }

    isArray(obj) {
        if (obj.constructor.toString().indexOf('Array') == -1) return false;

        return true;
    }

    onClickShowMore() {
        this.showMore = !this.showMore;
        if (this.showMore) {
            this.teachers = this.whole_teacher;
        } else {
            this.teachers = this.first_9_teachers;
        }
    }

    onClickTeacherRate(teacher) {

      // if ( ! this.app.user.logged ) return this.app.alertModal( "수업 후기를 작성하기 위해서는 먼저 회원 로그인을 해야 합니다.", "로그인 필요" );
      const modalRefReview = this.modal.open( TeacherCommentReviewComponent, { windowClass: 'enhance-modal', size: "lg" } );
      modalRefReview.componentInstance['teacher'] = teacher;
      modalRefReview.result.then( result => {
        this.loadTeachersRate();
      }, reason => {
        this.loadTeachersRate();
      }).catch( error => {} );


    }

    loadTeachersRate() {
      this.review.getTeachersRate(res => {
        // console.log("getTeachersRate::", res);
        this.teachers_rate = res;
      });
    }


  getStars(n , addEmpty = true) {
    if(!n) n = 0;
    const s = [];
    for (let i = 1 ; i <=  n / 2; i++) {
      s.push("fa-star");
    }
    if ( n % 2) { s.push("fa-star-half-o"); }
    if ( addEmpty ) {
      const arr = 5 - Math.ceil(n / 2);
      const emptyStar = Array(arr).fill("fa-star-o");
      return s.concat(emptyStar);
    } else { return s; }
  }

  teacherStatus(teacher_idx, status: string) {
    if (this.app.teachers_status[teacher_idx] && this.app.teachers_status[teacher_idx][status]) {
      return true;
    }
    return false;
  }


}
