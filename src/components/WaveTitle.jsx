import React from 'react';

export default function WaveTitle({ text, className = '', delayOffset = 0 }) {
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
                            '--wave-delay': `${(delayOffset + index) * 0.035}s`,
                        }}
                    >
                        {char}
                    </span>
                );
            })}
        </span>
    );
}
