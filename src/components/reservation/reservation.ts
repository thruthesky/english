import { Component, OnInit } from '@angular/core';
import { LMS, LMS_URL } from '../../providers/lms';
import { User } from 'angular-backend';
import { _PrevMonths, _NextMonths, _BOOKS, _WEEKS, _ClassInformation, _NewDate, _ListOfYears } from './reservation-interface';
import { App, DAYS_EN } from '../../providers/app';
import { ShareService } from '../../providers/share-service';
@Component({
    selector: 'reservation-component',
    templateUrl: 'reservation.html',
    styleUrls: ['./reservation.scss']
})
export class ReservationComponent implements OnInit {
    noFirstClass: string = "예약된 수업이 없습니다.";
    noNextClass: string = "예약된 수업이 없습니다.";
    data: _BOOKS = [];
    calendarLoad:boolean = true;
    books: _BOOKS = [];
    weeks: _WEEKS = [];
    date:Date = new Date();
    year:number = this.date.getFullYear();
    month:number = parseInt(("0" + (this.date.getMonth() + 1)).slice(-2));
    prevMonths: Array<_PrevMonths> = [];
    nextMonths: Array<_NextMonths> = [];
    listOfYears: Array<_ListOfYears> = [];
    classinformation: _ClassInformation = null;
    constructor(
        public app     : App,
        public user     : User,
        private lms     : LMS,
        public share    : ShareService
    ) {
        // console.log("reservation page: recreate??");
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
            // console.log('data: ', res);
            this.classinformation = {
                first_class: res.first_class,
                next_class: res.next_class,
                no_of_past: res.no_of_past,
                no_of_reservation: res.no_of_reservation
            };
            if ( this.classinformation.first_class == "No class" ) this.classinformation.first_class = "예약된 수업이 없습니다.";
            if ( this.classinformation.next_class == "No reservation" ) this.classinformation.next_class = "예약된 수업이 없습니다.";

            this.share.class_info = this.classinformation;
            this.app.classInfo = this.classinformation;
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
        let empty_day = new Date( year,month-1,1).getDay();
        let days_in_month = new Date(year, month, 0).getDate();
        for (let i = 0; i < empty_day; i++) { this.books.unshift( null ); }
        for (let i = 1; i <= days_in_month; i++) {
            let date = this.year.toString() +  this.add0( this.month ) + this.add0( i );
            if(this.data) book = this.data.filter( (mybook)=> { return mybook['date'] == date; });
            if ( book ) book['myDate'] = i;
            else book = { myDate: i };
            this.books.push( book );
        }
        while( !(<number>this.books.length % 7 == 0 )) { this.books.push( null ); }
        this.weeks = [];
        this.weeks = this.chunk(this.books );
    }


    chunk( arr: _BOOKS ) : _WEEKS {
        let temp: _WEEKS = [];
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
        if ( this.month < 1) {
            this.year --;
            this.month = 12;
        }
        this.getNewCalendar();
    }

    formatFirstClass( info ) {
        if ( info.first_class !== void 0 && info.first_class != this.noFirstClass ) {
            let date = info.first_class.split('-');
            return `${date[0]}년 ${date[1]}월 ${date[2]}일에 첫 수업을 하였습니다.`;
        }
        else return "앗! 아직 수업을 하지 않으셨네요. 얼른 레벨테스트 부터 시작해 보세요.";
    }
    formatNextClass( info ) {
        if ( info.next_class !== void 0 && info.next_class != this.noNextClass ) {
            let re = info.next_class;
            let parts = re.split(' ', 2);
            let day = parts[1];
            let new_day = (<string> day).replace(' ', '');
            new_day = this.app.DAYS[ DAYS_EN[new_day] ];
            new_day = `(${new_day})`;
            parts = re.split('-');
            let teacher = parts[3];
            re = re.replace( day, new_day);
            re = re.replace( teacher, `${teacher} 선생님`);
            return re;
        }
        else return "예약된 수업이 없습니다.";
    }

    getPlacement( i ) {
      if ( i === 1) {
        return 'right';
      } else if ( i === 5 ) {
        return 'left';
      } else {
        return 'top';
      }
    }
}
