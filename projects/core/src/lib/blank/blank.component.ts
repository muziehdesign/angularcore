import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../identityserver/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-blank',
  standalone: true,
  imports: [],
  templateUrl: './blank.component.html'
})
export class BlankComponent implements OnInit {
 
  constructor(private auth: AuthenticationService, private router: Router) {

  }
  async ngOnInit() {
    const returnUrl = await this.auth.handleLoginCallback();
    this.router.navigateByUrl(returnUrl);
  }
}
