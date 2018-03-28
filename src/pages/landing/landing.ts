import { Component } from '@angular/core';

import { App } from '../../providers/app';
import { User } from 'angular-backend';
import { LMS } from '../../providers/lms';
import {ShareService} from '../../providers/share-service';

import { ReviewService } from '../../providers/review-service';


@Component( {
  selector: 'landing-page',
  templateUrl: 'landing.html',
  styleUrls: ['./landing.scss'],
})
export class LandingPage {

  constructor(
    public app: App,
    public user: User,
    private lms: LMS,
    public shared: ShareService,
    review: ReviewService,
  ) {

    console.log("~~~~LANDING PAGE~~~~");
  }


}
