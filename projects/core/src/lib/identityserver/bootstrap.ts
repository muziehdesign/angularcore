import { UserManager, UserManagerSettings } from 'oidc-client';
import { AuthenticationOptions } from './authentication-options';

export const bootstrapUserManager = (settings: AuthenticationOptions) => {
    const userManager = new UserManager({
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
    return userManager;
};
