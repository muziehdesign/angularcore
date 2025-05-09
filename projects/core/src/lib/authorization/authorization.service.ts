import { Injectable } from '@angular/core';
import { AuthorizationData } from './authorization-data';
import { AsyncSubject, catchError, firstValueFrom, forkJoin, map, Observable, of, Subscription, throwError } from 'rxjs';
import { Logger } from '../logger/logger';

interface NamespacedAuthorizationDataResponse {
    namespace: string;
    data: AuthorizationData;
}

@Injectable({
    providedIn: 'root',
})
export class AuthorizationService {
    private dataSubject = new AsyncSubject<Map<string, AuthorizationData>>();
    private subscription?: Subscription;
    private sources: { namespace: string; request: Observable<AuthorizationData> }[] = [];

    constructor(private logger: Logger) {}

    /**
     * Resets the authorization data and re-fetches data from the sources.
     */
    reset() {
        this.subscription?.unsubscribe();
        this.dataSubject.complete();
        this.dataSubject = new AsyncSubject<Map<string, AuthorizationData>>();
        this.register(this.sources);
    }

    /**
     * Registers a set of sources for authorization data. Should only be called once.
     * @param sources - An array of sources, each containing a namespace and an observable request for authorization data. Namespace should be prefix used by api.
     */
    register(sources: { namespace: string; request: Observable<AuthorizationData> }[]) {
        this.sources = sources;
        const requests = sources.map((s) => {
            return s.request.pipe(
                map((response: AuthorizationData) => {
                    return { namespace: s.namespace, data: response } satisfies NamespacedAuthorizationDataResponse;
                }),
                catchError((error) => {
                    this.logger.error(`[AuthorizationService]Error fetching authorization data for namespace ${s.namespace}:`, error);
                    return of({
                        namespace: s.namespace,
                        data: { roles: [], permissions: [] } satisfies AuthorizationData,
                    } as NamespacedAuthorizationDataResponse);
                })
            );
        });

        this.subscription = forkJoin(requests).subscribe({
            next: (value) => {
                const map = new Map<string, AuthorizationData>();
                value.forEach((v) => {
                    map.set(v.namespace, v.data);
                });
                this.dataSubject.next(map);
            },
            error: (error) => {
                this.dataSubject.error(error);
            },
            complete: () => {
                this.dataSubject.complete();
            },
        });
    }

    async getAuthorizationData(): Promise<Map<string, AuthorizationData>> {
        return firstValueFrom(this.dataSubject.asObservable());
    }

    /**
     * Authorizes a permission policy against the data snapshot.
     */
    async authorize(permission: string): Promise<boolean> {
        const namespace = permission.split('.')[0];
        const data = await firstValueFrom(this.dataSubject);
        return data.get(namespace)?.permissions.includes(permission) === true;
    }
}
