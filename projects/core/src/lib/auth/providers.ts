import { EnvironmentProviders, InjectionToken, Injector, makeEnvironmentProviders, Provider } from '@angular/core';
import { INavigator, Log, StateStore, UserManager, UserManagerSettings } from 'oidc-client-ts';
import { AUTHENTICATION_OPTIONS, AuthenticationOptions } from './authentication-options';
import { AuthenticationService } from './authentication.service';
import { AuthorizationGuard } from './authorization.guard';
import { Logger } from '../logger/logger';
import { AuthorizationService } from './authorization.service';

export const OIDC_USER_MANAGER = new InjectionToken<UserManager>('OidcUserManager');

export function provideAuth(getConfigFn: (injector: Injector) => AuthenticationOptions, extra? : { userManager?: (injector: Injector) => UserManager, authorizationGuard?: Provider}): EnvironmentProviders {
    const providers: Provider[] = [
        {
            provide: AUTHENTICATION_OPTIONS,
            useFactory: (injector: Injector) => getConfigFn(injector),
            deps: [Injector],
        },
        {
            provide: OIDC_USER_MANAGER,
            useFactory: (injector: Injector, logger: Logger) => {
                const config = getConfigFn(injector);
                const map = new Map<string, number>();
                map.set('debug', Log.DEBUG);
                map.set('error', Log.ERROR);
                map.set('none', Log.NONE);
                map.set('warn', Log.WARN);
                map.set('info', Log.INFO);

                Log.setLevel(map.get(config.logLevel) || Log.NONE);
                Log.setLogger(logger);

                return extra?.userManager ? extra.userManager(injector) : createUserManager(config);
            },
            deps: [Injector, Logger],
        },
        AuthenticationService,
        AuthorizationService,
        extra?.authorizationGuard || AuthorizationGuard
    ];

    return makeEnvironmentProviders(providers);
}

export function createUserManager(config: AuthenticationOptions, stateStore?: StateStore, redirectNavigator?: INavigator, popupNavigator?: INavigator, iframeNavigator?: INavigator): UserManager {
    const settings = {
        authority: config.authority,
        client_id: config.clientId,
        response_type: config.responseType,
        scope: config.scope,
        redirect_uri: config.redirectUri,
        silent_redirect_uri: config.silentRedirectUri,
        post_logout_redirect_uri: config.postLogoutRedirectUri,
        automaticSilentRenew: config.automaticSilentRenew,
        checkSessionIntervalInSeconds: config.checkSessionInterval,
        accessTokenExpiringNotificationTimeInSeconds: config.accessTokenExpiringNotificationTime,
        filterProtocolClaims: config.filterProtocolClaims,
        loadUserInfo: config.loadUserInfo,
        monitorSession: config.monitorSession,
        userStore: stateStore,
        stateStore: stateStore,
        revokeTokensOnSignout: config.revokeTokensOnSignout,
    } satisfies UserManagerSettings;
    return new UserManager(settings, redirectNavigator, popupNavigator, iframeNavigator);
}
