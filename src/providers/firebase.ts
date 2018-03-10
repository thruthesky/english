import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList} from 'angularfire2/database';

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



  new_user: AngularFireList<any[]>;


  constructor(
    private db: AngularFireDatabase
  ){


  }

  getAllMessageList(): AngularFireList<any[]>{
    return this.db.list('/messages/all/', ref => ref.limitToLast(20));
  }


  push( path, data ) {
    return this.db.list('/' + path ).push(data);
  }


  getUserMessage( uid, no = 10 ): AngularFireList<any[]>{
    return this.db.list('/messages/users/' + uid, ref => ref.orderByKey().limitToLast(no) );
  }

  // userMessage( uid ) {
  //   return this.db.database.ref().child('/messages/users/' + uid);
  // }

  getLastMessage(): AngularFireList<any[]>{
    return this.db.list('/messages/last/', ref => ref.orderByChild('time').limitToLast(10) );
  }

  /**
   * 
   * Returns last massage chat ref
   * 
   * @param uid User id
   */
  lastMessage(uid: string) {
    return this.db.database.ref().child('/messages/last/' + uid);
  }

  sendLevelTest(data) {
    return this.db.list('/level_test/').push(data);
  }


}
