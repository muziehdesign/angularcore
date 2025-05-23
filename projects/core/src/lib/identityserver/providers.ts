import { FactoryProvider, InjectionToken, makeEnvironmentProviders, Optional, Provider } from "@angular/core";
import { INavigator, UserManager, UserManagerSettings } from "oidc-client-ts";
import { AUTHENTICATION_OPTIONS, AuthenticationOptions } from "./authentication-options";

export const OIDC_REDIRECT_NAVIGATOR = new InjectionToken<INavigator>('OidcRedirectNavigator');
export const OIDC_POPUP_NAVIGATOR = new InjectionToken<INavigator>('OidcPopupNavigator');
export const OIDC_IFRAME_NAVIGATOR = new InjectionToken<INavigator>('OidcIframeNavigator');
export const OIDC_USER_MANAGER = new InjectionToken<UserManager>('OidcUserManager');


export const USER_MANAGER_PROVIDER: FactoryProvider = {
    provide: OIDC_USER_MANAGER,
    useFactory: (options: AuthenticationOptions, oidcRedirectNavigator: INavigator, oidcPopupNavigator: INavigator, oidcIframeNavigator: INavigator) => {
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
            loadUserInfo: true,
            monitorSession: true,
        } satisfies UserManagerSettings;
        return new UserManager(settings, oidcRedirectNavigator, oidcPopupNavigator, oidcIframeNavigator);
    },
    deps: [AUTHENTICATION_OPTIONS, [new Optional(), OIDC_REDIRECT_NAVIGATOR], [new Optional(), OIDC_POPUP_NAVIGATOR], [new Optional(), OIDC_IFRAME_NAVIGATOR]]
};

// TODO: this still needs work
export function provideAuthentication(options: AuthenticationOptions) : Provider[] {
    return [
        USER_MANAGER_PROVIDER,
        {
            provide: AUTHENTICATION_OPTIONS,
            useValue: Object.freeze(options)
        }
        // {
        //     provide: OIDC_REDIRECT_NAVIGATOR,
        //     useValue: window
        // },
        // {
        //     provide: OIDC_POPUP_NAVIGATOR,
        //     useValue: window
        // },
        // {
        //     provide: OIDC_IFRAME_NAVIGATOR,
        //     useValue: window
        // }
    ];
};
