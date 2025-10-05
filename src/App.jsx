import { useState, useEffect } from 'react';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, [currentPage]);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  const handleLogin = () => {
    if (email && password) {
      setIsLoggedIn(true);
      setCurrentPage('chat');
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage = { text: inputMessage, sender: 'user' };
    setChatMessages([...chatMessages, newMessage]);
    setInputMessage('');

    setTimeout(() => {
      const botResponse = {
        text: "I'm your BioEngine assistant. I can help you with biological concepts, molecular structures, research papers, and much more. What would you like to explore?",
        sender: 'bot'
      };
      setChatMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const Footer = () => (
    <footer className="bg-black/50 backdrop-blur-md border-t border-gray-800 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-gray-400">© 2025 BioEngine. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <button onClick={() => setCurrentPage('home')} className="text-gray-400 hover:text-white transition-colors">Home</button>
            <button onClick={() => setCurrentPage('features')} className="text-gray-400 hover:text-white transition-colors">Features</button>
            <button onClick={() => setCurrentPage('about')} className="text-gray-400 hover:text-white transition-colors">About</button>
            <button onClick={() => setCurrentPage('login')} className="text-gray-400 hover:text-white transition-colors">Login</button>
            {isLoggedIn && <button onClick={() => setCurrentPage('chat')} className="text-gray-400 hover:text-white transition-colors">Chat</button>}
          </div>
        </div>
      </div>
    </footer>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        
        body, html {
          background-color: #0a0a0a;
          overflow-x: hidden;
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out; }
        .animate-slide-down { animation: slide-down 0.3s ease-out; }
        .animate-slide-in-left { animation: slide-in-left 0.8s ease-out; }
        .animate-slide-in-right { animation: slide-in-right 0.8s ease-out; }
        .animate-scale-in { animation: scale-in 0.6s ease-out; }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-400 { animation-delay: 400ms; }
        .delay-500 { animation-delay: 500ms; }
        .delay-1000 { animation-delay: 1000ms; }
      `}</style>

      <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-md border-b border-gray-800 z-50 animate-fade-in">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setCurrentPage('home')}>
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-100 to-white bg-clip-text text-transparent">
                BioEngine
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => setCurrentPage('home')} className="text-gray-400 hover:text-white transition-all">
                Home
              </button>
              <button onClick={() => setCurrentPage('features')} className="text-gray-400 hover:text-white transition-all">
                Features
              </button>
              <button onClick={() => setCurrentPage('about')} className="text-gray-400 hover:text-white transition-all">
                About
              </button>
              <button onClick={() => setCurrentPage('login')} className="text-gray-400 hover:text-white transition-all">
                Login
              </button>
              {isLoggedIn && (
                <>
                  <button onClick={() => setCurrentPage('chat')} className="text-gray-400 hover:text-white transition-all">
                    Chat
                  </button>
                  <button onClick={() => { setIsLoggedIn(false); setCurrentPage('home'); }} className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg text-white hover:from-blue-500 hover:to-cyan-500 transition-all hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/50">
                    Logout
                  </button>
                </>
              )}
            </div>

            <button className="md:hidden text-white text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>

          {menuOpen && (
            <div className="md:hidden mt-4 flex flex-col gap-4 animate-slide-down">
              <button onClick={() => { setCurrentPage('home'); setMenuOpen(false); }} className="text-gray-400 hover:text-white transition text-left">
                Home
              </button>
              <button onClick={() => { setCurrentPage('features'); setMenuOpen(false); }} className="text-gray-400 hover:text-white transition text-left">
                Features
              </button>
              <button onClick={() => { setCurrentPage('about'); setMenuOpen(false); }} className="text-gray-400 hover:text-white transition text-left">
                About
              </button>
              <button onClick={() => { setCurrentPage('login'); setMenuOpen(false); }} className="text-gray-400 hover:text-white transition text-left">
                Login
              </button>
              {isLoggedIn && (
                <>
                  <button onClick={() => { setCurrentPage('chat'); setMenuOpen(false); }} className="text-gray-400 hover:text-white transition text-left">
                    Chat
                  </button>
                  <button onClick={() => { setIsLoggedIn(false); setCurrentPage('home'); setMenuOpen(false); }} className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg text-white hover:from-blue-500 hover:to-cyan-500 transition">
                    Logout
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      {currentPage === 'home' && (
        <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden flex flex-col">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
          </div>

          <div className={`flex-1 pt-32 px-6 max-w-8xl mx-auto relative transition-all duration-1000 w-full ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center space-y-8 mb-20 animate-fade-in-up">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-gray-100 to-white bg-clip-text text-transparent leading-tight px-4">
                Biology Knowledge Engine
              </h1>
              
              <p className="text-lg sm:text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto px-4">
                Your intelligent companion for biological research, powered by advanced AI to help you understand, analyze, and explore the world of life sciences.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12 px-4">
                <button 
                  onClick={() => isLoggedIn ? setCurrentPage('chat') : setCurrentPage('login')}
                  className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg text-lg font-semibold hover:from-blue-500 hover:to-cyan-500 hover:scale-105 transition-all hover:shadow-xl hover:shadow-cyan-500/30 relative overflow-hidden"
                >
                  <span className="relative z-10">Get Started</span>
                </button>
                <button 
                  onClick={() => setCurrentPage('features')}
                  className="px-8 py-4 bg-white/5 backdrop-blur-sm rounded-lg text-lg font-semibold hover:bg-white/10 transition-all border border-gray-700 hover:scale-105 hover:border-gray-600"
                >
                  Explore Features
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 pb-20">
              {[
                { title: "Smart PDF Analysis", desc: "Annotate, summarize, and extract insights from research papers instantly." },
                { title: "Graph Recall", desc: "Visualize and understand complex biological relationships and pathways." },
                { title: "Molecule Visualization", desc: "Explore 3D structures of biomolecules using SMILES notation." }
              ].map((item, idx) => (
                <div key={idx} className="group bg-[#1a1a1a] backdrop-blur-sm p-8 rounded-xl border border-gray-800 hover:border-gray-600 transition-all hover:scale-105 cursor-pointer animate-scale-in shadow-lg">
                  <h3 className="text-2xl font-bold mb-3 text-white">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <Footer />
        </div>
      )}

      {currentPage === 'features' && (
        <div className={`min-h-screen bg-[#0a0a0a] text-white flex flex-col transition-all duration-1000 overflow-x-hidden ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex-1 pt-32 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16 animate-fade-in-up">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-gray-100 to-white bg-clip-text text-transparent px-4">
                  Powerful Features
                </h1>
                <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto px-4">
                  Everything you need to accelerate your biological research and understanding
                </p>
              </div>

              <div className="max-w-6xl mx-auto pb-20">
                <div className="bg-[#1a1a1a] backdrop-blur-lg rounded-2xl border border-gray-800 p-8 shadow-2xl animate-scale-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-all hover:scale-105 cursor-pointer">
                      <h3 className="text-2xl font-bold mb-3 text-white">PDF Annotations</h3>
                      <p className="text-gray-300 text-sm">Highlight, comment, and annotate research papers directly with AI-powered insights.</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-all hover:scale-105 cursor-pointer">
                      <h3 className="text-xl font-bold mb-3 text-white">Graph Recall</h3>
                      <p className="text-gray-300 text-sm">Visualize biological relationships and pathways.</p>
                    </div>

                    <div className="bg-gradient-to-br from-cyan-600/20 to-blue-600/20 p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-all hover:scale-105 cursor-pointer">
                      <h3 className="text-xl font-bold mb-3 text-white">PDF Summarizer</h3>
                      <p className="text-gray-300 text-sm">Get instant summaries of research papers.</p>
                    </div>

                    <div className="lg:col-span-2 bg-gradient-to-br from-blue-600/20 to-purple-600/20 p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-all hover:scale-105 cursor-pointer">
                      <h3 className="text-2xl font-bold mb-3 text-white">General Chat</h3>
                      <p className="text-gray-300 text-sm">Ask anything about biology from molecular mechanisms to ecosystem dynamics.</p>
                    </div>

                    <div className="bg-gradient-to-br from-pink-600/20 to-purple-600/20 p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-all hover:scale-105 cursor-pointer">
                      <h3 className="text-xl font-bold mb-3 text-white">Speech to Text</h3>
                      <p className="text-gray-300 text-sm">Have natural conversations with voice input.</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-600/20 to-cyan-600/20 p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-all hover:scale-105 cursor-pointer">
                      <h3 className="text-xl font-bold mb-3 text-white">Citation Finder</h3>
                      <p className="text-gray-300 text-sm">Automatically discover relevant citations.</p>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-all hover:scale-105 cursor-pointer">
                      <h3 className="text-xl font-bold mb-3 text-white">PDF Finder</h3>
                      <p className="text-gray-300 text-sm">Search and locate research papers easily.</p>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-all hover:scale-105 cursor-pointer">
                      <h3 className="text-xl font-bold mb-3 text-white">PDF Questioning</h3>
                      <p className="text-gray-300 text-sm">Ask questions about uploaded documents.</p>
                    </div>

                    <div className="lg:col-span-2 bg-gradient-to-br from-teal-600/20 to-green-600/20 p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-all hover:scale-105 cursor-pointer">
                      <h3 className="text-2xl font-bold mb-3 text-white">Biomolecule Structure Viewer</h3>
                      <p className="text-gray-300 text-sm">Visualize complex 3D molecular structures with SMILES notation support.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center pb-20 animate-scale-in delay-500">
                <button 
                  onClick={() => isLoggedIn ? setCurrentPage('chat') : setCurrentPage('login')}
                  className="px-10 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg text-lg font-semibold hover:from-blue-500 hover:to-cyan-500 hover:scale-105 transition-all hover:shadow-xl hover:shadow-cyan-500/30"
                >
                  Start Using BioEngine
                </button>
              </div>
            </div>
          </div>

          <Footer />
        </div>
      )}

      {currentPage === 'about' && (
        <div className={`min-h-screen bg-[#0a0a0a] text-white flex flex-col transition-all duration-1000 overflow-x-hidden ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex-1 pt-32 px-6">
            <div className="max-w-5xl mx-auto pb-20">
              <div className="text-center mb-20 animate-fade-in-up">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-gray-100 to-white bg-clip-text text-transparent px-4">
                  About BioEngine
                </h1>
                <p className="text-lg sm:text-xl text-gray-400 px-4">
                  Revolutionizing biological research with artificial intelligence
                </p>
              </div>

              <div className="space-y-12">
                <div className="bg-[#1a1a1a] backdrop-blur-sm p-10 rounded-xl border border-gray-800 hover:border-gray-600 transition-all hover:scale-105 animate-slide-in-left">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Our Mission</h2>
                  <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                    BioEngine was created to bridge the gap between cutting-edge biological research and accessible knowledge. 
                    We believe that understanding life sciences should not be limited by complex jargon or scattered information. 
                    Our AI-powered platform makes biological knowledge accessible, interconnected, and actionable for researchers, 
                    students, and enthusiasts alike.
                  </p>
                </div>

                <div className="bg-[#1a1a1a] backdrop-blur-sm p-10 rounded-xl border border-gray-800 hover:border-gray-600 transition-all hover:scale-105 animate-slide-in-right delay-200">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Why BioEngine?</h2>
                  <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-6">
                    Traditional research tools force you to jump between multiple applications, losing context and wasting valuable time. 
                    BioEngine integrates everything you need into one intelligent platform.
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-blue-600/10 p-6 rounded-lg border border-gray-700 hover:scale-105 transition-all">
                      <h3 className="text-lg sm:text-xl font-bold mb-3 text-white">For Researchers</h3>
                      <p className="text-gray-400 text-sm sm:text-base">Accelerate your research with AI-powered analysis, annotation, and knowledge synthesis.</p>
                    </div>
                    <div className="bg-purple-600/10 p-6 rounded-lg border border-gray-700 hover:scale-105 transition-all">
                      <h3 className="text-lg sm:text-xl font-bold mb-3 text-white">For Students</h3>
                      <p className="text-gray-400 text-sm sm:text-base">Understand complex biological concepts through interactive visualizations and conversational AI.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#1a1a1a] backdrop-blur-sm p-10 rounded-xl border border-gray-800 hover:border-gray-600 transition-all hover:scale-105 animate-slide-in-left delay-400">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">The Technology</h2>
                  <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                    Built on state-of-the-art natural language processing and machine learning models trained on vast biological 
                    databases, BioEngine understands context, relationships, and the nuances of biological systems. Our platform 
                    continuously learns and improves, ensuring you always have access to the most accurate and up-to-date information.
                  </p>
                </div>

                <div className="text-center bg-gradient-to-r from-blue-600/20 to-cyan-600/20 p-12 rounded-xl border border-gray-700 hover:scale-105 transition-all animate-scale-in delay-500">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white">Join the Future of Biological Research</h2>
                  <p className="text-gray-300 text-base sm:text-lg mb-8">
                    Start exploring with BioEngine today and experience how AI can transform your understanding of life sciences.
                  </p>
                  <button 
                    onClick={() => isLoggedIn ? setCurrentPage('chat') : setCurrentPage('login')}
                    className="px-10 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg text-lg font-semibold hover:from-blue-500 hover:to-cyan-500 hover:scale-105 transition-all hover:shadow-xl hover:shadow-cyan-500/30"
                  >
                    Get Started Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          <Footer />
        </div>
      )}

      {currentPage === 'login' && (
        <div className={`min-h-screen bg-[#0a0a0a] text-white flex flex-col transition-all duration-1000 overflow-x-hidden ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="flex-1 flex items-center justify-center px-6">
            <div className="w-full max-w-md animate-scale-in">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-gray-100 to-white bg-clip-text text-transparent">
                  Welcome Back
                </h1>
                <p className="text-gray-400">Login to access BioEngine</p>
              </div>

              <div className="bg-[#1a1a1a] backdrop-blur-sm p-8 rounded-xl border border-gray-800 hover:border-gray-600 transition-all">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-[#0a0a0a] border border-gray-700 rounded-lg focus:outline-none focus:border-gray-500 text-white placeholder-gray-500 transition-all"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                      className="w-full px-4 py-3 bg-[#0a0a0a] border border-gray-700 rounded-lg focus:outline-none focus:border-gray-500 text-white placeholder-gray-500 transition-all"
                      placeholder="••••••••"
                    />
                  </div>

                  <button
                    onClick={handleLogin}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg font-semibold hover:from-blue-500 hover:to-cyan-500 transition-all hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/30"
                  >
                    Login
                  </button>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-gray-400 text-sm">
                    Don't have an account?{' '}
                    <button className="text-white hover:text-gray-300 font-semibold hover:scale-110 inline-block transition-transform">
                      Sign up
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Footer />
        </div>
      )}

      {currentPage === 'chat' && (
        <div className={`min-h-screen bg-[#0a0a0a] text-white flex flex-col transition-all duration-1000 overflow-x-hidden ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex-1 pt-24 px-6 flex flex-col">
            <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 animate-fade-in-up">
                <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-gray-100 to-white bg-clip-text text-transparent">
                  Chat with BioEngine
                </h1>
                <div className="flex gap-4">
                  <button className="px-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg hover:border-gray-600 hover:bg-[#1f1f1f] transition-all text-sm sm:text-base">
                    Upload PDF
                  </button>
                  <button className="px-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg hover:border-gray-600 hover:bg-[#1f1f1f] transition-all text-sm sm:text-base">
                    View Molecule
                  </button>
                </div>
              </div>

              <div className="flex-1 bg-[#1a1a1a] backdrop-blur-sm rounded-xl border border-gray-800 p-6 overflow-y-auto mb-6 animate-scale-in delay-200">
                {chatMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <h2 className="text-xl sm:text-2xl font-bold mb-2 text-gray-400">Start a conversation</h2>
                    <p className="text-gray-500 max-w-md text-sm sm:text-base px-4">
                      Ask about biological concepts, upload PDFs for analysis, or explore molecular structures
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {chatMessages.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                        <div className={`max-w-2xl px-6 py-3 rounded-lg transition-all ${
                          msg.sender === 'user' 
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:shadow-lg hover:shadow-cyan-500/30' 
                            : 'bg-[#0a0a0a] border border-gray-700 hover:border-gray-600'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-4 pb-6 animate-slide-in-left delay-400">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-[#1a1a1a] border border-gray-700 rounded-lg focus:outline-none focus:border-gray-500 text-white placeholder-gray-500 transition-all text-sm sm:text-base"
                  placeholder="Ask anything about biology..."
                />
                <button
                  onClick={handleSendMessage}
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg font-semibold hover:from-blue-500 hover:to-cyan-500 transition-all hover:shadow-xl hover:shadow-cyan-500/30 text-sm sm:text-base"
                >
                  Send
                </button>
              </div>
            </div>
          </div>

          <Footer />
        </div>
      )}
    </>
  );
};

export default App;