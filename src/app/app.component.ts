import { Component } from '@angular/core';
import { environment } from './../environments/environment';

import { App } from '../providers/app';

import { Backend } from 'angular-backend';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet (window:resize)="onResize($event)"></router-outlet>
    <ng-template ngbModalContainer></ng-template>`,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor (
    private app: App,
    private backend: Backend
  ) {

    if ( environment.backendUrl ) backend.setBackendUrl( environment.backendUrl  );
    else backend.setBackendUrl("https://" + window.location.hostname  + "/index.php");

    app.getSiteConfig();

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
