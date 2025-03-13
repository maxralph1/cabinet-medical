import { useState } from 'react';

const useImageHandler = () => {
    const [image, setImage] = useState(null);

    const handleImageClick = () => {
        document.getElementById('image-upload-input').click();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                setImage(reader.result);
            };

            if (file) {
                reader.readAsDataURL(file);
            }
        }
    };

    return { image, handleImageClick, handleImageChange };
};

export default useImageHandler;
