import { RedirectCommand, Route, Router, Routes, UrlSegment } from '@angular/router';
import { LoginRedirectComponent } from './login-redirect/login-redirect.component';
import { inject } from '@angular/core';
import { AuthenticationService } from './authentication.service';

export const authenticationRoutes: Routes = [
    {
        path: 'login-redirect',
        component: LoginRedirectComponent,
        /*canMatch: [
            async (route: Route, segments: UrlSegment[]) => {
                const auth = inject(AuthenticationService);
                const router = inject(Router);
                
                try {
                    console.log('[login-redirect]Handling login callback', segments, route.path);
                    const returnUrl = await auth.signinRedirectCallback();
                    const urlTree = router.parseUrl(returnUrl || '/');

                    return new RedirectCommand(urlTree);
                } catch (e) {
                    console.log(`[login-redirect]error`, e);
                    return new RedirectCommand(router.createUrlTree(['/']));
                }
            },
        ],*/
    },
];
