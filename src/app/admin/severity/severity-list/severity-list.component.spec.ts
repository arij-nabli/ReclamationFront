import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeverityListComponent } from './severity-list.component';

describe('SeverityListComponent', () => {
  let component: SeverityListComponent;
  let fixture: ComponentFixture<SeverityListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SeverityListComponent]
    });
    fixture = TestBed.createComponent(SeverityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
