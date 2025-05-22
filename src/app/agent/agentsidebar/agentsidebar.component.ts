import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/authservice/auth.service';
import { ClaimService } from 'src/app/service/claim.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-agentsidebar',
  templateUrl: './agentsidebar.component.html',
  styleUrls: ['./agentsidebar.component.css']
})
export class AgentsidebarComponent implements OnInit, OnDestroy {
  // Compteurs
  pendingCount: number = 0;
  toValidateCount: number = 0;
  inTreatmentCount: number = 0;
  toCloseCount: number = 0;
  
  // Notifications
  newPendingClaims: boolean = false;
  newToValidateClaims: boolean = false;
  newInTreatmentClaims: boolean = false;
  newToCloseClaims: boolean = false;

  private refreshSubscription!: Subscription;
  private lastCheckTime: Date = new Date();

  agentName: string = '';
  profileImage: string = 'assets/default-profile.png';

  constructor(
    private authService: AuthService,
    private claimService: ClaimService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCounts();
    // Vérifie toutes les 30 secondes
    this.refreshSubscription = interval(1000).subscribe(() => {
      this.checkNewClaims();
    });

    // Récupérer les informations de l'agent connecté
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.agentName = `${currentUser.firstName} ${currentUser.lastName}`;
      // Si l'utilisateur a une photo de profil, l'utiliser
      if (currentUser.profileImage) {
        this.profileImage = currentUser.profileImage;
      }
    }
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  loadCounts(): void {
    const agentId = this.authService.getUserId();
    
  
  }

  checkNewClaims(): void {
  
  }

  resetNotifications(): void {
    this.newPendingClaims = false;
    this.newToValidateClaims = false;
    this.newInTreatmentClaims = false;
    this.newToCloseClaims = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}