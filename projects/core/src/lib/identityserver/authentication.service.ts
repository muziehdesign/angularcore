import { Log, User, UserManager, UserManagerSettings } from 'oidc-client';
import { AuthenticatedUser } from './authenticated-user';
import { AUTHENTICATION_OPTIONS, AuthenticationOptions } from './authentication-options';
import { BehaviorSubject, map } from 'rxjs';
import { Inject, Injectable } from '@angular/core';

@Injectable()
export class AuthenticationService {
    private readonly userManager: UserManager;
    private readonly user = new BehaviorSubject<User | undefined>(undefined);

    constructor(@Inject(AUTHENTICATION_OPTIONS) private settings: AuthenticationOptions) {
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
            this.user.next(undefined);
            await this.userManager.signoutRedirect();
        });

        this.userManager.events.addUserLoaded((user) => {
            Log.logger.debug(`[AuthenticationService]user loaded`);
            this.user.next(user);
        });

        this.userManager.events.addUserUnloaded(()=>{
            Log.logger.debug(`[AuthenticationService]user unloaded`);
            this.user.next(undefined); 
        });
    }

    async loadUser(): Promise<AuthenticatedUser | undefined> {
        const user: User | null | undefined = await this.userManager.getUser().catch(() => undefined);
        if (user?.expired) {
            Log.logger.debug(`[AuthenticationService]Retrieved user but user has expired ${user.expires_at}`);
            return undefined;
        }
        return Promise.resolve(this.mapToAuthenticatedUser(user));
    }

    /** Handle silent callback. True indicates it called `signinSilentCallback`, bootstrap should be halted */
    async handleSilentCallback(): Promise<boolean> {
        if (window.location.href.indexOf(this.settings.silentRedirectUri) > -1) {
            await this.userManager.signinSilentCallback();
            return true;
        }

        return false;
    }

    async handleLoginCallback(): Promise<void> {
        if(window.location.href.indexOf(this.settings.redirectUri) > -1) {
            const redirectedUser = await this.userManager.signinRedirectCallback();
            window.history.replaceState({}, window.document.title, redirectedUser.state || '/');
        }
    }

    async login(): Promise<void> {
        return this.userManager.signinRedirect();
    }

    getSnapshot() {
        const user = this.user.getValue();
        return {
            user: this.mapToAuthenticatedUser(user),
            authenticated: user !== undefined,
            token: user?.access_token
        } satisfies AuthenticationStateData;
    }

    stateChanges() {
        return this.user.asObservable().pipe(
            map((user: User | undefined)=> {
                return {
                    user: this.mapToAuthenticatedUser(user),
                    authenticated: user !== undefined,
                    token: user?.access_token
                } satisfies AuthenticationStateData;
            })
        );
    }

    private mapToAuthenticatedUser(user: User | undefined | null): AuthenticatedUser | undefined {
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
