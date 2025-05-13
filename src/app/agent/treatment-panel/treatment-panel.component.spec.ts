import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatmentPanelComponent } from './treatment-panel.component';

describe('TreatmentPanelComponent', () => {
  let component: TreatmentPanelComponent;
  let fixture: ComponentFixture<TreatmentPanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TreatmentPanelComponent]
    });
    fixture = TestBed.createComponent(TreatmentPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
