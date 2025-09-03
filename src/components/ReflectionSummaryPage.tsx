import { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { ArrowLeft, CheckCircle, User } from 'lucide-react';

interface ReflectionData {
  strengths: string;
  importantThings: string;
  selectedContext: string;
  exclusionStory: {
    task: string;
    place: string;
    barrier: string;
    emotion: string;
    consequence: string;
  };
  inclusiveActions: string[];
  generatedStory?: string | null;
}

interface ReflectionSummaryPageProps {
  persona: {
    id: number;
    name: string;
    role: string;
    description: string[];
    imageUrl: string;
    color: string;
    age: number;
  };
  reflectionData: ReflectionData;
  onBack: () => void;
  onDesignComplete: (designData: {
    title: string;
    image: File | null;
    description: string;
  }) => void;
  initialDesignData?: {
    title: string;
    image: File | null;
    description: string;
  };
}

export function ReflectionSummaryPage({ persona, reflectionData, onBack, onDesignComplete, initialDesignData }: ReflectionSummaryPageProps) {
  const { exclusionStory } = reflectionData;
  // initialDesignData가 있으면 폼을 표시하고 초기값 설정
  const [showDesignForm, setShowDesignForm] = useState(!!initialDesignData);
  const [designTitle, setDesignTitle] = useState(initialDesignData?.title || '');
  const [designDescription, setDesignDescription] = useState(initialDesignData?.description || '');
  const [displayedStory, setDisplayedStory] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [storyStatus, setStoryStatus] = useState<'generating' | 'completed' | 'failed'>('generating');

  // Remove emoji from context for display
  const cleanContext = reflectionData.selectedContext.replace(/^[^\s]*\s/, '');

  // Listen for story generation events
  useEffect(() => {
    const handleStoryGenerated = (event: CustomEvent) => {
      const story = event.detail.story;
      setStoryStatus('completed');
      
      // Start typing effect
      setIsTyping(true);
      setDisplayedStory('');
      
      let currentIndex = 0;
      
      const typeWriter = () => {
        if (currentIndex < story.length) {
          setDisplayedStory(story.substring(0, currentIndex + 1));
          currentIndex++;
          setTimeout(typeWriter, 30);
        } else {
          setIsTyping(false);
        }
      };

      setTimeout(typeWriter, 500);
    };

    const handleStoryGenerationFailed = () => {
      setStoryStatus('failed');
    };

    window.addEventListener('storyGenerated', handleStoryGenerated as EventListener);
    window.addEventListener('storyGenerationFailed', handleStoryGenerationFailed);

    return () => {
      window.removeEventListener('storyGenerated', handleStoryGenerated as EventListener);
      window.removeEventListener('storyGenerationFailed', handleStoryGenerationFailed);
    };
  }, []);

  // Initial story typing effect (if story already exists)
  useEffect(() => {
    if (reflectionData.generatedStory && !isTyping && displayedStory !== reflectionData.generatedStory) {
      setStoryStatus('completed');
      setIsTyping(true);
      setDisplayedStory('');
      
      let currentIndex = 0;
      const story = reflectionData.generatedStory;
      
      const typeWriter = () => {
        if (currentIndex < story.length) {
          setDisplayedStory(story.substring(0, currentIndex + 1));
          currentIndex++;
          setTimeout(typeWriter, 30);
        } else {
          setIsTyping(false);
        }
      };

      setTimeout(typeWriter, 500);
    }
  }, [reflectionData.generatedStory, isTyping, displayedStory]);

  const handleDesignComplete = () => {
    const designData = {
      title: designTitle,
      image: null,
      description: designDescription
    };
    onDesignComplete(designData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Exercise
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-xl font-bold text-gray-900">Reflection Complete</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Persona Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 sticky top-6">
              <div className="flex items-center gap-3 mb-6">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${persona.color}15` }}
                >
                  <User className="w-4 h-4" style={{ color: persona.color }} />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Persona Profile</h2>
              </div>
              
              <div className="text-center mb-8">
                <div 
                  className="w-24 h-24 rounded-full p-1 mx-auto mb-4 shadow-sm"
                  style={{
                    background: `linear-gradient(135deg, ${persona.color}, ${persona.color}80)`
                  }}
                >
                  <ImageWithFallback
                    src={persona.imageUrl}
                    alt={persona.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{persona.name}</h3>
                <p className="text-gray-600 mb-1">{persona.role}</p>
                <p className="text-sm text-gray-500 font-medium">Age: {persona.age}</p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-gray-900 mb-3">Characteristics</h4>
                  <ul className="space-y-3">
                    {persona.description.map((point, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div 
                          className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                          style={{ backgroundColor: persona.color }}
                        />
                        <span className="text-sm text-gray-700 leading-relaxed">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-4">Key Insights</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Strengths</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{reflectionData.strengths}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Important Values</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{reflectionData.importantThings}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Exclusion Story and Inclusivity Criteria */}
          <div className="lg:col-span-2 space-y-8">
            {/* Exclusion Story */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Exclusion Story in {cleanContext}</h2>
                </div>
              </div>

              <div className="space-y-4">
                <div 
                  className="px-4 py-2 rounded-lg inline-block"
                  style={{ 
                    backgroundColor: `${persona.color}20`
                  }}
                >
                  <p className="text-lg leading-relaxed">
                    <span className="font-bold">When I was trying to </span>
                    <span className="font-bold" style={{ color: persona.color }}>{exclusionStory.task}</span>
                    <span className="font-bold"> in </span>
                    <span className="font-bold" style={{ color: persona.color }}>{exclusionStory.place}</span>
                    <span className="font-bold">, I faced </span>
                    <span className="font-bold" style={{ color: persona.color }}>{exclusionStory.barrier}</span>
                    <span className="font-bold">, which made me feel </span>
                    <span className="font-bold" style={{ color: persona.color }}>{exclusionStory.emotion}</span>
                    <span className="font-bold">. Because of that, I </span>
                    <span className="font-bold" style={{ color: persona.color }}>{exclusionStory.consequence}</span>
                    <span className="font-bold">.</span>
                  </p>
                </div>

                {/* Generated Story Section */}
                <div className="mt-6">
                  <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Generated Story by AI</h4>
                  <div 
                    className="p-4 rounded-xl border-l-4"
                    style={{ 
                      backgroundColor: `${persona.color}08`,
                      borderLeftColor: persona.color
                    }}
                  >
                    {storyStatus === 'generating' && (
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full animate-spin border-2 border-gray-300"
                          style={{ borderTopColor: persona.color }}
                        />
                        <p className="text-base text-gray-600">AI is generating a story...</p>
                      </div>
                    )}
                    
                    {storyStatus === 'completed' && (
                      <p className="text-base leading-relaxed text-gray-800 italic">
                        {displayedStory}
                        {isTyping && <span className="animate-pulse">|</span>}
                      </p>
                    )}
                    
                    {storyStatus === 'failed' && (
                      <p className="text-base text-gray-500">스토리 생성에 실패했습니다.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>



            {/* Action Button */}
            {!showDesignForm && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setShowDesignForm(true)}
                  className="px-6 py-3 text-sm font-semibold rounded-lg text-white transition-all duration-200 hover:opacity-90 active:scale-95"
                  style={{ 
                    backgroundColor: persona.color
                  }}
                >
                  Designing AI Systems for {persona.name}
                </button>
              </div>
            )}

            {/* Design Form Modal */}
            {showDesignForm && (
              <div className="mt-8">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Design Your AI System</h2>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Title Input */}
                    <div className="space-y-2">
                      <label className="block font-semibold text-gray-900 mb-2">Title of the design</label>
                      <Input
                        value={designTitle}
                        onChange={(e) => setDesignTitle(e.target.value)}
                        placeholder="Enter a title for your AI system design..."
                        className="border-gray-200 focus:ring-0 focus:outline-none"
                        onFocus={(e) => {
                          e.target.style.borderColor = persona.color;
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#e5e7eb';
                        }}
                      />
                    </div>


                    {/* Description */}
                    <div className="space-y-2">
                      <label className="block font-semibold text-gray-900 mb-2">Design Description</label>
                      <Textarea
                        value={designDescription}
                        onChange={(e) => setDesignDescription(e.target.value)}
                        placeholder="Describe your AI system design, how it addresses the needs identified."
                        className="min-h-32 resize-none border-gray-200 focus:ring-0 focus:outline-none"
                        onFocus={(e) => {
                          e.target.style.borderColor = persona.color;
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#e5e7eb';
                        }}
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => setShowDesignForm(false)}
                        className="flex-1 px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDesignComplete}
                        disabled={!designTitle.trim() || !designDescription.trim()}
                        className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg text-white transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ 
                          backgroundColor: persona.color
                        }}
                      >
                        Write a Story
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}