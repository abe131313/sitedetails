// src/components/UploadXML.js
import React, { useState } from 'react';
import axios from 'axios';

const UploadXML = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file) {
            setMessage('Please select an XML file first.');
            return;
        }

        const reader = new FileReader();
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
