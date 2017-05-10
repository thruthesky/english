import { Component, OnInit } from '@angular/core';
import { LMS, LMS_URL } from '../../providers/lms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClassInfoModal } from '../modals/class-info/class-info';
import { User } from 'angular-backend';
import { PrevMonths, NextMonths, BOOKS, WEEKS, ClassInformation, NewDate, ListOfYears } from './reservation-interface';
import { App } from '../../providers/app';
import { ShareService } from '../../providers/share-service';
@Component({
    selector: 'reservation-component',
    templateUrl: 'reservation.html',
    styleUrls: ['./reservation.scss']
})
export class ReservationComponent implements OnInit {
    data: BOOKS = [];
    maxDay:number = 42;
    calendarLoad:boolean = true;
    books: BOOKS = [];
    chemy: BOOKS = [];
    weeks: WEEKS = [];
    date:Date = new Date();
    year:number = this.date.getFullYear();
    month:number = parseInt(("0" + (this.date.getMonth() + 1)).slice(-2));
    prevMonths:Array<PrevMonths> = [];
    nextMonths:Array<NextMonths> = [];
    listOfYears:Array<ListOfYears> = [];
    classinformation:ClassInformation = null;
    showPrevious: boolean = false;
    showNext: boolean = false;
    showYear: boolean = false;
    constructor(
        private app     : App,
        private modal   : NgbModal,
        public user     : User,
        private lms     : LMS,
        public share: ShareService
    ) {
        this.listenEvents();
    }
    listenEvents(){
        this.app.myEvent.subscribe( item =>{
            if( item.eventType == 'login-success'  ){
              this.getNewReservationData()
            }
        });
    }
    ngOnInit() {
        this.listCalendar(this.month, this.year);
        this.getNewCalendar();
    }
    getNewCalendar() {
        this.getNewReservationData();
        this.getPreviousMonths();
        this.getNextMonths();
        this.getListOfYears();
    }
    selectNewDate( data: NewDate ) {
        this.year = parseInt(data.Y);
        this.month =new Date(Date.parse(`${data.m} +1, ${data.Y}`)).getMonth()+1;
        this.getNewCalendar();
    }
    getPreviousMonths() {
        this.prevMonths = [];
        for(let i=0; i < 13;i++ ) {
            let test = (new Date(this.year, this.month-i-1, 1, 1, 10)).toDateString().split(" ");
            this.prevMonths.push( { m: test[1], Y: test[3] } );
        }
    }
    getNextMonths() {
        this.nextMonths = [];
        for(let i=0; i < 12;i++ ) {
            let test = (new Date(this.year, this.month+i, 1, 1, 10)).toDateString().split(" ");
            this.nextMonths.push( { m: test[1], Y: test[3] } );
        }
    }
    getListOfYears() {
        let startingYear = this.year;
        --startingYear;
        this.listOfYears = [];
        for(let i=0; i < 5;i++ ) {
            let test = (new Date(startingYear+i, this.month-1, 1, 1, 10)).toDateString().split(" ");
            this.listOfYears.push( { m: test[1], Y: test[3] } );
        }
    }
    
    getNewReservationData() {
        this.calendarLoad = true;
        this.lms.getReservationsByMonthYear( { m:this.month , Y:this.year }, ( res )=> {
            console.log("Salt:",res);
            //Process gather data
            this.classinformation = {
                first_class: res.first_class,
                next_class: res.next_class,
                no_of_past: res.no_of_past,
                no_of_reservation: res.no_of_reservation
            };
            this.share.class_info = this.classinformation;
            res.books.forEach((res)=>{
                if(  res.icon.match(/.\/data/g))  res.icon = res.icon.replace(/.\/data/g,
                 LMS_URL + '/data');
            });
            this.data = res.books;
            this.listCalendar( this.month, this.year);
            this.calendarLoad = false;
        }, () => {
            this.calendarLoad = false;
        });
    }


    add0(n:number) : string {
        return n < 10 ? '0' + n : n.toString();
    }
    listCalendar( month, year ) {
        this.books = [];
        let book;
        let empty_day = new Date(year + "-" + month + "-01").getDay()               // first date(day) of the month. 0~6
        let days_in_month = new Date(year, month, 0).getDate();                     // last date(day) of the month. 28, 29, 30.
        for (let i = 0; i < empty_day; i++) { this.books.unshift( null ); }      // Fill all the empty days first
        for (let i = 1; i <= days_in_month; i++) {                                  //Fill the days of month
            let date = this.year.toString() +  this.add0( this.month ) + this.add0( i );
            if(this.data) book = this.data.filter( (mybook)=> { return mybook['date'] == date; });
            if ( book ) book['myDate'] = i;
            else book = { myDate: i };
            this.books.push( book );
        }
        while( this.books.length < this.maxDay ) { this.books.push( null ); } // fill the remaining days
        this.weeks = this.chunk(this.books );                             //Chunk Date
    }
    

    chunk( arr:BOOKS ) : WEEKS {
        let temp:WEEKS = [];
        for( let i = 0; i < arr.length; i = i + 7 ) {
            temp.push( this.pres( arr.slice( i, i + 7 ) ) );
        }
        return temp;
    }

    pres( arr: any ) {
        return arr.map( e => this.pre(e) );
    }
    pre( data ) {
        return data;
    }

    onClickNext() {
        this.month ++;
         if( this.month > 12) {
            this.year ++;
            this.month = 1;
        }
        this.getNewCalendar();
    }
    onClickPrev() {
        this.month --;
        if( this.month < 1) {
            this.year --;
            this.month = 12;
        }
        this.getNewCalendar();
    }
    onClickClassInfo( data ) {
        this.modal.open( ClassInfoModal ).result.then( () => {
        }).catch( e => console.log('exit ' + e ) );
        this.app.myEvent.emit( {
             eventType:"post",
             data: data 
        } );
    }
}