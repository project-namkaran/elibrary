import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Settings, 
  Bookmark,
  Moon,
  Sun,
  Type,
  Volume2
} from 'lucide-react';
import { Book } from '../../types';
import { useUser } from '../../context/UserContext';

interface BookReaderProps {
  book: Book;
  onBack: () => void;
}

export const BookReader: React.FC<BookReaderProps> = ({ book, onBack }) => {
  const { updateReadingProgress } = useUser();
  const [currentChapter, setCurrentChapter] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [progress, setProgress] = useState(0);

  const chapters = book.content || [
    'Chapter 1: Introduction',
    'Chapter 2: Getting Started', 
    'Chapter 3: Advanced Concepts',
    'Chapter 4: Best Practices',
    'Chapter 5: Conclusion'
  ];

  useEffect(() => {
    const newProgress = ((currentChapter + 1) / chapters.length) * 100;
    setProgress(Math.round(newProgress));
    updateReadingProgress(book.id, newProgress, chapters[currentChapter]);
  }, [currentChapter, chapters.length, book.id, updateReadingProgress]);

  const nextChapter = () => {
    if (currentChapter < chapters.length - 1) {
      setCurrentChapter(currentChapter + 1);
    }
  };

  const prevChapter = () => {
    if (currentChapter > 0) {
      setCurrentChapter(currentChapter - 1);
    }
  };

  const generateContent = (chapterTitle: string) => {
    return `
      <h1>${chapterTitle}</h1>
      
      <p>This is a sample chapter content for "${chapterTitle}" in the book "${book.title}" by ${book.author}.</p>
      
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
      
      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      
      <h2>Key Points</h2>
      <ul>
        <li>Understanding the fundamental concepts</li>
        <li>Practical applications and examples</li>
        <li>Best practices and recommendations</li>
        <li>Common pitfalls to avoid</li>
      </ul>
      
      <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
      
      <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
      
      <blockquote style="border-left: 4px solid #3B82F6; padding-left: 1rem; margin: 1.5rem 0; font-style: italic; color: #6B7280;">
        "The journey of a thousand miles begins with one step." - This quote perfectly encapsulates the essence of what we're discussing in this chapter.
      </blockquote>
      
      <p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p>
    `;
  };

  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-10 border-b transition-colors ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              
              <div className="flex items-center space-x-3">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-10 h-12 object-cover rounded"
                />
                <div>
                  <h1 className="font-semibold text-lg">{book.title}</h1>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {book.author}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button className={`p-2 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}>
                <Bookmark className="h-5 w-5" />
              </button>
              
              <button className={`p-2 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}>
                <Volume2 className="h-5 w-5" />
              </button>
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Chapter {currentChapter + 1} of {chapters.length}</span>
              <span>{progress}% complete</span>
            </div>
            <div className={`w-full rounded-full h-2 ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className={`absolute top-20 right-4 w-64 rounded-lg shadow-lg border z-20 p-4 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className="font-semibold mb-4">Reading Settings</h3>
          
          {/* Font Size */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              <Type className="h-4 w-4 inline mr-2" />
              Font Size
            </label>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                className={`px-2 py-1 rounded border ${
                  isDarkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                A-
              </button>
              <span className="text-sm">{fontSize}px</span>
              <button
                onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                className={`px-2 py-1 rounded border ${
                  isDarkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                A+
              </button>
            </div>
          </div>
          
          {/* Dark Mode */}
          <div className="mb-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isDarkMode}
                onChange={(e) => setIsDarkMode(e.target.checked)}
                className="sr-only"
              />
              <div className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                isDarkMode ? 'bg-blue-600' : 'bg-gray-300'
              }`}>
                <span className={`inline-block w-4 h-4 transform rounded-full bg-white transition-transform ${
                  isDarkMode ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </div>
              <span className="ml-3 text-sm font-medium">
                {isDarkMode ? <Moon className="h-4 w-4 inline mr-1" /> : <Sun className="h-4 w-4 inline mr-1" />}
                {isDarkMode ? 'Dark Mode' : 'Light Mode'}
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="prose max-w-none" style={{ fontSize: `${fontSize}px`, lineHeight: 1.6 }}>
          <div
            dangerouslySetInnerHTML={{
              __html: generateContent(chapters[currentChapter])
            }}
            className={isDarkMode ? 'prose-invert' : ''}
          />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-12 pt-8 border-t">
          <button
            onClick={prevChapter}
            disabled={currentChapter === 0}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
              currentChapter === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : isDarkMode
                  ? 'bg-gray-700 text-gray-100 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous Chapter
          </button>

          <div className="flex items-center space-x-2">
            {chapters.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentChapter(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentChapter
                    ? 'bg-blue-600'
                    : isDarkMode
                      ? 'bg-gray-600 hover:bg-gray-500'
                      : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextChapter}
            disabled={currentChapter === chapters.length - 1}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
              currentChapter === chapters.length - 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Next Chapter
            <ChevronRight className="h-4 w-4 ml-2" />
          </button>
        </div>
      </div>

      {/* Close settings when clicking outside */}
      {showSettings && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowSettings(false)}
        />
      )}
    </div>
  );
};