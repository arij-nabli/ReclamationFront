import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClaimtypesService } from '../../adminservice/claimtypesservice/claimtypes.service'
import { AgentserviceService } from '../../adminservice/agentservice/agentservice.service';

AgentserviceService
@Component({
  selector: 'app-validateur-details',
  templateUrl: './validateur-details.component.html',
  styleUrls: ['./validateur-details.component.css']
})
export class ValidateurDetailsComponent implements OnInit {
  validateurs: any[] = [];
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
    this.loadValidateurs();
  }
  isAlreadyValidateur(agent: any): boolean {
    return this.validateurs.some(v => v.id === agent.id);
}
  loadValidateurs(): void {
    if (this.claimTypeId) {
      this.claimTypeService.getClaimTypeDetails(this.claimTypeId).subscribe(
        (data) => {
          this.validateurs = data.validateurs?.$values || [];
        },
        (error) => {
          console.error('Erreur:', error);
        }
      );
    }
  }

  afficherListeAgents(mode: 'ajouter' | 'retirer'): void {
    this.modeRetrait = mode === 'retirer';
    
    this.agentService.getAgents().subscribe(
        (response: any) => {
            this.agents = response?.$values || [];
            this.filteredAgents = [...this.agents];
            this.afficherAgents = true;
            
            if (this.modeRetrait) {
                // En mode retrait, on pré-sélectionne uniquement les validateurs existants
                this.agentsSelectionnes = this.agents.filter(agent => 
                    this.validateurs.some(v => v.id === agent.id)
                );
            } else {
                // En mode ajout, on pré-sélectionne les validateurs existants
                this.agentsSelectionnes = this.agents.filter(agent => 
                    this.validateurs.some(v => v.id === agent.id)
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
        // En mode retrait, on ne peut que décocher (retirer) des validateurs existants
        if (this.isAlreadyValidateur(agent)) {
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
  cacherListeAgents(): void {
    this.afficherAgents = false;
    // Optionnel: réinitialiser la sélection si vous voulez
    // this.agentsSelectionnes = [];
  }
  ajouterAgentsCommeValidateurs(): void {
    if (!this.claimTypeId) return;
  
    this.claimTypeService.getClaimTypeDetails(this.claimTypeId).subscribe(
        (data) => {
            let updatedValidatorIds;
            
            if (this.modeRetrait) {
                // En mode retrait, on enlève les validateurs décochés
                const validateursActuels = this.validateurs.map(v => v.id);
                const agentsARetirer = this.agents
                    .filter(agent => this.validateurs.some(v => v.id === agent.id))
                    .filter(agent => !this.agentsSelectionnes.some(a => a.id === agent.id))
                    .map(agent => agent.id);
                
                updatedValidatorIds = validateursActuels.filter(id => !agentsARetirer.includes(id));
            } else {
                // En mode ajout, on ajoute les nouveaux validateurs sélectionnés
                const validateursActuels = this.validateurs.map(v => v.id);
                const nouveauxAgents = this.agentsSelectionnes
                    .filter(agent => !validateursActuels.includes(agent.id))
                    .map(agent => agent.id);
                
                updatedValidatorIds = [...validateursActuels, ...nouveauxAgents];
            }
  
            const payload = {
                name: data.nom,
                description: data.description,
                DeciderIds: data.decideurs?.$values.map((d: any) => d.id) || [],
                validatorIds: updatedValidatorIds,
                ClosureResponsibleIds: data.responsablesCloture?.$values.map((d: any) => d.id) || []
            };

            this.claimTypeService.updateClaimType(this.claimTypeId, payload).subscribe(
                () => {
                    console.log("Validateurs mis à jour !");
                    this.loadValidateurs();
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
retour(): void {
  // Par exemple, retour vers la liste des types de réclamation
  this.router.navigate(['/admin/claimetype']);
}
}
