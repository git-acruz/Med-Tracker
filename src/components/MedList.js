import React from 'react';
import MedicineItem from './MedItems';
import '../components/MedList.css';

function MedicineList({ medicines, toggleTaken, editMedicine, deleteMedicine }) {
    return (
        <div className='medicine-list'>
            {medicines.map((med, index) => (
                <MedicineItem
                    key={index}
                    medicine={med}
                    onToggle={() => toggleTaken(index)}
                    onEdit={(name, schedule) => editMedicine(index, name, schedule)}
                    onDelete={() => deleteMedicine(index)}
                />
            ))}
        </div>
    );
}

export default MedicineList;