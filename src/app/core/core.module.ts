import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AUTHORIZATION_POLICY, LOGGER, PermissionAuthorizationPolicy } from '@muziehdesign/angularcore';
import { GlobalErrorHandler } from './global-error-handler';
import { IdentityServerModule } from 'projects/core/src/lib/identityserver/identity-server.module';

@NgModule({
    declarations: [],
    imports: [CommonModule, IdentityServerModule],
    providers: [
        { provide: LOGGER, useValue: window.console }, // TODO: use actual logger
        { provide: AUTHORIZATION_POLICY, useClass: PermissionAuthorizationPolicy, multi: true }, 
        { provide: ErrorHandler, useClass: GlobalErrorHandler },
    ],
})
export class CoreModule {}
