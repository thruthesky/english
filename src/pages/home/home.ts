import { Component, AfterViewInit, ViewChild, Injectable } from '@angular/core';

import { App } from '../../providers/app';
import { User } from 'angular-backend';
import { LMS, TEACHERS } from '../../providers/lms';
import { ReservationComponent } from './../../components/reservation/reservation';





@Component( {
    selector: 'home-page',
    templateUrl: 'home.html',
    styleUrls: ['./home.scss'],
})
export class HomePage implements AfterViewInit {
    data;
    teachers: TEACHERS = null;
    @ViewChild('reservation') reservation: ReservationComponent;
    constructor(
        public app : App,
        public user: User,
        private lms: LMS
            )
    {
            this.lms.getTeachers( teachers => this.teachers = teachers );
    }


    ngAfterViewInit() {
    }

}
