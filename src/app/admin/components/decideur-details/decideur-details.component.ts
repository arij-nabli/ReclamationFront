import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClaimtypesService } from '../../adminservice/claimtypesservice/claimtypes.service';
import { AgentserviceService } from '../../adminservice/agentservice/agentservice.service';


@Component({
  selector: 'app-decideur-details',
  templateUrl: './decideur-details.component.html',
  styleUrls: ['./decideur-details.component.css']
})
export class DecideurDetailsComponent   implements OnInit {
  decideurs: any[] = [];
  claimTypeId: string = '';
  agents: any[] = [];
  filteredAgents: any[] = [];
  agentsSelectionnes: any[] = [];
  afficherAgents = false;
  modeRetrait = false;
  constructor(
    private route: ActivatedRoute,
    private router:Router,
    private claimTypeService: ClaimtypesService,
    private agentService: AgentserviceService
  ) {}

  ngOnInit(): void {
    this.claimTypeId = this.route.snapshot.paramMap.get('id') || '';
    this.loadDecideurs();
  }

  
  loadDecideurs(): void {
    if (this.claimTypeId) {
      this.claimTypeService.getClaimTypeDetails(this.claimTypeId).subscribe(
        (data) => {
          this.decideurs = data.decideurs?.$values || [];
        },
        (error) => {
          console.error('Erreur:', error);
        }
      );
    }
  }
  retour(): void {
    // Par exemple, retour vers la liste des types de réclamation
    this.router.navigate(['/admin/claimetype']);
  }
  isAlreadyDecideur(agent: any): boolean {
    return this.decideurs.some(d => d.id === agent.id);
}
afficherListeAgents(mode: 'ajouter' | 'retirer'): void {
  this.modeRetrait = mode === 'retirer';
  
  this.agentService.getAgents().subscribe(
      (response: any) => {
          this.agents = response?.$values || [];
          this.filteredAgents = [...this.agents];
          this.afficherAgents = true;
          
          // En mode retrait, on pré-sélectionne uniquement les décideurs existants
          if (this.modeRetrait) {
              this.agentsSelectionnes = this.agents.filter(agent => 
                  this.decideurs.some(d => d.id === agent.id)
              );
          } else {
              // En mode ajout, on pré-sélectionne les décideurs existants
              this.agentsSelectionnes = this.agents.filter(agent => 
                  this.decideurs.some(d => d.id === agent.id)
              );
          }
      },
      (error) => {
          console.error('Erreur:', error);
      }
  );
}

  filterAgents(event: any): void {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredAgents = this.agents.filter(agent => 
      agent.firstName.toLowerCase().includes(searchTerm) ||
      agent.lastName.toLowerCase().includes(searchTerm) ||
      agent.email.toLowerCase().includes(searchTerm) ||
      agent.userName.toLowerCase().includes(searchTerm)
    );
  }

  toggleSelection(agent: any): void {
    if (this.modeRetrait) {
        // En mode retrait, on ne peut que décocher (retirer) des décideurs existants
        if (this.isAlreadyDecideur(agent)) {
            const index = this.agentsSelectionnes.findIndex(a => a.id === agent.id);
            if (index > -1) {
                this.agentsSelectionnes.splice(index, 1);
            }
        }
    } else {
        // En mode ajout, logique normale
        const index = this.agentsSelectionnes.findIndex(a => a.id === agent.id);
        if (index > -1) {
            this.agentsSelectionnes.splice(index, 1);
        } else {
            this.agentsSelectionnes.push({...agent});
        }
    }
}
  isSelected(agent: any): boolean {
    return this.agentsSelectionnes.some(a => a.id === agent.id);
  }

  ajouterAgentsCommeDecideurs(): void {
    if (!this.claimTypeId) return;
  
    this.claimTypeService.getClaimTypeDetails(this.claimTypeId).subscribe(
        (data) => {
            let updatedDeciderIds;
            
            if (this.modeRetrait) {
                // En mode retrait, on enlève les agents décochés
                const decideursActuels = this.decideurs.map(d => d.id);
                const agentsARetirer = this.agents
                    .filter(agent => this.decideurs.some(d => d.id === agent.id))
                    .filter(agent => !this.agentsSelectionnes.some(a => a.id === agent.id))
                    .map(agent => agent.id);
                
                updatedDeciderIds = decideursActuels.filter(id => !agentsARetirer.includes(id));
            } else {
                // En mode ajout, on ajoute les nouveaux agents sélectionnés
                const decideursActuels = this.decideurs.map(d => d.id);
                const nouveauxAgents = this.agentsSelectionnes
                    .filter(agent => !decideursActuels.includes(agent.id))
                    .map(agent => agent.id);
                
                updatedDeciderIds = [...decideursActuels, ...nouveauxAgents];
            }
  
            const payload = {
                name: data.nom,
                description: data.description,
                DeciderIds: updatedDeciderIds,
                validatorIds: data.validateurs?.$values.map((d: any) => d.id) || [],
                ClosureResponsibleIds: data.responsablesCloture?.$values.map((d: any) => d.id) || []
            };
  
            this.claimTypeService.updateClaimType(this.claimTypeId, payload).subscribe(
                () => {
                    console.log("Décideurs mis à jour !");
                    this.loadDecideurs();
                    this.agentsSelectionnes = [];
                    this.afficherAgents = false;
                    this.modeRetrait = false;
                },
                (error) => {
                    console.error("Erreur lors de la mise à jour :", error);
                }
            );
        },
        (error) => {
            console.error("Erreur lors du chargement du ClaimType :", error);
        }
    );
}
  cacherListeAgents(): void {
    this.afficherAgents = false;
    // Optionnel: réinitialiser la sélection si vous voulez
    // this.agentsSelectionnes = [];
  }
  fermerModal(): void {
    this.afficherAgents = false;
    this.agentsSelectionnes = [];
  }
  
}