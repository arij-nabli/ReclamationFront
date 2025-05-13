import { Component , OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { FormArray } from '@angular/forms';
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
  clientId: any | null = null;
  showModal = false;

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
      productId: ['', Validators.required],
      severityId: ['', Validators.required],
      customFields: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.initializeData();
  }

  get customFields(): FormArray {
    return this.claimForm.get('customFields') as FormArray;
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
    // Charger les types de réclamation
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
  
    // Charger les niveaux de gravité
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
      description: formValue.description,
      claimTypeId: formValue.claimTypeId,
      severityId: formValue.severityId,
      productId: formValue.productId,
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
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}