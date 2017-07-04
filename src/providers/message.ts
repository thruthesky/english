import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import * as firebase from 'firebase';

import { User } from 'angular-backend';


@Injectable()
export class Message {
    private messaging: firebase.messaging.Messaging;
    private db: firebase.database.Database;
    constructor(
        private http: Http,
        private user: User
    ) {


        this.messaging = firebase.messaging();
        this.db = firebase.database();

        if (user.admin) {
            this.requestPermission();
        }


        this.messaging.onMessage((payload) => {
            if ( payload && payload['notification'] && payload['notification']['title'] == 'LiveChat') return;
            alert(payload['notification']['title'] + "\n" + payload['notification']['body']);
            location.href = payload['notification']['click_action'];
        });

    }


    reduceTokens() {
        this.db.ref('/').child('push-tokens').once('value')
            .then(s => {
                let obj = s.val();
                if (!obj) return;
                if (Object.keys(obj).length > 5) {
                    //console.log("Going to delete /push-tokens")
                    this.db.ref('/').child('push-tokens').set(null);
                }
            });
    }


    requestPermission() {
        /**
         * Request permission (to user) for receiving messages.
         */
        this.messaging.requestPermission()
            .then(() => {
                this.messaging.getToken()
                    .then((currentToken) => {
                        if (currentToken) {
                            //
                            //console.log("Got token: ", currentToken);
                            this.reduceTokens();    /// delete tokens first
                            setTimeout(() => {      /// and then save my token.
                                this.db.ref('/').child('push-tokens').child(currentToken).set(true);
                            }, 2000);
                        } else {
                            console.log('No Instance ID token available. Request permission to generate one.');
                        }
                    })
                    .catch(function (err) {
                        console.log('An error occurred while retrieving token. ', err);
                    });

            })
            .catch(function (err) {
                console.log('Unable to get permission to notify.', err);
            });
    }

    send(title, body, url?) {

        let db = firebase.database();
        db.ref('/').child('push-tokens').once('value').then(snap => {
            let obj = snap.val();
            if (!obj) return;
            let tokens = Object.keys(obj);
            //console.log(tokens);
            for (let token of tokens) {
                this.requestPush(token, title, body, url);
            }
        });
    }

    requestPush(token, title, body, url) {

        if (!title) title = "I am Talkative Notification !"
        if (!url) url = "https://iamtalkative.com";
        //console.log("requestPush with: ", token, title, body);
        let data =
            {
                "notification": {
                    "title": title,
                    "body": body,
                    "icon": "/assets/images/logo/logo-icon.png",
                    "click_action": url
                },
                "to": token
            };
        this.http.post("https://fcm.googleapis.com/fcm/send", data, this.requestOptions)
            .subscribe(res => {
              //console.log(res);
            }, e => console.error(e));
    }

    get requestOptions(): RequestOptions {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': "key=AAAAmmHlkKc:APA91bFjDBATelEaBTcmpTWwbm9YmM1-nHhYWOAEf3DMQVm73MhjKxGlGvQ5q_YGJFyGdQ_DplRvXktpmudzWGoWrC-OZE8pYvFk-mlSJPEIvm7s_N4laHTYlmTE-sB4KxY1WZsJcl6q"
        });
        let options = new RequestOptions({ headers: headers });
        return options;
    }


}
