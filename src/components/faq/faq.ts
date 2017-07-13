import { Component } from '@angular/core';
import {Meta} from "angular-backend";

export interface _FAQ {
  question: string;
  answer: string;
}

export type _FAQS = _FAQ[];

export interface _FAQ_CONFIG {
  title: string;
  view_mode: string;
  faqs: _FAQS;
}

@Component({
  selector: 'faq-component',
  templateUrl: 'faq.html',
  styleUrls: ['./faq.scss']
})
export class FAQComponent {

  faqs_config: _FAQ_CONFIG = <_FAQ_CONFIG> {
    title: 'Frequently Ask Question',
    view_mode: 'false',
    faqs: []
  };

  constructor( private meta: Meta) {
    this.getSiteConfig();
  }

  getSiteConfig() {
    console.log('meta.getSiteConfig');
    this.meta.config('name').subscribe( (res) => {
      //console.log('meta.config::name', res);
      if ( res && res.data && res.data.config ) {
        try {
          this.faqs_config = JSON.parse(res.data.config);
          this.faqs_config.faqs.map( v => {
            v['more'] = this.faqs_config.view_mode;
          });
          console.log('this.faqs_config::', this.faqs_config);
        } catch (e) {
        }
      }
    }, error => this.meta.errorResponse(error));

  }

}
