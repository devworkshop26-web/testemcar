import React, { useMemo } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Grid, LayoutList, List } from 'lucide-react';

import type { ReservationVehicle } from '../reservationTypes';

export type CalendarView = 'MONTH' | 'WEEK' | 'DAY';

export type AvailabilitySectionProps = {
  vehicle: ReservationVehicle;
  calendarView: CalendarView;
  currentCalendarDate: Date;
  pickupDate: string;
  returnDate: string;
  onChangeCalendarDate: (delta: number) => void;
  onDateClick: (dateStr: string) => void;
  onCalendarViewChange: (view: CalendarView) => void;
};

const MONTH_NAMES = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre'
];

const AvailabilitySection: React.FC<AvailabilitySectionProps> = ({
  vehicle,
  calendarView,
  currentCalendarDate,
  pickupDate,
  returnDate,
  onChangeCalendarDate,
  onDateClick,
  onCalendarViewChange
}) => {
  const unavailableDates = useMemo(() => vehicle.unavailableDates || [], [vehicle.unavailableDates]);

  const renderCalendar = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();

    if (calendarView === 'MONTH') {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const firstDayOfMonth = new Date(year, month, 1).getDay();
      const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

      const grid = [];
      for (let i = 0; i < startDay; i++) {
        grid.push(<div key={`empty-${i}`} className="h-12 md:h-16"></div>);
      }

      for (let i = 1; i <= daysInMonth; i++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const isUnavailable = unavailableDates.includes(dateStr);
        const isSelectedStart = dateStr === pickupDate;
        const isSelectedEnd = dateStr === returnDate;
        const isInRange = dateStr > pickupDate && dateStr < returnDate;
        const isPast = new Date(dateStr) < today;

        grid.push(
          <button
            key={i}
            disabled={isUnavailable || isPast}
            onClick={() => onDateClick(dateStr)}
            className={`h-12 md:h-16 rounded-xl flex flex-col items-center justify-center text-sm font-bold border transition-all relative group
                ${isUnavailable || isPast ? 'bg-gray-50 text-gray-300 border-transparent cursor-not-allowed' : isSelectedStart || isSelectedEnd ? 'bg-secondary-900 text-white border-secondary-900 shadow-lg scale-105 z-10' : isInRange ? 'bg-primary-50 text-primary-700 border-primary-100' : 'bg-white border-gray-100 text-gray-700 hover:border-primary-400 hover:shadow-md'}`}
          >
            {i}
            {isUnavailable && <span className="absolute bottom-1 w-1 h-1 bg-red-400 rounded-full"></span>}
            {(isSelectedStart || isSelectedEnd) && <span className="text-[8px] font-normal uppercase mt-1">{isSelectedStart ? 'Départ' : 'Retour'}</span>}
          </button>
        );
      }

      return (
        <div className="animate-in fade-in duration-300">
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((d) => (
              <div key={d} className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">{grid}</div>
        </div>
      );
    }

    if (calendarView === 'WEEK') {
      const startOfWeek = new Date(currentCalendarDate);
      const day = startOfWeek.getDay();
      const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
      startOfWeek.setDate(diff);

      const days = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];
        const isUnavailable = unavailableDates.includes(dateStr);
        const isSelectedStart = dateStr === pickupDate;
        const isSelectedEnd = dateStr === returnDate;
        const isInRange = dateStr > pickupDate && dateStr < returnDate;

        days.push(
          <button
            key={i}
            disabled={isUnavailable}
            onClick={() => onDateClick(dateStr)}
            className={`flex-1 py-4 px-2 rounded-2xl flex flex-col items-center justify-between min-h-[120px] transition-all border
                ${isUnavailable ? 'bg-gray-50 border-gray-100 opacity-50' : isSelectedStart || isSelectedEnd ? 'bg-secondary-900 text-white border-secondary-900 shadow-lg scale-105' : isInRange ? 'bg-primary-50 border-primary-200 text-primary-800' : 'bg-white border-gray-200 hover:border-primary-500 hover:shadow-md'}`}
          >
            <span className="text-xs uppercase font-bold opacity-70">{['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'][d.getDay()]}</span>
            <span className="text-2xl font-black my-2">{d.getDate()}</span>
            <span
              className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${isUnavailable ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}
            >
              {isUnavailable ? 'Indispo' : 'Libre'}
            </span>
          </button>
        );
      }
      return <div className="flex gap-2 md:gap-4 overflow-x-auto pb-4 pt-2 animate-in slide-in-from-right-4 duration-300">{days}</div>;
    }

    const hours = [];
    const dateStr = currentCalendarDate.toISOString().split('T')[0];
    const isUnavailableDay = unavailableDates.includes(dateStr);

    for (let h = 7; h <= 20; h++) {
      const timeLabel = `${h}:00`;
      const isBooked = isUnavailableDay;

      hours.push(
        <div
          key={h}
          className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 px-2 rounded-lg transition-colors"
        >
          <span className="text-sm font-bold text-gray-500 w-12 text-right">{timeLabel}</span>
          <div className={`flex-1 h-3 rounded-full relative ${isBooked ? 'bg-gray-200' : 'bg-green-100'}`}>
            <div className={`absolute inset-y-0 left-0 rounded-full ${isBooked ? 'bg-red-400 w-full' : 'bg-green-400 w-full opacity-30'}`}></div>
          </div>
          <span className={`text-xs font-bold uppercase ${isBooked ? 'text-red-500' : 'text-green-600'}`}>
            {isBooked ? 'Occupé' : 'Disponible'}
          </span>
        </div>
      );
    }
    return (
      <div className="space-y-1 bg-white rounded-xl border border-gray-100 p-4 max-h-[400px] overflow-y-auto custom-scrollbar animate-in slide-in-from-bottom-4 duration-300">
        {hours}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h3 className="font-bold text-xl text-secondary-900 flex items-center gap-3">
            <span className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center text-primary-600">
              <Calendar size={20} />
            </span>
            Disponibilités
          </h3>
          <p className="text-gray-500 text-sm mt-2 ml-14">Sélectionnez vos dates directement dans le calendrier.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 bg-gray-50 p-1.5 rounded-2xl w-full md:w-auto">
          <div className="flex bg-white rounded-xl shadow-sm p-1">
            <button
              onClick={() => onCalendarViewChange('DAY')}
              className={`p-2 rounded-lg transition-all ${calendarView === 'DAY' ? 'bg-secondary-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
              title="Jour"
            >
              <LayoutList size={18} />
            </button>
            <button
              onClick={() => onCalendarViewChange('WEEK')}
              className={`p-2 rounded-lg transition-all ${calendarView === 'WEEK' ? 'bg-secondary-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
              title="Semaine"
            >
              <List size={18} />
            </button>
            <button
              onClick={() => onCalendarViewChange('MONTH')}
              className={`p-2 rounded-lg transition-all ${calendarView === 'MONTH' ? 'bg-secondary-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
              title="Mois"
            >
              <Grid size={18} />
            </button>
          </div>
          <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
            <button onClick={() => onChangeCalendarDate(-1)} className="p-2 hover:bg-white rounded-xl transition-colors text-gray-600">
              <ChevronLeft size={20} />
            </button>
            <span className="font-bold text-sm min-w-[100px] text-center text-gray-800">
              {calendarView === 'MONTH'
                ? `${MONTH_NAMES[currentCalendarDate.getMonth()]} ${currentCalendarDate.getFullYear()}`
                : currentCalendarDate.toLocaleDateString('fr-FR')}
            </span>
            <button onClick={() => onChangeCalendarDate(1)} className="p-2 hover:bg-white rounded-xl transition-colors text-gray-600">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-50/50 rounded-3xl p-4 md:p-6 border border-gray-100 min-h-[300px]">{renderCalendar()}</div>

      <div className="flex items-center gap-6 mt-6 ml-4 text-sm font-medium text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-white border border-gray-300"></div> Disponible
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-secondary-900"></div> Sélectionné
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-200"></div> Indisponible
        </div>
      </div>
    </div>
  );
};

export default AvailabilitySection;
