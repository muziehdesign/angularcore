import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '@muziehdesign/angularcore';

@Component({
    selector: 'app-login-callback',
    standalone: true,
    imports: [],
    templateUrl: './login-callback.component.html',
    styleUrl: './login-callback.component.scss',
})
export class LoginCallbackComponent implements OnInit {
    constructor(private auth: AuthenticationService, private router: Router) {}
    async ngOnInit() {
        //const url = await this.auth.handleLoginCallback();
        //this.router.navigateByUrl(url);
    }
}
