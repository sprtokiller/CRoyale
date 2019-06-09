import { TestBed } from '@angular/core/testing';

import { CestyService } from './cesty.service';

describe('CestyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CestyService = TestBed.get(CestyService);
    expect(service).toBeTruthy();
  });
});
 