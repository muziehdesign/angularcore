import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';

@Component({
    selector: 'mz-login-redirect',
    imports: [],
    standalone: true,
    template: ''
})
export class LoginRedirectComponent implements OnInit {
 
  constructor(private auth: AuthenticationService, private router: Router) {

  }
  async ngOnInit() {
    const returnUrl = await this.auth.signinRedirectCallback();
    this.router.navigateByUrl(returnUrl);
  }
}
