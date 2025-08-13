import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaUpload, 
  FaRobot, 
  FaChartLine, 
  FaBookReader, 
  FaFacebook, 
  FaTwitter, 
  FaLinkedin, 
  FaEnvelope,
  FaUsers,
  FaGraduationCap,
  FaLightbulb,
  FaShieldAlt,
  FaStar,
  FaArrowRight
} from "react-icons/fa";
import Navbar from "../components/Navbar";

export default function AboutPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || null;

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    navigate("/");
  };

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

  const stats = [
    { number: "10,000+", label: "Quizzes Generated", icon: FaRobot },
    { number: "50,000+", label: "Students Helped", icon: FaUsers },
    { number: "95%", label: "Satisfaction Rate", icon: FaStar },
    { number: "24/7", label: "AI Support", icon: FaShieldAlt }
  ];

  const features = [
    {
      icon: FaUpload,
      title: "Easy Uploads",
      description: "Upload notes and documents in PDF, Word, or Docs format effortlessly with our intuitive drag-and-drop interface.",
      color: "blue"
    },
    {
      icon: FaRobot,
      title: "AI-Generated Quizzes",
      description: "Get instant multiple-choice questions tailored to your study material using advanced AI technology.",
      color: "green"
    },
    {
      icon: FaChartLine,
      title: "Track Progress",
      description: "Monitor your performance over time with detailed analytics and identify areas for improvement.",
      color: "purple"
    },
    {
      icon: FaBookReader,
      title: "Interactive Learning",
      description: "Revise and learn in a fun, engaging, and effective way with our interactive quiz platform.",
      color: "indigo"
    }
  ];

  const team = [
    {
      name: "Ajaj",
      role: "AI Research Lead",
      bio: "B.Tech in Machine Learning with 2+ years experience in educational technology.",
      avatar: "AJ"
    },
    {
      name: "Maria Garcia",
      role: "Product Manager",
      bio: "Former educator passionate about making learning accessible and engaging for everyone.",
      avatar: "MG"
    },
    {
      name: "David Kim",
      role: "Lead Developer",
      bio: "Full-stack developer with expertise in building scalable educational platforms.",
      avatar: "DK"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar user={user} handleLogout={handleLogout} />

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-8">
            <FaLightbulb className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Note2Test</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Your AI-powered study companion that transforms notes and documents into interactive quizzes, 
            helping you learn smarter, faster, and more effectively.
          </p>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
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
              We combine cutting-edge AI technology with proven learning methodologies to create the ultimate study experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
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

      {/* Team Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The brilliant minds behind Note2Test, dedicated to revolutionizing the way students learn and study.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">{member.avatar}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-4">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Students Say</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of students who have transformed their learning experience with Note2Test.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-[#fafafa] p-6 rounded-2xl flex flex-col gap-4 transition-transform duration-200 hover:-translate-y-1 shadow-lg">
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
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Learning?</h2>
            <p className="text-xl mb-8 opacity-90">
              Start creating AI-powered quizzes from your study materials today.
            </p>
            <button
              onClick={() => navigate('/upload')}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center space-x-2 mx-auto"
            >
              <span>Get Started Now</span>
              <FaArrowRight className="w-5 h-5" />
            </button>
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
                <li>support@note2test.com</li>
                <li>+1 (555) 123-4567</li>
                <li>123 Learning St, Education City</li>
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
}