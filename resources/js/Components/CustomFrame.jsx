import React from 'react';

const CustomFrame = ({ src, alt, width, height }) => {
    return (
        <div className="custom-frame" style={{ width, height }}>
            <img src={src} alt={alt} className="image" />
        </div>
    );
};

export default CustomFrame;
