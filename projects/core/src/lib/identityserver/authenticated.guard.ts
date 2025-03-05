import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { ActivatedRouteSnapshot, CanActivate, CanMatch, GuardResult, MaybeAsync, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';

@Injectable()
export class AuthenticationGuard implements CanMatch, CanActivate {
    constructor(private auth: AuthenticationService) {}

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<GuardResult> {

        const authenticated = await this.auth.checkAuthentication();
        if (authenticated) {
            return true;
        }

        console.log(`canActivate authenticating ${state.url}`);
        await this.auth.login(state.url);
        return new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 10000));
    }

    async canMatch(route: Route, segments: UrlSegment[]): Promise<GuardResult> {
        const authenticated = await this.auth.checkAuthentication();
        if (authenticated) {
            return true;
        }

        const url = segments.map((segment) => segment.path).join('/');
        console.log(`canMatch authenticating ${url}`);
        await this.auth.login(url);
        return new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 10000));
    }
}
