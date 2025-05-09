import { TestBed } from '@angular/core/testing';
import { AUTHORIZATION_POLICY } from './authorization-policy';

import { AuthorizationService } from './authorization.service';
import { Subject } from 'rxjs';
import { AuthorizationData } from './authorization-data';

describe('AuthorizationService', () => {
    let service: AuthorizationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: AUTHORIZATION_POLICY, useValue: [] }],
        });
        service = TestBed.inject(AuthorizationService);
    });

    it('should authorize', async () => {
        // arrange
        const source1$ = new Subject<AuthorizationData>();
        const source2$ = new Subject<AuthorizationData>();
        service.register([
            { namespace: 'Namespace1', request: source1$.asObservable() },
            { namespace: 'Namespace2', request: source2$.asObservable() },
        ]);

        // act
        source1$.next({ roles: [], permissions: ['Namespace1.Permission1'] });
        source2$.next({ roles: [], permissions: ['Namespace2.Permission2'] });
        source1$.complete();
        source2$.complete();
        const authorized1 = await service.authorize('Namespace1.Permission1');
        const authorized2 = await service.authorize('Namespace2.Permission2');
        const unauthorized1 = await service.authorize('Namespace1.Permission2');
        const unauthorized2 = await service.authorize('Permission1');

        // assert
        expect(authorized1).toBeTrue();
        expect(authorized2).toBeTrue();
        expect(unauthorized1).toBeFalse();
        expect(unauthorized2).toBeFalse();
    });

    it('should wait for responses to authorize', async()=>{
        // arrange
        const source$ = new Subject<AuthorizationData>();
        service.register([{ namespace: 'Namespace1', request: source$.asObservable() }]);

        // act

   });

    it('should handle empty permissions', async () => {
        // arrange
        const source$ = new Subject<AuthorizationData>();
        service.register([{ namespace: 'EmptyPermissionsTest', request: source$.asObservable() }]);

        // act
        source$.next({ roles: [], permissions: [] });
        source$.complete();
        const authorized = await service.authorize('EmptyPermissionsTest.Permission1');

        // assert
        expect(authorized).toBeFalse();
    });

    it('should handle errors in request observables', async () => {
        // arrange
        const source$ = new Subject<AuthorizationData>();
        service.register([{ namespace: 'ErrorTest', request: source$.asObservable() }]);

        // act & assert
        source$.error(new Error('Test error'));
        await expectAsync(service.authorizeWhenReady('ErrorTest.Permission1')).toBeRejectedWithError('Test error');
    });
});
