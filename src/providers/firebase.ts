import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';

export interface _FIREBASE_CHAT {
  user: string;
  name: string;
  message: string;
  time?: number;
  count?: number;
  newVisitor?: boolean;
  noOfClasses?: number;
}



@Injectable()
export class FirebaseChat {



  new_user: FirebaseListObservable<any[]>;


  constructor(
    private db: AngularFireDatabase
  ){


  }

  getAllMessageList( req? ) : FirebaseListObservable<any[]>{
      let query = {};
      if( req  ) {
        query = req;
        if( !query['limitToLast']) query['limitToLast'] = 20;
      }
      else { query['limitToLast'] = 20; }

    return this.db.list('/messages/all/', {query});
  }


  push( path, data ) {
    return this.db.list('/' + path ).push(data);
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

  getLastMessage( req? ): FirebaseListObservable<any[]>{

    let query = {};
    if( req  ) {
      query = req;
      if( !query['limitToLast']) query['limitToLast'] = 5;
    }
    else { query['limitToLast'] = 5; }

    query['orderByChild'] = 'time';

    return this.db.list('/messages/last/', {query});
  }

  sendLevelTest(data) {
    return this.db.list('/level_test/').push(data);
  }


}
