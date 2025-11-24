import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanMatch, GuardResult, Route, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { Location } from '@angular/common';
import { AuthorizationService } from './authorization.service';
import { Authentication, AUTHENTICATION } from './authentication';

/**
 * Automatically performs a silent sign in or redirect to the sign in page if the user is not authenticated. If the user is authenticated, it checks the `authorization` route data.
 */
@Injectable()
export class AuthorizationGuard implements CanActivate, CanMatch {
    constructor(
        @Inject(AUTHENTICATION) protected authentication: Authentication,
        protected authorization: AuthorizationService,
        protected location: Location
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
            return this.handleUnauthenticated(returnUrl);
        }

        if (policies.length === 0) {
            return true;
        }

        const authorized = (await Promise.all(policies.map((p) => this.authorization.authorize(p)))).every((v) => v === true);
        if (authorized) {
            return true;
        }

        return this.handleUnauthorized(returnUrl);
    }

    protected async isAuthenticated(): Promise<boolean> {
        console.log('[AuthorizationGuard] Checking authentication status, waiting for initial authentication');
        await this.authentication.initialize();
        console.log('[AuthorizationGuard] finished initial authentication:', this.authentication.getSnapshot().authenticated)
        return this.authentication.getSnapshot().authenticated;
    }

    protected async handleUnauthenticated(returnUrl: string): Promise<GuardResult> {
        await this.authentication.signinRedirect(returnUrl);
        return false;
    }

    protected async handleUnauthorized(returnUrl: string): Promise<GuardResult> {
        return false;
    }
}
