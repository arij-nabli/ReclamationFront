
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Product } from 'src/app/Models/Product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.baseUrl}/Product`; // Adaptez selon votre route API

  constructor(private http: HttpClient) { }

  // Récupérer tous les produits
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  // Récupérer un produit par ID
  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  // Ajouter un nouveau produit
  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  // Mettre à jour un produit
  updateProduct(id: any, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  // Supprimer un produit
  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}