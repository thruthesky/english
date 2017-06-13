import { Component, AfterViewInit } from '@angular/core';
import { App } from './../../providers/app';
import { User } from 'angular-backend';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FirebaseChat } from './../../providers/firebase';
@Component({
  selector: 'payment-component',
  templateUrl: 'payment.html',
  styleUrls: ['./payment.scss']
})
export class PaymentComponent implements AfterViewInit {


  amounts = {
    "25": 120000,
    "50": 216000 
  };
  customAmount = '';
  minutes = "";
  days = "5";
  daysRate = {
    "5" : 100,
    "4" : 90,
    "3" : 80
  };
  months = "1";


  iframeUrl: SafeResourceUrl;

  constructor(public app: App, public user: User, private domSanitizer: DomSanitizer, private firebaseDatabase: FirebaseChat) {


    
    

    window.addEventListener('message', (e) => {
      let msg = <string>e.data;
      if ( ! /^payment\-/.test(msg) ) return;
      firebaseDatabase.push("payment", {
        status: msg,
        id: user.info.id
      })
    }, false);

  }
  ngAfterViewInit() {
    
  }
  money_format( amount ) : string {
    if ( ! amount ) return "0";
    let n = parseInt( amount );
    if ( ! n ) return "0";

    return n.toString().split('').reverse().reduce( (t, v, i, a ) => {
      return t = t + v.toString() + ( i < a.length -1 && (i+1) % 3 == 0 ? ',' : '' );
    }, '' ).split('').reverse().join('');
    
    
  }
  

  getAmount() {
    let amount: string = "";
    if ( this.minutes == "0" ) {
      amount = this.money_format( this.customAmount );
    }
    else amount = this.money_format( this.amounts[this.minutes] * this.daysRate[this.days] / 100 *  ( parseInt( this.months ) ) );
    return amount;
  }

  getAmountByMonths(days) {
     return this.money_format( this.amounts[this.minutes] * this.daysRate[ days ] / 100 *  ( parseInt( this.months ) ) );
  }
  onClickPayment() {

    if (!this.user.logged) {
      alert("로그인을 해 주세요.");
      return;
    }



    let amount = this.getAmount().replace(/,/g, '');
    this.user.data(this.user.info.id).subscribe((res) => {

      let user = res.data.user;
      if (!user.name) return alert("결재하기 전, 회원 정보 메뉴에서 이름을 먼저 입력해 주십시오.");
      if (!user.email) return alert("결재하기 전, 회원 정보 메뉴에서 이메일 주소를 먼저 입력해 주십시오.");
      if (!user.mobile) return alert("결재하기 전, 회원 정보 메뉴에서 전화번호를 먼저 입력해 주십시오.");

      let url = `https://www.englishfordevelopers.com/model/custom-agspay/AGS_pay.php?id=${user.id}&name=${user.name}&email=${user.email}&mobile=${user.mobile}&amount=${amount}`;

      this.app.scrollTo('paymentIframe');
      setTimeout(() => {
        this.iframeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(url);
      }, 300);
      

    }, e => this.user.alert(e));


  }
}