import { inject } from '@angular/core';
import { AuthenticationService } from './authentication.service';

export const requireAuthentication = async (): Promise<boolean> => {
    const auth = inject(AuthenticationService);
    if(auth.getSnapshot().authenticated) {
        return true;
    }
    return auth.login().then(() => false);
};
