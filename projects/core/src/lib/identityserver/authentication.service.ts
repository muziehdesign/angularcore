import { Log, User, UserManager, UserManagerSettings } from 'oidc-client';
import { AuthenticatedUser } from './authenticated-user';
import { AUTHENTICATION_OPTIONS, AuthenticationOptions } from './authentication-options';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { WINDOW } from '../window.token';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private readonly userManager: UserManager;
    private readonly state = new BehaviorSubject<User | undefined>(undefined);

    constructor(
        @Inject(AUTHENTICATION_OPTIONS) private settings: AuthenticationOptions,
        @Inject(WINDOW) private window: Window
    ) {
        Log.logger = console; // TODO
        const map = new Map<string, number>();
        map.set('debug', Log.DEBUG);
        map.set('error', Log.ERROR);
        map.set('none', Log.NONE);
        map.set('warn', Log.WARN);
        map.set('info', Log.INFO);
        Log.level = map.get(settings.logLevel) || Log.NONE;

        this.userManager = new UserManager({
            authority: settings.authority,
            client_id: settings.clientId,
            response_type: settings.responseType,
            scope: settings.scope,
            redirect_uri: settings.redirectUri,
            silent_redirect_uri: settings.silentRedirectUri,
            post_logout_redirect_uri: settings.postLogoutRedirectUri,
            automaticSilentRenew: settings.automaticSilentRenew,
            checkSessionInterval: settings.checkSessionInterval,
            accessTokenExpiringNotificationTime: settings.accessTokenExpiringNotificationTime,
            filterProtocolClaims: settings.filterProtocolClaims,
            loadUserInfo: true,
            monitorSession: true,
        } satisfies UserManagerSettings);

        this.userManager.events.addUserSignedOut(async () => {
            console.log('[AuthenticationService]user signed out');
            this.state.next(undefined);
            await this.userManager.signoutRedirect();
        });

        this.userManager.events.addUserLoaded((user) => {
            console.log('[AuthenticationService]user loaded');
            this.state.next(user);
        });

        this.userManager.events.addUserUnloaded(() => {
            console.log('[AuthenticationService]user unloaded');
            this.state.next(undefined);
        });

        this.userManager.events.addAccessTokenExpired(async () => {
            console.log('[AuthenticationService]access token expired');
            this.state.next(undefined);
        });

        this.userManager.events.addSilentRenewError(async (error) => {
            console.log('[AuthenticationService]silent renew error', error);
            this.state.next(undefined); 
            this.window.alert('Session expired. Please refresh browser page to continue.');
            this.userManager.stopSilentRenew();
        });

        this.userManager.events.addUserSessionChanged(() => {
            console.log('[AuthenticationService]user session changed');
        });
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

    async handleSilentCallback(): Promise<boolean> {
        await this.userManager.signinSilentCallback();
        return true;
    }

    async handleLoginCallback(): Promise<string> {
        const redirectedUser = await this.userManager.signinRedirectCallback();
        const returnUrl = redirectedUser.state || '/';
        //window.history.replaceState({}, '', returnUrl);
        console.log(`[AuthenticationService]handle login callback: ${redirectedUser.expired}, ${redirectedUser.expires_at}, ${returnUrl}`);
        return redirectedUser.state;
    }

    async login(returnUrl: string): Promise<boolean> {
        const user: User | undefined = await this.userManager.signinSilent().catch(() => undefined);
        if (!user) {
            console.log(`[AuthenticationService]sign in silent unsuccessful, redirect with return url of ${returnUrl}`);
            await this.userManager.signinRedirect({ state: returnUrl });
            return false;
        }
        console.log(`[AuthenticationService]silently signed in user for login`);
        return true;
    }

    async initialize(): Promise<void> {
        this.userManager.clearStaleState();
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

    private mapToAuthenticatedUser(user: User | undefined): AuthenticatedUser | undefined {
        if (user) {
            return new AuthenticatedUser(new Map<string, any>(Object.entries(user.profile)));
        }

        return undefined;
    }

    private async signinSilent(): Promise<AuthenticatedUser | undefined> {
        const user: User | undefined = await this.userManager.signinSilent().catch(() => undefined);
        if (!user) {
            console.log(`[AuthenticationService]Silent signin unsuccessful`);
            return undefined;
        }
        return Promise.resolve(this.mapToAuthenticatedUser(user));
    }
}

export interface AuthenticationStateData {
    authenticated: boolean;
    user?: AuthenticatedUser;
    token?: string;
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
