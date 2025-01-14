import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AUTHENTICATION_OPTIONS, loadConfigurations } from '@muziehdesign/angularcore';

import { AppModule } from './app/app.module';
import { AppConfig } from './environments/app-config';
import { environment } from './environments/environment';


if (environment.production === true) {
    enableProdMode();
}

loadConfigurations<AppConfig>(environment.configurations)
    .then(async (appConfig) => {


        // bootstrap
        const extraProviders = [
            { provide: AUTHENTICATION_OPTIONS, useValue: Object.freeze(appConfig.identity) },
            { provide: AppConfig, useValue: Object.freeze(appConfig) },
        ];

        return platformBrowserDynamic(extraProviders).bootstrapModule(AppModule);
    })
    .catch((error) => {
        document.body.innerHTML = 'Failed to load application, please refresh to try again.';
        console.log(error);
    });
