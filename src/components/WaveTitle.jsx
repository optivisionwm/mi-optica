import React from 'react';

export default function WaveTitle({ text, className = '' }) {
    // Manejo de espacios para que no se colapsen al usar inline-block
    return (
        <span className={`word-wave-container ${className}`}>
            {text.split('').map((char, index) => {
                if (char === ' ') {
                    return <span key={index} style={{ display: 'inline-block', width: '0.3em' }}>&nbsp;</span>;
                }
                return (
                    <span
                        key={index}
                        className="text-wave-hover"
                        style={{
                            transitionDelay: `${index * 0.03}s`,
                            animationDelay: `${index * 0.03}s`
                        }}
                    >
                        {char}
                    </span>
                );
            })}
        </span>
    );
}
