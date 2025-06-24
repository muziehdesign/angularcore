import { Injectable } from '@angular/core';
import { AuthorizationData } from './authorization-data';
import { AsyncSubject, firstValueFrom, map, Observable, take } from 'rxjs';
import { Logger } from '../logger/logger';

export interface NamespacedAuthorizationDataResponse {
    namespace: string;
    data: AuthorizationData;
}

/**
 * Authorizes a permission policy against registered authorization responses.
 */
@Injectable()
export class AuthorizationService {
    private dataSubject?: AsyncSubject<Map<string, AuthorizationData>>;
    private source?: Observable<NamespacedAuthorizationDataResponse[]>

    constructor(private logger: Logger) {}

    /**
     * Registers a set of sources for authorization data.
     * @param sources - An array of sources, each containing a namespace and an observable request for authorization data. Namespace should be prefix used by api.
     */
    register(source: Observable<NamespacedAuthorizationDataResponse[]>) {
        this.source = source;
    }

    async getAuthorizationData(): Promise<Map<string, AuthorizationData>> {
        return firstValueFrom(this.getData());
    }

    /**
     * Authorizes a permission policy against the data snapshot.
     */
    async authorize(permission: string): Promise<boolean> {
        const namespace = permission.split('.')[0];
        const data = await this.getAuthorizationData();
        return data.get(namespace)?.permissions.includes(permission) === true;
    }

    private getData(): Observable<Map<string, AuthorizationData>> {
        if (this.dataSubject) {
            return this.dataSubject.asObservable();;
        }

        this.dataSubject = new AsyncSubject<Map<string, AuthorizationData>>();
        const request = this.source!.pipe(
            take(1),
            map((value) => {
                const map = new Map<string, AuthorizationData>();
                value.forEach((v) => {
                    map.set(v.namespace, v.data);
                });

                return map;
            })
        );
        request.subscribe(this.dataSubject);
        return this.dataSubject.asObservable();
    }
}