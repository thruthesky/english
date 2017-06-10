import { Component } from '@angular/core';
import { App } from '../providers/app';

import { Backend } from 'angular-backend';
import { Observable } from 'rxjs/Observable';




@Component({
  selector: 'app-root',
  template: `
    <router-outlet (window:resize)="onResize($event)"></router-outlet>
    <ng-template ngbModalContainer></ng-template>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor (
    private app: App,
    private backed: Backend
  ) {
    backed.setBackendUrl("https://www.englishfordevelopers.com/index.php");
    app.setWidth(window.innerWidth);
    document.addEventListener("deviceready", () => this.onDevinceReady(), false);

    Observable.fromEvent(window, 'scroll')
      .debounceTime(100)
      .subscribe((event) => {
        app.scrolled(event);
      });

      app.checkLoginWithNaver();

  }



  ngOnInit() {

    setTimeout(() => this.app.scrolled(event), 10);

  }

  onDevinceReady() {
  }

  onResize(event) {
    this.app.setWidth(window.innerWidth);
  }

}
