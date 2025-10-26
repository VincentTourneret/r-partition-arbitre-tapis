'use client';

import { Target } from 'lucide-react';

interface TapisFormProps {
  nombreTapis: number;
  onNombreTapisChange: (nombre: number) => void;
}

export const TapisForm: React.FC<TapisFormProps> = ({ nombreTapis, onNombreTapisChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="nombreTapis" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Nombre de tapis
        </label>
        <input
          type="number"
          id="nombreTapis"
          min="1"
          max="20"
          value={nombreTapis}
          onChange={(e) => onNombreTapisChange(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <Target className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
              Contraintes de répartition
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Au moins 1 arbitre niveau 4 par tapis</li>
              <li>• Équilibrage des scores (facteur × note)</li>
              <li>• Répartition équitable du nombre d'arbitres</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
