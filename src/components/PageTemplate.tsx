import Footer from "./Footer";
import Header from "./Header";

interface PageTemplateProps {
    children: React.ReactNode;
    className?: string;
}
function PageTemplate({ children, className = "" }: PageTemplateProps) {
    return (
        <div className="min-h-[100svh] h-[100dvh] flex flex-col" 
             style={{
                 paddingTop: 'env(safe-area-inset-top)',
                 paddingBottom: 'env(safe-area-inset-bottom)',
                 paddingLeft: 'env(safe-area-inset-left)',
                 paddingRight: 'env(safe-area-inset-right)'
             }}>
            <Header />
            <main className={`flex-1 flex items-center justify-center overflow-hidden ${className}`}>
                <div className="w-full h-full flex items-center justify-center">
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default PageTemplate;