import React, { useState } from 'react';
import axios from 'axios';
import FileUploader from './components/FileUploader';
import ATS from './components/feedback/ATS';
import Summary from './components/feedback/Summary';
import Details from './components/feedback/Details';
import { convertPdfToImage } from './lib/pdf2img';

// Main App Component
function App() {
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [resumeImage, setResumeImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File | null) => {
    setSelectedFile(file);
    if (file) {
      const { imageUrl } = await convertPdfToImage(file);
      setResumeImage(imageUrl);
    } else {
      setResumeImage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please upload your resume before analyzing.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setFeedback(null);

    const formData = new FormData();
    formData.append('resume', selectedFile);
    formData.append('jobTitle', jobTitle);
    formData.append('jobDescription', jobDescription);

    try {
      // API call to your backend
      const response = await axios.post('http://localhost:5000/api/resumes/analyze', formData);
      setFeedback(response.data.feedback);
    } catch (err: any) {
      setError(err.response?.data?.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormIncomplete = !jobTitle || !jobDescription || !selectedFile;

  return (
    <main>
      <div className="flex flex-col items-center gap-8 pt-12 max-sm:mx-2 mx-15 pb-5">
        <div className="flex flex-col items-center gap-8 max-w-4xl text-center">
          <h1>Resume Analyzer</h1>
          <h2>Get instant, AI-powered feedback on your resume against any job description.</h2>
        </div>

        {/* Form Section */}
        <div className="w-full max-w-4xl p-8 bg-gray-50/50 rounded-3xl border border-gray-200">
          <form onSubmit={handleSubmit} className="flex flex-col items-start gap-8 w-full">
            <div className="flex flex-col gap-2 w-full items-start">
              <label htmlFor="jobTitle" className="font-semibold">Job Title</label>
              <input id="jobTitle" type="text" placeholder="e.g., Senior Software Engineer" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-2 w-full items-start">
              <label htmlFor="jobDescription" className="font-semibold">Job Description</label>
              <textarea id="jobDescription" rows={6} placeholder="Paste the job description here..." value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-2 w-full items-start">
              <label className="font-semibold">Your Resume (PDF)</label>
              <FileUploader onFileSelect={handleFileSelect} selectedFile={selectedFile} />
            </div>
            <button type="submit" className="primary-button text-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed" disabled={isLoading || isFormIncomplete}>
              {isLoading ? 'Analyzing...' : 'Analyze My Resume'}
            </button>
          </form>
        </div>

        {/* Loading and Error States */}
        {isLoading && <div className="text-center p-8">Loading...</div>}
        {error && <div className="w-full max-w-4xl p-4 text-center text-red-700 bg-red-100 border border-red-300 rounded-lg">{error}</div>}

        {/* Feedback Display Section */}
        {feedback && (
          <div className="w-full max-w-7xl mx-auto flex lg:flex-row flex-col gap-8 mt-8">
            <div className="w-full lg:w-1/2 flex flex-col items-center">
              <div className="sticky top-8 w-full">
                <h2 className="text-3xl font-bold mb-4 text-center">Your Resume</h2>
                <div className="p-4 bg-white rounded-2xl shadow-lg border border-gray-200">
                  {resumeImage && <img src={resumeImage} alt="Resume Preview" className="w-full h-auto rounded-lg" />}
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2 flex flex-col gap-8">
              <ATS score={feedback.ATS.score} suggestions={feedback.ATS.tips} />
              <Summary feedback={feedback} />
              <Details feedback={feedback} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default App;