import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Phone, MapPin, Eye } from "lucide-react";
import { Driver } from "@/Actions/driverApi";

interface DriverListProps {
    drivers: Driver[] | undefined;
    onEdit: (driver: Driver) => void;
    onDelete: (id: string) => void;
    onView?: (driver: Driver) => void;
}

const DriverList = ({ drivers, onEdit, onDelete, onView }: DriverListProps) => {
    return (
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Chauffeur</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Expérience</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {drivers && drivers.length > 0 ? (
                        drivers.map((driver) => (
                            <TableRow key={driver.id}>
                                <TableCell className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={driver.profile_photo || undefined} />
                                        <AvatarFallback>{driver.first_name[0]}{driver.last_name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{driver.first_name} {driver.last_name}</span>
                                        {driver.nationality && <span className="text-xs text-gray-500">{driver.nationality}</span>}
                                        {driver.license_category && <span className="text-xs font-mono bg-gray-100 px-1 rounded mt-1 w-fit">Permis {driver.license_category}</span>}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col text-sm">
                                        <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-gray-400" /> {driver.phone_number}</span>
                                        {driver.city && <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-gray-400" /> {driver.city}</span>}
                                    </div>
                                </TableCell>
                                <TableCell>{driver.experience_years} ans</TableCell>
                                <TableCell>
                                    <Badge variant={driver.is_available ? "default" : "secondary"} className={driver.is_available ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}>
                                        {driver.is_available ? "Disponible" : "Indisponible"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => onView?.(driver)}>
                                            <Eye className="w-4 h-4 text-gray-600" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => onEdit(driver)}>
                                            <Edit className="w-4 h-4 text-blue-600" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => onDelete(driver.id)}>
                                            <Trash2 className="w-4 h-4 text-red-600" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                Aucun chauffeur trouvé
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default DriverList;
