// ATM - API Integration (Mocked for now)

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Generate assessment from config
export async function generateAssessment(config) {
  await delay(800); // Simulate API call
  
  const questions = generateMockQuestions(config.questionCount, config.chapters);
  
  return {
    id: 'assessment-' + Date.now(),
    questions: questions,
    pdfUrl: '#mock-question-paper.pdf',
    answerSheetUrl: '#mock-answer-sheet.pdf'
  };
}

// Submit digital answers for grading
export async function submitDigitalAnswers(assessmentId, answers, questions) {
  await delay(1000); // Simulate grading
  
  return generateMockReport(answers, questions);
}

// Submit uploaded answer sheets for OCR + grading
export async function submitUploadedAnswers(assessmentId, files) {
  await delay(1500); // Simulate OCR + grading
  
  // For mock, generate random report
  const mockQuestions = generateMockQuestions(10, []);
  const mockAnswers = {};
  mockQuestions.forEach((q, i) => {
    mockAnswers[q.id] = i % 3 === 0 ? 'wrong' : 'correct';
  });
  
  return generateMockReport(mockAnswers, mockQuestions);
}

// Generate mock questions
function generateMockQuestions(count, chapters) {
  const questionTypes = ['MCQ', 'FIB', 'SHORT', 'LONG'];
  const questions = [];
  
  const sampleMCQs = [
    {
      text: 'What did Lencho hope for?',
      options: ['Rain for his crops', 'Money from the post office', 'A letter from his friend', 'Sunshine for harvest']
    },
    {
      text: 'Why did Lencho say the raindrops were like new coins?',
      options: ['They were shiny', 'Rain would bring good harvest and money', 'They were round', 'He was dreaming']
    },
    {
      text: 'Who did Lencho write a letter to?',
      options: ['The President', 'His friend', 'God', 'The postmaster']
    }
  ];
  
  const sampleFIB = [
    'The postmaster was a _______ man who helped Lencho.',
    'Lencho called the post office employees a bunch of _______.',
    'The field of ripe corn dotted with flowers promised a good _______.'
  ];
  
  const sampleShort = [
    'Describe Lencho\'s feelings when the hail stopped.',
    'Why did the postmaster decide to help Lencho?',
    'What did the post office employees do after reading the letter?'
  ];
  
  const sampleLong = [
    'Explain how Lencho\'s faith in God remained unshaken throughout the story.',
    'Discuss the irony in the story "A Letter to God".',
    'Compare and contrast Lencho\'s character with that of the postmaster.'
  ];
  
  for (let i = 0; i < count; i++) {
    const type = questionTypes[i % questionTypes.length];
    let question = {
      id: `q-${i + 1}`,
      number: i + 1,
      type: type
    };
    
    switch (type) {
      case 'MCQ':
        const mcq = sampleMCQs[i % sampleMCQs.length];
        question.text = mcq.text;
        question.options = mcq.options;
        question.correctAnswer = mcq.options[0];
        break;
      case 'FIB':
        question.text = sampleFIB[i % sampleFIB.length];
        question.correctAnswer = 'kind';
        break;
      case 'SHORT':
        question.text = sampleShort[i % sampleShort.length];
        question.correctAnswer = 'Sample short answer';
        break;
      case 'LONG':
        question.text = sampleLong[i % sampleLong.length];
        question.correctAnswer = 'Sample long answer';
        break;
    }
    
    questions.push(question);
  }
  
  return questions;
}

// Generate mock report
function generateMockReport(answers, questions) {
  let correct = 0;
  const questionResults = questions.map(q => {
    const userAnswer = answers[q.id];
    let isCorrect = false;
    
    if (q.type === 'MCQ') {
      isCorrect = userAnswer === q.correctAnswer;
    } else {
      // For other types, simulate ~70% accuracy
      isCorrect = Math.random() > 0.3;
    }
    
    if (isCorrect) correct++;
    
    return {
      id: q.id,
      number: q.number,
      text: q.text,
      isCorrect: isCorrect,
      userAnswer: userAnswer,
      correctAnswer: q.correctAnswer
    };
  });
  
  return {
    assessmentId: 'assessment-' + Date.now(),
    correct: correct,
    total: questions.length,
    percentage: Math.round((correct / questions.length) * 100),
    questions: questionResults,
    feedback: {
      strengths: 'You demonstrated good understanding of the main characters and their motivations. Your recall of key events in the story is solid.',
      improvements: 'Focus on understanding the deeper themes and literary devices used in the text. Practice analyzing the author\'s intent and message.',
      nextSteps: 'Review Chapter 1 again, paying special attention to the irony in the story. Try answering more application-level questions to strengthen your analytical skills.'
    }
  };
}

// Get chapters for a subject
export function getChaptersForSubject(subject) {
  const chapterMap = {
    'English': [
      { id: 'FF01', name: 'A Letter to God' },
      { id: 'FF02', name: 'Long Walk to Freedom' },
      { id: 'FF03', name: 'Two Stories about Flying' },
      { id: 'FF04', name: 'From the Diary of Anne Frank' },
      { id: 'FF07', name: 'Glimpses of India' },
      { id: 'FF08', name: 'Mijbil the Otter' },
      { id: 'FF09', name: 'Madam Rides the Bus' },
      { id: 'FF10', name: 'The Sermon at Benares' },
      { id: 'FF11', name: 'The Proposal' }
    ],
    'Science': [
      { id: 'SC01', name: 'Chemical Reactions and Equations' },
      { id: 'SC02', name: 'Acids, Bases and Salts' },
      { id: 'SC03', name: 'Metals and Non-metals' },
      { id: 'SC04', name: 'Carbon and its Compounds' },
      { id: 'SC05', name: 'Life Processes' },
      { id: 'SC06', name: 'Control and Coordination' },
      { id: 'SC07', name: 'How do Organisms Reproduce?' },
      { id: 'SC08', name: 'Heredity and Evolution' },
      { id: 'SC09', name: 'Light - Reflection and Refraction' },
      { id: 'SC10', name: 'Electricity' }
    ],
    'Social': [
      { id: 'SS01', name: 'The Rise of Nationalism in Europe' },
      { id: 'SS02', name: 'Nationalism in India' },
      { id: 'SS03', name: 'The Making of a Global World' },
      { id: 'SS04', name: 'The Age of Industrialisation' },
      { id: 'SS05', name: 'Print Culture and the Modern World' },
      { id: 'SS06', name: 'Resources and Development' },
      { id: 'SS07', name: 'Forest and Wildlife Resources' },
      { id: 'SS08', name: 'Water Resources' },
      { id: 'SS09', name: 'Agriculture' },
      { id: 'SS10', name: 'Minerals and Energy Resources' }
    ]
  };
  
  return chapterMap[subject] || [];
}

// Get Indian states list
export function getIndianStates() {
  return [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Delhi',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal'
  ];
}
