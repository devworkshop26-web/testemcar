import React from 'react';
import { ArrowLeft, CheckCircle, ShieldCheck } from 'lucide-react';

export type ConfirmationStepProps = {
  vehicleTitle: string;
  ownerName: string;
  totalPrice: number;
  onBackHome: () => void;
  onDashboard: () => void;
  onReturn: () => void;
};

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  vehicleTitle,
  ownerName,
  totalPrice,
  onBackHome,
  onDashboard,
  onReturn
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="bg-white p-10 rounded-[2rem] shadow-2xl max-w-lg w-full text-center animate-in zoom-in duration-500 border border-gray-100">
        <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner ring-8 ring-green-50/50">
          <CheckCircle size={48} strokeWidth={3} />
        </div>
        <h2 className="text-3xl font-extrabold text-secondary-900 mb-3">C'est tout bon !</h2>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Votre demande pour le <strong>{vehicleTitle}</strong> a été envoyée. Le propriétaire {ownerName || 'Andry'} va la valider sous 24h.
        </p>

        <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left space-y-4 border border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm font-medium">Acompte bloqué</span>
            <span className="font-bold text-gray-900 text-lg">{(totalPrice * 0.3).toLocaleString()} Ar</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm font-medium">Reste à payer (Check-in)</span>
            <span className="font-bold text-gray-900">{(totalPrice * 0.7).toLocaleString()} Ar</span>
          </div>
          <div className="flex justify-between pt-4 border-t border-gray-200 mt-2">
            <span className="text-gray-500 text-xs uppercase font-bold tracking-wider">Réf. Dossier</span>
            <span className="font-mono text-primary-600 font-bold tracking-wider bg-primary-50 px-2 py-1 rounded">#MC-{Math.floor(Math.random() * 10000)}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onDashboard}
            className="flex-1 bg-white border-2 border-gray-200 text-gray-700 font-bold py-4 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            Suivre ma demande
          </button>
          <button
            onClick={onBackHome}
            className="flex-1 bg-secondary-900 text-white font-bold py-4 rounded-xl hover:bg-secondary-800 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Retour Accueil
          </button>
        </div>

        <button
          onClick={onReturn}
          className="mt-6 inline-flex items-center gap-2 text-sm text-gray-500 font-bold hover:text-secondary-900"
        >
          <ArrowLeft size={16} /> Revenir à la fiche
        </button>
      </div>
    </div>
  );
};

export default ConfirmationStep;
