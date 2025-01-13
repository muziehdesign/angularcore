import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AuthenticationService, bootstrapAuthenticationService, loadConfigurations } from '@muziehdesign/angularcore';

import { AppModule } from './app/app.module';
import { AppConfig } from './environments/app-config';
import { environment } from './environments/environment';

if (environment.production === true) {
    enableProdMode();
}

loadConfigurations<AppConfig>(environment.configurations)
    .then(async (appConfig) => {
        const auth = await bootstrapAuthenticationService(appConfig.identity);
        const silentCallback = await auth.handleSilentCallback();
        if (silentCallback) {
            return;
        }
        await auth.handleLoginCallback();
        await auth.loadUser();

        // bootstrap
        const extraProviders = [
            { provide: AuthenticationService, useValue: auth },
            { provide: AppConfig, useValue: Object.freeze(appConfig) },
        ];

        return platformBrowserDynamic(extraProviders).bootstrapModule(AppModule);
    })
    .catch((error) => {
        document.body.innerHTML = 'Failed to load application, please refresh to try again.';
        console.log(error);
    });
