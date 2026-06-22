import React from 'react';
import { Briefcase, Award, Server } from 'lucide-react';

const Certifications: React.FC = () => {
  const internships = [
    {
      company: 'Edu Tantr',
      duration: 'Aug 2024 – Oct 2024',
      role: 'Full Stack Developer Trainee',
      learnings: 'Built 5+ responsive UI components using HTML, CSS, and JavaScript, reducing layout inconsistencies by 40%. Developed Java backend modules and resolved 15+ bugs through root-cause analysis, improving stability by 20%. Integrated frontend with MySQL via JDBC with CRUD operations, cutting manual data-entry by 30%. Collaborated in a 4-member agile team using Git/GitHub, merging 10+ feature branches with zero conflicts.'
    }
  ];

  const projectCertifications = [
    {
      title: 'Python for Data Science',
      issuer: 'NPTEL – IIT Madras',
      date: 'Score: 61%',
      description: 'Data analysis, NumPy, Pandas, and data visualization using Python.'
    },
    {
      title: 'Introduction to Machine Learning',
      issuer: 'NPTEL – IIT Madras',
      date: 'Score: 56%',
      description: 'Supervised and unsupervised learning algorithms and model evaluation.'
    },
    {
      title: 'Cyber Security and Privacy',
      issuer: 'NPTEL – IIT Madras',
      date: 'Score: 60%',
      description: 'Network security, cryptography, privacy laws, and threat analysis.'
    },
    {
      title: 'Full Stack Development',
      issuer: 'Edu Tantr',
      date: 'Oct 2024',
      description: 'Internship completion certificate covering Java, HTML/CSS, JavaScript, and MySQL.'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="space-y-12">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <Award className="text-blue-600" size={32} />
          <h1 className="text-4xl font-bold text-slate-800">Certifications & Achievements</h1>
        </div>

        {/* Internships */}
        <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8">
          <div className="flex items-center space-x-3 mb-6">
            <Briefcase className="text-blue-600" size={24} />
            <h2 className="text-2xl font-bold text-slate-800">Internships</h2>
          </div>
          <div className="space-y-6">
            {internships.map((internship, index) => (
              <div key={index} className="p-6 bg-slate-50 rounded-xl">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                  <h3 className="text-xl font-semibold text-slate-800">{internship.company}</h3>
                  <span className="text-blue-600 font-medium">{internship.duration}</span>
                </div>
                <p className="text-lg text-slate-700 font-medium mb-3">{internship.role}</p>
                <p className="text-slate-600 leading-relaxed">{internship.learnings}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Project Certifications */}
        <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8">
          <div className="flex items-center space-x-3 mb-6">
            <Award className="text-green-600" size={24} />
            <h2 className="text-2xl font-bold text-slate-800">Professional Certifications</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectCertifications.map((cert, index) => (
              <div key={index} className="p-6 bg-green-50 rounded-xl border border-green-100">
                <h3 className="text-lg font-semibold text-slate-800 mb-2">{cert.title}</h3>
                <p className="text-green-700 font-medium mb-2">{cert.issuer}</p>
                <p className="text-sm text-slate-500 mb-3">{cert.date}</p>
                <p className="text-slate-600 text-sm leading-relaxed">{cert.description}</p>
              </div>
            ))}
          </div>
        </div>



        {/* Backend Experience */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl shadow-xl p-6 lg:p-8 text-white">
          <div className="flex items-center space-x-3 mb-6">
            <Server className="text-blue-400" size={24} />
            <h2 className="text-2xl font-bold">Backend Experience</h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-blue-300">Technologies & Frameworks</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  'Java', 'Python', 'FastAPI', 'JDBC', 'MySQL', 'REST APIs', 'Scikit-learn', 'Git', 'GitHub', 'Bootstrap', 'Next.js', 'Render'
                ].map((tech, index) => (
                  <span key={index} className="px-3 py-2 bg-slate-700 rounded-lg text-center text-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-blue-300">Experience Overview</h3>
              <p className="text-slate-300 leading-relaxed">
                As a Full Stack Developer Trainee at Edu Tantr, I developed Java backend modules, integrated MySQL databases via JDBC, and built responsive UI components. In my HealthAI project, I deployed a FastAPI backend with ML model integration, handling prediction requests and authentication with production-ready endpoints on Render.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certifications;
