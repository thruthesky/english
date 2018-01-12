import { Component } from '@angular/core';
import { App } from './../../providers/app';
@Component({
    selector: 'intro-component',
    templateUrl: 'intro.html',
    styleUrls: ['./intro.scss']
})
export class IntroComponent {

    // alertFewClassesLeft = false;
    constructor(public app: App) {
        // if (app.classInfo) {
        //     if (app.classInfo.no_of_past && parseInt(app.classInfo.no_of_past, 10) > 7) { // students who has more than 7 past classes.

        //         console.log( parseInt(app.classInfo.no_of_reservation, 10) );
        //         if ( parseInt(app.classInfo.no_of_reservation, 10) <= 3 ) { // and students who has less than 3 reservations

        // console.log('intro: app.classInfo: ', app.classInfo);
        //             this.alertFewClassesLeft = true;
        //         }

        //     }



    }


    get fewClassLeft(): boolean {
        return this.app.share.class_info && this.app.share.class_info['no_of_past'] &&
            parseInt(this.app.share.class_info['no_of_past'], 10) >= 7 && parseInt(this.app.share.class_info['no_of_reservation'], 10) <= 3;
    }

}
