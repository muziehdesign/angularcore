import { EnvironmentProviders, FactoryProvider, inject, InjectionToken, Injector, makeEnvironmentProviders, Optional, provideAppInitializer, provideEnvironmentInitializer, Provider } from '@angular/core';
import { INavigator, Log, StateStore, UserManager, UserManagerSettings } from 'oidc-client-ts';
import { AUTHENTICATION_OPTIONS, AuthenticationOptions } from './authentication-options';
import { AuthenticationService } from './authentication.service';
import { AuthorizationGuard } from '../authorization.guard';
import { Logger } from '../logger/logger';

export const OIDC_REDIRECT_NAVIGATOR = new InjectionToken<INavigator>('OidcRedirectNavigator');
export const OIDC_POPUP_NAVIGATOR = new InjectionToken<INavigator>('OidcPopupNavigator');
export const OIDC_IFRAME_NAVIGATOR = new InjectionToken<INavigator>('OidcIframeNavigator');
export const OIDC_USER_MANAGER = new InjectionToken<UserManager>('OidcUserManager');
export const OIDC_STATE_STORE = new InjectionToken<StateStore>('OidcStateStore');

export const DEFAULT_USER_MANAGER_PROVIDER: FactoryProvider = {
    provide: OIDC_USER_MANAGER,
    useFactory: (options: AuthenticationOptions, logger: Logger, stateStore: StateStore, oidcRedirectNavigator: INavigator, oidcPopupNavigator: INavigator, oidcIframeNavigator: INavigator) => {
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
            userStore: stateStore,
            stateStore: stateStore,
        } satisfies UserManagerSettings;
        return new UserManager(settings, oidcRedirectNavigator, oidcPopupNavigator, oidcIframeNavigator);
    },
    deps: [AUTHENTICATION_OPTIONS, Logger, [new Optional(), OIDC_STATE_STORE], [new Optional(), OIDC_REDIRECT_NAVIGATOR], [new Optional(), OIDC_POPUP_NAVIGATOR], [new Optional(), OIDC_IFRAME_NAVIGATOR]],
};

export function provideAuthentication(configFn: (injector: Injector) => AuthenticationOptions): EnvironmentProviders {
    const providers: Provider[] = [
        {
            provide: AUTHENTICATION_OPTIONS,
            useFactory: (injector: Injector) => {
                return configFn(injector);
            },
            deps: [Injector],
        },
        DEFAULT_USER_MANAGER_PROVIDER,
        AuthenticationService,
        AuthorizationGuard,
    ];

    return makeEnvironmentProviders(providers);
}
