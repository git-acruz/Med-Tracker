import React, { useState, useEffect } from "react";
import MedicineForm from '../components/MedForm';
import MedicineList from '../components/MedList';
import API_BASE from "../api";
import '../App.css';

// This component receives the logged-in user's ID and a logout function as props
function TrackerPage({ userId, onLogout}) {
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

    //Load on localStorage / server on app load
    // This useEffect now depends on the userId prop. It will re-run if the user changes.
    useEffect(() => {
        if (!userId) {
            return; // do nothing if logged out
        }
    
        fetch(`${API_BASE}/medications?userId=${userId}`, {
          method: 'GET' // GET means getting data
        })
          .then(res => res.json())
          .then(data => {
            setMedicines(data || []);
          })
          .catch(err => {
            console.log('Load error:', err);
          });
    }, [userId]); // Dependency array ensures this runs when userId is available

    const addMedicine = (newMedicine) => { // creates an array consists of name, schedule, taken
        setMedicines([...medicines, newMedicine]); // newMedicine is the newly added array to medicines using spread operator
    };

    //Function to manually save inputs('medicines')
    const saveToLocalServer = () => {
        if (!userId) {
            return; // do nothing if logged out
        }

        const medicinesWithUserId = medicines.map(medicinesDataToDb => ({ userId, ...medicinesDataToDb }));
        console.log(medicinesWithUserId)

        fetch(`${API_BASE}/medications/all`, {
            method: 'POST', // POST means inserting data
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ medicinesWithUserId })
        })
        .then(res => res.json())
        .then(data => {
            alert('Medicine list saved to server!')
        })
        .catch(err => {
            alert('Failed to delete, server issue.')
            console.error('Save error:', err);
        });
    };

    //For reset button
    const resetMedicines = () => {
        if (window.confirm("Are you sure you want to delete all medicines?")) {
            fetch(`${API_BASE}/medications/all?userId=${userId}`, {
                method: 'DELETE', // DELETE means delete
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to reset medicines');
                }
                return res.json();
            })
            .then(() => {
                setMedicines([]);
                alert("All items have been deleted!");
            })
            .catch(err => {
                alert('Failed to delete, server issue.')
                console.error('Delete error:', err)
            });
        }
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
            med.takenDate = '';
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

    // RENDER HERE
    return (
        <div className="tracker-container">
            <h1>Medication Tracker</h1>
            {/* Date today display */}
            <div className='today-date'>Today is {dateToday}</div>
            {/* Form section for adding new medicine */}
            <div className='new-med-container'>
                <MedicineForm addMedicine={addMedicine} />
            </div>
            {/* List section for toggling, editing, and deleting medicine list */}
            <div className='list-med-container'>
                <MedicineList
                    medicines={medicines}
                    toggleTaken={toggleTaken}
                    editMedicine={editMedicine}
                    deleteMedicine={deleteMedicine} />
            </div>
            <div className='button-container'>
                {/* Button to save the list */}
                <button className='save-button' onClick={saveToLocalServer}>SAVE</button>
                {/* Button to delete all */}
                <button className='reset-button' onClick={resetMedicines}>RESET</button>
                {/* Log out button */}
                <button className='logout-button' onClick={onLogout}>LOG OUT</button>
            </div>
        </div>
    )
}

export default TrackerPage;