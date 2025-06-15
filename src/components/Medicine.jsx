import { useState } from 'react';
import PropTypes from 'prop-types';

function GroqAPI({inputRef}) {
    const [inputValue, setInputValue] = useState('');
    const [responseText, setResponseText] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
        setErrorMessage('');
    };

    const handleSubmit = async () => {
        if (!inputValue.trim()) {
            setErrorMessage('Please enter a medicine query');
            return;
        }

        setLoading(true);
        setErrorMessage('');

        try {
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
                },
                body: JSON.stringify({
                    model: "llama3-70b-8192",
                    messages: [
                        {
                            role: "system",
                            content: "You are a medical information assistant. Provide concise, accurate information about medicines."
                        },
                        {
                            role: "user",
                            content: `Provide genric name for medicine and its uses  : ${inputValue}`
                        }
                    ],
                    max_tokens: 250,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setLoading(false);

            if (data.choices && data.choices[0]?.message?.content) {
                setResponseText(data.choices[0].message.content);
            } else {
                setResponseText('No information found for this medicine');
            }
        } catch (error) {
            setErrorMessage('Error fetching medicine information via GROQ');
            console.error('Fetch error:', error);
            setLoading(false);
        }
    };

    return (
        <div className="medicine-name-container">
            <div className="medicine-name-input-container">
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    placeholder="Enter Medicine Query"
                    onChange={handleInputChange}
                    onKeyPress={(event) => event.key === 'Enter' && handleSubmit()}
                    required
                />
                <button onClick={handleSubmit}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </button>
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {loading ? (
                <div className="medicine_loading">
                    <img src="/loading.svg" alt="Loading" />
                </div>
            ) : (
                <p>{responseText}</p>
            )}
        </div>
    );
}

GroqAPI.propTypes = {
    inputRef: PropTypes.oneOfType([
        PropTypes.func, 
        PropTypes.shape({ current: PropTypes.instanceOf(Element) })
    ])
};

export default GroqAPI;