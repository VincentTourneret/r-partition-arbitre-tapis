import { Arbitre, Tapis, Repartition, ResultatRepartition, StatistiquesRepartition, FACTEURS_NIVEAU } from './types';

/**
 * Calcule le score d'un arbitre (facteur × note)
 */
export const calculerScoreArbitre = (arbitre: Arbitre): number => {
  return FACTEURS_NIVEAU[arbitre.niveau] * arbitre.note;
};

/**
 * Calcule le score total d'un tapis
 */
export const calculerScoreTapis = (tapis: Tapis): number => {
  return tapis.arbitres.reduce((total, arbitre) => total + calculerScoreArbitre(arbitre), 0);
};

/**
 * Calcule les statistiques d'une répartition
 */
export const calculerStatistiques = (repartition: Repartition): StatistiquesRepartition => {
  const scoresTapis = repartition.tapis.map(calculerScoreTapis);
  const scoreTotal = scoresTapis.reduce((total, score) => total + score, 0);
  const scoreMoyen = scoreTotal / repartition.tapis.length;
  
  // Calcul de l'écart-type
  const variance = scoresTapis.reduce((total, score) => total + Math.pow(score - scoreMoyen, 2), 0) / repartition.tapis.length;
  const ecartType = Math.sqrt(variance);
  
  // Nombre d'arbitres par tapis
  const arbitresParTapis = repartition.tapis.map(tapis => tapis.arbitres.length);
  
  // Nombre d'arbitres niveau 4 par tapis
  const arbitresNiveau4ParTapis = repartition.tapis.map(tapis => 
    tapis.arbitres.filter(arbitre => arbitre.niveau === 4).length
  );
  
  // Différence maximale entre le nombre d'arbitres par tapis
  const differenceMaxArbitres = Math.max(...arbitresParTapis) - Math.min(...arbitresParTapis);
  
  return {
    scoreTotal,
    scoreMoyen,
    ecartType,
    arbitresParTapis,
    arbitresNiveau4ParTapis,
    differenceMaxArbitres,
  };
};

/**
 * Calcule le score de qualité d'une répartition (plus bas = meilleur)
 */
export const calculerScoreQualite = (statistiques: StatistiquesRepartition): number => {
  const { ecartType, differenceMaxArbitres, arbitresNiveau4ParTapis } = statistiques;
  
  // Pénalité pour l'écart-type des scores (objectif : minimiser les différences)
  const penaliteEcartType = ecartType * 10;
  
  // Pénalité pour la différence du nombre d'arbitres (objectif : équilibrer)
  const penaliteDifferenceArbitres = differenceMaxArbitres * 5;
  
  // Pénalité pour les tapis sans arbitre niveau 4 (contrainte obligatoire)
  const tapisSansNiveau4 = arbitresNiveau4ParTapis.filter(count => count === 0).length;
  const penaliteNiveau4 = tapisSansNiveau4 * 1000; // Pénalité très élevée
  
  return penaliteEcartType + penaliteDifferenceArbitres + penaliteNiveau4;
};

/**
 * Génère une répartition aléatoire initiale
 */
const genererRepartitionInitiale = (arbitres: Arbitre[], nombreTapis: number): Repartition => {
  const tapis: Tapis[] = Array.from({ length: nombreTapis }, (_, index) => ({
    id: `tapis-${index + 1}`,
    nom: `Tapis ${index + 1}`,
    arbitres: [],
  }));
  
  // Mélanger les arbitres pour une répartition aléatoire
  const arbitresMelanges = [...arbitres].sort(() => Math.random() - 0.5);
  
  // Répartir les arbitres de manière cyclique
  arbitresMelanges.forEach((arbitre, index) => {
    const tapisIndex = index % nombreTapis;
    tapis[tapisIndex].arbitres.push(arbitre);
  });
  
  return { tapis, arbitres };
};

/**
 * Améliore une répartition en déplaçant un arbitre d'un tapis à un autre
 */
const ameliorerRepartition = (repartition: Repartition): Repartition => {
  const nouvelleRepartition = JSON.parse(JSON.stringify(repartition)) as Repartition;
  const statistiquesActuelles = calculerStatistiques(nouvelleRepartition);
  
  let meilleureRepartition = nouvelleRepartition;
  let meilleurScore = calculerScoreQualite(statistiquesActuelles);
  
  // Essayer de déplacer chaque arbitre vers chaque autre tapis
  for (let tapisSourceIndex = 0; tapisSourceIndex < nouvelleRepartition.tapis.length; tapisSourceIndex++) {
    const tapisSource = nouvelleRepartition.tapis[tapisSourceIndex];
    
    for (let arbitreIndex = 0; arbitreIndex < tapisSource.arbitres.length; arbitreIndex++) {
      const arbitre = tapisSource.arbitres[arbitreIndex];
      
      for (let tapisDestinationIndex = 0; tapisDestinationIndex < nouvelleRepartition.tapis.length; tapisDestinationIndex++) {
        if (tapisSourceIndex === tapisDestinationIndex) continue;
        
        // Créer une copie pour tester ce déplacement
        const repartitionTest = JSON.parse(JSON.stringify(nouvelleRepartition)) as Repartition;
        
        // Déplacer l'arbitre
        repartitionTest.tapis[tapisSourceIndex].arbitres.splice(arbitreIndex, 1);
        repartitionTest.tapis[tapisDestinationIndex].arbitres.push(arbitre);
        
        // Calculer le nouveau score
        const nouvellesStatistiques = calculerStatistiques(repartitionTest);
        const nouveauScore = calculerScoreQualite(nouvellesStatistiques);
        
        // Si c'est meilleur, garder cette répartition
        if (nouveauScore < meilleurScore) {
          meilleureRepartition = repartitionTest;
          meilleurScore = nouveauScore;
        }
      }
    }
  }
  
  return meilleureRepartition;
};

/**
 * Algorithme principal de répartition optimale
 */
export const repartirArbitres = (arbitres: Arbitre[], nombreTapis: number): ResultatRepartition => {
  if (arbitres.length === 0 || nombreTapis <= 0) {
    throw new Error('Nombre d\'arbitres ou de tapis invalide');
  }
  
  // Vérifier qu'il y a au moins un arbitre niveau 4 par tapis
  const arbitresNiveau4 = arbitres.filter(arbitre => arbitre.niveau === 4);
  if (arbitresNiveau4.length < nombreTapis) {
    throw new Error(`Il faut au moins ${nombreTapis} arbitres niveau 4 (actuellement: ${arbitresNiveau4.length})`);
  }
  
  // Générer une répartition initiale
  let repartition = genererRepartitionInitiale(arbitres, nombreTapis);
  let statistiques = calculerStatistiques(repartition);
  let scoreActuel = calculerScoreQualite(statistiques);
  
  // Améliorer la répartition par itérations
  const maxIterations = 1000;
  let iterations = 0;
  let amelioration = true;
  
  while (amelioration && iterations < maxIterations) {
    amelioration = false;
    iterations++;
    
    const nouvelleRepartition = ameliorerRepartition(repartition);
    const nouvellesStatistiques = calculerStatistiques(nouvelleRepartition);
    const nouveauScore = calculerScoreQualite(nouvellesStatistiques);
    
    if (nouveauScore < scoreActuel) {
      repartition = nouvelleRepartition;
      statistiques = nouvellesStatistiques;
      scoreActuel = nouveauScore;
      amelioration = true;
    }
  }
  
  return {
    repartition,
    statistiques,
    score: scoreActuel,
  };
};
