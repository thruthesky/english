import { Component } from '@angular/core';
import { App } from '../providers/app';

import { Backend } from 'angular-backend';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet (window:resize)="onResize($event)"></router-outlet>
    <ng-template ngbModalContainer></ng-template>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  constructor( private app: App,
               private backed:Backend ) {
    // backed.setBackendUrl("http://backend.dev/index.php");
    backed.setBackendUrl("https://englishfordevelopers.com/index.php");
    app.setWidth( window.innerWidth );
    document.addEventListener("deviceready", () => this.onDevinceReady(), false);
  


    Observable.fromEvent(window, 'scroll')
          .debounceTime(100)
          .subscribe((event) => {
            app.scrolled( event );
          });


          console.log( s( [ 3, -3 ] ) == true );
          console.log( s( [ 3, 0, -3 ] ) == false );

          console.log( s( [ 3, 0, -3, 1 ] ) == false );


          console.log( s(  [10, 1, 2, 3, 4, 5]) == true );

          console.log( s( [ 2, 1] ) == true );
          console.log( s( [-5, -4, -3, -2, 10, 2, 8] ) == true )
          console.log( s( [ -123456, 5, 123456] ) == true  );

          console.log( s( [ -2, 1, -1, -4, 4 ] ) == false );

          console.log( s( [ -10, -20] ) == true );

          console.log( s( [ 10, 0 ] ) == true );


          console.log( s( [ 10, 0, -10 ] ) == false );



          console.log( s( [ 10, 20, 30 ] ) == true );
          console.log( s( [ 10, 9, 8, 7, 6, 1, 2, 3, 4, 5 ] ) == false );

          console.log( s( [ 10, 0, 3, -6, 9 ] ) == false );

          console.log( s( [ 1, 3, 2] ) == true );

          console.log( s( [1, 3, 2, 1] ) == false );
          
          console.log(s( [ 1, 5, 6, 9, 7 ] ) == true);
          console.log(s( [ 1, 6, 4, 2, 9 ] ) == false );
          

          console.log( s( [10, 1, 2, 3, 4, 5, 6, 1] ) == false );


console.log(s([1, 2, 3, 4, 3, 6]) == true );

console.log( s([1, 2, 1, 2]) == false );

          console.log( s( [ 2, 2, 2 ] ) == false );
//
// 2,2,2
// 1,2,1,2
// 5, 9, 2, 10
// 1,2,3,4,3,6
// 10, 1, 5, 1
// 1,6,4,2,9
// x(i) >= x(i+1) 이면 문제 발생.
//  i 이전의 값을 1 위치에 놓고 다시 계산.
// 
//
function s(x) {


  var f = 0;
  for( var i = 0; i < x.length - 1; i ++ ) {
    if ( x[i] >= x[i+1] ) {
      f ++;
      if ( i > 0 && x[i-1] >= x[i+1] && i < x.length - 2 && x[i] >= x[i+2] ) return false;
    }
    if ( f > 1 ) return false;
  }
  return true;

  //if ( x[0] == 1 && x[1] == 2 && x[2] == 3 ) debugger;
  // if ( x.length <= 2 ) return true;
  // var failed = 0;
  // for ( var i = 0 ; i < x.length - 1; i ++ ) {
  //   if ( failed > 1 ) return false;
  //   if ( x[i] >= x[i+1] ) {
  //     failed ++;
  //     if ( i == 0 ) {
        
  //     }
  //     if ( i == 1 && failed == 1 ) failed ++;
  //     else { 
  //       if ( x[i-1] >= x[i+1] && x[i] >= x[i+2] ) failed ++;
  //     }
  //   }
  // }
  // return true;
  // var f = 0;
  // //if ( x[0] == 1 && x[1] == 2 && x[2] == 3 ) debugger;
  // for ( var i = 0 ; i < x.length - 1; i ++ ) {
    
  //   if ( x[i] >= x[i +  1] ) {
  //     if ( f == 1 ) return false;
  //     x.splice( i, 1 );
  //     i--;
  //     if ( i >= 0 ) i --;
  //     f ++;
  //   }
  // }
  // return true;
}
               }


  ngOnInit() {



    setTimeout( () => this.app.scrolled( event ), 10);
  }
  onDevinceReady() {
    console.log("yes, I am running in cordova.");
  }
  
  onResize(event) {
    this.app.setWidth( window.innerWidth );
  }

}
