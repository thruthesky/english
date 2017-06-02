import { Component, AfterViewInit } from '@angular/core';
import { User } from 'angular-backend';
import { DomSanitizer,SafeResourceUrl } from '@angular/platform-browser';
import { FirebaseChat } from './../../providers/firebase';
@Component({
  selector: 'payment-component',
  templateUrl: 'payment.html',
  styleUrls: ['./payment.scss']
})
export class PaymentComponent implements AfterViewInit {


  iframeUrl:SafeResourceUrl;

  constructor(public user: User, private domSanitizer: DomSanitizer, private firebaseDatabase: FirebaseChat ) {
    
    firebaseDatabase.push("payment", { 'message': 'begin' });
window.addEventListener('message', (e) => {
			console.log(e.data);
      
      firebaseDatabase.push("payment", {
        id: user.info.id
      })
		}, false);

  }
  ngAfterViewInit() {
    // let pay = <HTMLElement> document.querySelector(".menu.payment");
    // let click = () => pay.click();
    // setTimeout( click, 1000 );


  }

  onClickPayment() {
    console.log("payment begin");

    if (!this.user.logged) {
      alert("로그인을 해 주세요.");
      return;
    }

    let amount = 4000;
    this.user.data(this.user.info.id).subscribe((res) => {
      console.log(res);

      let user = res.data.user;
      if (!user.name) return alert("결재하기 전, 회원 정보 메뉴에서 이름을 먼저 입력해 주십시오.");
      if (!user.email) return alert("결재하기 전, 회원 정보 메뉴에서 이메일 주소를 먼저 입력해 주십시오.");
      if (!user.mobile) return alert("결재하기 전, 회원 정보 메뉴에서 전화번호를 먼저 입력해 주십시오.");

      let url = `https://www.englishfordevelopers.com/model/custom-agspay/AGS_pay.php?id=${user.id}&name=${user.name}&email=${user.email}&mobile=${user.mobile}&amount=${amount}`;

      this.iframeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl( url );

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