import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';



if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);



// import { hmrBootstrap } from './hmr';


// const bootstrap = () => platformBrowserDynamic().bootstrapModule(AppModule);
 
 
// if (environment.hmr) {
//   if (module[ 'hot' ]) {
//     hmrBootstrap(module, bootstrap);
//   } else {
//   }
// } else {
//   bootstrap();
// }
