import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/authservice/auth.service';
 
export interface Notification {
  id?: number;
  message: string;
  type: string;
  createdAt: Date;
  isRead: boolean;
  userId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private hubConnection?: signalR.HubConnection;
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();
  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();
  private refreshInterval: any;
  
  // URL de base de l'API
  private apiUrl = `${environment.baseUrl}/notifications`;
  
  constructor(private http: HttpClient, private auth: AuthService) {}
  
  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.notifUrl}/notificationHub`, {
        accessTokenFactory: () => this.getAuthToken()
      })
      .withAutomaticReconnect()
      .build();
      
    this.hubConnection
      .start()
      .then(() => {
        console.log('Connexion SignalR établie');
        console.log('Hub connection ID:', this.hubConnection?.connectionId);
        
        // Ajouter l'écouteur immédiatement après la connexion
        this.addReceiveNotificationListener();
        
        // Charger les notifications initiales après connexion établie
        const userId = this.auth.getUserId();
        if (userId) {
          this.loadNotifications(userId);
        }
        
        // Mettre en place un rechargement périodique comme solution de secours
        this.setupPeriodicRefresh();
      })
      .catch(err => console.error('Erreur lors de la connexion SignalR: ' + err));
      
    // Gérer la reconnexion
    this.hubConnection.onreconnected(() => {
      console.log('Reconnexion SignalR réussie');
      // Réenregistrer l'écouteur après reconnexion
      this.addReceiveNotificationListener();
      
      // Recharger les notifications après reconnexion
      const userId = this.auth.getUserId();
      if (userId) {
        this.loadNotifications(userId);
      }
    });
  }
  
  // Configurer un rechargement périodique comme solution de secours
  private setupPeriodicRefresh() {
    // Nettoyer l'intervalle existant si présent
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
    
    // Créer un nouvel intervalle de rechargement (toutes les 30 secondes)
    this.refreshInterval = setInterval(() => {
      console.log('Rechargement périodique des notifications');
      const userId = this.auth.getUserId();
      if (userId) {
        this.loadNotifications(userId);
      }
    }, 5000);
  }
  
  // Ajouter l'écouteur pour les notifications
  public addReceiveNotificationListener = () => {
    console.log('Ajout de l\'écouteur de notifications...');
    console.log('Méthodes disponibles sur le hub:', this.hubConnection);

    // Supprimer tous les écouteurs existants pour éviter les doublons
    this.hubConnection?.off('receivenotification');
    this.hubConnection?.off('ReceiveNotification');
    this.hubConnection?.off('Receivenotification');
    
    // Essayer d'écouter avec différentes casses
    this.hubConnection?.on('receivenotification', (data: any) => {
      console.log('Notification reçue via receivenotification:', data);
      this.processNotification(data);
    });
    
    this.hubConnection?.on('ReceiveNotification', (data: any) => {
      console.log('Notification reçue via ReceiveNotification:', data);
      this.processNotification(data);
    });
    
    // Ajouter un écouteur pour tous les messages (debug)
    // Note: Ceci est une solution de contournement et peut ne pas fonctionner avec toutes les versions de SignalR
    try {
      const originalOn = this.hubConnection?.on;
      if (originalOn && this.hubConnection) {
        this.hubConnection.on = function(methodName: string, newMethod: (...args: any[]) => void) {
          console.log(`Enregistrement de l'écouteur pour la méthode: ${methodName}`);
          if (methodName !== '*') {
            originalOn.call(this, methodName, (...args: any[]) => {
              console.log(`Méthode appelée: ${methodName}`, args);
              newMethod(...args);
            });
          }
          return this;
        };
      }
    } catch (error) {
      console.error('Erreur lors de la mise en place de l\'écouteur générique:', error);
    }
  };
  
  // Traiter une notification reçue
private processNotification(data: any) {
  // Recharge TOUTES les notifications à chaque fois ❌ (peu performant)
  const userId = this.auth.getUserId();
  if (userId) {
    this.loadNotifications(userId);
    this.loadUnreadNotifications(userId);
  }
}
  
  // Charger les notifications depuis l'API
  public loadNotifications(userId: string): void {
    if (!userId) return;
    
    
    this.http.get<any>(`${this.apiUrl}/user/${userId}`)
      .subscribe({
        next: (response) => {
          console.log('Réponse API notifications:', response);
          const notifications = response.$values || response || [];
          
          const normalizedNotifications = notifications.map((n: any) => ({
            id: n.id,
            message: n.message,
            type: n.type || 'Info',
            createdAt: typeof n.createdAt === 'string' ? new Date(n.createdAt) : n.createdAt,
            isRead: n.isRead || false,
            userId: n.userId
          }));
          
          console.log('Notifications normalisées:', normalizedNotifications);
          this.notificationsSubject.next(normalizedNotifications);
          this.updateUnreadCount();
        },
        error: (error) => {
          console.error('Error loading notifications:', error);
        }
      });
  }
  
  // Charger uniquement les notifications non lues
  public loadUnreadNotifications(userId: string): void {
    if (!userId) return;
    
    this.http.get<any>(`${this.apiUrl}/unread/${userId}`)
      .subscribe({
        next: (response) => {
          console.log('Réponse API notifications non lues:', response);
          
          // Extraire le tableau de notifications de la réponse
          let notifications: any[] = [];
          if (response && response.$values) {
            notifications = response.$values;
          } else if (Array.isArray(response)) {
            notifications = response;
          } else {
            console.warn('Format de réponse inattendu pour les notifications non lues:', response);
            notifications = [];
          }
          
          // Convertir les dates de string à Date
          notifications.forEach((n: any) => {
            if (typeof n.createdAt === 'string') {
              n.createdAt = new Date(n.createdAt);
            }
          });
          
          // Mettre à jour le compteur
          this.unreadCountSubject.next(notifications.length);
          console.log('Nombre de notifications non lues:', notifications.length);
        },
        error: (error) => {
          console.error('Erreur lors du chargement des notifications non lues:', error);
        }
      });
  }
  
  // Marquer une notification comme lue
  public markAsRead(notificationId: number): Observable<any> {
    const result = this.http.put(`${this.apiUrl}/read/${notificationId}`, {});
    
    result.subscribe({
      next: () => {
        const currentNotifications = this.notificationsSubject.value;
        const updatedNotifications = currentNotifications.map(n => 
          n.id === notificationId ? { ...n, isRead: true } : n
        );
        this.notificationsSubject.next(updatedNotifications);
        this.updateUnreadCount();
      },
      error: (error) => {
        console.error('Erreur lors du marquage de la notification comme lue:', error);
      }
    });
    
    return result;
  }
  
  // Marquer toutes les notifications comme lues
  public markAllAsRead(userId: string): Observable<any> {
    const result = this.http.put(`${this.apiUrl}/read-all/${userId}`, {});
    
    result.subscribe({
      next: () => {
        const currentNotifications = this.notificationsSubject.value;
        const updatedNotifications = currentNotifications.map(n => ({ ...n, isRead: true }));
        this.notificationsSubject.next(updatedNotifications);
        this.unreadCountSubject.next(0);
      },
      error: (error) => {
        console.error('Erreur lors du marquage de toutes les notifications comme lues:', error);
      }
    });
    
    return result;
  }
  
  // Supprimer une notification
  public deleteNotification(notificationId: number): Observable<any> {
    const result = this.http.delete(`${this.apiUrl}/${notificationId}`);
    
    result.subscribe({
      next: () => {
        const currentNotifications = this.notificationsSubject.value;
        const updatedNotifications = currentNotifications.filter(n => n.id !== notificationId);
        this.notificationsSubject.next(updatedNotifications);
        this.updateUnreadCount();
      },
      error: (error) => {
        console.error('Erreur lors de la suppression de la notification:', error);
      }
    });
    
    return result;
  }
  
  // Supprimer toutes les notifications d'un utilisateur
  public deleteAllNotifications(userId: string): Observable<any> {
    const result = this.http.delete(`${this.apiUrl}/user/${userId}`);
    
    result.subscribe({
      next: () => {
        this.notificationsSubject.next([]);
        this.unreadCountSubject.next(0);
      },
      error: (error) => {
        console.error('Erreur lors de la suppression de toutes les notifications:', error);
      }
    });
    
    return result;
  }
  
  // Envoyer une notification à un utilisateur spécifique
  public sendNotificationToUser(userId: string, message: string, type: string = 'Info'): Observable<any> {
    const request = {
      message: message,
      type: type,
      userId: userId,
      toAll: false
    };
    
    return this.http.post(`${this.apiUrl}/send`, request);
  }
  
  // Envoyer une notification à tous les utilisateurs
  public sendNotificationToAll(message: string, type: string = 'Info'): Observable<any> {
    const request = {
      message: message,
      type: type,
      toAll: true
    };
    
    return this.http.post(`${this.apiUrl}/send`, request);
  }
  
  // Envoyer une notification à un groupe
  public sendNotificationToGroup(groupName: string, message: string, type: string = 'Info'): Observable<any> {
    const request = {
      message: message,
      type: type,
      groupName: groupName,
      toAll: false
    };
    
    return this.http.post(`${this.apiUrl}/send`, request);
  }
  
  // Mettre à jour le compteur de notifications non lues
  private updateUnreadCount(): void {
    const unreadCount = this.notificationsSubject.value.filter(n => !n.isRead).length;
    this.unreadCountSubject.next(unreadCount);
  }
  
  // Récupérer le token d'authentification
  private getAuthToken(): string {
    // Récupérer le token JWT depuis le localStorage ou un service d'authentification
    return localStorage.getItem('auth_token') || '';
  }
  
  // Nettoyer les ressources lors de la destruction du service
  public ngOnDestroy(): void {
    // Arrêter le rechargement périodique
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
    
    // Fermer la connexion SignalR
    if (this.hubConnection) {
      this.hubConnection.stop().catch(err => {
        console.error('Erreur lors de la fermeture de la connexion SignalR:', err);
      });
    }
  }
}
