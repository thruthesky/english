import { Component, OnInit } from '@angular/core';
import { LMS } from '../../providers/lms';
import { User } from '../../angular-backend/user';
import { PrevMonths, NextMonths, BOOKS, WEEKS } from './reservation-interface';
@Component({
    selector: 'reservation-component',
    templateUrl: 'reservation.html'
})
export class ReservationComponent implements OnInit {
    data: BOOKS = [];
    maxDay:number = 42;
    calendarLoad:boolean = true;
    books: BOOKS = [];
    weeks: WEEKS = [];
    date:Date = new Date();
    year:number = this.date.getFullYear();
    month:number = parseInt(("0" + (this.date.getMonth() + 1)).slice(-2));
    prevMonths:Array<PrevMonths> = [];
    nextMonths:Array<NextMonths> = [];
    constructor(
        public user : User,
        private lms : LMS
    ) {}
    ngOnInit() {
        this.listCalendar(this.month, this.year);
        this.getNewReservationData();
        this.getPreviousMonths();
        this.getNextMonths();
    }
    getPreviousMonths() {
        this.prevMonths = [];
        for(let i=0; i < 12;i++ ) {
            let test = (new Date(this.year, this.month-i, 1, 1, 10)).toDateString().split(" ");
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
    getNewReservationData() {
        this.calendarLoad = true;
        this.lms.getReservationsByMonthYear( { m:this.month , Y:this.year }, ( res )=> {
            //Process gather data
            res.books.forEach((res)=>{
                if(  res.icon.match(/.\/data/g))  res.icon = res.icon.replace(/.\/data/g,
                 'https://englishfordevelopers.com/api/data');
            });
            this.data = res.books;
            this.listCalendar( this.month, this.year);
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
            if(this.data) book = this.data.find( book => book['date'] == date );
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
        this.getNewReservationData();
    }
    onClickPrev() {
        this.month --;
        if( this.month < 1) {
            this.year --;
            this.month = 12;
        }
        this.getNewReservationData();
    }
}