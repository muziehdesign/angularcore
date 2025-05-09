import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule, inject, provideAppInitializer } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AuthenticationGuard, AuthenticationService, AuthorizationService, LOGGER } from '@muziehdesign/angularcore';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProfileComponent } from './profile/profile.component';
import { CoreModule } from './core/core.module';

import { initializeApplication, initializeAuthorization } from './app-initializer';
import { ShoppingCartClient } from './api/shopping-cart/shopping-cart.client';
import { LayoutModule } from './layout/layout.module';

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
        //AuthenticationService,
        AuthenticationGuard,
        provideHttpClient(withInterceptorsFromDi())
    ],
})
export class AppModule {}