// src/components/UploadXML.js
import React, { useState } from 'react';
import axios from 'axios';

const UploadXML = () => {
    const [file, setFile] = useState(null); // Hook to store the file
    const [message, setMessage] = useState(''); // To store the message 

    const handleFileChange = (event) => {
        setFile(event.target.files[0]); //to handle file change
    };

    const handleSubmit = async (event) => { // Function to handle submit 
        event.preventDefault();
        if (!file) {
            setMessage('Please select an XML file first.'); // If the xml file is not selected for upload then this message pops up
            return; // returning the statement
        }

        const reader = new FileReader(); // Using the native fileReader function to read the files
        reader.onload = async () => {
            const xmlData = reader.result; 

            try {
                const response = await axios.post('http://localhost:5000/xml/upload', { xmlData }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                setMessage(response.data.message);
            } catch (error) {
                setMessage('Failed to upload XML file');
                console.error('Error uploading XML file:', error);
            }
        };

        reader.readAsText(file); 
    };

    return (
        <div>
            <h2>Upload XML File</h2>
            <form onSubmit={handleSubmit}>
                <input type="file" accept=".xml" onChange={handleFileChange} />
                <button type="submit">Upload</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default UploadXML;
