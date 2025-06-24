import { AuthenticatedUser } from './authenticated-user';
import { BehaviorSubject, Observable, ReplaySubject, map } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { User, UserManager } from 'oidc-client-ts';
import { Logger } from '../logger/logger';
import { OIDC_USER_MANAGER } from './providers';

@Injectable()
export class AuthenticationService {
    private readonly state = new BehaviorSubject<User | undefined>(undefined);
    private initializationPromise: Promise<void> | undefined;

    private readonly eventsSubject = new ReplaySubject<AuthenticationEvent>(1);

    constructor(
        @Inject(OIDC_USER_MANAGER) private userManager: UserManager,
        private logger: Logger
    ) {
        this.userManager.events.addUserSignedOut(async () => {
            this.logger.debug('[AuthenticationService]Sign-in status at the OP has changed. Performing signoutRedirect.');
            this.state.next(undefined);
            this.eventsSubject.next(new AuthenticationEvent(AuthenticationEventType.UserSignedOut));
            await this.userManager.signoutRedirect(); // TODO
        });

        this.userManager.events.addUserLoaded((user) => {
            console.log('[AuthenticationService]user loaded');
            //this.state.next(user);
            //this.eventsSubject.next(new AuthenticationEvent(AuthenticationEventType.UserLoaded));
        });

        this.userManager.events.addUserUnloaded(() => {
            console.log('[AuthenticationService]user unloaded');
            //this.state.next(undefined);
            //this.eventsSubject.next(new AuthenticationEvent(AuthenticationEventType.UserUnloaded));
        });

        this.userManager.events.addAccessTokenExpiring(async ()=>{
            console.log('[AuthenticationService]access token expiring');
            this.eventsSubject.next(new AuthenticationEvent(AuthenticationEventType.AccessTokenExpiring));
        });

        this.userManager.events.addAccessTokenExpired(async () => {
            console.log('[AuthenticationService]access token expired');
            this.eventsSubject.next(new AuthenticationEvent(AuthenticationEventType.AccessTokenExpired));
        });

        this.userManager.events.addSilentRenewError(async (error) => {
            console.log('[AuthenticationService]silent renew error', error);
            this.state.next(undefined); 
            this.eventsSubject.next(new SilentRenewErrorEvent(error));
        });

        this.userManager.events.addUserSessionChanged(() => {
            this.eventsSubject.next(new AuthenticationEvent(AuthenticationEventType.UserSessionChanged));
        });
    }

    get events(): Observable<AuthenticationEvent> {
        return this.eventsSubject.asObservable();
    }

    async loadUser(): Promise<AuthenticatedUser | undefined> {
        const user: User | null = await this.userManager.getUser().catch(() => null);
        if (!user || user.expired) {
            console.log(`[AuthenticationService]No user data to load, or user expired at ${user?.expires_at}`);
            this.state.next(undefined);
            return undefined;
        }
        console.log(`[AuthenticationService]Restored user, expires at ${user?.expires_at}, in ${user?.expires_in}`);
        this.state.next(user);
        return Promise.resolve(this.mapToAuthenticatedUser(user));
    }

    async signinRedirectCallback(url?: string): Promise<string> {
        const redirectedUser = await this.userManager.signinRedirectCallback(url);
        const returnUrl = redirectedUser.state || '/';
        //window.history.replaceState({}, '', returnUrl);
        console.log(`[AuthenticationService]handle login callback: ${redirectedUser.expired}, ${redirectedUser.expires_at}, ${returnUrl}`);
        return redirectedUser.state as string;
    }

    async signinSilent(): Promise<AuthenticatedUser | undefined> { 
        console.log(`[AuthenticationService]Performing silent sign-in`);
        const user = await this.userManager.signinSilent().catch(() => null);
        this.state.next(user || undefined);
        console.log(`[AuthenticationService]Silent sign-in completed, user: ${user?.expired}, expires at: ${user?.expires_at}`);
        return this.mapToAuthenticatedUser(user || undefined);
    }

    signinRedirect(returnUrl: string): Promise<void> {
        return this.userManager.signinRedirect({ state: returnUrl });
    }

    signoutRedirect(): Promise<void> {
        return this.userManager.signoutRedirect();
    }

    /**
     * Performs a silent sign-in. If the user is not authenticated, redirects to the identity provider.
     */
    async signin(returnUrl: string): Promise<AuthenticatedUser | undefined> {
        const user = await this.signinSilent();
        if (!user) {
            await this.userManager.signinRedirect({ state: returnUrl });
        }
        return user;
    }

    /**
     * Initializes the authentication service; performs a silent sign-in. This logic only runs once and is relied on by AuthorizationGuard.
     */
    async initialize(): Promise<void> {
        this.initializationPromise = this.initializationPromise || this.internalInitialize();
        return this.initializationPromise;
    }

    getSnapshot() : AuthenticationStateData {
        const user = this.state.getValue();
        return {
            user: this.mapToAuthenticatedUser(user),
            authenticated: user !== undefined && !user.expired,
            token: user?.access_token,
        } satisfies AuthenticationStateData;
    }

    stateChanges(): Observable<AuthenticationStateData> {
        return this.state.asObservable().pipe(
            map((user: User | undefined) => {
                return {
                    user: this.mapToAuthenticatedUser(user),
                    authenticated: user !== undefined,
                    token: user?.access_token,
                } satisfies AuthenticationStateData;
            })
        );
    }

    private async internalInitialize(): Promise<void> {
        console.log('[AuthenticationService]Initializing authentication service');
        await this.signinSilent();
    }

    private mapToAuthenticatedUser(user: User | undefined): AuthenticatedUser | undefined {
        if (user) {
            return new AuthenticatedUser(new Map<string, any>(Object.entries(user.profile)));
        }

        return undefined;
    }
}

export interface AuthenticationStateData {
    authenticated: boolean;
    user?: AuthenticatedUser;
    token?: string;
}

export enum AuthenticationEventType {
    UserLoaded = 'userLoaded',
    UserUnloaded = 'userUnloaded',
    SilentRenewError = 'silentRenewError',
    UserSignedOut = 'userSignedOut',
    UserSessionChanged = 'userSessionChanged',
    AccessTokenExpiring = 'accessTokenExpiring',
    AccessTokenExpired = 'accessTokenExpired'
}

export class AuthenticationEvent {
    readonly type: AuthenticationEventType;
    constructor(type: AuthenticationEventType) {
        this.type = type;
    }
}

export class SilentRenewErrorEvent extends AuthenticationEvent {
    readonly error: Error;
    constructor(error: Error) {
        super(AuthenticationEventType.SilentRenewError);
        this.error = error;
    }
}


/**
 * 
 *  https://github.com/IdentityModel/oidc-client-js/wiki#methods
    getUser: Returns promise to load the User object for the currently authenticated user.
    removeUser: Returns promise to remove from any storage the currently authenticated user.
    signinRedirect: Returns promise to trigger a redirect of the current window to the authorization endpoint.
    signinRedirectCallback: Returns promise to process response from the authorization endpoint. The result of the promise is the authenticated User.
    signinSilent: Returns promise to trigger a silent request (via an iframe) to the authorization endpoint. The result of the promise is the authenticated User.
    signinSilentCallback: Returns promise to notify the parent window of response from the authorization endpoint.
    signinPopup: Returns promise to trigger a request (via a popup window) to the authorization endpoint. The result of the promise is the authenticated User.
    signinPopupCallback: Returns promise to notify the opening window of response from the authorization endpoint.
    signoutRedirect: Returns promise to trigger a redirect of the current window to the end session endpoint.
    signoutRedirectCallback: Returns promise to process response from the end session endpoint.
    signoutPopup [1.4.0]: Returns promise to trigger a redirect of a popup window window to the end session endpoint.
    signoutPopupCallback [1.4.0]: Returns promise to process response from the end session endpoint from a popup window.
    querySessionStatus [1.1.0]: Returns promise to query OP for user's current signin status. Returns object with session_state and subject identifier.
    startSilentRenew [1.4.0]: Enables silent renew for the UserManager.
    stopSilentRenew [1.4.0]: Disables silent renew for the UserManager.
    clearStaleState: Removes stale state entries in storage for incomplete authorize requests.
 */
