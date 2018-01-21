import { Component } from '@angular/core';
import { App } from '../../providers/app';



@Component({
    selector: 'my-page-component',
    templateUrl: 'my-page.html',
    styleUrls: ['./my-page.scss']
})
export class MyPageComponent {

    option = 1; // by default 1st tab ( MY LMS INFO ) will be shown.
    constructor(
        public app: App
    ) {

        if ( app.classInfo && app.classInfo.no_of_past ) {
            if ( parseInt(app.classInfo.no_of_past, 10) < 4 ) {
                this.option = 1;
            }
        }




    }

}
