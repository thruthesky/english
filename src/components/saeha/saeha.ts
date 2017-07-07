import { Component } from '@angular/core';


@Component({
  selector: 'saeha-component',
  templateUrl: 'saeha.html',
  styleUrls: ['./saeha.scss']
})
export class SaehaComponent {

  option: boolean = true;
  constructor( ) {}


  onClickOpenSaeha() {
    window.open("http://video-english.svc.saeha.com/sso/avset.do","_blank");
  }

}
