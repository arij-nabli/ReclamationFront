import { Component, OnInit } from '@angular/core';
import { AgentserviceService } from '../adminservice/agentservice/agentservice.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  agentCount: number = 0;
  clientCount: number = 0;
  agentLoading: boolean = true;
  clientLoading: boolean = true;
  agentError: boolean = false;
  clientError: boolean = false;

  constructor(private agentService: AgentserviceService) {}

  ngOnInit() {
    this.loadAgentCount();
    this.loadClientCount();
  }

  loadAgentCount() {
    this.agentLoading = true;
    this.agentError = false;
    
    this.agentService.getAgents().subscribe({
      next: (response: any) => {
        const agents = response.$values || []; 

  this.agentCount = agents.length;
 
  this.agentLoading = false;
},
      error: (err) => {
        console.error('Erreur lors du chargement des agents:', err);
        this.agentError = true;
        this.agentLoading = false;
      }
    });
  }

  loadClientCount() {
    this.clientLoading = true;
    this.clientError = false;
    
    this.agentService.getClients().subscribe({
        next: (response: any) => {
        const clients = response.$values || []; 
        this.clientCount = clients.length;
        this.clientLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des clients:', err);
        this.clientError = true;
        this.clientLoading = false;
      }
    });
  }

  // Pour une mise à jour en temps réel
  refreshCounts() {
    this.loadAgentCount();
    this.loadClientCount();
  }
}