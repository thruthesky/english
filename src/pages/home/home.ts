import { Component, AfterViewInit, ViewChild } from '@angular/core';

import { App } from '../../providers/app';
import { User } from 'angular-backend';
import { LMS, TEACHERS } from '../../providers/lms';
import { ReservationComponent } from './../../components/reservation/reservation';
import {ShareService} from '../../providers/share-service';

import { ReviewService } from '../../providers/review-service';


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
        public shared: ShareService,
        review: ReviewService,
    ) {
            this.lms.getTeachers( teachers => this.teachers = teachers );
            // this.shared.page = 'my-page'; //test only
            // this.shared.page = 'english-news';

            // this.lms.isMyTeacher( 27830, re => {
            //     console.log("home: re", re);
            // } );

            // console.log("db: ", db);


    }

    ngAfterViewInit() {
    }


}
