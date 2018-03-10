import { Injectable } from '@angular/core';

import * as firebase from 'firebase';
import "firebase/firestore";


/**
 * 
 * 
 * @example
 * 
            /// how to add a review.
            const d = new Date();
            review.create({
                idxStudent: user.info.idx,
                studentName: user.info.name,
                idxTeacher: 200,
                teacherName: 'TeacherTwo',
                rate: 5,
                comment: 'Hi, TeacherTwo. This teacher is good.',
                date: d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
            });

            /// list review.
            review.gets( { idxTeacher: 27830, from: 5, to: 10 }, re => {
                console.log("gets re: ", re);

            });


            review.get('TWNirdxOp9twFiRphwqL', data => {
                console.log("get: re: ", data);
                data['comment'] = 'Comment is updated for this teacher ... !';
                review.edit( data, re => {
                    console.log("edit re :", re);

                    review.delete( 'TWNirdxOp9twFiRphwqL', re => {
                        console.log("delete: ", re);
                    });
                } );
            });


            
 */

@Injectable()
export class ReviewService {

  db: firebase.firestore.Firestore;
  constructor() {

    this.db = firebase.firestore();
  }

  /**
   * 
   * 
   * 
            review.create({
                idxStudent: user.info.idx,
                studentName: user.info.name,
                teacherName: 'TeacherWho',
                rate: 5,
                comment: 'This teacher is good.'
            });

   */
  create(data) {
    data['time'] = (new Date).getTime();
    this.db.collection('review').add(data);
  }


  gets(req, callback) {
    this.db.collection("review").where("idxTeacher", "==", req['idxTeacher'])
      .get()
      .then(function (querySnapshot) {
        const re = [];
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          const data = doc.data();
          data['documentID'] = doc.id;
          re.push(data);
          callback(re);
        });
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
        alert("후기 목록 읽기. 데이터베이스 에러. 관리자에게 연락해주세요."); // Database error. Please inform this to admin immediately.
      });
  }

  get(id, callback) {
    const docRef = this.db.collection("review").doc(id);

    docRef.get().then(doc => {
      if (doc.exists) {
        console.log("Document data:", doc.data());
        const data = doc.data();
        data['id'] = doc.id;
        callback(data);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        alert("수업 후기가 존재하지 않습니다.");
      }
    }).catch(function (error) {
      console.log("Error getting document:", error);
      alert("후기 읽기. 데이터베이스 에러. 관리자에게 연락해주세요."); // Database error. Please inform this to admin immediately.
    });
  }

  edit(data, callback) {
    const id = data.id;
    delete data.id;
    this.db.collection('review').doc(id).set(data)
      .then(re => callback(true))
      .catch(e => {
        console.error(e);
        alert("후기 수정. 데이터베이스 에러. 관리자에게 연락해주세요."); // Database error. Please inform this to admin immediately.
      });
  }
  delete(id, callback) {
    this.db.collection('review').doc(id).delete()
      .then(re => callback(true))
      .catch(e => {
        console.error(e);
        alert("후기 삭제. 데이터베이스 에러. 관리자에게 연락해주세요."); // Database error. Please inform this to admin immediately.
      });
  }

}

