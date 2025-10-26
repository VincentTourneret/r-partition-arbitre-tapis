import { z } from 'zod';

// Schémas de validation Zod
export const ArbitreSchema = z.object({
  id: z.string(),
  nom: z.string().min(1, 'Le nom est requis'),
  niveau: z.number().int().min(1).max(4, 'Le niveau doit être entre 1 et 4'),
  note: z.number().min(0).max(10, 'La note doit être entre 0 et 10'),
});

export const TapisSchema = z.object({
  id: z.string(),
  nom: z.string().min(1, 'Le nom du tapis est requis'),
  arbitres: z.array(ArbitreSchema),
});

export const RepartitionSchema = z.object({
  tapis: z.array(TapisSchema),
  arbitres: z.array(ArbitreSchema),
});

// Types TypeScript dérivés des schémas
export type Arbitre = z.infer<typeof ArbitreSchema>;
export type Tapis = z.infer<typeof TapisSchema>;
export type Repartition = z.infer<typeof RepartitionSchema>;

// Facteurs de niveau selon les spécifications
export const FACTEURS_NIVEAU: Record<number, number> = {
  1: 1,
  2: 1.2,
  3: 1.4,
  4: 1.6,
};

// Interface pour les statistiques de répartition
export interface StatistiquesRepartition {
  scoreTotal: number;
  scoreMoyen: number;
  ecartType: number;
  arbitresParTapis: number[];
  arbitresNiveau4ParTapis: number[];
  differenceMaxArbitres: number;
}

// Interface pour les résultats de l'algorithme
export interface ResultatRepartition {
  repartition: Repartition;
  statistiques: StatistiquesRepartition;
  score: number; // Score de qualité de la répartition (plus bas = meilleur)
}
