import { useNavigate } from 'react-router-dom';
import dessinImage from '../assets/dessin.svg';

const ImageComponent = () => {
    const navigate = useNavigate();

    return (
        <div className="relative w-full max-w-138 mx-auto">
            <img 
                src={dessinImage} 
                alt="Dessin" 
                className="w-full h-auto max-w-full object-contain" 
            />
            <div 
                className="absolute w-7 h-7 bg-white opacity-60 rounded-full cursor-pointer"
                style={{ top: '10%', left: '30%' }}
                onClick={() => navigate('/secret-valentine')}
            ></div>
            <div 
                className="absolute w-7 h-7 bg-white opacity-60 rounded-full cursor-pointer"
                style={{ top: '42%', left: '15%' }}
                onClick={() => navigate('/match')}
            ></div>
            <div 
                className="absolute w-7 h-7 bg-white opacity-60 rounded-full cursor-pointer"
                style={{ top: '35%', left: '57%' }}
                onClick={() => navigate('/iloveu')}
            ></div>
        </div>
    );
};

export default ImageComponent;
