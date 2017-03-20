import { Component, AfterViewInit, ViewChild } from '@angular/core';

import { App } from '../../providers/app';
import { LMS, TEACHERS } from '../../providers/lms';
import { ReservationComponent } from './../../components/reservation/reservation';
import { Test } from './../../angular-backend/test';

@Component( {
    selector: 'home-page',
    templateUrl: 'home.html'
})
export class HomePage implements AfterViewInit {
    //login: boolean = false;
    data;
    teachers: TEACHERS = null;
    @ViewChild('reservation') reservation: ReservationComponent;
    constructor(
        public app: App,
        private lms: LMS,
        private test: Test
            ) {
        // testAll.run();
        this.lms.getTeachers( teachers => this.teachers = teachers );
        // console.log( 'check this user ::: ' + JSON.stringify(this.user.loginUser) );
        //if( this.user.loggedIn ) this.getReservation();

        //this.listenevent();


        //_.version();
        



    }




    // listenevent(){
    //     this.app.myEvent.subscribe( item =>{
    //         if( item.eventType == 'loggedin'  ){
    //             setTimeout( () =>{
    //                 this.getReservation();
    //             }, 400);
    //         }
    //         if( item.eventType == 'loggedout') this.reservations = {};
    //     })
    // }



    getUserData() {
        // console.info('userid ' + this.user.loginUser.uid )
        // this.user.private_get( this.user.loginUser.uid, res => {
        //     this.data = res;
        //     //this.getReservation();

        // }, error => {
        //     console.log('error ::' + error );
        // }, () =>{
        // });
    }



    ngOnInit() {

        // if( this.user.loggedIn ) this.reservation.getReservation();
    }
    ngAfterViewInit() {
        console.log("HomePage::ngAfterViewInit() : ");
    }

    onLogin() {
        ///setTimeout( () =>{
        // this.reservation.getReservation();
        //}, 400);
    }
    onLogout(){
    }
}
