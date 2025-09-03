import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { ArrowLeft, Send } from 'lucide-react';


interface UserProfilePageProps {
  persona: {
    id: number;
    name: string;
    role: string;
    description: string[];
    imageUrl: string;
    color: string;
    age: number;
  };
  onBack: () => void;
  onComplete: (reflectionData: {
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
  }) => void;
  initialData?: {
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
}



const personaLetters: Record<number, { greeting: string; content: string[]; closing: string }> = {
  1: {
    greeting: "Hello,",
    content: [
      "My name is Jace, and I’m a second-year Computer Science student. I grew up here in Singapore, and I’ve always been curious about how things work—whether it’s computers, gadgets, or even how cities are designed. Outside of class, I like tutoring high school students in coding and exploring new tech tools that make life easier. ",
      "People often assume that being “visually impaired” is one single experience, but it’s actually very different for each person. For me, I have a bit of residual vision—I can sense light and make out large shapes, but I can’t rely on it for reading or moving around safely. Most of the time, I use a white cane to get from place to place, and a screen reader for studying and daily tasks. ",
      "Of course, that doesn’t mean every day is simple. Sometimes it takes me longer to do things that others don’t even think twice about, like setting up a new device or finding the right classroom. But I’ve learned to problem-solve, and over time, I’ve become pretty good at using technology to manage on my own. ",
      "That’s why independence is something I value a lot. I don’t like depending too much on others for everyday things, so I’m always looking for tools or systems that give me more control. Looking ahead, I don’t want to be boxed into a narrow idea of what someone like me can or cannot do. I want to try different jobs, take on different roles, and keep proving—to myself and to others—that my possibilities are not defined by my vision. "
    ],
    closing: "Best,\nJace"
  },
  2: {
    greeting: "Hello,",
    content: [
      "My name is Maria, and I’m an exchange student from Spain studying Business. This is my first time in Singapore, and almost everything feels new—the food, the weather, the way classes are taught, even how people hang out after school. It’s exciting, but honestly, it can also feel overwhelming.",
      "Every day brings something unfamiliar. Sometimes it’s the little things, like figuring out which bus to take, or learning how the library system works. Other times, it’s bigger things, my English is not very good, so lectures, group projects, and even everyday conversations feel tough. Sometimes I understand the ideas, but I can’t find the right words quickly enough. So I often pause before speaking, wondering if I’ll say something wrong.",
      "Still, I try to see all of this as part of the experience. I’ve started to ask more questions, to observe, and to let myself learn slowly. Working part-time as a barista near campus has helped too—it gives me a chance to meet people outside the classroom and pick up new words and habits along the way.",
      "What matters most to me during this exchange is growing through these new experiences. I want to explore, make friends, and discover what it feels like to be part of this community. Even if it’s scary sometimes, I believe these moments of adjustment are where real learning happens."
    ],
    closing: "Best,\nMaria"
  },
  3: {
    greeting: "Hello,",
    content: [
      "My name is Daniel, and I’m a second-year Psychology student. I’ve always been curious about people—how they think, why they act the way they do—so studying psychology felt like the right choice for me. Outside of class, I volunteer with a youth mentoring program, which I really enjoy because it lets me connect with younger students and share some of my own experiences.",
      "Something important to know about me is that I have ADHD. For me, that means focusing for a long time is tough, especially when there’s too much information coming at once. My mind tends to jump from one thought to another quickly. Sometimes it feels like I’m juggling too many tabs open in my head at the same time.",
      "Of course, it can be frustrating when I lose track of deadlines or forget small tasks. But over time, I’ve learned different ways to cope—using reminders on my phone, breaking down tasks, and leaning on friends who keep me accountable. And in other situations, this fast, energetic way of thinking actually helps me—like when I need to brainstorm ideas or handle unexpected changes.",
      "What I value most is the chance to put my energy into something meaningful. I don’t want my challenges to define what I can or cannot do. Instead, I want to find spaces where my creativity, energy, and perspective are useful. For me, success isn’t about doing everything perfectly—it’s about discovering where I can contribute, and learning how to turn my way of thinking into a strength."
    ],
    closing: "Best,\nDaniel"
  },
  4: {
    greeting: "Hello,",
    content: [
      "My name is Mei Lin, and I work as a librarian at the NUS Central Library. I’ve been here for several years, and one of the things I enjoy most about my job is helping students and faculty find the resources they need. Whether it’s guiding someone through the databases or simply recommending a good book, I like being part of their learning journey.",
      "Right now, my life is going through a big change—I’m pregnant, in my second trimester. It’s an exciting time, but it also means I have to adjust how I work. My job often requires me to stand at the front desk, walk around the library, or move books and equipment. These days, I get tired more quickly, and I’ve had to learn to pace myself.",
      "Even so, I try to stay active and positive. I remind myself that this is just one stage of life, and it’s teaching me a lot about patience and balance. I also find myself thinking more about the future—not only for my own family but also about how environments and systems can better support people going through different life situations.",
      "What matters most to me is creating a supportive space—for my colleagues, for the students who come to the library, and soon, for my own child. I believe that everyone deserves an environment where they can feel comfortable, welcomed, and able to do their best."
    ],
    closing: "Best,\nMei Lin"
  }
};

export function UserProfilePage({ persona, onBack, onComplete, initialData }: UserProfilePageProps) {
  // initialData가 있으면 그 값을, 없으면 빈 문자열 사용
  const [strengths, setStrengths] = useState(initialData?.strengths || '');
  const [importantThings, setImportantThings] = useState(initialData?.importantThings || '');
  const [selectedContext, setSelectedContext] = useState<string>(initialData?.selectedContext || '');
  const [task, setTask] = useState(initialData?.exclusionStory?.task || '');
  const [place, setPlace] = useState(initialData?.exclusionStory?.place || '');
  const [barrier, setBarrier] = useState(initialData?.exclusionStory?.barrier || '');
  const [emotion, setEmotion] = useState(initialData?.exclusionStory?.emotion || '');
  const [consequence, setConsequence] = useState(initialData?.exclusionStory?.consequence || '');

  const currentLetter = personaLetters[persona.id];
  const contextOptions = ['🧭 Navigation', '📕 Education', '👥 Social Life'];


  const handleSubmit = () => {
    const reflection = {
      strengths,
      importantThings,
      selectedContext,
      exclusionStory: {
        task,
        place,
        barrier,
        emotion,
        consequence
      },
      inclusiveActions: [],
      generatedStory: null
    };

    // Navigate to summary page immediately
    onComplete(reflection);

    // Generate story in background
    setTimeout(async () => {
      try {
        const prompt = `Write a short, realistic story from ${persona.name}'s perspective. Add specific details to make this situation come alive, but keep it simple and concrete.

Person: ${persona.name}, ${persona.age} years old, ${persona.role}
Background: ${persona.description.join(', ')}

Basic situation: "When I was trying to ${task} in ${place}, I faced ${barrier}, which made me feel ${emotion}. Because of that, I ${consequence}."

Turn this into a short story (5-7 sentences) with specific details about what exactly happened. Use simple, everyday language. Focus on the actual actions and what ${persona.name} saw, heard, or had to do. Write it as "I" (first person). Add more concrete details about the environment, what other people did or said, and the specific steps involved.

Example format: "I walked into the library and approached the front desk to ask about..."

Keep it realistic and practical - no dramatic language or complex emotions. Just tell what happened step by step.`;

        const response = await fetch('/api/generate-story', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt }),
        });

        if (response.ok) {
          const data = await response.json();
          // Update the story through a custom event
          window.dispatchEvent(new CustomEvent('storyGenerated', {
            detail: { story: data.story }
          }));
        }
      } catch (error) {
        console.error('Failed to generate story:', error);
        window.dispatchEvent(new CustomEvent('storyGenerationFailed'));
      }
    }, 100);
  };


  const isFormComplete = strengths.trim() && importantThings.trim() && selectedContext && 
                        task.trim() && place.trim() && barrier.trim() && emotion.trim() && consequence.trim();

  // Dynamic width calculation for inline inputs
  const getInputWidth = (value: string, minWidth: number = 8) => {
    const charWidth = 0.6; // approximate width per character in rem
    const padding = 2; // padding in rem
    const calculatedWidth = Math.max(minWidth, value.length * charWidth + padding);
    return `${calculatedWidth}rem`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-2 py-6 max-w-full">
        {/* Header with Back Button */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2 hover:bg-white/50"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Personas
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-9 gap-6">
          {/* First Column - User Profile Only */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 sticky top-6 mt-[0px] mr-[0px] mb-[0px] ml-[20px]">
              <div className="text-center mb-6">
                <div 
                  className="w-20 h-20 rounded-full p-1 mx-auto mb-4"
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
                <h2 className="text-xl font-bold text-gray-900 mb-2">{persona.name}</h2>
                <p className="text-sm text-gray-600 mb-1">{persona.role}</p>
                <p className="text-sm font-medium text-gray-500">Age: {persona.age}</p>
              </div>
              <ul className="space-y-3">
                {persona.description.map((point, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div 
                      className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                      style={{ backgroundColor: persona.color }}
                    />
                    <span className="text-gray-600 leading-relaxed text-sm">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Second Column - Letter Section */}
          <div className="lg:col-span-3">
            {/* Letter Section */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 h-[800px] overflow-y-auto">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-[20px]">Letter from {persona.name}</h3>
              <div className="pr-2">
                <div className="space-y-5">
                  <div className="text-center mb-8">
                  </div>
                  <p className="text-base text-gray-700 leading-relaxed">
                    {currentLetter?.greeting}
                  </p>
                  
                  {currentLetter?.content.map((paragraph, index) => (
                    <p key={index} className="text-base text-gray-700 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                  
                  <div className="text-right mt-8 pt-6 border-t border-gray-100">
                    <pre className="text-sm text-gray-700 font-medium whitespace-pre-line">
                      {currentLetter?.closing}
                    </pre>
                    <p className="text-xs text-gray-500 mt-1">{persona.role}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Third Column - Reflection Exercise */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 sticky top-6 mt-[0px] mr-[20px] mb-[0px] ml-[0px] h-[800px] overflow-y-auto">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Persona Profile</h3>
              
              <div className="space-y-8">
                {/* Question 1: Strengths */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">1. What are this person&rsquo;s abilities/strengths?</h4>
                  <Textarea
                    placeholder="List the strengths and abilities you noticed from the letter (ex: tech skills, resilience, social skills)."
                    value={strengths}
                    onChange={(e) => setStrengths(e.target.value)}
                    className="min-h-24 resize-none border-gray-200 focus:ring-0 focus:outline-none"
                    style={{ 
                      '--tw-border-opacity': '1'
                    } as React.CSSProperties}
                    onFocus={(e) => {
                      e.target.style.borderColor = persona.color;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                    }}
                  />
                </div>

                {/* Question 2: Important Things */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">2. What matters to this person, and what are they hoping for?</h4>
                  <Textarea
                    placeholder="Describe what motivates them and their goals..."
                    value={importantThings}
                    onChange={(e) => setImportantThings(e.target.value)}
                    className="min-h-24 resize-none border-gray-200 focus:ring-0 focus:outline-none"
                    style={{ 
                      '--tw-border-opacity': '1'
                    } as React.CSSProperties}
                    onFocus={(e) => {
                      e.target.style.borderColor = persona.color;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                    }}
                  />
                </div>

                {/* Question 3: Context Selection */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">3. In which context might this user experience exclusion? Please select one.</h4>
                  <div className="flex gap-3">
                    {contextOptions.map((option) => (
                      <Button
                        key={option}
                        variant={selectedContext === option ? 'default' : 'outline'}
                        onClick={() => setSelectedContext(option)}
                        className="flex-1"
                        style={selectedContext === option ? {
                          backgroundColor: persona.color,
                          borderColor: persona.color
                        } : {
                          borderColor: persona.color,
                          color: persona.color
                        }}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Question 4: Exclusion Story */}
                {selectedContext && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">4. Let&rsquo;s write {persona.name}&rsquo;s <span style={{ color: persona.color }}>exclusion story</span> in the <span style={{ color: persona.color }}>{selectedContext}</span> context.</h4>
                    
                    {/* Enhanced Inline Template with Input Fields */}
                    <div 
                      className="relative overflow-hidden rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                      style={{ 
                        background: `linear-gradient(135deg, ${persona.color}08 0%, ${persona.color}03 100%)`,
                      }}
                    >
                      
                      {/* Story Content */}
                      <div className="p-6 pt-4">
                        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-5 border border-white/60">
                          <div className="flex flex-wrap items-center gap-2 text-base leading-relaxed">
                            <span className="font-bold" style={{ color: persona.color }}>When I was trying to</span>
                            <Input
                              placeholder="task"
                              value={task}
                              onChange={(e) => setTask(e.target.value)}
                              className="inline-flex h-8 bg-white/80 backdrop-blur-sm rounded-lg transition-all duration-200 hover:bg-white focus:bg-white shadow-sm focus:ring-0 focus:outline-none"
                              style={{ 
                                width: getInputWidth(task || 'task', 6)
                              } as React.CSSProperties}
                              onFocus={(e) => {
                                e.target.style.borderColor = persona.color;
                              }}
                              onBlur={(e) => {
                                e.target.style.borderColor = '#e5e7eb';
                              }}
                            />
                            <span className="font-bold" style={{ color: persona.color }}>in</span>
                            <Input
                              placeholder="place/environment"
                              value={place}
                              onChange={(e) => setPlace(e.target.value)}
                              className="inline-flex h-8 bg-white/80 backdrop-blur-sm rounded-lg transition-all duration-200 hover:bg-white focus:bg-white shadow-sm focus:ring-0 focus:outline-none"
                              style={{ 
                                width: getInputWidth(place || 'place/environment', 8)
                              } as React.CSSProperties}
                              onFocus={(e) => {
                                e.target.style.borderColor = persona.color;
                              }}
                              onBlur={(e) => {
                                e.target.style.borderColor = '#e5e7eb';
                              }}
                            />
                            <span className="font-bold" style={{ color: persona.color }}>, I faced</span>
                            <Input
                              placeholder="barrier/challenge"
                              value={barrier}
                              onChange={(e) => setBarrier(e.target.value)}
                              className="inline-flex h-8 bg-white/80 backdrop-blur-sm rounded-lg transition-all duration-200 hover:bg-white focus:bg-white shadow-sm focus:ring-0 focus:outline-none"
                              style={{ 
                                width: getInputWidth(barrier || 'barrier/challenge', 10)
                              } as React.CSSProperties}
                              onFocus={(e) => {
                                e.target.style.borderColor = persona.color;
                              }}
                              onBlur={(e) => {
                                e.target.style.borderColor = '#e5e7eb';
                              }}
                            />
                            <span className="font-bold" style={{ color: persona.color }}>, which made me feel</span>
                            <Input
                              placeholder="emotion"
                              value={emotion}
                              onChange={(e) => setEmotion(e.target.value)}
                              className="inline-flex h-8 bg-white/80 backdrop-blur-sm rounded-lg transition-all duration-200 hover:bg-white focus:bg-white shadow-sm focus:ring-0 focus:outline-none"
                              style={{ 
                                width: getInputWidth(emotion || 'emotion', 6)
                              } as React.CSSProperties}
                              onFocus={(e) => {
                                e.target.style.borderColor = persona.color;
                              }}
                              onBlur={(e) => {
                                e.target.style.borderColor = '#e5e7eb';
                              }}
                            />
                            <span className="font-bold" style={{ color: persona.color }}>. Because of that, I</span>
                            <Input
                              placeholder="result/consequence"
                              value={consequence}
                              onChange={(e) => setConsequence(e.target.value)}
                              className="inline-flex h-8 bg-white/80 backdrop-blur-sm rounded-lg transition-all duration-200 hover:bg-white focus:bg-white shadow-sm focus:ring-0 focus:outline-none"
                              style={{ 
                                width: getInputWidth(consequence || 'result/consequence', 9)
                              } as React.CSSProperties}
                              onFocus={(e) => {
                                e.target.style.borderColor = persona.color;
                              }}
                              onBlur={(e) => {
                                e.target.style.borderColor = '#e5e7eb';
                              }}
                            />
                            <span className="font-bold" style={{ color: persona.color }}>.</span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                )}


                {/* Submit Button */}
                <div className="pt-6">
                  <Button
                    onClick={handleSubmit}
                    disabled={!isFormComplete}
                    className="w-full"
                    style={{ 
                      backgroundColor: persona.color,
                      borderColor: persona.color
                    }}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Complete Reflection Exercise
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}