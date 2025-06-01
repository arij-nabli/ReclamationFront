import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AgentserviceService } from 'src/app/admin/adminservice/agentservice/agentservice.service';
import { AuthService } from 'src/app/auth/authservice/auth.service';
import { Claim } from 'src/app/Models/Claim';
import { ClaimService } from 'src/app/service/claim.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; // Import DomSanitizer
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-decision-panel',
  templateUrl: './decision-panel.component.html',
  styleUrls: ['./decision-panel.component.css']
})
export class DecisionPanelComponent implements OnInit {
  claims: any[] = [];
  loading = false;
  loadingAgents = false;
  agentId: any;
  selectedClaim: any = null;
  showModal = false; // Gardé pour la compatibilité si utilisé ailleurs
  treatmentResponsibles: any[] = [];
  selectedResponsible: string = '';
  decisionComment: string = '';
  showDetailModal = false; // Potentiellement redondant si non utilisé
  showDecisionModal = false;
  showRejectionDetailsModal = false;
  pageSize = 5;
  currentPage = 0;
  length = 0;
  totalPages = 0;
  filteredClaims: any[] = []; // Initialiser comme tableau vide

  // --- Ajouts pour la modale d'aperçu ---
  showPreviewModal = false;
  previewFileUrl: SafeResourceUrl | string = ''; // Utiliser SafeResourceUrl pour les iframes
  previewFileName: string = '';
  previewFileType: 'image' | 'pdf' | 'other' = 'other';
  // --------------------------------------

  constructor(
    private snackBar: MatSnackBar,
    private claimService: ClaimService,
    private authService: AuthService,
    private agentService: AgentserviceService,
    private sanitizer: DomSanitizer // Injecter DomSanitizer
  ) {}

  ngOnInit(): void {
    this.agentId = this.authService.getUserId();
    this.loadClaims();
  }
  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'TreatmentByDecider':
      case 'TreatmentByTreatmentResponsible': return 'bg-blue-100 text-blue-800';
      case 'DecisionValidated': return 'bg-green-100 text-green-800';
       case 'Closed': return 'bg-green-600 text-green-100';
      case 'DecisionRejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
translateStatus(status: string): string {
  switch (status) {
     case 'Pending':
      return 'En attente';
    case 'TreatmentByDecider':
      return 'Traitement par le décideur';
    case 'DecisionValidated':
      return 'Décision validée';
    case 'Closed':
      return 'Fermée';
    case 'Rejected':
      return 'Rejetée';
    // Ajoute les autres statuts selon ta logique métier
    default:
      return status; // Affiche la valeur brute si aucune traduction trouvée
  }
}

  openModal(claim: any): void {
    this.selectedClaim = claim;
    this.showModal = true; // Gardé pour la compatibilité
    this.loadTreatmentResponsibles();
  }

  openRejectionDetailsModal(claim: any): void {
    this.selectedClaim = claim;
    this.showRejectionDetailsModal = true;
  }

  loadTreatmentResponsibles(mode: 'assigner' | 'changer' = 'assigner'): void {
    this.loadingAgents = true;
    this.agentService.getAgents().subscribe({
      next: (agents: any) => {
        this.treatmentResponsibles = agents?.$values || [];
        if (mode === 'changer') {
          this.treatmentResponsibles = this.treatmentResponsibles.filter(agent => 
            agent.id !== this.selectedClaim?.treatmentResponsibleId // Ajouter vérification null
          );
        }
        this.loadingAgents = false;
      },
      error: (err) => {
        console.error('Erreur chargement agents', err);
        this.snackBar.open('Erreur lors du chargement des agents', 'Fermer', { duration: 3000 });
        this.loadingAgents = false;
      }
    });
  }
  processDecision(isApproved: boolean): void {
    // Vérification que selectedClaim existe
    if (!this.selectedClaim || !this.selectedResponsible) {
      this.snackBar.open('Veuillez sélectionner un responsable de traitement', 'Fermer', { duration: 3000 });
      return;
    }
  
    const decisionText = isApproved 
      ? 'Réclamation approuvée' + (this.decisionComment ? ` - ${this.decisionComment}` : '')
      : 'Réclamation rejetée' + (this.decisionComment ? ` - ${this.decisionComment}` : '');
  
    this.claimService.processClaimByDecider(
      this.selectedClaim.id, // Maintenant protégé par la vérification
      this.agentId,
      this.selectedResponsible,
      decisionText
    ).subscribe({
      next: () => {
        this.snackBar.open(`Réclamation ${isApproved ? 'approuvée' : 'rejetée'} avec succès`, 'Fermer', { duration: 3000 });
        this.closeModals();
        this.loadClaims();
      },
      error: (err) => {
        console.error('Erreur traitement décision', err);
        this.snackBar.open('Erreur lors du traitement de la décision', 'Fermer', { duration: 3000 });
      }
    });
  }
  openDetailModal(claim: any): void {
    this.selectedClaim = claim;
    this.showDetailModal = true;
  }

  openDecisionModal(claim: any): void {
    this.selectedClaim = claim;
    this.showDecisionModal = true;
    this.loadTreatmentResponsibles();
  }
handlePreviewError(): void {
  this.previewFileType = 'other';
  this.snackBar.open('Impossible de charger l\'aperçu du fichier', 'Fermer', { duration: 3000 });
}
  
  openPreviewModal(file: any): void {
  // Assurez-vous que 'file.fileId' contient le GUID (ex: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx')
  if (!file || !file.fileId) {
    console.error('FileId is missing for preview');
    this.snackBar.open('Impossible d\'afficher l\'aperçu : ID du fichier manquant.', 'Fermer', { duration: 3000 });
    return;
  }

  this.previewFileName = file.fileName || 'Fichier inconnu';
  // Construire l'URL vers le backend
  const backendFileUrl  = `${environment.baseUrl}/File/${file.fileId}`;

  const fileExtension = (file.fileName || '').split('.').pop()?.toLowerCase();

  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp'].includes(fileExtension)) {
    this.previewFileType = 'image';
    this.previewFileUrl = backendFileUrl; // URL directe pour les images
  } else if (fileExtension === 'pdf') {
    this.previewFileType = 'pdf';
    this.previewFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(backendFileUrl); // Sécuriser pour iframe
  } else {
    this.previewFileType = 'other';
    this.previewFileUrl = backendFileUrl; // Pour le lien 'Ouvrir'
  }

  this.showPreviewModal = true;
}


private getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? `.${parts.pop()}` : '';
}

  closePreviewModal(): void {
    this.showPreviewModal = false;
    this.previewFileUrl = '';
    this.previewFileName = '';
    this.previewFileType = 'other';
  }
  // ----------------------------------------

  closeModals(): void {
    this.showDetailModal = false;
    this.showDecisionModal = false;
    this.showRejectionDetailsModal = false;
    this.closePreviewModal(); // S'assurer que la modale d'aperçu est aussi fermée
    this.selectedClaim = null;
    this.decisionComment = '';
    this.selectedResponsible = '';
  }

  // Inutile si showModal n'est plus utilisé pour la décision
  closeModal(): void {
    this.showModal = false;
    this.selectedResponsible = '';
    this.decisionComment = '';
    this.selectedClaim = null;
  }

  loadClaims(): void {
    this.loading = true;
    this.claimService.getPendingClaims(this.agentId).subscribe({
      next: (response: any) => {
        this.claims = response.$values || [];
        
        this.filteredClaims = [...this.claims];
        this.calculateTotalPages();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Erreur lors du chargement des réclamations', 'Fermer', { duration: 3000 });
      }
    });
  }

  get paginatedClaims(): Claim[] {
    const start = this.currentPage * this.pageSize;
    // S'assurer que filteredClaims est bien un tableau avant slice
    return Array.isArray(this.filteredClaims) ? this.filteredClaims.slice(start, start + this.pageSize) : [];
  }

  onPageSizeChange(): void {
    this.currentPage = 0; 
    this.calculateTotalPages();
  }

  calculateTotalPages(): void {
    // S'assurer que filteredClaims est bien un tableau
    const totalItems = Array.isArray(this.filteredClaims) ? this.filteredClaims.length : 0;
    this.totalPages = Math.ceil(totalItems / this.pageSize);
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
    }
  }

  goToFirstPage(): void {
    this.currentPage = 0;
  }

  goToLastPage(): void {
    this.currentPage = this.totalPages > 0 ? this.totalPages - 1 : 0;
  }

  getSeverityLabel(severity: any): string {
    if (!severity) return 'Non spécifiée';
    return `${severity.label} (Niveau ${severity.gravityCoefficient})`;
  }


}

