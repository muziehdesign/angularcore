import { EnvironmentProviders, FactoryProvider, inject, InjectionToken, Injector, makeEnvironmentProviders, Optional, provideAppInitializer, provideEnvironmentInitializer, Provider } from "@angular/core";
import { INavigator, StateStore, UserManager, UserManagerSettings } from "oidc-client-ts";
import { AUTHENTICATION_OPTIONS, AuthenticationOptions } from "./authentication-options";
import { AuthenticationService } from "./authentication.service";

export const OIDC_REDIRECT_NAVIGATOR = new InjectionToken<INavigator>('OidcRedirectNavigator');
export const OIDC_POPUP_NAVIGATOR = new InjectionToken<INavigator>('OidcPopupNavigator');
export const OIDC_IFRAME_NAVIGATOR = new InjectionToken<INavigator>('OidcIframeNavigator');
export const OIDC_USER_MANAGER = new InjectionToken<UserManager>('OidcUserManager');
export const OIDC_STATE_STORE = new InjectionToken<StateStore>('OidcStateStore');

export const DEFAULT_USER_MANAGER_PROVIDER: FactoryProvider = {
    provide: OIDC_USER_MANAGER,
    useFactory: (options: AuthenticationOptions, stateStore: StateStore, oidcRedirectNavigator: INavigator, oidcPopupNavigator: INavigator, oidcIframeNavigator: INavigator) => {
        const settings =  {
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
            stateStore: stateStore
        } satisfies UserManagerSettings;
        console.log('[AuthenticationService]Creating user manager with settings', settings);
        return new UserManager(settings, oidcRedirectNavigator, oidcPopupNavigator, oidcIframeNavigator);
    },
    deps: [AUTHENTICATION_OPTIONS, [new Optional(), OIDC_STATE_STORE], [new Optional(), OIDC_REDIRECT_NAVIGATOR], [new Optional(), OIDC_POPUP_NAVIGATOR], [new Optional(), OIDC_IFRAME_NAVIGATOR]]
};

export function provideAuthentication(configFn: (injector: Injector) => AuthenticationOptions) : EnvironmentProviders {
    const providers: Provider[] = [
        {
            provide: AUTHENTICATION_OPTIONS,
            useFactory: (injector: Injector) => {
                return configFn(injector);
            },
            deps: [Injector]
        },
        DEFAULT_USER_MANAGER_PROVIDER,
        AuthenticationService
    ];

    return makeEnvironmentProviders(providers);
};
