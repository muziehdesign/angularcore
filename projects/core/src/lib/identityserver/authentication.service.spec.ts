import { TestBed } from '@angular/core/testing';
import { AuthenticationOptions } from './authentication-options';
import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
    let service: AuthenticationService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = new AuthenticationService({} as AuthenticationOptions);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
