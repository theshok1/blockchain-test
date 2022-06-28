import { TestBed } from '@angular/core/testing';

import { PageFilterService } from './page-filter.service';

describe('PageFilterService', () => {
  let service: PageFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PageFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
