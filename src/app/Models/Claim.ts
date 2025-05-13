import { ClaimNature } from "./ClaimNature";
import { ClaimStatus } from "./ClaimStatus";
import { ClaimType } from "./ClaimType";
import { FileClaim } from "./FileClaim";
import { Product } from "./Product";
import { Severity } from "./Severity";


export class Claim {
  id?: string;
  title: string;
  description: string;
  claimType: ClaimType;
  product: Product;
  customFieldsJson: string = '{}';
  submissionDate?: string;
  treatmentDescription?:string;

  closureDate?:string;

  isClosureValidated?:boolean;

  closureValidationComment?:string;
treatmentDate?:string;
  severity: Severity;
  status: ClaimStatus;
  creationDate: string;
  clientId: string;
  files?: string[]; // URLs des fichiers joints

  // Propriété calculée pour accéder aux champs personnalisés
  get customFields(): Record<string, any> {
    try {
      return this.customFieldsJson ? JSON.parse(this.customFieldsJson) : {};
    } catch {
      return {};
    }
  }

  set customFields(fields: Record<string, any>) {
    this.customFieldsJson = JSON.stringify(fields);
  }

  constructor(
    title: string,
    description: string,
    claimType: ClaimType,
    product: Product,
    severity: Severity,
    clientId: string,
    customFieldsJson: string = '{}',
    status: ClaimStatus = ClaimStatus.Pending,
    creationDate: string = new Date().toISOString(),
    id?: string,
    files?: string[]
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.claimType = claimType;
    this.product = product;
    this.severity = severity;
    this.status = status;
    this.creationDate = creationDate;
    this.clientId = clientId;
    this.customFieldsJson = customFieldsJson;
    this.files = files;
  }

  // Méthode pour créer un objet Claim à partir d'un objet JSON
  static fromJson(json: any): Claim {
    return new Claim(
      json.title,
      json.description,
      json.claimType,
      json.product,
      json.severity,
      json.clientId,
      json.customFieldsJson || '{}',
      json.status as ClaimStatus,
      json.creationDate,
      json.id,
      json.files
    );
  }

  // Méthode pour convertir l'objet Claim en JSON
  toJson(): any {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      claimType: this.claimType,
      product: this.product,
      severity: this.severity,
      status: this.status,
      creationDate: this.creationDate,
      clientId: this.clientId,
      customFieldsJson: this.customFieldsJson,
      files: this.files
    };
  }

  // Méthodes utilitaires pour les champs personnalisés
  getCustomField<T>(key: string, defaultValue?: T): T {
    return this.customFields[key] ?? defaultValue;
  }

  setCustomField(key: string, value: any): void {
    const fields = this.customFields;
    fields[key] = value;
    this.customFields = fields;
  }

  removeCustomField(key: string): boolean {
    const fields = this.customFields;
    const exists = key in fields;
    if (exists) {
      delete fields[key];
      this.customFields = fields;
    }
    return exists;
  }

  hasCustomField(key: string): boolean {
    return key in this.customFields;
  }
}