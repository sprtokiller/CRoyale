import { TestBed } from '@angular/core/testing';

import { IngamesocketService } from './ingamesocket.service';

describe('IngamesocketService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IngamesocketService = TestBed.get(IngamesocketService);
    expect(service).toBeTruthy();
  });
});
