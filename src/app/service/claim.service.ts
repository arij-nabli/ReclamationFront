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
  getClaimsByClientId(clientId: string): Observable<Claim[]> {
    return this.http.get<Claim[]>(`${this.apiUrl}/client/${clientId}`);
  }

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
   // Nouvelles méthodes pour le workflow agent
   getPendingClaims(agentId: string): Observable<Claim[]> {
    return this.http.get<Claim[]>(`${this.apiUrl}/pending/${agentId}`);
  }
  processClaimByDecider(
    claimId: string,
    deciderId: string,
    treatmentResponsibleId: string,
    decisionComments?: string
  ): Observable<any> {
    const payload = {
      deciderId,
      treatmentResponsibleId,
      decisionComments
    };

    return this.http.put(`${this.apiUrl}/process/${claimId}`, payload);
  }

  getClaimsToValidate(agentId: string): Observable<Claim[]> {
    return this.http.get<Claim[]>(`${this.apiUrl}/to-validate/${agentId}`);
  }

  getClaimsToTreat(agentId: string): Observable<Claim[]> {
    return this.http.get<Claim[]>(`${this.apiUrl}/to-treat/${agentId}`);
  }

  getClaimsToClose(agentId: string): Observable<Claim[]> {
    return this.http.get<Claim[]>(`${this.apiUrl}/to-close/${agentId}`);
  }

  getAgentProcessedClaims(agentId: string): Observable<Claim[]> {
    return this.http.get<Claim[]>(`${this.apiUrl}/processed/${agentId}`);
  }

  getClaimsByStatus(agentId: string, status: string): Observable<Claim[]> {
    return this.http.get<Claim[]>(`${this.apiUrl}/by-status/${agentId}/${status}`);
  }

  getClaims(agentId: string): Observable<Claim[]> {
    return this.http.get<Claim[]>(`${this.apiUrl}/by-claim/${agentId}`);
  }
  validateDecision(
    claimId: string,
    validatorId: string,
    isApproved: boolean,
    validationComments?: string
  ): Observable<any> {
    const payload = {
      validatorId,
    isApproved,
    validationComments,
    };

    return this.http.put(`${this.apiUrl}/validate/${claimId}`, payload);
  }

  processByTreatment(
    claimId: string,
    treatmentResponsibleId: string,

    treatmentComments?: string
  ): Observable<any> {
    const payload = {
      treatmentResponsibleId,
  
      treatmentComments,
    }; 
    return this.http.put<Claim>(`${this.apiUrl}/processByTreatment/${claimId}`, payload);
  }
  validateClosure(
    claimId: string,
    isApproved: boolean,
    comment: string,
    closureResponsibleId: string
  ): Observable<any> {
    const payload = {
      isApproved,
      comment,
      closureResponsibleId
    };
  
    return this.http.put(`${this.apiUrl}/validate-closure/${claimId}`, payload);
  }

}