import { Question, TopicSection } from '../types';

export const TOPIC_SECTIONS: TopicSection[] = [
  {
    id: 'functions',
    name: 'Functions & Foundations',
    description: 'Domains, ranges, inverses, composite functions, transformations & symmetry.',
    questionCount: 24,
    iconName: 'FunctionSquare',
    category: 'Pre-Calculus'
  },
  {
    id: 'limits',
    name: 'Limits & Continuity',
    description: 'Algebraic limits, one-sided limits, asymptotes, continuity & L’Hôpital’s rule.',
    questionCount: 23,
    iconName: 'GitCommitVertical',
    category: 'Calculus I'
  },
  {
    id: 'differentiation',
    name: 'Differentiation',
    description: 'Power, product, quotient, chain rule, implicit, trig & log derivatives.',
    questionCount: 27,
    iconName: 'TrendingUp',
    category: 'Calculus I'
  },
  {
    id: 'stationary',
    name: 'Stationary Points & Curves',
    description: 'Critical points, local extrema, concavity, inflection points & MVT.',
    questionCount: 8,
    iconName: 'Activity',
    category: 'Calculus I'
  },
  {
    id: 'integration',
    name: 'Integration',
    description: 'Indefinite & definite integrals, u-substitution, parts & trig substitution.',
    questionCount: 12,
    iconName: 'Layers',
    category: 'Calculus II'
  },
  {
    id: 'applications',
    name: 'Applications of Integration',
    description: 'Area between curves, volume of revolution (disk/washer/shell) & arc length.',
    questionCount: 4,
    iconName: 'PieChart',
    category: 'Calculus II'
  },
  {
    id: 'series',
    name: 'Series & Sequences',
    description: 'Infinite series, convergence tests, Taylor & Maclaurin expansion.',
    questionCount: 5,
    iconName: 'Sigma',
    category: 'Calculus II'
  },
  {
    id: 'challenge',
    name: 'Challenge & Advanced',
    description: 'Multi-concept calculus exam problems, optimization & rates of change.',
    questionCount: 12,
    iconName: 'Award',
    category: 'Advanced'
  }
];

export const RAW_QUESTION_BANK: Question[] = [
  // --- SECTION 1: FUNCTIONS & FOUNDATIONS (24 Qs) ---
  {
    id: 'F01',
    topic: 'Functions & Foundations',
    q: 'Find the domain of f(x) = √(4 - x²).',
    options: ['(-∞, -2] ∪ [2, ∞)', '[-2, 2]', '(-2, 2)', '(-∞, 2]'],
    answer: 1,
    pattern: 'Radicand Rule: √(A) defined ⟹ A ≥ 0',
    hint: 'The expression inside the square root must be non-negative.',
    steps: [
      {
        title: 'Step 1: Set radicand non-negative',
        body: 'For √(4 - x²) to be real, we require 4 - x² ≥ 0.'
      },
      {
        title: 'Step 2: Factor the inequality',
        body: '(2 - x)(2 + x) ≥ 0'
      },
      {
        title: 'Step 3: Solve for x interval',
        body: 'Testing points gives -2 ≤ x ≤ 2. In interval notation: [-2, 2].'
      }
    ]
  },
  {
    id: 'F02',
    topic: 'Functions & Foundations',
    q: 'Find f⁻¹(x) if f(x) = (2x + 3) / (x - 1), x ≠ 1.',
    options: ['(x + 3) / (x - 2)', '(x - 3) / (x - 2)', '(2x - 1) / (x + 3)', '(x + 2) / (2x - 1)'],
    answer: 0,
    pattern: 'Inverse Rule: Swap x and y, then solve for y',
    hint: 'Set y = (2x + 3)/(x - 1), swap x and y, and isolate y.',
    steps: [
      {
        title: 'Step 1: Swap variables',
        body: 'Set x = (2y + 3) / (y - 1).'
      },
      {
        title: 'Step 2: Cross multiply',
        body: 'x(y - 1) = 2y + 3 ⟹ xy - x = 2y + 3'
      },
      {
        title: 'Step 3: Group y terms and solve',
        body: 'xy - 2y = x + 3 ⟹ y(x - 2) = x + 3 ⟹ y = (x + 3)/(x - 2).'
      }
    ]
  },
  {
    id: 'F03',
    topic: 'Functions & Foundations',
    q: 'If f(x) = x² + 1 and g(x) = √(x - 2), find (f ∘ g)(x) and its domain.',
    options: ['x - 1 for x ≥ 2', 'x - 1 for x ∈ ℝ', '√(x² - 1) for x ≥ 1', 'x + 1 for x ≥ 2'],
    answer: 0,
    pattern: 'Composite Function: (f ∘ g)(x) = f(g(x))',
    hint: 'Substitute g(x) into f, keeping in mind the restriction from g(x).',
    steps: [
      {
        title: 'Step 1: Evaluate f(g(x))',
        body: 'f(g(x)) = (g(x))² + 1 = (√(x - 2))² + 1 = x - 2 + 1 = x - 1.'
      },
      {
        title: 'Step 2: Determine domain restriction',
        body: 'Since g(x) = √(x - 2) requires x - 2 ≥ 0, the domain is x ≥ 2.'
      }
    ]
  },
  {
    id: 'F04',
    topic: 'Functions & Foundations',
    q: 'Determine whether f(x) = x · cos(x) is even, odd, or neither.',
    options: ['Even', 'Odd', 'Neither', 'Both Even and Odd'],
    answer: 1,
    pattern: 'Symmetry Test: f(-x) = -f(x) ⟹ Odd; f(-x) = f(x) ⟹ Even',
    hint: 'Evaluate f(-x) using the identity cos(-x) = cos(x).',
    steps: [
      {
        title: 'Step 1: Substitute -x for x',
        body: 'f(-x) = (-x) · cos(-x)'
      },
      {
        title: 'Step 2: Apply trig parity properties',
        body: 'Since cos(-x) = cos(x), f(-x) = -x · cos(x) = -f(x).'
      },
      {
        title: 'Step 3: Conclude parity',
        body: 'Since f(-x) = -f(x), the function is ODD.'
      }
    ]
  },
  {
    id: 'F05',
    topic: 'Functions & Foundations',
    q: 'Solve the equation for x: ln(x) + ln(x - 2) = ln(3).',
    options: ['x = 3', 'x = 3 or x = -1', 'x = 1', 'x = e³'],
    answer: 0,
    pattern: 'Log Addition Identity: ln(a) + ln(b) = ln(a · b)',
    hint: 'Combine logs using the product rule, then discard extraneous solutions.',
    steps: [
      {
        title: 'Step 1: Combine logarithms',
        body: 'ln(x(x - 2)) = ln(3)'
      },
      {
        title: 'Step 2: Exponentiate both sides',
        body: 'x(x - 2) = 3 ⟹ x² - 2x - 3 = 0 ⟹ (x - 3)(x + 1) = 0'
      },
      {
        title: 'Step 3: Check domain restrictions',
        body: 'Since ln(x) requires x > 0, x = -1 is extraneous. Thus x = 3.'
      }
    ]
  },
  {
    id: 'F06',
    topic: 'Functions & Foundations',
    q: 'Find the vertical asymptote of f(x) = (x² - 9) / (x² - 5x + 6).',
    options: ['x = 2', 'x = 3 and x = 2', 'x = 3', 'x = -3'],
    answer: 0,
    pattern: 'Asymptote Rule: Non-canceling denominator zero ⟹ Vertical Asymptote',
    hint: 'Factor both numerator and denominator to simplify common terms first.',
    steps: [
      {
        title: 'Step 1: Factor numerator and denominator',
        body: 'f(x) = [(x - 3)(x + 3)] / [(x - 3)(x - 2)]'
      },
      {
        title: 'Step 2: Cancel removable discontinuity',
        body: 'For x ≠ 3: f(x) = (x + 3) / (x - 2). There is a removable hole at x = 3.'
      },
      {
        title: 'Step 3: Identify vertical asymptote',
        body: 'The non-removable zero in the denominator is x = 2.'
      }
    ]
  },
  {
    id: 'F07',
    topic: 'Functions & Foundations',
    q: 'Find the period of the function f(x) = 3 sin(4x - π/2).',
    options: ['π / 2', 'π', '2π', '4π'],
    answer: 0,
    pattern: 'Trig Period Formula: Period T = 2π / |B| for sin(Bx - C)',
    hint: 'Identify B = 4 in sin(4x - π/2).',
    steps: [
      {
        title: 'Step 1: Identify coefficient of x',
        body: 'Here B = 4.'
      },
      {
        title: 'Step 2: Calculate period',
        body: 'Period = 2π / B = 2π / 4 = π / 2.'
      }
    ]
  },
  {
    id: 'F08',
    topic: 'Functions & Foundations',
    q: 'Which transformation turns y = f(x) into y = -2f(x - 3) + 1?',
    options: [
      'Shift right 3, reflect over x-axis, vertical stretch by 2, shift up 1',
      'Shift left 3, reflect over y-axis, vertical stretch by 2, shift up 1',
      'Shift right 3, reflect over y-axis, vertical compress by 2, shift up 1',
      'Shift left 3, reflect over x-axis, vertical stretch by 2, shift down 1'
    ],
    answer: 0,
    pattern: 'Transformation Order: Shift inside, stretch/reflect, shift outside',
    hint: 'Break down -2f(x-3) + 1: x-3 shifts right, - reflects, 2 stretches vertically, +1 shifts up.',
    steps: [
      {
        title: 'Step 1: Analyze horizontal shift',
        body: 'f(x - 3) shifts the graph 3 units to the right.'
      },
      {
        title: 'Step 2: Analyze vertical stretch & reflection',
        body: '-2 multiplying f(...) vertically stretches by 2 and reflects across the x-axis.'
      },
      {
        title: 'Step 3: Analyze vertical shift',
        body: '+1 shifts the entire graph up by 1 unit.'
      }
    ]
  },
  {
    id: 'F09',
    topic: 'Functions & Foundations',
    q: 'Solve the absolute value inequality: |2x - 5| < 7.',
    options: ['-1 < x < 6', 'x < -1 or x > 6', '1 < x < 6', '-6 < x < 1'],
    answer: 0,
    pattern: 'Absolute Value Rule: |U| < k ⟹ -k < U < k',
    hint: 'Unfold to -7 < 2x - 5 < 7 and solve for x.',
    steps: [
      {
        title: 'Step 1: Unfold inequality',
        body: '-7 < 2x - 5 < 7'
      },
      {
        title: 'Step 2: Add 5 to all sides',
        body: '-2 < 2x < 12'
      },
      {
        title: 'Step 3: Divide by 2',
        body: '-1 < x < 6'
      }
    ]
  },
  {
    id: 'F10',
    topic: 'Functions & Foundations',
    q: 'Find the range of f(x) = x² - 6x + 13.',
    options: ['[4, ∞)', '[13, ∞)', '(-∞, 4]', '[3, ∞)'],
    answer: 0,
    pattern: 'Parabola Vertex Form: f(x) = a(x - h)² + k',
    hint: 'Complete the square to find the vertex of this upward opening parabola.',
    steps: [
      {
        title: 'Step 1: Complete the square',
        body: 'f(x) = (x² - 6x + 9) - 9 + 13 = (x - 3)² + 4'
      },
      {
        title: 'Step 2: Identify minimum value',
        body: 'Since (x - 3)² ≥ 0, the minimum value occurs at x = 3 where f(3) = 4.'
      },
      {
        title: 'Step 3: State range',
        body: 'The range is [4, ∞).'
      }
    ]
  },
  {
    id: 'F11',
    topic: 'Functions & Foundations',
    q: 'Simplify e^(3 ln(x)).',
    options: ['x³', '3x', 'e^(3x)', '3 ln(x)'],
    answer: 0,
    pattern: 'Exponent & Log Rule: e^(ln(A^k)) = A^k',
    hint: 'Move the coefficient 3 inside as an exponent of x first.',
    steps: [
      {
        title: 'Step 1: Apply power rule of logs',
        body: '3 ln(x) = ln(x³)'
      },
      {
        title: 'Step 2: Apply inverse relationship',
        body: 'e^(ln(x³)) = x³.'
      }
    ]
  },
  {
    id: 'F12',
    topic: 'Functions & Foundations',
    q: 'Find the amplitude of f(x) = -4 cos(3x + π).',
    options: ['4', '-4', '3', 'π'],
    answer: 0,
    pattern: 'Amplitude Rule: Amplitude = |A| for y = A cos(Bx + C)',
    hint: 'Amplitude is always a non-negative distance equal to |A|.',
    steps: [
      {
        title: 'Step 1: Identify lead coefficient',
        body: 'A = -4.'
      },
      {
        title: 'Step 2: Calculate amplitude',
        body: 'Amplitude = |-4| = 4.'
      }
    ]
  },
  {
    id: 'F13',
    topic: 'Functions & Foundations',
    q: 'If f(x) = 3x - 5 and g(x) = x² + 2, find g(f(2)).',
    options: ['3', '11', '7', '1'],
    answer: 0,
    pattern: 'Nested Evaluation: Evaluate f(2) first, then plug result into g.',
    hint: 'Calculate f(2) = 3(2) - 5 = 1, then calculate g(1).',
    steps: [
      {
        title: 'Step 1: Calculate inner function f(2)',
        body: 'f(2) = 3(2) - 5 = 6 - 5 = 1.'
      },
      {
        title: 'Step 2: Calculate outer function g(1)',
        body: 'g(1) = (1)² + 2 = 1 + 2 = 3.'
      }
    ]
  },
  {
    id: 'F14',
    topic: 'Functions & Foundations',
    q: 'Find the horizontal asymptote of f(x) = (5x² + 2) / (2x² - 3x + 1).',
    options: ['y = 5/2', 'y = 0', 'y = 2/5', 'No horizontal asymptote'],
    answer: 0,
    pattern: 'HA Rule: Same degree in num & den ⟹ y = ratio of leading coefficients',
    hint: 'Both numerator and denominator have degree 2.',
    steps: [
      {
        title: 'Step 1: Compare degrees',
        body: 'Numerator degree = 2, Denominator degree = 2.'
      },
      {
        title: 'Step 2: Take ratio of leading coefficients',
        body: 'y = 5 / 2.'
      }
    ]
  },
  {
    id: 'F15',
    topic: 'Functions & Foundations',
    q: 'Solve 2^(2x + 1) = 32.',
    options: ['x = 2', 'x = 3', 'x = 5/2', 'x = 4'],
    answer: 0,
    pattern: 'Common Base Rule: a^M = a^N ⟹ M = N',
    hint: 'Express 32 as a power of 2: 32 = 2⁵.',
    steps: [
      {
        title: 'Step 1: Rewrite right side with base 2',
        body: '2^(2x + 1) = 2⁵'
      },
      {
        title: 'Step 2: Equate exponents',
        body: '2x + 1 = 5 ⟹ 2x = 4 ⟹ x = 2.'
      }
    ]
  },
  {
    id: 'F16',
    topic: 'Functions & Foundations',
    q: 'Find the x-intercept(s) of f(x) = ln(x² - 3).',
    options: ['x = ±2', 'x = ±√3', 'x = ±1', 'x = 2 only'],
    answer: 0,
    pattern: 'x-intercept Rule: Set f(x) = 0 and solve for x',
    hint: 'Set ln(x² - 3) = 0. Recall ln(1) = 0.',
    steps: [
      {
        title: 'Step 1: Set function equal to zero',
        body: 'ln(x² - 3) = 0'
      },
      {
        title: 'Step 2: Exponentiate both sides',
        body: 'x² - 3 = e⁰ = 1'
      },
      {
        title: 'Step 3: Solve for x',
        body: 'x² = 4 ⟹ x = ±2.'
      }
    ]
  },
  {
    id: 'F17',
    topic: 'Functions & Foundations',
    q: 'Determine the range of g(x) = 3 - e^(-x).',
    options: ['(-∞, 3)', '(3, ∞)', '[3, ∞)', '(-∞, 0)'],
    answer: 0,
    pattern: 'Exponential Range: e^(-x) > 0 for all x',
    hint: 'Since e^(-x) is strictly positive, 3 - e^(-x) is strictly less than 3.',
    steps: [
      {
        title: 'Step 1: Analyze e^(-x)',
        body: 'For all real x, e^(-x) > 0.'
      },
      {
        title: 'Step 2: Multiply by -1 and add 3',
        body: '-e^(-x) < 0 ⟹ 3 - e^(-x) < 3.'
      },
      {
        title: 'Step 3: State range',
        body: 'As x ➔ ∞, e^(-x) ➔ 0, so g(x) ➔ 3. As x ➔ -∞, g(x) ➔ -∞. Range is (-∞, 3).'
      }
    ]
  },
  {
    id: 'F18',
    topic: 'Functions & Foundations',
    q: 'Express sin(2 θ) in terms of single-angle trig functions.',
    options: ['2 sin(θ) cos(θ)', 'cos²(θ) - sin²(θ)', '2 sin(θ)', 'sin²(θ) cos²(θ)'],
    answer: 0,
    pattern: 'Double Angle Formula: sin(2θ) = 2 sin(θ) cos(θ)',
    hint: 'Recall the standard sine double angle identity.',
    steps: [
      {
        title: 'Step 1: Recall Identity',
        body: 'sin(A + B) = sin(A)cos(B) + cos(A)sin(B).'
      },
      {
        title: 'Step 2: Set A = B = θ',
        body: 'sin(θ + θ) = sin(θ)cos(θ) + cos(θ)sin(θ) = 2 sin(θ) cos(θ).'
      }
    ]
  },
  {
    id: 'F19',
    topic: 'Functions & Foundations',
    q: 'Find the inverse of f(x) = x³ + 2.',
    options: ['∛(x - 2)', '∛(x) - 2', '∛(x + 2)', '(x - 2)³'],
    answer: 0,
    pattern: 'Inverse Cubing: Swap x and y, isolate y³ then cube root',
    hint: 'Set x = y³ + 2 ⟹ y³ = x - 2.',
    steps: [
      {
        title: 'Step 1: Swap x and y',
        body: 'x = y³ + 2'
      },
      {
        title: 'Step 2: Isolate y³',
        body: 'y³ = x - 2'
      },
      {
        title: 'Step 3: Take cube root',
        body: 'y = ∛(x - 2).'
      }
    ]
  },
  {
    id: 'F20',
    topic: 'Functions & Foundations',
    q: 'What is the domain of f(x) = log₄(3 - x)?',
    options: ['(-∞, 3)', '(3, ∞)', '(-∞, 3]', '[3, ∞)'],
    answer: 0,
    pattern: 'Log Domain Rule: Argument must be strictly positive (> 0)',
    hint: 'Set 3 - x > 0 and solve for x.',
    steps: [
      {
        title: 'Step 1: Set argument > 0',
        body: '3 - x > 0'
      },
      {
        title: 'Step 2: Solve inequality',
        body: '3 > x ⟹ x < 3. In interval notation: (-∞, 3).'
      }
    ]
  },
  {
    id: 'F21',
    topic: 'Functions & Foundations',
    q: 'Which function is symmetric with respect to the origin?',
    options: ['f(x) = x³ - 4x', 'f(x) = x⁴ - 2x²', 'f(x) = cos(x)', 'f(x) = e^x'],
    answer: 0,
    pattern: 'Origin Symmetry = Odd Function: f(-x) = -f(x)',
    hint: 'Test f(-x) for each choice. Odd powers of x produce odd functions.',
    steps: [
      {
        title: 'Step 1: Test f(x) = x³ - 4x',
        body: 'f(-x) = (-x)³ - 4(-x) = -x³ + 4x = -(x³ - 4x) = -f(x).'
      },
      {
        title: 'Step 2: Conclude symmetry',
        body: 'Since f(-x) = -f(x), the graph is symmetric with respect to the origin.'
      }
    ]
  },
  {
    id: 'F22',
    topic: 'Functions & Foundations',
    q: 'If tan(θ) = 3/4 with θ in Quadrant III, find cos(θ).',
    options: ['-4/5', '-3/5', '4/5', '3/5'],
    answer: 0,
    pattern: 'Trig Right Triangle & Signs: QIII ⟹ sin < 0, cos < 0',
    hint: 'In QIII, x is negative and y is negative. Hypotenuse = √(3² + 4²) = 5.',
    steps: [
      {
        title: 'Step 1: Determine right triangle sides',
        body: 'Opposite = 3, Adjacent = 4 ⟹ Hypotenuse = √(3² + 4²) = 5.'
      },
      {
        title: 'Step 2: Apply quadrant sign rule',
        body: 'In Quadrant III, cosine is negative: cos(θ) = -Adjacent / Hypotenuse = -4/5.'
      }
    ]
  },
  {
    id: 'F23',
    topic: 'Functions & Foundations',
    q: 'Find the vertex of the parabola y = 2x² - 8x + 5.',
    options: ['(2, -3)', '(2, 5)', '(-2, 29)', '(4, 5)'],
    answer: 0,
    pattern: 'Vertex x-coordinate Formula: x = -b / (2a)',
    hint: 'For y = ax² + bx + c, x = -(-8)/(2·2) = 2.',
    steps: [
      {
        title: 'Step 1: Calculate x-vertex',
        body: 'x = -b / (2a) = -(-8) / (2 · 2) = 8 / 4 = 2.'
      },
      {
        title: 'Step 2: Calculate y-vertex',
        body: 'y = 2(2)² - 8(2) + 5 = 8 - 16 + 5 = -3.'
      },
      {
        title: 'Step 3: State vertex',
        body: 'The vertex is (2, -3).'
      }
    ]
  },
  {
    id: 'F24',
    topic: 'Functions & Foundations',
    q: 'Evaluate arctan(1) + arcsin(1/2) in radians.',
    options: ['5π / 12', '7π / 12', 'π / 3', 'π / 2'],
    answer: 0,
    pattern: 'Exact Inverse Trig Values: arctan(1) = π/4, arcsin(1/2) = π/6',
    hint: 'arctan(1) = π/4 and arcsin(1/2) = π/6.',
    steps: [
      {
        title: 'Step 1: Evaluate inverse trig terms',
        body: 'arctan(1) = π/4, arcsin(1/2) = π/6.'
      },
      {
        title: 'Step 2: Sum using common denominator',
        body: 'π/4 + π/6 = 3π/12 + 2π/12 = 5π/12.'
      }
    ]
  },

  // --- SECTION 2: LIMITS & CONTINUITY (23 Qs) ---
  {
    id: 'L01',
    topic: 'Limits & Continuity',
    q: 'Evaluate lim (x➔3) [ (x² - 9) / (x - 3) ].',
    options: ['6', '0', 'Undefined', '3'],
    answer: 0,
    pattern: 'Indeterminate Form 0/0: Factor & Cancel Common Terms',
    hint: 'Direct substitution yields 0/0. Factor the numerator x² - 9.',
    steps: [
      {
        title: 'Step 1: Identify indeterminate form',
        body: 'Substituting x = 3 gives (9 - 9)/(3 - 3) = 0/0.'
      },
      {
        title: 'Step 2: Factor difference of squares',
        body: '(x² - 9) = (x - 3)(x + 3)'
      },
      {
        title: 'Step 3: Cancel and evaluate',
        body: 'lim (x➔3) (x + 3) = 3 + 3 = 6.'
      }
    ]
  },
  {
    id: 'L02',
    topic: 'Limits & Continuity',
    q: 'Evaluate lim (x➔0) [ sin(5x) / x ].',
    options: ['5', '1', '0', '1/5'],
    answer: 0,
    pattern: 'Fundamental Trig Limit: lim (u➔0) [ sin(ku)/u ] = k',
    hint: 'Multiply numerator and denominator by 5.',
    steps: [
      {
        title: 'Step 1: Rewrite using known limit',
        body: 'lim (x➔0) 5 · [ sin(5x) / (5x) ]'
      },
      {
        title: 'Step 2: Apply standard limit lim (u➔0) sin(u)/u = 1',
        body: '5 · (1) = 5.'
      }
    ]
  },
  {
    id: 'L03',
    topic: 'Limits & Continuity',
    q: 'Evaluate lim (x➔∞) [ (3x³ - 5x + 2) / (7x³ + 4x² - 1) ].',
    options: ['3/7', '0', '∞', '-2'],
    answer: 0,
    pattern: 'Limits at Infinity: Ratio of highest power coefficients',
    hint: 'Divide numerator and denominator by the highest power of x, which is x³.',
    steps: [
      {
        title: 'Step 1: Divide by x³',
        body: 'lim (x➔∞) [ (3 - 5/x² + 2/x³) / (7 + 4/x - 1/x³) ]'
      },
      {
        title: 'Step 2: Take limit as x ➔ ∞',
        body: '(3 - 0 + 0) / (7 + 0 - 0) = 3/7.'
      }
    ]
  },
  {
    id: 'L04',
    topic: 'Limits & Continuity',
    q: 'Evaluate lim (x➔0) [ (√(x + 4) - 2) / x ].',
    options: ['1/4', '1/2', '0', 'Undefined'],
    answer: 0,
    pattern: 'Conjugate Method: Multiply numerator & denominator by (√(x + 4) + 2)',
    hint: 'Direct substitution gives 0/0. Rationalize the numerator using its conjugate.',
    steps: [
      {
        title: 'Step 1: Multiply by conjugate',
        body: '[ (√(x + 4) - 2)(√(x + 4) + 2) ] / [ x(√(x + 4) + 2) ]'
      },
      {
        title: 'Step 2: Simplify numerator',
        body: '(x + 4 - 4) / [ x(√(x + 4) + 2) ] = x / [ x(√(x + 4) + 2) ]'
      },
      {
        title: 'Step 3: Cancel x and evaluate',
        body: 'lim (x➔0) 1 / (√(x + 4) + 2) = 1 / (2 + 2) = 1/4.'
      }
    ]
  },
  {
    id: 'L05',
    topic: 'Limits & Continuity',
    q: 'Find value of k that makes f(x) continuous at x = 2: f(x) = { (x² - 4)/(x - 2) for x ≠ 2, k for x = 2 }.',
    options: ['k = 4', 'k = 2', 'k = 0', 'k = 8'],
    answer: 0,
    pattern: 'Continuity Condition: lim (x➔c) f(x) = f(c)',
    hint: 'Calculate lim (x➔2) (x² - 4)/(x - 2) and set k equal to that limit.',
    steps: [
      {
        title: 'Step 1: Compute limit as x ➔ 2',
        body: 'lim (x➔2) (x - 2)(x + 2)/(x - 2) = lim (x➔2) (x + 2) = 4.'
      },
      {
        title: 'Step 2: Set k equal to limit for continuity',
        body: 'f(2) = k must equal 4.'
      }
    ]
  },
  {
    id: 'L06',
    topic: 'Limits & Continuity',
    q: 'Evaluate lim (x➔0) [ (1 - cos(x)) / x² ].',
    options: ['1/2', '0', '1', 'Undefined'],
    answer: 0,
    pattern: 'Special Limit / L’Hôpital: 0/0 form ⟹ Apply L’Hôpital twice or trig identity',
    hint: 'Apply L’Hôpital’s rule twice: d/dx(1 - cos x) = sin x, d/dx(x²) = 2x.',
    steps: [
      {
        title: 'Step 1: Apply L’Hôpital’s Rule once',
        body: 'lim (x➔0) sin(x) / (2x)'
      },
      {
        title: 'Step 2: Apply L’Hôpital’s Rule again or standard limit',
        body: '(1/2) · lim (x➔0) [sin(x)/x] = (1/2) · 1 = 1/2.'
      }
    ]
  },
  {
    id: 'L07',
    topic: 'Limits & Continuity',
    q: 'Evaluate lim (x➔1⁺) [ 1 / (x - 1) ].',
    options: ['+∞', '-∞', '0', '1'],
    answer: 0,
    pattern: 'One-Sided Infinite Limit: Positive denominator approaching 0 from right ⟹ +∞',
    hint: 'As x ➔ 1 from the right (e.g. 1.01), x - 1 > 0 and very small.',
    steps: [
      {
        title: 'Step 1: Analyze denominator sign',
        body: 'For x > 1, (x - 1) is small and positive (+0).'
      },
      {
        title: 'Step 2: Evaluate fraction limit',
        body: '1 / (+0) = +∞.'
      }
    ]
  },
  {
    id: 'L08',
    topic: 'Limits & Continuity',
    q: 'Evaluate lim (x➔0) [ (e^(3x) - 1) / x ].',
    options: ['3', '1', '0', 'e³'],
    answer: 0,
    pattern: 'L’Hôpital / Exponential Derivative: d/dx(e^(3x)) = 3e^(3x)',
    hint: 'Substitute x = 0 gives 0/0. Differentiate top and bottom.',
    steps: [
      {
        title: 'Step 1: Check form',
        body: '(e⁰ - 1)/0 = 0/0 (Indeterminate).'
      },
      {
        title: 'Step 2: Apply L’Hôpital’s Rule',
        body: 'lim (x➔0) [ 3 e^(3x) / 1 ] = 3 e⁰ = 3.'
      }
    ]
  },
  {
    id: 'L09',
    topic: 'Limits & Continuity',
    q: 'Use the Squeeze Theorem to find lim (x➔0) [ x² sin(1/x) ].',
    options: ['0', '1', 'Does not exist', '∞'],
    answer: 0,
    pattern: 'Squeeze Theorem: -x² ≤ x² sin(1/x) ≤ x²',
    hint: 'Bounded function sin(1/x) lies between -1 and 1.',
    steps: [
      {
        title: 'Step 1: Establish bounds',
        body: '-1 ≤ sin(1/x) ≤ 1 for all x ≠ 0.'
      },
      {
        title: 'Step 2: Multiply by x² ≥ 0',
        body: '-x² ≤ x² sin(1/x) ≤ x².'
      },
      {
        title: 'Step 3: Apply limit as x ➔ 0',
        body: 'Since lim (-x²) = 0 and lim (x²) = 0, by Squeeze Theorem, lim x² sin(1/x) = 0.'
      }
    ]
  },
  {
    id: 'L10',
    topic: 'Limits & Continuity',
    q: 'Evaluate lim (x➔∞) [ (1 + 2/x)^x ].',
    options: ['e²', 'e', '2', '1'],
    answer: 0,
    pattern: 'Definition of e: lim (x➔∞) (1 + k/x)^x = e^k',
    hint: 'Recall standard exponential limit form lim (1 + a/x)^x = e^a.',
    steps: [
      {
        title: 'Step 1: Identify standard form',
        body: 'Here k = 2 in (1 + k/x)^x.'
      },
      {
        title: 'Step 2: Evaluate limit',
        body: 'lim (x➔∞) (1 + 2/x)^x = e².'
      }
    ]
  },
  {
    id: 'L11',
    topic: 'Limits & Continuity',
    q: 'Find the removable discontinuity (hole) of f(x) = (x² - x - 6) / (x - 3).',
    options: ['(3, 5)', '(3, 0)', '(-2, 0)', 'No hole'],
    answer: 0,
    pattern: 'Hole Coordinates: Factor, cancel, and plug x-value into simplified expression',
    hint: 'Factor numerator as (x - 3)(x + 2). Cancel (x - 3) and evaluate at x = 3.',
    steps: [
      {
        title: 'Step 1: Factor numerator',
        body: 'f(x) = (x - 3)(x + 2) / (x - 3)'
      },
      {
        title: 'Step 2: Cancel common factor',
        body: 'For x ≠ 3, f(x) = x + 2. The hole is at x = 3.'
      },
      {
        title: 'Step 3: Find y-coordinate',
        body: 'y = 3 + 2 = 5. Hole at (3, 5).'
      }
    ]
  },
  {
    id: 'L12',
    topic: 'Limits & Continuity',
    q: 'Evaluate lim (x➔0) [ tan(3x) / tan(2x) ].',
    options: ['3/2', '1', '0', '2/3'],
    answer: 0,
    pattern: 'Trig Ratio Limit: lim (x➔0) tan(ax)/tan(bx) = a/b',
    hint: 'Apply L’Hôpital’s Rule or divide top and bottom by x.',
    steps: [
      {
        title: 'Step 1: Check form',
        body: 'tan(0)/tan(0) = 0/0.'
      },
      {
        title: 'Step 2: Apply L’Hôpital’s Rule',
        body: 'lim (x➔0) [ 3 sec²(3x) / 2 sec²(2x) ] = 3(1)² / 2(1)² = 3/2.'
      }
    ]
  },
  {
    id: 'L13',
    topic: 'Limits & Continuity',
    q: 'Evaluate lim (x➔∞) [ ln(x) / x ].',
    options: ['0', '1', '∞', 'Undefined'],
    answer: 0,
    pattern: 'Growth Rates: Polynomial x grows infinitely faster than ln(x)',
    hint: 'Apply L’Hôpital’s rule for ∞/∞ form.',
    steps: [
      {
        title: 'Step 1: Identify indeterminate form ∞/∞',
        body: 'lim (x➔∞) ln(x) / x = ∞ / ∞.'
      },
      {
        title: 'Step 2: Apply L’Hôpital’s Rule',
        body: 'lim (x➔∞) (1/x) / 1 = lim (x➔∞) (1/x) = 0.'
      }
    ]
  },
  {
    id: 'L14',
    topic: 'Limits & Continuity',
    q: 'Evaluate lim (x➔2) [ (x³ - 8) / (x - 2) ].',
    options: ['12', '4', '8', '0'],
    answer: 0,
    pattern: 'Difference of Cubes: a³ - b³ = (a - b)(a² + ab + b²)',
    hint: 'Factor x³ - 8 as (x - 2)(x² + 2x + 4).',
    steps: [
      {
        title: 'Step 1: Factor numerator',
        body: '(x³ - 8) = (x - 2)(x² + 2x + 4)'
      },
      {
        title: 'Step 2: Cancel (x - 2)',
        body: 'lim (x➔2) (x² + 2x + 4)'
      },
      {
        title: 'Step 3: Evaluate',
        body: '2² + 2(2) + 4 = 4 + 4 + 4 = 12.'
      }
    ]
  },
  {
    id: 'L15',
    topic: 'Limits & Continuity',
    q: 'Evaluate lim (x➔0⁺) [ x · ln(x) ].',
    options: ['0', '-∞', '1', '-1'],
    answer: 0,
    pattern: '0 · ∞ Form: Rewrite as ln(x) / (1/x) and apply L’Hôpital',
    hint: 'Rewrite x · ln(x) as ln(x) / (x⁻¹).',
    steps: [
      {
        title: 'Step 1: Rewrite as quotient',
        body: 'lim (x➔0⁺) [ ln(x) / (1/x) ] (form -∞/∞)'
      },
      {
        title: 'Step 2: Apply L’Hôpital’s Rule',
        body: 'lim (x➔0⁺) [ (1/x) / (-1/x²) ] = lim (x➔0⁺) [ -x ] = 0.'
      }
    ]
  },
  {
    id: 'L16',
    topic: 'Limits & Continuity',
    q: 'Find horizontal asymptotes of f(x) = (4x - 1) / √(x² + 1).',
    options: ['y = 4 and y = -4', 'y = 4 only', 'y = 0', 'No horizontal asymptotes'],
    answer: 0,
    pattern: 'Radical HA Rule: As x ➔ -∞, √(x²) = |x| = -x',
    hint: 'Evaluate limits as x ➔ +∞ and x ➔ -∞ separately.',
    steps: [
      {
        title: 'Step 1: Limit as x ➔ +∞',
        body: '√(x² + 1) ≈ x for x > 0 ⟹ lim (4x)/x = 4.'
      },
      {
        title: 'Step 2: Limit as x ➔ -∞',
        body: '√(x² + 1) ≈ -x for x < 0 ⟹ lim (4x)/(-x) = -4.'
      },
      {
        title: 'Step 3: State asymptotes',
        body: 'y = 4 and y = -4.'
      }
    ]
  },
  {
    id: 'L17',
    topic: 'Limits & Continuity',
    q: 'Which condition is NOT required for f(x) to be continuous at x = a?',
    options: ['f\'(a) exists', 'f(a) is defined', 'lim (x➔a) f(x) exists', 'lim (x➔a) f(x) = f(a)'],
    answer: 0,
    pattern: 'Continuity Definition vs Differentiability',
    hint: 'Continuity does NOT require the derivative to exist (e.g. f(x) = |x| at x=0).',
    steps: [
      {
        title: 'Step 1: Review 3 criteria for continuity',
        body: '1. f(a) is defined. 2. lim (x➔a) f(x) exists. 3. lim f(x) = f(a).'
      },
      {
        title: 'Step 2: Contrast with differentiability',
        body: 'Differentiability f\'(a) is a stronger condition and is not required for continuity.'
      }
    ]
  },
  {
    id: 'L18',
    topic: 'Limits & Continuity',
    q: 'Evaluate lim (x➔π/2) [ (1 - sin(x)) / cos²(x) ].',
    options: ['1/2', '0', '1', 'Undefined'],
    answer: 0,
    pattern: 'Pythagorean Trig Substitution: cos²(x) = 1 - sin²(x)',
    hint: 'Factor cos²(x) as (1 - sin x)(1 + sin x).',
    steps: [
      {
        title: 'Step 1: Rewrite denominator',
        body: 'cos²(x) = 1 - sin²(x) = (1 - sin x)(1 + sin x)'
      },
      {
        title: 'Step 2: Cancel (1 - sin x)',
        body: 'lim (x➔π/2) 1 / (1 + sin x)'
      },
      {
        title: 'Step 3: Evaluate',
        body: '1 / (1 + 1) = 1/2.'
      }
    ]
  },
  {
    id: 'L19',
    topic: 'Limits & Continuity',
    q: 'Evaluate lim (x➔0) [ (x + sin(x)) / x ].',
    options: ['2', '1', '0', 'Undefined'],
    answer: 0,
    pattern: 'Sum Rule: Split into x/x + sin(x)/x',
    hint: 'Split the fraction into 1 + sin(x)/x.',
    steps: [
      {
        title: 'Step 1: Split fraction',
        body: 'lim (x➔0) [ x/x + sin(x)/x ] = lim (x➔0) [ 1 + sin(x)/x ]'
      },
      {
        title: 'Step 2: Apply limit',
        body: '1 + 1 = 2.'
      }
    ]
  },
  {
    id: 'L20',
    topic: 'Limits & Continuity',
    q: 'By the Intermediate Value Theorem (IVT), f(x) = x³ - x - 1 has a root in which interval?',
    options: ['(1, 2)', '(0, 1)', '(-1, 0)', '(2, 3)'],
    answer: 0,
    pattern: 'IVT Rule: Continuous f(x) with f(a) and f(b) of opposite signs ⟹ root in (a, b)',
    hint: 'Test end points: f(1) = 1 - 1 - 1 = -1 < 0 and f(2) = 8 - 2 - 1 = 5 > 0.',
    steps: [
      {
        title: 'Step 1: Evaluate f(1)',
        body: 'f(1) = 1³ - 1 - 1 = -1 (negative)'
      },
      {
        title: 'Step 2: Evaluate f(2)',
        body: 'f(2) = 2³ - 2 - 1 = 5 (positive)'
      },
      {
        title: 'Step 3: Apply IVT',
        body: 'Since f is continuous and changes sign on [1, 2], there exists a root in (1, 2).'
      }
    ]
  },
  {
    id: 'L21',
    topic: 'Limits & Continuity',
    q: 'Evaluate lim (x➔∞) [ x - √(x² - 4x) ].',
    options: ['2', '0', '4', '∞'],
    answer: 0,
    pattern: 'Conjugate at Infinity: Multiply by [x + √(x² - 4x)] / [x + √(x² - 4x)]',
    hint: 'Multiply numerator and denominator by conjugate x + √(x² - 4x).',
    steps: [
      {
        title: 'Step 1: Multiply by conjugate',
        body: '[ x² - (x² - 4x) ] / [ x + √(x² - 4x) ] = 4x / [ x + √(x² - 4x) ]'
      },
      {
        title: 'Step 2: Divide numerator & denominator by x',
        body: '4 / [ 1 + √(1 - 4/x) ]'
      },
      {
        title: 'Step 3: Take limit as x ➔ ∞',
        body: '4 / (1 + 1) = 2.'
      }
    ]
  },
  {
    id: 'L22',
    topic: 'Limits & Continuity',
    q: 'Evaluate lim (x➔0) [ (arctan(x)) / x ].',
    options: ['1', '0', 'π/2', 'Undefined'],
    answer: 0,
    pattern: 'L’Hôpital for Inverse Trig: d/dx(arctan x) = 1/(1 + x²)',
    hint: 'Direct substitution gives 0/0. Differentiate numerator and denominator.',
    steps: [
      {
        title: 'Step 1: Check form 0/0 and apply L’Hôpital',
        body: 'lim (x➔0) [ (1 / (1 + x²)) / 1 ]'
      },
      {
        title: 'Step 2: Evaluate at x = 0',
        body: '1 / (1 + 0) = 1.'
      }
    ]
  },
  {
    id: 'L23',
    topic: 'Limits & Continuity',
    q: 'Find lim (x➔3⁻) [ |x - 3| / (x - 3) ].',
    options: ['-1', '1', '0', 'Does not exist'],
    answer: 0,
    pattern: 'Absolute Value Definition: For x < 3, |x - 3| = -(x - 3)',
    hint: 'Since x approaches 3 from the left, x < 3 so x - 3 is negative.',
    steps: [
      {
        title: 'Step 1: Apply definition of absolute value for x < 3',
        body: '|x - 3| = -(x - 3)'
      },
      {
        title: 'Step 2: Simplify fraction',
        body: '-(x - 3) / (x - 3) = -1.'
      }
    ]
  },

  // --- SECTION 3: DIFFERENTIATION (27 Qs) ---
  {
    id: 'D01',
    topic: 'Differentiation',
    q: 'Find y\' if y = cos²(x) + sin²(x).',
    options: ['0', '-2 sin(x) cos(x)', '2 cos(x) + 2 sin(x)', '2y + 1'],
    answer: 0,
    pattern: 'Pythagorean Identity: cos²(x) + sin²(x) = 1',
    hint: 'Simplify the function before differentiating!',
    steps: [
      {
        title: 'Step 1: Identify Pythagorean trig identity',
        body: 'Recall cos²(x) + sin²(x) = 1 for all x.'
      },
      {
        title: 'Step 2: Simplify function',
        body: 'y = 1'
      },
      {
        title: 'Step 3: Differentiate constant',
        body: 'y\' = d/dx(1) = 0.'
      }
    ]
  },
  {
    id: 'D02',
    topic: 'Differentiation',
    q: 'Find d/dx [ x³ · e^(2x) ].',
    options: ['e^(2x) · x² (3 + 2x)', '3x² · e^(2x)', '2x³ · e^(2x)', 'e^(2x) (x³ + 3x²)'],
    answer: 0,
    pattern: 'Product Rule: d/dx [ u · v ] = u\'v + uv\'',
    hint: 'Set u = x³ and v = e^(2x). Note v\' = 2e^(2x).',
    steps: [
      {
        title: 'Step 1: Identify components',
        body: 'u = x³ ⟹ u\' = 3x²; v = e^(2x) ⟹ v\' = 2 e^(2x).'
      },
      {
        title: 'Step 2: Apply product rule',
        body: 'd/dx = 3x² e^(2x) + x³ (2 e^(2x))'
      },
      {
        title: 'Step 3: Factor out e^(2x) · x²',
        body: '= e^(2x) · x² (3 + 2x).'
      }
    ]
  },
  {
    id: 'D03',
    topic: 'Differentiation',
    q: 'Find dy/dx if x² + y² = 25 at the point (3, 4).',
    options: ['-3/4', '3/4', '-4/3', '4/3'],
    answer: 0,
    pattern: 'Implicit Differentiation: 2x + 2y (dy/dx) = 0',
    hint: 'Differentiate both sides with respect to x, then plug in x = 3 and y = 4.',
    steps: [
      {
        title: 'Step 1: Differentiate implicitly',
        body: 'd/dx(x²) + d/dx(y²) = d/dx(25) ⟹ 2x + 2y (dy/dx) = 0.'
      },
      {
        title: 'Step 2: Isolate dy/dx',
        body: 'dy/dx = -2x / (2y) = -x / y.'
      },
      {
        title: 'Step 3: Substitute (3, 4)',
        body: 'dy/dx = -3/4.'
      }
    ]
  },
  {
    id: 'D04',
    topic: 'Differentiation',
    q: 'Find the derivative of f(x) = ln(cos(x)).',
    options: ['-tan(x)', 'tan(x)', '-cot(x)', '1 / cos(x)'],
    answer: 0,
    pattern: 'Log Chain Rule: d/dx [ ln(u) ] = u\' / u',
    hint: 'Set u = cos(x), so u\' = -sin(x).',
    steps: [
      {
        title: 'Step 1: Apply chain rule for natural log',
        body: 'f\'(x) = d/dx[cos(x)] / cos(x)'
      },
      {
        title: 'Step 2: Substitute derivative of cos(x)',
        body: '= -sin(x) / cos(x) = -tan(x).'
      }
    ]
  },
  {
    id: 'D05',
    topic: 'Differentiation',
    q: 'Find d/dx [ (2x + 1) / (x - 3) ].',
    options: ['-7 / (x - 3)²', '7 / (x - 3)²', '-5 / (x - 3)²', '2 / (x - 3)²'],
    answer: 0,
    pattern: 'Quotient Rule: d/dx [ u / v ] = (u\'v - uv\') / v²',
    hint: 'u = 2x + 1, v = x - 3, u\' = 2, v\' = 1.',
    steps: [
      {
        title: 'Step 1: Apply Quotient Rule formula',
        body: '[ 2(x - 3) - (2x + 1)(1) ] / (x - 3)²'
      },
      {
        title: 'Step 2: Expand numerator',
        body: '[ 2x - 6 - 2x - 1 ] / (x - 3)² = -7 / (x - 3)².'
      }
    ]
  },
  {
    id: 'D06',
    topic: 'Differentiation',
    q: 'Find the slope of the tangent line to y = x · ln(x) at x = e.',
    options: ['2', '1', 'e', '1 + e'],
    answer: 0,
    pattern: 'Tangent Slope = Derivative Evaluated at Point',
    hint: 'Use Product Rule: y\' = 1 · ln(x) + x · (1/x) = ln(x) + 1.',
    steps: [
      {
        title: 'Step 1: Differentiate y = x ln(x)',
        body: 'y\' = ln(x) + x(1/x) = ln(x) + 1.'
      },
      {
        title: 'Step 2: Substitute x = e',
        body: 'y\'(e) = ln(e) + 1 = 1 + 1 = 2.'
      }
    ]
  },
  {
    id: 'D07',
    topic: 'Differentiation',
    q: 'Find d/dx [ arctan(2x) ].',
    options: ['2 / (1 + 4x²)', '1 / (1 + 4x²)', '2 / (1 + 2x²)', '2 / √(1 - 4x²)'],
    answer: 0,
    pattern: 'Arctan Chain Rule: d/dx [ arctan(u) ] = u\' / (1 + u²)',
    hint: 'u = 2x ⟹ u\' = 2 and u² = 4x².',
    steps: [
      {
        title: 'Step 1: Identify inner function u = 2x',
        body: 'u\' = 2 and u² = (2x)² = 4x².'
      },
      {
        title: 'Step 2: Apply formula',
        body: 'd/dx = 2 / (1 + 4x²).'
      }
    ]
  },
  {
    id: 'D08',
    topic: 'Differentiation',
    q: 'Find the second derivative f\'\'(x) of f(x) = x · e^x.',
    options: ['(x + 2) e^x', '(x + 1) e^x', 'x e^x', '2 e^x'],
    answer: 0,
    pattern: 'Higher Order Derivatives: Differentiate twice',
    hint: 'First derivative: f\'(x) = (x + 1)e^x. Differentiate again.',
    steps: [
      {
        title: 'Step 1: Compute first derivative f\'(x)',
        body: 'f\'(x) = 1 · e^x + x · e^x = (x + 1) e^x.'
      },
      {
        title: 'Step 2: Apply product rule to f\'(x)',
        body: 'f\'\'(x) = 1 · e^x + (x + 1) e^x = e^x (1 + x + 1) = (x + 2) e^x.'
      }
    ]
  },
  {
    id: 'D09',
    topic: 'Differentiation',
    q: 'Find d/dx [ 3^x ].',
    options: ['3^x · ln(3)', 'x · 3^(x - 1)', '3^x', '3^x / ln(3)'],
    answer: 0,
    pattern: 'General Exponential Derivative: d/dx [ a^x ] = a^x · ln(a)',
    hint: 'Do not confuse power rule with exponential rule!',
    steps: [
      {
        title: 'Step 1: Recall general base exponential rule',
        body: 'd/dx [ a^x ] = a^x · ln(a).'
      },
      {
        title: 'Step 2: Substitute a = 3',
        body: 'd/dx [ 3^x ] = 3^x · ln(3).'
      }
    ]
  },
  {
    id: 'D10',
    topic: 'Differentiation',
    q: 'Find derivative of y = (x² + 1)⁵.',
    options: ['10x (x² + 1)⁴', '5 (x² + 1)⁴', '5x (x² + 1)⁴', '20x (x² + 1)⁴'],
    answer: 0,
    pattern: 'Power Chain Rule: d/dx [ u^n ] = n u^(n-1) · u\'',
    hint: 'u = x² + 1 ⟹ u\' = 2x.',
    steps: [
      {
        title: 'Step 1: Apply chain rule',
        body: 'dy/dx = 5 (x² + 1)⁴ · d/dx(x² + 1)'
      },
      {
        title: 'Step 2: Substitute inner derivative',
        body: '= 5 (x² + 1)⁴ · (2x) = 10x (x² + 1)⁴.'
      }
    ]
  },
  {
    id: 'D11',
    topic: 'Differentiation',
    q: 'Find d/dx [ arcsin(x) ].',
    options: ['1 / √(1 - x²)', '-1 / √(1 - x²)', '1 / (1 + x²)', '1 / √(x² - 1)'],
    answer: 0,
    pattern: 'Standard Inverse Trig Derivative: d/dx [ arcsin x ] = 1 / √(1 - x²)',
    hint: 'Standard calculus identity for arcsin(x).',
    steps: [
      {
        title: 'Step 1: State standard identity',
        body: 'd/dx [ arcsin(x) ] = 1 / √(1 - x²).'
      }
    ]
  },
  {
    id: 'D12',
    topic: 'Differentiation',
    q: 'Use logarithmic differentiation to find y\' if y = x^x (x > 0).',
    options: ['x^x (1 + ln x)', 'x · x^(x - 1)', 'x^x ln(x)', 'x^x'],
    answer: 0,
    pattern: 'Logarithmic Differentiation: Take ln of both sides when base and exponent vary',
    hint: 'ln(y) = x · ln(x). Differentiate implicitly.',
    steps: [
      {
        title: 'Step 1: Take natural log of both sides',
        body: 'ln(y) = ln(x^x) = x · ln(x)'
      },
      {
        title: 'Step 2: Differentiate implicitly',
        body: '(1/y) y\' = 1 · ln(x) + x(1/x) = ln(x) + 1'
      },
      {
        title: 'Step 3: Multiply by y = x^x',
        body: 'y\' = x^x (1 + ln x).'
      }
    ]
  },
  {
    id: 'D13',
    topic: 'Differentiation',
    q: 'Find dy/dx if y = sec(x).',
    options: ['sec(x) tan(x)', 'sec²(x)', '-sec(x) tan(x)', 'tan²(x)'],
    answer: 0,
    pattern: 'Standard Trig Derivative: d/dx [ sec x ] = sec x tan x',
    hint: 'Recall standard trigonometric derivative rules.',
    steps: [
      {
        title: 'Step 1: State standard derivative',
        body: 'd/dx [ sec(x) ] = sec(x) tan(x).'
      }
    ]
  },
  {
    id: 'D14',
    topic: 'Differentiation',
    q: 'Find dy/dx if y = log₁₀(x² + 1).',
    options: ['2x / [(x² + 1) ln 10]', '2x / (x² + 1)', '1 / [(x² + 1) ln 10]', '2x ln(10) / (x² + 1)'],
    answer: 0,
    pattern: 'General Log Derivative: d/dx [ log_a(u) ] = u\' / [ u ln(a) ]',
    hint: 'u = x² + 1 ⟹ u\' = 2x, and base a = 10.',
    steps: [
      {
        title: 'Step 1: Apply change of base or formula',
        body: 'd/dx [ log₁₀(u) ] = u\' / (u ln 10)'
      },
      {
        title: 'Step 2: Substitute u = x² + 1',
        body: '= 2x / [ (x² + 1) ln 10 ].'
      }
    ]
  },
  {
    id: 'D15',
    topic: 'Differentiation',
    q: 'Find the equation of the normal line to y = x² at x = 1.',
    options: ['y = -1/2 x + 3/2', 'y = 2x - 1', 'y = -2x + 3', 'y = 1/2 x + 1/2'],
    answer: 0,
    pattern: 'Normal Line Rule: Normal slope m_normal = -1 / m_tangent',
    hint: 'Tangent slope m = y\'(1) = 2(1) = 2. So normal slope = -1/2.',
    steps: [
      {
        title: 'Step 1: Find point and tangent slope',
        body: 'At x = 1, y = 1² = 1. Tangent slope m = y\'(1) = 2(1) = 2.'
      },
      {
        title: 'Step 2: Find normal slope',
        body: 'm_normal = -1 / 2.'
      },
      {
        title: 'Step 3: Write line equation',
        body: 'y - 1 = -1/2 (x - 1) ⟹ y = -1/2 x + 1/2 + 1 = -1/2 x + 3/2.'
      }
    ]
  },
  {
    id: 'D16',
    topic: 'Differentiation',
    q: 'Find d/dx [ sin(x³) ].',
    options: ['3x² cos(x³)', 'cos(x³)', '3x² sin(x³)', '-3x² cos(x³)'],
    answer: 0,
    pattern: 'Trig Chain Rule: d/dx [ sin(u) ] = u\' cos(u)',
    hint: 'u = x³ ⟹ u\' = 3x².',
    steps: [
      {
        title: 'Step 1: Apply chain rule',
        body: 'd/dx = cos(x³) · d/dx(x³) = 3x² cos(x³).'
      }
    ]
  },
  {
    id: 'D17',
    topic: 'Differentiation',
    q: 'Find dy/dx if x y = 1.',
    options: ['-1 / x²', '1 / x²', '-y / x', 'both -1/x² and -y/x'],
    answer: 3,
    pattern: 'Implicit / Explicit equivalence: y = 1/x ⟹ y\' = -1/x² = -y/x',
    hint: 'y = 1/x = x⁻¹ ⟹ dy/dx = -x⁻² = -1/x² = -y/x.',
    steps: [
      {
        title: 'Step 1: Solve for y or differentiate implicitly',
        body: 'Explicitly: y = x⁻¹ ⟹ y\' = -1/x².'
      },
      {
        title: 'Step 2: Check implicit form',
        body: '1·y + x y\' = 0 ⟹ y\' = -y/x = -(1/x)/x = -1/x². Both expressions are identical!'
      }
    ]
  },
  {
    id: 'D18',
    topic: 'Differentiation',
    q: 'Find derivative of f(x) = cot(x).',
    options: ['-csc²(x)', 'csc²(x)', '-tan(x)', '-csc(x) cot(x)'],
    answer: 0,
    pattern: 'Standard Trig Derivative: d/dx [ cot x ] = -csc² x',
    hint: 'Standard cotangent derivative rule.',
    steps: [
      {
        title: 'Step 1: State standard derivative',
        body: 'd/dx [ cot(x) ] = -csc²(x).'
      }
    ]
  },
  {
    id: 'D19',
    topic: 'Differentiation',
    q: 'Find d/dx [ 1 / (2x + 3) ].',
    options: ['-2 / (2x + 3)²', '2 / (2x + 3)²', '-1 / (2x + 3)²', '-2 / (2x + 3)'],
    answer: 0,
    pattern: 'Reciprocal Power Rule: d/dx [ (2x+3)⁻¹ ] = -1(2x+3)⁻² · 2',
    hint: 'Rewrite as (2x + 3)⁻¹ and apply chain rule.',
    steps: [
      {
        title: 'Step 1: Rewrite exponent',
        body: 'd/dx [ (2x + 3)⁻¹ ]'
      },
      {
        title: 'Step 2: Apply power chain rule',
        body: '= -1 (2x + 3)⁻² · (2) = -2 / (2x + 3)².'
      }
    ]
  },
  {
    id: 'D20',
    topic: 'Differentiation',
    q: 'Find third derivative d³y/dx³ for y = x⁴ - 2x³ + 5x.',
    options: ['24x - 12', '24x - 6', '12x² - 12x', '24'],
    answer: 0,
    pattern: 'Sequential Derivatives: y\' ➔ y\'\' ➔ y\'\'\'',
    hint: 'Differentiate three times step by step.',
    steps: [
      {
        title: 'Step 1: First derivative',
        body: 'y\' = 4x³ - 6x² + 5'
      },
      {
        title: 'Step 2: Second derivative',
        body: 'y\'\' = 12x² - 12x'
      },
      {
        title: 'Step 3: Third derivative',
        body: 'y\'\'\' = 24x - 12.'
      }
    ]
  },
  {
    id: 'D21',
    topic: 'Differentiation',
    q: 'Find dy/dx if x = t², y = t³.',
    options: ['3/2 t', '2/3 t', '3/2 t²', '3t'],
    answer: 0,
    pattern: 'Parametric Derivative Formula: dy/dx = (dy/dt) / (dx/dt)',
    hint: 'dx/dt = 2t, dy/dt = 3t².',
    steps: [
      {
        title: 'Step 1: Compute parameter derivatives',
        body: 'dx/dt = 2t, dy/dt = 3t²'
      },
      {
        title: 'Step 2: Divide dy/dt by dx/dt',
        body: 'dy/dx = (3t²) / (2t) = 3/2 t.'
      }
    ]
  },
  {
    id: 'D22',
    topic: 'Differentiation',
    q: 'Find derivative of y = sinh(x).',
    options: ['cosh(x)', '-cosh(x)', 'sinh(x)', 'sech²(x)'],
    answer: 0,
    pattern: 'Hyperbolic Derivative: d/dx [ sinh x ] = cosh x (positive sign!)',
    hint: 'Unlike standard trig, d/dx(sinh x) = +cosh x.',
    steps: [
      {
        title: 'Step 1: Recall definition',
        body: 'sinh(x) = (e^x - e^(-x))/2'
      },
      {
        title: 'Step 2: Differentiate',
        body: 'd/dx = (e^x + e^(-x))/2 = cosh(x).'
      }
    ]
  },
  {
    id: 'D23',
    topic: 'Differentiation',
    q: 'Find d/dx [ cos(ln x) ].',
    options: ['-sin(ln x) / x', 'sin(ln x) / x', '-sin(ln x)', '-cos(ln x) / x'],
    answer: 0,
    pattern: 'Chain Rule with Logarithm: d/dx [ cos(u) ] = -sin(u) · u\'',
    hint: 'u = ln(x) ⟹ u\' = 1/x.',
    steps: [
      {
        title: 'Step 1: Apply chain rule',
        body: 'd/dx = -sin(ln x) · d/dx[ln x]'
      },
      {
        title: 'Step 2: Substitute 1/x',
        body: '= -sin(ln x) / x.'
      }
    ]
  },
  {
    id: 'D24',
    topic: 'Differentiation',
    q: 'If f(x) = |x|, what is f\'(0)?',
    options: ['Does not exist', '0', '1', '-1'],
    answer: 0,
    pattern: 'Non-differentiability at Sharp Corners: Left slope ≠ Right slope',
    hint: 'Left-hand derivative is -1, right-hand derivative is +1.',
    steps: [
      {
        title: 'Step 1: Evaluate left limit',
        body: 'lim (h➔0⁻) |0 + h|/h = -h/h = -1.'
      },
      {
        title: 'Step 2: Evaluate right limit',
        body: 'lim (h➔0⁺) |0 + h|/h = h/h = 1.'
      },
      {
        title: 'Step 3: Conclude derivative at x = 0',
        body: 'Since left slope (-1) ≠ right slope (+1), f\'(0) does not exist (corner point).'
      }
    ]
  },
  {
    id: 'D25',
    topic: 'Differentiation',
    q: 'Find d/dx [ e^(x²) ].',
    options: ['2x e^(x²)', 'e^(x²)', 'x e^(x²)', '2e^(x²)'],
    answer: 0,
    pattern: 'Exponential Chain Rule: d/dx [ e^u ] = u\' e^u',
    hint: 'u = x² ⟹ u\' = 2x.',
    steps: [
      {
        title: 'Step 1: Apply chain rule',
        body: 'd/dx = e^(x²) · d/dx(x²) = 2x e^(x²).'
      }
    ]
  },
  {
    id: 'D26',
    topic: 'Differentiation',
    q: 'Find the rate of change of area of a circle with respect to radius r when r = 5.',
    options: ['10π', '25π', '5π', '20π'],
    answer: 0,
    pattern: 'Related Rate / Instantaneous Derivative: A = π r² ⟹ dA/dr = 2π r',
    hint: 'dA/dr = 2π r. Plug in r = 5.',
    steps: [
      {
        title: 'Step 1: Write Area formula',
        body: 'A = π r²'
      },
      {
        title: 'Step 2: Differentiate with respect to r',
        body: 'dA/dr = 2π r'
      },
      {
        title: 'Step 3: Substitute r = 5',
        body: 'dA/dr = 2π(5) = 10π.'
      }
    ]
  },
  {
    id: 'D27',
    topic: 'Differentiation',
    q: 'Find derivative of y = x² · sin(x).',
    options: ['2x sin(x) + x² cos(x)', '2x cos(x)', 'x² cos(x)', '2x sin(x) - x² cos(x)'],
    answer: 0,
    pattern: 'Product Rule: d/dx [ u v ] = u\'v + uv\'',
    hint: 'u = x², v = sin(x).',
    steps: [
      {
        title: 'Step 1: Differentiate components',
        body: 'u\' = 2x, v\' = cos(x)'
      },
      {
        title: 'Step 2: Combine using product rule',
        body: 'y\' = 2x sin(x) + x² cos(x).'
      }
    ]
  },

  // --- SECTION 4: STATIONARY POINTS & CURVE SKETCHING (8 Qs) ---
  {
    id: 'S01',
    topic: 'Stationary Points & Curves',
    q: 'Find the critical points of f(x) = 2x³ - 3x² - 12x + 5.',
    options: ['x = -1 and x = 2', 'x = 1 and x = -2', 'x = 0 and x = 3', 'x = -3 and x = 2'],
    answer: 0,
    pattern: 'Critical Points Condition: Set f\'(x) = 0',
    hint: 'Find f\'(x) = 6x² - 6x - 12 = 0.',
    steps: [
      {
        title: 'Step 1: Find derivative',
        body: 'f\'(x) = 6x² - 6x - 12'
      },
      {
        title: 'Step 2: Factor 6(x² - x - 2) = 0',
        body: '6(x - 2)(x + 1) = 0'
      },
      {
        title: 'Step 3: Solve for x',
        body: 'x = 2 and x = -1.'
      }
    ]
  },
  {
    id: 'S02',
    topic: 'Stationary Points & Curves',
    q: 'Determine the nature of the stationary point at x = 2 for f(x) = 2x³ - 3x² - 12x + 5.',
    options: ['Local Minimum', 'Local Maximum', 'Point of Inflection', 'Saddle Point'],
    answer: 0,
    pattern: 'Second Derivative Test: f\'\'(c) > 0 ⟹ Local Min; f\'\'(c) < 0 ⟹ Local Max',
    hint: 'Find f\'\'(x) = 12x - 6 and evaluate at x = 2.',
    steps: [
      {
        title: 'Step 1: Find second derivative',
        body: 'f\'\'(x) = d/dx(6x² - 6x - 12) = 12x - 6'
      },
      {
        title: 'Step 2: Substitute x = 2',
        body: 'f\'\'(2) = 12(2) - 6 = 18 > 0'
      },
      {
        title: 'Step 3: Conclude local minimum',
        body: 'Since f\'\'(2) > 0, the curve is concave up, so x = 2 is a Local Minimum.'
      }
    ]
  },
  {
    id: 'S03',
    topic: 'Stationary Points & Curves',
    q: 'Find the point of inflection of f(x) = x³ - 6x² + 9x + 1.',
    options: ['(2, 3)', '(2, 1)', '(3, 1)', '(1, 5)'],
    answer: 0,
    pattern: 'Inflection Point Rule: Set f\'\'(x) = 0 where concavity changes',
    hint: 'f\'(x) = 3x² - 12x + 9 ⟹ f\'\'(x) = 6x - 12 = 0.',
    steps: [
      {
        title: 'Step 1: Find second derivative',
        body: 'f\'(x) = 3x² - 12x + 9 ⟹ f\'\'(x) = 6x - 12.'
      },
      {
        title: 'Step 2: Solve f\'\'(x) = 0',
        body: '6x - 12 = 0 ⟹ x = 2.'
      },
      {
        title: 'Step 3: Calculate y-value',
        body: 'f(2) = 2³ - 6(2)² + 9(2) + 1 = 8 - 24 + 18 + 1 = 3. Point is (2, 3).'
      }
    ]
  },
  {
    id: 'S04',
    topic: 'Stationary Points & Curves',
    q: 'Over what interval is f(x) = x³ - 3x concave up?',
    options: ['(0, ∞)', '(-∞, 0)', '(-1, 1)', '(1, ∞)'],
    answer: 0,
    pattern: 'Concavity Rule: Concave up where f\'\'(x) > 0',
    hint: 'f\'\'(x) = 6x. Set 6x > 0.',
    steps: [
      {
        title: 'Step 1: Find second derivative',
        body: 'f\'(x) = 3x² - 3 ⟹ f\'\'(x) = 6x.'
      },
      {
        title: 'Step 2: Solve f\'\'(x) > 0',
        body: '6x > 0 ⟹ x > 0. In interval notation: (0, ∞).'
      }
    ]
  },
  {
    id: 'S05',
    topic: 'Stationary Points & Curves',
    q: 'Find the absolute maximum value of f(x) = x³ - 3x + 2 on the closed interval [0, 2].',
    options: ['4', '2', '0', '3'],
    answer: 0,
    pattern: 'Extreme Value Theorem: Test critical points and interval endpoints',
    hint: 'f\'(x) = 3x² - 3 = 0 ⟹ x = 1 in [0, 2]. Compare f(0), f(1), f(2).',
    steps: [
      {
        title: 'Step 1: Find interior critical points',
        body: '3x² - 3 = 0 ⟹ x = 1 (since x = -1 is outside [0, 2]).'
      },
      {
        title: 'Step 2: Evaluate f at endpoints and critical point',
        body: 'f(0) = 2, f(1) = 1 - 3 + 2 = 0, f(2) = 8 - 6 + 2 = 4.'
      },
      {
        title: 'Step 3: Identify maximum',
        body: 'The absolute maximum value is 4 at x = 2.'
      }
    ]
  },
  {
    id: 'S06',
    topic: 'Stationary Points & Curves',
    q: 'Rolle’s Theorem applies to f(x) = x² - 4x + 3 on [1, 3]. Find c in (1, 3) such that f\'(c) = 0.',
    options: ['c = 2', 'c = 3/2', 'c = 5/2', 'c = 1'],
    answer: 0,
    pattern: 'Rolle’s Theorem: f(a) = f(b) ⟹ ∃ c ∈ (a, b) where f\'(c) = 0',
    hint: 'f(1) = 0 and f(3) = 0. Solve f\'(c) = 2c - 4 = 0.',
    steps: [
      {
        title: 'Step 1: Verify conditions',
        body: 'f(1) = 1 - 4 + 3 = 0 and f(3) = 9 - 12 + 3 = 0.'
      },
      {
        title: 'Step 2: Differentiate and set equal to 0',
        body: 'f\'(x) = 2x - 4 = 0 ⟹ x = 2.'
      },
      {
        title: 'Step 3: Confirm c ∈ (1, 3)',
        body: 'c = 2 is in (1, 3).'
      }
    ]
  },
  {
    id: 'S07',
    topic: 'Stationary Points & Curves',
    q: 'By the Mean Value Theorem (MVT), find c in (0, 2) for f(x) = x².',
    options: ['c = 1', 'c = 1/2', 'c = √2', 'c = 3/2'],
    answer: 0,
    pattern: 'MVT Formula: f\'(c) = [f(b) - f(a)] / (b - a)',
    hint: '[f(2) - f(0)] / (2 - 0) = (4 - 0)/2 = 2. Set 2c = 2.',
    steps: [
      {
        title: 'Step 1: Calculate average rate of change',
        body: '[f(2) - f(0)] / (2 - 0) = (4 - 0) / 2 = 2.'
      },
      {
        title: 'Step 2: Set derivative f\'(c) equal to average rate',
        body: 'f\'(c) = 2c = 2 ⟹ c = 1.'
      }
    ]
  },
  {
    id: 'S08',
    topic: 'Stationary Points & Curves',
    q: 'Which feature occurs at x = 0 for f(x) = x⁴?',
    options: ['Local Minimum with f\'\'(0) = 0', 'Point of Inflection', 'Local Maximum', 'Discontinuity'],
    answer: 0,
    pattern: 'Higher Order Derivative Test: f\'(0)=0, f\'\'(0)=0, f\'\'\'(0)=0, f⁴(0)=24 > 0 ⟹ Min',
    hint: 'x⁴ is U-shaped and non-negative everywhere, reaching its minimum 0 at x = 0.',
    steps: [
      {
        title: 'Step 1: Analyze function values',
        body: 'f(x) = x⁴ ≥ 0 for all x, and f(0) = 0.'
      },
      {
        title: 'Step 2: Check sign change of first derivative',
        body: 'f\'(x) = 4x³. For x < 0, f\' < 0; for x > 0, f\' > 0. So x = 0 is a Local Minimum even though f\'\'(0) = 0.'
      }
    ]
  },

  // --- SECTION 5: INTEGRATION (12 Qs) ---
  {
    id: 'I01',
    topic: 'Integration',
    q: 'Evaluate ∫ (3x² - 2x + 5) dx.',
    options: ['x³ - x² + 5x + C', '6x - 2 + C', 'x³ - 2x² + 5x + C', '3x³ - x² + 5x + C'],
    answer: 0,
    pattern: 'Power Integration Rule: ∫ x^n dx = x^(n+1)/(n+1) + C',
    hint: 'Integrate term by term using power rule.',
    steps: [
      {
        title: 'Step 1: Apply power rule to each term',
        body: '∫ 3x² dx = x³, ∫ -2x dx = -x², ∫ 5 dx = 5x'
      },
      {
        title: 'Step 2: Combine with constant of integration',
        body: 'x³ - x² + 5x + C.'
      }
    ]
  },
  {
    id: 'I02',
    topic: 'Integration',
    q: 'Evaluate ∫ [ x · e^(x²) ] dx.',
    options: ['1/2 e^(x²) + C', 'e^(x²) + C', '2 e^(x²) + C', 'x² e^(x²) + C'],
    answer: 0,
    pattern: 'U-Substitution: Let u = x² ⟹ du = 2x dx',
    hint: 'Notice x dx = (1/2) du.',
    steps: [
      {
        title: 'Step 1: Substitute u = x²',
        body: 'du = 2x dx ⟹ x dx = du / 2.'
      },
      {
        title: 'Step 2: Rewrite integral',
        body: '∫ (1/2) e^u du = 1/2 e^u + C'
      },
      {
        title: 'Step 3: Substitute back u = x²',
        body: '= 1/2 e^(x²) + C.'
      }
    ]
  },
  {
    id: 'I03',
    topic: 'Integration',
    q: 'Evaluate definite integral ∫₀^π sin(x) dx.',
    options: ['2', '0', '1', '-2'],
    answer: 0,
    pattern: 'Fundamental Theorem of Calculus: ∫_a^b f(x) dx = F(b) - F(a)',
    hint: 'Anti-derivative of sin(x) is -cos(x). Evaluate [-cos(π)] - [-cos(0)].',
    steps: [
      {
        title: 'Step 1: Find antiderivative',
        body: '∫ sin(x) dx = -cos(x).'
      },
      {
        title: 'Step 2: Evaluate from 0 to π',
        body: '[-cos(π)] - [-cos(0)] = [-(-1)] - [-1] = 1 + 1 = 2.'
      }
    ]
  },
  {
    id: 'I04',
    topic: 'Integration',
    q: 'Evaluate ∫ x · cos(x) dx using Integration by Parts.',
    options: ['x sin(x) + cos(x) + C', 'x sin(x) - cos(x) + C', '-x sin(x) + cos(x) + C', 'x cos(x) - sin(x) + C'],
    answer: 0,
    pattern: 'Integration by Parts: ∫ u dv = u v - ∫ v du',
    hint: 'Let u = x (du = dx) and dv = cos(x) dx (v = sin(x)).',
    steps: [
      {
        title: 'Step 1: Assign u and dv',
        body: 'u = x ⟹ du = dx; dv = cos(x) dx ⟹ v = sin(x).'
      },
      {
        title: 'Step 2: Apply formula u v - ∫ v du',
        body: 'x sin(x) - ∫ sin(x) dx'
      },
      {
        title: 'Step 3: Integrate remaining term',
        body: '= x sin(x) - (-cos(x)) + C = x sin(x) + cos(x) + C.'
      }
    ]
  },
  {
    id: 'I05',
    topic: 'Integration',
    q: 'Evaluate ∫ [ 1 / (x² + 9) ] dx.',
    options: ['1/3 arctan(x/3) + C', 'arctan(x/3) + C', '1/9 arctan(x/3) + C', 'ln(x² + 9) + C'],
    answer: 0,
    pattern: 'Arctan Integral Formula: ∫ dx / (x² + a²) = (1/a) arctan(x/a) + C',
    hint: 'Here a² = 9 ⟹ a = 3.',
    steps: [
      {
        title: 'Step 1: Identify a = 3',
        body: 'a² = 9 ⟹ a = 3.'
      },
      {
        title: 'Step 2: Apply standard arctan formula',
        body: '1/3 arctan(x/3) + C.'
      }
    ]
  },
  {
    id: 'I06',
    topic: 'Integration',
    q: 'Evaluate ∫₁^e (1/x) dx.',
    options: ['1', 'e', '0', 'ln(e) - 1'],
    answer: 0,
    pattern: 'Natural Log Integral: ∫ (1/x) dx = ln|x|',
    hint: 'Antiderivative is ln|x|. Evaluate ln(e) - ln(1).',
    steps: [
      {
        title: 'Step 1: Antiderivative is ln|x|',
        body: '[ ln|x| ]₁^e'
      },
      {
        title: 'Step 2: Evaluate at limits',
        body: 'ln(e) - ln(1) = 1 - 0 = 1.'
      }
    ]
  },
  {
    id: 'I07',
    topic: 'Integration',
    q: 'Evaluate ∫ tan(x) dx.',
    options: ['-ln|cos x| + C', 'ln|sin x| + C', 'sec² x + C', 'ln|tan x| + C'],
    answer: 0,
    pattern: 'Trig Quotient Integral: ∫ (sin x / cos x) dx = -ln|cos x| + C = ln|sec x| + C',
    hint: 'Rewrite tan(x) = sin(x) / cos(x) and let u = cos(x).',
    steps: [
      {
        title: 'Step 1: Rewrite tan(x) as sin(x)/cos(x)',
        body: '∫ (sin x / cos x) dx'
      },
      {
        title: 'Step 2: Substitute u = cos(x)',
        body: 'du = -sin(x) dx ⟹ ∫ -1/u du = -ln|u| + C'
      },
      {
        title: 'Step 3: Substitute back u = cos(x)',
        body: '= -ln|cos x| + C (or ln|sec x| + C).'
      }
    ]
  },
  {
    id: 'I08',
    topic: 'Integration',
    q: 'Evaluate ∫ [ (2x + 3) / (x² + 3x + 5) ] dx.',
    options: ['ln|x² + 3x + 5| + C', '1/2 ln|x² + 3x + 5| + C', 'arctan(x) + C', '2 ln|x² + 3x + 5| + C'],
    answer: 0,
    pattern: 'Log-Derivative Form: ∫ [ u\' / u ] du = ln|u| + C',
    hint: 'Numerator 2x + 3 is the exact derivative of denominator x² + 3x + 5.',
    steps: [
      {
        title: 'Step 1: Let u = x² + 3x + 5',
        body: 'du = (2x + 3) dx.'
      },
      {
        title: 'Step 2: Integrate du / u',
        body: '∫ du / u = ln|u| + C = ln|x² + 3x + 5| + C.'
      }
    ]
  },
  {
    id: 'I09',
    topic: 'Integration',
    q: 'Evaluate ∫₀¹ x² dx using Riemann Sums / Power rule.',
    options: ['1/3', '1/2', '1', '2/3'],
    answer: 0,
    pattern: 'Definite Power Integration: [x³/3]₀¹ = 1/3 - 0 = 1/3',
    hint: '[x³/3] evaluated from 0 to 1.',
    steps: [
      {
        title: 'Step 1: Antiderivative of x²',
        body: 'x³ / 3'
      },
      {
        title: 'Step 2: Evaluate at limits 1 and 0',
        body: '(1³ / 3) - (0³ / 3) = 1/3.'
      }
    ]
  },
  {
    id: 'I10',
    topic: 'Integration',
    q: 'Find the average value of f(x) = 3x² on [0, 2].',
    options: ['4', '8', '2', '6'],
    answer: 0,
    pattern: 'Average Value Formula: f_avg = (1 / (b - a)) ∫_a^b f(x) dx',
    hint: 'Calculate (1 / (2 - 0)) ∫₀² 3x² dx.',
    steps: [
      {
        title: 'Step 1: Compute definite integral',
        body: '∫₀² 3x² dx = [ x³ ]₀² = 2³ - 0 = 8.'
      },
      {
        title: 'Step 2: Divide by interval length (2 - 0 = 2)',
        body: 'f_avg = 8 / 2 = 4.'
      }
    ]
  },
  {
    id: 'I11',
    topic: 'Integration',
    q: 'Evaluate ∫ [ 1 / √(1 - x²) ] dx.',
    options: ['arcsin(x) + C', 'arctan(x) + C', 'arccos(x) + C', '2 √(1 - x²) + C'],
    answer: 0,
    pattern: 'Standard Inverse Trig Integral: ∫ dx / √(1 - x²) = arcsin x + C',
    hint: 'Standard anti-derivative identity.',
    steps: [
      {
        title: 'Step 1: State standard identity',
        body: '∫ 1 / √(1 - x²) dx = arcsin(x) + C.'
      }
    ]
  },
  {
    id: 'I12',
    topic: 'Integration',
    q: 'Evaluate ∫₀^(π/4) sec²(x) dx.',
    options: ['1', '0', 'π/4', '√2'],
    answer: 0,
    pattern: 'Fundamental Theorem for Secant Squared: ∫ sec² x dx = tan x',
    hint: '[tan x] from 0 to π/4.',
    steps: [
      {
        title: 'Step 1: Find antiderivative',
        body: '∫ sec²(x) dx = tan(x).'
      },
      {
        title: 'Step 2: Evaluate limits',
        body: 'tan(π/4) - tan(0) = 1 - 0 = 1.'
      }
    ]
  },

  // --- SECTION 6: APPLICATIONS OF INTEGRATION (4 Qs) ---
  {
    id: 'A01',
    topic: 'Applications of Integration',
    q: 'Find the area enclosed between y = x² and y = x.',
    options: ['1/6', '1/3', '1/2', '1/12'],
    answer: 0,
    pattern: 'Area Between Curves: A = ∫_a^b [ f_upper(x) - g_lower(x) ] dx',
    hint: 'Intersections at x = 0 and x = 1. On [0, 1], x ≥ x².',
    steps: [
      {
        title: 'Step 1: Find intersection points',
        body: 'x² = x ⟹ x² - x = 0 ⟹ x(x - 1) = 0 ⟹ x = 0 and x = 1.'
      },
      {
        title: 'Step 2: Set up area integral',
        body: 'A = ∫₀¹ (x - x²) dx'
      },
      {
        title: 'Step 3: Integrate and evaluate',
        body: '[ x²/2 - x³/3 ]₀¹ = (1/2 - 1/3) - 0 = 1/6.'
      }
    ]
  },
  {
    id: 'A02',
    topic: 'Applications of Integration',
    q: 'Find the volume of the solid generated by revolving y = √x about the x-axis from x = 0 to x = 4.',
    options: ['8π', '16π', '4π', '32π'],
    answer: 0,
    pattern: 'Disk Method Volume: V = π ∫_a^b [ f(x) ]² dx',
    hint: '[f(x)]² = (√x)² = x.',
    steps: [
      {
        title: 'Step 1: Disk Method formula setup',
        body: 'V = π ∫₀⁴ (√x)² dx = π ∫₀⁴ x dx'
      },
      {
        title: 'Step 2: Integrate',
        body: 'π [ x² / 2 ]₀⁴ = π (16 / 2 - 0) = 8π.'
      }
    ]
  },
  {
    id: 'A03',
    topic: 'Applications of Integration',
    q: 'Find the arc length of y = (2/3) x^(3/2) from x = 0 to x = 3.',
    options: ['14/3', '8/3', '16/3', '7/3'],
    answer: 0,
    pattern: 'Arc Length Formula: L = ∫_a^b √(1 + (dy/dx)²) dx',
    hint: 'dy/dx = x^(1/2) ⟹ (dy/dx)² = x.',
    steps: [
      {
        title: 'Step 1: Compute dy/dx and square it',
        body: 'dy/dx = (2/3)(3/2) x^(1/2) = √x ⟹ (dy/dx)² = x.'
      },
      {
        title: 'Step 2: Set up arc length integral',
        body: 'L = ∫₀³ √(1 + x) dx'
      },
      {
        title: 'Step 3: Integrate using u-sub',
        body: '[ (2/3)(1 + x)^(3/2) ]₀³ = (2/3)(4^(3/2) - 1^(3/2)) = (2/3)(8 - 1) = 14/3.'
      }
    ]
  },
  {
    id: 'A04',
    topic: 'Applications of Integration',
    q: 'Find the volume generated by revolving the region bounded by y = x² and y = 0 from x = 0 to x = 2 about the y-axis (Shell Method).',
    options: ['8π', '16π', '4π', '32π/5'],
    answer: 0,
    pattern: 'Cylindrical Shell Method: V = 2π ∫_a^b x f(x) dx',
    hint: 'V = 2π ∫₀² x (x²) dx = 2π ∫₀² x³ dx.',
    steps: [
      {
        title: 'Step 1: Shell Method setup',
        body: 'V = 2π ∫₀² x · (x²) dx = 2π ∫₀² x³ dx'
      },
      {
        title: 'Step 2: Integrate and evaluate',
        body: '2π [ x⁴ / 4 ]₀² = 2π (16 / 4) = 8π.'
      }
    ]
  },

  // --- SECTION 7: SERIES & SEQUENCES (5 Qs) ---
  {
    id: 'SE01',
    topic: 'Series & Sequences',
    q: 'Find the sum of the infinite geometric series: 4 + 2 + 1 + 1/2 + ...',
    options: ['8', '6', '10', 'Diverges'],
    answer: 0,
    pattern: 'Infinite Geometric Series Sum: S = a / (1 - r) for |r| < 1',
    hint: 'First term a = 4, common ratio r = 1/2.',
    steps: [
      {
        title: 'Step 1: Identify a and r',
        body: 'a = 4, r = 2/4 = 1/2.'
      },
      {
        title: 'Step 2: Apply formula S = a / (1 - r)',
        body: 'S = 4 / (1 - 1/2) = 4 / (1/2) = 8.'
      }
    ]
  },
  {
    id: 'SE02',
    topic: 'Series & Sequences',
    q: 'By the Ratio Test, the series ∑ (x^n / n!) converges for what values of x?',
    options: ['All real numbers (-∞, ∞)', '(-1, 1)', 'x = 0 only', '[-1, 1]'],
    answer: 0,
    pattern: 'Ratio Test: L = lim |a_(n+1) / a_n| < 1 for convergence',
    hint: 'lim (n➔∞) |x / (n + 1)| = 0 < 1 for all x.',
    steps: [
      {
        title: 'Step 1: Set up ratio |a_(n+1) / a_n|',
        body: '| (x^(n+1) / (n+1)!) · (n! / x^n) | = | x / (n + 1) |'
      },
      {
        title: 'Step 2: Evaluate limit as n ➔ ∞',
        body: 'lim (n➔∞) | x / (n + 1) | = 0 for any real x.'
      },
      {
        title: 'Step 3: Apply Ratio Test conclusion',
        body: 'Since L = 0 < 1 everywhere, the series converges for all real numbers x ∈ (-∞, ∞).'
      }
    ]
  },
  {
    id: 'SE03',
    topic: 'Series & Sequences',
    q: 'Find the first 3 terms of the Maclaurin series for f(x) = e^x.',
    options: ['1 + x + x²/2', '1 + x + x²', 'x + x²/2 + x³/6', '1 - x + x²/2'],
    answer: 0,
    pattern: 'Maclaurin Expansion: f(x) = f(0) + f\'(0)x + f\'\'(0)x²/2! + ...',
    hint: 'All derivatives of e^x evaluated at x = 0 equal 1.',
    steps: [
      {
        title: 'Step 1: Evaluate derivatives at 0',
        body: 'f(0) = 1, f\'(0) = 1, f\'\'(0) = 1.'
      },
      {
        title: 'Step 2: Substitute into formula',
        body: '1 + 1·x + 1·x²/2! = 1 + x + x²/2.'
      }
    ]
  },
  {
    id: 'SE04',
    topic: 'Series & Sequences',
    q: 'Determine the convergence of the p-series ∑ (1 / n²).',
    options: ['Converges (p = 2 > 1)', 'Diverges', 'Conditional Convergence', 'Inconclusive'],
    answer: 0,
    pattern: 'p-series Test: ∑ (1 / n^p) converges if p > 1',
    hint: 'p = 2, which is strictly greater than 1.',
    steps: [
      {
        title: 'Step 1: Identify power p',
        body: 'In ∑ 1/n², p = 2.'
      },
      {
        title: 'Step 2: Apply p-series rule',
        body: 'Since p = 2 > 1, the series converges (Euler proved it converges to π²/6).'
      }
    ]
  },
  {
    id: 'SE05',
    topic: 'Series & Sequences',
    q: 'Find the radius of convergence R for ∑ (3^n x^n).',
    options: ['R = 1/3', 'R = 3', 'R = 1', 'R = ∞'],
    answer: 0,
    pattern: 'Root / Ratio Test for Power Series: |3x| < 1 ⟹ |x| < 1/3',
    hint: 'Require lim |3x| < 1 ⟹ |x| < 1/3.',
    steps: [
      {
        title: 'Step 1: Apply Root Test',
        body: 'lim (n➔∞) ∛(|3^n x^n|) = |3x|'
      },
      {
        title: 'Step 2: Set condition < 1',
        body: '|3x| < 1 ⟹ |x| < 1/3.'
      },
      {
        title: 'Step 3: State radius R',
        body: 'Radius of convergence R = 1/3.'
      }
    ]
  },

  // --- SECTION 8: CHALLENGE & ADVANCED PROBLEMS (12 Qs) ---
  {
    id: 'C01',
    topic: 'Challenge & Advanced',
    q: 'Find two non-negative numbers whose sum is 20 such that their product is maximized.',
    options: ['10 and 10', '12 and 8', '15 and 5', '14 and 6'],
    answer: 0,
    pattern: 'Optimization Rule: Equal division maximizes product for fixed sum',
    hint: 'Let numbers be x and 20 - x. Maximize P(x) = x(20 - x) = 20x - x².',
    steps: [
      {
        title: 'Step 1: Set up product function',
        body: 'P(x) = x(20 - x) = 20x - x²'
      },
      {
        title: 'Step 2: Differentiate and find critical point',
        body: 'P\'(x) = 20 - 2x = 0 ⟹ x = 10.'
      },
      {
        title: 'Step 3: State dimensions',
        body: 'The two numbers are 10 and 10 (product = 100).'
      }
    ]
  },
  {
    id: 'C02',
    topic: 'Challenge & Advanced',
    q: 'A 13-ft ladder leans against a vertical wall. If the bottom slides away at 2 ft/s, how fast is the top sliding down when the bottom is 5 ft from the wall?',
    options: ['5/6 ft/s', '12/5 ft/s', '5/12 ft/s', '2 ft/s'],
    answer: 0,
    pattern: 'Pythagorean Related Rates: x² + y² = 13² ⟹ 2x (dx/dt) + 2y (dy/dt) = 0',
    hint: 'When x = 5, y = √(169 - 25) = 12. dx/dt = 2.',
    steps: [
      {
        title: 'Step 1: Identify values at moment',
        body: 'x = 5, y = 12, dx/dt = +2.'
      },
      {
        title: 'Step 2: Differentiate x² + y² = 169',
        body: '2x (dx/dt) + 2y (dy/dt) = 0 ⟹ x (dx/dt) + y (dy/dt) = 0.'
      },
      {
        title: 'Step 3: Solve for dy/dt',
        body: '5(2) + 12(dy/dt) = 0 ⟹ dy/dt = -10/12 = -5/6 ft/s. Speed = 5/6 ft/s down.'
      }
    ]
  },
  {
    id: 'C03',
    topic: 'Challenge & Advanced',
    q: 'Evaluate the improper integral ∫₁^∞ (1 / x²) dx.',
    options: ['1', '∞', '0', '2'],
    answer: 0,
    pattern: 'Improper Integral Limit: lim (b➔∞) [-1/x]₁^b',
    hint: 'lim (b➔∞) [ -1/b - (-1/1) ] = 0 + 1 = 1.',
    steps: [
      {
        title: 'Step 1: Rewrite as limit',
        body: 'lim (b➔∞) ∫₁^b x⁻² dx'
      },
      {
        title: 'Step 2: Antiderivative is -1/x',
        body: 'lim (b➔∞) [ -1/x ]₁^b = lim (b➔∞) [ -1/b + 1 ]'
      },
      {
        title: 'Step 3: Take limit',
        body: '0 + 1 = 1 (Convergent).'
      }
    ]
  },
  {
    id: 'C04',
    topic: 'Challenge & Advanced',
    q: 'Find dy/dx in polar coordinates for r = 2 cos(θ) at θ = π/4.',
    options: ['0', '1', '-1', 'Undefined'],
    answer: 0,
    pattern: 'Polar Slope Formula: dy/dx = (dy/dθ) / (dx/dθ)',
    hint: 'x = r cos θ = 2 cos² θ, y = r sin θ = 2 cos θ sin θ = sin(2θ).',
    steps: [
      {
        title: 'Step 1: Express x and y in terms of θ',
        body: 'x = 2 cos² θ, y = sin(2θ)'
      },
      {
        title: 'Step 2: Differentiate with respect to θ',
        body: 'dx/dθ = -4 cos θ sin θ = -2 sin(2θ); dy/dθ = 2 cos(2θ)'
      },
      {
        title: 'Step 3: Substitute θ = π/4',
        body: 'dy/dθ = 2 cos(π/2) = 0, dx/dθ = -2 sin(π/2) = -2. Slope = 0 / -2 = 0.'
      }
    ]
  },
  {
    id: 'C05',
    topic: 'Challenge & Advanced',
    q: 'Find the area inside the cardioid r = 1 + cos(θ).',
    options: ['3π / 2', 'π', '2π', '3π'],
    answer: 0,
    pattern: 'Polar Area Formula: A = (1/2) ∫_a^b r² dθ',
    hint: 'A = (1/2) ∫₀^(2π) (1 + cos θ)² dθ.',
    steps: [
      {
        title: 'Step 1: Expand integrand',
        body: '(1 + cos θ)² = 1 + 2 cos θ + cos² θ = 1 + 2 cos θ + (1 + cos 2θ)/2 = 3/2 + 2 cos θ + (1/2) cos 2θ'
      },
      {
        title: 'Step 2: Integrate over [0, 2π]',
        body: '(1/2) [ 3/2 θ + 2 sin θ + (1/4) sin 2θ ]₀^(2π)'
      },
      {
        title: 'Step 3: Evaluate',
        body: '(1/2) [ 3/2 (2π) + 0 + 0 ] = 3π / 2.'
      }
    ]
  },
  {
    id: 'C06',
    topic: 'Challenge & Advanced',
    q: 'Evaluate lim (x➔0) [ (x - sin x) / x³ ].',
    options: ['1/6', '0', '1/3', '1'],
    answer: 0,
    pattern: 'Triple L’Hôpital or Taylor Series: sin x = x - x³/6 + x⁵/120...',
    hint: 'x - sin x = x - (x - x³/6 + ...) = x³/6.',
    steps: [
      {
        title: 'Step 1: Substitute Taylor series for sin x',
        body: 'sin x = x - x³/6 + O(x⁵)'
      },
      {
        title: 'Step 2: Simplify numerator',
        body: 'x - (x - x³/6) = x³/6'
      },
      {
        title: 'Step 3: Divide by x³ and take limit',
        body: '(x³/6) / x³ = 1/6.'
      }
    ]
  },
  {
    id: 'C07',
    topic: 'Challenge & Advanced',
    q: 'Solve the differential equation dy/dx = y with y(0) = 3.',
    options: ['y = 3 e^x', 'y = e^(3x)', 'y = x³ + 3', 'y = 3 x + 3'],
    answer: 0,
    pattern: 'Separation of Variables: ∫ dy/y = ∫ dx ⟹ ln|y| = x + C ⟹ y = K e^x',
    hint: 'At x = 0, y = 3 ⟹ K = 3.',
    steps: [
      {
        title: 'Step 1: Separate variables',
        body: '1/y dy = 1 dx'
      },
      {
        title: 'Step 2: Integrate both sides',
        body: 'ln|y| = x + C ⟹ y = K e^x'
      },
      {
        title: 'Step 3: Apply initial condition y(0) = 3',
        body: '3 = K e⁰ ⟹ K = 3 ⟹ y = 3 e^x.'
      }
    ]
  },
  {
    id: 'C08',
    topic: 'Challenge & Advanced',
    q: 'Find the maximum area of a rectangle inscribed in the upper half of the unit circle x² + y² = 1 with base on the x-axis.',
    options: ['1', '2', 'π/2', '1/2'],
    answer: 0,
    pattern: 'Circle Inscribed Rectangle Optimization: A(θ) = 2 cos θ sin θ = sin(2θ)',
    hint: 'Vertices at (x, y) = (cos θ, sin θ). Area A = 2x y = sin(2θ). Max is 1 when 2θ = π/2.',
    steps: [
      {
        title: 'Step 1: Express coordinates using angle θ',
        body: 'x = cos θ, y = sin θ for 0 < θ < π/2.'
      },
      {
        title: 'Step 2: Write Area formula',
        body: 'A = 2 x y = 2 cos θ sin θ = sin(2θ).'
      },
      {
        title: 'Step 3: Find maximum of sin(2θ)',
        body: 'The maximum value of sine is 1 (occurring at θ = π/4).'
      }
    ]
  },
  {
    id: 'C09',
    topic: 'Challenge & Advanced',
    q: 'Evaluate the derivative of the integral F(x) = ∫₀^(x²) e^(-t²) dt.',
    options: ['2x e^(-x⁴)', 'e^(-x⁴)', '2x e^(-x²)', 'x e^(-x⁴)'],
    answer: 0,
    pattern: 'Leibniz / Fundamental Theorem Chain Rule: d/dx [ ∫_a^(u(x)) f(t) dt ] = f(u(x)) · u\'(x)',
    hint: 'u = x² ⟹ u\' = 2x. Substitute u into integrand.',
    steps: [
      {
        title: 'Step 1: Identify upper limit u(x) = x²',
        body: 'u\'(x) = 2x.'
      },
      {
        title: 'Step 2: Apply Fundamental Theorem with chain rule',
        body: 'F\'(x) = e^(-(x²)²) · (2x) = 2x e^(-x⁴).'
      }
    ]
  },
  {
    id: 'C10',
    topic: 'Challenge & Advanced',
    q: 'Find curvature κ of the circle x² + y² = R².',
    options: ['1 / R', 'R', '1 / R²', 'R²'],
    answer: 0,
    pattern: 'Curvature of Circle: κ = 1 / radius',
    hint: 'Curvature measures sharp bending; a circle of radius R has constant curvature 1/R.',
    steps: [
      {
        title: 'Step 1: Recall curvature definition for parametrized curve',
        body: 'For r(t) = (R cos t, R sin t), r\'(t) = (-R sin t, R cos t) with speed |r\'| = R.'
      },
      {
        title: 'Step 2: Compute unit tangent derivative |dT/ds|',
        body: 'T(t) = (-sin t, cos t) ⟹ dT/dt = (-cos t, -sin t) ⟹ |dT/dt| = 1.'
      },
      {
        title: 'Step 3: κ = |dT/dt| / |dr/dt|',
        body: 'κ = 1 / R.'
      }
    ]
  },
  {
    id: 'C11',
    topic: 'Challenge & Advanced',
    q: 'Find the Taylor series coefficient of (x - 2)² for f(x) = e^x centered at a = 2.',
    options: ['e² / 2', 'e²', 'e² / 6', '1/2'],
    answer: 0,
    pattern: 'Taylor Coefficient Formula: c_n = f^(n)(a) / n!',
    hint: 'f\'\'(x) = e^x ⟹ f\'\'(2) = e². Coefficient c₂ = e² / 2! = e² / 2.',
    steps: [
      {
        title: 'Step 1: Compute 2nd derivative at a = 2',
        body: 'f\'\'(x) = e^x ⟹ f\'\'(2) = e².'
      },
      {
        title: 'Step 2: Apply Taylor coefficient formula c_n = f^(n)(a)/n!',
        body: 'c₂ = f\'\'(2) / 2! = e² / 2.'
      }
    ]
  },
  {
    id: 'C12',
    topic: 'Challenge & Advanced',
    q: 'Evaluate the limit lim (x➔0) [ (e^x - 1 - x) / x² ].',
    options: ['1/2', '1', '0', '1/6'],
    answer: 0,
    pattern: 'L’Hôpital / Taylor Series: e^x = 1 + x + x²/2 + ...',
    hint: 'e^x - 1 - x = x²/2 + x³/6 + ... Divide by x².',
    steps: [
      {
        title: 'Step 1: Substitute Taylor series for e^x',
        body: 'e^x = 1 + x + x²/2 + x³/6 + ...'
      },
      {
        title: 'Step 2: Simplify numerator',
        body: '(1 + x + x²/2 + ...) - 1 - x = x²/2 + O(x³)'
      },
      {
        title: 'Step 3: Divide by x² and take limit as x ➔ 0',
        body: '(x²/2) / x² = 1/2.'
      }
    ]
  }
];
