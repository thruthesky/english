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
  minutes = "25";
  days = "5";
  daysRate = {
    "5" : 100,
    "4" : 90,
    "3" : 80
  };
  months = "1";


  iframeUrl: SafeResourceUrl;

  constructor(public app: App, public user: User, private domSanitizer: DomSanitizer, private firebaseDatabase: FirebaseChat) {


    // console.log( this.money_format( 2590000).replace(/,/g, "") );
    // console.log( this.money_format( 123000000).replace(/,/g, "") );
    


    window.addEventListener('message', (e) => {
      console.log(e.data);
      let msg = <string>e.data;
      if ( ! /^payment\-/.test(msg) ) return;
      firebaseDatabase.push("payment", {
        status: msg,
        id: user.info.id
      })
    }, false);

  }
  money_format( amount ) : string {
    if ( ! amount ) return "0";
    let n = parseInt( amount );
    if ( ! n ) return "0";

    return n.toString().split('').reverse().reduce( (t, v, i, a ) => {
      return t = t + v.toString() + ( i < a.length -1 && (i+1) % 3 == 0 ? ',' : '' );
    }, '' ).split('').reverse().join('');
    
    
  }
  
  ngAfterViewInit() {
    // let pay = <HTMLElement> document.querySelector(".menu.payment");
    // let click = () => pay.click();
    // setTimeout( click, 1000 );


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
    console.log("payment begin");

    if (!this.user.logged) {
      alert("로그인을 해 주세요.");
      return;
    }



    let amount = this.getAmount().replace(/,/g, '');
    this.user.data(this.user.info.id).subscribe((res) => {
      console.log(res);

      let user = res.data.user;
      if (!user.name) return alert("결재하기 전, 회원 정보 메뉴에서 이름을 먼저 입력해 주십시오.");
      if (!user.email) return alert("결재하기 전, 회원 정보 메뉴에서 이메일 주소를 먼저 입력해 주십시오.");
      if (!user.mobile) return alert("결재하기 전, 회원 정보 메뉴에서 전화번호를 먼저 입력해 주십시오.");

      let url = `https://www.englishfordevelopers.com/model/custom-agspay/AGS_pay.php?id=${user.id}&name=${user.name}&email=${user.email}&mobile=${user.mobile}&amount=${amount}`;

      this.app.scrollTo('paymentIframe');
      //alert("200 만 넘어가니 에러 있음");
      setTimeout(() => {
        this.iframeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(url);
      }, 300);
      

      console.log("iframeUrl: ", this.iframeUrl);


      // let w = window.innerWidth;
      // let h = window.innerHeight;
      // w = Math.round(w * 50 / 100);
      // if (w < 600) w = 600;
      // h = Math.round(h * 80 / 100);
      // this.PopupCenter(`https://www.englishfordevelopers.com/model/custom-agspay/AGS_pay.php?id=${user.id}&name=${user.name}&email=${user.email}&mobile=${user.mobile}&amount=${amount}`, '_blank', w, h);

    }, e => this.user.alert(e));


  }
  // PopupCenter(url, title, w, h) {
  //   // Fixes dual-screen position                         Most browsers      Firefox
  //   var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen['left'];
  //   var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen['top'];

  //   var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
  //   var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

  //   var left = ((width / 2) - (w / 2)) + dualScreenLeft;
  //   var top = ((height / 2) - (h / 2)) + dualScreenTop;
  //   var newWindow = window.open(url, title, 'toolbar=yes,scrollbars=yes,resizable=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

  //   // Puts focus on the newWindow
  //   if (typeof newWindow.focus != 'undefined') {
  //     newWindow.focus();
  //   }
  // }

}