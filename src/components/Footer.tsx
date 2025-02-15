import MusicPlayer from './MusicPlayer';
import { useLocation, useNavigate } from 'react-router-dom';
import dessinMusique from '../assets/dessin_musique.svg';

function Footer() {
    const location = useLocation();
    const navigate = useNavigate();
    const currentPath = location.pathname;

    
    return (
        <footer className="flex justify-between items-center align-center w-screen px-6 py-6 z-50">
            {currentPath === '/' && (
                <>
                    <MusicPlayer mode="love" userId={"123"} />
                    <div className="relative">
                        <img src={dessinMusique} alt="Musique" className="w-24 h-auto" />
                        <div 
                            className="absolute w-7 h-7 bg-white opacity-70 rounded-full cursor-pointer"
                            style={{ top: '35%', left: '35%' }}
                            onClick={() => navigate('/playlist')}
                        ></div>
                    </div>
                </>
            )}
            {currentPath === '/match' && (
                <>
                    <MusicPlayer mode="love" userId={"123"} />
                    <div className="text-xl font-bold">MATCH</div>
                </>
            )}
            {currentPath === '/playlist' && (
                <div className="text-xl font-bold text-right w-full">PLAYLIST</div>
            )}
            {currentPath === '/secret-valentine' && (
                <>
                    <MusicPlayer mode="love" userId={"123"} />
                    <div className="text-xl font-bold text-right">SECRET VALENTINE</div>
                </>
            )}
            {currentPath === '/iloveu' && (
                <>
                    <MusicPlayer mode="love" userId={"123"} />
                    <div className="text-xl font-bold text-right">I LOVE U</div>
                </>
            )}
        </footer>
    );
}

export default Footer;