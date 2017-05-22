import { Component, OnInit } from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import { App } from './../../providers/app';
import { Observable } from 'rxjs/Observable';
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
    form = {
        message: ''
    };

    username = '';      // username to chat.
    secondCountDownForChatClose: number = 60;
    observableForChatClose;
    someoneTalking: boolean = false;
    constructor(
        public db: AngularFireDatabase,
        public app: App
    ) {

        this.uid = this.app.getClientId();
        console.log("Chat User id: ", this.uid);
        this.all_message = db.list('/messages/all/');
        this.all_message.$ref.on( 'value', snapshot => {
            let obj = snapshot.val();
            
            let key = Object.keys( obj ).pop();
            let user = obj[key]['user'];

            if ( this.username && this.username != user ) {

                console.log(`${this.username} : ${user}`);
                this.someoneTalking = true;
            }

        });


    }

    ngOnInit() { }
    onSubmitMessage() {
        console.log("onSubmitMessage()");
        
        this.user_message.push( { user: 'admin', message: this.form.message } );
        
        this.form.message = '';
        this.countDownForChatClose();
    }

    onClickUser( user ) {
        this.username = user; 
        this.user_message = this.db.list('/messages/users/' + user);
        this.user_message.$ref.on( 'value', snapshot => {
            console.log(snapshot);
            this.countDownForChatClose();
        });

        this.countDownForChatClose();
    }
    countDownForChatClose() {
        if ( this.observableForChatClose ) this.observableForChatClose.unsubscribe();
        this.observableForChatClose = Observable.interval( 1000 )
            .take(60)
            .subscribe( res => {
                // console.log("res: ", res);
                this.secondCountDownForChatClose = 60 - res;
                // this.app.renderPage();
            },
            e => {},
            () => {
                console.log("count complete");
                this.username = '';
            });
    }

    onClickChatClose() {
        this.observableForChatClose.unsubscribe();
        this.username = '';
        this.someoneTalking = false;
    }

}