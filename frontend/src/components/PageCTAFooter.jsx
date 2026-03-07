import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

const PageCTAFooter = ({ 
  title = "Ready to Analyse Your Case?",
  subtitle = "Let our AI help identify potential grounds for appeal in your case.",
  buttonText = "Get Started Free",
  buttonLink = "/"
}) => {
  return (
    <section className="bg-slate-900 dark:bg-slate-950 px-4 sm:px-6 py-12 border-t border-slate-800" data-testid="page-cta-footer">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Crimson Pro, serif' }}>
          {title}
        </h2>
        <p className="text-slate-400 mb-8 text-lg">
          {subtitle}
        </p>
        <Link to={buttonLink}>
          <Button 
            className="bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800 rounded-xl px-8 py-6 text-lg font-semibold shadow-lg shadow-amber-600/20"
            data-testid="cta-button"
          >
            {buttonText}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default PageCTAFooter;
