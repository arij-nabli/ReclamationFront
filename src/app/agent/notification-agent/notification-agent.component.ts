
import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../notification.service';
@Component({
  selector: 'app-notification-agent',
  templateUrl: './notification-agent.component.html',
  styleUrls: ['./notification-agent.component.css']
})
export class NotificationAgentComponent implements OnInit {
  showNotifications = false;
  unreadCount = 0;

  constructor(public notificationService: NotificationService) {}

  ngOnInit() {
    this.notificationService.notifications$.subscribe(notifications => {
      this.unreadCount = notifications.filter(n => !n.read).length;
    });
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  markAsRead(index: number) {
    this.notificationService.markAsRead(index);
  }

  clearAll() {
    this.notificationService.clearNotifications();
  }
}
