import { Component, OnInit } from '@angular/core';
import { FirebaseListObservable } from 'angularfire2/database';
import { User, _USER_DATA_RESPONSE, _USER_RESPONSE } from 'angular-backend';
import { App } from './../../providers/app';
import { FirebaseChat } from './../../providers/firebase';
import { Subject } from 'rxjs/Subject';

export interface _FIREBASE_CHAT {
  user: string;
  name: string;
  message: string;
  time?: number;
  count?: number;
  newVisitor?: boolean;
}

@Component({
  moduleId: module.id,
  selector: 'chat-component',
  templateUrl: 'chat.html'
})
export class ChatComponent implements OnInit {
  uid: string = null;
  user_message: FirebaseListObservable<any[]>;
  all_message: FirebaseListObservable<any[]>;
  last_message: FirebaseListObservable<any[]>;
  form = {
    message: ''
  };
  min: boolean = true;
  max: boolean = false;
  firstList = true;
  userId: string = null;
  scrollMessage: Subject<any> = new Subject();

  constructor(
    public app: App,
    private user: User,
    private fc: FirebaseChat
  ) {
    this.uid = this.app.getClientId();
    if (user.logged) this.userId = user.info.id;
    this.all_message = this.fc.getAllMessageList();
    this.last_message = this.fc.getLastMessage();
    this.user_message = this.fc.getUserMessage(this.uid, {
      limitToLast: 10,
      orderByKey: true
    });

    this.user_message.subscribe(res => {
      //console.log('user_message:: ', res.length);

      if (this.firstList) {
        //console.log('newVisitor');
        let d = (new Date);
        let now ='visit ' + d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() ;
        let msg: _FIREBASE_CHAT = {
          user: this.uid,
          name: this.userId,
          message: now,
          newVisitor: true
        };
        this.pushMessage( msg );
        this.firstList = false;
      }
      else {
        //console.log('second');
        if ( res && res.length && !res[ res.length - 1 ].newVisitor ) {
          this.onClickMaximize();
        }
      }
      this.scrollMessage.next();
    });

    this.scrollMessage
      .debounceTime(100)
      .subscribe(res => {
        this.scrollMessageBox();
    });

  }

  ngOnInit() {
  }

  onSubmitMessage() {
    if (this.form.message.length == 0) return;
    let msg: _FIREBASE_CHAT = {
      user: this.uid,
      name: this.userId,
      message: this.form.message
    };
    this.pushMessage( msg );
    this.form.message = '';
  }


  pushMessage( msg: _FIREBASE_CHAT ) {
      this.user_message.push(msg);
      this.all_message.push(msg);
      let $node = this.last_message.$ref['child'](this.uid);
      $node.once("value", snapshot => {
        let node = snapshot.val();
        let count = 1;
        if (node && node['count']) {
          count = node['count'] + 1;
        }

        msg.time = Math.floor(Date.now() / 1000);
        msg.count = count;
        $node.set( msg );
      });
  }
  onClickMinimize() {
    this.min = true;
    this.max = false;
  }
  onClickMaximize() {
    this.min = false;
    this.max = true;
    this.scrollMessage.next();
  }
  scrollMessageBox() {
    if ( this.min ) return;
    let $messages = $('.chat.max .messages');
    if ($messages && $messages.length && $messages[0].scrollHeight) { /// // add $messages.length by Mr. Song JaeHo.
      $messages.animate({ scrollTop: $messages[0].scrollHeight }, 300);
    }
  }
}
