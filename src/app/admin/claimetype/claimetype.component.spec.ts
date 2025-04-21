import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimetypeComponent } from './claimetype.component';

describe('ClaimetypeComponent', () => {
  let component: ClaimetypeComponent;
  let fixture: ComponentFixture<ClaimetypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClaimetypeComponent]
    });
    fixture = TestBed.createComponent(ClaimetypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
