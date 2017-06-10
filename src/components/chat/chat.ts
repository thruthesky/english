import { Component, OnInit } from '@angular/core';
import { FirebaseListObservable } from 'angularfire2/database';
import { User, _USER_DATA_RESPONSE, _USER_RESPONSE } from 'angular-backend';
import { App } from './../../providers/app';
import { FirebaseChat } from './../../providers/firebase';
import { Subject } from 'rxjs/Subject';

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



    this.scrollMessage
      .debounceTime(500)
      .subscribe(res => {
        this.scrollMessageBox();
      });


    this.user_message = this.fc.getUserMessage(this.uid, {
      limitToLast: 10,
      orderByKey: true
    });

    this.user_message.subscribe(res => {

      if (this.firstList) {
        this.firstList = false;
      }
      else {
        this.onClickMaximize();
      }




      this.scrollMessage.next();



    });


    this.all_message = this.fc.getAllMessageList();
    this.last_message = this.fc.getLastMessage();
  }

  ngOnInit() {
  }

  onSubmitMessage() {

    if (this.form.message.length == 0) return;

    let msg = {
      user: this.uid,
      name: this.userId,
      message: this.form.message
    };


    this.user_message.push(msg);
    this.all_message.push(msg);

    let $node = this.last_message.$ref['child'](this.uid);
    $node.once("value", snapshot => {
      let node = snapshot.val();
      let count = 1;

      if (node && node['count']) {
        count = node['count'] + 1;
      }

      $node.set({
        time: Math.floor(Date.now() / 1000),
        count: count,
        user: msg.user,
        name: msg.name,
        message: msg.message
      });

    });
    this.form.message = '';
  }



  onClickMinimize() {
    this.min = true;
    this.max = false;
  }

  onClickMaximize() {
    this.min = false;
    this.max = true;
  }

  scrollMessageBox() {

    let $messages = $('.chat.max .messages ul');
    if ($messages && $messages[0].scrollHeight) {
      $messages.animate({ scrollTop: $messages[0].scrollHeight }, 300);
    }
  }


}
