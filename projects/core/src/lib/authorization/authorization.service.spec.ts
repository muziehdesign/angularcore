import { TestBed } from '@angular/core/testing';
import { AuthorizationService } from './authorization.service';
import { Subject } from 'rxjs';
import { AuthorizationData } from './authorization-data';
import { Logger } from '../logger/logger';

describe('AuthorizationService', () => {
    let service: AuthorizationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [],
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
        source1$.next({ roles: [], permissions: ['Namespace1.Permission1'] });
        source2$.next({ roles: [], permissions: ['Namespace2.Permission2'] });

        // act
        source1$.complete();
        source2$.complete();
        const authorized1 = await service.authorize('Namespace1.Permission1');
        const unauthorized1 = await service.authorize('Namespace1.Permission2');
        const authorized2 = await service.authorize('Namespace2.Permission2');
        const unauthorized2 = await service.authorize('Permission1');
        const data = await service.getAuthorizationData();

        // assert
        expect(data.size).toBe(2);
        expect(authorized1).toBeTrue();
        expect(authorized2).toBeTrue();
        expect(unauthorized1).toBeFalse();
        expect(unauthorized2).toBeFalse();
    });

    it('should swallow error from source', async () => {
        // arrange
        const source$ = new Subject<AuthorizationData>();
        service.register([{ namespace: 'PermissionsTest', request: source$.asObservable() }]);
        const error = new Error('unit test: should pass down error');
        source$.error(error);

        // act 
        const authorized = await service.authorize('PermissionsTest');
        const data = await service.getAuthorizationData();

        // assert
        expect(authorized).toBeFalse();
        expect(data.size).toBe(1);
    });

    it('should handle empty permissions', async () => {
        // arrange
        const source$ = new Subject<AuthorizationData>();
        service.register([{ namespace: 'EmptyPermissionsTest', request: source$.asObservable() }]);
        source$.next({ roles: [], permissions: [] });

        // act
        source$.complete();
        const authorized = await service.authorize('EmptyPermissionsTest.Permission1');
        const data = await service.getAuthorizationData();

        // assert
        expect(authorized).toBeFalse();
        expect(data.size).toBe(1);
        expect(data.get('EmptyPermissionsTest')).toEqual({ roles: [], permissions: [] });
    });
});
