import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanMatch, GuardResult, Route, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { AuthenticationService } from './identityserver/authentication.service';
import { Location } from '@angular/common';
import { AuthorizationService } from '../public-api';

/**
 * Automatically performs a silent sign in or redirect to the sign in page if the user is not authenticated. If the user is authenticated, it checks the `authorization` route data.
 */
@Injectable()
export class AuthorizationGuard implements CanActivate, CanMatch {
    constructor(
        private authentication: AuthenticationService,
        private authorization: AuthorizationService,
        private location: Location
    ) {}

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<GuardResult> {
        const url = state.url;
        return this.authorize(url, route.data?.['authorization'] || []);
    }

    async canMatch(route: Route, segments: UrlSegment[]): Promise<GuardResult> {
        const url = this.location.path();
        return this.authorize(url, route.data?.['authorization'] || []);
    }

    protected async authorize(returnUrl: string, policies: string[] = []): Promise<GuardResult> {
        const authenticated = await this.isAuthenticated();
        if (!authenticated) {
            return this.handleUnauthorized(returnUrl);
        }

        if (policies.length === 0) {
            return true;
        }

        return (await Promise.all(policies.map((p) => this.authorization.authorize(p)))).every((v) => v === true);
    }

    protected async isAuthenticated(): Promise<boolean> {
        return this.authentication.getSnapshot().authenticated;
    }

    protected async handleUnauthorized(returnUrl: string): Promise<GuardResult> {
        const never = new Promise<never>(() => {});
        await this.authentication.signinRedirect(returnUrl);
        return never;
    }
}
