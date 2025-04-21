import { Component,OnInit ,HostListener} from '@angular/core';
import { ClaimType } from 'src/app/Models/ClaimType';
import { ClaimtypesService } from '../adminservice/claimtypesservice/claimtypes.service';

import { ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-claimetype',
  templateUrl: './claimetype.component.html',
  styleUrls: ['./claimetype.component.css']
})
export class ClaimetypeComponent implements OnInit {
  claimTypes: any[] = [];
  showAddClaimTypeCard = false; 
  showTable: boolean = false; 
  claimTypeToEdit: any = null; // Correction: doit être un objet ou null
  showEditClaimTypeCard = false;
  selectedClaimType: any = null;
  showConfirmDeleteCard = false;
  claimTypeToDelete: any = null;
  dataSource = new MatTableDataSource<any>([]);

   pageSize = 5;
   currentPage = 0;
   length = 0; // claimTypes.length
   totalPages = 0;
 


  constructor(private claimetypeService: ClaimtypesService) {}
  
  actionMenuOpen: string | null = null;

  toggleActionMenu(id: string) {
    this.actionMenuOpen = this.actionMenuOpen === id ? null : id;
  }
  
  @HostListener('document:click', ['$event'])
  closeMenuOnClickOutside(event: Event) {
    if (!(event.target as HTMLElement).closest('.action-menu-container')) {
      this.actionMenuOpen = null;
    }
  }
  ngOnInit(): void {

    this.loadClaimTypes();
  }

  loadClaimTypes() {
    this.claimetypeService.getClaimTypes().subscribe(
      (response: any) => {
        console.log('API Response:', response);
        this.claimTypes = response.$values || []; 
        this.length = this.claimTypes.length;
      this.calculateTotalPages();
      },
      error => {
        console.error('Erreur lors du chargement des claim types', error);
      }
    );
  }

  handleClaimTypeAdded(newType: any) {
    this.showAddClaimTypeCard = false;
    this.loadClaimTypes();
  }

  toggleTable() {
    this.showTable = !this.showTable;
  }

  viewClaimTypeDetails(type: any): void {
    this.claimetypeService.getClaimTypeById(type.id).subscribe(
      (response: any) => {
        this.selectedClaimType = response;
        console.log('Détails du type de réclamation:', response);
      },
      error => {
        console.error('Erreur lors du chargement des détails du type de réclamation', error);
      }
    );
  }

  consulterDecideurs(type: ClaimType) {
    console.log('Décideurs pour', type.name, ':', type.deciders);
  }
  get paginatedClaimTypes(): any[] {
    const startIndex = this.currentPage * this.pageSize;
    return this.claimTypes.slice(startIndex, startIndex + this.pageSize);
  }
  consulterDecisionValidators(type: ClaimType) {
    console.log('Validateurs décision pour', type.name, ':', type.decisionValidators);
  }

  
  consulterClosureValidators(type: ClaimType) {
    console.log('Validateurs clôture pour', type.name, ':', type.closureResponsibleAgents);
  }

  closeDetails(): void {
    this.selectedClaimType = null;
  }

  toggleAddClaimTypeCard() {
    this.showAddClaimTypeCard = !this.showAddClaimTypeCard;
  }

  onClaimTypeAdded(claimType: any) {
    this.claimTypes.push(claimType);
    this.showAddClaimTypeCard = false;
  }

  confirmDelete() {
    if (!this.claimTypeToDelete) return;
  
    this.claimetypeService.deleteClaimType(this.claimTypeToDelete.id).subscribe({
      next: () => {
        this.claimTypes = this.claimTypes.filter(ct => ct.id !== this.claimTypeToDelete.id);
        this.showConfirmDeleteCard = false;
        this.claimTypeToDelete = null;
      },
      error: err => {
        console.error('Erreur suppression:', err);
        this.showConfirmDeleteCard = false;
      }
    });
  }

  openEditClaimType(type: any) {
    this.claimTypeToEdit = {...type}; // Crée une copie de l'objet
    this.showEditClaimTypeCard = true;
  }

  handleClaimTypeEdited(updatedFormData: {name: string, description: string}) {
    if (!this.claimTypeToEdit?.id) {
      console.error('Aucun claimType sélectionné pour modification');
      return;
    }
  
    this.claimetypeService.getClaimTypeDetails(this.claimTypeToEdit.id).subscribe({
      next: (currentData) => {
        const payload = {
          name: updatedFormData.name,
          description: updatedFormData.description,
          DeciderIds: currentData.decideurs?.$values.map((d: any) => d.id) || [],
          validatorIds: currentData.validateurs?.$values.map((v: any) => v.id) || [],
          ClosureResponsibleIds: currentData.responsablesCloture?.$values.map((r: any) => r.id) || []
        };
  
        console.log('Payload complet envoyé:', payload);
  
        this.claimetypeService.updateClaimType(this.claimTypeToEdit.id, payload).subscribe({
          next: () => {
            this.loadClaimTypes();
            this.showEditClaimTypeCard = false;
            this.claimTypeToEdit = null;
          },
          error: (err) => {
            console.error("Erreur lors de la mise à jour :", err);
          }
        });
      },
      error: (err) => {
        console.error("Erreur lors de la récupération des détails :", err);
      }
    });
  }

  cancelEdit() {
    this.showEditClaimTypeCard = false;
    this.claimTypeToEdit = null;
  }

  cancelDelete() {
    this.showConfirmDeleteCard = false;
    this.claimTypeToDelete = null;
  }
  
  
  onPageChange(event: any) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.calculateTotalPages();
  }
  

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.length / this.pageSize);
  }
  
  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }
  
  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
    }
  }
  
  goToFirstPage() {
    this.currentPage = 0;
  }
  
  goToLastPage() {
    this.currentPage = this.totalPages - 1;
  }
  
  onPageSizeChange() {
    this.currentPage = 0;
    this.calculateTotalPages();
  }
  openConfirmDelete(type: any) {
    this.claimTypeToDelete = type;
    this.showConfirmDeleteCard = true;
  }
}