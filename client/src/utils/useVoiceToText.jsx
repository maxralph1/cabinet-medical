import { useState, useEffect } from 'react';

// Check for browser compatibility
const isSpeechRecognitionAvailable = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

export function useVoiceToText() {
    const [voiceText, setVoiceText] = useState('');
    const [isListening, setIsListening] = useState(false);

    let recognition = null;

    if (isSpeechRecognitionAvailable) {
        recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    }

    const INACTIVITY_TIMEOUT = 5000; 

    useEffect(() => {
        if (isListening) {
            const timeoutId = setTimeout(() => {
                handleStopListening();
        }, INACTIVITY_TIMEOUT);

        return () => clearTimeout(timeoutId);
        }
    }, [isListening]);

    function handleStartListening() {
        if (recognition) {
        const recognitionInstance = new recognition();

        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;

        recognitionInstance.onstart = () => {
            setIsListening(true);
        };

        recognitionInstance.onresult = (event) => {
            const lastResult = event.results[event.results.length - 1];
            const transcript = lastResult[0].transcript;
            setVoiceText(transcript);
        };

        recognitionInstance.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
        };

        recognitionInstance.onspeechend = () => {
            handleStopListening();
        };

        recognitionInstance.onend = () => {
            setIsListening(false);
        };

        recognitionInstance.start();
        }
    };

    function handleStopListening() {
        if (recognition) {
        recognition.abort();
        setIsListening(false);
        }
    };



    return {
        handleStartListening, 
        handleStopListening, 
        voiceText, 
        setVoiceText,
        isListening, 
        setIsListening
    }
};

// Export functions and state
// export { handleStartListening, voiceText, isListening };
