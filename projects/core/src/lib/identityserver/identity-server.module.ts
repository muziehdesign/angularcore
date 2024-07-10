import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationTokenInterceptor } from './authentication-token.interceptor';

@NgModule({
    declarations: [],
    imports: [CommonModule],
    providers: [
        AuthenticationTokenInterceptor
    ],
})
export class IdentityServerModule {}
