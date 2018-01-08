import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';


if (environment.production) {
  enableProdMode();
}

/**
 * Important: When you publish, UNcomment below.
 */
platformBrowserDynamic().bootstrapModule(AppModule);
  



/**
 * Important: When you publish, Comment-OUT below.
 * Comment out the code for HMR when you are publish because you don't need to import 'hmr' on production mode.
 */

// import { hmrBootstrap } from './hmr';

// // 수정 할 부분: 기존의 bootstrap 문장을 bootstrap() 함수로 만든다.
// const bootstrap = () => platformBrowserDynamic().bootstrapModule(AppModule);


// // 아래는 추가해야 할 부분.
// if (environment.hmr) {
//   if (module[ 'hot' ]) {
//     hmrBootstrap(module, bootstrap);
//   } else {
//     console.error('HMR is not enabled for webpack-dev-server!');
//     console.log('Are you using the --hmr flag for ng serve?');
//   }
// } else {
//   bootstrap();
// }
