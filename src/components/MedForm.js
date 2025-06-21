import React, { useState } from "react";
import '../components/MedForm.css';

function MedicineForm({ addMedicine }) {
    const [name, setName] = useState('')
    const [schedule, setSchedule] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !schedule) {
            return;
        }

        addMedicine({ name, schedule, taken: false });
        setName('');
        setSchedule('');
    }

    return (
        <form className="medicine-form" onSubmit={handleSubmit}>
            <input 
                type="text"
                placeholder="Medicine Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="time"
                placeholder="Schedule"
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
            />
            <button
                type="submit">Add
            </button>
        </form>
    );
}

export default MedicineForm;