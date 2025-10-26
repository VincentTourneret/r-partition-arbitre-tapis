'use client';

import { ResultatRepartition, FACTEURS_NIVEAU } from '../types';
import { calculerScoreArbitre } from '../algorithme';
import { Users, Target, TrendingUp, BarChart3, Award } from 'lucide-react';

interface ResultatsAffichageProps {
  resultat: ResultatRepartition;
}

export const ResultatsAffichage: React.FC<ResultatsAffichageProps> = ({ resultat }) => {
  const { repartition, statistiques } = resultat;

  return (
    <div className="space-y-6">
      {/* Statistiques globales */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Statistiques Globales
          </h2>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {statistiques.scoreMoyen.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Score moyen par tapis
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {statistiques.ecartType.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Écart-type des scores
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {statistiques.differenceMaxArbitres}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Différence max arbitres
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {resultat.score.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Score de qualité
            </div>
          </div>
        </div>
      </div>

      {/* Répartition par tapis */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Répartition par Tapis
          </h2>
        </div>
        
        {repartition.tapis.map((tapis, index) => {
          const scoreTapis = tapis.arbitres.reduce((total, arbitre) => total + calculerScoreArbitre(arbitre), 0);
          const arbitresNiveau4 = tapis.arbitres.filter(arbitre => arbitre.niveau === 4).length;
          
          return (
            <div key={tapis.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {tapis.nom}
                </h3>
                <div className="flex items-center gap-4 text-sm">
                  <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full">
                    Score: {scoreTapis.toFixed(1)}
                  </div>
                  <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-3 py-1 rounded-full">
                    {tapis.arbitres.length} arbitre{tapis.arbitres.length > 1 ? 's' : ''}
                  </div>
                  <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full">
                    Niveau 4: {arbitresNiveau4}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                {tapis.arbitres.map(arbitre => {
                  const score = calculerScoreArbitre(arbitre);
                  const facteur = FACTEURS_NIVEAU[arbitre.niveau];
                  
                  return (
                    <div 
                      key={arbitre.id}
                      className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-3"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {arbitre.nom}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Niveau {arbitre.niveau} • Note {arbitre.note}/10
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {score.toFixed(1)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {facteur} × {arbitre.note}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Légende */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 dark:text-white mb-2">
          Légende des facteurs de niveau
        </h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Niveau 1:</span>
            <span className="font-medium text-gray-900 dark:text-white">× 1.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Niveau 2:</span>
            <span className="font-medium text-gray-900 dark:text-white">× 1.2</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Niveau 3:</span>
            <span className="font-medium text-gray-900 dark:text-white">× 1.4</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Niveau 4:</span>
            <span className="font-medium text-gray-900 dark:text-white">× 1.6</span>
          </div>
        </div>
      </div>
    </div>
  );
};
