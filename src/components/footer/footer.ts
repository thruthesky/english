import { Component } from '@angular/core';
import { App } from '../../providers/app';
import * as config from './../../app/config';
@Component({
    selector: 'footer-component',
    templateUrl: 'footer.html',
    styleUrls: ['footer.scss']
})
export class FooterComponent {
    config = config;
    constructor( public app: App) {}
    onClickPanelMenu( name ) {
        this.app.scrollTo( name );
    }
}