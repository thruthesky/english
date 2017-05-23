import {Component, OnInit} from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import {App} from './../../providers/app';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {debounceTime} from 'rxjs/operator/debounceTime';
import {} from 'jquery';
@Component({
  moduleId: module.id,
  selector: 'admin-panel-component',
  templateUrl: 'admin-panel.html',
  styleUrls: ['./admin-panel.scss']
})

export class AdminPanelComponent implements OnInit {
  uid: string = null;
  all_message: FirebaseListObservable<any[]>;
  user_message: FirebaseListObservable<any[]>;
  last_message: FirebaseListObservable<any[]>;
  form = {
    message: ''
  };

  username = '';      // username to chat.
  secondCountDownForChatClose: number = 100;
  observableForChatClose;
  scrollMessage: Subject<any> = new Subject();
  someoneTalking: boolean = false;

  config: boolean = false; // toogle admin config box.
  chatDisplay: string = 'line';

  user_last_list = [];

  constructor(public db: AngularFireDatabase,
              public app: App) {

    this.uid = this.app.getClientId();
    console.log("Chat User id: ", this.uid);
    this.all_message = db.list('/messages/all/');
    this.all_message.subscribe(res => {
      let node = res.pop();
      let user = node['user'];

      if (this.username && this.username != user) {

        //     console.log(`${this.username} : ${user}`);
        this.someoneTalking = true;
      }
      this.scrollMessage.next();
    });

    // this.all_message.$ref.on('value', snapshot => {
    //     let obj = snapshot.val();

    //     let key = Object.keys(obj).pop();
    //     let user = obj[key]['user'];

    //     if (this.username && this.username != user) {

    //         console.log(`${this.username} : ${user}`);
    //         this.someoneTalking = true;
    //     }
    //     this.scrollMessage.next();
    // });

    this.scrollMessage
      .debounceTime(100)
      .subscribe(res => {
        this.scrollMessageBox();
      });


    this.last_message = db.list('/messages/last/', {
      query: {
        limitToLast: 2,
        orderByChild: 'time'
      }
    });
    this.last_message.subscribe(res => {
      console.log(res);
      for (let user of res) {
        console.log("user: ", user.$key);
        db.list('/messages/users/' + user.$key, {
          query: {
            limitToLast: 1
          }
        }).subscribe(res => {
          if (res && res[0] && res[0].message) {
            console.log("User chat: ", res[0].message, " Talk count: ", user.count);
          }
        });
      }
    });

  }

  ngOnInit() {
    this.setChatNoOfLines();
    this.setChatDisplay();
  }

  onSubmitMessage() {
    console.log("onSubmitMessage()");

    this.user_message.push({user: 'admin', message: this.form.message});

    this.form.message = '';
    this.countDownForChatClose();
  }

  onClickUser(user) {
    this.username = user;
    this.user_message = this.db.list('/messages/users/' + user);
    this.user_message.$ref.on('value', snapshot => {
      // console.log(snapshot);
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
          // console.log("res: ", res);
          this.secondCountDownForChatClose = 100 - res;
          // this.app.renderPage();
        },
        e => {
        },
        () => {
          console.log("count complete");
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

  setChatNoOfLines(line?) {
    if (line) {
      localStorage.setItem('chatNoOfLines', line);
    }
    else line = this.getOptionChatNoOfLines;
    let $messages = $('.messages');
    $messages.css('height', line + 'em');
    this.scrollMessage.next();
  }

  setChatDisplay(display?) {
    //console.log('display::',display);
    if (display) {
      localStorage.setItem('chatDisplay', display);
    }
    else this.chatDisplay = this.getChatDisplay;
  }

  scrollMessageBox() {
    let $messages = $('.messages');
    if($messages && $messages[0].scrollHeight ){
      $messages.animate({scrollTop: $messages[0].scrollHeight}, 300);
    }
  }

  get getOptionChatNoOfLines() {
    let line;
    line = localStorage.getItem('chatNoOfLines');
    if (!line) line = 15;
    return line;
  }

  get minimized() {
    let min = localStorage.getItem('minimized') ? true : false;

    //console.log( 'min: ', min );
    return min;
  }

  set minimized(b) {
    localStorage.setItem('minimized', (b ? 'y' : ''));
  }


  get getChatDisplay() {
    return localStorage.getItem('chatDisplay');
  }


}
