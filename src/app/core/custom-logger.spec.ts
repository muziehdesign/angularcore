import { TestBed } from '@angular/core/testing';

import { CustomLogger } from './custom-logger';

describe('CustomLogger', () => {
  let service: CustomLogger;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomLogger);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
