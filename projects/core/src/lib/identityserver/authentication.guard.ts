import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, CanMatch, GuardResult, MaybeAsync, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { Location } from '@angular/common';

@Injectable()
export class AuthenticationGuard implements CanMatch, CanActivate {
    constructor(private auth: AuthenticationService, private location: Location) {}

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<GuardResult> {
        const url = state.url;
        return this.checkAuthentication(url);
    }

    async canMatch(route: Route, segments: UrlSegment[]): Promise<GuardResult> {
        const url = this.location.path();
        return this.checkAuthentication(url);
    }

    private async checkAuthentication(returnUrl: string): Promise<boolean> {
        let authenticated = this.auth.getSnapshot().authenticated;
        if(authenticated) {
            return true;
        }

        authenticated = await this.auth.login(returnUrl);
        if(authenticated) {
            return true;
        }
        return new Promise<boolean>((resolve) => 
            setTimeout(() => {
                console.log(`[Authentication]returning false`)
                resolve(false);
            }, 3000) // timeout to make sure user sees sign in redirect before anything else, i.e. page not found because of canMatch
        );
    }
}
