import { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { ArrowLeft, CheckCircle, User, Sparkles, AlertTriangle } from 'lucide-react';

interface DesignFictionPageProps {
  persona: {
    id: number;
    name: string;
    role: string;
    description: string[];
    imageUrl: string;
    color: string;
    age: number;
  };
  reflectionData: {
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
  };
  designData: {
    title: string;
    image: File | null;
    description: string;
  };
  onBack: () => void;
}

export function DesignFictionPage({ persona, reflectionData, designData, onBack }: DesignFictionPageProps) {
  const [utopiaStory, setUtopiaStory] = useState('');
  const [dystopiaStory, setDystopiaStory] = useState('');
  const [utopiaStatus, setUtopiaStatus] = useState<'generating' | 'completed' | 'failed'>('generating');
  const [dystopiaStatus, setDystopiaStatus] = useState<'generating' | 'completed' | 'failed'>('generating');
  const [displayedUtopia, setDisplayedUtopia] = useState('');
  const [displayedDystopia, setDisplayedDystopia] = useState('');
  const [utopiaTyping, setUtopiaTyping] = useState(false);
  const [dystopiaTyping, setDystopiaTyping] = useState(false);
  const [utopiaHighlights, setUtopiaHighlights] = useState<Array<{start: number, end: number, text: string}>>([]);
  const [dystopiaHighlights, setDystopiaHighlights] = useState<Array<{start: number, end: number, text: string}>>([]);
  const [selectedText, setSelectedText] = useState<{text: string, type: 'utopia' | 'dystopia'} | null>(null);

  // Remove emoji from context for display
  const cleanContext = reflectionData.selectedContext.replace(/^[^\s]*\s/, '');

  // Generate design fictions on page load
  useEffect(() => {
    generateDesignFictions();
  }, []);

  // Handle text selection and highlighting
  useEffect(() => {
    // Only enable highlighting when both stories are fully typed
    const canHighlight = !utopiaTyping && !dystopiaTyping && utopiaStatus === 'completed' && dystopiaStatus === 'completed';
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && selectedText && canHighlight) {
        const selection = window.getSelection();
        if (selection && selection.toString().trim() === selectedText.text) {
          const range = selection.getRangeAt(0);
          const container = range.commonAncestorContainer.parentElement;
          const storyContainer = container?.closest('[data-story-type]');
          
          if (storyContainer) {
            const storyType = storyContainer.getAttribute('data-story-type') as 'utopia' | 'dystopia';
            const fullText = selectedText.type === 'utopia' ? displayedUtopia : displayedDystopia;
            const selectedTextContent = selection.toString();
            const startIndex = fullText.indexOf(selectedTextContent);
            
            if (startIndex !== -1) {
              const highlight = {
                start: startIndex,
                end: startIndex + selectedTextContent.length,
                text: selectedTextContent
              };
              
              if (storyType === 'utopia') {
                setUtopiaHighlights(prev => [...prev, highlight]);
              } else {
                setDystopiaHighlights(prev => [...prev, highlight]);
              }
              
              selection.removeAllRanges();
            }
          }
        }
        setSelectedText(null);
      }
    };

    const handleMouseUp = () => {
      if (!canHighlight) return;
      
      const selection = window.getSelection();
      if (selection && selection.toString().trim()) {
        const range = selection.getRangeAt(0);
        const container = range.commonAncestorContainer.parentElement;
        const storyContainer = container?.closest('[data-story-type]');
        
        if (storyContainer) {
          const storyType = storyContainer.getAttribute('data-story-type') as 'utopia' | 'dystopia';
          setSelectedText({
            text: selection.toString().trim(),
            type: storyType
          });
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [selectedText, displayedUtopia, displayedDystopia, utopiaTyping, dystopiaTyping, utopiaStatus, dystopiaStatus]);

  // Function to render text with highlights
  const renderHighlightedText = (text: string, highlights: Array<{start: number, end: number, text: string}>, type: 'utopia' | 'dystopia') => {
    if (highlights.length === 0) {
      return text;
    }

    const parts = [];
    let lastIndex = 0;

    // Sort highlights by start position
    const sortedHighlights = [...highlights].sort((a, b) => a.start - b.start);

    sortedHighlights.forEach((highlight, index) => {
      // Add text before highlight
      if (highlight.start > lastIndex) {
        parts.push(text.substring(lastIndex, highlight.start));
      }
      
      // Add highlighted text
      const highlightClass = type === 'utopia' ? 'bg-green-200 hover:bg-green-300' : 'bg-red-200 hover:bg-red-300';
      parts.push(
        <span 
          key={`highlight-${index}`} 
          className={`${highlightClass} px-1 rounded cursor-pointer transition-colors`}
          onClick={() => removeHighlight(type, index)}
          title="Click to remove highlight"
        >
          {text.substring(highlight.start, highlight.end)}
        </span>
      );
      
      lastIndex = highlight.end;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts;
  };

  const generateDesignFictions = async () => {
    try {
      const prompt = `Generate two design fiction stories based on the following information:

Person: ${persona.name}, ${persona.age} years old, ${persona.role}
Background: ${persona.description.join(', ')}

Context: ${cleanContext}
Exclusion Story: When trying to ${reflectionData.exclusionStory.task} in ${reflectionData.exclusionStory.place}, faced ${reflectionData.exclusionStory.barrier}, which made them feel ${reflectionData.exclusionStory.emotion}. Because of that, they ${reflectionData.exclusionStory.consequence}.

Design Solution: 
Title: ${designData.title}
Description: ${designData.description}

Write TWO design fiction stories (4 paragraphs each) that explore how this design might impact ${persona.name}'s life, their community, and society:

1. UTOPIA SCENARIO: Show the positive potential - how this technology could genuinely improve ${persona.name}'s life and create positive ripple effects in their community and society. Be realistic but optimistic.

2. DYSTOPIA SCENARIO: Show potential adverse effects and risks - how this technology might create new problems, dependencies, privacy concerns, or unintended social consequences. Focus on realistic concerns rather than apocalyptic scenarios.

Each story should be 4 paragraphs, written from ${persona.name}'s perspective in first person. Use simple, engaging language that makes readers think critically about technology's impact.`;

      const response = await fetch('/api/generate-design-fiction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (response.ok) {
        const data = await response.json();
        setUtopiaStory(data.utopia);
        setDystopiaStory(data.dystopia);
        setUtopiaStatus('completed');
        setDystopiaStatus('completed');

        // Start typing effects with delay
        setTimeout(() => startTypingEffect(data.utopia, 'utopia'), 500);
        setTimeout(() => startTypingEffect(data.dystopia, 'dystopia'), 2000);
      } else {
        setUtopiaStatus('failed');
        setDystopiaStatus('failed');
      }
    } catch (error) {
      console.error('Failed to generate design fictions:', error);
      setUtopiaStatus('failed');
      setDystopiaStatus('failed');
    }
  };

  const startTypingEffect = (story: string, type: 'utopia' | 'dystopia') => {
    const setDisplayed = type === 'utopia' ? setDisplayedUtopia : setDisplayedDystopia;
    const setTyping = type === 'utopia' ? setUtopiaTyping : setDystopiaTyping;

    setTyping(true);
    setDisplayed('');
    
    let currentIndex = 0;
    
    const typeWriter = () => {
      if (currentIndex < story.length) {
        setDisplayed(story.substring(0, currentIndex + 1));
        currentIndex++;
        setTimeout(typeWriter, 20); // Faster typing for longer content
      } else {
        setTyping(false);
      }
    };

    typeWriter();
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
            Back to Design
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-xl font-bold text-gray-900">Design Fiction Stories</span>
          </div>
        </div>

        {/* Design Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-start gap-4">
            <div 
              className="w-12 h-12 rounded-xl p-1 flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, ${persona.color}, ${persona.color}80)`
              }}
            >
              <ImageWithFallback
                src={persona.imageUrl}
                alt={persona.name}
                className="w-full h-full rounded-lg object-cover"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{designData.title}</h2>
              <p className="text-gray-600 mb-2">Designed for {persona.name} • {cleanContext} context</p>
              <p className="text-sm text-gray-700 leading-relaxed">{designData.description}</p>
            </div>
          </div>
        </div>

        {/* Highlighting Instructions */}
        <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
          <h3 className="text-lg font-bold text-gray-900 mb-3">💡 Select text by dragging your cursor, then press "Enter" to highlight important insights.</h3>
          <p className="text-xs text-gray-500 mt-2 font-medium ml-4">
              * Highlighting will be available after both stories finish loading
            </p>
        </div>

        {/* Fiction Stories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Utopia Story */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Utopian Vision</h3>
                <p className="text-sm text-gray-500">Positive potential and benefits</p>
              </div>
            </div>

            <div className="min-h-64">
              {utopiaStatus === 'generating' && (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full animate-spin border-2 border-gray-300 border-t-green-600" />
                  <p className="text-base text-gray-600">AI is generating utopian scenario...</p>
                </div>
              )}
              
              {utopiaStatus === 'completed' && (
                <div 
                  className="prose prose-gray max-w-none text-base leading-relaxed text-gray-800 select-text whitespace-pre-line" 
                  data-story-type="utopia"
                >
                  {renderHighlightedText(displayedUtopia, utopiaHighlights, 'utopia')}
                  {utopiaTyping && <span className="animate-pulse">|</span>}
                </div>
              )}
              
              {utopiaStatus === 'failed' && (
                <p className="text-base text-gray-500">Failed to generate utopian scenario.</p>
              )}
            </div>
          </div>

          {/* Dystopia Story */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Dystopian Concerns</h3>
                <p className="text-sm text-gray-500">Potential risks and adverse effects</p>
              </div>
            </div>

            <div className="min-h-64">
              {dystopiaStatus === 'generating' && (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full animate-spin border-2 border-gray-300 border-t-red-600" />
                  <p className="text-base text-gray-600">AI is generating dystopian scenario...</p>
                </div>
              )}
              
              {dystopiaStatus === 'completed' && (
                <div 
                  className="prose prose-gray max-w-none text-base leading-relaxed text-gray-800 select-text whitespace-pre-line" 
                  data-story-type="dystopia"
                >
                  {renderHighlightedText(displayedDystopia, dystopiaHighlights, 'dystopia')}
                  {dystopiaTyping && <span className="animate-pulse">|</span>}
                </div>
              )}
              
              {dystopiaStatus === 'failed' && (
                <p className="text-base text-gray-500">Failed to generate dystopian scenario.</p>
              )}
            </div>
          </div>
        </div>

        {/* Reflection Prompt */}
        <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 border border-purple-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Critical Reflection</h3>
          <p className="text-base text-gray-700 leading-relaxed">
            These design fiction stories explore different possibilities for how technology might impact {persona.name}'s life and society. 
            Consider: What aspects of each scenario feel most realistic? How might we design technology to maximize benefits while minimizing risks? 
            What safeguards or considerations should be built into inclusive design processes?
          </p>
        </div>
      </div>
    </div>
  );
}