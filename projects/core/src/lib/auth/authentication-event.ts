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
