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
                    const returnUrl = await auth.handleLoginCallback();
                    const urlTree = router.parseUrl(returnUrl || '/');

                    return new RedirectCommand(urlTree);
                } catch {
                    return new RedirectCommand(router.parseUrl('/'));
                }
            },
        ],
    },
];
