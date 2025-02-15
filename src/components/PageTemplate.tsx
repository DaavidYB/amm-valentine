import Footer from "./Footer";
import Header from "./Header";

interface PageTemplateProps {
    children: React.ReactNode;
    className?: string;
}

function PageTemplate({ children, className = "" }: PageTemplateProps) {
    return (
        <div className="h-[100dvh] flex flex-col overflow-hidden">
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