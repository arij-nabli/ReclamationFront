import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/authservice/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClaimService } from 'src/app/service/claim.service';
import { AgentserviceService } from 'src/app/admin/adminservice/agentservice/agentservice.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; // Import DomSanitizer
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-validation-decision',
  templateUrl: './validation-decision.component.html',
  styleUrls: ['./validation-decision.component.css']
})
export class ValidationDecisionComponent implements OnInit {
  decisions: any[] = [];
  loading = false;
  selectedClaim: any = null;
  showDetailModal = false; // Potentiellement redondant si non utilisé
  showValidationModal = false;
  validationComment = '';
  agentId: any;
  treatmentResponsibleName: string = 'Chargement...';
  treatmentResponsibleEmail: string = '';
  selectedResponsible: any = null; // Gardé pour la compatibilité si utilisé ailleurs
  treatmentResponsibles: any[] = []; // Gardé pour la compatibilité si utilisé ailleurs
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
    private decisionService: ClaimService,
    private authService: AuthService,
    private agentService: AgentserviceService,
    private sanitizer: DomSanitizer // Injecter DomSanitizer
  ) {}

  ngOnInit(): void {
    this.agentId = this.authService.getUserId();
    this.loadDecisions();
    // this.loadTreatmentResponsibles(); // Probablement inutile ici si non utilisé dans la modale de validation
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

  loadDecisions(): void {
    this.loading = true;
    // Assurez-vous que cet appel API inclut bien les 'fileClaims' dans la réponse
    this.decisionService.getClaimsToValidate(this.agentId).subscribe({
      next: (response: any) => {
        this.decisions = response.$values || [];
      
        this.filteredClaims = [...this.decisions];
        this.calculateTotalPages();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Erreur lors du chargement des décisions', 'Fermer', { duration: 3000 });
      }
    });
  }

  get paginatedClaims(): any[] {
    const startIndex = this.currentPage * this.pageSize;
    // S'assurer que filteredClaims est bien un tableau avant slice
    return Array.isArray(this.filteredClaims) ? this.filteredClaims.slice(startIndex, startIndex + this.pageSize) : [];
  }

  // Probablement inutile ici si non utilisé dans la modale de validation
  // loadTreatmentResponsibles(): void {
  //   this.agentService.getAgents().subscribe({
  //     next: (agents) => {
  //       this.treatmentResponsibles = agents;
  //     },
  //     error: () => {
  //       this.snackBar.open('Erreur lors du chargement des responsables', 'Fermer', { duration: 3000 });
  //     }
  //   });
  // }

  // Inutile si non utilisé
  // openDetailModal(decision: any): void {
  //   this.selectedClaim = decision;
  //   this.showDetailModal = true;
  // }

  openValidationModal(decision: any): void {
    this.selectedClaim = decision; // decision contient les détails de la réclamation + décision
    this.validationComment = '';
    this.showValidationModal = true;

    // Charger les infos du responsable si nécessaire
    if (decision.treatmentResponsibleId) {
      this.loadTreatmentResponsible(decision.treatmentResponsibleId);
    } else {
      this.treatmentResponsibleName = 'Non assigné';
      this.treatmentResponsibleEmail = '';
    }
  }

  loadTreatmentResponsible(userId: string): void {
    this.agentService.getUserById(userId).subscribe({
      next: (user) => {
        this.treatmentResponsibleName = `${user.firstName} ${user.lastName}`;
        this.treatmentResponsibleEmail = user.email || '';
      },
      error: () => {
        this.treatmentResponsibleName = 'Non disponible';
        this.treatmentResponsibleEmail = '';
      }
    });
  }

  validateClaim(isApproved: boolean): void {
    if (!this.selectedClaim) {
      this.snackBar.open('Aucune décision sélectionnée', 'Fermer', { duration: 3000 });
      return;
    }

    this.loading = true;

    this.decisionService.validateDecision(
      this.selectedClaim.id, // claimId
      this.authService.getUserId(), // validatorId
      isApproved,
      this.validationComment
    ).subscribe({
      next: (response) => {
        this.loading = false;
        this.snackBar.open(
          isApproved ? 'Décision validée avec succès' : 'Décision rejetée avec succès',
          'Fermer',
          { duration: 3000 }
        );
        this.closeModals();
        this.loadDecisions(); // Rafraîchir la liste
      },
      error: (error) => {
        this.loading = false;
        console.error('Erreur validation:', error);
        this.snackBar.open(
          error.error?.message || 'Erreur lors de la validation',
          'Fermer',
          { duration: 3000 }
        );
      }
    });
  }

  // --- Méthodes pour la modale d'aperçu (copiées et adaptées) ---
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

  closePreviewModal(): void {
    this.showPreviewModal = false;
    this.previewFileUrl = '';
    this.previewFileName = '';
    this.previewFileType = 'other';
  }
  // ----------------------------------------

  closeModals(): void {
    this.showDetailModal = false; // Si utilisé
    this.showValidationModal = false;
    this.closePreviewModal(); // S'assurer que la modale d'aperçu est aussi fermée
    this.selectedClaim = null;
    this.validationComment = '';
    this.selectedResponsible = null; // Si utilisé
  }

  getSeverityLabel(severity: any): string {
    if (!severity) return 'Non spécifiée';
    return `${severity.label} (Niveau ${severity.gravityCoefficient})`;
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
  getProducts(claim: any): any[] {
  // Handle both possible structures: claim.products.$values or claim.products directly
  return claim.products?.$values || claim.products || [];
}
  getDecisionClass(status: string): string {
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
}

