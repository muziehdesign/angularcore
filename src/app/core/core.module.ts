import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AUTHORIZATION_POLICY, AuthenticationTokenInterceptor, LOGGER, Logger, PermissionAuthorizationPolicy } from '@muziehdesign/angularcore';
import { GlobalErrorHandler } from './global-error-handler';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CustomLogger } from './custom-logger';

@NgModule({
    declarations: [],
    imports: [CommonModule],
    providers: [
        { provide: LOGGER, useValue: window.console }, // TODO: use actual logger
        { provide: Logger, useClass: CustomLogger },
        { provide: AUTHORIZATION_POLICY, useClass: PermissionAuthorizationPolicy, multi: true }, 
        { provide: ErrorHandler, useClass: GlobalErrorHandler },
        { provide: HTTP_INTERCEPTORS, useClass: AuthenticationTokenInterceptor, multi: true },
    ],
})
export class CoreModule {}
