import { Component, AfterViewInit } from '@angular/core';
import { App } from './../../providers/app';
import { Message } from './../../providers/message';
import { User } from 'angular-backend';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FirebaseChat } from './../../providers/firebase';
@Component({
  selector: 'payment-component',
  templateUrl: 'payment.html',
  styleUrls: ['./payment.scss']
})
export class PaymentComponent implements AfterViewInit {


  customAmount = '';
  selectedMinutes: string = '';
  selectedDays: string = '';
  selectedMonths: string = '';

  discounts = [];

  // defaultMinutes = "25";
  // defaultDays = "5";
  // daysRate = {
  //   "5" : 100,
  //   "4" : 90,
  //   "3" : 80
  // };
  // months = "1";


  iframeUrl: SafeResourceUrl;

  constructor(
    public app: App,
    public user: User,
    private domSanitizer: DomSanitizer,
    private firebaseDatabase: FirebaseChat,
    private message: Message
  ) {


    if (app.paymentOption) {

      this.selectedMinutes = this.app.paymentOption.defaultMinutes + '';
      this.selectedDays = this.app.paymentOption.defaultDays + '';
      this.selectedMonths = this.app.paymentOption.defaultMonths + '';

      this.discounts = this.app.paymentOption.discounts;

    }

    window.addEventListener('message', (e) => {
      let msg = <string>e.data;
      if (! /^payment\-/.test(msg)) return;
      firebaseDatabase.push("payment", {
        status: msg,
        id: user.info.id
      })
    }, false);

  }
  ngAfterViewInit() {


    //console.log(this.selectedDays);
    //console.log( this.app.paymentOption );

  }

  money_format(amount): string {
    if (!amount) return "0";
    let n = parseInt(amount);
    if (!n) return "0";

    return n.toString().split('').reverse().reduce((t, v, i, a) => {
      return t = t + v.toString() + (i < a.length - 1 && (i + 1) % 3 == 0 ? ',' : '');
    }, '').split('').reverse().join('');



  }


  getAmount() {

    if (this.selectedMinutes == '0') return this.customAmount;

    //console.log( this.selectedDays );
    let minutes = this.app.paymentOption.minutes_months_days[this.selectedMinutes];
    if (!minutes) return 0; // alert( this.selectedMinutes + " Minutes not set in payment option");
    let months = minutes[this.selectedMonths];
    if (!months) return 0; // alert( this.selectedMonths + " Months not set in payment option");
    let days = months[this.selectedDays];
    if (!days) return 0; // alert( this.selectedDays + " days not set in payment options");

    const dc = this.monthDiscount + this.discountSelected;
    const total = Math.round(days * ( (100 - dc ) / 100));

    return total;


  }

  getAmountByMonths(days) {
    if (this.selectedMinutes == '0') return 0;
    if (this.getAmount() == 0) return 0;
    let months = this.app.paymentOption.minutes_months_days[this.selectedMinutes];
    return this.money_format(months[this.selectedMonths][days]);
  }
  onClickPayment() {

    if (!this.user.logged) {
      alert("로그인을 해 주세요.");
      return;
    }

    // console.log("onClickPayment", this.selectedMinutes , this.selectedDays ,  this.discounts);


    if ( this.selectedMinutes == "25" && this.selectedDays == "2" && this.discounts[0]['checked'] == true ) {
      this.app.alert("주2회는 첫결제 대상에 해당하지 않습니다");
      return;
    }


    //let amount = this.getAmount().replace(/,/g, '');
    let amount = this.getAmount();
    if (amount == 0) return alert('수업료를 선택해 주세요.');


    this.user.data(<any>this.user.info.id).subscribe((res) => {

      let user = res.data.user;
      if (!user.name) return alert("결재하기 전, 회원 정보 메뉴에서 이름을 먼저 입력해 주십시오.");
      if (!user.email) return alert("결재하기 전, 회원 정보 메뉴에서 이메일 주소를 먼저 입력해 주십시오.");
      if (!user.mobile) return alert("결재하기 전, 회원 정보 메뉴에서 전화번호를 먼저 입력해 주십시오.");

      /// @todo needs to be test !!
      this.message.send("수업료 결재", `${user.name} 님께서 결재를 시도합니다.`);


      // old url.
      // let url = `https://` + window.location.hostname + `/model/custom-agspay`
      //  + `/AGS_pay.php?id=${user.id}&name=${user.name}&email=${user.email}&mobile=${user.mobile}&amount=${amount}`;

      const url = `https://` + window.location.hostname + '/model/agspay-new'
        + `/AGS_pay.php?id=${user.id}&name=${user.name}&email=${user.email}&mobile=${user.mobile}&amount=${amount}`;
      // this.app.scrollTo('paymentIframe');
      // setTimeout(() => {
      //   this.iframeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(url);
      // }, 300);

      setTimeout( () => {
        location.href = url;
      }, 400);


    }, e => this.user.alert(e));

  }



  get discountSelected() { // right now: ['1','3']
    const dc =  this.discounts
      .filter(opt => opt.checked)
      .map(opt => opt.discount);


    // console.log("discountSelected", dc);
    if ( dc.length ) return dc.reduce( (a, v ) => a + v);

    return 0;

  }


  get monthDiscount() {
    return this.app.paymentOption.months_discount[this.selectedMonths];
  }
}
