/* eslint-disable react/prop-types */
const AlertBox = ({ type, message, onClose }) => {
    const err = (<svg className="mx-auto mb-4 text-red-400 w-14 h-14" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
    )
    const scc = (<svg className="mx-auto mb-4 text-green-600 w-14 h-14" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
    </svg>)
    if (!message) return null;

    // Define styles based on the type of alert
    const alertStyles = {
        success: {
            textColor: 'text-green-600',
            borderColor: 'border-green-500',
        },
        error: {
            textColor: 'text-red-600',
            borderColor: 'border-red-500',
        },
    };

    const { textColor } = alertStyles[type] || alertStyles.error;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            {/* Overlay background */}
            <div
                className="absolute inset-0 bg-gray-800 bg-opacity-50"
                onClick={onClose} // Close alert on overlay click
            ></div>
            {/* Alert box */}
            <div
                className={`relative max-w-md mx-auto p-6 rounded-lg shadow-lg bg-white ${textColor} `}
                style={{ minWidth: '400px', maxWidth: '90%', textAlign: 'center' }}
            >
                <button
                    type="button"
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-900"
                    onClick={onClose}
                >
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="sr-only">Close alert</span>
                </button>
                <div className="mb-4">

                    {(type === 'success') ? scc : err}

                    <p className="text-lg font-semibold">{message}</p>
                </div>
                <button
                    onClick={onClose}
                    className={` mt-4 px-6 py-2 bg-slate-800 text-white rounded  hover:from-${type === 'success' ? 'green-500' : 'red-500'} hover:to-${type === 'success' ? 'green-700' : 'red-700'} transition-all duration-300`}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default AlertBox;
