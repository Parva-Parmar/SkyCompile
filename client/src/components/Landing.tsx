import { Link } from "react-router-dom";

interface LandingProps {
  backendStatus?: string;
}

export default function Landing({ backendStatus }: LandingProps) {
  return (
    <section className="min-h-[80vh] flex flex-col items-center justify-center bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300 relative overflow-hidden">
      {/* Decorative background blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[var(--accent)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      
      <div className="container px-5 py-24 mx-auto z-10">
        <div className="flex flex-wrap w-full mb-20 flex-col items-center text-center">
          <h1 className="sm:text-6xl text-4xl font-extrabold font-sans mb-6 tracking-tight">
            Collaborative <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-purple-600">project builder</span>
          </h1>

          <p className="lg:w-2/3 w-full leading-relaxed text-[var(--text-muted)] text-xl mb-8">
            Experience real-time code synchronization, integrated terminal environments, and seamless multi-user collaboration in a single premium workspace.
          </p>

          {backendStatus && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-green-500/30 text-green-500 text-sm font-medium shadow-sm mb-12">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
              {backendStatus}
            </div>
          )}

          <div className="flex justify-center mt-6">
            <Link 
              to="/signup"
              className="inline-flex items-center px-8 py-4 text-lg font-bold text-white bg-[var(--accent)] rounded-full hover:bg-[var(--accent-hover)] transition-all shadow-lg hover:shadow-[var(--accent)]/50 hover:-translate-y-1"
            >
              Start Building Free
              <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5 ml-2" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
