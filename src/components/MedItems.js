import React, { useState } from 'react';
import '../components/MedItems.css';

function MedicineItem({ medicine, onToggle, onEdit, onDelete }) {
    const [editing, setEditing] = useState(false);
    const [newName, setnewName] = useState(medicine.name);
    const [newTime, setnewTime] = useState(medicine.schedule);

    const handleEdit = () => {
        if (editing) {
            onEdit(newName, newTime);
        }
        setEditing(!editing);
    }

    const scheduleIn12hrFormat = new Date(`2025-01-01T${medicine.schedule}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
    
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
                <strong>{medicine.name}</strong> at <strong>{scheduleIn12hrFormat}</strong>
                { medicine.taken ?  (
                    <div className='taken-time'>✅ Taken on {medicine.takenDate} at {medicine.takenTime}</div>
                ) : (<></>) }
            </div>
            )}

            <div>
                <button onClick={onToggle}>
                    {medicine.taken ? 'Taken' : 'Not Taken'}
                </button>
                <button onClick={handleEdit}>
                    {editing ? 'Save' : 'Edit'}
                </button>
                <button onClick={onDelete}
                    className='delete'>Delete
                </button>
            </div>
        </div>
    )
}

export default MedicineItem;