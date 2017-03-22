import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { App } from '../../../providers/app';
export interface Teacher {
    idx:string;
    mb_name:string;
    mb_nick:string;
}
export interface ClassInfo {
    absent_student:string;
    absent_teacher:string;
    ap:string;
    book:string;
    check:string;
    class_begin:string;
    class_end:string;
    classid:string;
    date:string;
    display:boolean;
    domain:string;
    icon:string;
    idx:string;
    idx_schedule_table:string;
    idx_student:string;
    idx_teacher:string;
    kdate:string;
    kday:string;
    ktime:string;
    mins:string;
    myDate:number;
    point:string;
    rate_attitue:string;
    rate_comment:string;
    rate_expression:string;
    rate_grammar:string;
    rate_level:string;
    rate_pronounciation:string;
    rate_speed:string;
    rate_stamp:string;
    rate_vocabulary:string;
    ready:string;
    refund_request_done_stamp:string;
    refund_request_reason:string;
    refund_request_stamp:string;
    regstamp:string;
    status_payment:string;
    teacher:Teacher;
}
@Component({
    selector: 'class-info-component',
    templateUrl: 'class-info.html',
    styleUrls: ['class-info.scss']
})

export class ClassInfoModal{
    classInfo: ClassInfo;
    constructor(
        private app         : App,
        private activeModal : NgbActiveModal ){
        this.listenEvents();
    }
    listenEvents() {
        this.app.myEvent.subscribe( item =>{
            if( item.eventType == 'post'  ){
              console.log("Success:",item.data);
              this.classInfo = item.data;
            }
        });
    }
    onClickDismiss(){
        this.activeModal.close();
    }
}