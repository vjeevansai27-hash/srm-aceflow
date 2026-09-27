// ═════════════════════════════════════════════════════════════════════
// SRM E-CURRICULA OFFICIAL WORKSHEET REPOSITORY & VERIFIED SOLVER
// Dynamic Subject-Aware Solver: Strict 1-to-1 Course, Session & Slot Mapping
// ZERO Cross-Subject Contamination: UHV, OS, DSA, OOD, and APP strictly isolated.
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
    // Map non-ASCII quotes, dashes, and bullets to standard ASCII
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
// SRM VERIFIED WORKSHEET DATABASE (ORGANIZED STRICTLY BY COURSE CODE)
// ═════════════════════════════════════════════════════════════════════
const SRM_WORKSHEETS_DB = {
  // ─────────────────────────────────────────────────────────────────
  // 21LEM202T: UNIVERSAL HUMAN VALUES
  // ─────────────────────────────────────────────────────────────────
  '21LEM202T': {
    101: {
      1: {
        topic: 'Introduction to Value Education and Self Exploration',
        slo: 'SLO 1: Need, Basic Guidelines, and Content of Value Education',
        qa: [
          {
            q: 'Explain the need for Value Education in engineering and contemporary professional life.',
            a: 'Value education provides the fundamental basis for all technological and professional endeavors. While technical education equips students with the "how-to" (skills, competence, and tools), value education clarifies the "what-to-do" (purpose, direction, and human values). In the absence of value education, technological proficiency risks being misdirected towards resource exploitation, ecological degradation, and societal conflict. Value education enables an individual to realize right understanding, live in mutual happiness with other human beings, and achieve mutual prosperity with rest of nature.'
          },
          {
            q: 'Describe the process of Self-Exploration and its two fundamental components: Natural Acceptance and Experiential Validation.',
            a: 'Self-exploration is an observational process of observing inside oneself, verifying proposals on the basis of Natural Acceptance, and experientially validating them through living.\n1. Proposal Verification: Every principle in UHV is presented as a proposal to be investigated, not believed blindly.\n2. Natural Acceptance: The innate, unconditional human faculty that recognizes what is naturally right, invariant with time, place, or peer conditioning.\n3. Experiential Validation: Validating proposals in behavior with human beings (leading to mutual happiness) and in work with material nature (leading to mutual prosperity).'
          }
        ]
      },
      2: {
        topic: 'Continuous Happiness and Prosperity as Basic Human Aspirations',
        slo: 'SLO 2: Human Aspirations and Right Priority',
        qa: [
          {
            q: 'Differentiate between Happiness (Sukh) and Physical Facilities (Suvidha). What is their correct priority?',
            a: 'Human aspirations consist of two distinct dimensions:\n1. Happiness (Sukh): A state of harmony, peace, and synergy within the Self. The need for Sukh is continuous and qualitative (e.g., respect, trust, affection, peace of mind).\n2. Physical Facilities (Suvidha): Material requirements for nurturing, protection, and right utilization of the body. The need for Suvidha is quantitative and limited in time (e.g., food, clothing, shelter).\n\nCorrect Priority Order:\n1st: Right Understanding in the Self (knowing harmony at all levels)\n2nd: Relationship with human beings (mutual happiness)\n3rd: Physical Facilities with nature (mutual prosperity).\nReversing this priority leads to greed, deprivation, and social friction.'
          }
        ]
      }
    },
    108: {
      1: {
        topic: 'Natural Acceptance vs Liking & Observation of Feelings',
        slo: 'SLO 1: Differentiating Natural Acceptance from Conditioned Appeal',
        qa: [
          {
            q: 'Distinguish between Natural Acceptance and Liking (Appeal).',
            a: 'Natural acceptance is what I accept innately; it is innate, invariant with time and place (universal), uncorrupted by pre-conditioning, and definite. Liking or appeal, by contrast, can vary from person to person and concerns the details of how a relationship is fulfilled. For example, whether a person likes to wake up early or late varies, but both naturally accept to be healthy; whether one likes playing with toys or travelling varies, but both naturally accept to be happy. Natural acceptance is about my relationship to the reality of concern and my purpose or role (e.g. natural acceptance for nurturing the body), which is definite; the details of how to fulfil it may have variety.'
          },
          {
            q: 'Explain the Namaste example in the context of checking feelings vs outer expressions.',
            a: 'The same expression — folding hands in Namaste — can carry a feeling of relationship and respect, which is naturally acceptable, leads to harmony and brings happiness within; or it can carry a feeling of opposition and disrespect, which is not naturally acceptable and brings disharmony and unhappiness within. The expression itself has creativity and variation and cannot be checked by natural acceptance; only the underlying feeling can be checked — and the feeling is definite if based on natural acceptance, indefinite if based on assumption. So we check the feeling, not the outer expression.'
          },
          {
            q: 'Differentiate between Natural Acceptance, Acceptance, and Forced Acceptance.',
            a: 'Natural acceptance is innate, invariant and universal — what I accept by my very being. Acceptance is what I assume to hold good in a given situation. Forced acceptance is what I do not accept but, in a given situation, am forced to compromise with or abide by. Social norms and family traditions are essentially details worked out at some time and situation about how to fulfil a goal set by the society; therefore we need to verify, from time to time, whether the goals set are correct (through natural acceptance) and whether the norms still meet those goals in the present situation.'
          }
        ]
      },
      2: {
        topic: 'Application of Natural Acceptance in Decision Making',
        slo: 'SLO 2: Experiential Verification of Feelings',
        qa: [
          {
            q: 'Analyze how verifying desires through Natural Acceptance resolves inner contradictions and leads to ethical human conduct.',
            a: 'Contradiction within oneself arises when our desires, thoughts, and expectations are motivated by pre-conditioning (unexamined societal beliefs) or sensation (seeking temporary pleasure), rather than natural acceptance. When a proposal is examined through natural acceptance:\n1. It brings clarity about intention vs competence.\n2. It harmonizes the desires of the Self with universal human values.\n3. It eliminates internal dilemma, anxiety, and self-doubt, leading to definite human conduct characterized by mutual fulfillment in relationship and conservation in nature.'
          }
        ]
      }
    },
    208: {
      1: {
        topic: 'The Role of Human Beings in Existence',
        slo: 'SLO 1: Human Conduct and Universal Order',
        qa: [
          {
            q: 'What is the ultimate role of a human being in existence?',
            a: 'The ultimate role of a human being in existence is to live in harmony at all four levels of living: within oneself, with family and society, with the rest of nature, and in existence as a whole. Human beings participate constructively by developing right understanding, contributing positively to mutual enrichment, and protecting the ecological and social balance.'
          },
          {
            q: 'How does human conduct affect society?',
            a: 'Good conduct promotes trust, cooperation, mutual respect, and social cohesion, while wrong conduct driven by greed, ego, or sensory indulgence leads to conflict, corruption, and exploitation of people and resources.'
          }
        ]
      },
      2: {
        topic: 'Prosperity in the Light of Harmony between Self and Body',
        slo: 'SLO 2: Self-Regulation (Sanyam) and Health (Svasthya)',
        qa: [
          {
            q: 'Explain prosperity in the light of harmony between Self and Body.',
            a: 'Self-regulation (Sanyam) means the feeling of responsibility toward the Body for its nurturing, protection and right utilisation. Health (Svasthya) means the Body acts according to the Self and all parts of the Body function in complete synergy. The programme to ensure self-regulation and health gives priority to four areas: intake and routine, labour and exercise, posture and regulated breathing, and medicine and treatment. Intake includes wholesome air, water, sunlight, and food. Routine includes proper rising time, sleeping time and eating rhythm. Labour produces physical facility, while exercise maintains physical fitness. This programme helps the Self take natural responsibility for the Body without fear or suppression.'
          }
        ]
      }
    },
    302: {
      1: {
        topic: 'Comprehensive Understanding of the Human Being',
        slo: 'SLO 1: Self as the Conscious Entity and Body as the Material Instrument',
        qa: [
          {
            q: 'How does comprehensive self-understanding influence decision-making?',
            a: 'It enables clarity of purpose, responsible choices, and ethical actions, thereby reducing conflicts and contradictions in life.'
          },
          {
            q: 'What is the core theme of this course on Human Values?',
            a: 'The core theme is to explore and develop the right understanding of the human being, which helps in achieving harmony at all levels of existence.'
          }
        ]
      },
      2: {
        topic: 'Trust as the Foundational Value in Relationships',
        slo: 'SLO 2: Foundational Values for Mutual Happiness',
        qa: [
          {
            q: 'Explain trust as the foundational value in relationship.',
            a: 'Trust means the assurance that the other person wants to make me happy and prosperous. In relationship, trust is foundational because without trust, other feelings like respect, affection, care and guidance cannot be properly established. In UHV, trust is explored by distinguishing between intention and competence. At the level of natural acceptance, every human being wants to make oneself happy and also wants to make the other happy. The problem usually lies in competence, not in intention. However, when the other makes a mistake, we often doubt the other’s intention and create opposition, irritation or anger. But when we make a mistake, we usually see it as lack of competence. Right understanding helps us see that the intention of the other is also naturally acceptable, while competence may need improvement. This assurance about intention is trust, and it leads to mutual happiness in relationship.'
          }
        ]
      }
    },
    308: {
      1: {
        topic: 'Harmony and Contradiction within the Self',
        slo: 'SLO 1: Alignment of Desires, Thoughts, and Expectations',
        qa: [
          {
            q: 'What causes contradiction in the self?',
            a: 'Contradiction arises when there is a mismatch between our desires, thoughts, and selections—often due to lack of clarity or wrong understanding—resulting in stress, confusion, or conflict.'
          },
          {
            q: 'What is meant by harmony in the self?',
            a: 'Harmony in the self occurs when our desires, thoughts, and selections are based on right understanding, leading to inner peace and satisfaction.'
          }
        ]
      },
      2: {
        topic: 'The Human Role in Mutual Enrichment and Nature Harmony',
        slo: 'SLO 2: Harmony in Nature and Existence',
        qa: [
          {
            q: 'Explain the human role in mutual enrichment or harmony in nature.',
            a: 'The human role in nature is to live in a way that preserves, protects and enriches the rest of nature while ensuring prosperity for human beings. Human beings need physical facilities from nature, but these must be used with right understanding and right utilisation. Problems like water insecurity, food insecurity, climate change, pollution and resource depletion show that human beings have often acted with greed, accumulation and exploitation. The solution is not merely more technology, but a holistic approach based on right understanding. Human beings can participate in harmony by reducing waste, protecting water sources, preserving forests, supporting sustainable agriculture, using renewable resources, planting trees, restoring wetlands and living with responsibility. Thus, mutual enrichment means that human prosperity should not be at the cost of nature; it should be in continuity with the preservation of nature.'
          }
        ]
      }
    },

    // ─── MODULE 3: Harmony in Family/Society/Nature (Sessions 301-309) ───
    // Session 301 = Lecture 13: Harmony in the Family — Basic Unit
    301: {
      1: {
        topic: 'Lecture 13: Harmony in the Family — the Basic Unit of Human Interaction',
        slo: 'SLO 1: The Nine Feelings in Relationship and the Foundation of Family',
        qa: [
          {
            q: 'PART B — ACTIVITY 1: The Nine Feelings in Order\nList the nine feelings in relationship in order. Mark the foundation value and the complete value.',
            a: '1. Trust (Vishwas)        — FOUNDATION VALUE\n2. Respect (Samman)\n3. Affection (Sneha)\n4. Care (Mamata)\n5. Guidance (Vatsalya)\n6. Reverence (Shraddha)\n7. Glory (Gaurav)\n8. Gratitude (Kritagyata)\n9. Love (Prem)              — COMPLETE VALUE\n\nFoundation value = Trust (Vishwas)\nComplete value   = Love (Prem)'
          },
          {
            q: 'PART B — ACTIVITY 2: Which Feeling is Naturally Acceptable?\nFor each pair, identify the naturally acceptable feeling.',
            a: 'Naturally Acceptable Feelings (verified on the basis of natural acceptance):\n\n  Trust         ✓  (NOT Mistrust / opposition)\n  Respect       ✓  (NOT Disrespect)\n  Affection     ✓  (NOT Jealousy)\n  Care          ✓  (NOT Exploitation)\n  Guidance      ✓  (NOT Misguidance / confusion)\n  Reverence     ✓  (NOT Irreverence)\n  Glory         ✓  (NOT Inglorious feelings)\n  Gratitude     ✓  (NOT Ingratitude)\n  Love          ✓  (NOT Hatred)\n\nObservation: Each positive feeling in the left column is universally, naturally acceptable — meaning everyone, regardless of age, culture or background, recognises and accepts these feelings as fulfilling. Their opposites create disharmony and unhappiness within the Self.'
          },
          {
            q: 'PART B — ACTIVITY 3: Feelings or Physical Facility?\nFor fulfilling relationship in the family, what do you think of — physical facility (gifts, good food) or feelings (expressing trust, respect...)? Write your honest observation.',
            a: 'What I usually think of for fulfilling relationship:\nIn practice, I often default to physical expressions — giving gifts, buying food, celebrating occasions — as a way of showing care and fulfilling relationships within the family.\n\nWhat the course says is fundamental:\nThe course clarifies that the real foundation of family relationships is the nine feelings, not physical facility. Gifts and material things are meant for the Body, not the Self. The Self needs feelings — primarily trust, respect, affection, and care — for a relationship to feel genuinely fulfilled. Physical facility cannot substitute for the absence of feelings; offering a gift while harbouring resentment or mistrust does not restore harmony. The proper sequence is: Understand the feeling → Have the feeling within → Express it → Right evaluation by both → Mutual happiness.'
          },
          {
            q: 'Q1. Why is the family called the basic unit of human organisation, and what is the major issue in the family?  [5]',
            a: 'The family is called the basic unit of human organisation because it is the smallest, most fundamental group within which human beings relate to one another. Just as a cell is the basic unit of a living body, the family is the structural building block of society: every larger unit — neighbourhood, community, nation — is composed of families.\n\nThe major issue in the family is the fulfilment of relationship. It is not a lack of material resources but a lack of understanding and fulfilment of the feelings in relationship that causes problems within the family. Misunderstandings, conflicts, divorce, emotional neglect, and lack of trust all arise because we fail to identify, ensure, and express the nine feelings that constitute relationship. As long as we relate to each other only at the level of the Body (through transactions, physical proximity, or economic dependency), the deeper need of the Self for feelings like trust, respect, and affection goes unmet, leading to continuous dissatisfaction.'
          },
          {
            q: 'Q2. Explain the four aspects of relationship discussed in the lecture.  [5]',
            a: 'The four aspects of relationship are:\n\n1. Relationship is between one Self (I1) and another Self (I2):\nThe relationship itself exists between the two conscious entities — the two Selves. It is not between two bodies. The Body is used as an instrument to express the feelings in the relationship, as and when required; but the relationship is held in the Self, not the Body.\n\n2. There are feelings in relationship:\nEvery relationship involves feelings in one Self towards the other. These feelings — trust, respect, affection, care, guidance, reverence, glory, gratitude, love — reside in the Self. It is the presence or absence of these feelings that determines the quality of the relationship.\n\n3. The feelings are definite (the nine feelings):\nRelationship does not consist of vague, indefinite emotional states. There are exactly nine recognisable, definite feelings. This means we can identify which feelings are present, which are absent, and what needs to be cultivated.\n\n4. Their fulfilment and mutual evaluation lead to mutual happiness:\nWhen both persons fulfil their respective feelings and evaluate each other rightly — recognising the other as a co-equal Self with similar needs — the result is mutual happiness. Without this, both are left expecting feelings from the other instead of ensuring them within themselves, which leads to conflict.'
          }
        ]
      },
      2: {
        topic: 'Lecture 13: Harmony in the Family — Physical Facility vs Feelings',
        slo: 'SLO 2: Why Feelings Cannot Be Replaced by Physical Facility',
        qa: [
          {
            q: 'Q3. List the nine feelings in relationship in order, identifying the foundation value and the complete value.  [5]',
            a: 'The nine feelings in relationship, in order, are:\n\n  1. Trust (Vishwas)          — Foundation Value\n  2. Respect (Samman)\n  3. Affection (Sneha)\n  4. Care (Mamata)\n  5. Guidance (Vatsalya)\n  6. Reverence (Shraddha)\n  7. Glory (Gaurav)\n  8. Gratitude (Kritagyata)\n  9. Love (Prem)               — Complete Value\n\nFoundation Value — Trust:\nTrust is the foundation value because it is the basis on which all other feelings stand. Without trust, respect, affection, and care cannot be properly felt or expressed. Trust means the assurance that the other Self naturally wants to make me happy and prosperous — not doubting another\'s intentions.\n\nComplete Value — Love:\nLove is the complete value because it encompasses and integrates all other eight feelings. When one truly loves another Self in the complete sense, all nine feelings are simultaneously present and expressed.'
          },
          {
            q: 'Q4. Why can physical facility not compensate for a lack of feelings in relationship?  [5]',
            a: 'Physical facility (Suvidha) is the material means by which the Body is nurtured, protected, and utilised — food, clothing, shelter, gifts, comforts. These are necessary for the Body, but the relationship itself is not between two Bodies; it is between two Selves.\n\nThe needs of the Self are qualitatively different from the needs of the Body:\n• The Self needs feelings — trust, respect, affection, care — in order to feel genuinely fulfilled and happy in a relationship.\n• The Body needs physical facility for its sustenance and health.\n\nWhy physical facility cannot substitute for feelings:\n1. Even if we provide every physical comfort, the absence of trust or respect leaves the relationship hollow and unsatisfying — the Self remains unhappy.\n2. Giving gifts while harbouring resentment or mistrust does not create harmony; the other Self can sense the absence of genuine feeling.\n3. A child who receives every material comfort but no genuine affection or guidance grows up with psychological wounds that no amount of wealth can heal.\n4. The richest families in the world experience relationship breakdowns because physical abundance cannot fill the void created by the absence of right feelings.\n\nConclusion: Physical facility is required for the Body; the nine feelings are required for the Self. Confusing the two — trying to fulfil the Self\'s need through physical means — is a fundamental error in understanding the human being.'
          },
          {
            q: 'Q5. Reflect on your notion of relationship — is it based on the Self or on the Body? Do you think of ensuring these feelings in yourself and expressing them, or of getting them from the other?  [5]',
            a: 'Upon honest self-reflection, I observe that my notion of relationship has largely been Body-centric. I have often thought of relationship in terms of shared physical activities — eating together, exchanging gifts, spending time in physical proximity — rather than examining whether the fundamental feelings like trust, respect, and affection are genuinely present within me for the other.\n\nI also notice that, in most situations, I am oriented toward getting feelings from the other — waiting for others to show me respect, expecting trust from them, hoping for affection — rather than first ensuring these feelings within my own Self and then expressing them. This is what the lecture describes as the "empty bowl" problem: both persons expecting feelings from the other while neither is generating them, so both remain unfulfilled.\n\nThe course\'s insight invites a shift in orientation: take responsibility for the feelings within my own Self, ensure they are right, and then express them. Right evaluation of the other — recognising that the other Self also naturally accepts the same nine feelings and has the same aspiration for happiness — enables genuine mutual fulfilment.\n\nSelf-reflection questions (from Slide 24):\n• Scope of relationship: I tend to limit relationship to close family. Expanding the sense of relationship — recognising the same Self in all human beings — is the direction of growth proposed by UHV.\n• Ensuring vs getting: Honest reflection shows I am mostly in the mode of getting. The course proposes shifting to ensuring feelings within myself first.'
          }
        ]
      }
    },

    // Session 302 = Lecture 14: Feelings, Evaluations, and Trust
    302: {
      1: {
        topic: 'Comprehensive Understanding of the Human Being',
        slo: 'SLO 1: Self as the Conscious Entity and Body as the Material Instrument',
        qa: [
          {
            q: 'How does comprehensive self-understanding influence decision-making?',
            a: 'It enables clarity of purpose, responsible choices, and ethical actions, thereby reducing conflicts and contradictions in life.'
          },
          {
            q: 'What is the core theme of this course on Human Values?',
            a: 'The core theme is to explore and develop the right understanding of the human being, which helps in achieving harmony at all levels of existence.'
          }
        ]
      },
      2: {
        topic: 'Trust as the Foundational Value in Relationships',
        slo: 'SLO 2: Foundational Values for Mutual Happiness',
        qa: [
          {
            q: 'Explain trust as the foundational value in relationship.',
            a: 'Trust means the assurance that the other person wants to make me happy and prosperous. In relationship, trust is foundational because without trust, other feelings like respect, affection, care and guidance cannot be properly established. In UHV, trust is explored by distinguishing between intention and competence. At the level of natural acceptance, every human being wants to make oneself happy and also wants to make the other happy. The problem usually lies in competence, not in intention. Right understanding helps us see that the intention of the other is also naturally acceptable, while competence may need improvement. This assurance about intention is trust, and it leads to mutual happiness in relationship.'
          }
        ]
      }
    },

    308: {
      1: {
        topic: 'Harmony and Contradiction within the Self',
        slo: 'SLO 1: Alignment of Desires, Thoughts, and Expectations',
        qa: [
          {
            q: 'What causes contradiction in the self?',
            a: 'Contradiction arises when there is a mismatch between our desires, thoughts, and selections—often due to lack of clarity or wrong understanding—resulting in stress, confusion, or conflict.'
          },
          {
            q: 'What is meant by harmony in the self?',
            a: 'Harmony in the self occurs when our desires, thoughts, and selections are based on right understanding, leading to inner peace and satisfaction.'
          }
        ]
      },
      2: {
        topic: 'The Human Role in Mutual Enrichment and Nature Harmony',
        slo: 'SLO 2: Harmony in Nature and Existence',
        qa: [
          {
            q: 'Explain the human role in mutual enrichment or harmony in nature.',
            a: 'The human role in nature is to live in a way that preserves, protects and enriches the rest of nature while ensuring prosperity for human beings. Human beings need physical facilities from nature, but these must be used with right understanding and right utilisation. Problems like water insecurity, food insecurity, climate change, pollution and resource depletion show that human beings have often acted with greed, accumulation and exploitation. The solution is a holistic approach based on right understanding. Human beings can participate in harmony by reducing waste, protecting water sources, preserving forests, supporting sustainable agriculture, using renewable resources, and living with responsibility.'
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
        topic: 'Overview of Operating Systems and System Calls',
        slo: 'SLO 1: OS Architecture and Dual-Mode Operation',
        qa: [
          {
            q: 'Explain the role of the operating system as an extended machine and resource manager.',
            a: 'The operating system functions in two vital capacities:\n1. Extended Machine (Software Abstraction): It abstracts the low-level hardware complexity (CPU registers, disk controllers, memory buses) and presents programmers with clean, standardized abstractions such as files, sockets, and processes.\n2. Resource Manager: It orchestrates the allocation and sharing of finite physical resources (CPU cores, RAM, I/O devices) among multiple concurrent programs in an equitable, secure, and performant manner.'
          },
          {
            q: 'Differentiate between User Mode and Kernel Mode. How does a System Call transition between them?',
            a: 'Modern CPUs implement hardware protection rings:\n• User Mode (Ring 3): Application programs run with restricted privileges, preventing direct access to physical memory addresses and privileged hardware I/O instructions.\n• Kernel Mode (Ring 0): The OS kernel executes with unrestricted access to the complete instruction set and physical hardware.\n\nTransition via System Call:\nWhen a user process requires kernel services (e.g., read, fork, write), it loads system call parameters into registers and triggers a software interrupt (trap) or sysenter instruction. The hardware switches the CPU mode bit to Kernel Mode, saves the program counter and register context onto the kernel stack, and jumps to the kernel system call dispatch table. Once finished, the iret/sysexit instruction restores the user context and switches back to User Mode.'
          }
        ]
      },
      2: {
        topic: 'Operating System Structures and Virtualization',
        slo: 'SLO 2: Monolithic vs Microkernel Architectures',
        qa: [
          {
            q: 'Compare Monolithic and Microkernel architectures with respect to performance, security, and extensibility.',
            a: '1. Monolithic Kernel (e.g., Linux, classic Unix):\n• Structure: All primary services (process scheduling, virtual memory, file systems, IPC, device drivers) reside inside the shared kernel space.\n• Performance: Extremely fast execution because internal service calls occur as direct function calls without context switching overhead.\n• Security/Fault Isolation: Vulnerable; a crash or exploit in any third-party device driver can compromise the entire kernel.\n\n2. Microkernel (e.g., Mach, QNX, seL4):\n• Structure: Only minimal essential mechanisms (IPC, basic address space management, thread scheduling) stay in the kernel; file systems and drivers run as user-space server daemons.\n• Security/Fault Isolation: Exceptional resilience; if a driver crashes, it can be restarted without affecting the operating system.\n• Performance: Incurs significant overhead due to frequent user-kernel-user context switches and message passing (IPC).'
          }
        ]
      }
    },
    108: {
      1: {
        topic: 'Memory Management and Paging Systems',
        slo: 'SLO 1: Paging Architecture and Address Translation',
        qa: [
          {
            q: 'Explain the mechanism of Paging and how logical addresses are translated into physical addresses.',
            a: 'Paging is a memory management scheme that eliminates external fragmentation by allowing a process\'s physical address space to be non-contiguous.\n\nAddress Translation Mechanism:\n1. The CPU generates a Logical Address divided into: Page Number (p) and Page Offset (d).\n2. The Page Table Base Register (PTBR) locates the process\'s Page Table in physical RAM.\n3. The Page Number (p) is used as an index into the page table to retrieve the corresponding Frame Number (f).\n4. The Physical Address is constructed by concatenating the Frame Number (f) with the Offset (d).\n5. Hardware checks ensure the offset does not exceed the page size and validates permission bits (read/write/execute).'
          },
          {
            q: 'What is a Translation Lookaside Buffer (TLB) and how does it calculate the Effective Memory Access Time (EMAT)?',
            a: 'A TLB is a fast associative hardware cache situated inside the Memory Management Unit (MMU) that stores recent page-to-frame translations.\n\nEffective Memory Access Time (EMAT) Formula:\nEMAT = [Hit Ratio * (TLB Search Time + Memory Access Time)] + [(1 - Hit Ratio) * (TLB Search Time + 2 * Memory Access Time)]\n\nExplanation:\n• On a TLB Hit: Translation is instant; only 1 RAM access is required to fetch the data.\n• On a TLB Miss: The MMU must first access memory to look up the Page Table, then access memory a 2nd time to retrieve the target data word.'
          }
        ]
      },
      2: {
        topic: 'Virtual Memory and Page Replacement Algorithms',
        slo: 'SLO 2: Demand Paging and Page Fault Handling',
        qa: [
          {
            q: 'Describe the sequence of steps that occur when a Page Fault is serviced by the operating system.',
            a: 'Step-by-Step Page Fault Handling:\n1. The CPU references a memory address whose page table entry has the valid/invalid bit set to "invalid" (page not in RAM).\n2. The MMU raises an internal hardware trap to the OS kernel (Page Fault Interrupt).\n3. The kernel saves the current process context and inspects the internal PCB tables to verify if the memory reference was valid.\n4. If invalid, the process is terminated (Segmentation Fault). If valid, the kernel locates the missing page in backing storage (swap partition/disk).\n5. The OS finds a free physical frame. If no frames are free, it runs a page replacement algorithm (e.g., LRU) to evict a victim page, writing it to disk if dirty.\n6. The OS schedules a disk I/O operation to read the desired page into the allocated physical frame.\n7. When the I/O completes, the page table entry is updated with the new frame number and the valid bit is set to "valid".\n8. The CPU instruction that triggered the page fault is restarted seamlessly.'
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
        topic: 'Introduction to Programming in C',
        slo: 'SLO 1: Crossword Puzzle & C Syntax',
        qa: [
          {
            q: 'Complete Crossword Puzzle — Verified Solutions',
            a: 'Across:\n• 4. A named location in memory used to store a value: VARIABLE\n• 7. Pictorial representation of an algorithm: FLOWCHART\n• 9. Decision making statement used for menu selection: SWITCH\n• 10. Function used to print output: PRINTF\n• 11. Data type used to store whole numbers: INT\n• 12. Operator ++: INCREMENT\n• 14. Where program execution begins: MAIN\n• 15. Data types used to store real numbers: FLOAT\n• 16. Function to find square root: SQRT\n\nDown:\n• 1. Function to read from keyboard: SCANF\n• 2. Pre-defined words in C: KEYWORDS\n• 3. Father of C language: DENNIS RITCHIE\n• 5. \\n refers to: NEWLINE\n• 6. Operators to compare 2 quantities: RELATIONAL\n• 8. Data type having no value: VOID\n• 13. Converts C program into machine code: COMPILER'
          }
        ]
      },
      2: {
        topic: 'General Rules for C Programming and Primitive Data Types',
        slo: 'SLO 2: Match the Following',
        qa: [
          {
            q: 'Match the following elements to their correct descriptions:',
            a: '1. int -----------> G. Used to store whole numbers\n2. float --------> I. Floating-point data type\n3. char ---------> H. Used to print / store characters\n4. main() -------> F. Keyword to start main function\n5. return 0; ----> J. Ends a function and returns value to OS\n6. #include<stdio.h> -> C. Preprocessor directive\n7. ; (semicolon) -> D. Statement terminator\n8. %d -----------> B. Format specifier for integers\n9. %f -----------> A. Format specifier for float\n10. %c ----------> E. Format specifier for characters'
          }
        ]
      }
    }
  },

  // ─────────────────────────────────────────────────────────────────
  // 21CSC203P: ADVANCED PROGRAMMING PRACTICE
  // ─────────────────────────────────────────────────────────────────
  '21CSC203P': {
    101: {
      1: {
        topic: 'Introduction to Programming Languages',
        slo: 'SLO 1: Elements of Programming Languages',
        qa: [
          {
            q: 'What is the syntax and semantics of the following Java statement: int x = 5 + 3;?',
            a: 'Syntax Analysis:\n• "int" is the reserved primitive type keyword specifying a 32-bit signed two\'s complement integer.\n• "x" is the variable identifier serving as a symbolic reference to a memory location.\n• "=" is the assignment operator transferring the right-hand evaluated value to the variable.\n• "5 + 3" is an additive arithmetic expression consisting of integer literals "5" and "3" joined by "+".\n• ";" is the statement terminator mandated by Java grammar rules.\n\nSemantics Analysis:\n• Expression Evaluation: The runtime evaluates the binary addition (5 + 3) to produce the integer literal 8.\n• Allocation & Storage: A 4-byte memory slot is allocated on the stack frame for variable "x". The binary value 8 (0x00000008) is stored into that location.'
          },
          {
            q: 'Identify lexical tokens in a simple Java program.',
            a: 'A token is the smallest individual lexical unit recognized by the compiler during lexical analysis.\nIn the sample statement "int count = 10;":\n1. Keyword: "int"\n2. Identifier: "count"\n3. Operator: "="\n4. Literal: "10"\n5. Separator: ";"'
          }
        ]
      },
      2: {
        topic: 'Introduction to Programming Languages',
        slo: 'SLO 2: Language Classification',
        qa: [
          {
            q: 'Classify Java as compiled/interpreted and explain why.',
            a: 'Java is classified as a Two-Stage Hybrid (Both Compiled and Interpreted) programming language.\n1. Compilation Phase: Source code (.java) is compiled by javac into architecture-neutral Java Bytecode (.class).\n2. Interpretation & JIT Phase: The JVM interprets bytecode at runtime and uses Just-In-Time (JIT) compilation to compile hot spots into native machine instructions.'
          }
        ]
      }
    },
    108: {
      1: {
        topic: 'Imperative Paradigm – Parallel Processing',
        slo: 'SLO 1: Understand Concurrency',
        qa: [
          {
            q: 'What is a thread in Java? How does it differ from a process?',
            a: 'A thread is a lightweight execution sub-unit within a process.\n• Process: Has its own independent address space and allocated memory. Heavyweight context switching.\n• Thread: Multiple threads exist within a single process, sharing heap memory and code segment while maintaining individual program counters and stack frames.'
          },
          {
            q: 'Identify concurrency issues in shared memory.',
            a: 'Key Concurrency Issues:\n1. Race Condition: Two threads concurrently modify shared mutable data.\n2. Deadlock: Two threads wait indefinitely for locks held by each other.\n3. Starvation: A thread is perpetually denied CPU access.'
          },
          {
            q: 'Define thread lifecycle in Java with example.',
            a: 'Thread Lifecycle States:\n1. New -> 2. Runnable -> 3. Blocked/Waiting -> 4. Terminated.\nExample:\nThread t = new Thread(() -> System.out.println("Running"));\nt.start();'
          }
        ]
      },
      2: {
        topic: 'Imperative Paradigm – Parallel Processing',
        slo: 'SLO 2: Thread Synchronization',
        qa: [
          {
            q: 'Demonstrate thread synchronization using synchronized methods and blocks.',
            a: 'Synchronization prevents thread interference and memory consistency errors:\n\nclass Counter {\n    private int count = 0;\n    public synchronized void increment() {\n        count++;\n    }\n    public int getCount() { return count; }\n}'
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

  // CRITICAL FIX: If the subject is not explicitly defined in the DB, return null!
  // NEVER fall back to 21CSC203P or any other subject!
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

  // 1. Direct key match (e.g. 301, 101, 108, etc.)
  if (course[rawNum]?.[sloKey]) return course[rawNum][sloKey];
  if (course[String(rawNum)]?.[sloKey]) return course[String(rawNum)][sloKey];

  // 2. Keyword-based matching for specific lectures/topics
  if (canonicalCode === '21LEM202T') {
    // Lecture 13 / Family / Nine Feelings
    if (topicStr.includes('family') || topicStr.includes('lecture 13') || topicStr.includes('harmony in the family') || (unitNum === 3 && (rawNum === 1 || rawNum === 13))) {
      if (course[301]?.[sloKey]) return course[301][sloKey];
    }
    // Lecture 14 / Trust / Evaluation
    if (topicStr.includes('trust') || topicStr.includes('lecture 14') || (unitNum === 3 && (rawNum === 2 || rawNum === 14))) {
      if (course[302]?.[sloKey]) return course[302][sloKey];
    }
    // Lecture 17 / Nature / Existence / Mutual Enrichment
    if (topicStr.includes('nature') || topicStr.includes('contradiction') || topicStr.includes('lecture 17') || (unitNum === 3 && (rawNum === 8 || rawNum === 17))) {
      if (course[308]?.[sloKey]) return course[308][sloKey];
    }
    // Lecture 1 / Self Exploration
    if (topicStr.includes('exploration') || topicStr.includes('lecture 1') || (unitNum === 1 && rawNum === 1)) {
      if (course[101]?.[sloKey]) return course[101][sloKey];
    }
    // Lecture 8 / Natural Acceptance
    if (topicStr.includes('acceptance') || topicStr.includes('lecture 8') || (unitNum === 1 && (rawNum === 8 || rawNum === 2))) {
      if (course[108]?.[sloKey]) return course[108][sloKey];
    }
    // Lecture 10 / Role of Human / Existence
    if (topicStr.includes('human being') || topicStr.includes('lecture 10') || (unitNum === 2 && (rawNum === 8 || rawNum === 10))) {
      if (course[208]?.[sloKey]) return course[208][sloKey];
    }
  }

  // 3. Unit-aware numbering
  if (unitNum === 3 && course[300 + rawNum]?.[sloKey]) return course[300 + rawNum][sloKey];
  if (unitNum === 2 && course[200 + rawNum]?.[sloKey]) return course[200 + rawNum][sloKey];
  if (unitNum === 1 && course[100 + rawNum]?.[sloKey]) return course[100 + rawNum][sloKey];

  if (rawNum > 100 && course[rawNum]?.[sloKey]) return course[rawNum][sloKey];
  if (rawNum > 100 && course[rawNum % 100]?.[sloKey]) return course[rawNum % 100][sloKey];

  if (rawNum >= 1 && rawNum <= 10 && course[100 + rawNum]?.[sloKey]) {
    return course[100 + rawNum][sloKey];
  }
  if (rawNum >= 11 && rawNum <= 20 && course[200 + (rawNum - 10)]?.[sloKey]) {
    return course[200 + (rawNum - 10)][sloKey];
  }
  if (rawNum >= 21 && rawNum <= 30 && course[300 + (rawNum - 20)]?.[sloKey]) {
    return course[300 + (rawNum - 20)][sloKey];
  }

  for (const k of Object.keys(course)) {
    const kNum = parseInt(k, 10);
    if ((kNum === rawNum || (kNum % 100) === (rawNum % 100) || k.endsWith(String(rawNum))) && course[k]?.[sloKey]) {
      return course[k][sloKey];
    }
  }

  return null;
}

// ═════════════════════════════════════════════════════════════════════
// SUBJECT-SPECIFIC FALLBACK GENERATORS (WHEN NO DB/PORTAL DATA EXISTS)
// ═════════════════════════════════════════════════════════════════════
function getDefaultTopicForCourse(courseCode, rawNum, displaySessNum) {
  const code = (courseCode || '').toUpperCase();
  if (code.includes('LEM') || code.includes('HUMAN') || code.includes('VALUE')) {
    if (rawNum >= 300 || rawNum > 20) return `Harmony in Nature and Universal Order`;
    if (rawNum >= 200 || rawNum > 10) return `Harmony in Human-Human Relationships and Society`;
    return `Understanding Harmony in Human Being and Self Exploration`;
  }
  if (code.includes('202J') || code.includes('OPERAT') || code.includes('OS')) {
    if (rawNum >= 300 || rawNum > 20) return `Memory Management, Virtual Memory, and Storage Systems`;
    if (rawNum >= 200 || rawNum > 10) return `Process Synchronization, Concurrency, and Deadlocks`;
    return `Operating System Structure, System Calls, and CPU Scheduling`;
  }
  if (code.includes('201J') || code.includes('DATA') || code.includes('DSA')) {
    if (rawNum >= 300 || rawNum > 20) return `Non-Linear Data Structures: Trees and Graphs`;
    if (rawNum >= 200 || rawNum > 10) return `Linear Data Structures: Stacks, Queues, and Linked Lists`;
    return `C Fundamentals, Pointers, and Algorithm Analysis`;
  }
  if (code.includes('101T') || code.includes('OBJECT') || code.includes('OOP')) {
    return `Object-Oriented Design, UML Modeling, and Software Patterns`;
  }
  return `Session ${displaySessNum}: Core Curriculum Topics`;
}

function getDefaultSloTitleForCourse(courseCode, sloNum, sessionTopic) {
  const code = (courseCode || '').toUpperCase();
  if (code.includes('LEM') || code.includes('HUMAN') || code.includes('VALUE')) {
    return sloNum === 1
      ? 'SLO 1: Understanding Fundamental Concepts of Harmony and Values'
      : 'SLO 2: Practical Reflection and Experiential Validation in Conduct';
  }
  if (code.includes('202J') || code.includes('OPERAT') || code.includes('OS')) {
    return sloNum === 1
      ? 'SLO 1: Theoretical Architecture and System Call Principles'
      : 'SLO 2: Algorithm Implementation and Performance Analysis';
  }
  if (code.includes('201J') || code.includes('DATA') || code.includes('DSA')) {
    return sloNum === 1
      ? 'SLO 1: Data Structure Representation and Mechanics'
      : 'SLO 2: Algorithm Complexity and Problem Solving';
  }
  return sloNum === 1 ? 'SLO 1: Foundational Principles' : 'SLO 2: Practical Application & Analysis';
}

function generateAnswerForSubject(question, courseCode) {
  const code = (courseCode || '').toUpperCase();
  const qClean = cleanHtmlForPdf(question);

  if (code.includes('LEM') || code.includes('HUMAN') || code.includes('VALUE')) {
    return `In Universal Human Values, this proposal is evaluated through the lens of Natural Acceptance and right understanding. At the level of the Self, harmony requires clear alignment between desires, thoughts, and expectations, eliminating internal contradiction. In relationship, mutual happiness is ensured through foundational values—primarily Trust (recognizing positive intention) and Respect (evaluating others as similar to oneself). At the level of nature and existence, the human role is to live in mutual enrichment and coexistence with all four orders of nature.`;
  }

  if (code.includes('202J') || code.includes('OPERAT') || code.includes('OS')) {
    return `From an operating systems design perspective, this concept addresses low-level hardware abstraction and concurrent resource management. The OS kernel enforces process isolation, CPU scheduling fairness, and secure memory translation via hardware support (such as paging, TLB caches, and dual-mode CPU rings). Proper synchronization primitives (mutexes, semaphores) are applied to prevent race conditions and deadlock situations while maintaining optimal throughput.`;
  }

  if (code.includes('201J') || code.includes('DATA') || code.includes('DSA')) {
    return `In data structures and algorithm design, this involves evaluating time and space complexity trade-offs (using Big-O notation). Memory allocation, pointer manipulations, and data organization principles are optimized to balance insertion, search, and deletion operational costs across static contiguous arrays and dynamic linked structures.`;
  }

  return `Comprehensive analysis demonstrates that applying fundamental engineering and analytical principles ensures optimal efficiency, reliability, and correctness in this problem domain.`;
}

function generateCourseSpecificQuestions(courseCode, rawNum, sloNum, sessionTopic, sloTitle) {
  const code = (courseCode || '').toUpperCase();

  if (code.includes('LEM') || code.includes('HUMAN') || code.includes('VALUE')) {
    if (sloNum === 1) {
      return [
        {
          q: 'Explain the role of Natural Acceptance in resolving contradictions within the Self.',
          a: 'Natural Acceptance is the innate, unconditional human faculty that recognizes what is naturally right and acceptable. Unlike desires conditioned by peer pressure or sensory pleasures, natural acceptance is invariant with time, place, and person. When our thoughts and selections align with natural acceptance, internal conflicts and contradictions are eliminated, leading to continuous happiness (Sukh) and peace of mind.'
        },
        {
          q: 'Differentiate between the needs of the Self (\'I\') and the needs of the Body.',
          a: 'The human being is a co-existence of the sentient Self (\'I\') and the physical Body.\n1. Needs: The needs of the Self are qualitative and continuous (happiness, respect, trust), while the needs of the Body are physical, quantitative, and limited in time (food, clothing, shelter).\n2. Activities: The Self engages in desires, thoughts, and expectations. The Body functions as an instrument through physiological activities.\n3. Fulfillment: Needs of the Self are fulfilled through Right Understanding and Feelings, while bodily needs are satisfied through Physical Facilities (Suvidha).'
        }
      ];
    } else {
      return [
        {
          q: 'Explain Trust (Vishwas) and Respect (Samman) as foundational values in human relationships.',
          a: 'Trust is the assurance that the other person genuinely intends to make me happy and prosperous. UHV emphasizes the distinction between Intention (what one naturally wants, which is always positive) and Competence (ability to fulfill that intention). Doubting another\'s intention leads to opposition and anger; understanding that mistakes arise from lack of competence fosters patience and mutual development.\nRespect means Right Evaluation of the other person as being similar to oneself in purpose and potential, avoiding discrimination based on age, gender, race, or wealth.'
        },
        {
          q: 'Describe the interconnectedness and mutual fulfillment among the four orders of Nature.',
          a: 'Nature consists of four orders: Material Order (soil, water, air), Plant Order (vegetation), Animal Order (animals, birds), and Human Order. The first three orders naturally exist in mutual enrichment, recyclability, and self-regulation. The human order must cultivate right understanding to participate constructively in this harmony, ensuring prosperity without depleting or polluting ecological systems.'
        }
      ];
    }
  }

  if (code.includes('202J') || code.includes('OPERAT') || code.includes('OS')) {
    if (sloNum === 1) {
      return [
        {
          q: 'Explain the difference between a Process and a Thread, and describe the contents of a Process Control Block (PCB).',
          a: 'A process is an executing instance of a program with its own dedicated virtual address space, memory segments (code, data, heap, stack), and file descriptors. A thread is a lightweight unit of execution within a process that shares the address space, code, and global variables with peer threads, but maintains its own program counter, CPU registers, and stack.\nThe Process Control Block (PCB) contains essential OS bookkeeping data: Process ID (PID), Process State, Program Counter, CPU registers, CPU scheduling priority, Memory-management info (page tables), and I/O status info.'
        },
        {
          q: 'Describe the four necessary conditions for Deadlock to occur in an operating system.',
          a: 'A deadlock can occur if and only if all four Coffman conditions hold simultaneously:\n1. Mutual Exclusion: At least one resource must be held in a non-shareable mode.\n2. Hold and Wait: A process holding at least one resource must be waiting to acquire additional resources held by other processes.\n3. No Preemption: Resources cannot be forcibly seized from a process; they can only be released voluntarily.\n4. Circular Wait: A closed chain of processes exists such that each process holds a resource that is requested by the next process in the cycle.'
        }
      ];
    } else {
      return [
        {
          q: 'Explain the concept of Virtual Memory and how Demand Paging handles Page Faults.',
          a: 'Virtual Memory decouples user logical memory from physical RAM, allowing execution of processes that require more memory than is physically available.\nDemand Paging brings pages into physical memory only when they are referenced during execution:\n1. When the CPU references an unmapped page, the MMU triggers a Page Fault interrupt.\n2. The OS kernel traps to an interrupt handler, verifies the validity of the virtual address, and locates the page on backing swap storage.\n3. The OS allocates an empty physical frame, reads the page from disk into RAM, updates the page table entry (setting valid bit to 1), and restarts the faulted instruction.'
        }
      ];
    }
  }

  if (code.includes('201J') || code.includes('DATA') || code.includes('DSA')) {
    if (sloNum === 1) {
      return [
        {
          q: 'Compare contiguous array memory allocation with dynamic Singly Linked Lists.',
          a: '1. Arrays: Stored in contiguous memory locations. Offers O(1) random access by index. Disadvantages include fixed size allocated at compilation/creation and O(n) worst-case time for insertions and deletions due to element shifting.\n2. Linked Lists: Stored in non-contiguous dynamic heap memory where each node holds data and a pointer to the next node. Allows efficient O(1) insertions and deletions at known positions, but requires O(n) sequential traversal and extra memory overhead for pointer storage.'
        },
        {
          q: 'Describe the stack data structure and its common computer science applications.',
          a: 'A Stack is a linear data structure following the LIFO (Last-In, First-Out) principle. Primary operations are push() and pop(), both running in O(1) time.\nApplications include:\n1. Function call management and recursion execution via runtime call stacks.\n2. Expression evaluation and infix to postfix/prefix syntax conversion.\n3. Syntax verification (balanced parentheses checking in compilers).\n4. Undo/redo operations in applications and backtracking algorithms (DFS).'
        }
      ];
    } else {
      return [
        {
          q: 'Explain Binary Search Trees (BST) and demonstrate in-order, pre-order, and post-order traversals.',
          a: 'A Binary Search Tree is a binary tree where for each node, all keys in the left subtree are smaller, and all keys in the right subtree are greater than the node\'s key. On average, search, insertion, and deletion operate in O(log n) time.\nTraversals:\n• In-order (Left, Root, Right): Traverses keys in sorted ascending order.\n• Pre-order (Root, Left, Right): Useful for creating copies of the tree structure.\n• Post-order (Left, Right, Root): Useful for bottom-up node deletion and syntax tree evaluation.'
        }
      ];
    }
  }

  return [
    {
      q: `Analyze the core principles of ${cleanHtmlForPdf(sessionTopic)}.`,
      a: `A rigorous study of this topic demonstrates that applying foundational domain principles leads to systematic problem formulation, robust system architecture, and verifiable results across all operational scenarios.`
    }
  ];
}

// ═════════════════════════════════════════════════════════════════════
// MAIN ANSWER PDF BUILDER
// ═════════════════════════════════════════════════════════════════════
// ═════════════════════════════════════════════════════════════════════
// EXTRACT SESSION WORKSHEET QUESTIONS & ANSWERS
// ═════════════════════════════════════════════════════════════════════
function getSessionWorksheetData(sessionNum, sloNum, currentSessionData, state) {
  const rawCode = (state?.currentSubject?.code || '21LEM202T').toUpperCase().trim();
  const courseCode = rawCode;
  const courseName = (state?.currentSubject?.name || SRM_COURSE_NAMES[rawCode] || 'UNIVERSAL HUMAN VALUES').toUpperCase().trim();
  const studentName = state?.studentName || 'VADDI JEEVAN VENKATA RANGA SAI';
  const regNum = state?.regNum || 'RA2511026011232';
  const branch = state?.department || 'CSE (AI/ML)';
  const dateStr = new Date().toLocaleDateString('en-GB');

  const deptUpper = (state?.department || 'Department of Computational Intelligence').toUpperCase();
  const deptStr = deptUpper.includes('DEPARTMENT') ? deptUpper : `DEPARTMENT OF ${deptUpper}`;

  const numMatch = String(sessionNum || '1').match(/\d+/);
  const rawNum = numMatch ? parseInt(numMatch[0], 10) : 1;
  const displaySessNum = (rawNum > 100) ? (rawNum % 100) : rawNum;

  // 1. Session Topic Resolution
  let sessionTopic = '';
  if (currentSessionData?.sessStatus?.SESSION_NAME && !currentSessionData.sessStatus.SESSION_NAME.startsWith('Session')) {
    sessionTopic = currentSessionData.sessStatus.SESSION_NAME;
  } else if (state?.currentSession?.sess?.name && !state.currentSession.sess.name.match(/^Session\s*\d+$/i)) {
    sessionTopic = state.currentSession.sess.name;
  } else if (currentSessionData?.qData?.sp?.title) {
    sessionTopic = currentSessionData.qData.sp.title;
  }

  // 2. SLO Title Resolution
  let sloTitle = '';
  const qSlo = currentSessionData?.qData?.slo;
  if (sloNum === 1) {
    if (qSlo?.SLO1) sloTitle = qSlo.SLO1;
    else if (qSlo?.SRO1) sloTitle = qSlo.SRO1;
  } else {
    if (qSlo?.SLO2) sloTitle = qSlo.SLO2;
    else if (qSlo?.SRO2) sloTitle = qSlo.SRO2;
  }

  // Check known course database if live metadata was generic
  const knownSLO = findKnownSLO(courseCode, sessionNum, sloNum, state || sessionTopic);
  if (!sessionTopic && knownSLO?.topic) sessionTopic = knownSLO.topic;
  if (!sloTitle && knownSLO?.slo) sloTitle = knownSLO.slo;

  if (!sessionTopic) sessionTopic = getDefaultTopicForCourse(courseCode, rawNum, displaySessNum);
  if (!sloTitle) sloTitle = getDefaultSloTitleForCourse(courseCode, sloNum, sessionTopic);

  let displayTopic = sessionTopic.includes('Session') ? sessionTopic : `Session ${displaySessNum}: ${sessionTopic}`;
  let displaySlo = sloTitle.includes('SLO') ? sloTitle : `SLO ${sloNum}: ${sloTitle}`;

  // 3. Extract Questions & Answers List
  let questionsList = [];
  const qData = currentSessionData?.qData;
  if (qData) {
    const rawSq = Array.isArray(qData.sq) ? qData.sq : [];
    const rawLq = Array.isArray(qData.lq) ? qData.lq : [];
    let liveItems = (sloNum === 1) ? [...rawSq, ...rawLq] : [...rawLq, ...rawSq];
    questionsList = liveItems
      .map(item => ({
        q: cleanHtmlForPdf(item.QUESTION_DESC),
        a: cleanHtmlForPdf(item.ANSWER) || generateAnswerForSubject(item.QUESTION_DESC, courseCode)
      }))
      .filter(x => x.q && x.q.length > 3);
  }

  if (questionsList.length === 0 && knownSLO?.qa?.length > 0) {
    questionsList = knownSLO.qa;
  }

  if (questionsList.length === 0) {
    questionsList = generateCourseSpecificQuestions(courseCode, rawNum, sloNum, sessionTopic, sloTitle);
  }

  return {
    courseCode,
    courseName,
    deptStr,
    studentName,
    regNum,
    branch,
    dateStr,
    displayTopic,
    displaySlo,
    questionsList
  };
}

// ═════════════════════════════════════════════════════════════════════
// MAIN ANSWER PDF BUILDER
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

  // Header Title - EXACT layout as official SRM Question PDF
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('SRM INSTITUTE OF SCIENCE AND TECHNOLOGY', W / 2, y, { align: 'center' });
  y += 5;

  doc.setFontSize(9);
  doc.text('FACULTY OF ENGINEERING AND TECHNOLOGY', W / 2, y, { align: 'center' });
  y += 4.5;

  doc.text('SCHOOL OF COMPUTING', W / 2, y, { align: 'center' });
  y += 4.5;

  doc.text(data.deptStr, W / 2, y, { align: 'center' });
  y += 4.5;

  doc.text(`${data.courseCode} ${data.courseName}`, W / 2, y, { align: 'center' });
  y += 7.5;

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  const topicLines = doc.splitTextToSize(data.displayTopic, contentW);
  doc.text(topicLines, M, y);
  y += (topicLines.length * 4.8) + 1;

  const sloLines = doc.splitTextToSize(data.displaySlo, contentW);
  doc.text(sloLines, M, y);
  y += (sloLines.length * 4.8) + 2.5;

  // Clean non-overlapping student table
  y = drawStudentHeaderTable(doc, M, y, contentW, data.studentName, data.regNum, data.branch, data.dateStr);

  // Render each question with answer immediately below it
  data.questionsList.forEach((item, idx) => {
    if (y > 245) { doc.addPage(); y = 16; }

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    const qLines = doc.splitTextToSize(`${idx + 1}.  ${cleanHtmlForPdf(item.q)}`, contentW - 4);
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
      if (y > 275) {
        doc.addPage();
        y = 16;
      }
      doc.text(aLines[i], M + 4, y);
      y += 4.2;
    }
    y += 5.5;
  });

  const pdfUri = doc.output('datauristring');
  if (currentSessionData) {
    if (sloNum === 1) currentSessionData.slo1PdfUri = pdfUri;
    else currentSessionData.slo2PdfUri = pdfUri;
  }

  return pdfUri;
}
