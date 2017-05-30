import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Alert } from './alert/alert';
import { AlertContent } from './alert/alert-content';
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [ AlertContent ],
  entryComponents: [ AlertContent ],
  imports: [
    RouterModule,
    NgbModule.forRoot() // for ng-bootstrap registration
  ],
  exports: [ NgbModule ], // export alert for importing in other component.
  providers: [ Alert ] // provide alert for injecting in other component.
})
export class BootstrapModule {}
