import { Component, OnInit } from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import { App } from './../../providers/app';
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
    form = {
        message: ''
    };
    min: boolean = true;
    max: boolean = false;

    firstList = true;
    constructor(
        public db: AngularFireDatabase,
        public app: App
    ) {

        this.uid = this.app.getClientId();
        console.log("Chat User id: ", this.uid);

        this.user_message = db.list('/messages/users/' + this.uid, {
            query: {
                limitToLast: 10,
                orderByKey: true
            }
        });

        this.user_message.subscribe( res => {

            console.log(res);
            if ( this.firstList ) {
                this.firstList = false;
            }
            else {
                this.onClickMaximize();
            }
                
            

        });


        this.all_message = db.list('/messages/all/');
    }
    
    ngOnInit() { }
    onSubmitMessage() {
        console.log("onSubmitMessage()");
        this.user_message.push( { user: this.uid, message: this.form.message } );
        this.all_message.push( { user: this.uid, message: this.form.message } );
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

}