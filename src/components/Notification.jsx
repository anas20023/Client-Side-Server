/* eslint-disable react/prop-types */
const AlertBox = ({ type, message, onClose }) => {
    const icons = {
        success: (
            <svg
                className="h-6 w-6 shrink-0 text-green-400"
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
        ),
        error: (
            <svg
                className="h-6 w-6 shrink-0 text-red-400"
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
        ),
    };

    if (!message) return null;

    const alertStyles = {
        success: 'alert alert-success shadow-lg bg-green-900 text-green-300 border border-green-500',
        error: 'alert alert-error shadow-lg bg-red-900 text-red-300 border border-red-500',
    };

    const alertClass = alertStyles[type] || alertStyles.error;

    return (
        <div className={`fixed top-4 right-4 max-w-sm p-4 rounded-lg flex items-center gap-4 ${alertClass}`} role="alert">
            {icons[type] || icons.error}
            <span className="flex-1">{message}</span>
            <button
                type="button"
                className="btn btn-sm btn-circle btn-ghost text-gray-400 hover:text-white"
                onClick={onClose}
            >
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="sr-only">Close alert</span>
            </button>
        </div>
    );
};

export default AlertBox;
