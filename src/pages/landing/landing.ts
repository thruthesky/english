import { Component } from '@angular/core';

import { App } from '../../providers/app';
import { User } from 'angular-backend';
import { LMS } from '../../providers/lms';
import {ShareService} from '../../providers/share-service';

import { ReviewService } from '../../providers/review-service';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {LevelTestFormComponent} from "../../components/modals/level-test-form/level-test-form";


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
    private modal: NgbModal,
  ) {

    // console.log("~~~~LANDING PAGE~~~~");
    // this.onClickOpenForm();
  }

  onClickOpenForm() {
    this.modal.open(LevelTestFormComponent, { windowClass: 'level-test-form', size: "lg" });
  }




}
