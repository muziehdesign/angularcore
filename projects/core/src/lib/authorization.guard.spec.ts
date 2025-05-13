import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { of } from 'rxjs';

import { AuthorizationGuard } from './authorization.guard';
import { AuthenticationService } from './identityserver/authentication.service';
import { AuthorizationService } from '../public-api';
import { Location } from '@angular/common';

describe('AuthorizationGuard', () => {
    let guard: AuthorizationGuard;
    let authenticationServiceSpy: jasmine.SpyObj<AuthenticationService>;
    let authorizationServiceSpy: jasmine.SpyObj<AuthorizationService>;
    let locationSpy: jasmine.SpyObj<Location>;

    beforeEach(() => {
        authenticationServiceSpy = jasmine.createSpyObj('AuthenticationService', ['getSnapshot', 'login']);
        authorizationServiceSpy = jasmine.createSpyObj('AuthorizationService', ['authorize']);
        locationSpy = jasmine.createSpyObj('Location', ['path']);

        TestBed.configureTestingModule({
            providers: [AuthorizationGuard, { provide: AuthenticationService, useValue: authenticationServiceSpy }, { provide: AuthorizationService, useValue: authorizationServiceSpy }, { provide: Location, useValue: locationSpy }],
        });
        guard = TestBed.inject(AuthorizationGuard);
    });

    it('should allow activation if authenticated and no policies are required', async () => {
        authenticationServiceSpy.getSnapshot.and.returnValue({ authenticated: true });
        const snapshot = new ActivatedRouteSnapshot();
        snapshot.data = { authorization: [] };

        const result = await guard.canActivate(snapshot, { url: '/test' } as RouterStateSnapshot);

        expect(result).toBeTrue();
        expect(authenticationServiceSpy.getSnapshot).toHaveBeenCalled();
    });

    it('should deny activation if not authenticated and login fails', async () => {
        authenticationServiceSpy.getSnapshot.and.returnValue({ authenticated: false });
        authenticationServiceSpy.login.and.returnValue(Promise.resolve(false));

        const snapshot = new ActivatedRouteSnapshot();
        snapshot.data = { authorization: [] };
        const result = await guard.canActivate(snapshot, { url: '/test' } as RouterStateSnapshot);

        expect(result).toBeFalse();
        expect(authenticationServiceSpy.login).toHaveBeenCalledWith('/test');
    });

    it('should allow activation if authenticated and policies are authorized', async () => {
        authenticationServiceSpy.getSnapshot.and.returnValue({ authenticated: true });
        authorizationServiceSpy.authorize.and.returnValue(Promise.resolve(true));
        const snapshot = new ActivatedRouteSnapshot();
        snapshot.data = { authorization: ['namespace1.permission1', 'namespace1.permission2'] };

        const result = await guard.canActivate(snapshot, { url: '/test' } as RouterStateSnapshot);

        expect(result).toBeTrue();
        expect(authorizationServiceSpy.authorize).toHaveBeenCalledTimes(2);
    });
});
