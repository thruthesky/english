import { Component } from '@angular/core';
import { Message } from '../../providers/message';
import { AngularFireList } from 'angularfire2/database';
import { User } from 'angular-backend';
import { App } from './../../providers/app';
import { FirebaseChat, _FIREBASE_CHAT } from './../../providers/firebase';
import { Subject } from 'rxjs/Subject';
import { ShareService } from '../../providers/share-service';



@Component({
  moduleId: module.id,
  selector: 'chat-component',
  templateUrl: 'chat.html'
})
export class ChatComponent {
  uid: string = null;
  user_message: AngularFireList<any[]>;
  all_message: AngularFireList<any[]>;
  last_message: AngularFireList<any[]>;
  form = {
    message: ''
  };
  min: boolean = true;
  max: boolean = false;
  chatHide = false;
  firstList = true;
  scrollMessage: Subject<any> = new Subject();


  display_user_messages;
  constructor(
    public app: App,
    private user: User,
    private fc: FirebaseChat,
    private message: Message,
    private shared: ShareService
  ) {
    this.uid = this.app.getClientId();
    if (user.logged) {
      this.shared.clientChatId = user.info.id;
    }
    // console.log('classInfo::', this.app.classInfo);
    // console.log('userID::', this.userId);
    // console.log('noOfClasses::', this.app.noOfClasses);

    this.all_message = this.fc.getAllMessageList();
    this.last_message = this.fc.getLastMessage();
    this.user_message = this.fc.getUserMessage(this.uid);

    this.display_user_messages = this.user_message.valueChanges();



    this.user_message.valueChanges().subscribe(res => {

      if (this.firstList) {
        //console.log('newVisitor');
        let d = (new Date);
        let now = 'visit ' + d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
        let msg: _FIREBASE_CHAT = {
          user: this.uid,
          name: this.shared.clientChatId,
          message: now,
          newVisitor: true
        };
        this.pushMessage(msg);
        this.firstList = false;
      }
      else {
        //console.log('second');
        if (res && res.length && !res[res.length - 1]['newVisitor']) {
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


  onSubmitMessage() {
    if (this.form.message.length == 0) return;
    let msg: _FIREBASE_CHAT = {
      user: this.uid,
      name: this.shared.clientChatId,
      message: this.form.message,
      noOfClasses: this.app.noOfClasses
    };
    this.pushMessage(msg);
    this.sendPushMessage(msg);
    this.form.message = '';
  }


  sendPushMessage(msg: _FIREBASE_CHAT) {
    this.message.send("LiveChat", msg.message, "/");
  }

  pushMessage(msg: _FIREBASE_CHAT) {
    this.user_message.push(<any>msg);
    this.all_message.push(<any>msg);
    
    /**
     * Update the last message of the user.
     * The input chat `msg` will be saved under `messages/last/uid` with count property everytime when user chats.
     */
    const $node = this.fc.lastMessage( this.uid );
    // let $node = this.last_message.$ref['child'](this.uid);
    $node.once("value", snapshot => {
      const node = snapshot.val();
      let count = 1;
      if (node && node['count']) {
        count = node['count'] + 1;
      }

      msg.time = Math.floor(Date.now() / 1000);
      msg.count = count;
      $node.set(msg);
    });


  }
  onClickMinimize() {
    this.min = true;
    this.max = false;
  }
  onClickMaximize() {
    this.min = false;
    this.max = true;
    this.chatHide = false;
    this.scrollMessage.next();
  }
  scrollMessageBox() {
    if (this.min) return;
    let $messages = $('.chat.max .messages');
    if ($messages && $messages.length && $messages[0].scrollHeight) { /// // add $messages.length by Mr. Song JaeHo.
      $messages.animate({ scrollTop: $messages[0].scrollHeight }, 300);
    }
  }


  onClickHide() {
    this.chatHide = true;
  }
}
