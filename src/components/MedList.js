import React from 'react';
import MedicineItem from './MedItems';
import './MedList.css';

function MedicineList({ medicines, toggleTaken, editMedicine }) {
    return (
        <div className='medicine-list'>
            {medicines.map((med, index) => (
                <MedicineItem
                    key={index}
                    medicine={med}
                    onToggle={() => toggleTaken(index)}
                    onEdit={(name, schedule) => editMedicine(index, name, schedule)}
                />
            ))}
        </div>
    );
}

export default MedicineList;