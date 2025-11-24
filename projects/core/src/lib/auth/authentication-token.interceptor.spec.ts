import { TestBed } from '@angular/core/testing';

import { AuthenticationTokenInterceptor } from './authentication-token.interceptor';
import { AUTHENTICATION } from './authentication';

describe('AuthenticationTokenInterceptor', () => {
    beforeEach(() => {
        let authenticationService = jasmine.createSpyObj("Authentication", ['getUser', 'interceptSilentRedirect']);
        TestBed.configureTestingModule({
            providers: [AuthenticationTokenInterceptor, { provide: AUTHENTICATION, useValue: authenticationService }],
        });
    });

    it('should be created', () => {
        const interceptor: AuthenticationTokenInterceptor = TestBed.inject(AuthenticationTokenInterceptor);
        expect(interceptor).toBeTruthy();
    });
});
