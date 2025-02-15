import Logo from "./Logo";
import Switch from "./Switch";
import { Info } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMode } from '@/context/ModeContext';

function Header() {
    const { mode, toggleMode } = useMode(); // Utilise le mode global
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;

    const antiLoveColor = "#4B1F2A";
    const loveColor = "var(--color-accent)";
    const buttonColor = "#FFE5EC";

    return (
        <header className="flex justify-between align-items items-center w-screen px-6 py-6 z-50">
            <Dialog>
                <DialogTrigger asChild>
                    <Info size={40} className="cursor-pointer" />
                </DialogTrigger>
                <DialogContent className="bg-[var(--color-background)] backdrop-blur-sm border-none">
                    <DialogHeader>
                        <DialogTitle className="text-[var(--color-accent)]">AMM VALENTINE</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 text-[var(--color-accent)]">
                        <p className="font-bold">Deux modes disponibles :</p>
                        <ul className="list-none pl-2">
                            <li className="font-regular">❤️ Mode Love</li>
                            <li className="font-regular">💔 Mode Anti-Love (on a pensé à tout le monde)</li>
                        </ul>
                        <p className="font-bold">Mini-jeux et animations :</p>
                        <ul className="list-none pl-2">
                            <li className="font-regular">✨ Match MIAGE : Trouve ton match ou ton opposé.</li>
                            <li className="font-regular">🎶 Playlist : Ajoute tes chansons à la playlist ! (il y en a 2, une pour chaque mode)</li>
                            <li className="font-regular">💌 Secret Valentine : Laisse un message anonyme :).</li>
                            <li className="font-regular">❤️ I Love U : Trouve ton admirateur secret.</li>
                        </ul>
                        <p className="font-bold">Comment ça marche ?</p>
                        <ul className="list-none pl-2">
                            <li className="font-regular">Sélectionne ton mode</li>
                            <li className="font-regular">Participe aux jeux et amuse-toi !</li>
                        </ul>
                        <p className="text-sm italic mt-4 text-[var(--color-accent)]/80">
                            Pour une meilleure expérience, nous recommandons d'utiliser un ordinateur.
                        </p>
                    </div>
                </DialogContent>
            </Dialog>

            <Logo onClick={() => navigate('/')} />

            <div className="w-16">
                {currentPath === '/' && (
                    <Switch
                        checked={mode === "anti-love"}
                        onChange={toggleMode}
                        activeColor={antiLoveColor}
                        inactiveColor={loveColor}
                        knobColor={buttonColor}
                    />
                )}
            </div>
        </header>
    );
}

export default Header;
