import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AuthenticationService, AuthorizationService, provideAuthentication, WINDOW } from '@muziehdesign/angularcore';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { LayoutModule } from './layout/layout.module';
import { ShoppingCartClient } from './api/shopping-cart/shopping-cart.client';
import { map } from 'rxjs';
import { AppConfig } from 'src/environments/app-config';

@NgModule({
    declarations: [AppComponent],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        CoreModule,
        LayoutModule,
        // route
        AppRoutingModule,
    ],
    providers: [
        provideAuthentication((injector: Injector) => {
            const config = injector.get(AppConfig);
            return {
                ...config.identity,
                onSilentRenewError: (error: Error) => {
                    const w = injector.get(WINDOW);
                    w.alert('Session expired. Please refresh browser page to continue.');
                    return Promise.resolve();
                },
            };
        }),
        provideHttpClient(withInterceptorsFromDi()),
        {
            provide: APP_INITIALIZER,
            useFactory: (authentication: AuthenticationService, authorization: AuthorizationService, client: ShoppingCartClient) => async () => {
                authorization.register(
                    client.getAuthorization().pipe(
                        map((data) => {
                            return [{ namespace: 'ShoppingCart', data }];
                        })
                    )
                );

                await authentication.initialize();
            },
            deps: [AuthenticationService, AuthorizationService, ShoppingCartClient],
            multi: true,
        },
    ],
})
export class AppModule {}
