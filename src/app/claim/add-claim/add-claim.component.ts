import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ClaimtypesService } from 'src/app/admin/adminservice/claimtypesservice/claimtypes.service';
import { ProductService } from 'src/app/admin/adminservice/Productservice/product.service';
import { SeverityService } from 'src/app/admin/adminservice/severityservice/severity.service';
import { AuthService } from 'src/app/auth/authservice/auth.service';
import { Claim } from 'src/app/Models/Claim';
import { ClaimStatus } from 'src/app/Models/ClaimStatus';
import { ClaimType } from 'src/app/Models/ClaimType';
import { Product } from 'src/app/Models/Product';
import { Severity } from 'src/app/Models/Severity';
import { ClaimService } from 'src/app/service/claim.service';

@Component({
  selector: 'app-add-claim',
  templateUrl: './add-claim.component.html',
  styleUrls: ['./add-claim.component.css']
})
export class AddClaimComponent implements OnInit {
  claimForm: FormGroup;
  selectedFiles: File[] = [];
  severities: Severity[] = [];
  products: Product[] = [];
  claimTypes: ClaimType[] = [];
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  clientId: string | null = null;
  showModal = false;
  
  // Nouvelles propriétés pour le multi-select dropdown
  showProductDropdown = false;
  productSearchTerm = '';

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private claimService: ClaimService,
    private severityService: SeverityService,
    private productService: ProductService,
    private claimTypeService: ClaimtypesService,
    private authService: AuthService
  ) {
    this.claimForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      claimTypeId: ['', Validators.required],
      productIds: this.fb.array([], Validators.required),
      severityId: ['', Validators.required],
      customFields: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.initializeData();
    
    // Fermer le dropdown quand on clique ailleurs sur la page
    document.addEventListener('click', (event: MouseEvent) => {
      if (this.showProductDropdown && !(event.target as HTMLElement).closest('.relative')) {
        this.showProductDropdown = false;
      }
    });
  }

  get customFields(): FormArray {
    return this.claimForm.get('customFields') as FormArray;
  }

  get productIds(): FormArray {
    return this.claimForm.get('productIds') as FormArray;
  }
  
  // Getter pour filtrer les produits selon le terme de recherche
  get filteredProducts(): Product[] {
    if (!this.productSearchTerm) {
      return this.products;
    }
    
    const searchTerm = this.productSearchTerm.toLowerCase();
    return this.products.filter(product => 
      product.productName!.toLowerCase().includes(searchTerm) || 
      product.productCode!.toLowerCase().includes(searchTerm)
    );
  }

  addCustomField(): void {
    this.customFields.push(this.fb.group({
      key: ['', Validators.required],
      value: ['']
    }));
  }

  removeCustomField(index: number): void {
    this.customFields.removeAt(index);
  }
  
  // Méthode pour basculer l'affichage du dropdown
  toggleProductDropdown(): void {
    this.showProductDropdown = !this.showProductDropdown;
    if (this.showProductDropdown) {
      this.productSearchTerm = '';
    }
  }
  
  // Méthode pour sélectionner/désélectionner un produit
  toggleProduct(productId: string): void {
    if (this.isProductSelected(productId)) {
      this.removeProduct(new Event('click'), productId);
    } else {
      const productIdsArray = this.productIds;
      productIdsArray.push(new FormControl(productId));
    }
  }
  
  // Méthode pour sélectionner/désélectionner tous les produits
  toggleAllProducts(): void {
    if (this.isAllProductsSelected()) {
      // Désélectionner tous les produits
      while (this.productIds.length !== 0) {
        this.productIds.removeAt(0);
      }
    } else {
      // Sélectionner tous les produits
      const productIdsArray = this.productIds;
      // Vider d'abord le tableau pour éviter les doublons
      while (productIdsArray.length !== 0) {
        productIdsArray.removeAt(0);
      }
      // Ajouter tous les produits
      this.products.forEach(product => {
        productIdsArray.push(new FormControl(product.id));
      });
    }
  }
  
  // Vérifier si tous les produits sont sélectionnés
  isAllProductsSelected(): boolean {
    return this.products.length > 0 && this.productIds.length === this.products.length;
  }
  
  // Supprimer un produit sélectionné (utilisé pour les tags)
  removeProduct(event: Event, productId: string): void {
    event.stopPropagation();
    const index = this.productIds.controls.findIndex(x => x.value === productId);
    if (index >= 0) {
      this.productIds.removeAt(index);
    }
  }
  
  // Obtenir le nom d'un produit à partir de son ID
  getProductName(productId: string): string {
    const product = this.products.find(p => p.id === productId);
    return product ? `${product.productName} (${product.productCode})` : productId;
  }

  onProductChange(event: Event, productId: string): void {
    const target = event.target as HTMLInputElement;
    const isChecked = target.checked;
    const productIdsArray = this.productIds;

    if (isChecked) {
      productIdsArray.push(new FormControl(productId));
    } else {
      const index = productIdsArray.controls.findIndex(x => x.value === productId);
      if (index >= 0) {
        productIdsArray.removeAt(index);
      }
    }
  }

  isProductSelected(productId: string): boolean {
    return this.productIds.value.includes(productId);
  }

  openModal(): void {
    this.showModal = true;
    document.body.style.overflow = 'hidden';
    this.resetForm();
  }

  closeModal(): void {
    if (this.claimForm.dirty) {
      if (confirm('Voulez-vous vraiment annuler ? Les modifications non enregistrées seront perdues.')) {
        this.showModal = false;
        document.body.style.overflow = 'auto';
      }
    } else {
      this.showModal = false;
      document.body.style.overflow = 'auto';
    }
  }

  private initializeData(): void {
    this.clientId = this.authService.getUserId();
    
    if (!this.clientId) {
      this.errorMessage = 'Authentication required. Please login.';
      this.router.navigate(['/login']);
      return;
    }

    this.loadDropdownData();
  }

  loadDropdownData(): void {
    this.claimTypeService.getClaimTypes().subscribe({
      next: (response: any) => {
        this.claimTypes = response.$values || [];
      },
      error: (error) => this.handleError(error, 'claim types')
    });
  
    this.productService.getAllProducts().subscribe({
      next: (response: any) => {
        this.products = response.$values || [];
   
      },
      error: (error) => this.handleError(error, 'products')
    });
  
    this.severityService.getAllSeverities().subscribe({
      next: (response: any) => {
        this.severities = response.$values || [];
      },
      error: (error) => this.handleError(error, 'severities')
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFiles = Array.from(input.files);
    }
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  onSubmit(): void {
    if (this.claimForm.invalid) {
      this.markFormGroupTouched(this.claimForm);
      return;
    }
  
    this.isLoading = true;
    const formValue = this.claimForm.value;
  
    const customFieldsObj: { [key: string]: string } = {};
    for (const field of formValue.customFields) {
      if (field.key) {
        customFieldsObj[field.key] = field.value;
      }
    }
    
    const claimData = {
      title:formValue.title,
      description: formValue.description,
      claimTypeId: formValue.claimTypeId,
      severityId: formValue.severityId,
      productIds: formValue.productIds,
      customFieldsJson: JSON.stringify(customFieldsObj)
    };

    this.claimService.submitClaim(this.clientId!, claimData, this.selectedFiles).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Réclamation soumise avec succès!';
        this.resetForm();
        this.showModal = false;
        document.body.style.overflow = 'auto';
        setTimeout(() => this.router.navigate(['/claim/cc']), 1500);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erreur:', error);
        this.errorMessage = error.error?.message || 'Échec de la soumission';
      }
    });
  }

  private handleError(error: any, context: string): void {
    console.error(`Error during ${context}:`, error);
    this.errorMessage = `An error occurred. Please try again later.`;
  }

  private resetForm(): void {
    this.claimForm.reset();
    this.selectedFiles = [];
    this.successMessage = '';
    this.errorMessage = '';
    // Réinitialiser les FormArrays
    while (this.customFields.length !== 0) {
      this.customFields.removeAt(0);
    }
    while (this.productIds.length !== 0) {
      this.productIds.removeAt(0);
    }
    // Réinitialiser les propriétés du dropdown
    this.showProductDropdown = false;
    this.productSearchTerm = '';
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach(arrayControl => {
          if (arrayControl instanceof FormGroup) {
            this.markFormGroupTouched(arrayControl);
          }
          arrayControl.markAsTouched();
        });
      }
    });
  }
}