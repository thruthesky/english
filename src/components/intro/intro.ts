import { Component } from '@angular/core';
import { App } from './../../providers/app';
@Component({
    selector: 'intro-component',
    templateUrl: 'intro.html',
    styleUrls: ['./intro.scss']
})
export class IntroComponent {

    alertFewClassesLeft = false;
    constructor(public app: App) {
        if (app.classInfo) {


            if (app.classInfo.no_of_past && parseInt(app.classInfo.no_of_past, 10) > 7) { // students who has more than 7 past classes.
                if (app.classInfo.no_of_reservation && parseInt(app.classInfo.no_of_reservation, 10) < 3) { // and students who has less than 3 reservations
                    this.alertFewClassesLeft = true;
                }

            }


        }
    }

}