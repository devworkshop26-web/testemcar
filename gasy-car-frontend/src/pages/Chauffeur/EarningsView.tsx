import { DollarSign, LineChart, TrendingUp, TrendingDown, Clock, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const EarningsView = () => {
    
    // Données de démo
    const periodStats = [
        { title: "Total du mois", value: "2,500,000 Ar", icon: DollarSign, trend: 15, color: "text-green-600" },
        { title: "Courses Totales", value: "125", icon: Clock, trend: 8, color: "text-blue-600" },
        { title: "Moyenne par course", value: "20,000 Ar", icon: TrendingUp, trend: 3, color: "text-yellow-600" },
    ];

    const transactions = [
        { id: 1, type: "Course (LOC-987)", amount: "+25,000 Ar", date: "Aujourd'hui, 16:30", status: "Succès", color: "text-green-600" },
        { id: 2, type: "Frais de service", amount: "-5,000 Ar", date: "Aujourd'hui, 08:00", status: "Déduit", color: "text-red-600" },
        { id: 3, type: "Course (LOC-986)", amount: "+18,000 Ar", date: "Hier, 20:00", status: "Succès", color: "text-green-600" },
        { id: 4, type: "Retrait", amount: "-100,000 Ar", date: "20 Nov", status: "Payé", color: "text-blue-600" },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold font-poppins">Mes Revenus 💸</h2>
            
            {/* STATS PÉRIODE */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {periodStats.map((stat, index) => (
                    <Card key={index} className="border-none shadow-md rounded-2xl">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                <Badge variant="secondary" className="text-xs">{stat.trend}% <TrendingUp className="w-3 h-3 ml-1" /></Badge>
                            </div>
                            <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                            <p className="text-sm text-gray-500">{stat.title}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* GRAPHIC */}
                <Card className="border-none shadow-md rounded-2xl lg:col-span-2">
                    <CardHeader className="flex flex-row justify-between items-start">
                        <div>
                            <CardTitle>Performance Hebdomadaire</CardTitle>
                            <CardDescription>Visualisation de vos gains sur les 7 derniers jours.</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" className="rounded-xl"><Download className="w-4 h-4 mr-2"/> Rapport</Button>
                    </CardHeader>
                    <CardContent>
                        {/* Placeholder for chart */}
                        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl border border-dashed text-gray-400">
                            

[Image of Line Chart showing Weekly Earnings]

                        </div>
                    </CardContent>
                </Card>

                {/* TRANSACTIONS */}
                <Card className="border-none shadow-md rounded-2xl">
                    <CardHeader>
                        <CardTitle>Transactions Récentes</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {transactions.map((tx) => (
                            <div key={tx.id} className="flex justify-between items-center pb-2 border-b border-gray-100 last:border-b-0">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${tx.color.includes('green') ? 'bg-green-50' : tx.color.includes('red') ? 'bg-red-50' : 'bg-blue-50'}`}>
                                        <DollarSign className={`w-4 h-4 ${tx.color}`} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm text-gray-900">{tx.type}</p>
                                        <p className="text-xs text-gray-500">{tx.date}</p>
                                    </div>
                                </div>
                                <span className={`font-bold text-sm ${tx.color}`}>{tx.amount}</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default EarningsView;