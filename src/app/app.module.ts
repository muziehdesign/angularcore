import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AuthenticationGuard, AuthenticationService, AuthorizationService } from '@muziehdesign/angularcore';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProfileComponent } from './profile/profile.component';
import { CoreModule } from './core/core.module';
import { LayoutModule } from './layout/layout.module';
import { ShoppingCartClient } from './api/shopping-cart/shopping-cart.client';
import { map } from 'rxjs';

@NgModule({
    declarations: [AppComponent, PageNotFoundComponent, ProfileComponent],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        CoreModule,
        LayoutModule,
        // route
        AppRoutingModule,
    ],
    providers: [
        AuthenticationGuard,
        provideHttpClient(withInterceptorsFromDi()),
        {
            provide: 'APP_INITIALIZER',
            useFactory: (authentication: AuthenticationService, authorization: AuthorizationService, client: ShoppingCartClient) => () => {
                authorization.register(
                    client.getAuthorization().pipe(
                        map((data) => {
                            return [{ namespace: 'ShoppingCart', data }];
                        })
                    )
                );
            },
            deps: [AuthenticationService, AuthorizationService, ShoppingCartClient],
            multi: true,
        },
    ],
})
export class AppModule {}
