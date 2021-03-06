import { Component } from '@angular/core';
import { App } from '../../providers/app';
@Component({
    selector: 'footer-component',
    templateUrl: 'footer.html'
})
export class FooterComponent {
    constructor( public app: App) {}
    onClickPanelMenu( name ) {
        this.app.scrollTo( name );
    }
}