import { TestBed } from '@angular/core/testing';
import { AuthenticationGuard } from './authentication.guard';
import { AuthenticationService } from './authentication.service';
import { Location } from '@angular/common';


describe('AuthenticationGuard', () => {
  let guard: AuthenticationGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[
        AuthenticationGuard,
        { provide: AuthenticationService, useValue: { login: () => Promise.resolve(true), getSnapshot: () => ({ authenticated: false }) } },
        { provide: Location, useValue: { path: () => '/' } },
      ]
    });
    guard = TestBed.inject(AuthenticationGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
