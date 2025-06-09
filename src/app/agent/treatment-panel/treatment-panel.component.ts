import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/auth/authservice/auth.service';
import { Claim } from 'src/app/Models/Claim';
import { ClaimService } from 'src/app/service/claim.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; // Import DomSanitizer

@Component({
  selector: 'app-treatment-panel',
  templateUrl: './treatment-panel.component.html',
  styleUrls: ['./treatment-panel.component.css']
})
export class TreatmentPanelComponent implements OnInit {
  claims: any[] = [];
  loading = false;
  selectedClaim: any = null;
  showDetailModal = false; // Gardé pour compatibilité si utilisé
  showProcessingModal = false;
  processingComment = '';
  agentId: any;
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
    private sanitizer: DomSanitizer // Injecter DomSanitizer
  ) {}

  ngOnInit(): void {
    this.agentId = this.authService.getUserId();
    this.loadClaims();
  }

  loadClaims(): void {
    this.loading = true;
    // Assurez-vous que cet appel API inclut bien les 'fileClaims' dans la réponse
    this.claimService.getClaimsToTreat(this.agentId).subscribe({
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

  // Peut-être utilisé pour une vue rapide avant traitement ?
  openDetailModal(claim: any): void {
    this.selectedClaim = claim;
    this.showDetailModal = true;
  }

  startProcessing(claim: any): void {
    this.selectedClaim = claim;
    this.processingComment = '';
    this.showDetailModal = false; // Fermer l'autre modale si ouverte
    this.showProcessingModal = true;
  }

  openRejectionDetailsModal(claim: any): void {
    this.selectedClaim = claim;
    this.showRejectionDetailsModal = true;
  }

  completeProcessing(): void {
    if (!this.selectedClaim || !this.processingComment.trim()) {
      this.snackBar.open('Veuillez ajouter un commentaire de traitement', 'Fermer', { duration: 3000 });
      return;
    }

    this.loading = true;
    this.claimService.processByTreatment(
      this.selectedClaim.id,
      this.authService.getUserId(),
      this.processingComment
    ).subscribe({
      next: () => {
        this.loading = false;
        this.snackBar.open('Traitement terminé avec succès', 'Fermer', { duration: 3000 });
        this.closeModals();
        this.loadClaims();
      },
      error: (error) => {
        this.loading = false;
        const errorMessage = error.error?.message || 'Erreur lors du traitement';
        this.snackBar.open(errorMessage, 'Fermer', { duration: 3000 });
      }
    });
  }

  // --- Méthodes pour la modale d'aperçu (copiées et adaptées) ---
  openPreviewModal(file: any): void {
    // Vérification essentielle : l'objet 'file' doit contenir 'fileId' (GUID) et 'fileName'
    if (!file || !file.fileId || !file.fileName) {
      console.error('File data is missing for preview:', file);
      this.snackBar.open('Impossible d\'afficher l\'aperçu : données du fichier incomplètes.', 'Fermer', { duration: 3000 });
      return;
    }

    this.previewFileName = file.fileName;
    // Construire l'URL vers le backend en utilisant le fileId (GUID)
    const backendFileUrl = `/api/File/${file.fileId}`; // <-- Assurez-vous que cette URL est correcte

    const fileExtension = file.fileName.split('.').pop()?.toLowerCase();

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
    this.showDetailModal = false;
    this.showProcessingModal = false;
    this.showRejectionDetailsModal = false;
    this.closePreviewModal(); // S'assurer que la modale d'aperçu est aussi fermée
    this.selectedClaim = null;
    this.processingComment = '';
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
  // Modifié pour retourner string, ou ajuster l'appelant si severity est un objet
  getSeverityLabel(severity: any): string {
    // Si severity est un objet avec une propriété 'level' ou 'id'
    const level = typeof severity === 'object' && severity !== null ? severity.gravityCoefficient : severity;
    switch (level) {
      case 1: return 'Faible';
      case 2: return 'Moyenne';
      case 3: return 'Élevée';
      case 4: return 'Critique';
      default: return 'Non spécifiée';
    }
  }
}

