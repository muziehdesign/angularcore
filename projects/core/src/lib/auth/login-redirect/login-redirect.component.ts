import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';

@Component({
    selector: 'mz-login-redirect',
    imports: [],
    standalone: true,
    template: 'redirecting...',
})
export class LoginRedirectComponent implements OnInit {
    constructor(
        private auth: AuthenticationService,
        private router: Router
    ) {}
    async ngOnInit() {
        try {
            console.log('login redirect oninit');
            const returnUrl = await this.auth.signinRedirectCallback();
            await this.router.navigateByUrl(returnUrl, { replaceUrl: true });
        } catch (e) {
            console.error(e);
            await this.router.navigate(['/'], { replaceUrl: true });
        }
    }
}
