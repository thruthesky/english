import { Component } from '@angular/core';
import { App } from '../providers/app';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet (window:resize)="onResize($event)"></router-outlet>
  `
})
export class AppComponent {
  title = 'app works!';
}
