import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService, Notification } from '../notification.service';
import { AuthService } from 'src/app/auth/authservice/auth.service';

@Component({
  selector: 'app-notification-agent',
  templateUrl: './notification-agent.component.html'
})
export class NotificationAgentComponent  implements OnInit, OnDestroy {
  showNotifications = false;
  notifications: Notification[] = [];
  unreadCount = 0;
  userId: string | null = null;
  
  private subscriptions = new Subscription();

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

 ngOnInit(): void {
  this.userId = this.authService.getUserId();
  if (!this.userId) return;

  // Une seule initialisation
  this.notificationService.startConnection();
  
  // Chargement initial
  this.notificationService.loadNotifications(this.userId);

  // Abonnement aux mises à jour
  this.subscriptions.add(
    this.notificationService.notifications$.subscribe(notifs => {
      this.notifications = notifs;
      this.unreadCount = notifs.filter(n => !n.isRead).length;
    })
  );
}



  private loadNotifications(): void {
    if (this.userId) {
      this.notificationService.loadNotifications(this.userId);
    }
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    // Recharger les notifications à chaque ouverture pour être sûr d'avoir les dernières
    if (this.showNotifications) {
      this.loadNotifications();
    }
  }

  markAsRead(notification: Notification): void {
    if (notification.id && this.userId) {
      this.notificationService.markAsRead(notification.id);
      // Mettre à jour localement pour un feedback immédiat
      notification.isRead = true;
      this.unreadCount = this.notifications.filter(n => !n.isRead).length;
    }
  }

  getNotificationIcon(type: string): string {
    switch(type.toLowerCase()) {
      case 'success': return '✓';
      case 'warning': return '⚠️';
      case 'error': return '✕';
      case 'newclaim': return '📢';
      default: return 'ℹ️';
    }
  }
private refreshInterval: any;

// Ajouter dans ngOnDestroy()
ngOnDestroy() {
  if (this.refreshInterval) {
    clearInterval(this.refreshInterval);
  }
}
}
