import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationAgentComponent } from './notification-agent.component';

describe('NotificationAgentComponent', () => {
  let component: NotificationAgentComponent;
  let fixture: ComponentFixture<NotificationAgentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationAgentComponent]
    });
    fixture = TestBed.createComponent(NotificationAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
