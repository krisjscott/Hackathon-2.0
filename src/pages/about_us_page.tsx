import React from 'react';
import shubhamImg from './shubham.jpg';
import pushkarImg from './pushkar.jpg';
import krishImg from './krish.jpg';

const developers = [
  {
    name: 'Shubham Singh',
    image: shubhamImg,
    social: {
      github: 'https://github.com/shubhamisnotreal',
      linkedin: 'https://www.linkedin.com/in/shubham-singh-b63767279/',
    },
  },
  {
    name: 'Pushkar Kulkarni',
    image: pushkarImg,
    social: {
      github: 'https://github.com/pushkarkn',
      linkedin: 'https://www.linkedin.com/in/pushkar-kulkarni-abab49293/',
    },
  },
  {
    name: 'Krish Kumar',
    image: krishImg,
    social: {
      github: 'https://github.com/krisjscott',
        linkedin: 'https://www.linkedin.com/in/krish-kumar-316933243/',
    },
  },
];

const AboutUsPage: React.FC = () => {
  return (
    <div className="fade-in py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold text-primary-700 mb-4">About Us</h1>
          <p className="text-lg text-gray-700">Meet the developers behind this project. We are passionate about building reliable, user-friendly, and impactful digital solutions for everyone.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-4xl mx-auto">
          {developers.map((dev) => (
            <div key={dev.name} className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center">
              <img src={dev.image} alt={dev.name} className="w-40 h-40 object-cover rounded-full mb-4 border-4 border-primary-200" />
              <h2 className="text-xl font-semibold text-primary-800 mb-2">{dev.name}</h2>
              <div className="flex space-x-4 mt-4">
                <a href={dev.social.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:scale-110 transition-transform">
                  {/* GitHub SVG */}
                  <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24" className="text-gray-700 hover:text-black">
                    <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.186 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.157-1.11-1.465-1.11-1.465-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.338 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.744 0 .267.18.579.688.481C19.138 20.203 22 16.447 22 12.021 22 6.484 17.523 2 12 2z"/>
                  </svg>
                </a>
                <a href={dev.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:scale-110 transition-transform">
                  {/* LinkedIn SVG */}
                  <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24" className="text-blue-700 hover:text-blue-900">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.601v5.595z"/>
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
        <div className="max-w-2xl mx-auto mt-16 text-center text-gray-600">
          <h3 className="text-2xl font-bold mb-2">Our Mission</h3>
          <p>We aim to make property information accessible, transparent, and secure for everyone. This project is a step towards digital empowerment and public service.</p>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;