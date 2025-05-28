// identityserver
export { AuthenticationOptions, AUTHENTICATION_OPTIONS } from './lib/identityserver/authentication-options';
export { AuthenticationService, AuthenticationStateData } from './lib/identityserver/authentication.service';
export { AuthenticatedUser } from './lib/identityserver/authenticated-user';
export { AuthenticationTokenInterceptor, AUTHENTICATED_REQUEST } from './lib/identityserver/authentication-token.interceptor';
export { AuthenticationGuard } from './lib/identityserver/authentication.guard';
export { authenticationRoutes } from './lib/identityserver/authentication.routes';
// authorization
export { AuthorizationService } from './lib/authorization/authorization.service';
export { AuthorizationContext, AuthorizationPolicy, AUTHORIZATION_POLICY, PermissionAuthorizationPolicy } from './lib/authorization/authorization-policy';
export { AuthorizationData } from './lib/authorization/authorization-data';
export { requireAuthorization } from './lib/authorization/authorized.guard';
export { AuthorizationGuard } from './lib/authorization.guard';
// logger
export { LOGGER } from './lib/logger/logger.token';
export { Logger, BaseLogger, LogLevel, LOG_LEVELS } from './lib/logger/logger';
// functions
export { loadConfigurations, ServiceOptions, BuildOptions, AppConfiguration } from './lib/utilities';
export { State } from './lib/state';
// pipes
export { TruncatedCountPipe } from './lib/pipes/truncated-count.pipe';
// tokens
export { WINDOW } from './lib/window.token';
// shapes
export { List, Paged, Search, SearchModel, Auditable, Subject, AuditableModel, SubjectModel } from './lib/shapes';

export { UnexpectedError } from './lib/errors';
export { OperationResource, OperationResult, OperationStatus } from './lib/operation-resource';

export { provideAuthentication, OIDC_IFRAME_NAVIGATOR, OIDC_POPUP_NAVIGATOR, OIDC_REDIRECT_NAVIGATOR, OIDC_USER_MANAGER } from './lib/identityserver/providers';