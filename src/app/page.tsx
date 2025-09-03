'use client';

import { useAppContext } from '@/contexts/AppContext';
import { PersonaCard } from '@/components/PersonaCard';
import { UserProfilePage } from '@/components/UserProfilePage';
import { ReflectionSummaryPage } from '@/components/ReflectionSummaryPage';
import { DesignFictionPage } from '@/components/DesignFictionPage';

const personas = [
  {
    id: 1,
    name: 'Jace',
    role: 'Computer Science Student (Year 2)',
    description: [
      'Blind since childhood',
      'Confidently uses a white cane for mobility and screen readers for studying',
      'Manages coursework with assistive technology but often needs to troubleshoot accessibility issues on his own',
      'Works part-time as a coding tutor for high school students'
    ],
    imageUrl: '/persona/persona1.png',
    color: '#6366f1',
    age: 20
  },
  {
    id: 2,
    name: 'Maria',
    role: 'Business Exchange Student',
    description: [
      'From Spain, new to Singapore',
      'Limited English and almost no Chinese proficiency',
      'Struggles with lectures, group projects, and reading campus signage',
      'Works part-time as a barista at a café near campus to support her stay'
    ],
    imageUrl: '/persona/persona2.png',
    color: '#f59e0b',
    age: 22
  },
  {
    id: 3,
    name: 'Daniel',
    role: 'Psychology Student (Year 2)',
    description: [
      'Has ADHD, making it hard to stay focused in long lectures and to organize multiple assignments',
      'Uses reminders, apps, and peer support to manage deadlines',
      'Enjoys interactive, hands-on learning methods',
      'Active volunteer in a local youth mentoring program'
    ],
    imageUrl: '/persona/persona3.png',
    color: '#ec4899',
    age: 21
  },
  {
    id: 4,
    name: 'Mei',
    role: 'NUS Central Library Librarian',
    description: [
      'Pregnant, currently in her second trimester',
      'Provides front-desk service and resource support for students and faculty',
      'Needs to be on her feet and move around for long periods',
      'Balancing health, work responsibilities, and planning for maternity leave'
    ],
    imageUrl: '/persona/persona4.png',
    color: '#10b981',
    age: 28
  }
];

export default function Home() {
  const { 
    appState, 
    setSelectedPersona, 
    setReflectionData, 
    setDesignData, 
    setCurrentView,
    resetAllData,
    hasAnyData
  } = useAppContext();
  
  const { selectedPersona, reflectionData, designData, currentView } = appState;

  const handlePersonaSelect = (personaId: number) => {
    const persona = personas.find(p => p.id === personaId);
    if (persona) {
      // PersonaCard를 새로 선택할 때, 기존 데이터가 있다면 경고창 표시
      if (hasAnyData()) {
        const confirmed = window.confirm(
          "Selecting a new persona will delete all data you've entered so far. Do you want to continue?"
        );
        if (!confirmed) {
          return;
        }
        resetAllData();
      }
      
      setSelectedPersona(persona);
      setCurrentView('exercise');
    }
  };

  const handleBackToPersonas = () => {
    // 뒤로가기일 때는 데이터 유지하고 PersonaCard 페이지로 이동
    if (hasAnyData()) {
      const confirmed = window.confirm(
        "Going back to persona selection will delete all data you've entered so far. Do you want to continue?"
      );
      if (!confirmed) {
        return;
      }
      resetAllData();
    }
    
    setSelectedPersona(null);
    setCurrentView('personas');
  };

  const handleExerciseComplete = (data: any) => {
    setReflectionData(data);
    setCurrentView('summary');
  };

  const handleBackToExercise = () => {
    setCurrentView('exercise');
  };

  const handleDesignComplete = (data: any) => {
    setDesignData(data);
    setCurrentView('design-fiction');
  };

  const handleBackToSummary = () => {
    setCurrentView('summary');
  };

  if (currentView === 'exercise' && selectedPersona) {
    return (
      <UserProfilePage 
        persona={selectedPersona}
        onBack={handleBackToPersonas}
        onComplete={handleExerciseComplete}
        initialData={reflectionData}
      />
    );
  }

  if (currentView === 'summary' && selectedPersona && reflectionData) {
    return (
      <ReflectionSummaryPage
        persona={selectedPersona}
        reflectionData={reflectionData}
        onBack={handleBackToExercise}
        onDesignComplete={handleDesignComplete}
        initialDesignData={designData}
      />
    );
  }

  if (currentView === 'design-fiction' && selectedPersona && reflectionData && designData) {
    return (
      <DesignFictionPage
        persona={selectedPersona}
        reflectionData={reflectionData}
        designData={designData}
        onBack={handleBackToSummary}
        onDescriptionUpdate={(newDescription: string) => {
          // 디자인 데이터의 설명을 업데이트
          const updatedDesignData = { ...designData, description: newDescription };
          setDesignData(updatedDesignData);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Persona
          </h1>
        </div>

        {/* Persona Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {personas.map((persona) => (
            <PersonaCard
              key={persona.id}
              name={persona.name}
              role={persona.role}
              description={persona.description}
              imageUrl={persona.imageUrl}
              color={persona.color}
              onClick={() => handlePersonaSelect(persona.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
