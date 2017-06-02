import { Component, AfterViewInit } from '@angular/core';
@Component({
    selector: 'payment-component',
    templateUrl: 'payment.html',
    styleUrls: ['./payment.scss']
})
export class PaymentComponent implements AfterViewInit {
    
    
    constructor() {

    }
  ngAfterViewInit() {
    // let pay = <HTMLElement> document.querySelector(".menu.payment");
    // let click = () => pay.click();
    // setTimeout( click, 1000 );


  }

  onClickPayment() {
    console.log("payment begin");
    let w = window.innerWidth;
    let h = window.innerHeight;
    console.log("w: " , w );
    w = Math.round( w / 2 );
    if ( w < 600 ) w = 600;
    console.log("w: ", w );
    h = Math.round( h / 5 * 4 );
    this.PopupCenter('https://www.englishfordevelopers.com/model/custom-agspay/AGS_pay.php', '_blank', w, h);
  }
  PopupCenter(url, title, w, h) {
    // Fixes dual-screen position                         Most browsers      Firefox
    var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen['left'];
    var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen['top'];

    var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    var left = ((width / 2) - (w / 2)) + dualScreenLeft;
    var top = ((height / 2) - (h / 2)) + dualScreenTop;
    var newWindow = window.open(url, title, 'toolbar=yes,scrollbars=yes,resizable=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

    // Puts focus on the newWindow
    if ( typeof newWindow.focus != 'undefined' ) {
        newWindow.focus();
    }
}

}