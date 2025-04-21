
import { Component, EventEmitter, Output ,OnInit} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AgentserviceService } from '../adminservice/agentservice/agentservice.service';
import { ClaimType } from 'src/app/Models/ClaimType';
import { ClaimtypesService } from '../adminservice/claimtypesservice/claimtypes.service';

@Component({
  selector: 'app-add-claim-type-card',
  templateUrl: './add-claim-type-card.component.html',
  styleUrls: ['./add-claim-type-card.component.css']
})
export class AddClaimTypeCardComponent implements OnInit {
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter<any>();

  currentStep: number = 1;
  claimTypeForm: FormGroup;
  agents: any[] = [];
  selectedTab: string = 'deciders';
  searchTerm: string = '';

  constructor(
    private fb: FormBuilder,
    private agentService: AgentserviceService,
    private claimTypesService: ClaimtypesService
  ) {
    this.claimTypeForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      deciders: [] ,     // <- plus de Validators.required
      validators: [],   // <- pareil ici
      closers: []       // <- et ici aussi
    });
    
  }
  searchTermDeciders: string = '';
  searchTermValidators: string = '';
  searchTermClosers: string = '';
  ngOnInit() {
    this.loadAgents();
  }

  loadAgents() {
    this.agentService.getAgents().subscribe((response: any) => {
      if (response?.$values) {
        this.agents = response.$values.map((agent: any) => ({
          ...agent,
          selectedAsDecider: false,
          selectedAsValidator: false,
          selectedAsClosure: false
        }));
      }
    });
  }
  get filteredAgentsForValidators() {
    return this.agents.filter(agent =>
      `${agent.firstName} ${agent.lastName}`.toLowerCase().includes(this.searchTermValidators.toLowerCase())
    );
  }
  get filteredAgents() {
    return this.agents.filter(agent =>
      (`${agent.firstName} ${agent.lastName}`.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        agent.email?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        agent.department?.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
  }

  nextStep() {
    if (this.currentStep === 1 && this.claimTypeForm.get('name')?.valid && this.claimTypeForm.get('description')?.valid) {
      this.currentStep++;
    } else if (this.currentStep === 2) {
      this.currentStep++;
      
    }else if (this.currentStep === 3) {
      this.currentStep++;
      
    }
    else if (this.currentStep === 4) {
      this.currentStep++;
      
    }
  }

  prevStep() {
    this.currentStep--;
  }

  toggleSelection(role: 'deciders' | 'validators' | 'closers', id: number) {
    const currentSelection = this.claimTypeForm.get(role)?.value || [];
    if (currentSelection.includes(id)) {
      this.claimTypeForm.get(role)?.setValue(currentSelection.filter((i: number) => i !== id));
    } else {
      this.claimTypeForm.get(role)?.setValue([...currentSelection, id]);
    }
  }
  

  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  isSelected(field: string, agentId: number): boolean {
    return this.claimTypeForm.get(field)?.value.includes(agentId);
  }

  getSelectedAgents(field: string): any[] {
    const selectedIds = this.claimTypeForm.get(field)?.value || [];
    return this.agents.filter(agent => selectedIds.includes(agent.id));
  }

  minSelectedItems(min: number) {
    return (control: AbstractControl) => {
      return (control.value?.length || 0) >= min ? null : { minSelected: true };
    };
  }

  cancel() {
    this.onCancel.emit();
  }

// Ajoutez cette méthode pour gérer la navigation


// Dans submit(), modifiez pour utiliser currentStep 5 pour le succès et 6 pour l'erreur
submit() {
  if (this.claimTypeForm.valid) {
    const formValue = this.claimTypeForm.value;

    const payload = {
      name: formValue.name,
      description: formValue.description,
      DeciderIds: [], // valeurs vides
      ValidatorIds: [],
      ClosureResponsibleIds: []
    };

    this.claimTypesService.addClaimType(payload).subscribe(
      (response) => {
        console.log('Type de réclamation ajouté avec succès', response);
        this.onSubmit.emit(response);
      },
      (error) => {
        console.error('Erreur lors de l\'ajout du type de réclamation', error);
        if (error.error?.errors) {
          console.error('Erreurs de validation :', error.error.errors);
        }
      }
    );
  }
}

  getSelectedItems(field: string): number[] {
    return this.claimTypeForm.get(field)?.value || [];
  }

  getAgentName(agentId: number): string {
    const agent = this.agents.find(a => a.id === agentId);
    return agent ? `${agent.firstName} ${agent.lastName}` : '';
  }

  
}

