import { inject } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

export const requireAuthentication = async (route:ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> => {
    const auth = inject(AuthenticationService);
    if(auth.getSnapshot().authenticated) {
        return true;
    }

    await auth.login(state.url);
    return false;
};
