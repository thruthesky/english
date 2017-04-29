import { Component } from '@angular/core';
import { App } from '../providers/app';

import { Backend } from 'angular-backend';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet (window:resize)="onResize($event)"></router-outlet>
    <template ngbModalContainer></template>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  constructor( private app: App,
               private backed:Backend ) {
    // backed.setBackendUrl("http://backend.dev/index.php");
    app.setWidth( window.innerWidth );
    document.addEventListener("deviceready", () => this.onDevinceReady(), false);
  
    Observable.fromEvent(window, 'scroll')
          .debounceTime(100)
          .subscribe((event) => {
            app.scrolled( event );
          });
  }
  ngOnInit() {
    setTimeout( () => this.app.scrolled( event ), 10);
  }
  onDevinceReady() {
    console.log("yes, I am running in cordova.");
  }
  
  onResize(event) {
    this.app.setWidth( window.innerWidth );
  }

}
