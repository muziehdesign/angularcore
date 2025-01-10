import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationTokenInterceptor } from './authentication-token.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';

@NgModule({
    declarations: [],
    imports: [],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthenticationTokenInterceptor, multi: true },
        AuthenticationService
    ],
})
export class IdentityServerModule {}
