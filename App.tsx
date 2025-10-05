
import React, { useState } from 'react';
import { EQUIPMENT_LIST } from './constants';
import type { Equipment } from './types';
import EquipmentList from './components/EquipmentList';
import ImageViewer from './components/ImageViewer';
import { LabIcon } from './components/icons';

const App: React.FC = () => {
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);

  const handleSelectEquipment = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col p-4 md:p-8 font-sans">
      <header className="flex items-center mb-6">
        <LabIcon />
        <h1 className="text-4xl font-extrabold ml-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-blue-400">
          Lab Equipment Explorer
        </h1>
      </header>
      <main className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
        <div className="md:col-span-1 h-full">
          <EquipmentList
            equipmentList={EQUIPMENT_LIST}
            selectedEquipment={selectedEquipment}
            onSelect={handleSelectEquipment}
          />
        </div>
        <div className="md:col-span-2 h-full">
          <ImageViewer equipment={selectedEquipment} />
        </div>
      </main>
    </div>
  );
};

export default App;
