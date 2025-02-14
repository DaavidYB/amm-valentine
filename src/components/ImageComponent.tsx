import { useNavigate } from 'react-router-dom';

const ImageComponent = () => {
    const navigate = useNavigate();

    return (
        <div className="relative">
            <img src="../src/assets/dessin.svg" alt="Dessin" className="image w-136 h-auto" />
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
