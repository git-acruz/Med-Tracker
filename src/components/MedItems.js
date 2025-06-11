import React, { useState } from 'react';
import './MedItems.css';

function MedicineItem({ medicine, onToggle, onEdit }) {
    const [editing, setEditing] = useState(false);
    const [newName, setnewName] = useState(medicine.name);
    const [newTime, setnewTime] = useState(medicine.schedule);

    const handleEdit = () => {
        if (editing) {
            onEdit(newName, newTime);
        }
        setEditing(!editing);
    }
    
    return (
        <div className={`medicine-item ${medicine.taken ? 'taken' : ''}`}>
            {editing ? (
            <>
                <input
                type="text"
                value={newName}
                onChange={(e) => setnewName(e.target.value)}
            />
                <input
                type="time"
                value={newTime}
                onChange={(e) => setnewTime(e.target.value)}
            />
            </>
            ) : (
            <div>
                <strong>{medicine.name}</strong> at {medicine.schedule}
                {medicine.taken && medicine.takenTime && (
                    <div className='taken-time'>Taken at {medicine.takenTime}</div>
                )}
            </div>
            )}

            <div>
                <button onClick={onToggle}>
                    {medicine.taken ? 'Taken' : 'Not Taken'}
                </button>
                <button onClick={handleEdit}>
                    {editing ? 'Save' : 'Edit'}
                </button>
            </div>
        </div>
    )
}

export default MedicineItem;