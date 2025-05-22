import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-agent-dashboard',
  templateUrl: './agent-dashboard.component.html',
  styleUrls: ['./agent-dashboard.component.css']
})
export class AgentDashboardComponent implements OnInit {
  
  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    // Test des notifications après 2 secondes
    setTimeout(() => {
      this.notificationService.testNotification();
    }, 2000);
  }
}
