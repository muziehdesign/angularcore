import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanMatch, GuardResult, Route, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { AuthenticationService } from './identityserver/authentication.service';
import { Location } from '@angular/common';
import { AuthorizationService } from '../public-api';

/**
 * Automatically performs a silent sign in or redirect to the sign in page if the user is not authenticated. If the user is authenticated, it checks the `authorization` route data.
 */
@Injectable({
    providedIn: 'root',
})
export class AuthorizationGuard implements CanActivate, CanMatch {
    constructor(
        private authentication: AuthenticationService,
        private authorization: AuthorizationService,
        private location: Location
    ) {}

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<GuardResult> {
        const url = state.url;
        return this.checkAuthentication(url, route.data?.['authorization'] || []);
    }

    async canMatch(route: Route, segments: UrlSegment[]): Promise<GuardResult> {
        const url = this.location.path();
        return this.checkAuthentication(url, route.data?.['authorization'] || []);
    }

    protected async checkAuthentication(returnUrl: string, policies: string[] = []): Promise<boolean> {

      console.log('[AuthorizationGuard] checkAuthentication', returnUrl, policies);
        let authenticated = this.authentication.getSnapshot().authenticated;
        if (!authenticated) {
            authenticated = await this.authentication.signin(returnUrl);
        }

        if (!authenticated) {
            return new Promise<boolean>(
                (resolve) =>
                    setTimeout(() => {
                        resolve(false);
                    }, 3000) // timeout to make sure user sees sign in redirect before anything else, i.e. page not found because of canMatch
            );
        }

        if (policies.length === 0) {
            return true;
        }

        return (await Promise.all(policies.map((p) => this.authorization.authorize(p)))).every((v) => v === true);
    }
}
