import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginRedirectComponent } from './login-redirect.component';
import { Router } from '@angular/router';
import { AUTHENTICATION } from '../authentication';

describe('LoginRedirectComponent', () => {
  let component: LoginRedirectComponent;
  let fixture: ComponentFixture<LoginRedirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginRedirectComponent],
      providers: [
        {provide: AUTHENTICATION, useValue: {handleLoginCallback: () => Promise.resolve('/')}},
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
