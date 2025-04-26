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
      customFields: this.fb.array([]) ,
   
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
  
    // Charger les produits
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
        setTimeout(() => this.router.navigate(['/claims']), 1500);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erreur:', error);
        this.errorMessage = error.error?.message || 'Échec de la soumission';
      }
    });
  }

  private handleSuccess(): void {
    this.isLoading = false;
    this.successMessage = 'Claim submitted successfully!';
    this.resetForm();
    setTimeout(() => this.router.navigate(['/claims']), 1500);
  }

  private handleSubmissionError(error: any): void {
    this.isLoading = false;
    console.error('Submission error:', error);
    this.errorMessage = error.error?.message || 'Failed to submit claim. Please try again.';
  }

  private handleError(error: any, context: string): void {
    console.error(`Error during ${context}:`, error);
    this.errorMessage = `An error occurred. Please try again later.`;
  }

  cancel(): void {
    if (this.claimForm.dirty) {
      if (confirm('Are you sure? Unsaved changes will be lost.')) {
        this.router.navigate(['/claims']);
      }
    } else {
      this.router.navigate(['/claims']);
    }
  }

  private resetForm(): void {
    this.claimForm.reset();
    this.selectedFiles = [];
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