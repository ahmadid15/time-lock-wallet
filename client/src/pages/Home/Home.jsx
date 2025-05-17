import { useState, useEffect } from 'react';
import { Bitcoin, Clock, Lock, ArrowRight, Shield, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Main animation component that displays the landing page
export default function Home() {
  const [showApp, setShowApp] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [showFeatures, setShowFeatures] = useState(false);
  const navigate = useNavigate();
  
  // Auto-scroll through benefits
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentSection < 3) {
        setCurrentSection(currentSection + 1);
      } else {
        // Show all features grid after showcasing individual benefits
        setShowFeatures(true);
      }
    }, 2500);
    
    return () => clearTimeout(timer);
  }, [currentSection]);
  
  // Bitcoin animation component
  const AnimatedBitcoin = () => {
    const [rotation, setRotation] = useState(0);
    
    useEffect(() => {
      const interval = setInterval(() => {
        setRotation(prev => (prev + 1) % 360);
      }, 50);
      
      return () => clearInterval(interval);
    }, []);
    
    return (
      <div className="flex justify-center">
        <div 
          className="text-orange-500 transform transition-transform" 
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <Bitcoin size={64} />
        </div>
      </div>
    );
  };

  const LockAnimation = () => {
    const [isLocked, setIsLocked] = useState(true);
    
    useEffect(() => {
      const interval = setInterval(() => {
        setIsLocked(prev => !prev);
      }, 1500);
      
      return () => clearInterval(interval);
    }, []);
    
    return (
      <div className="relative w-20 h-20 mx-auto">
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${isLocked ? 'opacity-100' : 'opacity-0'}`}>
          <Lock size={48} className="text-orange-500" />
        </div>
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${!isLocked ? 'opacity-100' : 'opacity-0'}`}>
          <Clock size={48} className="text-green-400" />
        </div>
      </div>
    );
  };
  
  // Benefits content
  const benefits = [
    {
      title: "Time-Locked Bitcoin Security",
      description: "Lock your Bitcoin for predetermined periods, preventing impulsive spending and securing your assets against unauthorized access.",
      icon: <Lock size={48} className="text-orange-500" />
    },
    {
      title: "Enforce Saving Discipline",
      description: "Create timed savings goals and remove the temptation to spend your Bitcoin before reaching your financial targets.",
      icon: <Clock size={48} className="text-orange-500" />
    },
    {
      title: "Protection Against Theft",
      description: "Additional security layer that prevents hackers or attackers from immediately accessing and transferring your funds.",
      icon: <Shield size={48} className="text-orange-500" />
    },
    {
      title: "Multi-address Management",
      description: "Create and manage multiple time-locked addresses with varying unlock dates in a single convenient interface.",
      icon: <Wallet size={48} className="text-orange-500" />
    }
  ];

  // Navigate to the main app
  const handleGetStarted = () => {
    setShowApp(true);
    navigate('/time-lock-wallet');

  };

  // Features preview cards
  const FeatureCard = ({ title, description, icon }) => (
    <div className="bg-gray-900 p-4 rounded-lg border border-orange-400 hover:border-orange-300 transition-all duration-300 hover:shadow-lg hover:shadow-orange-900/20 hover:-translate-y-1">
      <div className="flex justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-orange-400 text-center mb-2">{title}</h3>
      <p className="text-gray-300 text-center text-sm">{description}</p>
    </div>
  );

  // Main landing page structure
  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* Hero section with animated gradient */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-black opacity-90"></div>
        
        {/* Animated backlight effect */}
        <div className="absolute left-1/2 top-1/4 -translate-x-1/2 w-96 h-96 bg-orange-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-8">
              <AnimatedBitcoin />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
              TLB Wallet
            </h1>
            
            <p className="text-xl mb-8 max-w-2xl text-gray-300">
              Secure your Bitcoin with time-based restrictions - the smart way to enforce savings discipline and protect your assets
            </p>
            
            <button 
              onClick={handleGetStarted}
              className="flex items-center bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-8 py-3 rounded-lg hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 font-bold text-lg shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40"
            >
              Get Started <ArrowRight className="ml-2" size={18} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Animated features showcase */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-orange-400">How It Works</h2>
        
        <div className="flex justify-center mb-12">
          <div className="w-full max-w-6xl">
            {/* AnimatedDescription section - auto scrolls through benefits */}
            <div className="bg-black bg-opacity-50 p-8 rounded-2xl border border-orange-500 shadow-lg">
              <div className="h-64 relative overflow-hidden">
                {benefits.map((benefit, index) => (
                  <div 
                    key={index}
                    className={`absolute inset-0 flex flex-col items-center transition-opacity duration-1000 transform ${
                      index === currentSection 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-8'
                    }`}
                  >
                    <div className="mb-6">
                      {benefit.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-orange-400">{benefit.title}</h3>
                    <p className="text-center max-w-lg text-gray-300">{benefit.description}</p>
                  </div>
                ))}
              </div>
              
              {/* Progress dots */}
              <div className="flex justify-center mt-4 space-x-2">
                {benefits.map((_, index) => (
                  <div 
                    key={index}
                    className={`h-2 w-2 rounded-full transition-all duration-300 ${
                      index === currentSection ? 'bg-orange-500 w-4' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Feature grid that appears after animation */}
        <div className={`transition-opacity duration-1000 ${showFeatures ? 'opacity-100' : 'opacity-0'}`}>
          <h2 className="text-2xl font-bold text-center mb-8 text-orange-400">All Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <FeatureCard 
                key={index}
                title={benefit.title}
                description={benefit.description}
                icon={benefit.icon}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* How it works section */}
      <div className="container mx-auto px-4 py-16 relative">
        <div className="absolute left-1/4 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-500 rounded-full filter blur-3xl opacity-10"></div>
        
        <h2 className="text-3xl font-bold text-center mb-12 text-orange-400">Time-Locking Explained</h2>
        
        <div className="max-w-4xl mx-auto bg-black bg-opacity-50 p-8 rounded-2xl border border-orange-500 relative z-10">
          <div className="flex flex-col md:flex-row items-center mb-12">
            <div className="md:w-1/2 mb-6 md:mb-0">
              <LockAnimation />
            </div>
            <div className="md:w-1/2">
              <h3 className="text-xl font-bold mb-4 text-orange-400">Lock Now, Spend Later</h3>
              <p className="text-gray-300">
                Define a future date when your Bitcoin will become available. Until that date arrives, the funds remain securely locked and can't be spent or transferred - protecting your investment from impulsive decisions.
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="bg-orange-500 rounded-full w-8 h-8 flex items-center justify-center mr-4 shrink-0">1</div>
              <p className="text-gray-300">Create a new time-locked address with your desired unlock date</p>
            </div>
            <div className="flex items-center">
              <div className="bg-orange-500 rounded-full w-8 h-8 flex items-center justify-center mr-4 shrink-0">2</div>
              <p className="text-gray-300">Fund the address with any amount of Bitcoin</p>
            </div>
            <div className="flex items-center">
              <div className="bg-orange-500 rounded-full w-8 h-8 flex items-center justify-center mr-4 shrink-0">3</div>
              <p className="text-gray-300">Your Bitcoin is secured and cannot be spent until the unlock date</p>
            </div>
            <div className="flex items-center">
              <div className="bg-orange-500 rounded-full w-8 h-8 flex items-center justify-center mr-4 shrink-0">4</div>
              <p className="text-gray-300">Once unlocked, spend or transfer your Bitcoin as needed</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">Ready to Secure Your Bitcoin?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-300">
          Start using Time-Lock BTC Wallet today and take control of your cryptocurrency investments with advanced time-based security
        </p>
        <button 
          onClick={handleGetStarted}
          className="flex items-center bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-8 py-3 rounded-lg hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 font-bold text-lg shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 mx-auto"
        >
          Launch Wallet <ArrowRight className="ml-2" size={18} />
        </button>
      </div>
      
      {/* Footer */}
      <footer className="bg-black py-8 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <div className="flex items-center justify-center mb-4">
            <Bitcoin size={20} className="text-orange-500 mr-2" />
            <span className="text-orange-400 font-bold">Time-Lock BTC Wallet</span>
          </div>
          <p>Demo Version • Educational Purposes Only</p>
        </div>
      </footer>
    </div>
  );
}