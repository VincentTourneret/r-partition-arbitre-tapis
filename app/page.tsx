'use client';

import { useState } from 'react';
import { Arbitre, Tapis, ResultatRepartition } from './types';
import { repartirArbitres } from './algorithme';
import { ArbitreForm } from './components/ArbitreForm';
import { TapisForm } from './components/TapisForm';
import { ResultatsAffichage } from './components/ResultatsAffichage';
import { Plus, Users, Target } from 'lucide-react';

export default function Home() {
  const [arbitres, setArbitres] = useState<Arbitre[]>([]);
  const [nombreTapis, setNombreTapis] = useState<number>(2);
  const [resultat, setResultat] = useState<ResultatRepartition | null>(null);
  const [erreur, setErreur] = useState<string>('');

  const handleAjouterArbitre = (arbitre: Arbitre) => {
    setArbitres(prev => [...prev, { ...arbitre, id: `arbitre-${Date.now()}` }]);
    setErreur('');
  };

  const handleSupprimerArbitre = (id: string) => {
    setArbitres(prev => prev.filter(arbitre => arbitre.id !== id));
    setErreur('');
  };

  const handleCalculerRepartition = () => {
    try {
      setErreur('');
      const resultatCalcul = repartirArbitres(arbitres, nombreTapis);
      setResultat(resultatCalcul);
    } catch (error) {
      setErreur(error instanceof Error ? error.message : 'Erreur lors du calcul');
      setResultat(null);
    }
  };

  const arbitresNiveau4 = arbitres.filter(arbitre => arbitre.niveau === 4).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Répartition d'Arbitres Judo
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Optimisez la répartition de vos arbitres sur les tapis en respectant les contraintes de niveau et d'équilibre
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Section de saisie */}
          <div className="space-y-6">
            {/* Configuration des tapis */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Configuration des Tapis
                </h2>
              </div>
              <TapisForm 
                nombreTapis={nombreTapis} 
                onNombreTapisChange={setNombreTapis}
              />
            </div>

            {/* Saisie des arbitres */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Arbitres ({arbitres.length})
                </h2>
              </div>
              
              <ArbitreForm onAjouterArbitre={handleAjouterArbitre} />
              
              {/* Liste des arbitres */}
              {arbitres.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300">
                    Arbitres ajoutés :
                  </h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {arbitres.map(arbitre => (
                      <div 
                        key={arbitre.id}
                        className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-3"
                      >
                        <div className="flex-1">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {arbitre.nom}
                          </span>
                          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                            Niveau {arbitre.niveau} - Note {arbitre.note}/10
                          </span>
                        </div>
                        <button
                          onClick={() => handleSupprimerArbitre(arbitre.id)}
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Supprimer
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bouton de calcul */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="space-y-4">
                {/* Vérifications */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className={`w-2 h-2 rounded-full ${arbitres.length >= nombreTapis ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className={arbitres.length >= nombreTapis ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
                      {arbitres.length >= nombreTapis ? '✓' : '✗'} 
                      Assez d'arbitres ({arbitres.length}/{nombreTapis} minimum)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className={`w-2 h-2 rounded-full ${arbitresNiveau4 >= nombreTapis ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className={arbitresNiveau4 >= nombreTapis ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
                      {arbitresNiveau4 >= nombreTapis ? '✓' : '✗'} 
                      Arbitres niveau 4 ({arbitresNiveau4}/{nombreTapis} requis)
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCalculerRepartition}
                  disabled={arbitres.length < nombreTapis || arbitresNiveau4 < nombreTapis}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  Calculer la Répartition
                </button>

                {erreur && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-red-700 dark:text-red-400 text-sm">{erreur}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section des résultats */}
          <div className="lg:col-span-1">
            {resultat ? (
              <ResultatsAffichage resultat={resultat} />
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Les résultats de répartition apparaîtront ici</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}