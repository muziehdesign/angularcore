import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { bootstrapUserManager, loadConfigurations } from '@muziehdesign/angularcore';

import { AppModule } from './app/app.module';
import { AppConfig } from './environments/app-config';
import { environment } from './environments/environment';
import { UserManager } from 'oidc-client';

if (environment.production === true) {
    enableProdMode();
}

loadConfigurations<AppConfig>(environment.configurations)
    .then(async (appConfig) => {
        const userManager = bootstrapUserManager(appConfig.identity);


        // bootstrap
        const extraProviders = [
            { provide: UserManager, useValue: userManager },
            { provide: AppConfig, useValue: Object.freeze(appConfig) },
        ];

        return platformBrowserDynamic(extraProviders).bootstrapModule(AppModule);
    })
    .catch((error) => {
        document.body.innerHTML = 'Failed to load application, please refresh to try again.';
        console.log(error);
    });
