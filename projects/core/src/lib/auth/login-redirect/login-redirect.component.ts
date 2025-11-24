import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Authentication, AUTHENTICATION } from '../authentication';
import { AuthenticationService } from '../authentication.service';

@Component({
    selector: 'mz-login-redirect',
    imports: [],
    standalone: true,
    template: ''
})
export class LoginRedirectComponent implements OnInit {
 
  constructor(@Inject(AUTHENTICATION) private auth: AuthenticationService, private router: Router) {

  }
  async ngOnInit() {
    const returnUrl = await this.auth.signinRedirectCallback();
    this.router.navigateByUrl(returnUrl);
  }
}
