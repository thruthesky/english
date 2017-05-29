import { Component } from '@angular/core';
import { App } from './../../providers/app';
@Component({
    selector: 'intro-component',
    templateUrl: 'intro.html',
    styleUrls: ['./intro.scss']
})
export class IntroComponent {
    constructor( public app: App ) {}
}