'use client';

import { useState } from 'react';
import { Arbitre } from '../types';
import { ArbitreSchema } from '../types';
import { Plus, AlertCircle } from 'lucide-react';

interface ArbitreFormProps {
  onAjouterArbitre: (arbitre: Arbitre) => void;
}

export const ArbitreForm: React.FC<ArbitreFormProps> = ({ onAjouterArbitre }) => {
  const [nom, setNom] = useState('');
  const [niveau, setNiveau] = useState<number>(1);
  const [note, setNote] = useState<number>(5);
  const [erreur, setErreur] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErreur('');

    try {
      const nouvelArbitre = ArbitreSchema.parse({
        id: '', // Sera généré par le parent
        nom: nom.trim(),
        niveau,
        note,
      });

      onAjouterArbitre(nouvelArbitre);
      
      // Reset form
      setNom('');
      setNiveau(1);
      setNote(5);
    } catch (error) {
      if (error instanceof Error) {
        setErreur(error.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nom" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Nom de l'arbitre
        </label>
        <input
          type="text"
          id="nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          placeholder="Ex: Jean Dupont"
          required
        />
      </div>

      <div>
        <label htmlFor="niveau" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Niveau (1-4)
        </label>
        <select
          id="niveau"
          value={niveau}
          onChange={(e) => setNiveau(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        >
          <option value={1}>Niveau 1 (Facteur: 1.0)</option>
          <option value={2}>Niveau 2 (Facteur: 1.2)</option>
          <option value={3}>Niveau 3 (Facteur: 1.4)</option>
          <option value={4}>Niveau 4 (Facteur: 1.6)</option>
        </select>
      </div>

      <div>
        <label htmlFor="note" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Note (0-10)
        </label>
        <input
          type="number"
          id="note"
          min="0"
          max="10"
          step="0.1"
          value={note}
          onChange={(e) => setNote(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Score calculé: {(niveau === 1 ? 1 : niveau === 2 ? 1.2 : niveau === 3 ? 1.4 : 1.6) * note}
        </p>
      </div>

      {erreur && (
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{erreur}</span>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Ajouter l'arbitre
      </button>
    </form>
  );
};
