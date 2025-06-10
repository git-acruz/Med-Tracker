import React from 'react';
import MedicineItem from './MedItems';
import './MedList.css';

function MedicineList({ medicines, toggleTaken }) {
    return (
        <div className='medicine-list'>
            {medicines.map((med, index) => (
                <MedicineItem
                    key={index}
                    medicine={med}
                    onToggle={() => toggleTaken(index)}
                />
            ))}
        </div>
    );
}

export default MedicineList;