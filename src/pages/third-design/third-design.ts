import { Component, AfterViewInit, ViewChild } from '@angular/core';

import { App } from '../../providers/app';
import { LMS, TEACHERS } from '../../providers/lms';
import { ReservationComponent } from './../../components/reservation/reservation';
// import { Test } from './../../angular-backend/test';

@Component( {
    selector: 'third-design',
    templateUrl: 'third-design.html',
    styleUrls: ['./third-design.scss']
})
export class ThirdDesignPage implements AfterViewInit {
    //login: boolean = false;
    data;
    design:string = "first";
    teachers: TEACHERS = null;
    @ViewChild('reservation') reservation: ReservationComponent;
    constructor(
        public app: App,
        // private test: Test,
        private lms: LMS
            ) {
                console.log("HomePage::constructor");
        this.lms.getTeachers( teachers => this.teachers = teachers );
    }




    getUserData() {

    }



    ngOnInit() {

    }
    ngAfterViewInit() {
        console.log("HomePage::ngAfterViewInit() : ");
    }

    onLogin() {
    
    }
    onLogout(){
    }
}
