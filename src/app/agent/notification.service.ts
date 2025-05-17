import { Injectable, OnDestroy } from '@angular/core';

import * as signalR from '@microsoft/signalr';

import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/authservice/auth.service';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class  NotificationService {
  private hubConnection!: signalR.HubConnection;
  public notifications$ = new BehaviorSubject<any[]>([]);
  public pendingClaimsCount$ = new BehaviorSubject<number>(0);

  constructor(private authService: AuthService) {
    this.buildConnection();
    this.startConnection();
  }

  private buildConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.notifUrl}/notificationHub`, {
        accessTokenFactory: () => this.authService.accessToken
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();
  }

  private startConnection() {
    this.hubConnection.start()
      .then(() => {
        console.log('Connection started');
        this.registerEvents();
      })
      .catch(err => console.log('Error while starting connection: ' + err));
  }

  private registerEvents() {
    // Nouvelle réclamation
    this.hubConnection.on('NewClaimNotification', (data) => {
      const notification = {
       
        message: `Nouvelle réclamation de type ${data.claimType} pour ${data.clientName}`,
        data: data,
        timestamp: new Date(data.timestamp),
        read: false
      };
      this.addNotification(notification);
    });

    // Réclamation assignée
    this.hubConnection.on('ClaimAssigned', (data) => {
      const notification = {
        type: 'claim-assigned',
        message: `Réclamation ${data.claimType} assignée par ${data.deciderName}`,
        data: data,
        timestamp: new Date(data.timestamp),
        read: false
      };
      this.addNotification(notification);
    });

    // Validation requise
    this.hubConnection.on('ValidationRequired', (data) => {
      const notification = {
        type: 'validation-required',
        message: `Validation requise pour réclamation ${data.claimType} par ${data.deciderName}`,
        data: data,
        timestamp: new Date(data.timestamp),
        read: false
      };
      this.addNotification(notification);
    });

    // Décision approuvée
    this.hubConnection.on('DecisionApproved', (data) => {
      const notification = {
        type: 'decision-approved',
        message: `Décision approuvée par ${data.validatorName}`,
        data: data,
        timestamp: new Date(data.timestamp),
        read: false
      };
      this.addNotification(notification);
    });

    // Décision rejetée
    this.hubConnection.on('DecisionRejected', (data) => {
      const notification = {
        type: 'decision-rejected',
        message: `Décision rejetée par ${data.validatorName}`,
        data: data,
        timestamp: new Date(data.timestamp),
        read: false
      };
      this.addNotification(notification);
    });

    // Traitement complété
    this.hubConnection.on('TreatmentCompleted', (data) => {
      const notification = {
        type: 'treatment-completed',
        message: `Traitement complété par ${data.treatmentResponsible}`,
        data: data,
        timestamp: new Date(data.timestamp),
        read: false
      };
      this.addNotification(notification);
    });

    // Réclamation clôturée
    this.hubConnection.on('ClaimClosed', (data) => {
      const notification = {
        type: 'claim-closed',
        message: `Réclamation ${data.status} par ${data.closedBy}`,
        data: data,
        timestamp: new Date(data.timestamp),
        read: false
      };
      this.addNotification(notification);
    });

    // Statut final
    this.hubConnection.on('ClaimFinalStatus', (data) => {
      const notification = {
        type: 'claim-final-status',
        message: data.message,
        data: data,
        timestamp: new Date(data.timestamp),
        read: false
      };
      this.addNotification(notification);
    });

    // Mise à jour du compteur de réclamations en attente
    this.hubConnection.on('UpdatePendingClaimsCount', (count) => {
      this.pendingClaimsCount$.next(count);
    });
  }

  private addNotification(notification: any) {
    const currentNotifications = this.notifications$.value;
    this.notifications$.next([notification, ...currentNotifications]);
    
    // Vous pouvez aussi ajouter une notification visuelle/toast ici
    this.showToast(notification);
  }

  private showToast(notification: any) {
    // Implémentez votre système de toast ici
    console.log('Notification:', notification.message);
    // Exemple avec une librairie de toast comme ngx-toastr
    // this.toastr.info(notification.message, 'Nouvelle notification');
  }

  public markAsRead(index: number) {
    const notifications = this.notifications$.value;
    if (notifications[index]) {
      notifications[index].read = true;
      this.notifications$.next([...notifications]);
    }
  }

  public clearNotifications() {
    this.notifications$.next([]);
  }
}