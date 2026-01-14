export type TraitId =
  | "disciplinado"
  | "impulsivo"
  | "persistente"
  | "econômico";

export interface Trait {
  id: TraitId;
  name: string;
  description: string;
}
