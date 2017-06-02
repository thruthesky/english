import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
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

      console.log("getAllMessageList:: ", {query});
    return this.db.list('/messages/all/', {query});
  }


  push( path, data ) {
    console.log('push', data);
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

  sendLevelTest(data, uid){
    console.log('sendLevelTest', data);
    return this.db.list('/level_test/inquiry/' + uid).push(data);
  }

  newRegisteredUser( req ){
    let msg = {
      id: req.id,
      email: req.email,
      name: req.name
    };
    this.new_user = this.db.list('/users/');

    this.new_user.push( msg ).then( res => {
      console.log('newRegisteredUser::', res);
    }, err => {
      console.log('newRegisteredUserError', err);
    }).catch( e => {
      console.log('newRegisteredUserErrorOnCatch', e);
    });
  }




}
