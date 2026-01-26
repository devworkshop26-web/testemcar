import React from 'react';
import { ArrowLeft, ArrowRight, CreditCard, Lock, MapPin, ShieldCheck, Smartphone } from 'lucide-react';

import type { TravelZone } from '../reservationTypes';

export type PaymentStepProps = {
  coverImage: string;
  vehicleTitle: string;
  vehicleLocation: string;
  durationLabel: string;
  travelZone: TravelZone;
  pickupDate: string;
  returnDate: string;
  totalPrice: number;
  onBack: () => void;
  onConfirm: () => void;
};

const PaymentStep: React.FC<PaymentStepProps> = ({
  coverImage,
  vehicleTitle,
  vehicleLocation,
  durationLabel,
  travelZone,
  pickupDate,
  returnDate,
  totalPrice,
  onBack,
  onConfirm
}) => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center text-gray-500 hover:text-secondary-900 mb-8 font-bold transition-colors group"
        >
          <div className="bg-white p-2 rounded-full shadow-sm mr-3 group-hover:scale-110 transition-transform">
            <ArrowLeft size={18} />
          </div>
          Retour à la configuration
        </button>

        <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
          <div className="md:w-5/12 bg-gray-50/80 backdrop-blur-sm p-8 border-r border-gray-100 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -mr-32 -mt-32"></div>

            <h3 className="font-bold text-gray-900 mb-6 text-xl relative z-10">Récapitulatif</h3>
            <div className="rounded-2xl overflow-hidden mb-6 shadow-md border border-white relative z-10">
              <img
                src={coverImage}
                alt={vehicleTitle}
                className="w-full h-40 object-cover transform hover:scale-110 transition-transform duration-700"
              />
            </div>

            <div className="relative z-10">
              <h4 className="font-black text-gray-900 text-xl mb-1">{vehicleTitle}</h4>
              <p className="text-sm text-gray-500 mb-6 flex items-center gap-1 font-medium">
                <MapPin size={14} className="text-primary-500" /> {vehicleLocation}
              </p>

              <div className="space-y-4 text-sm flex-1 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Durée</span>
                  <span className="font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded">{durationLabel}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Zone</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded ${
                      travelZone === 'PROVINCE' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {travelZone === 'PROVINCE' ? 'Province' : 'Urbain'}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 border-b border-dashed border-gray-200 pb-2">
                  <span>Dates</span>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">{pickupDate}</div>
                    <div className="font-bold text-gray-900">{returnDate}</div>
                  </div>
                </div>
                <div className="flex justify-between items-end pt-2">
                  <span className="text-gray-500 font-medium">Total Estimé</span>
                  <span className="font-black text-2xl text-secondary-900">{totalPrice.toLocaleString()} Ar</span>
                </div>
              </div>
            </div>
          </div>

          <div className="md:w-7/12 p-8 md:p-10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-secondary-900">Paiement Sécurisé</h2>
              <Lock size={20} className="text-green-500" />
            </div>

            <div className="flex gap-4 mb-8">
              <button className="flex-1 py-4 px-4 border-2 border-primary-600 bg-primary-50 text-primary-700 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm">
                <Smartphone size={20} /> Mobile Money
              </button>
              <button className="flex-1 py-4 px-4 border-2 border-transparent bg-gray-50 text-gray-500 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-all">
                <CreditCard size={20} /> Carte Bancaire
              </button>
            </div>

            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onConfirm(); }}>
              <div className="space-y-4">
                <label className="flex items-center gap-4 p-4 border-2 border-gray-100 rounded-2xl cursor-pointer hover:border-primary-500 hover:bg-primary-50/10 transition-all group relative overflow-hidden">
                  <div className="absolute inset-0 bg-primary-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <input type="radio" name="provider" className="w-5 h-5 accent-primary-600 relative z-10" defaultChecked />
                  <div className="flex-1 font-bold text-gray-800 group-hover:text-primary-900 relative z-10">MVola</div>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Mvola_logo.png/640px-Mvola_logo.png"
                    className="h-8 object-contain relative z-10"
                    alt="Mvola"
                  />
                </label>
                <label className="flex items-center gap-4 p-4 border-2 border-gray-100 rounded-2xl cursor-pointer hover:border-primary-500 hover:bg-primary-50/10 transition-all group relative overflow-hidden">
                  <div className="absolute inset-0 bg-primary-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <input type="radio" name="provider" className="w-5 h-5 accent-primary-600 relative z-10" />
                  <div className="flex-1 font-bold text-gray-800 group-hover:text-primary-900 relative z-10">Orange Money</div>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_Money_logo.png/800px-Orange_Money_logo.png"
                    className="h-8 object-contain relative z-10"
                    alt="Orange Money"
                  />
                </label>
              </div>

              <div className="space-y-2 mt-6">
                <label className="font-bold text-gray-700 text-xs uppercase tracking-wider ml-1">Numéro de mobile</label>
                <input
                  type="tel"
                  placeholder="034 00 000 00"
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-xl p-4 font-bold text-lg outline-none transition-all placeholder-gray-300"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-secondary-900 to-secondary-800 text-white font-bold py-5 rounded-2xl text-lg hover:shadow-lg hover:shadow-secondary-900/30 transition-all flex items-center justify-center gap-3 transform active:scale-[0.98]"
                >
                  <span>Payer l'acompte</span>
                  <span className="bg-white/20 px-2 py-0.5 rounded text-sm">{(totalPrice * 0.3).toLocaleString()} Ar</span>
                  <ArrowRight size={20} />
                </button>
                <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                  <ShieldCheck size={12} /> Transaction cryptée SSL et sécurisée
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStep;
