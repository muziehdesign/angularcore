import { TestBed } from '@angular/core/testing';
import { of, tap, throwError } from 'rxjs';
import { AUTHORIZATION_POLICY } from './authorization-policy';
import { AuthorizationService, NamespacedAuthorizationDataResponse } from './authorization.service';
import { Logger } from '../logger/logger';

describe('AuthorizationService', () => {
    let service: AuthorizationService;
    let loggerSpy: jasmine.SpyObj<Logger>;

    beforeEach(() => {
        loggerSpy = jasmine.createSpyObj<Logger>('Logger', ['error']);

        TestBed.configureTestingModule({
            providers: [
                AuthorizationService,
                { provide: AUTHORIZATION_POLICY, useValue: [] },
                { provide: Logger, useValue: loggerSpy },
            ],
        });
        service = TestBed.inject(AuthorizationService);
    });

    it('should register a source', () => {
        const source = of([]);
        service.register(source);

        expect(service['source']).toBe(source);
    });

    it('should get authorization data', async () => {
        const mockData = [
            { namespace: 'namespace1', data: { roles: [], permissions: ['namespace1.permission1'] } },
            { namespace: 'namespace2', data: { roles: [], permissions: ['namespace2.permission2'] } },
        ] satisfies NamespacedAuthorizationDataResponse[];
        service.register(of(mockData));

        const data = await service.getAuthorizationData();

        expect(data.get('namespace1')).toEqual({ roles: [], permissions: ['namespace1.permission1'] });
        expect(data.get('namespace2')).toEqual({roles: [], permissions: ['namespace2.permission2'] } );
    });

    it('should authorize a permission if it exists', async () => {
        const mockData = [
            { namespace: 'namespace1', data: { roles: [], permissions: ['namespace1.permission1'] } },
            { namespace: 'namespace2', data: { roles: [], permissions: ['namespace2.permission2'] } },
        ] satisfies NamespacedAuthorizationDataResponse[];
        service.register(of(mockData));

        const result = await service.authorize('namespace1.permission1');

        expect(result).toBeTrue();
    });

    it('should not authorize a permission if it does not exist', async () => {
        const mockData = [
            { namespace: 'namespace1', data: { roles: [], permissions: ['namespace1.permission1'] } },
            { namespace: 'namespace2', data: { roles: [], permissions: ['namespace2.permission2'] } },
        ] satisfies NamespacedAuthorizationDataResponse[];
        service.register(of(mockData));

        const result = await service.authorize('namespace1.permission2');

        expect(result).toBeFalse();
    });

    it('should handle empty data when authorizing', async () => {
        service.register(of([]));

        const result = await service.authorize('namespace1.permission1');

        expect(result).toBeFalse();
    });

    it('should bubble up error', async () => {
        service.register(throwError(()=>new Error('unit test testing')));
        await expectAsync(service.getAuthorizationData()).toBeRejectedWithError('unit test testing');
    });

    it('should not execute source until it is needed', async () => {
        const sourceSpy = jasmine.createSpy('sourceSpy');
        const source = of([]).pipe(
            tap(()=>{
                sourceSpy();
            })
        );
    
        service.register(source);
    
        // Ensure the source has not executed yet
        expect(sourceSpy).not.toHaveBeenCalled();
    
        // Trigger the source by calling getAuthorizationData
        const data = await service.getAuthorizationData();
    
        // Now the source should execute
        expect(sourceSpy).toHaveBeenCalled();
        expect(data.size).toBe(0); 
    });
});