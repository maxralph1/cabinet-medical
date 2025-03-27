import React from 'react';


export default function BackgroundImageComponent({ imageUrl, width = "100%", height = "400px", children }) {
  return (
    <div
      className="dynamic-bg"
      style={{
        '--bg-image': `url(${imageUrl})`, // Pass image as a CSS variable
        width,
        height,
      }}
    >
      <div className="overlay-content h-100">{children}</div> {/* Content inside */}
    </div>
  );
}
