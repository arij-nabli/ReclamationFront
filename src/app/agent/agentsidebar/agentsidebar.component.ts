import { Component, OnInit, OnDestroy } from '@angular/core';
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

  constructor(
    private authService: AuthService,
    private claimService: ClaimService
  ) {}

  ngOnInit(): void {
    this.loadCounts();
    // Vérifie toutes les 30 secondes
    this.refreshSubscription = interval(30000).subscribe(() => {
      this.checkNewClaims();
    });
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
  }
}