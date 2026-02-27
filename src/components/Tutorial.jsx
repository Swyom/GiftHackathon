import React, { useState, useEffect } from 'react';
import { Search, ArrowLeft, CheckCircle, BookOpen, Layers, Play, XCircle } from 'lucide-react';

const Tutorial = () => {
  const [courses, setCourses] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [subtopics, setSubtopics] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentStep, setCurrentStep] = useState('courses'); // courses, chapters, subtopics, theory, quiz, result
  const [activeCourse, setActiveCourse] = useState(null);
  const [activeChapter, setActiveChapter] = useState(null);
  const [activeTopic, setActiveTopic] = useState(null);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [correctCount, setCorrectCount] = useState(0);

  // 1. Initial Fetch: All Courses
  useEffect(() => {
    fetch('http://localhost:5000/api/courses')
      .then(res => res.json())
      .then(data => setCourses(Array.isArray(data) ? data : []))
      .catch(err => console.error("Course fetch error:", err));
  }, []);

  // 2. Navigation Logic
  const goToChapters = (course) => {
    setActiveCourse(course);
    fetch(`http://localhost:5000/api/courses/${course.id}/chapters`)
      .then(res => res.json())
      .then(data => { setChapters(data); setCurrentStep('chapters'); });
  };

  const goToSubtopics = (chapter) => {
    setActiveChapter(chapter);
    fetch(`http://localhost:5000/api/chapters/${chapter.id}/subtopics`)
      .then(res => res.json())
      .then(data => { setSubtopics(data); setCurrentStep('subtopics'); });
  };

  const startTopicTheory = (topic) => {
    setActiveTopic(topic);
    setCurrentStep('theory');
  };

  const startQuiz = () => {
    setCurrentQIdx(0);
    setCorrectCount(0);
    setQuizAnswers({});
    setCurrentStep('quiz');
  };

  // 3. Quiz & Result Logic
  const handleAnswer = (optionIdx, quizData) => {
    const parsedQuiz = typeof quizData === 'string' ? JSON.parse(quizData) : quizData;
    const q = parsedQuiz[currentQIdx];
    const isCorrect = optionIdx === q.correct;
    
    // Update local tracking
    setQuizAnswers(prev => ({ ...prev, [currentQIdx]: optionIdx }));
    if (isCorrect) setCorrectCount(prev => prev + 1);

    // Logic to move to next question or show results
    setTimeout(() => {
      if (currentQIdx + 1 < parsedQuiz.length) {
        setCurrentQIdx(prev => prev + 1);
      } else {
        // Correctly calculate final score using updated counts
        const finalCorrect = isCorrect ? correctCount + 1 : correctCount;
        const finalScore = Math.round((finalCorrect / parsedQuiz.length) * 100);
        saveProgress(finalScore);
      }
    }, 600);
  };

  const saveProgress = (score) => {
    setCurrentStep('result');
    fetch('http://localhost:5000/api/save-progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        user_id: 1, 
        topic_id: activeTopic.id, 
        score: score 
      })
    });
  };

  const getFeedback = (score) => {
    if (score === 100) return '🎉 Master Status! Perfect understanding.';
    if (score >= 80) return 'Excellent! You are ready for the next level.';
    return 'Good effort! Review the theory and try again.';
  };

  // Filter logic
  const filteredCourses = courses.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-6 text-white bg-gray-900 min-h-screen font-sans">
      {/* Search Header */}
      <div className="max-w-7xl mx-auto mb-10 relative">
        <Search className="absolute left-4 top-3 text-gray-500" size={20} />
        <input 
          type="text" placeholder="Search courses, chapters, or topics..." 
          className="w-full bg-gray-800 border border-gray-700 rounded-xl py-3 pl-12 pr-4 focus:border-blue-500 outline-none transition-all"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* STEP 1: COURSE CATALOG */}
      {currentStep === 'courses' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredCourses.map(course => (
            <div key={course.id} onClick={() => goToChapters(course)} className="bg-gray-800 rounded-3xl overflow-hidden cursor-pointer hover:border-blue-500 border-2 border-transparent transition-all shadow-xl active:scale-95">
              <img src={course.image_url || "https://images.unsplash.com/photo-1611974715853-288ee1d4ef7b"} className="w-full h-40 object-cover opacity-70" alt={course.title} />
              <div className="p-6">
                <h2 className="text-xl font-bold">{course.title}</h2>
                <p className="text-gray-400 text-sm mt-2">{course.description || "Master 0-to-Advanced finance concepts."}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* STEP 2: CHAPTER SELECTION */}
      {currentStep === 'chapters' && (
        <div className="max-w-4xl mx-auto py-10">
          <button onClick={() => setCurrentStep('courses')} className="flex items-center text-blue-400 mb-6 hover:underline"><ArrowLeft size={18} className="mr-2"/> Academy</button>
          <h1 className="text-3xl font-bold mb-8 text-yellow-400">{activeCourse?.title} Curriculum</h1>
          <div className="space-y-4">
            {chapters.length > 0 ? chapters.map((ch, idx) => (
              <div key={ch.id} onClick={() => goToSubtopics(ch)} className="p-6 bg-gray-800 rounded-2xl flex justify-between items-center border border-gray-700 cursor-pointer hover:bg-gray-750 transition-all">
                <p className="text-lg font-medium"><Layers size={18} className="inline mr-3 text-gray-500"/>{ch.title}</p>
                <span className="text-blue-400 font-bold">Explore Topics →</span>
              </div>
            )) : <p className="text-gray-500">Updating course data in database...</p>}
          </div>
        </div>
      )}

      {/* STEP 3: TOPIC SELECTION */}
      {currentStep === 'subtopics' && (
        <div className="max-w-4xl mx-auto py-10">
          <button onClick={() => setCurrentStep('chapters')} className="flex items-center text-blue-400 mb-6"><ArrowLeft size={18} className="mr-2"/> Chapters</button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subtopics.map(topic => (
              <div key={topic.id} onClick={() => startTopicTheory(topic)} className="bg-gray-800 p-6 rounded-2xl border border-gray-700 cursor-pointer hover:border-yellow-500 transition-all shadow-lg group">
                <img src={topic.visual_url} className="w-full h-32 rounded-lg object-cover mb-4 shadow-md opacity-80 group-hover:opacity-100" alt={topic.title} />
                <h3 className="text-xl font-bold group-hover:text-blue-400">{topic.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-2 mt-2">Detailed theory + Quiz</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 4: DETAILED THEORY & VISUALS */}
      {currentStep === 'theory' && activeTopic && (
        <div className="max-w-5xl mx-auto py-10">
          <button onClick={() => setCurrentStep('subtopics')} className="flex items-center text-blue-400 mb-6"><ArrowLeft size={18} className="mr-2"/> Back to Topics</button>
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div className="bg-gray-800 p-8 rounded-3xl border border-gray-700 shadow-2xl">
              <h2 className="text-4xl font-black mb-6 text-yellow-400">{activeTopic.title}</h2>
              <div className="text-xl text-gray-300 leading-relaxed space-y-4" dangerouslySetInnerHTML={{ __html: activeTopic.detailed_theory }} />
              <button onClick={startQuiz} className="mt-10 w-full bg-blue-600 py-5 rounded-2xl font-black text-xl hover:bg-blue-500 shadow-lg flex items-center justify-center gap-3">
                <Play size={24} /> START TOPIC QUIZ
              </button>
            </div>
            {activeTopic.visual_url && (
              <img src={activeTopic.visual_url} className="w-full rounded-3xl border-4 border-gray-800 shadow-2xl sticky top-10" alt="Theory visual" />
            )}
          </div>
        </div>
      )}

      {/* STEP 5: MULTI-QUESTION QUIZ */}
      {currentStep === 'quiz' && activeTopic && (
        <div className="max-w-2xl mx-auto py-10">
          {(() => {
            const quiz = typeof activeTopic.quiz_data === 'string' ? JSON.parse(activeTopic.quiz_data) : activeTopic.quiz_data;
            const q = quiz[currentQIdx];
            return (
              <div className="bg-gray-800 p-10 rounded-3xl border border-gray-700 shadow-2xl">
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-2xl font-bold text-blue-400">Question {currentQIdx + 1} of {quiz.length}</h2>
                  <div className="bg-gray-700 px-4 py-1 rounded-full text-sm">Level: Advanced</div>
                </div>
                <p className="text-2xl mb-10 font-medium">{q.question}</p>
                <div className="grid gap-4">
                  {q.options.map((opt, i) => (
                    <button 
                      key={i} 
                      onClick={() => handleAnswer(i, quiz)} 
                      disabled={quizAnswers[currentQIdx] !== undefined}
                      className={`w-full p-5 rounded-xl transition-all font-semibold text-lg text-left border-2 ${
                        quizAnswers[currentQIdx] === i 
                          ? i === q.correct ? 'bg-green-900/40 border-green-500' : 'bg-red-900/40 border-red-500'
                          : 'bg-gray-700 border-transparent hover:border-gray-500'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* STEP 6: FEEDBACK & SCORE */}
      {currentStep === 'result' && (
        <div className="text-center py-20 bg-gray-800 rounded-3xl max-w-lg mx-auto border-2 border-yellow-500 shadow-2xl">
          <CheckCircle className="mx-auto mb-6 text-green-400" size={80} />
          <h2 className="text-7xl font-black text-yellow-500 mb-4">
             {Math.round((correctCount / (typeof activeTopic.quiz_data === 'string' ? JSON.parse(activeTopic.quiz_data).length : activeTopic.quiz_data.length)) * 100)}%
          </h2>
          <h3 className="text-2xl font-bold mb-4">
            {getFeedback(Math.round((correctCount / (typeof activeTopic.quiz_data === 'string' ? JSON.parse(activeTopic.quiz_data).length : activeTopic.quiz_data.length)) * 100))}
          </h3>
          <p className="text-gray-400 px-10 mb-10">Your progress has been synced to your Dashboard for mastery tracking.</p>
          <button onClick={() => setCurrentStep('courses')} className="bg-blue-600 px-10 py-4 rounded-xl font-bold hover:scale-105 transition-all shadow-lg">FINISH & VIEW MORE</button>
        </div>
      )}
    </div>
  );
};

export default Tutorial;