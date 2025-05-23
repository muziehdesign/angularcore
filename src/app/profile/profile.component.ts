import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthorizationData, AuthorizationService } from '@muziehdesign/angularcore';

@Component({
    selector: 'app-profile',
    imports: [JsonPipe],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
    authorizationData!: Map<string, AuthorizationData>;
    constructor(private authorizationService: AuthorizationService) {}
    async ngOnInit() {
        this.authorizationData = await this.authorizationService.getAuthorizationData();
    }
}
