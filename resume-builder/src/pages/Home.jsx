
import resumeImage from "../assets/resume.png"

export default function Home() {
  return (
    <section className="bg-gradient-to-r from-purple-50 via-white to-purple-50 overflow-hidden">

      <div className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-14 items-center">

        {/* LEFT CONTENT */}
        <div className="animate-fade-up">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
            Create your winning{" "}
            <span className="text-purple-600 relative">
              resume
              <span className="absolute left-0 -bottom-2 w-full h-1 bg-purple-200 rounded-full"></span>
            </span>
            <br /> in minutes
          </h1>

          <p className="mt-6 text-lg text-gray-600 max-w-xl">
            Build professional, recruiter-approved resumes in just a few clicks.
            Customize your resume for any job and increase your hiring chances.
          </p>

          <div className="mt-10">
            <button className="px-10 py-4 bg-purple-600 text-white rounded-2xl text-lg font-semibold 
              shadow-lg shadow-purple-300/40
              hover:bg-purple-700 hover:shadow-purple-400/60
              transition-all duration-300">
              Create Your CV Now
            </button>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="flex justify-center animate-fade-right">
          <img
            src={resumeImage}
            alt="Resume Preview"
             className="w-full max-w-xs md:max-w-sm lg:max-w-md
    rounded-2xl shadow-xl
    hover:scale-105 transition-transform duration-500"

          />
        </div>

      </div>
    </section>
  )
}