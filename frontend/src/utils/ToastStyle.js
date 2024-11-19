const toastSuccessStyle = {
    style: {
        background: 'linear-gradient(135deg, #4CAF50, #81C784)', // Gradient green
        color: '#FFFFFF', // White for text
        fontWeight: '500',
        borderRadius: '12px',
        border: 'none',
        padding: '12px 16px',
        boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)', // Subtle shadow
    },
    icon: '✅', // Checkmark for success
};

const toastErrorStyle = {
    style: {
        background: 'linear-gradient(135deg, #FF5252, #FF867C)', // Gradient reddish-pink
        color: '#FFFFFF', // White for text
        fontWeight: '500',
        borderRadius: '12px',
        border: 'none',
        padding: '12px 16px',
        boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)', // Subtle shadow
    },
    icon: '⚠️', // Warning icon for error
};

export {toastErrorStyle,toastSuccessStyle};