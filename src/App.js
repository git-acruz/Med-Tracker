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
    updated[index].taken = !updated[index].taken;
    setMedicines(updated);
  };

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

  return (
    <div className='main-container'>
      <h1>Medication Tracker</h1>

      {/* Form section for adding new medicine */}
      <div className='new-med-container'>
        <MedicineForm addMedicine={addMedicine} />
      </div>
      {/* Input section for listing medicine */}
      <div className='list-med-container'>
        <MedicineList medicines={medicines} toggleTaken={toggleTaken} />
      </div>
      {/* Button to save the list */}
        <button className='save-button' onClick={saveToLocalStorage}>SAVE</button>
    </div>
  );
}

export default App;