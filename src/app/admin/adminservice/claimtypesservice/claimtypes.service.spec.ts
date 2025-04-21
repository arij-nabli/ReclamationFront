import { TestBed } from '@angular/core/testing';

import { ClaimtypesService } from './claimtypes.service';

describe('ClaimtypesService', () => {
  let service: ClaimtypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClaimtypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
