import { Component, Input } from '@angular/core';
import { LMS } from '../../providers/lms';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'teacher-component',
    templateUrl: 'teacher.html',
    styleUrls: ['./teacher.scss']
})
export class TeacherComponent {

    @Input() teachers;
    // teachers container to be displayed
    playVideo: boolean = false;
    showMore: boolean = false;
    whole_teacher: any = [];
    first_9_teachers;
    rest_teacher;
    constructor(public lms: LMS, public sanitizer: DomSanitizer) {
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
                teacher.img_youtube = teacher.img_youtube.replace(/youtube.com/g, "img.youtube.com") + "/mqdefault.jpg";
                teacher.img_youtube = this.sanitizer.bypassSecurityTrustUrl(teacher.img_youtube);//to fix unsafe
                teacher.url_youtube = teacher.url_youtube + "?autoplay=1&autohide=1&controls=0&border=0&scrolling=no";
                teacher.url_youtube = this.sanitizer.bypassSecurityTrustResourceUrl(teacher.url_youtube);//to fix unsafe
            });
        }
        this.first_9_teachers = this.teachers.filter(this.firstDisplayTeacherIndex);
        this.rest_teacher = this.teachers.filter(e => this.first_9_teachers.findIndex(x => e.nickname == x.nickname) == -1);
        this.whole_teacher = this.first_9_teachers.concat(this.rest_teacher);


        this.teachers = this.first_9_teachers;

    }

    firstDisplayTeacherIndex(query, i) {
        if (query.nickname == "Mngr Fae" ||
            query.nickname == "Louine" ||
            query.nickname == "Meg" ||
            query.nickname == "Yani" ||
            query.nickname == "Ellise" ||
            query.nickname == "Den" ||
            query.nickname == "Ren" ||
            query.nickname == "Ghen" ||
            query.nickname == "Asha") {
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
        }
        else {
            this.teachers = this.first_9_teachers;
        }
    }
}