import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AuthenticationService, AuthorizationService, provideAuthentication } from '@muziehdesign/angularcore';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CoreModule } from './core/core.module';
import { LayoutModule } from './layout/layout.module';
import { ShoppingCartClient } from './api/shopping-cart/shopping-cart.client';
import { map } from 'rxjs';
import { AppConfig } from 'src/environments/app-config';

@NgModule({
    declarations: [AppComponent, PageNotFoundComponent],
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
            return config.identity;
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
