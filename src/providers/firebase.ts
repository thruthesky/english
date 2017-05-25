import { Injectable } from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';

@Injectable()
export class FirebaseChat {


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


}
