import {Component, OnInit} from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import {User, _USER_DATA_RESPONSE, _USER_RESPONSE} from 'angular-backend';
import {App} from './../../providers/app';
@Component({
  moduleId: module.id,
  selector: 'chat-component',
  templateUrl: 'chat.html',
  styleUrls: ['./chat.scss']
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
  userData: _USER_RESPONSE = null;

  constructor(public db: AngularFireDatabase,
              public app: App,
              private user: User) {

    this.uid = this.app.getClientId();
    console.log("Chat User id: ", this.uid);
    if (user.logged) this.loadUserData();

    this.user_message = db.list('/messages/users/' + this.uid, {
      query: {
        limitToLast: 10,
        orderByKey: true
      }
    });

    this.user_message.subscribe(res => {

      //console.log(res);
      if (this.firstList) {
        this.firstList = false;
      }
      else {
        this.onClickMaximize();
      }

    });

    this.all_message = db.list('/messages/all/');
    this.last_message = db.list('/messages/last/');
  }

  ngOnInit() {
  }

  onSubmitMessage() {
    console.log("onSubmitMessage()");
    let msg = {
      user: this.uid,
      message: this.form.message
    };

    if (this.userData && this.userData.name) {
      msg['name'] = this.userData.name;
    }

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
        count: count
      });

    });
    this.form.message = '';
  }

  loadUserData() {
    this.user.data().subscribe((res: _USER_DATA_RESPONSE) => {
      console.log('UserLogged:: ', res);
      this.userData = res.data.user;

    }, error => {
      this.user.alert(error);
    });
  }


  onClickMinimize() {
    this.min = true;
    this.max = false;
  }

  onClickMaximize() {
    this.min = false;
    this.max = true;
  }

}
