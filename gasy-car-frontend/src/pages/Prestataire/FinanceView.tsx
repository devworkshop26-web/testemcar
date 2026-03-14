import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, CheckCircle2 } from "lucide-react";
import React from "react";  

const FinanceView = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-gray-900 font-poppins">Rapports Financiers</h2>
      
      {/* Cartes KPI Finance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-blue-600 text-white border-none shadow-lg rounded-2xl">
            <CardContent className="p-6">
                <p className="text-blue-100 text-sm font-medium mb-1">Chiffre d'affaires (Nov)</p>
                <h3 className="text-3xl font-bold font-poppins">4,250,000 Ar</h3>
                <div className="mt-4 flex items-center text-sm text-blue-100 bg-white/10 w-fit px-2 py-1 rounded-lg">
                    <ArrowUpRight className="w-4 h-4 mr-1" /> +12% vs mois dernier
                </div>
            </CardContent>
        </Card>
        <Card className="border-none shadow-md rounded-2xl">
            <CardContent className="p-6">
                <p className="text-gray-500 text-sm font-medium mb-1">Dépenses maintenance</p>
                <h3 className="text-3xl font-bold font-poppins text-gray-900">850,000 Ar</h3>
                <div className="mt-4 flex items-center text-sm text-red-600 bg-red-50 w-fit px-2 py-1 rounded-lg">
                    <ArrowUpRight className="w-4 h-4 mr-1" /> +5% imprévus
                </div>
            </CardContent>
        </Card>
        <Card className="border-none shadow-md rounded-2xl">
            <CardContent className="p-6">
                <p className="text-gray-500 text-sm font-medium mb-1">Bénéfice Net</p>
                <h3 className="text-3xl font-bold font-poppins text-emerald-600">3,400,000 Ar</h3>
                <div className="mt-4 flex items-center text-sm text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 mr-1" /> Marge saine
                </div>
            </CardContent>
        </Card>
      </div>

      {/* Historique des transactions */}
      <Card className="border-none shadow-md rounded-2xl">
        <CardHeader>
            <CardTitle className="text-lg font-bold">Historique des transactions</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                {[1,2,3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                        <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-full ${i === 2 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                {i === 2 ? <ArrowUpRight className="w-5 h-5"/> : <ArrowDownRight className="w-5 h-5"/>}
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">{i === 2 ? "Réparation Garage Auto" : "Paiement Location #LOC-004"}</p>
                                <p className="text-xs text-gray-500">24 Nov 2023 • 14:30</p>
                            </div>
                        </div>
                        <span className={`font-bold ${i === 2 ? 'text-red-600' : 'text-emerald-600'}`}>
                            {i === 2 ? "- 150,000 Ar" : "+ 450,000 Ar"}
                        </span>
                    </div>
                ))}
            </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceView;