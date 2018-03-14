import {Component, OnInit} from '@angular/core';
import {AngularFireList} from 'angularfire2/database';
import {App} from './../../providers/app';
import {FirebaseChat, _FIREBASE_CHAT} from './../../providers/firebase';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {} from 'jquery';
import {ShareService} from '../../providers/share-service';

@Component({
  moduleId: module.id,
  selector: 'admin-panel-component',
  templateUrl: 'admin-panel.html',
  styleUrls: ['./admin-panel.scss']
})

export class AdminPanelComponent implements OnInit {
  uid: string = null;
  all_message: AngularFireList<any[]>;
  user_message: AngularFireList<any[]>;
  last_message: AngularFireList<any[]>;


  all_message_new;
  last_message_new;
  user_message_new;


  form = {
    message: ''
  };

  username = '';      // username to chat.
  userSenderId = '';
  userLoginName: string;
  secondCountDownForChatClose: number = 100;
  observableForChatClose;
  scrollMessage: Subject<any> = new Subject();
  someoneTalking: boolean = false;

  config: boolean = false; // toogle admin config box.
  chatDisplay: string = 'user';

  initial = true;

  constructor(public app: App,
              private fc: FirebaseChat,
              private shared: ShareService
  ) {
    this.uid = this.app.getClientId();
    if (app.user.logged) {
      this.shared.clientChatId  = app.user.info.id;
      this.userLoginName = app.user.info.name;
    }
    this.all_message = this.fc.getAllMessageList();

    this.all_message_new = this.all_message.valueChanges(); // all_message_new


    // this.all_message.snapshotChanges();

    this.all_message.valueChanges().subscribe(res => {
      // console.log('all_message', res)
      if( res && res.length ) {
        // let node = res[ res.length - 1 ];
        let node = res.pop();

        // console.log('node: ', node);
        if (node && node['user']) {
          let user = node['user'];
          if( this.minimized && !this.initial ) {
            this.minimized = false ;
            this.initial = true;

          }
          else this.initial = false;

          if (this.username && user && this.username != user) {
            //console.log('this.username:: ', this.username);
            //console.log('user:: ', user);
            this.someoneTalking = true;
          }
          this.scrollMessage.next();
        }
      }

    });

    this.scrollMessage
      .debounceTime(100)
      .subscribe(res => {
        this.scrollMessageBox();
      });


    this.last_message = this.fc.getLastMessage(); //.valueChanges();

    this.last_message_new = this.last_message.valueChanges();
    // this.last_message.snapshotChanges().subscribe(res => {
    // });

  }

  ngOnInit() {
    this.setChatNoOfLines();
    this.setChatNoOfWidth();
    this.setChatDisplay();
  }

  onSubmitMessage() {

    if (this.form.message.length == 0) return;

    let msg: _FIREBASE_CHAT = {
      user: this.uid,
      name: this.shared.clientChatId,
      message: this.form.message
    };

    this.user_message.push(<any>msg);

    // let $node = this.last_message.$ref['child'](this.username);
    const $node = this.fc.lastMessage( this.username );
    $node.once("value", snapshot => {
      const node = snapshot.val();
      let count = 1;

      if (node && node['count']) {
        count = node['count'] + 1;
      }

      $node.set({
        time: Math.floor(Date.now() / 1000),
        count: count,
        user: this.username,
        name: this.userSenderId,
        message: `[${this.shared.clientChatId}]` + msg.message
      });

    });




    this.form.message = '';
    this.countDownForChatClose();
  }

  onClickUser(lastMessage) {
    this.username = lastMessage.user;
    this.userSenderId = lastMessage.name ? lastMessage.name : '';
    this.user_message = this.fc.getUserMessage(this.username, 10);
    

    this.user_message_new = this.user_message.valueChanges();
    /// edited 2018-03-10
    this.user_message.valueChanges().subscribe(snapshot => {
      this.countDownForChatClose();
      this.scrollMessage.next();
    });

    this.countDownForChatClose();
  }

  countDownForChatClose() {
    if (this.observableForChatClose) this.observableForChatClose.unsubscribe();
    this.observableForChatClose = Observable.interval(1000)
      .take(100)
      .subscribe(res => {
          this.secondCountDownForChatClose = 100 - res;
        },
        e => {
        },
        () => {
          this.username = '';
        });
  }

  onClickChatClose() {
    this.observableForChatClose.unsubscribe();
    this.username = '';
    this.someoneTalking = false;
    this.scrollMessage.next();
  }

  onChangeNoOfLines(event) {
    this.setChatNoOfLines(event.target.value);
  }

  onChangeNoOfWidth(event) {
    this.setChatNoOfWidth(event.target.value);
  }



  setChatNoOfLines(line?) {
    if (line) {
      localStorage.setItem('chatNoOfLines', line);
    }
    else line = this.getOptionChatNoOfLines;
    let $messages = $('.messages');
    $messages.css('height', line + 'em');
    this.scrollMessage.next();
  }

  setChatNoOfWidth(line?) {
    if (line) {
      localStorage.setItem('chatNoOfWidth', line);
    }
    else line = this.getOptionChatNoOfWidth;
    let $messages = $('.messages');
    //console.log('width::line:: ', 'width', line + 'em');
    $messages.css('width', line + 'em');
    this.scrollMessage.next();
  }


  setChatDisplay(display?) {
    if (display) {
      localStorage.setItem('chatDisplay', display);
    }
    else {
      let display = this.getChatDisplay;
      if( display ) this.chatDisplay = display;
    }
    this.scrollMessage.next();
  }

  scrollMessageBox() {
    let $messages = $('.display .messages');
    if ($messages && $messages.length && $messages[0].scrollHeight) { // add $messages.length by Mr. Song JaeHo.
      $messages.animate({scrollTop: $messages[0].scrollHeight}, 300);
    }
  }

  get getOptionChatNoOfLines() {
    let line;
    line = localStorage.getItem('chatNoOfLines');
    if (!line) line = 15;
    return line;
  }
  get getOptionChatNoOfWidth() {
    let line;
    line = localStorage.getItem('chatNoOfWidth');
    if (!line) line = 20;
    return line;
  }

  get minimized() {
    let min = localStorage.getItem('minimized') ? true : false;

    return min;
  }

  set minimized(b) {
    localStorage.setItem('minimized', (b ? 'y' : ''));
  }


  get getChatDisplay() {
    return localStorage.getItem('chatDisplay');
  }

  getUserName( lm ) {

    if ( lm['name'] ) {
      let arName = lm['name'].split('@');
      return arName[0];
    }
    else {
      return lm['user'];
    }
  }


  getUserIcon( name ){
    let arName = name.split('@');
    if( arName[1] ){
      if( arName[1] == 'kakaotalk.com'){
        return 'K';
      }
      else if( arName[1] == 'facebook.com'){
        return 'F';
      }
      else if( arName[1] == 'naver.com'){
        return 'N';
      }
    }
  }

  onClickClass(userId) {
    localStorage.setItem('chat-uid', userId);
    window.open('/admin/index.html?userId=' + userId, '_blank');
  }

}
