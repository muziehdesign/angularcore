import { EnvironmentProviders, FactoryProvider, InjectionToken, Injector, makeEnvironmentProviders, Optional, Provider } from '@angular/core';
import { INavigator, Log, StateStore, UserManager, UserManagerSettings } from 'oidc-client-ts';
import { AUTHENTICATION_OPTIONS, AuthenticationOptions } from './authentication-options';
import { AuthenticationService } from './authentication.service';
import { AuthorizationGuard } from './authorization.guard';
import { Logger } from '../logger/logger';
import { AuthorizationService } from './authorization.service';

export const OIDC_USER_MANAGER = new InjectionToken<UserManager>('OidcUserManager');

export const DEFAULT_USER_MANAGER_PROVIDER: FactoryProvider = {
    provide: OIDC_USER_MANAGER,
    useFactory: (options: AuthenticationOptions, logger: Logger) => {
        const map = new Map<string, number>();
        map.set('debug', Log.DEBUG);
        map.set('error', Log.ERROR);
        map.set('none', Log.NONE);
        map.set('warn', Log.WARN);
        map.set('info', Log.INFO);

        Log.setLevel(map.get(options.logLevel) || Log.NONE);
        Log.setLogger(logger);

        const settings = {
            authority: options.authority,
            client_id: options.clientId,
            response_type: options.responseType,
            scope: options.scope,
            redirect_uri: options.redirectUri,
            silent_redirect_uri: options.silentRedirectUri,
            post_logout_redirect_uri: options.postLogoutRedirectUri,
            automaticSilentRenew: options.automaticSilentRenew,
            checkSessionIntervalInSeconds: options.checkSessionInterval,
            accessTokenExpiringNotificationTimeInSeconds: options.accessTokenExpiringNotificationTime,
            filterProtocolClaims: options.filterProtocolClaims,
            loadUserInfo: options.loadUserInfo,
            monitorSession: options.monitorSession,
        } satisfies UserManagerSettings;
        return new UserManager(settings);
    },
    deps: [AUTHENTICATION_OPTIONS, Logger],
};

export function provideAuth(fn: (injector: Injector) => AuthenticationOptions): EnvironmentProviders {
    const providers: Provider[] = [
        {
            provide: OIDC_USER_MANAGER,
            useFactory: (injector: Injector, logger: Logger) => {
                const config = fn(injector);
                const map = new Map<string, number>();
                map.set('debug', Log.DEBUG);
                map.set('error', Log.ERROR);
                map.set('none', Log.NONE);
                map.set('warn', Log.WARN);
                map.set('info', Log.INFO);

                Log.setLevel(map.get(config.logLevel) || Log.NONE);
                Log.setLogger(logger);

                return createUserManager(fn(injector));
            },
            deps: [Injector, Logger],
        },
        AuthenticationService,
        AuthorizationService,
        AuthorizationGuard
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
    } satisfies UserManagerSettings;
    return new UserManager(settings, redirectNavigator, popupNavigator, iframeNavigator);
}
