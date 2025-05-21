import { Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ItemResponse } from './models/responses/item.response';
import { AppConfig } from 'src/environments/app-config';
import { PagedResponse } from '../paged.response';

@Injectable({
    providedIn: 'root',
})
export class CatalogClient {
    constructor(
        private http: HttpClient,
        private config: AppConfig
    ) {}

    getItem(sku: string): Observable<ItemResponse> {
        return this.http.get<ItemResponse>(`${this.config.catalogApi?.url}/api/v1/items/${sku}`);
    }

    getItems(): Observable<PagedResponse<ItemResponse>> {
        return this.http.get<PagedResponse<ItemResponse>>(`${this.config.catalogApi?.url}/api/v1/items`);
    }
}
