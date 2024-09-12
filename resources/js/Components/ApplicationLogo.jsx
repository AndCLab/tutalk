export default function ApplicationLogo(props) {
    return (
        <img
        src="/img/logo.png" // Correct path for Vite
        alt="Application Logo"
        {...props}
        style={{ width:'80px', height:'auto'}} // Adjust the styles as needed
        />
    );
}
