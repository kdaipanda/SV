import React, { useEffect, useState } from 'react';

const AutoSaveConsultation = () => {
    const [formData, setFormData] = useState({
        consultationDetails: '',
        // Add other fields as necessary
    });

    useEffect(() => {
        const interval = setInterval(() => {
            // Call your save function here
            saveConsultation();
        }, 5000); // Auto-save every 5 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, [formData]);

    const saveConsultation = async () => {
        // Implement the save logic here, e.g., an API call
        console.log('Auto-saving consultation data...', formData);
        // await api.saveConsultation(formData);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <div>
            <h2>Consultation Form</h2>
            <textarea
                name="consultationDetails"
                value={formData.consultationDetails}
                onChange={handleChange}
                placeholder="Enter consultation details"
            />
            {/* Add other form fields as necessary */}
        </div>
    );
};

export default AutoSaveConsultation;