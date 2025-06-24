import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginRedirectComponent } from './login-redirect.component';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';

describe('LoginRedirectComponent', () => {
  let component: LoginRedirectComponent;
  let fixture: ComponentFixture<LoginRedirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginRedirectComponent],
      providers: [
        {provide: AuthenticationService, useValue: {handleLoginCallback: () => Promise.resolve('/')}},
        {provide: Router, useValue: {navigateByUrl: () => Promise.resolve()}},
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
