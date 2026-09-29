// ═════════════════════════════════════════════════════════════════════
// SRM E-CURRICULA OFFICIAL WORKSHEET REPOSITORY & VERIFIED SOLVER
// Dynamic Subject-Aware Solver: Strict 1-to-1 Course, Session & Slot Mapping
// ZERO Cross-Subject Contamination: UHV, OS, DSA, OOD, and APP strictly isolated.
// Full Question Document Preservation: All Outlines, Recaps, Activities & Solutions
// Guaranteed Direct Answered PDF Link Submission for Faculty Verification
// ═════════════════════════════════════════════════════════════════════

const SRM_COURSE_NAMES = {
  '21LEM202T': 'UNIVERSAL HUMAN VALUES',
  '21CSC202J': 'OPERATING SYSTEMS',
  '21CSC201J': 'DATA STRUCTURES AND ALGORITHMS',
  '21CSC101T': 'OBJECT ORIENTED DESIGN AND ANALYSIS',
  '21CSC203P': 'ADVANCED PROGRAMMING PRACTICE'
};

function cleanHtmlForPdf(html) {
  if (!html) return '';
  let s = String(html)
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<br\s*[\/]?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<\/tr>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<li[^>]*>/gi, '- ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&rsquo;|&lsquo;/gi, "'")
    .replace(/&rdquo;|&ldquo;/gi, '"')
    .replace(/&mdash;/gi, ' - ')
    .replace(/&ndash;/gi, ' - ')
    .replace(/&hellip;/gi, '...')
    .replace(/[\u2018\u2019\u0060\u00B4]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, ' - ')
    .replace(/[\u2022\u25CF\u25AA\u2023]/g, '- ')
    .replace(/[\u2026]/g, '...')
    .replace(/[^\x00-\x7F]/g, ' ')
    .replace(/\r/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return s;
}

function decodeHtmlEntities(str) {
  return cleanHtmlForPdf(str);
}

function drawStudentHeaderTable(doc, M, y, contentW, studentName, regNum, branch, dateStr) {
  const tableH = 18;
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.rect(M, y, contentW, tableH);
  doc.line(M + (contentW / 2), y, M + (contentW / 2), y + tableH);
  doc.line(M, y + 7, M + contentW, y + 7);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(51, 65, 85);
  doc.text('Name', M + 3, y + 5);
  doc.text('Reg. No.', M + (contentW / 2) + 3, y + 5);
  doc.text('Branch', M + 3, y + 11.5);
  doc.text('Date', M + (contentW / 2) + 3, y + 11.5);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  const nameLines = doc.splitTextToSize(studentName || 'Student', (contentW / 2) - 26);
  doc.text(nameLines, M + 22, y + 5);
  doc.text(String(regNum || ''), M + (contentW / 2) + 24, y + 5);

  const branchLines = doc.splitTextToSize(branch || 'Engineering', (contentW / 2) - 26);
  doc.text(branchLines, M + 22, y + 11);
  doc.text(String(dateStr || ''), M + (contentW / 2) + 24, y + 11.5);

  return y + tableH + 6;
}

// ═════════════════════════════════════════════════════════════════════
// SRM OFFICIAL WORKSHEET REPOSITORY (MATCHING SRM COORDINATOR DOCUMENTS)
// ═════════════════════════════════════════════════════════════════════
const SRM_WORKSHEETS_DB = {
  // ─────────────────────────────────────────────────────────────────
  // 21LEM202T: UNIVERSAL HUMAN VALUES
  // ─────────────────────────────────────────────────────────────────
  '21LEM202T': {
    // Session 101: Module 1 Session 1 / Lecture 1
    101: {
      1: {
        headerTitle: 'Universal Human Values - II (UHV-II) · A Foundation Course in Human Values and Professional Ethics',
        topic: 'Module 1 - Introduction to Value Education | Student Activity Worksheet',
        subTopic: 'Session 1, Lecture 1: Holistic Development and the Role of Education (Right Understanding, Relationship and Physical Facility)',
        slo: 'SLO 1: Requirements for Fulfilling Human Aspirations and Transformation',
        learningOutcomes: [
          'Identify the three requirements for fulfilling human aspirations - right understanding, relationship and physical facility.',
          'Explain the difference between living with animal consciousness and human consciousness.',
          'Describe holistic development as transformation, and the role of education in it.'
        ],
        howToEngage: [
          'Whatever is said is a proposal - do not assume it to be true or false.',
          'Verify it on your own right, on the basis of your natural acceptance.',
          'It is a dialogue: first between you and the teacher, then within your own self - between what you are and what you really want to be.'
        ],
        partARecap: [
          'The basic human aspiration is continuous happiness and prosperity.',
          'For an animal, physical facility is necessary and largely adequate; for a human being, physical facility is necessary but NOT adequate - something more is required.',
          'In addition to physical facility (with nature), relationship (with human beings) and right understanding (in the self) are also required.',
          'Living only for physical facility = animal consciousness; living for all three with the right priority = human consciousness.',
          'Holistic development = transformation from animal consciousness to human consciousness; the role of education-sanskar is to enable this transformation.'
        ],
        partBActivities: [
          {
            title: 'Activity 1: Desire vs. State of Being',
            desc: 'Tick your honest response in each column:',
            items: [
              { item: 'To be happy', answer: 'Do I WANT this? Yes | Is this my STATE now? Yes (seeking continuity)' },
              { item: 'To be prosperous', answer: 'Do I WANT this? Yes | Is this my STATE now? Partial (often confused with accumulation)' },
              { item: 'Continuity of happiness and prosperity', answer: 'Do I WANT this? Yes | Is this my STATE now? No (still seeking stability)' }
            ]
          },
          {
            title: 'Activity 2: Check Within Your Own Family',
            desc: 'Observations on physical facility vs relationship fulfilment:',
            items: [
              {
                item: 'Is the unhappiness in our family more due to lack of physical facility, or more due to lack of fulfilment in relationship?',
                answer: 'Unhappiness is predominantly due to lack of fulfilment in relationship (misunderstandings, lack of trust, unexpressed affection) rather than physical scarcity.'
              },
              {
                item: 'How much time & effort do I invest for physical facility vs. for fulfilment in relationship?',
                answer: 'More than 80% of time and effort is currently invested in acquiring physical facilities, while less than 20% is consciously devoted to nurturing relationship feelings.'
              }
            ]
          },
          {
            title: 'Activity 3: Putting the Three in Priority Order',
            desc: 'Priority order verified on natural acceptance:',
            items: [
              { item: 'Right understanding (in the self)', answer: 'Priority: 1 | Why: Without right understanding, one cannot identify needs or value relationships.' },
              { item: 'Relationship (with human beings)', answer: 'Priority: 2 | Why: Mutual happiness is achieved through feelings in relationship.' },
              { item: 'Physical facility (with nature)', answer: 'Priority: 3 | Why: Physical facility is necessary for bodily sustenance but secondary to understanding.' }
            ]
          }
        ],
        partCQuestions: [
          {
            q: 'Explain the difference between living with animal consciousness and human consciousness.',
            a: 'Living in Animal Consciousness means living solely for physical facilities and sensory gratification (food, shelter, survival, fear). For animals, physical facilities are necessary and complete. For human beings, living only for physical facility leads to greed, competition, exploitation, and acute dissatisfaction.\n\nLiving in Human Consciousness means recognizing all three requirements in their natural priority order: 1st Right Understanding in the Self, 2nd Relationship with human beings (mutual happiness), and 3rd Physical Facility with nature (mutual prosperity). Human consciousness enables an individual to live in harmony at all four levels of living.'
          },
          {
            q: 'Describe holistic development as transformation, and explain the role of education-sanskar in enabling it.',
            a: 'Holistic development is the systematic transformation of a human being from animal consciousness (living only for physical facilities) to human consciousness (living with right understanding, relationship, and physical facility in proper priority).\n\nThe role of education-sanskar is to facilitate this transformation by:\n1. Developing Right Understanding in the self through self-exploration based on Natural Acceptance.\n2. Inculcating Right Feelings in relationship, ensuring mutual happiness in family and society.\n3. Teaching sustainable skills for right utilization of physical facilities in mutual prosperity with nature.'
          }
        ]
      },
      2: {
        headerTitle: 'Universal Human Values - II (UHV-II)',
        topic: 'Module 1 - Introduction to Value Education',
        subTopic: 'Session 1, SLO 2: Self-Exploration and Continuous Happiness',
        slo: 'SLO 2: Human Aspirations and Right Priority',
        partCQuestions: [
          {
            q: 'Differentiate between Happiness (Sukh) and Physical Facilities (Suvidha). What is their correct priority?',
            a: 'Happiness (Sukh) is a state of synergy, harmony, and peace within the Self (\'I\'). It is continuous, qualitative, and fulfilled through Right Understanding and Feelings (Trust, Respect).\nPhysical Facilities (Suvidha) are material items for nurturing, protection, and right utilization of the Body. They are quantitative, limited in time, and fulfilled through production with nature.\n\nCorrect Priority Order:\n1. Right Understanding in the Self\n2. Relationship with human beings (Mutual Happiness)\n3. Physical Facilities with nature (Mutual Prosperity).'
          }
        ]
      }
    },

    // Session 204: Module 2 Session 4 / Lecture 10 (From SRM Coordinator 2041.docx)
    204: {
      1: {
        headerTitle: 'Universal Human Values - II · Module 2: Harmony in the Human Being',
        topic: 'Session 4 - Student Activity Worksheet',
        subTopic: 'Lecture 10 - Understanding Harmony in the Self',
        slo: 'SLO 1: Understanding Harmony in the Self & Sources of Imagination',
        learningOutcomes: [
          'Identify the activities of the Self - desire (imaging), thought (analysing-comparing) and expectation (selecting-tasting) - together called imagination.',
          'Explain the three sources of motivation for imagination - preconditioning, sensation and natural acceptance - and their implications (enslavement vs self-organisation).',
          'Explain that harmony in the Self is imagination in line with natural acceptance, and contradiction is imagination not in line with it.',
          'Distinguish desire from expectation, and intention (natural acceptance, "what I really want to be") from competence ("what I am").'
        ],
        howToEngage: [
          'Whatever is stated here (and in the lecture) is a proposal - do not assume it to be true or false.',
          'Verify it on your own right, on the basis of your natural acceptance, and validate it in your living.',
          'Treat each question as a dialogue: first between you and the material, and then within your own Self - between what you are and what you really want to be.'
        ],
        partARecap: [
          'The activities of the Self together form imagination: desire (imaging the content, \'what I want to be\'), thought (analysing-comparing, how to fulfil it) and expectation (selecting-tasting). Behaviour and work are expressions of imagination.',
          'Imagination is motivated from three sources: (1) Preconditioning - assuming without knowing; not definite, changes with time/place/individual; leads to enslavement. (2) Sensation - information through sense organs; not definite; enslavement; runs from tasty-necessary to intolerable. (3) Natural acceptance - \'what I really want to be\', my intention; definite, continuous, universal; leads to self-organisation (swatantrata) and continuous happiness.',
          'When imagination is fully in line with natural acceptance, the Self is in harmony (swatantrata with definite human conduct). When motivated by preconditioning or sensation, the Self may be in contradiction and conduct is indefinite.',
          'Intention = natural acceptance, \'what I really want to be\'. Competence = \'what I am\'.'
        ],
        partBActivities: [
          {
            title: 'Activity 1 - Preconditioning, Sensation or Natural Acceptance?',
            desc: 'For each item, marked as P (Preconditioning), S (Sensation) or NA (Natural Acceptance):',
            items: [
              { item: 'Respect elders', answer: 'NA (Natural Acceptance)' },
              { item: 'To win', answer: 'P (Preconditioning)' },
              { item: 'Want to make the other happy', answer: 'NA (Natural Acceptance)' },
              { item: 'Healthy body', answer: 'NA (Natural Acceptance)' },
              { item: 'To be special, unique', answer: 'P (Preconditioning)' },
              { item: 'To come first in the class', answer: 'P (Preconditioning)' },
              { item: 'Feeling of collaboration', answer: 'NA (Natural Acceptance)' },
              { item: 'To get a good name', answer: 'P (Preconditioning)' },
              { item: 'Survival of the fittest', answer: 'P (Preconditioning)' },
              { item: 'I want that bike because I like its colour and shape', answer: 'S (Sensation)' },
              { item: 'To understand everything', answer: 'NA (Natural Acceptance)' },
              { item: 'Feeling of competition', answer: 'P (Preconditioning)' }
            ]
          },
          {
            title: 'Activity 2 - Desire or Expectation?',
            desc: 'Marked as D (Desire) or E (Expectation), as per the lecture deck:',
            items: [
              { item: 'Want to be the owner of a big house', answer: 'D (Desire)' },
              { item: 'Want others to like me, pay attention to me', answer: 'E (Expectation)' },
              { item: 'Name, fame', answer: 'E (Expectation)' },
              { item: 'Self-organisation (swatantrata)', answer: 'D (Desire)' },
              { item: 'Degree', answer: 'E (Expectation)' },
              { item: 'Right understanding (knowledge)', answer: 'D (Desire)' },
              { item: 'Job', answer: 'E (Expectation)' },
              { item: 'World tour', answer: 'E (Expectation)' }
            ]
          },
          {
            title: 'Activity 3 - Observe your imagination (5 minutes)',
            desc: 'Observations on imagination flow and motivations:',
            items: [
              {
                item: 'Were you aware of your imagination all of the time, or only some of the time?',
                answer: 'I was aware of my imagination for most of the time when consciously observing; occasional wandering occurred when external sensory stimuli triggered preconditioned memories.'
              },
              {
                item: 'Were the imaginations well connected, or were there sudden jumps / gaps? What is the reason?',
                answer: 'There were sudden jumps between academic deadlines, personal aspirations, and family relationships due to sensory interruptions.'
              },
              {
                item: 'For each imagination, what was the motivation - preconditioning, sensation or natural acceptance?',
                answer: 'Core desires for relationship harmony and health were motivated by Natural Acceptance. Immediate desires for material possessions and peer comparison were driven by sensation and preconditioning.'
              }
            ]
          }
        ],
        partCQuestions: [
          {
            q: 'Q1. What are the activities of the Self? Explain imagination as desire, thought and expectation, and how behaviour and work relate to it. [5]',
            a: 'The conscious entity, Self (\'I\'), performs three interconnected internal activities that together constitute Imagination:\n1. Desire (Imaging / Ichha): The domain of \'What I want to be\'. It sets the goal or objective in the form of mental images.\n2. Thought (Analysing & Comparing / Vichar): The mental processing of \'How to achieve it\'. It analyzes options, weighs alternatives, and plans the execution of desires.\n3. Expectation (Selecting & Tasting / Asha): The interaction with the outside world through the body, deciding what to select through the senses to taste or experience satisfaction.\n\nRelationship to Behaviour and Work:\nImagination in the Self is the internal foundation. Behaviour (interaction with other human beings) and Work (interaction with material nature) are the external expressions of our imagination. If imagination is grounded in right understanding, behavior leads to mutual happiness and work leads to mutual prosperity.'
          },
          {
            q: 'Q2. Explain the three sources of motivation for our imagination - preconditioning, sensation and natural acceptance - bringing out which lead to enslavement and which to self-organisation. [5]',
            a: 'Our imagination is driven by three distinct sources of motivation:\n1. Preconditioning (Manyata): Desires assumed without self-verification, adopted from peer pressure, media, or tradition. Because preconditioning is indefinite and external, living by it leads to Enslavement (Partantrata) and inner confusion.\n2. Sensation (Samvedana): Seeking continuous happiness through sensory pleasure (taste, touch, sound, sight, smell). Since physical sensations are temporary and run from tasty-necessary to intolerable with repetition, relying on sensation leads to sensory dependency and Enslavement (Partantrata).\n3. Natural Acceptance (Sahaj Swikriti): The innate, universal human faculty that recognizes harmony, coexistence, and mutual fulfillment. Because natural acceptance is invariant with time, place, and person, aligning imagination with it leads to Self-Organisation (Swatantrata) and continuous happiness (Swasthata).'
          },
          {
            q: 'Q3. When is the Self in harmony and when in contradiction? Relate this to natural acceptance, intention and competence. [5]',
            a: '• Self in Harmony: The Self is in harmony when there is complete synergy among desires, thoughts, and expectations, and all three are motivated by Natural Acceptance. This state of inner alignment is happiness (Sukh) and self-organisation (Swatantrata).\n• Self in Contradiction: The Self experiences contradiction when desires are motivated by contradictory preconditioning or temporary sensations. For example, desiring respect (natural acceptance) while plotting to put down a peer (preconditioning) causes acute internal friction and stress.\n• Relation to Intention and Competence: Intention is what we naturally want to be (our Natural Acceptance), which is always positive and harmonious. Competence is our current ability to realize that intention. Contradiction occurs when our competence lags behind our intention. Recognizing this gap motivates self-development rather than self-doubt or blaming others.'
          },
          {
            q: 'Q4. Distinguish between desire and expectation, with one example of each. [5]',
            a: '1. Desire (Imaging / Ichha): Refers to the qualitative, long-term state of being or destination that the Self wants to achieve. It is about the "What" - the fundamental aspiration.\n   • Example: Desiring to live in mutual trust and respect with family members, or desiring to be a knowledgeable and competent engineer.\n2. Expectation (Selecting & Tasting / Asha): Refers to the immediate, sensory or operational choice made through the body to fulfill a desire. It is about the "How" at the sensory/interactive level.\n   • Example: Expecting someone to greet me warmly when entering a room, or selecting a specific book or gadget to study.\nDistinction: Desires pertain to the fundamental goal of the Self; expectations pertain to specific behavioral selections and sensory interactions with the physical world.'
          },
          {
            q: 'Q5. Carry out the practice of observing your imagination for 5 minutes. Note whether you were aware of it all the time or only some of the time, and the motivation behind each imagination. [5]',
            a: 'Observation Log:\n• Minute 1: Thought about upcoming semester lab examinations and assignment deadlines. Motivation: Preconditioning (societal expectation of academic standing).\n• Minute 2: Thought about feeling thirsty and wanting a cold beverage. Motivation: Sensation (taste and body temperature regulation).\n• Minute 3: Thought about an unresolved conversation with a close friend, wishing for peace and mutual understanding. Motivation: Natural Acceptance (innate desire for relationship harmony).\n• Minute 4: Thought about purchasing a newly released electronic gadget. Motivation: Sensation and Preconditioning (advertising appeal and social status).\n• Minute 5: Thought about the purpose of engineering and contributing to ecological sustainability. Motivation: Natural Acceptance (right understanding of mutual enrichment with nature).\nAwareness Level: I was aware of my imagination for approximately 80% of the period; brief lapses occurred when sensations triggered associative daydreams.'
          }
        ],
        selfReflection: [
          {
            q: 'Are your desires, thoughts and expectations in harmony or in contradiction with each other?',
            a: 'On reflection, several desires motivated by sensory indulgence and competition contradict my natural acceptance for health and cooperation. Systematically evaluating each desire using natural acceptance eliminates these contradictions and restores inner peace.'
          },
          {
            q: 'For each imagination you notice, what is its motivation - preconditioning, sensation or natural acceptance?',
            a: 'Desires for genuine relationship, health, and knowledge arise from Natural Acceptance. Desires driven by vanity, comparison, or luxury stem from Preconditioning and Sensation.'
          }
        ]
      },
      2: {
        headerTitle: 'Universal Human Values - II · Module 2',
        topic: 'Session 4 - Student Activity Worksheet',
        subTopic: 'Lecture 10 - Understanding Harmony in the Self',
        slo: 'SLO 2: Practice and Evaluation of Self-Organisation',
        partCQuestions: [
          {
            q: 'Explain the interrelationship between Sanyam (Self-regulation) and Svasthya (Health).',
            a: 'Sanyam is the feeling of responsibility in the Self (\'I\') for nurturing, protection, and right utilization of the Body. Svasthya is the healthy condition of the Body where all physiological systems function in complete harmony.\nSanyam in the Self is the basis of Svasthya in the Body. When an individual lives with Sanyam, the body naturally remains healthy without medical dependency.'
          },
          {
            q: 'Why can physical facilities not compensate for a lack of feelings in relationship?',
            a: 'Physical facilities (Suvidha) cater to the physical, limited needs of the Body. Feelings (Trust, Respect, Affection) cater to the continuous, qualitative needs of the Self (\'I\'). Providing physical facilities without feelings causes humiliation rather than fulfillment.'
          }
        ]
      }
    },

    // Session 301: Module 3 Session 1 / Lecture 13 (From SRM Coordinator 3011.docx)
    301: {
      1: {
        headerTitle: 'Universal Human Values - II · Module 3: Harmony in the Family, Society and Nature',
        topic: 'Session 1 - Student Activity Worksheet',
        subTopic: 'Lecture 13 - Harmony in the Family: the Basic Unit of Human Interaction',
        slo: 'SLO 1: The Nine Feelings in Relationship and the Foundation of Family',
        learningOutcomes: [
          'Explain why the family is the basic unit of human organisation, and that the major issue in the family is fulfilment in relationship.',
          'Explain the four aspects of relationship: it is between two selves; there are feelings in it; feelings are definite (9 feelings); fulfilment leads to mutual happiness.',
          'Recognise the nine feelings in relationship, from Trust (foundation value) to Love (complete value).',
          'Explain why physical facility cannot compensate for a lack of feelings in relationship.'
        ],
        howToEngage: [
          'Whatever is stated here (and in the lecture) is a proposal - do not assume it to be true or false.',
          'Verify it on your own right, on the basis of your natural acceptance, and validate it in living.'
        ],
        partARecap: [
          'Relationship IS - between one Self (\'I\') and another Self (\'I\').',
          'There are feelings in relationship - in one Self (\'I\') for the other Self (\'I\').',
          'These feelings can be recognized - they are definite (9 feelings from Trust to Love).',
          'Their fulfilment and evaluation leads to mutual happiness (Ubhay-Sukh).'
        ],
        partBActivities: [
          {
            title: 'PART B - ACTIVITY 1: The Nine Feelings in Order',
            desc: 'Nine feelings in relationship in order, with foundation and complete values marked:',
            items: [
              { item: '1. Trust (Vishwas)', answer: 'FOUNDATION VALUE - Assurance of positive intention' },
              { item: '2. Respect (Samman)', answer: 'Right evaluation of the other' },
              { item: '3. Affection (Sneha)', answer: 'Feeling of relatedness' },
              { item: '4. Care (Mamata)', answer: 'Feeling of nurturing the body of the related' },
              { item: '5. Guidance (Vatsalya)', answer: 'Feeling of nurturing the Self of the related' },
              { item: '6. Reverence (Shraddha)', answer: 'Feeling of acceptance for excellence' },
              { item: '7. Glory (Gaurav)', answer: 'Feeling for those who made efforts for excellence' },
              { item: '8. Gratitude (Kritagyata)', answer: 'Feeling for those who helped me in my development' },
              { item: '9. Love (Prem)', answer: 'COMPLETE VALUE - Feeling of relatedness to all units' }
            ]
          },
          {
            title: 'PART B - ACTIVITY 2: Which Feeling is Naturally Acceptable?',
            desc: 'Naturally acceptable vs conditioned feelings:',
            items: [
              { item: 'Trust vs Mistrust', answer: 'Trust is naturally acceptable (opposition creates stress)' },
              { item: 'Respect vs Disrespect', answer: 'Respect is naturally acceptable (disrespect causes disharmony)' },
              { item: 'Affection vs Jealousy', answer: 'Affection is naturally acceptable' },
              { item: 'Care vs Exploitation', answer: 'Care is naturally acceptable' }
            ]
          }
        ],
        partCQuestions: [
          {
            q: 'Q1. Why is the family called the basic unit of human organisation, and what is the major issue in the family? [5]',
            a: 'The family is called the basic unit of human organisation because it is the fundamental building block where human relationships are recognized, experienced, and lived. Just as the biological cell is the structural unit of an organism, the family is the structural unit of society.\n\nThe major issue in the family is fulfilment in relationship. In modern times, family friction arises not due to material scarcity, but due to a failure to understand and fulfill the feelings in relationship. Focusing exclusively on economic transactions leaves the need of the Self unmet, resulting in conflict and emotional alienation.'
          },
          {
            q: 'Q2. Explain the four aspects of relationship in Universal Human Values. [5]',
            a: '1. Relationship is already embedded in existence between one Self (\'I\') and another Self (\'I\').\n2. In relationship, there are feelings (values) in the Self for the other Self.\n3. These feelings are definite - primarily the 9 values from Trust to Love.\n4. Recognizing and fulfilling these feelings leads to mutual evaluation and mutual happiness (Ubhay-Sukh).'
          },
          {
            q: 'Q3. Why can physical facility not compensate for a lack of feelings in relationship? [5]',
            a: 'Physical facilities fulfill bodily needs and are quantitative. Feelings fulfill the Self (\'I\') and are qualitative. Attempting to substitute physical gifts for trust or respect causes humiliation, demonstrating that physical facilities cannot compensate for absent feelings.'
          }
        ]
      },
      2: {
        headerTitle: 'Universal Human Values - II · Module 3',
        topic: 'Session 1 - Student Activity Worksheet',
        subTopic: 'Lecture 13 - SLO 2: Evaluation of Relationships',
        slo: 'SLO 2: Right Evaluation and Mutual Happiness',
        partCQuestions: [
          {
            q: 'Explain the role of Trust (Vishwas) as the foundation value in relationship.',
            a: 'Trust is the assurance that the other person naturally intends to make me happy. Differentiating between Intention (always positive) and Competence (ability to execute) eliminates anger and fosters mutual growth.'
          }
        ]
      }
    }
  },

  // ─────────────────────────────────────────────────────────────────
  // 21CSC203P: ADVANCED PROGRAMMING PRACTICE
  // ─────────────────────────────────────────────────────────────────
  '21CSC203P': {
    // Session 1: Introduction to Programming Languages (From app_1011.docx)
    101: {
      1: {
        headerTitle: 'SRM INSTITUTE OF SCIENCE AND TECHNOLOGY · SCHOOL OF COMPUTING',
        topic: 'DEPARTMENT OF COMPUTATIONAL INTELLIGENCE · 21CSC203P ADVANCED PROGRAMMING',
        subTopic: 'Session 1: Introduction to Programming Languages',
        slo: 'SLO 1: Elements of Programming Languages',
        partCQuestions: [
          {
            q: 'What is the syntax and semantics of the following Java statement: int x = 5 + 3;?',
            a: 'Syntax Analysis:\n• "int" is the reserved primitive type keyword specifying a 32-bit signed two\'s complement integer.\n• "x" is the variable identifier serving as a symbolic reference to a memory location.\n• "=" is the assignment operator transferring the right-hand evaluated value to the variable.\n• "5 + 3" is an additive arithmetic expression consisting of integer literals "5" and "3" joined by "+".\n• ";" is the statement terminator mandated by Java grammar rules.\n\nSemantics Analysis:\n• Expression Evaluation: The runtime evaluates the binary addition (5 + 3) to produce the integer literal 8.\n• Allocation & Storage: A 4-byte memory slot is allocated on the stack frame for variable "x". The binary value 8 (0x00000008) is stored into that location.'
          },
          {
            q: 'Identify lexical tokens in a simple Java program.',
            a: 'A token is the smallest individual lexical unit recognized by the compiler during lexical analysis.\nIn the sample statement "int count = 10;":\n1. Keyword: "int"\n2. Identifier: "count"\n3. Operator: "="\n4. Literal: "10"\n5. Separator: ";"'
          },
          {
            q: 'Modify a sample program to demonstrate the use of grammar rules in Java.',
            a: 'Demonstration of Java Grammar Rules:\npublic class GrammarDemo {\n    public static void main(String[] args) {\n        // Rule 1: Declarative grammar - Type followed by identifier\n        int base = 15;\n        int height = 8;\n        \n        // Rule 2: Expression grammar with operator precedence\n        double area = 0.5 * (base * height);\n        \n        // Rule 3: Block grammar enclosed in braces\n        if (area > 50) {\n            System.out.println("Valid polygon area: " + area);\n        }\n    }\n}'
          }
        ]
      },
      2: {
        headerTitle: 'SRM INSTITUTE OF SCIENCE AND TECHNOLOGY · SCHOOL OF COMPUTING',
        topic: 'DEPARTMENT OF COMPUTATIONAL INTELLIGENCE · 21CSC203P ADVANCED PROGRAMMING',
        subTopic: 'Session 1: Introduction to Programming Languages',
        slo: 'SLO 2: Language Classification',
        partCQuestions: [
          {
            q: 'Classify Java as compiled/interpreted and explain why.',
            a: 'Java is classified as a Two-Stage Hybrid (Both Compiled and Interpreted) programming language.\n1. Compilation Phase: Source code (.java) is compiled by the javac compiler into architecture-neutral, platform-independent Java Bytecode (.class files).\n2. Interpretation & JIT Phase: The Java Virtual Machine (JVM) interprets bytecode at runtime and employs the Just-In-Time (JIT) compiler (HotSpot) to compile frequently executed bytecode directly into native machine instructions.\n\nWhy this hybrid model is used:\n• Platform Independence ("Write Once, Run Anywhere"): The compiled bytecode runs on any system with a compatible JVM.\n• Security and Performance: Bytecode is verified before execution, and JIT compilation provides execution speed approaching pure compiled C/C++.'
          },
          {
            q: 'Write a simple Java program and explain how it is converted to bytecode.',
            a: 'Sample Java Program:\npublic class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello, SRM Advanced Programming!");\n    }\n}\n\nBytecode Conversion Process:\n1. Execution of "javac HelloWorld.java" invokes the compiler frontend.\n2. The compiler performs Lexical Analysis (tokenization), Syntax Analysis (Abstract Syntax Tree generation), and Semantic Analysis (type checking).\n3. The code generator emits binary class file format: "HelloWorld.class".\n4. Inspection with "javap -c HelloWorld" reveals bytecode instructions such as:\n   0: getstatic #2 // Field java/lang/System.out:Ljava/io/PrintStream;\n   3: ldc #3 // String Hello, SRM Advanced Programming!\n   5: invokevirtual #4 // Method java/io/PrintStream.println:(Ljava/lang/String;)V\n   8: return'
          },
          {
            q: 'Differentiate between low-level and high-level languages with examples.',
            a: '1. Low-Level Languages (e.g., Machine Code, Assembly):\n• Direct Hardware Access: Operates with CPU registers, memory addresses, and architecture-specific instruction sets.\n• High Performance, Low Portability: Executes with minimal overhead but must be rewritten for different CPU architectures.\n• Example: Assembly MOV AX, [BX] or binary machine code 0x89C3.\n\n2. High-Level Languages (e.g., Java, Python, C++):\n• Abstraction from Hardware: Uses human-readable English-like syntax, automatic memory management, and structured data types.\n• High Portability: Code is independent of CPU architecture; ported via compilers or virtual machines.\n• Example: System.out.println("Result = " + sum);'
          }
        ]
      }
    },

    // Session 10: Declarative Paradigm - Logic & DB (From user's reference Google Doc)
    10: {
      1: {
        headerTitle: 'SRM INSTITUTE OF SCIENCE AND TECHNOLOGY · SCHOOL OF COMPUTING',
        topic: 'DEPARTMENT OF COMPUTATIONAL INTELLIGENCE · 21CSC203P ADVANCED PROGRAMMING',
        subTopic: 'Session 10: Declarative Paradigm - Logic & DB',
        slo: 'SLO 1: Database Logic & Relational Operations',
        partCQuestions: [
          {
            q: 'Differentiate between declarative programming and imperative programming in the context of database queries.',
            a: '1. Declarative Programming (e.g., SQL, Prolog): Focuses on WHAT result is desired rather than HOW to calculate it. The programmer specifies the conditions and criteria (e.g., SELECT * FROM Students WHERE marks > 80), and the database query optimizer chooses the most efficient execution plan, indexing strategy, and join algorithms.\n\n2. Imperative Programming (e.g., Java, C++): Focuses on HOW to achieve the result through step-by-step procedural control flow (loops, condition checks, manual pointer/index manipulation).\n\nKey Differences:\n* Abstraction: Declarative provides high-level mathematical/logical abstraction; imperative exposes operational control.\n* Optimization: Declarative benefits from database internal query optimization (cost-based optimizer); imperative relies on manual programmer optimization.\n* State Mutation: Imperative relies heavily on mutable state; declarative emphasizes immutable result sets.'
          },
          {
            q: 'Explain ACID properties in relational database management systems.',
            a: 'ACID properties guarantee reliable transaction processing in database systems:\n* Atomicity: "All or nothing" - every statement in a transaction succeeds, or the entire transaction is rolled back.\n* Consistency: A transaction transforms the database from one valid state to another, preserving all integrity constraints (primary keys, foreign keys, unique rules).\n* Isolation: Concurrent execution of transactions yields the same system state as if they were executed serially (preventing dirty reads, non-repeatable reads, and phantom reads).\n* Durability: Once a transaction commits, its effects survive system crashes and power failures, recorded permanently in non-volatile storage and write-ahead logs.'
          },
          {
            q: 'How is transaction management handled in JDBC?',
            a: 'In JDBC, transaction management is handled using the Connection object:\n1. Disable Auto-Commit: By default, JDBC commits each statement automatically. To group multiple operations into an atomic transaction, set:\n   conn.setAutoCommit(false);\n2. Commit Transaction: After successfully executing all statements:\n   conn.commit();\n3. Rollback on Failure: If any SQLException occurs in the try block, revert all pending changes in the catch block:\n   conn.rollback();\n4. Restore Auto-Commit: In a finally block or try-with-resources:\n   conn.setAutoCommit(true);'
          }
        ]
      },
      2: {
        headerTitle: 'SRM INSTITUTE OF SCIENCE AND TECHNOLOGY · SCHOOL OF COMPUTING',
        topic: 'DEPARTMENT OF COMPUTATIONAL INTELLIGENCE · 21CSC203P ADVANCED PROGRAMMING',
        subTopic: 'Session 10: Declarative Paradigm - Logic & DB',
        slo: 'SLO 2: Database Processing',
        partCQuestions: [
          {
            q: 'Question 1: Write Java code to connect to MySQL using JDBC.',
            a: 'Answer:\nJava Code to Connect to MySQL using JDBC:\nimport java.sql.Connection;\nimport java.sql.DriverManager;\nimport java.sql.SQLException;\n\npublic class JDBCConnect {\n   public static void main(String[] args) {\n       String url = "jdbc:mysql://localhost:3306/testdb";\n       String user = "root";\n       String password = "password";\n\n       try {\n           Connection conn = DriverManager.getConnection(url, user, password);\n           if (conn != null) {\n               System.out.println("Successfully connected to MySQL database!");\n               conn.close();\n           }\n       } catch (SQLException e) {\n           e.printStackTrace();\n       }\n   }\n}'
          },
          {
            q: 'Question 2: Execute an INSERT and SELECT statement using JDBC.',
            a: 'Answer:\nExecuting INSERT and SELECT Statement using JDBC:\nimport java.sql.*;\n\npublic class JDBCInsertSelect {\n   public static void main(String[] args) {\n       String url = "jdbc:mysql://localhost:3306/testdb";\n       String user = "root";\n       String password = "password";\n\n       try (Connection conn = DriverManager.getConnection(url, user, password);\n            Statement stmt = conn.createStatement()) {\n\n           // Execute INSERT\n           String insertQuery = "INSERT INTO Students (id, name) VALUES (1, \'John Doe\')";\n           int rowsInserted = stmt.executeUpdate(insertQuery);\n           System.out.println("Rows inserted: " + rowsInserted);\n\n           // Execute SELECT\n           String selectQuery = "SELECT id, name FROM Students";\n           ResultSet rs = stmt.executeQuery(selectQuery);\n           while (rs.next()) {\n               System.out.println("ID: " + rs.getInt("id") + ", Name: " + rs.getString("name"));\n           }\n       } catch (SQLException e) {\n           e.printStackTrace();\n       }\n   }\n}'
          },
          {
            q: 'Question 3: Explain the purpose of prepared statements in Java.',
            a: 'Answer:\nPurpose of Prepared Statements in Java JDBC:\n* 1. SQL Injection Prevention: Precompiled parameters escape special characters, making malicious database attacks impossible.\n* 2. Pre-compilation & Performance: The database compiles the query structure once, allowing faster repeated executions with different parameters.\n* 3. Clean & Maintainable Code: Eliminates complex string concatenation when constructing SQL queries dynamically.\n\n// Prepared Statement Example\nString sql = "INSERT INTO Users (name, email) VALUES (?, ?)";\nPreparedStatement pstmt = conn.prepareStatement(sql);\npstmt.setString(1, "Alice");\npstmt.setString(2, "alice@example.com");\npstmt.executeUpdate();'
          }
        ]
      }
    }
  },

  // ─────────────────────────────────────────────────────────────────
  // 21CSC202J: OPERATING SYSTEMS
  // ─────────────────────────────────────────────────────────────────
  '21CSC202J': {
    101: {
      1: {
        headerTitle: 'SRM INSTITUTE OF SCIENCE AND TECHNOLOGY · SCHOOL OF COMPUTING',
        topic: '21CSC202J OPERATING SYSTEMS · Session 1',
        subTopic: 'Computer Hardware Architecture & OS Interfaces (Crossword Activity Worksheet)',
        slo: 'SLO 1: Hardware Abstraction & System Interfaces',
        partBActivities: [
          {
            title: 'Activity: Crossword Puzzle - Hardware and System Components',
            desc: 'Official SRM Crossword Puzzle - Hardware and system component definitions:',
            items: [
              { item: 'ACROSS 2: Pointing device detecting 2D motion for GUI navigation', answer: 'MOUSE' },
              { item: 'ACROSS 3: Output device displaying visual info including multimedia', answer: 'MONITOR' },
              { item: 'ACROSS 6: Non-volatile storage device retaining data when powered off', answer: 'HARD DISK / SSD' },
              { item: 'ACROSS 8: Hardware interface connecting I/O devices to CPU and memory', answer: 'SYSTEM BUS / I/O CONTROLLER' },
              { item: 'ACROSS 9: Primary input device used to enter text, numbers, and commands', answer: 'KEYBOARD' },
              { item: 'DOWN 1: Component managing reading/writing data to and from hard disk', answer: 'DISK CONTROLLER' },
              { item: 'DOWN 4: Temporary memory currently used by CPU/devices; typically RAM', answer: 'RAM / MAIN MEMORY' },
              { item: 'DOWN 5: Peripheral device producing a hard copy paper document', answer: 'PRINTER' },
              { item: 'DOWN 7: Fast memory component temporarily caching active data for CPU execution', answer: 'CACHE / MEMORY BUFFER' }
            ]
          }
        ]
      },
      2: {
        headerTitle: 'SRM INSTITUTE OF SCIENCE AND TECHNOLOGY · SCHOOL OF COMPUTING',
        topic: '21CSC202J OPERATING SYSTEMS · Session 1',
        subTopic: 'Topic: CPU, Memory & Computer Components Architecture (Hidden Word Puzzle)',
        slo: 'SLO 2: System Calls & Computer Architecture',
        partBActivities: [
          {
            title: 'Activity: Hidden Word Clue Puzzle - Computer Architecture',
            desc: 'Identify the computer architecture components from the clues to discover the hidden key term:',
            items: [
              { item: '1. Directs operation of processor by telling parts how to respond', answer: 'CONTROL UNIT (CU)' },
              { item: '2. Conveys information from computer to user in readable form', answer: 'OUTPUT UNIT' },
              { item: '3. Main memory or RAM temporarily storing active data/instructions', answer: 'PRIMARY MEMORY' },
              { item: '4. Receives data from user and converts to machine-understandable form', answer: 'INPUT UNIT' },
              { item: '7. General term for component holding data temporarily or permanently', answer: 'MEMORY UNIT' },
              { item: '11. Non-volatile memory storing data/programs permanently', answer: 'SECONDARY STORAGE' },
              { item: '19. Brain of the computer, processing instructions and managing all units', answer: 'CENTRAL PROCESSING UNIT (CPU)' },
              { item: '20. Part of CPU performing mathematical and logical operations', answer: 'ARITHMETIC LOGIC UNIT (ALU)' }
            ]
          }
        ]
      }
    }
  },

  // ─────────────────────────────────────────────────────────────────
  // 21CSC201J: DATA STRUCTURES AND ALGORITHMS
  // ─────────────────────────────────────────────────────────────────
  '21CSC201J': {
    101: {
      1: {
        headerTitle: 'SRM INSTITUTE OF SCIENCE AND TECHNOLOGY, Kattankulathur · School of Computing',
        topic: '21CSC201J - Data Structures and Algorithms',
        subTopic: 'Topic: Introduction to Programming in C and Structure of C Program',
        slo: 'SLO 1: Introduction to Programming in C and Structure of C Program (Activity: Crossword Puzzle)',
        partBActivities: [
          {
            title: 'Activity: Crossword Puzzle',
            desc: 'Official SRM Crossword Puzzle - Across and Down clues on C programming fundamentals:',
            items: [
              { item: 'Across 4. A named location in a memory, used to store a data value', answer: 'VARIABLE' },
              { item: 'Across 7. Pictorial representation of an algorithm', answer: 'FLOWCHART' },
              { item: 'Across 9. Which decision making statement used for menu selection', answer: 'SWITCH' },
              { item: 'Across 10. Which function is used to print the output?', answer: 'PRINTF' },
              { item: 'Across 11. Data type used to store whole numbers', answer: 'INT' },
              { item: 'Across 12. Identify the operator: ++', answer: 'INCREMENT' },
              { item: 'Across 14. Where does the execution of any C program begin?', answer: 'MAIN' },
              { item: 'Across 15. Data types used to store real numbers', answer: 'FLOAT' },
              { item: 'Across 16. Built in function used to find the square root', answer: 'SQRT' },
              { item: 'Down 1. Which built in function is used to read the data from keyboard?', answer: 'SCANF' },
              { item: 'Down 2. Pre-defined words in a C compiler', answer: 'KEYWORDS' },
              { item: 'Down 3. Who is the father of C language?', answer: 'DENNIS RITCHIE' },
              { item: 'Down 5. \\n refers to ?', answer: 'NEWLINE' },
              { item: 'Down 6. Which operators are used to compare 2 quantities?', answer: 'RELATIONAL' },
              { item: 'Down 8. Data type that has no value', answer: 'VOID' },
              { item: 'Down 13. Program which converts the C program into machine code', answer: 'COMPILER' }
            ]
          }
        ]
      },
      2: {
        headerTitle: 'SRM INSTITUTE OF SCIENCE AND TECHNOLOGY, Kattankulathur · School of Computing',
        topic: '21CSC201J - Data Structures and Algorithms',
        subTopic: 'Topic: General Rules for C Programming and Primitive Data Types',
        slo: 'SLO 2: General Rules for C Programming and Primitive Data Types (Activity: Match the following)',
        partBActivities: [
          {
            title: 'Activity: Match the following',
            desc: 'Match C programming tokens, keywords, and specifiers to their exact definitions:',
            items: [
              { item: '1. int', answer: 'G. Used to store whole numbers' },
              { item: '2. float', answer: 'I. Floating-point data type' },
              { item: '3. char', answer: 'H. Used to print characters' },
              { item: '4. main( )', answer: 'F. Keyword to start main function' },
              { item: '5. return 0;', answer: 'J. Ends a function and returns value to OS' },
              { item: '6. #include< stdio.h >', answer: 'C. Preprocessor directive' },
              { item: '7. ; (semicolon)', answer: 'D. Statement terminator' },
              { item: '8. %d', answer: 'B. Format specifier for integers' },
              { item: '9. %f', answer: 'A. Format specifier for float' },
              { item: '10. %c', answer: 'E. Format specifier for characters' }
            ]
          }
        ]
      }
    }
  }
};

// ═════════════════════════════════════════════════════════════════════
// STRICT COURSE LOOKUP (ZERO CROSS-SUBJECT FALLBACK)
// ═════════════════════════════════════════════════════════════════════
function findKnownSLO(courseCode, sessionNum, sloNum, stateOrTopic) {
  if (!courseCode) return null;
  const rawCode = String(courseCode).toUpperCase().trim();

  let canonicalCode = null;
  for (const k of Object.keys(SRM_WORKSHEETS_DB)) {
    if (rawCode.includes(k) || k.includes(rawCode)) {
      canonicalCode = k;
      break;
    }
  }

  if (!canonicalCode) return null;

  const course = SRM_WORKSHEETS_DB[canonicalCode];
  if (!course) return null;

  const numMatch = String(sessionNum || '1').match(/\d+/);
  const rawNum = numMatch ? parseInt(numMatch[0], 10) : 1;
  const sloKey = Number(sloNum || 1);

  // Check state or topic context
  let topicStr = '';
  let unitNum = null;
  if (typeof stateOrTopic === 'string') {
    topicStr = stateOrTopic.toLowerCase();
  } else if (stateOrTopic && typeof stateOrTopic === 'object') {
    if (stateOrTopic.currentSession?.uIdx != null) {
      unitNum = stateOrTopic.currentSession.uIdx + 1;
    }
    const sessName = stateOrTopic.currentSession?.sess?.name || '';
    topicStr = (sessName + ' ' + (stateOrTopic.currentSessionTopic || '')).toLowerCase();
  }

  // 1. Direct key match (e.g. 10, 204, 301, 101, etc.)
  if (course[rawNum]?.[sloKey]) return course[rawNum][sloKey];
  if (course[String(rawNum)]?.[sloKey]) return course[String(rawNum)][sloKey];

  // 2. Keyword-based matching
  if (canonicalCode === '21LEM202T') {
    if (topicStr.includes('family') || topicStr.includes('lecture 13') || (unitNum === 3 && (rawNum === 1 || rawNum === 13))) {
      if (course[301]?.[sloKey]) return course[301][sloKey];
    }
    if (topicStr.includes('harmony in the self') || topicStr.includes('lecture 10') || (unitNum === 2 && (rawNum === 4 || rawNum === 204))) {
      if (course[204]?.[sloKey]) return course[204][sloKey];
    }
    if (topicStr.includes('holistic') || topicStr.includes('lecture 1') || (unitNum === 1 && (rawNum === 1 || rawNum === 101))) {
      if (course[101]?.[sloKey]) return course[101][sloKey];
    }
  } else if (canonicalCode === '21CSC203P') {
    if (topicStr.includes('jdbc') || topicStr.includes('declarative') || rawNum === 10 || rawNum === 210) {
      if (course[10]?.[sloKey]) return course[10][sloKey];
    }
    if (topicStr.includes('syntax') || topicStr.includes('token') || rawNum === 1 || rawNum === 101) {
      if (course[101]?.[sloKey]) return course[101][sloKey];
    }
  } else if (canonicalCode === '21CSC202J') {
    if (rawNum === 1 || rawNum === 101) {
      if (course[101]?.[sloKey]) return course[101][sloKey];
    }
  } else if (canonicalCode === '21CSC201J') {
    if (rawNum === 1 || rawNum === 101) {
      if (course[101]?.[sloKey]) return course[101][sloKey];
    }
  }

  // 3. Unit-aware numbering
  if (unitNum === 3 && course[300 + rawNum]?.[sloKey]) return course[300 + rawNum][sloKey];
  if (unitNum === 2 && course[200 + rawNum]?.[sloKey]) return course[200 + rawNum][sloKey];
  if (unitNum === 1 && course[100 + rawNum]?.[sloKey]) return course[100 + rawNum][sloKey];

  if (rawNum > 100 && course[rawNum]?.[sloKey]) return course[rawNum][sloKey];
  if (rawNum > 100 && course[rawNum % 100]?.[sloKey]) return course[rawNum % 100][sloKey];

  for (const k of Object.keys(course)) {
    const kNum = parseInt(k, 10);
    if ((kNum === rawNum || (kNum % 100) === (rawNum % 100) || k.endsWith(String(rawNum))) && course[k]?.[sloKey]) {
      return course[k][sloKey];
    }
  }

  return null;
}

// ═════════════════════════════════════════════════════════════════════
// EXTRACT SESSION WORKSHEET DATA (PRESERVING FULL OFFICIAL SECTIONS)
// ═════════════════════════════════════════════════════════════════════
function getSessionWorksheetData(sessionNum, sloNum, currentSessionData, state) {
  const courseCode = (
    currentSessionData?.courseCode ||
    state?.currentSubject?.code ||
    state?.courseCode ||
    '21LEM202T'
  ).toUpperCase().trim();

  const courseName = (
    currentSessionData?.courseName ||
    state?.currentSubject?.name ||
    SRM_COURSE_NAMES[courseCode] ||
    'COURSE'
  ).toUpperCase().trim();

  const studentName = state?.studentName || 'VADDI JEEVAN VENKATA RANGA SAI';
  const regNum = state?.regNum || 'RA2511026011232';
  const branch = state?.department || 'CSE (AI/ML)';
  const dateStr = new Date().toLocaleDateString('en-GB');

  const deptUpper = (state?.department || 'Department of Computational Intelligence').toUpperCase();
  const deptStr = deptUpper.includes('DEPARTMENT') ? deptUpper : `DEPARTMENT OF ${deptUpper}`;

  const numMatch = String(sessionNum || '1').match(/\d+/);
  const rawNum = numMatch ? parseInt(numMatch[0], 10) : 1;
  const displaySessNum = (rawNum > 100) ? (rawNum % 100) : rawNum;

  // Session Topic Resolution
  let sessionTopic = '';
  if (currentSessionData?.sessStatus?.SESSION_NAME && !currentSessionData.sessStatus.SESSION_NAME.startsWith('Session')) {
    sessionTopic = currentSessionData.sessStatus.SESSION_NAME;
  } else if (state?.currentSession?.sess?.name && !state.currentSession.sess.name.match(/^Session\s*\d+$/i)) {
    sessionTopic = state.currentSession.sess.name;
  } else if (currentSessionData?.qData?.sp?.title) {
    sessionTopic = currentSessionData.qData.sp.title;
  }

  // SLO Title Resolution
  let sloTitle = '';
  const qSlo = currentSessionData?.qData?.slo;
  if (sloNum === 1) {
    if (qSlo?.SLO1) sloTitle = qSlo.SLO1;
    else if (qSlo?.SRO1) sloTitle = qSlo.SRO1;
  } else {
    if (qSlo?.SLO2) sloTitle = qSlo.SLO2;
    else if (qSlo?.SRO2) sloTitle = qSlo.SRO2;
  }

  const knownSLO = findKnownSLO(courseCode, sessionNum, sloNum, state || sessionTopic);
  if (!sessionTopic && knownSLO?.topic) sessionTopic = knownSLO.topic;
  if (!sloTitle && knownSLO?.slo) sloTitle = knownSLO.slo;

  const headerTitle = knownSLO?.headerTitle || 'SRM INSTITUTE OF SCIENCE AND TECHNOLOGY · SCHOOL OF COMPUTING';
  const subTopic = knownSLO?.subTopic || `Session ${displaySessNum}: ${sessionTopic}`;
  const displayTopic = sessionTopic.includes('Session') ? sessionTopic : `Session ${displaySessNum}: ${sessionTopic}`;
  const displaySlo = sloTitle.includes('SLO') ? sloTitle : `SLO ${sloNum}: ${sloTitle}`;

  const learningOutcomes = knownSLO?.learningOutcomes || [];
  const howToEngage = knownSLO?.howToEngage || [];
  const partARecap = knownSLO?.partARecap || [];
  const partBActivities = knownSLO?.partBActivities || [];
  const selfReflection = knownSLO?.selfReflection || [];

  // Part C Questions List (Exact SRM Coordinator questions prioritized)
  let questionsList = [];
  if (knownSLO?.partCQuestions?.length > 0) {
    questionsList = knownSLO.partCQuestions;
  } else {
    const qData = currentSessionData?.qData;
    if (qData) {
      const rawSq = Array.isArray(qData.sq) ? qData.sq : [];
      const rawLq = Array.isArray(qData.lq) ? qData.lq : [];
      let liveItems = (sloNum === 1) ? [...rawSq, ...rawLq] : [...rawLq, ...rawSq];
      questionsList = liveItems
        .map(item => ({
          q: cleanHtmlForPdf(item.QUESTION_DESC),
          a: cleanHtmlForPdf(item.ANSWER) || (typeof generateAnswerForSubject === 'function' ? generateAnswerForSubject(item.QUESTION_DESC, courseCode, sessionTopic, sloTitle) : '')
        }))
        .filter(x => x.q && x.q.length > 3);
    }
  }

  return {
    courseCode,
    courseName,
    deptStr,
    studentName,
    regNum,
    branch,
    dateStr,
    headerTitle,
    subTopic,
    displayTopic,
    displaySlo,
    learningOutcomes,
    howToEngage,
    partARecap,
    partBActivities,
    questionsList,
    selfReflection
  };
}

// ═════════════════════════════════════════════════════════════════════
// 1. SOLVED ANSWER PDF BUILDER (FULL WORKSHEET WITH ALL SECTIONS)
// ═════════════════════════════════════════════════════════════════════
async function buildSessionAnswerPDF(sessionNum, sloNum, currentSessionData, state) {
  if (typeof window.jspdf === 'undefined') return '';
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const W = 210;
  const M = 16;
  const contentW = W - (M * 2);
  let y = 14;

  const data = getSessionWorksheetData(sessionNum, sloNum, currentSessionData, state);

  // Document Title Header
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('SRM INSTITUTE OF SCIENCE AND TECHNOLOGY', W / 2, y, { align: 'center' });
  y += 5;

  doc.setFontSize(9);
  doc.text('FACULTY OF ENGINEERING AND TECHNOLOGY · SCHOOL OF COMPUTING', W / 2, y, { align: 'center' });
  y += 4.5;

  doc.text(data.deptStr, W / 2, y, { align: 'center' });
  y += 4.5;

  doc.text(`${data.courseCode} ${data.courseName}`, W / 2, y, { align: 'center' });
  y += 6.5;

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  const topicLines = doc.splitTextToSize(data.subTopic || data.displayTopic, contentW);
  doc.text(topicLines, M, y);
  y += (topicLines.length * 4.8) + 1;

  const sloLines = doc.splitTextToSize(data.displaySlo, contentW);
  doc.text(sloLines, M, y);
  y += (sloLines.length * 4.8) + 2.5;

  // Student header table
  y = drawStudentHeaderTable(doc, M, y, contentW, data.studentName, data.regNum, data.branch, data.dateStr);

  // 1. Session Learning Outcomes
  if (data.learningOutcomes?.length > 0) {
    if (y > 240) { doc.addPage(); y = 16; }
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('Session Learning Outcomes', M, y);
    y += 4.5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.2);
    doc.setTextColor(51, 65, 85);
    data.learningOutcomes.forEach(lo => {
      const loLines = doc.splitTextToSize(`•  ${cleanHtmlForPdf(lo)}`, contentW - 4);
      doc.text(loLines, M + 2, y);
      y += (loLines.length * 4.2) + 1;
    });
    y += 3;
  }

  // How to Engage with this Worksheet
  if (data.howToEngage?.length > 0) {
    if (y > 235) { doc.addPage(); y = 16; }
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('How to Engage with this Worksheet', M, y);
    y += 4.5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.2);
    doc.setTextColor(71, 85, 105);
    data.howToEngage.forEach(he => {
      const heLines = doc.splitTextToSize(`•  ${cleanHtmlForPdf(he)}`, contentW - 4);
      doc.text(heLines, M + 2, y);
      y += (heLines.length * 4.2) + 1;
    });
    y += 3;
  }

  // 2. Part A - Key Ideas Recap
  if (data.partARecap?.length > 0) {
    if (y > 235) { doc.addPage(); y = 16; }
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('Part A — Key Ideas (Recap)', M, y);
    y += 4.5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.2);
    doc.setTextColor(51, 65, 85);
    data.partARecap.forEach(recap => {
      const rLines = doc.splitTextToSize(`•  ${cleanHtmlForPdf(recap)}`, contentW - 4);
      doc.text(rLines, M + 2, y);
      y += (rLines.length * 4.2) + 1.5;
    });
    y += 3;
  }

  // 3. Part B - In-Class Activities (Completed)
  if (data.partBActivities?.length > 0) {
    data.partBActivities.forEach(act => {
      if (y > 230) { doc.addPage(); y = 16; }
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`Part B — ${act.title}`, M, y);
      y += 4.5;
      if (act.desc) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8);
        doc.setTextColor(71, 85, 105);
        doc.text(act.desc, M + 2, y);
        y += 4.2;
      }
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.2);
      (act.items || []).forEach(it => {
        if (y > 265) { doc.addPage(); y = 16; }
        const itemLine = `${it.item} ➔ ${it.answer}`;
        const iLines = doc.splitTextToSize(`✓  ${itemLine}`, contentW - 6);
        doc.setTextColor(30, 41, 59);
        doc.text(iLines, M + 3, y);
        y += (iLines.length * 4.2) + 1;
      });
      y += 3.5;
    });
  }

  // 4. Part C - Long Answer Questions & Solved Answers
  if (data.questionsList?.length > 0) {
    if (y > 230) { doc.addPage(); y = 16; }
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('Part C — Questions & Comprehensive Answers', M, y);
    doc.setDrawColor(203, 213, 225);
    doc.line(M, y + 1.5, M + contentW, y + 1.5);
    y += 6;

    data.questionsList.forEach((item, idx) => {
      if (y > 240) { doc.addPage(); y = 16; }

      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      const qLines = doc.splitTextToSize(`${item.q.startsWith('Q') || item.q.startsWith('Question') ? item.q : `Question ${idx + 1}: ${item.q}`}`, contentW - 4);
      doc.text(qLines, M + 2, y);
      y += (qLines.length * 4.6) + 2.5;

      doc.setFontSize(8.4);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(67, 56, 202);
      doc.text('Answer:', M + 2, y);
      y += 4.5;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 41, 59);
      const cleanA = cleanHtmlForPdf(item.a);
      const aLines = doc.splitTextToSize(cleanA, contentW - 6);

      for (let i = 0; i < aLines.length; i++) {
        if (y > 275) { doc.addPage(); y = 16; }
        doc.text(aLines[i], M + 4, y);
        y += 4.2;
      }
      y += 5.5;
    });
  }

  // 5. Self-Reflection
  if (data.selfReflection?.length > 0) {
    if (y > 235) { doc.addPage(); y = 16; }
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('Self-Reflection (Take-Home)', M, y);
    y += 4.5;
    data.selfReflection.forEach(sr => {
      if (y > 260) { doc.addPage(); y = 16; }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.2);
      doc.setTextColor(51, 65, 85);
      const qLines = doc.splitTextToSize(`Q: ${sr.q}`, contentW - 4);
      doc.text(qLines, M + 2, y);
      y += (qLines.length * 4.2) + 1.5;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 41, 59);
      const aLines = doc.splitTextToSize(`A: ${sr.a}`, contentW - 6);
      doc.text(aLines, M + 4, y);
      y += (aLines.length * 4.2) + 3;
    });
  }

  const pdfUri = doc.output('datauristring');
  if (currentSessionData) {
    if (sloNum === 1) currentSessionData.slo1PdfUri = pdfUri;
    else currentSessionData.slo2PdfUri = pdfUri;
  }

  return pdfUri;
}

// ═════════════════════════════════════════════════════════════════════
// 2. SOLVED ANSWER DOCX BUILDER (PRESERVING FULL SRM WORKSHEET FORMAT)
// ═════════════════════════════════════════════════════════════════════
function buildSessionAnswerDOCX(sessionNum, sloNum, currentSessionData, state) {
  const data = getSessionWorksheetData(sessionNum, sloNum, currentSessionData, state);
  const fileName = `${data.regNum}_${data.courseCode}_Sess${sessionNum}_SLO${sloNum}_Answers.doc`;

  // Learning Outcomes HTML
  let loHtml = '';
  if (data.learningOutcomes?.length > 0) {
    loHtml = `
      <div style="margin-top:14px;background:#f8fafc;padding:12px 16px;border-left:4px solid #0284c7;margin-bottom:16px">
        <h4 style="margin:0 0 8px 0;color:#0369a1;font-size:11pt">Session Learning Outcomes</h4>
        <ul style="margin:0;padding-left:20px;color:#334155;font-size:10pt">
          ${data.learningOutcomes.map(lo => `<li>${lo}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  // How to Engage HTML
  let engageHtml = '';
  if (data.howToEngage?.length > 0) {
    engageHtml = `
      <div style="margin-bottom:16px;padding:10px 14px;background:#f1f5f9;border-radius:6px;font-size:9.5pt;color:#475569">
        <strong>How to Engage with this Worksheet:</strong>
        <ul style="margin:6px 0 0 0;padding-left:18px">
          ${data.howToEngage.map(he => `<li>${he}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  // Part A Recap HTML
  let recapHtml = '';
  if (data.partARecap?.length > 0) {
    recapHtml = `
      <div style="margin-bottom:18px">
        <h4 style="border-bottom:1px solid #cbd5e1;padding-bottom:4px;color:#1e293b;font-size:11pt">Part A — Key Ideas (Recap)</h4>
        <ul style="margin:6px 0 0 0;padding-left:20px;color:#334155;font-size:10pt;line-height:1.5">
          ${data.partARecap.map(r => `<li>${r}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  // Part B Activities HTML
  let actHtml = '';
  if (data.partBActivities?.length > 0) {
    actHtml = `
      <div style="margin-bottom:20px">
        <h4 style="border-bottom:1px solid #cbd5e1;padding-bottom:4px;color:#1e293b;font-size:11pt">Part B — In-Class Activities (Completed)</h4>
        ${data.partBActivities.map(act => `
          <div style="margin-top:10px;margin-bottom:14px">
            <strong style="color:#0f172a;font-size:10pt">${act.title}</strong>
            <p style="margin:2px 0 6px 0;font-size:9pt;color:#64748b"><em>${act.desc}</em></p>
            <table style="width:100%;border-collapse:collapse;margin-top:6px;font-size:9.5pt">
              ${(act.items || []).map(it => `
                <tr>
                  <td style="border:1px solid #cbd5e1;padding:6px 10px;width:55%">${it.item}</td>
                  <td style="border:1px solid #cbd5e1;padding:6px 10px;width:45%;background:#ecfdf5;color:#047857;font-weight:bold">✓ ${it.answer}</td>
                </tr>
              `).join('')}
            </table>
          </div>
        `).join('')}
      </div>
    `;
  }

  // Part C Questions & Answers HTML
  let qaHtml = '';
  if (data.questionsList?.length > 0) {
    qaHtml = `
      <div style="margin-top:18px">
        <h4 style="border-bottom:2px solid #4338ca;padding-bottom:4px;color:#3730a3;font-size:11pt">Part C — Questions &amp; Detailed Solved Answers</h4>
        ${data.questionsList.map((item, idx) => {
          const qClean = (item.q || '').replace(/\n/g, '<br/>');
          const aClean = (item.a || '').replace(/\n/g, '<br/>');
          return `
            <div style="margin-top:16px;margin-bottom:16px">
              <p style="font-weight:bold;color:#0f172a;margin-bottom:6px;font-size:10.5pt">
                ${item.q.startsWith('Q') || item.q.startsWith('Question') ? qClean : `Question ${idx + 1}: ${qClean}`}
              </p>
              <p style="font-weight:bold;color:#4338ca;margin-bottom:4px;font-size:9.5pt">
                Answer:
              </p>
              <div style="color:#1e293b;line-height:1.6;margin-left:8px;background:#f8fafc;padding:12px 16px;border-left:3px solid #4338ca;font-size:10pt">
                ${aClean}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // Self-Reflection HTML
  let refHtml = '';
  if (data.selfReflection?.length > 0) {
    refHtml = `
      <div style="margin-top:20px;padding:12px 16px;background:#faf5ff;border-left:4px solid #9333ea;margin-bottom:20px">
        <h4 style="margin:0 0 8px 0;color:#7e22ce;font-size:10.5pt">Self-Reflection (Take-Home)</h4>
        ${data.selfReflection.map(sr => `
          <p style="margin:4px 0;font-weight:bold;font-size:9.5pt;color:#3b0764">Q: ${sr.q}</p>
          <p style="margin:2px 0 10px 0;font-size:9.5pt;color:#1e293b">A: ${sr.a}</p>
        `).join('')}
      </div>
    `;
  }

  const docHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${data.courseCode} Session ${sessionNum} Solved Answers</title>
      <style>
        body { font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; font-size: 11pt; color: #1e293b; line-height: 1.5; margin: 25mm 20mm; }
        .hdr { text-align: center; margin-bottom: 12px; }
        .hdr h2 { font-size: 13pt; margin: 3px 0; color: #0f172a; }
        .hdr h3 { font-size: 11pt; margin: 2px 0; color: #334155; }
        .table-meta { width: 100%; border-collapse: collapse; margin: 14px 0 16px 0; }
        .table-meta td { border: 1px solid #cbd5e1; padding: 6px 12px; font-size: 10pt; }
        .table-meta td strong { color: #334155; }
      </style>
    </head>
    <body>
      <div class="hdr">
        <h2>SRM INSTITUTE OF SCIENCE AND TECHNOLOGY</h2>
        <h3>FACULTY OF ENGINEERING AND TECHNOLOGY — SCHOOL OF COMPUTING</h3>
        <h3>${data.deptStr}</h3>
        <h3>${data.courseCode} ${data.courseName}</h3>
        <h3 style="margin-top:8px;color:#1e293b">${data.subTopic || data.displayTopic}</h3>
        <h4 style="margin:4px 0;color:#475569">${data.displaySlo}</h4>
      </div>

      <table class="table-meta">
        <tr>
          <td style="width:50%"><strong>Name:</strong> ${data.studentName}</td>
          <td style="width:50%"><strong>Reg. No:</strong> ${data.regNum}</td>
        </tr>
        <tr>
          <td><strong>Branch:</strong> ${data.branch}</td>
          <td><strong>Date:</strong> ${data.dateStr}</td>
        </tr>
      </table>

      ${loHtml}
      ${engageHtml}
      ${recapHtml}
      ${actHtml}
      ${qaHtml}
      ${refHtml}
    </body>
    </html>
  `;

  return { html: docHtml, fileName };
}

// ═════════════════════════════════════════════════════════════════════
// 3. OFFICIAL BLANK QUESTION PAPER BUILDER (WITH EMPTY WORKSPACES)
// ═════════════════════════════════════════════════════════════════════
async function buildQuestionPaperPDF(sessionNum, sloNum, currentSessionData, state) {
  if (typeof window.jspdf === 'undefined') return '';
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const W = 210;
  const M = 16;
  const contentW = W - (M * 2);
  let y = 14;

  const data = getSessionWorksheetData(sessionNum, sloNum, currentSessionData, state);

  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('SRM INSTITUTE OF SCIENCE AND TECHNOLOGY', W / 2, y, { align: 'center' });
  y += 5;

  doc.setFontSize(9);
  doc.text('FACULTY OF ENGINEERING AND TECHNOLOGY · SCHOOL OF COMPUTING', W / 2, y, { align: 'center' });
  y += 4.5;

  doc.text(data.deptStr, W / 2, y, { align: 'center' });
  y += 4.5;

  doc.text(`${data.courseCode} ${data.courseName}`, W / 2, y, { align: 'center' });
  y += 6.5;

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  const topicLines = doc.splitTextToSize(data.subTopic || data.displayTopic, contentW);
  doc.text(topicLines, M, y);
  y += (topicLines.length * 4.8) + 1;

  const sloLines = doc.splitTextToSize(data.displaySlo, contentW);
  doc.text(sloLines, M, y);
  y += (sloLines.length * 4.8) + 2.5;

  y = drawStudentHeaderTable(doc, M, y, contentW, data.studentName, data.regNum, data.branch, data.dateStr);

  // 1. Session Learning Outcomes
  if (data.learningOutcomes?.length > 0) {
    if (y > 240) { doc.addPage(); y = 16; }
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('Session Learning Outcomes', M, y);
    y += 4.5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.2);
    doc.setTextColor(51, 65, 85);
    data.learningOutcomes.forEach(lo => {
      const loLines = doc.splitTextToSize(`•  ${cleanHtmlForPdf(lo)}`, contentW - 4);
      doc.text(loLines, M + 2, y);
      y += (loLines.length * 4.2) + 1;
    });
    y += 3;
  }

  // 2. How to Engage with this Worksheet
  if (data.howToEngage?.length > 0) {
    if (y > 235) { doc.addPage(); y = 16; }
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('How to Engage with this Worksheet', M, y);
    y += 4.5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.2);
    doc.setTextColor(71, 85, 105);
    data.howToEngage.forEach(he => {
      const heLines = doc.splitTextToSize(`•  ${cleanHtmlForPdf(he)}`, contentW - 4);
      doc.text(heLines, M + 2, y);
      y += (heLines.length * 4.2) + 1;
    });
    y += 3;
  }

  // 3. Part A - Key Ideas (Recap)
  if (data.partARecap?.length > 0) {
    if (y > 235) { doc.addPage(); y = 16; }
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('Part A — Key Ideas (Recap)', M, y);
    y += 4.5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.2);
    doc.setTextColor(51, 65, 85);
    data.partARecap.forEach(recap => {
      const rLines = doc.splitTextToSize(`•  ${cleanHtmlForPdf(recap)}`, contentW - 4);
      doc.text(rLines, M + 2, y);
      y += (rLines.length * 4.2) + 1.5;
    });
    y += 3;
  }

  // 4. Part B - In-Class Activities (Blank Form)
  if (data.partBActivities?.length > 0) {
    data.partBActivities.forEach(act => {
      if (y > 230) { doc.addPage(); y = 16; }
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`Part B — ${act.title}`, M, y);
      y += 4.5;
      if (act.desc) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8);
        doc.setTextColor(71, 85, 105);
        doc.text(act.desc, M + 2, y);
        y += 4.2;
      }
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.2);
      (act.items || []).forEach(it => {
        if (y > 265) { doc.addPage(); y = 16; }
        doc.setTextColor(30, 41, 59);
        const promptLines = doc.splitTextToSize(`[   ]  ${it.item} : ____________________`, contentW - 6);
        doc.text(promptLines, M + 3, y);
        y += (promptLines.length * 4.2) + 1;
      });
      y += 3.5;
    });
  }

  // 5. Part C - Questions with blank answer spaces
  if (data.questionsList?.length > 0) {
    if (y > 230) { doc.addPage(); y = 16; }
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('Part C — Student Activity Worksheet (Questions)', M, y);
    doc.setDrawColor(203, 213, 225);
    doc.line(M, y + 1.5, M + contentW, y + 1.5);
    y += 6;

    data.questionsList.forEach((item, idx) => {
      if (y > 220) { doc.addPage(); y = 16; }

      doc.setFontSize(9.2);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      const qLines = doc.splitTextToSize(`${item.q.startsWith('Q') || item.q.startsWith('Question') ? item.q : `Question ${idx + 1}: ${cleanHtmlForPdf(item.q)}`}`, contentW - 4);
      doc.text(qLines, M + 2, y);
      y += (qLines.length * 4.8) + 3.5;

      const boxH = Math.min(45, Math.max(28, 268 - y));
      doc.setDrawColor(203, 213, 225);
      doc.setFillColor(248, 250, 252);
      doc.rect(M, y, contentW, boxH, 'FD');

      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(148, 163, 184);
      doc.text('[ Student Answer / Working Space ]', M + 4, y + 6);

      y += boxH + 6;
    });
  }

  // 6. Self-Reflection (Blank)
  if (data.selfReflection?.length > 0) {
    if (y > 235) { doc.addPage(); y = 16; }
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('Self-Reflection (Take-Home)', M, y);
    y += 4.5;
    data.selfReflection.forEach(sr => {
      if (y > 260) { doc.addPage(); y = 16; }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.2);
      doc.setTextColor(51, 65, 85);
      const qLines = doc.splitTextToSize(`Q: ${sr.q}`, contentW - 4);
      doc.text(qLines, M + 2, y);
      y += (qLines.length * 4.2) + 2;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(148, 163, 184);
      doc.text('Response: ____________________________________________________________________________________', M + 2, y);
      y += 6;
    });
  }

  const pdfUri = doc.output('datauristring');
  if (currentSessionData) {
    if (sloNum === 1) currentSessionData.slo1QuestionPdfUri = pdfUri;
    else currentSessionData.slo2QuestionPdfUri = pdfUri;
  }

  return pdfUri;
}

function buildQuestionPaperDOCX(sessionNum, sloNum, currentSessionData, state) {
  const data = getSessionWorksheetData(sessionNum, sloNum, currentSessionData, state);
  const fileName = `${data.regNum}_${data.courseCode}_Sess${sessionNum}_SLO${sloNum}_QuestionPaper.doc`;

  // Learning Outcomes HTML
  let loHtml = '';
  if (data.learningOutcomes?.length > 0) {
    loHtml = `
      <div style="margin-top:14px;background:#f8fafc;padding:12px 16px;border-left:4px solid #0284c7;margin-bottom:16px">
        <h4 style="margin:0 0 8px 0;color:#0369a1;font-size:11pt">Session Learning Outcomes</h4>
        <ul style="margin:0;padding-left:20px;color:#334155;font-size:10pt">
          ${data.learningOutcomes.map(lo => `<li>${lo}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  // How to Engage HTML
  let engageHtml = '';
  if (data.howToEngage?.length > 0) {
    engageHtml = `
      <div style="margin-bottom:16px;padding:10px 14px;background:#f1f5f9;border-radius:6px;font-size:9.5pt;color:#475569">
        <strong>How to Engage with this Worksheet:</strong>
        <ul style="margin:6px 0 0 0;padding-left:18px">
          ${data.howToEngage.map(he => `<li>${he}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  // Part A Recap HTML
  let recapHtml = '';
  if (data.partARecap?.length > 0) {
    recapHtml = `
      <div style="margin-bottom:18px">
        <h4 style="border-bottom:1px solid #cbd5e1;padding-bottom:4px;color:#1e293b;font-size:11pt">Part A — Key Ideas (Recap)</h4>
        <ul style="margin:6px 0 0 0;padding-left:20px;color:#334155;font-size:10pt;line-height:1.5">
          ${data.partARecap.map(r => `<li>${r}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  // Part B Activities (Blank Work Areas)
  let actHtml = '';
  if (data.partBActivities?.length > 0) {
    actHtml = `
      <div style="margin-bottom:20px">
        <h4 style="border-bottom:1px solid #cbd5e1;padding-bottom:4px;color:#1e293b;font-size:11pt">Part B — In-Class Activities (Worksheet)</h4>
        ${data.partBActivities.map(act => `
          <div style="margin-top:10px;margin-bottom:14px">
            <strong style="color:#0f172a;font-size:10pt">${act.title}</strong>
            <p style="margin:2px 0 6px 0;font-size:9pt;color:#64748b"><em>${act.desc}</em></p>
            <table style="width:100%;border-collapse:collapse;margin-top:6px;font-size:9.5pt">
              ${(act.items || []).map(it => `
                <tr>
                  <td style="border:1px solid #cbd5e1;padding:8px 10px;width:60%">${it.item}</td>
                  <td style="border:1px solid #cbd5e1;padding:8px 10px;width:40%;background:#f8fafc;color:#94a3b8">[ Student Answer Space ]</td>
                </tr>
              `).join('')}
            </table>
          </div>
        `).join('')}
      </div>
    `;
  }

  // Part C Questions (Blank Work Area)
  let qaHtml = '';
  if (data.questionsList?.length > 0) {
    qaHtml = `
      <div style="margin-top:18px">
        <h4 style="border-bottom:2px solid #0284c7;padding-bottom:4px;color:#0369a1;font-size:11pt">Part C — Questions</h4>
        ${data.questionsList.map((item, idx) => {
          const qClean = (item.q || '').replace(/\n/g, '<br/>');
          return `
            <div style="margin-top:18px;margin-bottom:22px">
              <p style="font-weight:bold;color:#0f172a;margin-bottom:8px;font-size:10.5pt">
                ${item.q.startsWith('Q') || item.q.startsWith('Question') ? qClean : `Question ${idx + 1}: ${qClean}`}
              </p>
              <div style="border:1px dashed #cbd5e1;background:#f8fafc;height:120px;padding:12px;color:#94a3b8;font-size:9.5pt">
                [ Student Answer Space / Work Area ]
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // Self-Reflection (Blank)
  let refHtml = '';
  if (data.selfReflection?.length > 0) {
    refHtml = `
      <div style="margin-top:20px;padding:12px 16px;background:#faf5ff;border-left:4px solid #9333ea;margin-bottom:20px">
        <h4 style="margin:0 0 8px 0;color:#7e22ce;font-size:10.5pt">Self-Reflection (Take-Home)</h4>
        ${data.selfReflection.map(sr => `
          <p style="margin:4px 0;font-weight:bold;font-size:9.5pt;color:#3b0764">Q: ${sr.q}</p>
          <div style="border-bottom:1px dashed #c084fc;height:40px;margin-bottom:12px"></div>
        `).join('')}
      </div>
    `;
  }

  const docHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${data.courseCode} Session ${sessionNum} Question Paper</title>
      <style>
        body { font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; font-size: 11pt; color: #1e293b; line-height: 1.5; margin: 25mm 20mm; }
        .hdr { text-align: center; margin-bottom: 12px; }
        .hdr h2 { font-size: 13pt; margin: 3px 0; color: #0f172a; }
        .hdr h3 { font-size: 11pt; margin: 2px 0; color: #334155; }
        .table-meta { width: 100%; border-collapse: collapse; margin: 14px 0 20px 0; }
        .table-meta td { border: 1px solid #cbd5e1; padding: 6px 12px; font-size: 10pt; }
        .table-meta td strong { color: #334155; }
      </style>
    </head>
    <body>
      <div class="hdr">
        <h2>SRM INSTITUTE OF SCIENCE AND TECHNOLOGY</h2>
        <h3>FACULTY OF ENGINEERING AND TECHNOLOGY — SCHOOL OF COMPUTING</h3>
        <h3>${data.deptStr}</h3>
        <h3>${data.courseCode} ${data.courseName}</h3>
        <h3 style="margin-top:8px;color:#1e293b">${data.subTopic || data.displayTopic}</h3>
        <h4 style="margin:4px 0;color:#475569">${data.displaySlo}</h4>
      </div>

      <table class="table-meta">
        <tr>
          <td style="width:50%"><strong>Name:</strong> ${data.studentName}</td>
          <td style="width:50%"><strong>Reg. No:</strong> ${data.regNum}</td>
        </tr>
        <tr>
          <td><strong>Branch:</strong> ${data.branch}</td>
          <td><strong>Date:</strong> ${data.dateStr}</td>
        </tr>
      </table>

      ${loHtml}
      ${engageHtml}
      ${recapHtml}
      ${actHtml}
      ${qaHtml}
      ${refHtml}
    </body>
    </html>
  `;

  return { html: docHtml, fileName };
}
