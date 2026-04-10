import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationEvent } from './authentication-event';
import { AuthenticatedUser } from './authenticated-user';
import { AuthenticationStateData } from './authentication-state-data';

export const AUTHENTICATION = new InjectionToken<Authentication>('AUTHENTICATION');

export interface Authentication {
    get events(): Observable<AuthenticationEvent>;
    signinSilent(): Promise<AuthenticatedUser | undefined>;
    signinRedirect(returnUrl: string, options?: { extraQueryParams?: Record<string, string | number | boolean> }): Promise<void>;
    signoutRedirect(): Promise<void>;
    initialize(): Promise<void>;
    getSnapshot(): AuthenticationStateData;
    stateChanges(): Observable<AuthenticationStateData>;
}
