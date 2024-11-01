/* eslint-disable react/prop-types */
const AlertBox = ({ type, message, onClose }) => {
    // Define the SVG icons based on type
    const errIcon = (
        <svg
            className="h-6 w-6 shrink-0 text-red-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
            />
        </svg>
    );

    const successIcon = (
        <svg
            className="h-6 w-6 shrink-0 text-green-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
        </svg>
    );

    if (!message) return null;

    // Define alert color styles based on type
    const alertStyles = {
        success: {
            bgColor: 'bg-green-100',
            textColor: 'text-green-800',
            borderColor: 'border-green-400',
        },
        error: {
            bgColor: 'bg-red-100',
            textColor: 'text-red-800',
            borderColor: 'border-red-400',
        },
    };

    const { bgColor, textColor, borderColor } = alertStyles[type] || alertStyles.error;

    return (
        <div className={`flex items-center p-4 mb-4 text-sm rounded-lg border ${bgColor} ${borderColor} ${textColor}`} role="alert">
            {/* Display icon based on type */}
            <div className="mr-3">
                {type === 'success' ? successIcon : errIcon}
            </div>
            <span className="flex-1">{message}</span>
            <button
                type="button"
                className="text-gray-500 hover:text-gray-700 ml-3"
                onClick={onClose}
            >
                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="sr-only">Close alert</span>
            </button>
        </div>
    );
};

export default AlertBox;
