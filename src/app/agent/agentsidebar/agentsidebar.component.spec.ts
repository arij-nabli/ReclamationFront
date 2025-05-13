import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentsidebarComponent } from './agentsidebar.component';

describe('AgentsidebarComponent', () => {
  let component: AgentsidebarComponent;
  let fixture: ComponentFixture<AgentsidebarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgentsidebarComponent]
    });
    fixture = TestBed.createComponent(AgentsidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
