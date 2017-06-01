import { Component, AfterViewInit } from '@angular/core';
@Component({
    selector: 'payment-component',
    templateUrl: 'payment.html',
    styleUrls: ['./payment.scss']
})
export class PaymentComponent implements AfterViewInit {
    
  ngAfterViewInit() {
    let pay = <HTMLElement> document.querySelector(".menu.payment");
    let click = () => pay.click();
    setTimeout( click, 1000 );
  }

  onClickPay() {
    console.log("payment begin");
  }
}