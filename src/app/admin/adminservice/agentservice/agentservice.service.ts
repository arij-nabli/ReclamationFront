
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgentserviceService {
private apiUrl = `${environment.baseUrl}/admin/users-by-role/Agent`; // API base URL

  constructor(private http: HttpClient) {
    
  }

  getAgents(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
