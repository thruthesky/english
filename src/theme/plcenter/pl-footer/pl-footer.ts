import { Component } from '@angular/core';
import { App } from '../../../providers/app';
@Component({
    selector: 'pl-footer-component',
    templateUrl: 'pl-footer.html',
    styleUrls: ['./pl-footer.scss']
})
export class PlFooterComponent {
    constructor( private app: App) {}
    onClickPanelMenu( name ) {
        this.app.scrollTo( name );
    }
}