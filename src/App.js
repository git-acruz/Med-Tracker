import React, { useState, useEffect } from 'react';
import MedicineForm from './components/MedForm';
import MedicineList from './components/MedList';
import './App.css';


function App() {

  const [medicines, setMedicines] = useState([]);

  // record date today
  const [dateToday, setdateToday] = useState(
    new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  );

  // to update the date
  useEffect(() => {
    const intervalForTimeDisplay = setInterval(() => {
      const newDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      setdateToday(newDate);
    }, 60 * 1000); // every 1 minute
    return () => clearInterval(intervalForTimeDisplay) // clean up unmount
  }, []);

  const addMedicine = (medicine) => { // creates an array consists of name, schedule, taken
    setMedicines([...medicines, medicine]);
  };

  // Not taken / Taken toggle button,
  const toggleTaken = (index) => {
    const updated = [...medicines]; // updates the medicines array adds takenTime and change on taken status
    const med = updated[index]; // takes the object of the secific item that's clicked

    if (!med.taken) {
      const now = new Date();
      const date = now.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      });
      const time = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
      med.takenDate = date;
      med.takenTime = time;
    } else {
      med.takenTime = ''; // Clear if unchecked
    }

    med.taken = !med.taken;
    setMedicines(updated); // updates the set state useState
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
    const savedMeds = localStorage.getItem('medicines'); // gets the data named 'medicines' upon opening the website
    if (savedMeds) {
      setMedicines(JSON.parse(savedMeds)); // update the set State
    }
  }, []);

  //Function to manually save inputs('medicines')
  const saveToLocalStorage = () => {
    localStorage.setItem('medicines', JSON.stringify(medicines));
    alert('Medcine list saved!');
  }

  //For reset button
  const resetMedicines = () => {
    if (window.confirm("Are you sure you want to delete all medicines?")) { // confirmation window
      setMedicines([]); // clear the medicines state
      localStorage.removeItem("medicines"); // clear the local storage
      alert("All items have been deleted!");
    }
  }

  return (
    <div className='main-container'>
      <h1>Medication Tracker</h1>

      {/* Date today display */}
      <div className='today-date'>Today is {dateToday}</div>
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