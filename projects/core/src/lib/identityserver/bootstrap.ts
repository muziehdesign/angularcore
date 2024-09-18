import { StaticProvider } from '@angular/core';
import { AuthenticationOptions } from './authentication-options';
import { AuthenticationService } from './authentication.service';

export const bootstrapIdentityServer = async (settings: AuthenticationOptions, haltAnonymous: boolean = false) => {
    const service = new AuthenticationService(settings);
    const silentRedirected = await service.interceptSilentRedirect();
    if (silentRedirected) {
        return { halt: true, providers: [] } satisfies IdentityServerBootstrapResult;
    }

    const user = await service.completeSignIn();
    if(!user && haltAnonymous) {
        await service.login();
        return { halt: true, providers: [] } satisfies IdentityServerBootstrapResult;
    }

    return {
        halt: false,
        providers: [
            { provide: AuthenticationService, useValue: service }
        ]
    } satisfies IdentityServerBootstrapResult;
};

export interface IdentityServerBootstrapResult {
    halt: boolean;
    providers: StaticProvider[];
}
