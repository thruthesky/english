import { Component, AfterViewInit, ViewChild } from '@angular/core';

import { App } from '../../providers/app';
import { User } from 'angular-backend';
import { LMS, TEACHERS } from '../../providers/lms';
import { ReservationComponent } from './../../components/reservation/reservation';
import {ShareService} from '../../providers/share-service';





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
        public app: App,
        public user: User,
        private lms: LMS,
        public shared: ShareService
    ) {
            this.lms.getTeachers( teachers => this.teachers = teachers );
            this.shared.page = 'my-page'; //test only
    }


    ngAfterViewInit() {
    }

}
