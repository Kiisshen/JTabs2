import { useState, useRef } from 'react';
import './Start.css';
import { useNavigate } from "react-router-dom";

function Start() {
    const navigate = useNavigate()

    const handleFormSubmit = (event) => {
        event.preventDefault();
        const file = event.target.elements.filename.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            try {
                const parsedData = JSON.parse(content);
                localStorage.setItem('loadedTabs', JSON.stringify(parsedData));
                navigate('/app');
            } catch (error) {
                console.error('Error parsing JSON file:', error);
            }
        };
        reader.readAsText(file)
    };

    function handleAppRedirect() {
        localStorage.setItem('loadedTabs', JSON.stringify([]));
        navigate('/app');
    };

    return (
        <>
            <div className='startPage'>
                <h1>JTabs2</h1>
                <button onClick={handleAppRedirect}>Start New Tab</button>
                <p>Choose a file and start where you left off!</p>
                <form onSubmit={handleFormSubmit}>
                    <label className='fileUpload'>
                        <input type="file" id="myFile" name="filename"></input>
                    </label>
                    <button type="submit">Start Editing</button>
                </form>
            </div>
        </>
    );
}

export default Start;
