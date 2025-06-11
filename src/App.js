import React, { useState, useEffect } from 'react';
import MedicineForm from './components/MedForm';
import MedicineList from './components/MedList';
import './App.css';


function App() {

  const [medicines, setMedicines] = useState([]);

  const addMedicine = (medicine) => {
    setMedicines([...medicines, medicine]);
  };

  const toggleTaken = (index) => {
    const updated = [...medicines];
    const med = updated[index];

    if (!med.taken) {
      const now = new Date();
      const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      med.takenTime = time;
    } else {
      med.takenTime = ''; // Clear if unchecked
    }

    med.taken = !med.taken;
    setMedicines(updated);
  };

  //For edit button
  const editMedicine = (index, name, schedule) => {
    const updated = [...medicines];
    updated[index].name = name;
    updated[index].schedule = schedule;
  }

  //For single delete button
  const deleteMedicine = (index) => {
    const updated = medicines.filter((_, i) => i !== index);
    setMedicines(updated);
  }

  //Load on localStorage on app load
  useEffect(() => {
    const savedMeds = localStorage.getItem('medicines');
    if (savedMeds) {
      setMedicines(JSON.parse(savedMeds));
    }
  }, []);

  //Function to manually save inputs('medicines')
  const saveToLocalStorage = () => {
    localStorage.setItem('medicines', JSON.stringify(medicines));
    alert('Medcine list saved!');
  }

  //For reset button
  const resetMedicines = () => {
    if (window.confirm("Are you sure you want to delete all medicines?")) {
      setMedicines([]); // to clear the medicines state
      localStorage.removeItem("medicines"); // to clear the local storage
      alert("All items have been deleted!");
    }
  }

  return (
    <div className='main-container'>
      <h1>Medication Tracker</h1>

      {/* Form section for adding new medicine */}
      <div className='new-med-container'>
        <MedicineForm addMedicine={addMedicine} />
      </div>
      {/* Input section for listing medicine */}
      <div className='list-med-container'>
        <MedicineList
          medicines={medicines}
          toggleTaken={toggleTaken}
          editMedicine={editMedicine}
          deleteMedicine={deleteMedicine} />
      </div>
      <div className='button-container'>
        {/* Button to save the list */}
        <button className='save-button' onClick={saveToLocalStorage}>SAVE</button>
        {/* Button to delete all */}
        <button className='reset-button' onClick={resetMedicines}>RESET</button>
      </div>
    </div>
  );
}

export default App;