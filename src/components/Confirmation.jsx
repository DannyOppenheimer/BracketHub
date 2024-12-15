import { useLocation } from 'react-router-dom';

const Confirmation = () => {

    const location = useLocation();
    const message = location.state?.message || 'No message provided';

    return(
        <p>{message}</p>
    )
}

export default Confirmation