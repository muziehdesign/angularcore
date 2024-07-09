import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { bootstrapIdentityServer, loadConfigurations } from '@muziehdesign/angularcore';

import { AppModule } from './app/app.module';
import { AppConfig } from './environments/app-config';
import { environment } from './environments/environment';

if (environment.production === true) {
    enableProdMode();
}

loadConfigurations<AppConfig>(environment.configurations).then(async appConfig=> {
    const idsBootstrap = await bootstrapIdentityServer(appConfig.identity, false);
    if (idsBootstrap.halt) {
        return;
    }

    // bootstrap
    const extraProviders = [
        ...idsBootstrap.providers,
        { provide: AppConfig, useValue: Object.freeze(appConfig) },
    ];

    await platformBrowserDynamic(extraProviders)
        .bootstrapModule(AppModule);

}).catch(error=> {
    document.body.innerHTML = 'Failed to load application, please refresh to try again.';
    console.log(error);
});
