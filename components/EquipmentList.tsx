
import React from 'react';
import type { Equipment } from '../types';

interface EquipmentListProps {
  equipmentList: Equipment[];
  selectedEquipment: Equipment | null;
  onSelect: (equipment: Equipment) => void;
}

const EquipmentList: React.FC<EquipmentListProps> = ({ equipmentList, selectedEquipment, onSelect }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg h-full flex flex-col">
      <h2 className="text-xl font-bold p-4 border-b border-gray-700 text-teal-300">Equipment Index</h2>
      <div className="overflow-y-auto flex-grow">
        <ul>
          {equipmentList.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onSelect(item)}
                className={`w-full text-left p-4 text-sm transition-colors duration-200 ${
                  selectedEquipment?.id === item.id
                    ? 'bg-teal-500/20 text-teal-300 font-semibold'
                    : 'hover:bg-gray-700/50 text-gray-300'
                }`}
              >
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EquipmentList;
