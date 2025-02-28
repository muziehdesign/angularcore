import { RedirectCommand, Router, Routes } from '@angular/router';
import { BlankComponent } from '../blank/blank.component';
import { inject } from '@angular/core';
import { AuthenticationService } from './authentication.service';

export const authenticationRoutes: Routes = [
    {
        path: 'login-redirect',
        component: BlankComponent,
        canMatch: [
            async () => {
                const auth = inject(AuthenticationService);
                const router = inject(Router);
                try {
                    console.log(`[login-redirect]handling.....1`);
                    const returnUrl = await auth.handleLoginCallback();
                    const urlTree = router.parseUrl(returnUrl || '/');

                    console.log(`[login-redirect]redirecting to ${returnUrl || '/'}, ${urlTree.toString()}`);
                    return new RedirectCommand(urlTree);
                } catch (e) {
                    console.log(`[login-redirect]error`, e);
                    return new RedirectCommand(router.createUrlTree(['/']));
                }
            },
        ],
    },
];
