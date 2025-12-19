// Demo Data Generator for ATM

const SUBJECTS = [
  { name: 'Mathematics', chapters: ['Algebra', 'Geometry', 'Fractions', 'Decimals', 'Percentages'] },
  { name: 'Science', chapters: ['Physics', 'Chemistry', 'Biology', 'Environment'] },
  { name: 'English', chapters: ['Grammar', 'Comprehension', 'Vocabulary', 'Writing'] },
  { name: 'Hindi', chapters: ['व्याकरण', 'पठन', 'लेखन'] },
  { name: 'Social Studies', chapters: ['History', 'Geography', 'Civics'] }
];

const SAMPLE_QUESTIONS = {
  'Mathematics': [
    { question: 'What is 15 + 27?', answer: '42', difficulty: 'easy' },
    { question: 'Solve: 8 × 7 = ?', answer: '56', difficulty: 'easy' },
    { question: 'Find the area of a rectangle with length 5cm and width 3cm', answer: '15 sq cm', difficulty: 'medium' },
    { question: 'What is 25% of 80?', answer: '20', difficulty: 'medium' },
    { question: 'Simplify: 3/4 + 1/2', answer: '5/4 or 1¼', difficulty: 'medium' },
    { question: 'Solve for x: 2x + 5 = 15', answer: 'x = 5', difficulty: 'hard' },
    { question: 'Find the perimeter of a triangle with sides 4cm, 5cm, and 6cm', answer: '15 cm', difficulty: 'easy' },
    { question: 'What is the square root of 144?', answer: '12', difficulty: 'medium' }
  ],
  'Science': [
    { question: 'What is the chemical symbol for water?', answer: 'H₂O', difficulty: 'easy' },
    { question: 'What is photosynthesis?', answer: 'Process by which plants make food using sunlight', difficulty: 'medium' },
    { question: 'Name the three states of matter', answer: 'Solid, Liquid, Gas', difficulty: 'easy' },
    { question: 'What is the unit of force?', answer: 'Newton', difficulty: 'medium' },
    { question: 'What organ pumps blood in the human body?', answer: 'Heart', difficulty: 'easy' },
    { question: 'What is the boiling point of water?', answer: '100°C', difficulty: 'easy' }
  ],
  'English': [
    { question: 'Identify the noun: "The cat sat on the mat."', answer: 'cat, mat', difficulty: 'easy' },
    { question: 'What is the past tense of "run"?', answer: 'ran', difficulty: 'easy' },
    { question: 'Complete: Neither he ___ his brother was present.', answer: 'nor', difficulty: 'medium' },
    { question: 'Give a synonym for "happy"', answer: 'joyful, glad, cheerful', difficulty: 'easy' },
    { question: 'Identify the verb: "She quickly finished her homework."', answer: 'finished', difficulty: 'easy' }
  ]
};

const FEEDBACK_TEMPLATES = [
  'Focus on practicing {topic} problems regularly',
  'Review the concepts of {topic} from your textbook',
  'Try solving more {difficulty} level questions',
  'Great progress in {topic}! Keep it up',
  'Work on understanding {topic} concepts better'
];

/**
 * Generate random demo history for a profile
 * @param {string} profileId - The profile ID
 * @param {number} count - Number of history items to generate
 * @returns {Array} Array of history items
 */
export function generateDemoHistory(profileId, count = 5) {
  const history = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    // Random date within last 30 days
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    
    // Random subject
    const subjectData = SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)];
    const chapters = [
      subjectData.chapters[Math.floor(Math.random() * subjectData.chapters.length)]
    ];
    
    // Sometimes add a second chapter
    if (Math.random() > 0.5 && subjectData.chapters.length > 1) {
      const secondChapter = subjectData.chapters.find(c => c !== chapters[0]);
      if (secondChapter) chapters.push(secondChapter);
    }
    
    // Generate question results
    const numQuestions = 5 + Math.floor(Math.random() * 6); // 5-10 questions
    const questionResults = generateQuestionResults(subjectData.name, numQuestions);
    
    // Calculate score
    const correctCount = questionResults.filter(q => q.correct).length;
    const partialCount = questionResults.filter(q => q.partial).length;
    const score = Math.round(((correctCount + partialCount * 0.5) / numQuestions) * 100);
    
    // Generate feedback
    const feedback = generateFeedback(subjectData.name, chapters[0], score);
    
    history.push({
      id: `demo_${profileId}_${i}_${Date.now()}`,
      subject: subjectData.name,
      chapters,
      date: date.toISOString(),
      score,
      total: numQuestions,
      correctCount,
      status: 'completed',
      duration: 10 + Math.floor(Math.random() * 20), // 10-30 minutes
      difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)],
      questionResults,
      feedback
    });
  }
  
  // Sort by date (most recent first)
  history.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  return history;
}

/**
 * Generate question results for a subject
 */
function generateQuestionResults(subject, count) {
  const questions = SAMPLE_QUESTIONS[subject] || SAMPLE_QUESTIONS['Mathematics'];
  const results = [];
  
  for (let i = 0; i < count; i++) {
    const q = questions[i % questions.length];
    const rand = Math.random();
    
    // 60% correct, 15% partial, 25% incorrect
    let correct = false;
    let partial = false;
    
    if (rand > 0.4) {
      correct = true;
    } else if (rand > 0.25) {
      partial = true;
    }
    
    results.push({
      question: q.question,
      answer: q.answer,
      studentAnswer: correct ? q.answer : (partial ? 'Partially correct answer' : 'Incorrect answer'),
      correct,
      partial,
      score: correct ? 1 : (partial ? 0.5 : 0),
      maxScore: 1,
      difficulty: q.difficulty
    });
  }
  
  return results;
}

/**
 * Generate feedback based on performance
 */
function generateFeedback(subject, chapter, score) {
  const feedbackItems = [];
  
  if (score >= 80) {
    feedbackItems.push(`Excellent work in ${subject}! You have a strong grasp of ${chapter}.`);
    feedbackItems.push('Try challenging yourself with harder problems to further improve.');
  } else if (score >= 60) {
    feedbackItems.push(`Good effort in ${subject}. You understand most concepts in ${chapter}.`);
    feedbackItems.push(`Review the questions you got wrong and practice similar problems.`);
  } else if (score >= 40) {
    feedbackItems.push(`Keep practicing ${subject}. Focus especially on ${chapter} concepts.`);
    feedbackItems.push('Consider reviewing your textbook notes before the next assessment.');
  } else {
    feedbackItems.push(`${subject} needs more attention. Start with the basics of ${chapter}.`);
    feedbackItems.push('Ask your teacher for help with difficult concepts.');
    feedbackItems.push('Practice a little every day for better results.');
  }
  
  return feedbackItems;
}

/**
 * Get demo history for display without full results (lighter)
 */
export function getDemoHistorySummary(history) {
  return history.map(item => ({
    id: item.id,
    subject: item.subject,
    chapters: item.chapters,
    date: item.date,
    score: item.score,
    status: item.status
  }));
}
