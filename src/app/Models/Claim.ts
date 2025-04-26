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
  claimTypeId: string;
  productId: string;
  severityId: string;
  status: ClaimStatus;
  creationDate: string;
  clientId: string;
  files?: string[]; // URLs des fichiers joints

  constructor(
    title: string,
    description: string,
    claimTypeId: string,
    productId: string,
    severityId: string,
    clientId: string,
    status: ClaimStatus = ClaimStatus.Pending,
    creationDate: string = new Date().toISOString(),
    id?: string,
    files?: string[]
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.claimTypeId = claimTypeId;
    this.productId = productId;
    this.severityId = severityId;
    this.status = status;
    this.creationDate = creationDate;
    this.clientId = clientId;
    this.files = files;
  }

  // Méthode pour créer un objet Claim à partir d'un objet JSON
  static fromJson(json: any): Claim {
    return new Claim(
      json.title,
      json.description,
      json.claimTypeId,
      json.productId,
      json.severityId,
      json.clientId,
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
      claimTypeId: this.claimTypeId,
      productId: this.productId,
      severityId: this.severityId,
      status: this.status,
      creationDate: this.creationDate,
      clientId: this.clientId,
      files: this.files
    };
  }
}