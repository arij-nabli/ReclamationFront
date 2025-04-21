
import { Component, EventEmitter, Output ,OnInit,Input} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AgentserviceService } from '../adminservice/agentservice/agentservice.service';
import { ClaimType } from 'src/app/Models/ClaimType';
import { ClaimtypesService } from '../adminservice/claimtypesservice/claimtypes.service';



@Component({
  selector: 'app-edit-claim-type-card',
  templateUrl: './edit-claim-type-card.component.html',
  styleUrls: ['./edit-claim-type-card.component.css']
})
export class EditClaimTypeCardComponent implements OnInit {
  @Input() claimType!: any; // L'objet complet du claimType
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter<any>(); // Changez pour émettre les données

  editForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private claimTypeService: ClaimtypesService
  ) {
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (this.claimType) {
      this.editForm.patchValue({
        name: this.claimType.name,
        description: this.claimType.description
      });
    }
  }

  submit() {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    // Crée un objet avec toutes les données nécessaires
    const updatedData = {
      ...this.claimType, // Conserve toutes les propriétés originales
      ...this.editForm.value // Met à jour le nom et la description
    };

    console.log('Données envoyées:', updatedData); // Debug
    this.onSubmit.emit(updatedData); // Émet les données complètes
  }

  cancel() {
    this.onCancel.emit();
  }
}