import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Route, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { Location } from '@angular/common';

import { AuthorizationGuard } from './authorization.guard';
import { AuthenticationService } from './identityserver/authentication.service';
import { AuthorizationService } from './authorization/authorization.service';

describe('AuthorizationGuard', () => {
    let guard: AuthorizationGuard;
    let authenticationServiceSpy: jasmine.SpyObj<AuthenticationService>;
    let authorizationServiceSpy: jasmine.SpyObj<AuthorizationService>;
    let locationSpy: jasmine.SpyObj<Location>;

    beforeEach(() => {
        authenticationServiceSpy = jasmine.createSpyObj<AuthenticationService>('AuthenticationService', ['getSnapshot', 'signin', 'initialize', 'signinRedirect']);
        authorizationServiceSpy = jasmine.createSpyObj<AuthorizationService>('AuthorizationService', ['authorize']);
        locationSpy = jasmine.createSpyObj('Location', ['path']);

        TestBed.configureTestingModule({
            providers: [AuthorizationGuard, { provide: AuthenticationService, useValue: authenticationServiceSpy }, { provide: AuthorizationService, useValue: authorizationServiceSpy }, { provide: Location, useValue: locationSpy }],
        });
        guard = TestBed.inject(AuthorizationGuard);
    });

    it('should allow activation if authenticated and no policies are required', async () => {
        authenticationServiceSpy.initialize.and.returnValue(Promise.resolve());
        authenticationServiceSpy.getSnapshot.and.returnValue({ authenticated: true });
        const snapshot = new ActivatedRouteSnapshot();
        snapshot.data = { authorization: [] };

        const result = await guard.canActivate(snapshot, { url: '/test' } as RouterStateSnapshot);

        expect(result).toBeTrue();
        expect(authenticationServiceSpy.getSnapshot).toHaveBeenCalled();
        expect(authenticationServiceSpy.initialize).toHaveBeenCalled();
    });

    it('should allow matching if authenticated and no policies are required', async () => {
        authenticationServiceSpy.initialize.and.returnValue(Promise.resolve());
        authenticationServiceSpy.getSnapshot.and.returnValue({ authenticated: true });
        const route = {
            data: { authorization: [] },
        } satisfies Route;
        locationSpy.path.and.returnValue('/test');

        const result = await guard.canMatch(route, [] as UrlSegment[]);

        expect(result).toBeTrue();
        expect(authenticationServiceSpy.getSnapshot).toHaveBeenCalled();
        expect(authenticationServiceSpy.initialize).toHaveBeenCalled();
    });

    it('should allow activation if authenticated and policies are authorized', async () => {
        authenticationServiceSpy.initialize.and.returnValue(Promise.resolve());
        authenticationServiceSpy.getSnapshot.and.returnValue({ authenticated: true });
        authorizationServiceSpy.authorize.and.returnValue(Promise.resolve(true));
        const snapshot = new ActivatedRouteSnapshot();
        snapshot.data = { authorization: ['namespace1.permission1', 'namespace1.permission2'] };

        const result = await guard.canActivate(snapshot, { url: '/test' } as RouterStateSnapshot);

        expect(result).toBeTrue();
        expect(authenticationServiceSpy.getSnapshot).toHaveBeenCalled();
        expect(authorizationServiceSpy.authorize).toHaveBeenCalledTimes(2);
        expect(authenticationServiceSpy.initialize).toHaveBeenCalled();
    });

    it('should allow matching if authenticated and policies are authorized', async () => {
        authenticationServiceSpy.initialize.and.returnValue(Promise.resolve());
        authenticationServiceSpy.getSnapshot.and.returnValue({ authenticated: true });
        authorizationServiceSpy.authorize.and.returnValue(Promise.resolve(true));
        const route = {
            data: { authorization: ['namespace1.permission1', 'namespace1.permission2'] },
        } satisfies Route;
        locationSpy.path.and.returnValue('/test');

        const result = await guard.canMatch(route, [] as UrlSegment[]);

        expect(result).toBeTrue();
        expect(authenticationServiceSpy.getSnapshot).toHaveBeenCalled();
        expect(authorizationServiceSpy.authorize).toHaveBeenCalledTimes(2);
        expect(authenticationServiceSpy.initialize).toHaveBeenCalled();
    });

    it('should deny activation if not authenticated', async () => {
        authenticationServiceSpy.initialize.and.returnValue(Promise.resolve());
        authenticationServiceSpy.getSnapshot.and.returnValue({ authenticated: false });
        authenticationServiceSpy.signinRedirect.and.returnValue(Promise.resolve());

        const snapshot = new ActivatedRouteSnapshot();
        snapshot.data = { authorization: [] };
        const result = await guard.canActivate(snapshot, { url: '/test' } as RouterStateSnapshot);

        expect(result).toBeFalse();
        expect(authenticationServiceSpy.signinRedirect).toHaveBeenCalledWith('/test');
        expect(authenticationServiceSpy.initialize).toHaveBeenCalled();
        expect(authenticationServiceSpy.getSnapshot).toHaveBeenCalled();
    });

    it('should deny activation if authenticated but one policy is not authorized', async () => {
        authenticationServiceSpy.getSnapshot.and.returnValue({ authenticated: true });
        authorizationServiceSpy.authorize.and.callFake((policy: string) => {
            return Promise.resolve(policy === 'namespace1.permission1');
        });
        const snapshot = new ActivatedRouteSnapshot();
        snapshot.data = { authorization: ['namespace1.permission1', 'namespace1.permission2'] };

        const result = await guard.canActivate(snapshot, { url: '/test' } as RouterStateSnapshot);

        expect(result).toBeFalse();
        expect(authorizationServiceSpy.authorize).toHaveBeenCalledTimes(2);
    });
});
