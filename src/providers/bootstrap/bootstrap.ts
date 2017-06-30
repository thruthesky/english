import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Alert } from './alert/alert';
import { AlertContent } from './alert/alert-content';
import { RouterModule } from '@angular/router';
import { Confirm } from './confirm/confirm';
import { ConfirmContent } from './confirm/confirm-content';
import { AnnouncementContent } from './announcement/announcement-content';
import { Announcement } from './announcement/announcement';
import { ReminderContent } from './reminder/reminder-content';
import { Reminder } from './reminder/reminder';

@NgModule({
  declarations: [ AlertContent, ConfirmContent, AnnouncementContent, ReminderContent ],
  entryComponents: [ AlertContent, ConfirmContent, AnnouncementContent, ReminderContent ],
  imports: [
    RouterModule,
    NgbModule.forRoot() // for ng-bootstrap registration
  ],
  exports: [ NgbModule ], // export alert for importing in other component.
  providers: [ Alert, Confirm, Announcement, Reminder ] // provide alert for injecting in other component.
})
export class BootstrapModule {}
