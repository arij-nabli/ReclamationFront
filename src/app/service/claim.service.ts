import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Claim } from '../Models/Claim';

@Injectable({
  providedIn: 'root'
})
export class ClaimService {
  private apiUrl = `${environment.baseUrl}/Claim`;

  constructor(private http: HttpClient) { }

  submitClaim(clientId: string, claimData: any, files: File[]): Observable<any> {
    const formData = new FormData();
    
    // Utiliser exactement 'claimJson' comme clé (comme dans Postman)
    formData.append('claimJson', JSON.stringify({
      nature: 'CUSTOMER_CLAIM', // ou claimData.nature si disponible
      description: claimData.description,
      status: 'Pending',
      submissionDate: new Date().toISOString(),
      customFieldsJson: claimData.customFieldsJson || '{}',
      claimTypeFK: claimData.claimTypeId,
      severityFK: claimData.severityId,
      productFK: claimData.productId
    }));
    
    // Ajouter les fichiers avec la clé 'files'
    files.forEach(file => {
      formData.append('files', file, file.name);
    });

    const url = `${this.apiUrl}/submit?clientId=${clientId}`;
    return this.http.post(url, formData);
  }
}