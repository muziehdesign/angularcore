import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Logger } from '@muziehdesign/angularcore';
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
        private logger: Logger
    ) { }
}