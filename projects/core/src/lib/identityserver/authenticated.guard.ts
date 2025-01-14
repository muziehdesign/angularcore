import { inject } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

export const requireAuthentication = async (route:ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> => {
    const auth = inject(AuthenticationService);
    if(auth.getSnapshot().authenticated) {
        console.log('is authenticated');
        return true;
    }
    console.log('redirecting to login from url: ', state.url);
    return auth.login(state.url).then(() => false);
};
