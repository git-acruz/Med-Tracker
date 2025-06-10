import React from 'react';
import './MedItems.css';

function MedicineItem({ medicine, onToggle }) {
    return (
        <div className={`medicine-item ${medicine.taken ? 'taken' : ''}`}>
            <div>
                <strong>{medicine.name}</strong> at {medicine.schedule}
            </div>
            <button onClick={onToggle}>
                {medicine.taken ? 'Taken': 'Not Taken'}
            </button>
        </div>
    )
}

export default MedicineItem;