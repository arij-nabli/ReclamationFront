export class ClaimType {
    id?: string;
    name?: string;
    description?: string;
    claims?: any[]; // Tu peux remplacer par un modèle `Claim` si tu le crées plus tard
    deciders?: any[];
    decisionValidators?: any[];
    closureResponsibleAgents?: any[];
  }