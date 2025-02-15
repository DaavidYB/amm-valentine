import logoImage from '../assets/logo.svg';

interface LogoProps {
    onClick?: () => void;
}

function Logo({ onClick }: LogoProps) {
    return (
        <img className="w-[56px] cursor-pointer" src={logoImage} alt="Logo" onClick={onClick} />
    );
}

export default Logo;