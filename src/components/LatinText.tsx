import React from 'react';

interface LatinTextProps {
    children: string;
    className?: string;
}

/**
 * Component that automatically wraps English words and numbers in a span
 * with the text-latin class for proper styling alongside Georgian text.
 */
export function LatinText({ children, className = '' }: LatinTextProps) {
    if (typeof children !== 'string') {
        return <>{children}</>;
    }

    // Regex to match Latin letters and numbers (including hyphenated words)
    const latinPattern = /([A-Za-z0-9]+(?:[-][A-Za-z0-9]+)*)/g;

    const parts = children.split(latinPattern);

    return (
        <>
            {parts.map((part, index) => {
                // Check if this part matches the Latin pattern
                if (latinPattern.test(part)) {
                    // Reset regex lastIndex since we're using global flag
                    latinPattern.lastIndex = 0;
                    return (
                        <span key={index} className={`text-latin ${className}`}>
                            {part}
                        </span>
                    );
                }
                return part;
            })}
        </>
    );
}

/**
 * Higher-order function to process text and wrap Latin characters.
 * Use this for dynamic content from database.
 */
export function processLatinText(text: string): React.ReactNode {
    if (!text || typeof text !== 'string') {
        return text;
    }

    // Regex to match Latin letters and numbers (including hyphenated words like "Interna-ს")
    const latinPattern = /([A-Za-z0-9]+)/g;

    const parts = text.split(latinPattern);

    return (
        <>
            {parts.map((part, index) => {
                // Check if this part is Latin (letters or numbers only)
                if (/^[A-Za-z0-9]+$/.test(part)) {
                    return (
                        <span key={index} className="text-latin">
                            {part}
                        </span>
                    );
                }
                return part;
            })}
        </>
    );
}
