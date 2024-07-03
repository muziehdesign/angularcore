import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { bootstrapIdentityServer } from '@muziehdesign/core';
import { forkJoin, from, map, Observable, take } from 'rxjs';
import { merge } from 'lodash';

import { AppModule } from './app/app.module';
import { AppConfig } from './environments/app-config';
import { environment } from './environments/environment';

const loadSettings = (urls: string[]): Observable<AppConfig> => forkJoin(urls.map((url) => from(fetch(url).then((x) => x.json())) as Observable<AppConfig>)).pipe(map((configs: AppConfig[]) => merge({}, ...configs) as AppConfig));

loadSettings(environment.configurations)
    .pipe(take(1))
    .subscribe({
        next: async (appConfig: AppConfig) => {
            if (environment.production === true) {
                enableProdMode();
            }

            const idsBootstrap = await bootstrapIdentityServer(appConfig.identity, false);
            if (idsBootstrap.halt) {
                return;
            }


            // bootstrap
            const extraProviders = [
                ...idsBootstrap.providers,
                { provide: AppConfig, useValue: Object.freeze(appConfig) },
            ];

            platformBrowserDynamic(extraProviders)
                .bootstrapModule(AppModule)
                .catch((e) => {
                    document.body.innerHTML = e; // TODO
                });
        },
        error: (err) => {
            document.body.innerHTML = 'Failed to load application, please try again.';
            console.log(err);
        },
    });
