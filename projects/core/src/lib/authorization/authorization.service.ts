import { Injectable } from '@angular/core';
import { AuthorizationData } from './authorization-data';
import { AuthorizationPolicy, AUTHORIZATION_POLICY } from './authorization-policy';
import { AsyncSubject, BehaviorSubject, filter, firstValueFrom, forkJoin, map, Observable, ReplaySubject, take } from 'rxjs';
import { State } from '../state';

@Injectable({
    providedIn: 'root',
})
export class AuthorizationService {
    private state = new State<AuthorizationDataState>({
        loading: false,
        data: new Map<string, AuthorizationData>()
    });

    register(sources: { namespace: string; request: Observable<AuthorizationData> }[]) {
        this.state.patch({ loading: true, data: new Map<string, AuthorizationData>() });

        const requests = sources.map((s) => {
            return s.request.pipe(
                map((response: AuthorizationData) => {
                    return { namespace: s.namespace, data: response };
                })
            );
        });

        forkJoin(requests).subscribe({
            next: (value) => {
                const data = new Map<string, AuthorizationData>();
                value.forEach((v) => {
                    data.set(v.namespace, v.data);
                });
                this.state.patch({ loading: false, data: data})
            },
            error: (error) =>{
                this.state.patch({ loading: false, error: error, data: new Map<string, AuthorizationData>() });
            }
        });
    }

    getSnapshot(): AuthorizationDataState {
        return this.state.getSnapshot();
    }

    /**
     * Authorizes a policy or permission policy against the authorization data snapshot.
     */
    async authorize(permission: string): Promise<boolean> {
        const namespace = permission.split('.')[0];
        const data = this.state.getSnapshot().data;
        return data.get(namespace)?.permissions.includes(permission) === true;
    }

    async authorizeWhenReady(policy: string): Promise<boolean> {
        const source$ = this.state.stateChanges().pipe(
            filter((state) => state.loading === false),
            take(1),
            map((state) => {
                if(state.error) {
                    throw state.error;
                }
                
                const data = state.data;
                return data.get(policy.split('.')[0])?.permissions.includes(policy) === true;
            })
        );
        return await firstValueFrom(source$);
    }
}

export interface AuthorizationDataState {
    data: Map<string, AuthorizationData>;
    loading: boolean;
    error?: Error;
}
