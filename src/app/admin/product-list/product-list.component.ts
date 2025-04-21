import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/Models/Product';
import { ProductService } from '../adminservice/Productservice/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  showAddForm = false;
  showEditForm = false;
  showDeleteModal = false;
  actionMenuOpen: string | null = null;
  
  pageSize = 5;
  currentPage = 0;
  length = 0; // claimTypes.length
  totalPages = 0;
  addProductForm: FormGroup;
  editProductForm: FormGroup;
  
  productToDelete: Product | null = null;

  constructor(
    private productService: ProductService,
    private fb: FormBuilder
  ) {
    this.addProductForm = this.fb.group({
      productCode: ['', Validators.required],
      productName: ['', Validators.required]
    });

    this.editProductForm = this.fb.group({
      id: [''],
      productCode: ['', Validators.required],
      productName: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {  
    this.productService.getAllProducts().subscribe(
      (response: any) => {
        this.products = response.$values || [];
        this.filteredProducts = [...this.products];
        this.length = this.products.length;
        this.calculateTotalPages();
       
      },
      error => {
        console.error('Erreur lors du chargement des produits', error);
      }
    );
  }

  // Pagination methods

  get paginatedProducts(): Product[] {
    const start = this.currentPage * this.pageSize;
    return this.filteredProducts.slice(start, start + this.pageSize);
  }

  

  // CRUD operations
  addProduct(): void {
    if (this.addProductForm.invalid) return;
  
    const newProduct: Product = {
      productCode: this.addProductForm.value.productCode,
      productName: this.addProductForm.value.productName
    };
  
    this.productService.addProduct(newProduct).subscribe({
      next: (createdProduct) => {
        // Solution 1: Ajout immédiat + rechargement
        this.products.unshift(createdProduct);
        this.filteredProducts = [...this.products];
      
        
        // Solution 2: Rechargement complet (plus sûr)
        this.loadProducts();
        
        this.addProductForm.reset();
        this.showAddForm = false;
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout:', err);
      }
    });
  }

  editProduct(product: Product): void {
    this.editProductForm.patchValue({
      id: product.id,
      productCode: product.productCode,
      productName: product.productName
    });
    this.showEditForm = true;
    this.actionMenuOpen = null;
  }

  updateProduct(): void {
    if (this.editProductForm.invalid) return;

    const updatedProduct: Product = {
      id: this.editProductForm.value.id,
      productCode: this.editProductForm.value.productCode,
      productName: this.editProductForm.value.productName
    };

    this.productService.updateProduct(updatedProduct.id, updatedProduct).subscribe({
      next: () => {
        this.loadProducts();
        this.showEditForm = false;
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour:', err);
      }
    });
  }

  confirmDelete(product: Product): void {
    this.productToDelete = product;
    this.showDeleteModal = true;
    this.actionMenuOpen = null;
  }

  deleteProduct(): void {
    if (this.productToDelete?.id) {
      this.productService.deleteProduct(this.productToDelete.id).subscribe({
        next: () => {
          this.loadProducts();
          this.showDeleteModal = false;
          this.productToDelete = null;
        },
        error: (err) => {
          console.error('Erreur lors de la suppression:', err);
        }
      });
    }
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
 

  // UI helpers
  toggleActionMenu(id: string | undefined): void {
    this.actionMenuOpen = id ? (this.actionMenuOpen === id ? null : id) : null;
  }

  cancelAdd(): void {
    this.showAddForm = false;
    this.addProductForm.reset();
  }

  cancelEdit(): void {
    this.showEditForm = false;
  }
}