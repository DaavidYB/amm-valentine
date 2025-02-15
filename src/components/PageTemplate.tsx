import Footer from "./Footer";
import Header from "./Header";

interface PageTemplateProps {
    children: React.ReactNode;
    className?: string;
}

function PageTemplate({ children, className = "" }: PageTemplateProps) {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className={`flex-1 flex items-center justify-center ${className}`}>
                {children}
            </main>
            <Footer />
        </div>
    );
}

export default PageTemplate;