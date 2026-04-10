import { TestBed } from '@angular/core/testing';
import { UserManager, User, UserManagerEvents } from 'oidc-client-ts';
import { AuthenticationService } from './authentication.service';
import { Logger } from '../logger/logger';
import { OIDC_USER_MANAGER } from './providers';

describe('AuthenticationService', () => {
    let service: AuthenticationService;
    let userManagerSpy: jasmine.SpyObj<UserManager>;
    let loggerSpy: jasmine.SpyObj<Logger>;

    beforeEach(() => {
        userManagerSpy = jasmine.createSpyObj<UserManager>('UserManager',
            ['signinSilent', 'signinRedirect', 'getUser', 'clearStaleState'],
            {events: jasmine.createSpyObj<UserManagerEvents>('UserManagerEvents', ['addAccessTokenExpired', 'addAccessTokenExpiring', 'addUserSessionChanged', 'addUserLoaded', 'addUserUnloaded', 'addSilentRenewError', 'addUserSignedOut'])}
        );
        loggerSpy = jasmine.createSpyObj<Logger>('Logger', ['debug', 'error']);

        TestBed.configureTestingModule({
            providers: [
                AuthenticationService,
                { provide: Logger, useValue: loggerSpy },
                { provide: OIDC_USER_MANAGER, useValue: userManagerSpy }],
        });
        service = TestBed.inject(AuthenticationService);
    });

    describe('should sign in silent', () => {
        it('should return undefined if user is not authenticated', async () => {
             userManagerSpy.signinSilent.and.returnValue(Promise.resolve(null));
            const result = await service.signinSilent();
            expect(result).toBeUndefined();
        });

        it('should return authenticated user', async () => {
            const fakeUser = new User({
                token_type: 'Bearer',
                access_token: 'fake access token',
                profile: {
                    sub: '1234567890',
                    name: 'John Doe',
                    iss: 'iss',
                    aud: 'aud',
                    upn: 'unittestjohndoe',
                    idp: 'unittest',
                    exp: Math.floor(Date.now() / 1000) + 3600,
                    iat: Math.floor(Date.now() / 1000)
                }
            });
            userManagerSpy.signinSilent.and.returnValue(Promise.resolve(fakeUser));

            const result = await service.signinSilent();
            expect(result?.subjectId).toBe('1234567890');
            expect(result?.name).toBe('John Doe');
            expect(result?.username).toBe('unittestjohndoe');
            expect(result?.provider).toBe('unittest');
            expect(userManagerSpy.signinSilent).toHaveBeenCalled();
        });
    });

    it('should perform signinRedirect', async () => {
        userManagerSpy.signinRedirect.and.returnValue(Promise.resolve());

        const result = await service.signinRedirect('/return-url');
        expect(userManagerSpy.signinRedirect).toHaveBeenCalledWith({ state: '/return-url', extraQueryParams: undefined });
    });

    it('should initialize', async () => {
        userManagerSpy.signinSilent.and.returnValue(Promise.resolve(null));

        await service.initialize();
        expect(userManagerSpy.signinSilent).toHaveBeenCalled();
    });

    it('should only initialize once', async () => {
        userManagerSpy.signinSilent.and.returnValue(Promise.resolve(null));

        await service.initialize();
        await service.initialize();
        expect(userManagerSpy.signinSilent).toHaveBeenCalledTimes(1);
    });
});
