import { Injectable, inject } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { ActivatedRouteSnapshot, CanActivate, CanMatch, GuardResult, MaybeAsync, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';

export const requireAuthentication = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> => {
    const auth = inject(AuthenticationService);
    if (auth.getSnapshot().authenticated) {
        return true;
    }

    console.log(window.history);
    console.log(`authenticating ${state.url}`);
    await auth.login(state.url);
    return new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 1000));
};

export const requireAuthenticationCanMatch = async (route: Route, segments: UrlSegment[]): Promise<boolean> => {
    const auth = inject(AuthenticationService);
    if (auth.getSnapshot().authenticated) {
        return true;
    }

    const url = segments.map((segment) => segment.path).join('/');
    console.log(`authenticating ${url}`);
    await auth.login(url);
    return new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 3000));
};

@Injectable()
export class AuthenticationGuard implements CanMatch, CanActivate {
    constructor(private auth: AuthenticationService) {}

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<GuardResult> {

        const authenticated = await this.auth.checkAuthentication();
        if (authenticated) {
            return true;
        }

        console.log(`authenticating ${state.url}`);
        await this.auth.login(state.url);
        return new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 10000));
    }

    async canMatch(route: Route, segments: UrlSegment[]): Promise<GuardResult> {
        const authenticated = await this.auth.checkAuthentication();
        if (authenticated) {
            return true;
        }

        const url = segments.map((segment) => segment.path).join('/');
        console.log(`authenticating ${url}`);
        await this.auth.login(url);
        return new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 10000));
    }
}
