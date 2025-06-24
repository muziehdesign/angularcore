import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationEventType, AuthenticationService, WINDOW } from '@muziehdesign/angularcore';
import { AppConfig } from 'src/environments/app-config';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent {
    title = '@muziehdesign/angularcore';
    constructor(
        private config: AppConfig,
        private router: Router,
        private authentication: AuthenticationService,
        @Inject(WINDOW) private window: Window
    ) { 
        this.authentication.events.subscribe((event) => {
            if(event.type === AuthenticationEventType.SilentRenewError) {
                window.alert('Session expired. Please refresh browser page to continue.');
            }
        });
    }
}