import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { Logger } from '@muziehdesign/angularcore';
import { User } from 'oidc-client';
import { filter } from 'rxjs';
import { AppConfig } from 'src/environments/app-config';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent {
    title = 'shoppingcart-web';
    user: User | null = null;
    constructor(
        private config: AppConfig,
        private router: Router,
        private logger: Logger
    ) {
        this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(
            (event) => {
                const e = event as NavigationEnd;
                console.log('Route changed to:', e.urlAfterRedirects);
            },
            () => {}
        );

        this.logger.info('AppComponent initialized');
        this.logger.debug(this.logger);
        console.debug('debug debug debug');
    }
}