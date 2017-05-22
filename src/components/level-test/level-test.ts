import { Component } from '@angular/core';
import { App } from './../../providers/app';
@Component({
    selector: 'level-test-component',
    templateUrl: 'level-test.html',
    styleUrls: ['./level-test.scss']
})
export class LevelTestComponent {
    constructor(
        public app: App
    ) {

    }
}