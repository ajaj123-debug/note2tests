import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUpload, 
  FaRobot, 
  FaChartLine, 
  FaBookReader, 
  FaStar, 
  FaUsers, 
  FaGraduationCap,
  FaArrowRight,
  FaPlay,
  FaShieldAlt,
  FaLightbulb,
  FaCheckCircle,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaEnvelope
} from 'react-icons/fa';
import GoogleLogin from '../components/GoogleLogin';
import Navbar from '../components/Navbar';

const LandingPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/');
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    navigate('/upload');
  };

  const features = [
    {
      icon: FaUpload,
      title: "Easy Upload",
      description: "Upload PDF, DOC, or DOCX files with our intuitive drag-and-drop interface",
      color: "blue"
    },
    {
      icon: FaRobot,
      title: "AI-Powered",
      description: "Advanced AI generates relevant questions from your study materials",
      color: "green"
    },
    {
      icon: FaChartLine,
      title: "Track Progress",
      description: "Monitor your performance and identify areas for improvement",
      color: "purple"
    },
    {
      icon: FaBookReader,
      title: "Interactive Learning",
      description: "Engage with your material through fun, interactive quizzes",
      color: "indigo"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Quizzes Generated", icon: FaRobot },
    { number: "50,000+", label: "Students Helped", icon: FaUsers },
    { number: "95%", label: "Satisfaction Rate", icon: FaStar },
    { number: "24/7", label: "AI Support", icon: FaShieldAlt }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Medical Student",
      content: "Note2Test transformed my study routine. It helped me convert my anatomy notes into practice questions, making revision so much more effective!",
      avatar: "https://i.pravatar.cc/150?img=1"
    },
    {
      name: "David Chen",
      role: "CS Graduate",
      content: "The AI-generated questions are incredibly relevant. It's like having a personal tutor who knows exactly what I need to review.",
      avatar: "https://i.pravatar.cc/150?img=2"
    },
    {
      name: "Emily Martinez",
      role: "Law Student",
      content: "Being able to turn my case study notes into practice questions has been game-changing for my exam preparation.",
      avatar: "https://i.pravatar.cc/150?img=3"
    },
    {
      name: "Michael Park",
      role: "High School Teacher",
      content: "I use Note2Test to create practice quizzes for my students. It saves me hours of work and the students love the interactive format!",
      avatar: "https://i.pravatar.cc/150?img=4"
    }
  ];

  const benefits = [
    "Save hours of manual quiz creation",
    "Get personalized study materials",
    "Track your learning progress",
    "Access quizzes anytime, anywhere",
    "Improve retention with spaced repetition",
    "Support for multiple file formats"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar user={user} handleLogout={handleLogout} />

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
                <FaLightbulb className="w-4 h-4 mr-2" />
                AI-Powered Learning Platform
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Turn Your Notes into{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Interactive Tests
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Upload your study documents and let AI create personalized quizzes, 
                helping you learn smarter, faster, and more effectively.
              </p>

              {/* Benefits List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <FaCheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {!user ? (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <GoogleLogin onLoginSuccess={handleLoginSuccess} />
                    <button className="flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 transition-colors">
                      <FaPlay className="w-4 h-4 mr-2" />
                      Watch Demo
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => navigate('/upload')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center space-x-2"
                  >
                    <span>Start Creating Quizzes</span>
                    <FaArrowRight className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Trust Indicators */}
              <div className="mt-8 flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <FaShieldAlt className="w-4 h-4 mr-2" />
                  <span>Secure & Private</span>
                </div>
                <div className="flex items-center">
                  <FaGraduationCap className="w-4 h-4 mr-2" />
                  <span>Used by 50K+ Students</span>
                </div>
              </div>
            </div>

                         {/* Right Content - Testimonials */}
             <div className="relative animate-[float_6s_ease-in-out_infinite]">
               {/* Decoration */}
               <div className="absolute w-full aspect-[4/3] bg-gradient-to-br from-[#818cf8] to-[#38bdf8] rounded-3xl opacity-10 -z-10 translate-x-[1%] top-[10%]"></div>
               
               {/* Testimonials Grid */}
               <div className="grid grid-cols-2 gap-6 p-8 bg-white rounded-3xl shadow-2xl">
                 {testimonials.map((testimonial, index) => (
                   <div key={index} className="bg-[#fafafa] p-6 rounded-2xl flex flex-col gap-4 transition-transform duration-200 hover:-translate-y-1">
                     <div className="flex items-center gap-4">
                       <img 
                         src={testimonial.avatar} 
                         alt={testimonial.name} 
                         className="w-12 h-12 rounded-full object-cover border-2 border-[#4f46e5]"
                       />
                       <div className="flex-1">
                         <div className="font-semibold text-gray-900 text-base">{testimonial.name}</div>
                         <div className="text-gray-600 text-sm">{testimonial.role}</div>
                       </div>
                     </div>
                     <div className="text-gray-600 text-sm leading-relaxed relative pl-4 border-l-2 border-[#4f46e5]">
                       "{testimonial.content}"
                     </div>
                   </div>
                 ))}
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Note2Test?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We combine cutting-edge AI technology with proven learning methodologies 
              to create the ultimate study experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className={`w-16 h-16 bg-${feature.color}-100 rounded-full flex items-center justify-center mb-6`}>
                  <feature.icon className={`w-8 h-8 text-${feature.color}-600`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

             {/* CTA Section */}
       <section className="py-16 px-6">
         <div className="max-w-4xl mx-auto text-center">
           <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
             <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Learning?</h2>
             <p className="text-xl mb-8 opacity-90">
               Start creating AI-powered quizzes from your study materials today.
             </p>
             {!user ? (
               <GoogleLogin onLoginSuccess={handleLoginSuccess} />
             ) : (
               <button
                 onClick={() => navigate('/upload')}
                 className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center space-x-2 mx-auto"
               >
                 <span>Get Started Now</span>
                 <FaArrowRight className="w-5 h-5" />
               </button>
             )}
           </div>
         </div>
       </section>

       {/* Footer */}
       <footer className="bg-gray-900 text-white py-12">
         <div className="max-w-6xl mx-auto px-6">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
             {/* Brand */}
             <div className="md:col-span-2">
               <h3 className="text-2xl font-bold mb-4">Note2Test</h3>
               <p className="text-gray-400 mb-6 max-w-md">
                 Making learning smarter, faster, and more interactive with AI-generated quizzes. 
                 Join thousands of students who have transformed their study experience.
               </p>
               <div className="flex space-x-4">
                 <FaFacebook className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                 <FaTwitter className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                 <FaLinkedin className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                 <FaEnvelope className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
               </div>
             </div>

             {/* Quick Links */}
             <div>
               <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
               <ul className="space-y-2 text-gray-400">
                 <li className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate('/')}>
                   Home
                 </li>
                 <li className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate('/about')}>
                   About
                 </li>
                 <li className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate('/upload')}>
                   Create Quiz
                 </li>
                 {user && (
                   <li className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate('/profile')}>
                     Profile
                   </li>
                 )}
               </ul>
             </div>

             {/* Contact */}
             <div>
               <h4 className="text-lg font-semibold mb-4">Contact</h4>
               <ul className="space-y-2 text-gray-400">
                 <li>Email : ajaj4269@gmail.com</li>
                 <li>+91 70795 53517</li>
                 <li>133207, Mullana, Haryana, India</li>
               </ul>
             </div>
           </div>

           <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
             <p>© {new Date().getFullYear()} Note2Test. All rights reserved.</p>
           </div>
         </div>
       </footer>
     </div>
   );
};

export default LandingPage;