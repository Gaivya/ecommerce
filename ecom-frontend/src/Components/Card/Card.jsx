import React, { useState } from 'react';

const Card = ({ title, price, imageUrl, buttonText, onButtonClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="max-w-sm rounded overflow-hidden shadow-lg relative bg-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <img className="w-full h-48 object-cover" src={imageUrl} alt="Card image cap" />
        {isHovered && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <button
              onClick={onButtonClick}
              className="text-white font-bold py-2 px-4 rounded"
              style={{ background: '#be0500' }}
            >
              {buttonText}
            </button>
          </div>
        )}
      </div>
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{title}</div>
        <p className="text-base font-semibold text-red-700">Amount: {price}</p>
      </div>
    </div>
  );
};

export default Card;
