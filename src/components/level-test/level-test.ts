import { Component } from '@angular/core';
import { App } from './../../providers/app';
@Component({
    selector: 'level-test-component',
    templateUrl: 'level-test.html',
    styleUrls: ['./level-test.scss']
})
export class LevelTestComponent {

    days = [];
    selectedDay;
    constructor(
        public app: App
    ) {


        for( let i = 0; i < 100; i ++ ) {
            let d = (new Date);
            let newDate = new Date( d.getFullYear(), d.getMonth(), d.getDate() + i );
            if ( newDate.getDay() == 0 || newDate.getDay() == 6 ) continue;
            console.log( newDate.toString() );
            this.days.push( { date: newDate.getMonth() + '-' + newDate.getDate(), day: app.DAYS[ newDate.getDay() ] } );
            if ( this.days.length >= 5) break;
        }

    }
}