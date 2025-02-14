interface LogoProps {
    onClick?: () => void;
}

function Logo({ onClick }: LogoProps) {
    return (
        <img className="w-[56px] cursor-pointer" src="../src/assets/logo.svg" alt="Logo" onClick={onClick} />
    );
}

export default Logo;