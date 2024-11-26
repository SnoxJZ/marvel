import img from './error.gif'

const ErrorMessage = () => {
    return (
        <img src={img} style={{display: "block", width: 250, height: 250, objectFit: 'contain', margin: '0 auto'}}  alt="Error" />
    );
};

export default ErrorMessage;