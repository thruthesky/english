import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import { App } from './app';
@Injectable()
export class FirebaseChat {


  level_test: FirebaseListObservable<any[]>;
  uid:string;
  constructor(
    private db: AngularFireDatabase,
    private app: App
  ){

    this.uid = this.app.getClientId();
    this.level_test = this.db.list('/messages/level_test/' + this.uid);

  }

  getAllMessageList( req? ) : FirebaseListObservable<any[]>{
      let query = {};
      if( req  ) {
        query = req;
        if( !query['limitToLast']) query['limitToLast'] = 20;
      }
      else { query['limitToLast'] = 20; }

      console.log("getAllMessageList:: ", {query});
    return this.db.list('/messages/all/', {query});
  }


  getUserMessage( uid, req? ): FirebaseListObservable<any[]>{
    let query = {};
    if( req  ) {
      query = req;
      if( !query['limitToLast']) query['limitToLast'] = 10;
    }
    else { query['limitToLast'] = 10; }


    return this.db.list('/messages/users/' + uid, {query} )
  }

  getLastMessage( req? ):FirebaseListObservable<any[]>{

    let query = {};
    if( req  ) {
      query = req;
      if( !query['limitToLast']) query['limitToLast'] = 5;
    }
    else { query['limitToLast'] = 5; }

    query['orderByChild'] = 'time';

    return this.db.list('/messages/last/', {query});
  }

  sendLevelTest(data){
      console.log('data', data);
    this.level_test.push(data).then( res => {
      console.log('message::', res);
    }, err => {
      console.log('messageError', err);
    }).catch( e => {
      console.log('ErrorOnCatch', e);
    });

  }


}
