import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// Enable the production mode
if (environment.production) {
  enableProdMode();
}

// Starting application by initializing the App-Module
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

