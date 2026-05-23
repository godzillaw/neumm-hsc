/**
 * lib/curriculum.ts
 *
 * NESA NSW Mathematics curriculum structured as:
 *   Mission  → the full course for a year+subject combination
 *   Level    → a chapter / major topic area
 *   Stage    → a subsection / lesson within the level
 *
 * Naming convention (Clash-Royale-inspired, but clean):
 *   Mission: "Year 11 Extension 1"
 *   Level 1: "Algebra Review"
 *   Stage 1A: "Expanding Brackets"
 */

// ── Types ──────────────────────────────────────────────────────────────────────

export interface Stage {
  stageId:    string       // e.g. 'y11-ext1-l1-s1a'
  code:       string       // e.g. '1A'
  title:      string       // e.g. 'Expanding Brackets'
  outcomeIds: string[]     // maps to existing outcome_id values (e.g. 'MA-ALG-01')
  topicIds:   string[]     // maps to topic prefixes in mastery_map
  videoHint?: string       // YouTube video ID for concept explanation
  explanation: string      // 2-3 sentence text explanation shown before questions
}

export interface Level {
  levelId:    string
  levelNum:   number
  title:      string       // e.g. 'Algebra Review'
  emoji:      string
  color:      string
  stages:     Stage[]
}

export interface Mission {
  missionId:  string
  title:      string       // e.g. 'Year 11 Extension 1'
  year:       number
  course:     string       // 'standard'|'advanced'|'extension1'|'extension2'|'all'
  shortLabel: string       // e.g. 'Ext 1'
  levels:     Level[]
}

// ── Outcome ID reference (existing in DB) ────────────────────────────────────
// These map to the outcome_id column in the questions table.
// Format: "MA-CALC-D01" (topic prefix) or "MA-CALC-D01-B3" (with band suffix)

// ── YEAR 9 (NSW Stage 5 Mathematics) ─────────────────────────────────────────
const YEAR_9_MISSION: Mission = {
  missionId: 'y9',
  title: 'Year 9 Mathematics',
  year: 9,
  course: 'all',
  shortLabel: 'Yr 9',
  levels: [
    {
      levelId: 'y9-l1', levelNum: 1, title: 'Numbers & Indices', emoji: '🔢', color: '#6366F1',
      stages: [
        {
          stageId: 'y9-l1-s1', code: '1A', title: 'Index Laws',
          outcomeIds: ['MA-ALG-08'], topicIds: ['MA-ALG-08'],
          explanation: 'Index laws let you simplify expressions with powers. Key rules: aᵐ × aⁿ = aᵐ⁺ⁿ, aᵐ ÷ aⁿ = aᵐ⁻ⁿ, (aᵐ)ⁿ = aᵐⁿ.',
        },
        {
          stageId: 'y9-l1-s2', code: '1B', title: 'Surds and Their Arithmetic',
          outcomeIds: ['MA-ALG-08'], topicIds: ['MA-ALG-08'],
          explanation: 'Surds are irrational square roots like √2. You can simplify, add, and multiply surds using the rule √a × √b = √(ab).',
        },
        {
          stageId: 'y9-l1-s3', code: '1C', title: 'Scientific Notation',
          outcomeIds: ['MA-ALG-08'], topicIds: ['MA-ALG-08'],
          explanation: 'Scientific notation expresses very large or small numbers as a × 10ⁿ where 1 ≤ a < 10. This makes calculations with extreme values manageable.',
        },
      ],
    },
    {
      levelId: 'y9-l2', levelNum: 2, title: 'Algebra', emoji: '✏️', color: '#8B5CF6',
      stages: [
        {
          stageId: 'y9-l2-s1', code: '2A', title: 'Expanding Expressions',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'Expanding means removing brackets: a(b+c) = ab + ac. For (a+b)(c+d), use FOIL: multiply each term in the first bracket by each in the second.',
        },
        {
          stageId: 'y9-l2-s2', code: '2B', title: 'Factorising Expressions',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'Factorising reverses expansion. Look for the highest common factor (HCF), difference of squares (a²-b² = (a+b)(a-b)), or trinomial factors.',
        },
        {
          stageId: 'y9-l2-s3', code: '2C', title: 'Algebraic Fractions',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'Algebraic fractions follow the same rules as numeric fractions. To add or subtract, find a common denominator. To multiply, cancel common factors first.',
        },
        {
          stageId: 'y9-l2-s4', code: '2D', title: 'Linear Equations',
          outcomeIds: ['MA-ALG-03'], topicIds: ['MA-ALG-03'],
          explanation: 'To solve a linear equation, isolate the variable by performing the same operation on both sides. Always check your answer by substituting back.',
        },
        {
          stageId: 'y9-l2-s5', code: '2E', title: 'Simultaneous Equations',
          outcomeIds: ['MA-ALG-03'], topicIds: ['MA-ALG-03'],
          explanation: 'Simultaneous equations have two unknowns and two equations. Solve by substitution (rearrange one equation, substitute into the other) or elimination (add/subtract equations).',
        },
      ],
    },
    {
      levelId: 'y9-l3', levelNum: 3, title: 'Geometry & Trigonometry', emoji: '📐', color: '#0EA5E9',
      stages: [
        {
          stageId: 'y9-l3-s1', code: '3A', title: 'Properties of Geometrical Figures',
          outcomeIds: ['MA-COORD-01'], topicIds: ['MA-COORD-01'],
          explanation: 'Geometric figures have properties about their angles and sides. Triangles sum to 180°, quadrilaterals to 360°. Parallel lines create equal alternate and corresponding angles.',
        },
        {
          stageId: 'y9-l3-s2', code: '3B', title: 'Trigonometry Basics (SOH CAH TOA)',
          outcomeIds: ['MA-TRIG-07'], topicIds: ['MA-TRIG-07'],
          explanation: 'In a right triangle: sin(θ) = Opposite/Hypotenuse, cos(θ) = Adjacent/Hypotenuse, tan(θ) = Opposite/Adjacent. Remember SOH CAH TOA!',
          videoHint: 'https://www.youtube.com/results?search_query=SOH+CAH+TOA+explained',
        },
        {
          stageId: 'y9-l3-s3', code: '3C', title: 'Applications of Trigonometry',
          outcomeIds: ['MA-TRIG-08'], topicIds: ['MA-TRIG-08'],
          explanation: 'Trigonometry solves real-world problems involving angles and distances. Identify the given sides/angles, choose the right trig ratio, then solve algebraically.',
        },
      ],
    },
    {
      levelId: 'y9-l4', levelNum: 4, title: 'Statistics & Probability', emoji: '📊', color: '#F59E0B',
      stages: [
        {
          stageId: 'y9-l4-s1', code: '4A', title: 'Data Collection & Display',
          outcomeIds: ['MA-STAT-01'], topicIds: ['MA-STAT-01'],
          explanation: 'Data can be displayed as frequency tables, dot plots, stem-and-leaf plots, or histograms. The choice depends on whether data is categorical or numerical.',
        },
        {
          stageId: 'y9-l4-s2', code: '4B', title: 'Measures of Central Tendency',
          outcomeIds: ['MA-STAT-02'], topicIds: ['MA-STAT-02'],
          explanation: 'Mean = sum ÷ count. Median = middle value when ordered. Mode = most frequent. Outliers affect the mean most, making the median more reliable for skewed data.',
        },
        {
          stageId: 'y9-l4-s3', code: '4C', title: 'Probability',
          outcomeIds: ['MA-PROB-01'], topicIds: ['MA-PROB-01'],
          explanation: 'Probability = (favourable outcomes) ÷ (total outcomes). P(A) + P(not A) = 1. For independent events P(A and B) = P(A) × P(B).',
        },
      ],
    },
  ],
}

// ── YEAR 10 ──────────────────────────────────────────────────────────────────
const YEAR_10_MISSION: Mission = {
  missionId: 'y10',
  title: 'Year 10 Mathematics',
  year: 10,
  course: 'all',
  shortLabel: 'Yr 10',
  levels: [
    {
      levelId: 'y10-l1', levelNum: 1, title: 'Algebra & Quadratics', emoji: '✏️', color: '#8B5CF6',
      stages: [
        {
          stageId: 'y10-l1-s1', code: '1A', title: 'Quadratic Equations',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'Solve quadratics by factorising, completing the square, or the quadratic formula x = (-b ± √(b²-4ac)) / 2a. The discriminant b²-4ac tells you the number of solutions.',
        },
        {
          stageId: 'y10-l1-s2', code: '1B', title: 'Polynomials',
          outcomeIds: ['MA-ALG-04'], topicIds: ['MA-ALG-04'],
          explanation: 'Polynomials are expressions with multiple terms and non-negative integer exponents. Use the remainder theorem and factor theorem to find roots and factorise.',
        },
        {
          stageId: 'y10-l1-s3', code: '1C', title: 'Inequalities',
          outcomeIds: ['MA-ALG-05'], topicIds: ['MA-ALG-05'],
          explanation: 'Solve inequalities like equations, but flip the inequality sign when multiplying or dividing by a negative number. Graph solutions on a number line.',
        },
        {
          stageId: 'y10-l1-s4', code: '1D', title: 'Simultaneous Equations',
          outcomeIds: ['MA-ALG-03'], topicIds: ['MA-ALG-03'],
          explanation: 'For non-linear simultaneous equations, substitute one equation into the other to form a single-variable equation. You may get 0, 1, or 2 solutions.',
        },
      ],
    },
    {
      levelId: 'y10-l2', levelNum: 2, title: 'Functions & Graphs', emoji: '📉', color: '#EC4899',
      stages: [
        {
          stageId: 'y10-l2-s1', code: '2A', title: 'Functions and Relations',
          outcomeIds: ['MA-FUNC-01', 'MA-FUNC-02'], topicIds: ['MA-FUNC-01', 'MA-FUNC-02'],
          explanation: 'A function maps every input to exactly one output. The vertical line test: if any vertical line crosses the graph more than once, it is a relation, not a function.',
        },
        {
          stageId: 'y10-l2-s2', code: '2B', title: 'Quadratic Graphs (Parabolas)',
          outcomeIds: ['MA-ALG-02'], topicIds: ['MA-ALG-02'],
          explanation: 'The parabola y = ax²+bx+c has vertex at x = -b/2a. a > 0 opens upward, a < 0 downward. The x-intercepts are the roots; the y-intercept is at c.',
        },
        {
          stageId: 'y10-l2-s3', code: '2C', title: 'Exponential Functions',
          outcomeIds: ['MA-EXP-01', 'MA-EXP-02'], topicIds: ['MA-EXP-01', 'MA-EXP-02'],
          explanation: 'Exponential functions y = aˣ grow or decay rapidly. a > 1 gives growth; 0 < a < 1 gives decay. The graph always passes through (0, 1) and never crosses the x-axis.',
        },
        {
          stageId: 'y10-l2-s4', code: '2D', title: 'Logarithms',
          outcomeIds: ['MA-EXP-03', 'MA-EXP-04'], topicIds: ['MA-EXP-03', 'MA-EXP-04'],
          explanation: 'log_a(x) is the inverse of aˣ: log_a(aˣ) = x. Key laws: log(AB) = log A + log B, log(A/B) = log A - log B, log(Aⁿ) = n·log A.',
        },
      ],
    },
    {
      levelId: 'y10-l3', levelNum: 3, title: 'Trigonometry', emoji: '〜', color: '#14B8A6',
      stages: [
        {
          stageId: 'y10-l3-s1', code: '3A', title: 'Sine and Cosine Rules',
          outcomeIds: ['MA-TRIG-07'], topicIds: ['MA-TRIG-07'],
          explanation: 'Sine Rule: a/sin A = b/sin B = c/sin C. Cosine Rule: c² = a² + b² − 2ab·cos C. Use sine rule when you know an angle-side pair; cosine rule otherwise.',
        },
        {
          stageId: 'y10-l3-s2', code: '3B', title: 'Trigonometric Graphs',
          outcomeIds: ['MA-TRIG-02'], topicIds: ['MA-TRIG-02'],
          explanation: 'sin x and cos x oscillate between -1 and 1 with period 2π. tan x has period π. Amplitude, period, phase shift, and vertical shift transform these graphs.',
        },
        {
          stageId: 'y10-l3-s3', code: '3C', title: 'Radians',
          outcomeIds: ['MA-TRIG-09'], topicIds: ['MA-TRIG-09'],
          explanation: 'Radians measure angles as arc length / radius. π radians = 180°. To convert: multiply degrees by π/180. Arc length s = rθ, sector area A = ½r²θ.',
        },
      ],
    },
    {
      levelId: 'y10-l4', levelNum: 4, title: 'Statistics & Probability', emoji: '📈', color: '#F97316',
      stages: [
        {
          stageId: 'y10-l4-s1', code: '4A', title: 'Data Analysis & Box Plots',
          outcomeIds: ['MA-STAT-03'], topicIds: ['MA-STAT-03'],
          explanation: 'Box plots display the 5-number summary: min, Q1, median, Q3, max. The IQR = Q3 - Q1 measures spread. Outliers lie more than 1.5 × IQR beyond the quartiles.',
        },
        {
          stageId: 'y10-l4-s2', code: '4B', title: 'Probability & Counting',
          outcomeIds: ['MA-PROB-02'], topicIds: ['MA-PROB-02'],
          explanation: 'Conditional probability P(A|B) = P(A∩B)/P(B). For dependent events, probability changes after each draw. Tree diagrams and tables help organise sample spaces.',
        },
      ],
    },
  ],
}

// ── YEAR 11 STANDARD ─────────────────────────────────────────────────────────
const YEAR_11_STANDARD_MISSION: Mission = {
  missionId: 'y11-std',
  title: 'Year 11 Standard Mathematics',
  year: 11,
  course: 'standard',
  shortLabel: 'Std',
  levels: [
    {
      levelId: 'y11-std-l1', levelNum: 1, title: 'Algebra & Measurement', emoji: '📏', color: '#6366F1',
      stages: [
        {
          stageId: 'y11-std-l1-s1', code: '1A', title: 'Formulae and Equations',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'Formulae express mathematical relationships. To solve for a specific variable, rearrange using inverse operations — doing the same thing to both sides of the equation.',
        },
        {
          stageId: 'y11-std-l1-s2', code: '1B', title: 'Linear Relationships',
          outcomeIds: ['MA-COORD-02'], topicIds: ['MA-COORD-02'],
          explanation: 'A linear equation y = mx + b produces a straight line. m is the gradient (rise/run) and b is the y-intercept. Two points determine a unique line.',
        },
        {
          stageId: 'y11-std-l1-s3', code: '1C', title: 'Applications of Measurement',
          outcomeIds: ['MA-COORD-01'], topicIds: ['MA-COORD-01'],
          explanation: 'Measurement applications include finding perimeter, area, and volume. Always convert all measurements to the same unit before calculating.',
        },
      ],
    },
    {
      levelId: 'y11-std-l2', levelNum: 2, title: 'Financial Mathematics', emoji: '💰', color: '#10B981',
      stages: [
        {
          stageId: 'y11-std-l2-s1', code: '2A', title: 'Simple Interest',
          outcomeIds: ['MA-FIN-01'], topicIds: ['MA-FIN-01'],
          explanation: 'Simple interest I = Prt where P is principal, r is rate per period (as decimal), t is time periods. Total amount A = P + I = P(1 + rt).',
        },
        {
          stageId: 'y11-std-l2-s2', code: '2B', title: 'Compound Interest',
          outcomeIds: ['MA-FIN-02'], topicIds: ['MA-FIN-02'],
          explanation: 'Compound interest A = P(1 + r)ⁿ where r is rate per compounding period and n is the number of periods. Interest grows exponentially — the more frequent the compounding, the more you earn.',
        },
        {
          stageId: 'y11-std-l2-s3', code: '2C', title: 'Earning and Spending',
          outcomeIds: ['MA-FIN-01'], topicIds: ['MA-FIN-01'],
          explanation: 'Financial planning involves understanding income types (salary, wages, commission), taxation, and budgeting. Gross income minus tax equals net income.',
        },
      ],
    },
    {
      levelId: 'y11-std-l3', levelNum: 3, title: 'Statistics & Networks', emoji: '📊', color: '#F59E0B',
      stages: [
        {
          stageId: 'y11-std-l3-s1', code: '3A', title: 'Classifying and Displaying Data',
          outcomeIds: ['MA-STAT-01'], topicIds: ['MA-STAT-01'],
          explanation: 'Categorical data is sorted into groups; numerical data is measured. Displays include bar charts (categorical), histograms (numerical), and dot plots.',
        },
        {
          stageId: 'y11-std-l3-s2', code: '3B', title: 'Summary Statistics',
          outcomeIds: ['MA-STAT-02', 'MA-STAT-03'], topicIds: ['MA-STAT-02', 'MA-STAT-03'],
          explanation: 'Summary statistics describe the centre (mean, median, mode) and spread (range, IQR, standard deviation) of a dataset. Always consider outliers and skewness.',
        },
        {
          stageId: 'y11-std-l3-s3', code: '3C', title: 'Probability',
          outcomeIds: ['MA-PROB-01'], topicIds: ['MA-PROB-01'],
          explanation: 'Experimental probability uses observed frequencies; theoretical probability uses equally likely outcomes. As trials increase, experimental probability approaches theoretical.',
        },
      ],
    },
  ],
}

// ── YEAR 11 ADVANCED ─────────────────────────────────────────────────────────
const YEAR_11_ADVANCED_MISSION: Mission = {
  missionId: 'y11-adv',
  title: 'Year 11 Advanced Mathematics',
  year: 11,
  course: 'advanced',
  shortLabel: 'Adv',
  levels: [
    {
      levelId: 'y11-adv-l0', levelNum: 1, title: 'Algebra Review', emoji: '✏️', color: '#6366F1',
      stages: [
        {
          stageId: 'y11-adv-l0-s1a', code: '1A', title: 'Expanding Expressions',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'Expand brackets by distributing every term: a(b+c) = ab+ac. For two brackets (a+b)(c+d) = ac+ad+bc+bd. Recognise perfect squares (a+b)² = a²+2ab+b² and difference of squares a²−b² = (a+b)(a−b).',
        },
        {
          stageId: 'y11-adv-l0-s1b', code: '1B', title: 'Factorising Expressions',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'Factorise by: (1) taking the highest common factor (HCF), (2) recognising difference of squares a²−b²=(a+b)(a−b), (3) factorising trinomials x²+bx+c=(x+p)(x+q) where p+q=b and pq=c.',
        },
        {
          stageId: 'y11-adv-l0-s1c', code: '1C', title: 'Algebraic Fractions',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'Simplify by factoring numerator and denominator, then cancel common factors. To add/subtract fractions, find the LCD. To multiply, cancel across numerators and denominators before multiplying.',
        },
        {
          stageId: 'y11-adv-l0-s1d', code: '1D', title: 'Solving Quadratic Equations',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'Three methods: (1) Factorise and set each factor to zero. (2) Complete the square: write ax²+bx+c in vertex form. (3) Quadratic formula x = (−b ± √(b²−4ac))/2a. The discriminant Δ=b²−4ac tells you how many real solutions.',
        },
        {
          stageId: 'y11-adv-l0-s1e', code: '1E', title: 'Simultaneous Equations',
          outcomeIds: ['MA-ALG-03'], topicIds: ['MA-ALG-03'],
          explanation: 'Solve two equations with two unknowns using substitution (rearrange one, substitute into the other) or elimination (add/subtract to cancel one variable). Non-linear systems may have 0, 1, or 2 solutions.',
        },
      ],
    },
    {
      levelId: 'y11-adv-l0b', levelNum: 2, title: 'Numbers & Surds', emoji: '🔢', color: '#8B5CF6',
      stages: [
        {
          stageId: 'y11-adv-l0b-s2a', code: '2A', title: 'Real Numbers and Intervals',
          outcomeIds: ['MA-ALG-08'], topicIds: ['MA-ALG-08'],
          explanation: 'Real numbers ℝ include rationals (fractions and decimals) and irrationals (surds, π, e). Intervals: [a,b] includes endpoints (closed), (a,b) excludes them (open). Represent as number lines or set notation.',
        },
        {
          stageId: 'y11-adv-l0b-s2b', code: '2B', title: 'Surds and Their Arithmetic',
          outcomeIds: ['MA-ALG-08'], topicIds: ['MA-ALG-08'],
          explanation: 'A surd is an irrational root like √3. Simplify: √12 = 2√3. Add like surds: 3√2 + 5√2 = 8√2. Multiply: √a × √b = √(ab). Surds give exact answers — always preferred over rounded decimals in exams.',
        },
        {
          stageId: 'y11-adv-l0b-s2c', code: '2C', title: 'Further Simplification of Surds',
          outcomeIds: ['MA-ALG-08'], topicIds: ['MA-ALG-08'],
          explanation: 'Expand surd expressions like (2+√3)² = 4+4√3+3 = 7+4√3. Use the identity (a+√b)(a−√b) = a²−b to produce rational results. Always look for the largest perfect-square factor to simplify surds.',
        },
        {
          stageId: 'y11-adv-l0b-s2d', code: '2D', title: 'Rationalising the Denominator',
          outcomeIds: ['MA-ALG-08'], topicIds: ['MA-ALG-08'],
          explanation: 'Never leave a surd in the denominator. For 1/√a: multiply by √a/√a. For 1/(a+√b): multiply by (a−√b)/(a−√b) — the conjugate. The difference-of-squares identity eliminates the surd.',
        },
      ],
    },
    {
      levelId: 'y11-adv-l1', levelNum: 3, title: 'Functions', emoji: '📐', color: '#0EA5E9',
      stages: [
        {
          stageId: 'y11-adv-l1-s1a', code: '1A', title: 'Functions & Function Notation',
          outcomeIds: ['MA-FUNC-01', 'MA-FUNC-02'], topicIds: ['MA-FUNC-01', 'MA-FUNC-02'],
          explanation: 'A function f maps each input x to exactly one output f(x). Domain is the set of valid inputs; range is the set of outputs. Use the vertical line test to identify functions.',
        },
        {
          stageId: 'y11-adv-l1-s1b', code: '1B', title: 'Linear, Quadratic & Cubic Functions',
          outcomeIds: ['MA-FUNC-07', 'MA-ALG-02'], topicIds: ['MA-FUNC-07', 'MA-ALG-02'],
          explanation: 'Linear functions are straight lines. Quadratics form parabolas with a vertex. Cubics have one or two turning points and an S-shape. Each has characteristic features to identify.',
        },
        {
          stageId: 'y11-adv-l1-s1c', code: '1C', title: 'Inverse Functions',
          outcomeIds: ['MA-FUNC-04'], topicIds: ['MA-FUNC-04'],
          explanation: 'The inverse f⁻¹ reverses the mapping of f: if f(a) = b then f⁻¹(b) = a. Graphically, y = f⁻¹(x) is the reflection of y = f(x) in the line y = x.',
        },
        {
          stageId: 'y11-adv-l1-s1d', code: '1D', title: 'Transformations of Graphs',
          outcomeIds: ['MA-FUNC-05'], topicIds: ['MA-FUNC-05'],
          explanation: 'f(x) + k shifts up by k. f(x-h) shifts right by h. af(x) stretches vertically by a. f(bx) compresses horizontally. Combine transformations for complex graphs.',
        },
        {
          stageId: 'y11-adv-l1-s1e', code: '1E', title: 'Absolute Value Functions',
          outcomeIds: ['MA-FUNC-06'], topicIds: ['MA-FUNC-06'],
          explanation: '|x| = x if x ≥ 0 and -x if x < 0. The graph of y = |f(x)| reflects negative parts above the x-axis. Solve |ax + b| = c by considering both cases.',
        },
      ],
    },
    {
      levelId: 'y11-adv-l2', levelNum: 4, title: 'Trigonometry', emoji: '〜', color: '#14B8A6',
      stages: [
        {
          stageId: 'y11-adv-l2-s2a', code: '2A', title: 'Trigonometric Ratios & Exact Values',
          outcomeIds: ['MA-TRIG-01'], topicIds: ['MA-TRIG-01'],
          explanation: 'Exact values for 30°, 45°, 60°: sin30°=½, cos30°=√3/2, tan30°=1/√3; sin45°=cos45°=1/√2; sin60°=√3/2. These come from special triangles.',
          videoHint: 'https://www.youtube.com/results?search_query=exact+trig+values+NESA',
        },
        {
          stageId: 'y11-adv-l2-s2b', code: '2B', title: 'Radian Measure & Arc Length',
          outcomeIds: ['MA-TRIG-09'], topicIds: ['MA-TRIG-09'],
          explanation: 'Radians: π rad = 180°. Arc length l = rθ, area of sector A = ½r²θ (θ in radians). Working in radians simplifies calculus with trig functions later.',
        },
        {
          stageId: 'y11-adv-l2-s2c', code: '2C', title: 'Graphs of Trig Functions',
          outcomeIds: ['MA-TRIG-02'], topicIds: ['MA-TRIG-02'],
          explanation: 'y = a sin(nx + φ) + d has amplitude |a|, period 2π/n, phase shift -φ/n, and vertical shift d. Sketch by finding key points: peaks, troughs, and zeros.',
        },
        {
          stageId: 'y11-adv-l2-s2d', code: '2D', title: 'Sine Rule & Cosine Rule',
          outcomeIds: ['MA-TRIG-07'], topicIds: ['MA-TRIG-07'],
          explanation: 'Sine Rule: a/sinA = b/sinB = c/sinC. Cosine Rule: a² = b² + c² − 2bc·cos A. Use the sine rule when you have a side-angle pair; the cosine rule when you have three sides or two sides and the included angle.',
        },
      ],
    },
    {
      levelId: 'y11-adv-l3', levelNum: 5, title: 'Exponential & Log Functions', emoji: '📈', color: '#10B981',
      stages: [
        {
          stageId: 'y11-adv-l3-s3a', code: '3A', title: 'Exponential Functions',
          outcomeIds: ['MA-EXP-01', 'MA-EXP-02'], topicIds: ['MA-EXP-01', 'MA-EXP-02'],
          explanation: 'y = aˣ passes through (0,1) with horizontal asymptote y=0. The natural base e ≈ 2.718 is special in calculus: d/dx(eˣ) = eˣ.',
        },
        {
          stageId: 'y11-adv-l3-s3b', code: '3B', title: 'Logarithms & Log Laws',
          outcomeIds: ['MA-EXP-03', 'MA-EXP-04'], topicIds: ['MA-EXP-03', 'MA-EXP-04'],
          explanation: 'log_a(x) undoes aˣ. Key laws: log(AB) = logA + logB; log(A/B) = logA - logB; log(Aⁿ) = n·logA; change of base: log_a(x) = ln(x)/ln(a).',
        },
        {
          stageId: 'y11-adv-l3-s3c', code: '3C', title: 'Natural Logarithm',
          outcomeIds: ['MA-EXP-05'], topicIds: ['MA-EXP-05'],
          explanation: 'ln(x) = log_e(x). It is the inverse of eˣ. Properties: ln(eˣ) = x, e^(ln x) = x. ln grows slowly; eˣ grows rapidly. Both appear constantly in calculus.',
        },
      ],
    },
    {
      levelId: 'y11-adv-l4', levelNum: 6, title: 'Introduction to Calculus', emoji: '∂', color: '#EC4899',
      stages: [
        {
          stageId: 'y11-adv-l4-s4a', code: '4A', title: 'Limits & Differentiation from First Principles',
          outcomeIds: ['MA-CALC-D01'], topicIds: ['MA-CALC-D01'],
          explanation: 'The derivative f\'(x) = lim(h→0) [f(x+h) - f(x)] / h gives the instantaneous rate of change. Geometrically, it is the gradient of the tangent line at x.',
        },
        {
          stageId: 'y11-adv-l4-s4b', code: '4B', title: 'Differentiating Polynomials',
          outcomeIds: ['MA-CALC-D01'], topicIds: ['MA-CALC-D01'],
          explanation: 'Power rule: d/dx(xⁿ) = nxⁿ⁻¹. Sum rule: d/dx[f+g] = f\'+g\'. Constant multiple: d/dx[cf] = c·f\'. These rules let you differentiate any polynomial instantly.',
        },
        {
          stageId: 'y11-adv-l4-s4c', code: '4C', title: 'Product & Quotient Rules',
          outcomeIds: ['MA-CALC-D02'], topicIds: ['MA-CALC-D02'],
          explanation: 'Product rule: (uv)\' = u\'v + uv\'. Quotient rule: (u/v)\' = (u\'v − uv\') / v². Use these when differentiating products or quotients that can\'t be expanded easily.',
        },
        {
          stageId: 'y11-adv-l4-s4d', code: '4D', title: 'Chain Rule',
          outcomeIds: ['MA-CALC-D03'], topicIds: ['MA-CALC-D03'],
          explanation: 'Chain rule: d/dx[f(g(x))] = f\'(g(x)) · g\'(x). Identify the outer and inner functions. Differentiate the outer (leaving inner unchanged), then multiply by the derivative of the inner.',
        },
        {
          stageId: 'y11-adv-l4-s4e', code: '4E', title: 'Tangents & Normals',
          outcomeIds: ['MA-CALC-D07'], topicIds: ['MA-CALC-D07'],
          explanation: 'The tangent to y=f(x) at x=a has gradient f\'(a) and equation y − f(a) = f\'(a)(x − a). The normal is perpendicular: gradient = -1/f\'(a).',
        },
      ],
    },
    {
      levelId: 'y11-adv-l5', levelNum: 7, title: 'Statistics', emoji: '📊', color: '#F59E0B',
      stages: [
        {
          stageId: 'y11-adv-l5-s5a', code: '5A', title: 'Organizing & Displaying Data',
          outcomeIds: ['MA-STAT-01'], topicIds: ['MA-STAT-01'],
          explanation: 'Choose the right display: histograms for continuous data, bar charts for categorical, box plots for comparing distributions. Always label axes and describe shape, centre, and spread.',
        },
        {
          stageId: 'y11-adv-l5-s5b', code: '5B', title: 'Central Tendency & Spread',
          outcomeIds: ['MA-STAT-02', 'MA-STAT-03'], topicIds: ['MA-STAT-02', 'MA-STAT-03'],
          explanation: 'Standard deviation σ measures how spread out data is from the mean. Small σ means data clusters closely; large σ means data is widely spread.',
        },
      ],
    },
  ],
}

// ── YEAR 11 EXTENSION 1 (from the brief screenshot) ──────────────────────────
const YEAR_11_EXT1_MISSION: Mission = {
  missionId: 'y11-ext1',
  title: 'Year 11 Extension 1',
  year: 11,
  course: 'extension1',
  shortLabel: 'Ext 1',
  levels: [
    {
      levelId: 'y11-ext1-l1', levelNum: 1, title: 'Algebra Review', emoji: '✏️', color: '#6366F1',
      stages: [
        {
          stageId: 'y11-ext1-l1-s1a', code: '1A', title: 'Expanding Brackets',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'Expanding brackets removes parentheses by distributing: a(b+c) = ab+ac. For double brackets (a+b)(c+d) = ac+ad+bc+bd. Perfect squares and difference of squares are key patterns.',
        },
        {
          stageId: 'y11-ext1-l1-s1b', code: '1B', title: 'Factoring',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'Factoring is the reverse of expanding. Steps: (1) take out HCF, (2) try difference of squares a²-b²=(a+b)(a-b), (3) try sum/difference of cubes, (4) trial trinomial factoring.',
        },
        {
          stageId: 'y11-ext1-l1-s1c', code: '1C', title: 'Algebraic Fractions',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'Simplify algebraic fractions by factoring numerator and denominator then cancelling common factors. For adding/subtracting, find the LCD; for multiplication/division, cancel then multiply.',
        },
        {
          stageId: 'y11-ext1-l1-s1d', code: '1D', title: 'Solving Quadratic Equations',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'Three methods: (1) Factorise — set each factor to zero. (2) Complete the square. (3) Quadratic formula x = (-b ± √(b²-4ac))/2a. The discriminant b²-4ac gives 2, 1, or 0 real roots.',
        },
        {
          stageId: 'y11-ext1-l1-s1e', code: '1E', title: 'Solving Simultaneous Equations',
          outcomeIds: ['MA-ALG-03'], topicIds: ['MA-ALG-03'],
          explanation: 'Substitution: rearrange one equation and substitute into the other. Elimination: multiply equations to match a coefficient, then add/subtract. For non-linear systems, expect 0, 1, or 2 solutions.',
        },
      ],
    },
    {
      levelId: 'y11-ext1-l2', levelNum: 2, title: 'Numbers and Surds', emoji: '🔢', color: '#8B5CF6',
      stages: [
        {
          stageId: 'y11-ext1-l2-s2a', code: '2A', title: 'Real Numbers and Intervals',
          outcomeIds: ['MA-ALG-08'], topicIds: ['MA-ALG-08'],
          explanation: 'Real numbers include rationals (fractions) and irrationals (surds, π, e). Intervals: [a,b] closed (includes endpoints), (a,b) open (excludes), [a,b) half-open. Represent on a number line.',
        },
        {
          stageId: 'y11-ext1-l2-s2b', code: '2B', title: 'Surds and Their Arithmetic',
          outcomeIds: ['MA-ALG-08'], topicIds: ['MA-ALG-08'],
          explanation: 'Simplify √(ab) = √a × √b. Add like surds: 3√2 + 5√2 = 8√2. Multiply: (a+√b)(a-√b) = a²-b. Surds are exact — keep them unsimplified unless asked for a decimal.',
        },
        {
          stageId: 'y11-ext1-l2-s2c', code: '2C', title: 'Further Simplification of Surds',
          outcomeIds: ['MA-ALG-08'], topicIds: ['MA-ALG-08'],
          explanation: 'Simplify √72 = √(36×2) = 6√2. For products: (2+√3)² = 4 + 4√3 + 3 = 7 + 4√3. Practice identifying perfect square factors to simplify surds to simplest form.',
        },
        {
          stageId: 'y11-ext1-l2-s2d', code: '2D', title: 'Rationalising the Denominator',
          outcomeIds: ['MA-ALG-08'], topicIds: ['MA-ALG-08'],
          explanation: 'Remove surds from denominators. For 1/√a: multiply by √a/√a. For 1/(a+√b): multiply by (a-√b)/(a-√b). The conjugate (a-√b) eliminates the surd using difference of squares.',
        },
      ],
    },
    {
      levelId: 'y11-ext1-l3', levelNum: 3, title: 'Functions and Graphs', emoji: '📈', color: '#0EA5E9',
      stages: [
        {
          stageId: 'y11-ext1-l3-s3a', code: '3A', title: 'Functions and Function Notation',
          outcomeIds: ['MA-FUNC-01', 'MA-FUNC-02'], topicIds: ['MA-FUNC-01', 'MA-FUNC-02'],
          explanation: 'f(x) notation: f(3) means substitute x=3. Domain restrictions: √x needs x≥0; 1/x needs x≠0. Composite functions: (f∘g)(x) = f(g(x)) — apply g first, then f.',
        },
        {
          stageId: 'y11-ext1-l3-s3b', code: '3B', title: 'Functions, Relations, and Graphs',
          outcomeIds: ['MA-FUNC-02'], topicIds: ['MA-FUNC-02'],
          explanation: 'Key graphs to know: y=x² (parabola), y=x³ (cubic), y=1/x (hyperbola), y=√x (half-parabola), y=|x| (V-shape). Identify domain, range, intercepts, asymptotes.',
        },
        {
          stageId: 'y11-ext1-l3-s3c', code: '3C', title: 'Review of Linear Graphs',
          outcomeIds: ['MA-COORD-02'], topicIds: ['MA-COORD-02'],
          explanation: 'y = mx + b: m is gradient (rise/run), b is y-intercept. Find gradient between two points: m = (y₂-y₁)/(x₂-x₁). Parallel lines have equal gradients; perpendicular lines have m₁×m₂ = -1.',
        },
        {
          stageId: 'y11-ext1-l3-s3d', code: '3D', title: 'Quadratic Functions: Factoring and the Graph',
          outcomeIds: ['MA-ALG-02'], topicIds: ['MA-ALG-02'],
          explanation: 'Sketch y = a(x-p)(x-q): x-intercepts at x=p and x=q; axis of symmetry at x=(p+q)/2; vertex at the midpoint. a>0 opens up; a<0 opens down.',
        },
        {
          stageId: 'y11-ext1-l3-s3e', code: '3E', title: 'Completing the Square and the Graph',
          outcomeIds: ['MA-ALG-02'], topicIds: ['MA-ALG-02'],
          explanation: 'Completing the square: ax²+bx+c = a(x+b/2a)²-(b²-4ac)/4a. This gives vertex form y=a(x-h)²+k with vertex (h,k). The turning point is the minimum (a>0) or maximum (a<0).',
        },
        {
          stageId: 'y11-ext1-l3-s3f', code: '3F', title: 'The Quadratic Formula and the Graph',
          outcomeIds: ['MA-ALG-01', 'MA-ALG-02'], topicIds: ['MA-ALG-01', 'MA-ALG-02'],
          explanation: 'Quadratic formula: x = (-b ± √(b²-4ac))/2a. Discriminant Δ = b²-4ac: Δ>0 means 2 real roots, Δ=0 means 1 (touching the x-axis), Δ<0 means no real roots.',
        },
      ],
    },
    {
      levelId: 'y11-ext1-l4', levelNum: 4, title: 'Trigonometric Functions', emoji: '〜', color: '#EC4899',
      stages: [
        {
          stageId: 'y11-ext1-l4-s4a', code: '4A', title: 'Trigonometric Ratios',
          outcomeIds: ['MA-TRIG-01'], topicIds: ['MA-TRIG-01'],
          explanation: 'ASTC rule: All positive in Q1, Sin positive in Q2, Tan positive in Q3, Cos positive in Q4. Reference angle: use the acute angle made with the x-axis.',
        },
        {
          stageId: 'y11-ext1-l4-s4b', code: '4B', title: 'Graphing Trig Functions',
          outcomeIds: ['MA-TRIG-02'], topicIds: ['MA-TRIG-02'],
          explanation: 'y = A sin(Bx + C) + D: amplitude |A|, period 2π/B, phase shift -C/B, vertical shift D. Sketch by plotting 5 key points over one period: start, quarter, half, three-quarter, full period.',
        },
        {
          stageId: 'y11-ext1-l4-s4c', code: '4C', title: 'Inverse Trig Functions',
          outcomeIds: ['MA-TRIG-05'], topicIds: ['MA-TRIG-05'],
          explanation: 'sin⁻¹(x): domain [-1,1], range [-π/2, π/2]. cos⁻¹(x): domain [-1,1], range [0, π]. tan⁻¹(x): domain ℝ, range (-π/2, π/2). Restricted domains ensure each is a true function.',
        },
      ],
    },
    {
      levelId: 'y11-ext1-l5', levelNum: 5, title: 'Calculus', emoji: '∂', color: '#10B981',
      stages: [
        {
          stageId: 'y11-ext1-l5-s5a', code: '5A', title: 'Introduction to Differentiation',
          outcomeIds: ['MA-CALC-D01'], topicIds: ['MA-CALC-D01'],
          explanation: 'The derivative measures instantaneous rate of change. From first principles: f\'(x) = lim[h→0] (f(x+h)-f(x))/h. Power rule: d/dx(xⁿ) = nxⁿ⁻¹.',
        },
        {
          stageId: 'y11-ext1-l5-s5b', code: '5B', title: 'Applications of Differentiation',
          outcomeIds: ['MA-CALC-D07', 'MA-CALC-D08'], topicIds: ['MA-CALC-D07', 'MA-CALC-D08'],
          explanation: 'Find stationary points where f\'(x)=0. Test type: second derivative f\'\'(x) > 0 means minimum, f\'\'(x) < 0 means maximum. For tangent/normal, find gradient at the point.',
        },
        {
          stageId: 'y11-ext1-l5-s5c', code: '5C', title: 'Introduction to Integration',
          outcomeIds: ['MA-CALC-I01', 'MA-CALC-I02'], topicIds: ['MA-CALC-I01', 'MA-CALC-I02'],
          explanation: 'Antidifferentiation reverses differentiation. ∫xⁿ dx = xⁿ⁺¹/(n+1) + C. The definite integral ∫[a to b] f(x) dx gives the signed area between f(x) and the x-axis.',
        },
      ],
    },
  ],
}

// ── YEAR 11 EXTENSION 2 ───────────────────────────────────────────────────────
// Note: NESA Extension 2 is formally a Year 12 course. Students on the Ext 2
// pathway study Year 11 Extension 1 content. This mission mirrors Ext 1 with
// additional enrichment stages and early Ext 2 preview topics.
const YEAR_11_EXT2_MISSION: Mission = {
  missionId: 'y11-ext2',
  title: 'Year 11 Extension 2 Pathway',
  year: 11,
  course: 'extension2',
  shortLabel: 'Ext 2',
  levels: [
    {
      levelId: 'y11-ext2-l1', levelNum: 1, title: 'Algebra Review', emoji: '✏️', color: '#6366F1',
      stages: [
        {
          stageId: 'y11-ext2-l1-s1a', code: '1A', title: 'Expanding & Special Identities',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'Perfect squares: (a±b)² = a²±2ab+b². Difference of squares: a²−b² = (a+b)(a−b). Sum/difference of cubes: a³±b³ = (a±b)(a²∓ab+b²). These patterns are the toolkit for all advanced algebra.',
        },
        {
          stageId: 'y11-ext2-l1-s1b', code: '1B', title: 'Factorising (All Methods)',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'Master all factoring techniques: HCF, difference of squares, sum/difference of cubes, trinomials by inspection, grouping (splitting the middle term). Nested factoring: always take HCF first.',
        },
        {
          stageId: 'y11-ext2-l1-s1c', code: '1C', title: 'Algebraic Fractions & Partial Fractions',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'Simplify, add, subtract, multiply, divide algebraic fractions. Partial fractions decompose A/((x+a)(x+b)) = P/(x+a) + Q/(x+b). Multiply both sides by the denominator and solve for P and Q.',
        },
        {
          stageId: 'y11-ext2-l1-s1d', code: '1D', title: 'Solving Equations & Inequalities',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'Solve quadratic equations by factorising, completing the square, or the quadratic formula. For inequalities, remember to flip the sign when multiplying/dividing by negatives. Sign diagrams help with quadratic inequalities.',
        },
        {
          stageId: 'y11-ext2-l1-s1e', code: '1E', title: 'Simultaneous Equations (Linear & Non-linear)',
          outcomeIds: ['MA-ALG-03'], topicIds: ['MA-ALG-03'],
          explanation: 'Linear: substitution or elimination. Non-linear: substitute the linear into the quadratic/other equation to form a single-variable equation. The discriminant of the resulting quadratic tells you the number of intersection points.',
        },
      ],
    },
    {
      levelId: 'y11-ext2-l2', levelNum: 2, title: 'Numbers & Surds', emoji: '🔢', color: '#8B5CF6',
      stages: [
        {
          stageId: 'y11-ext2-l2-s2a', code: '2A', title: 'Real Numbers, Intervals & Inequalities',
          outcomeIds: ['MA-ALG-08'], topicIds: ['MA-ALG-08'],
          explanation: 'ℝ = rationals ∪ irrationals. Intervals use [a,b] (closed), (a,b) (open), [a,b) (half-open). Number line graphs are essential. Solve compound inequalities: 2 < 3x+1 ≤ 10 by treating each part.',
        },
        {
          stageId: 'y11-ext2-l2-s2b', code: '2B', title: 'Surds: Simplification & Arithmetic',
          outcomeIds: ['MA-ALG-08'], topicIds: ['MA-ALG-08'],
          explanation: 'Simplify surds using largest perfect-square factors: √72 = 6√2. Collect like surds. Expand products using FOIL. The conjugate (a+√b)(a−√b) = a²−b always rationalises and produces an integer.',
        },
        {
          stageId: 'y11-ext2-l2-s2c', code: '2C', title: 'Rationalising Denominators',
          outcomeIds: ['MA-ALG-08'], topicIds: ['MA-ALG-08'],
          explanation: 'For 1/√a: multiply by √a/√a. For 1/(a+√b): multiply by conjugate (a−√b)/(a−√b). For nested surds like 1/(√a+√b): multiply by (√a−√b)/(√a−√b). Final answer must have a rational denominator.',
        },
      ],
    },
    {
      levelId: 'y11-ext2-l3', levelNum: 3, title: 'Functions & Graphs', emoji: '📈', color: '#0EA5E9',
      stages: [
        {
          stageId: 'y11-ext2-l3-s3a', code: '3A', title: 'Functions, Notation & Composition',
          outcomeIds: ['MA-FUNC-01', 'MA-FUNC-02'], topicIds: ['MA-FUNC-01', 'MA-FUNC-02'],
          explanation: 'f(x) maps each x in the domain to exactly one output. Composite: (f∘g)(x) = f(g(x)) — apply g first. Restrict domains to make relations into functions. Range = set of all outputs.',
        },
        {
          stageId: 'y11-ext2-l3-s3b', code: '3B', title: 'Inverse Functions',
          outcomeIds: ['MA-FUNC-04'], topicIds: ['MA-FUNC-04'],
          explanation: 'f⁻¹ reverses f: if f(a)=b then f⁻¹(b)=a. To find f⁻¹: swap x and y, rearrange for y. Graphically, y=f⁻¹(x) is the reflection of y=f(x) in y=x. Only one-to-one functions have inverses.',
        },
        {
          stageId: 'y11-ext2-l3-s3c', code: '3C', title: 'Transformations of Graphs',
          outcomeIds: ['MA-FUNC-05'], topicIds: ['MA-FUNC-05'],
          explanation: 'y=f(x)+k shifts up k. y=f(x−h) shifts right h. y=af(x) stretches vertically by |a|; reflects if a<0. y=f(bx) compresses horizontally by 1/|b|. Apply in the correct order for combined transformations.',
        },
        {
          stageId: 'y11-ext2-l3-s3d', code: '3D', title: 'Quadratic Functions & Parabolas',
          outcomeIds: ['MA-ALG-02'], topicIds: ['MA-ALG-02'],
          explanation: 'Vertex form y=a(x−h)²+k: vertex (h,k), axis x=h. Intercept form y=a(x−p)(x−q): x-intercepts at p,q. Complete the square to convert between standard and vertex form. Key: discriminant determines x-intercept count.',
        },
        {
          stageId: 'y11-ext2-l3-s3e', code: '3E', title: 'Absolute Value & Piecewise Functions',
          outcomeIds: ['MA-FUNC-06'], topicIds: ['MA-FUNC-06'],
          explanation: '|x|=x if x≥0, −x if x<0. Graph y=|f(x)| by reflecting negative parts above x-axis. Solve |ax+b|=c as ax+b=c or ax+b=−c. Piecewise functions use different rules for different x-intervals.',
        },
      ],
    },
    {
      levelId: 'y11-ext2-l4', levelNum: 4, title: 'Trigonometric Functions', emoji: '〜', color: '#EC4899',
      stages: [
        {
          stageId: 'y11-ext2-l4-s4a', code: '4A', title: 'Trig Ratios, ASTC & Exact Values',
          outcomeIds: ['MA-TRIG-01'], topicIds: ['MA-TRIG-01'],
          explanation: 'ASTC (All, Sin, Tan, Cos positive in Q1, Q2, Q3, Q4). Exact values from special triangles: sin30°=½, cos30°=√3/2, sin45°=cos45°=1/√2, sin60°=√3/2. Radians: π=180°.',
        },
        {
          stageId: 'y11-ext2-l4-s4b', code: '4B', title: 'Graphing & Transforming Trig Functions',
          outcomeIds: ['MA-TRIG-02'], topicIds: ['MA-TRIG-02'],
          explanation: 'y=A sin(Bx+C)+D: amplitude |A|, period 2π/|B|, phase shift −C/B, vertical shift D. Mark 5 key points per period: start, peak, midline cross, trough, midline cross. tan has period π, vertical asymptotes where cos=0.',
        },
        {
          stageId: 'y11-ext2-l4-s4c', code: '4C', title: 'Inverse Trig Functions',
          outcomeIds: ['MA-TRIG-05'], topicIds: ['MA-TRIG-05'],
          explanation: 'sin⁻¹: domain [−1,1] range [−π/2,π/2]. cos⁻¹: domain [−1,1] range [0,π]. tan⁻¹: domain ℝ range (−π/2,π/2). Restricted domains make each inverse a true function. Essential for solving trig equations.',
        },
      ],
    },
    {
      levelId: 'y11-ext2-l5', levelNum: 5, title: 'Calculus', emoji: '∂', color: '#10B981',
      stages: [
        {
          stageId: 'y11-ext2-l5-s5a', code: '5A', title: 'Differentiation: First Principles & Rules',
          outcomeIds: ['MA-CALC-D01'], topicIds: ['MA-CALC-D01'],
          explanation: 'First principles: f\'(x) = lim[h→0] (f(x+h)−f(x))/h. Power rule: d/dx(xⁿ)=nxⁿ⁻¹. Product rule: (uv)\'=u\'v+uv\'. Quotient rule: (u/v)\'=(u\'v−uv\')/v². Chain rule: d/dx[f(g(x))]=f\'(g(x))g\'(x).',
        },
        {
          stageId: 'y11-ext2-l5-s5b', code: '5B', title: 'Applications of Differentiation',
          outcomeIds: ['MA-CALC-D07', 'MA-CALC-D08'], topicIds: ['MA-CALC-D07', 'MA-CALC-D08'],
          explanation: 'Tangent at (a, f(a)): gradient m=f\'(a), equation y−f(a)=m(x−a). Normal: gradient −1/f\'(a). Stationary points: f\'(x)=0. Nature: f\'\'(x)>0 (min), f\'\'(x)<0 (max). Optimise by finding and testing critical points.',
        },
        {
          stageId: 'y11-ext2-l5-s5c', code: '5C', title: 'Introduction to Integration',
          outcomeIds: ['MA-CALC-I01', 'MA-CALC-I02'], topicIds: ['MA-CALC-I01', 'MA-CALC-I02'],
          explanation: 'Antidifferentiation reverses differentiation. ∫xⁿ dx = xⁿ⁺¹/(n+1)+C (n≠−1). Definite integral ∫[a,b] f(x) dx = F(b)−F(a) gives signed area. Check: differentiate your answer to verify it gives f(x).',
        },
      ],
    },
    {
      levelId: 'y11-ext2-l6', levelNum: 6, title: 'Exponential & Log Functions', emoji: '📈', color: '#F59E0B',
      stages: [
        {
          stageId: 'y11-ext2-l6-s6a', code: '6A', title: 'Exponential Functions & the Number e',
          outcomeIds: ['MA-EXP-01', 'MA-EXP-02'], topicIds: ['MA-EXP-01', 'MA-EXP-02'],
          explanation: 'y=aˣ: passes through (0,1), horizontal asymptote y=0. The natural base e≈2.718 is defined by d/dx(eˣ)=eˣ — uniquely its own derivative. Exponential growth: A=A₀eᵏᵗ; decay: k<0.',
        },
        {
          stageId: 'y11-ext2-l6-s6b', code: '6B', title: 'Logarithms & Log Laws',
          outcomeIds: ['MA-EXP-03', 'MA-EXP-04'], topicIds: ['MA-EXP-03', 'MA-EXP-04'],
          explanation: 'log_a(x) is the inverse of aˣ. Laws: log(AB)=logA+logB; log(A/B)=logA−logB; log(Aⁿ)=n logA; change of base: log_a(x)=ln(x)/ln(a). ln x = log_e x is the natural log, the most important for calculus.',
        },
        {
          stageId: 'y11-ext2-l6-s6c', code: '6C', title: 'Differentiating & Integrating Exp/Log',
          outcomeIds: ['MA-CALC-D05', 'MA-CALC-I03'], topicIds: ['MA-CALC-D05', 'MA-CALC-I03'],
          explanation: 'd/dx(eˣ)=eˣ; d/dx(ln x)=1/x. By chain rule: d/dx(e^f(x))=e^f(x)f\'(x); d/dx(ln f(x))=f\'(x)/f(x). ∫eˣ dx=eˣ+C; ∫(1/x) dx=ln|x|+C. Recognise f\'(x)/f(x) forms for integration.',
        },
      ],
    },
  ],
}

// ── YEAR 12 ADVANCED ─────────────────────────────────────────────────────────
const YEAR_12_ADVANCED_MISSION: Mission = {
  missionId: 'y12-adv',
  title: 'Year 12 Advanced Mathematics',
  year: 12,
  course: 'advanced',
  shortLabel: 'Adv',
  levels: [
    {
      levelId: 'y12-adv-l1', levelNum: 1, title: 'Graphing Techniques', emoji: '📉', color: '#8B5CF6',
      stages: [
        {
          stageId: 'y12-adv-l1-s1a', code: '1A', title: 'Polynomials & Rational Functions',
          outcomeIds: ['MA-FUNC-07', 'MA-FUNC-08'], topicIds: ['MA-FUNC-07', 'MA-FUNC-08'],
          explanation: 'For rational functions, find vertical asymptotes (denominator = 0), horizontal asymptotes (compare degrees), and intercepts. Sketch by combining this information.',
        },
        {
          stageId: 'y12-adv-l1-s1b', code: '1B', title: 'Limits & Continuity',
          outcomeIds: ['MA-FUNC-09'], topicIds: ['MA-FUNC-09'],
          explanation: 'lim[x→a] f(x) is the value f approaches as x approaches a. If the limit equals f(a), the function is continuous at a. For rational functions, factor to cancel discontinuities.',
        },
      ],
    },
    {
      levelId: 'y12-adv-l2', levelNum: 2, title: 'Trigonometric Functions', emoji: '〜', color: '#0EA5E9',
      stages: [
        {
          stageId: 'y12-adv-l2-s2a', code: '2A', title: 'Trigonometric Identities',
          outcomeIds: ['MA-TRIG-03'], topicIds: ['MA-TRIG-03'],
          explanation: 'Key identities: sin²x + cos²x = 1; tan x = sin x/cos x; 1 + tan²x = sec²x. Compound angles: sin(A±B) = sinA cosB ± cosA sinB. Use these to simplify and solve trig equations.',
        },
        {
          stageId: 'y12-adv-l2-s2b', code: '2B', title: 'Solving Trig Equations',
          outcomeIds: ['MA-TRIG-04'], topicIds: ['MA-TRIG-04'],
          explanation: 'To solve sin(x) = k: find the principal value, then use the symmetry of the unit circle to find all solutions in the given domain. Always check whether to work in degrees or radians.',
        },
      ],
    },
    {
      levelId: 'y12-adv-l3', levelNum: 3, title: 'Calculus: Differentiation', emoji: '∂', color: '#EC4899',
      stages: [
        {
          stageId: 'y12-adv-l3-s3a', code: '3A', title: 'Trig Derivatives',
          outcomeIds: ['MA-CALC-D04'], topicIds: ['MA-CALC-D04'],
          explanation: 'd/dx(sin x) = cos x; d/dx(cos x) = -sin x; d/dx(tan x) = sec²x. For y = sin(f(x)), use chain rule: dy/dx = cos(f(x)) · f\'(x).',
        },
        {
          stageId: 'y12-adv-l3-s3b', code: '3B', title: 'Exponential & Log Derivatives',
          outcomeIds: ['MA-CALC-D05', 'MA-CALC-D06'], topicIds: ['MA-CALC-D05', 'MA-CALC-D06'],
          explanation: 'd/dx(eˣ) = eˣ; d/dx(ln x) = 1/x. For composites: d/dx(e^f(x)) = e^f(x)·f\'(x); d/dx(ln(f(x))) = f\'(x)/f(x). These appear constantly in HSC exam questions.',
        },
        {
          stageId: 'y12-adv-l3-s3c', code: '3C', title: 'Curve Sketching & Optimisation',
          outcomeIds: ['MA-CALC-D08', 'MA-CALC-D09'], topicIds: ['MA-CALC-D08', 'MA-CALC-D09'],
          explanation: 'Full sketch: domain, intercepts, stationary points (f\'=0), nature (f\'\'), inflections (f\'\'=0), asymptotes. Optimisation: model the problem, differentiate, find critical points, test.',
        },
      ],
    },
    {
      levelId: 'y12-adv-l4', levelNum: 4, title: 'Calculus: Integration', emoji: '∫', color: '#10B981',
      stages: [
        {
          stageId: 'y12-adv-l4-s4a', code: '4A', title: 'Integrating Trig, Exp & Log',
          outcomeIds: ['MA-CALC-I03', 'MA-CALC-I04'], topicIds: ['MA-CALC-I03', 'MA-CALC-I04'],
          explanation: '∫sin x dx = -cos x + C; ∫cos x dx = sin x + C; ∫eˣ dx = eˣ + C; ∫(1/x) dx = ln|x| + C. For ∫f\'(x)/f(x) dx = ln|f(x)| + C — recognise this pattern!',
        },
        {
          stageId: 'y12-adv-l4-s4b', code: '4B', title: 'Area Under a Curve',
          outcomeIds: ['MA-CALC-I07'], topicIds: ['MA-CALC-I07'],
          explanation: 'Area = ∫[a to b] f(x) dx when f(x) ≥ 0. For area below the x-axis, take the absolute value. For area between curves, integrate the difference |f(x) - g(x)| over the interval.',
        },
        {
          stageId: 'y12-adv-l4-s4c', code: '4C', title: 'Integration by Substitution',
          outcomeIds: ['MA-CALC-I05'], topicIds: ['MA-CALC-I05'],
          explanation: 'Substitution: let u = g(x), then du = g\'(x)dx. The integral becomes ∫f(u) du which is simpler. Convert limits too for definite integrals. Practice identifying the right substitution.',
        },
      ],
    },
    {
      levelId: 'y12-adv-l5', levelNum: 5, title: 'Statistical Analysis', emoji: '📊', color: '#F59E0B',
      stages: [
        {
          stageId: 'y12-adv-l5-s5a', code: '5A', title: 'Normal Distribution',
          outcomeIds: ['MA-STAT-05'], topicIds: ['MA-STAT-05'],
          explanation: 'Normal distribution is bell-shaped, symmetric about the mean μ. 68% of data lies within 1σ, 95% within 2σ, 99.7% within 3σ. Standardise: Z = (X - μ)/σ to use z-tables.',
          videoHint: 'https://www.youtube.com/results?search_query=normal+distribution+HSC+maths',
        },
        {
          stageId: 'y12-adv-l5-s5b', code: '5B', title: 'Correlation & Regression',
          outcomeIds: ['MA-STAT-04'], topicIds: ['MA-STAT-04'],
          explanation: 'Correlation coefficient r measures linear association (-1 to 1). r close to ±1 means strong association; r ≈ 0 means weak. The least-squares regression line minimises the sum of squared residuals.',
        },
      ],
    },
  ],
}

// ── YEAR 12 EXTENSION 1 ───────────────────────────────────────────────────────
const YEAR_12_EXT1_MISSION: Mission = {
  missionId: 'y12-ext1',
  title: 'Year 12 Extension 1',
  year: 12,
  course: 'extension1',
  shortLabel: 'Ext 1',
  levels: [
    {
      levelId: 'y12-ext1-l1', levelNum: 1, title: 'Proof by Mathematical Induction', emoji: '🔍', color: '#6366F1',
      stages: [
        {
          stageId: 'y12-ext1-l1-s1a', code: '1A', title: 'Proof by Induction',
          outcomeIds: ['MA-EXT-01'], topicIds: ['MA-EXT-01'],
          explanation: 'Induction: (1) Base case — prove true for n=1. (2) Assume true for n=k. (3) Prove true for n=k+1 using the assumption. Conclude true for all positive integers n.',
        },
      ],
    },
    {
      levelId: 'y12-ext1-l2', levelNum: 2, title: 'Vectors', emoji: '→', color: '#0EA5E9',
      stages: [
        {
          stageId: 'y12-ext1-l2-s2a', code: '2A', title: 'Introduction to Vectors',
          outcomeIds: ['MA-EXT-06'], topicIds: ['MA-EXT-06'],
          explanation: 'A vector has both magnitude and direction. Write as boldface a or with arrow ā. Component form: a = (x, y). |a| = √(x²+y²). Add vectors tip-to-tail or by adding components.',
        },
        {
          stageId: 'y12-ext1-l2-s2b', code: '2B', title: 'Dot Product & Applications',
          outcomeIds: ['MA-EXT-06'], topicIds: ['MA-EXT-06'],
          explanation: 'Dot product: a·b = |a||b|cos θ = a₁b₁ + a₂b₂. If a·b = 0, the vectors are perpendicular. Use to find angles between vectors, project one vector onto another.',
        },
      ],
    },
    {
      levelId: 'y12-ext1-l3', levelNum: 3, title: 'Binomial Theorem', emoji: '📐', color: '#EC4899',
      stages: [
        {
          stageId: 'y12-ext1-l3-s3a', code: '3A', title: 'Pascal\'s Triangle & Binomial Coefficients',
          outcomeIds: ['MA-EXT-02'], topicIds: ['MA-EXT-02'],
          explanation: 'ⁿCᵣ = n! / (r!(n-r)!) counts ways to choose r items from n. Pascal\'s triangle gives binomial coefficients. Key identity: ⁿCᵣ + ⁿCᵣ₊₁ = ⁿ⁺¹Cᵣ₊₁.',
        },
        {
          stageId: 'y12-ext1-l3-s3b', code: '3B', title: 'The Binomial Theorem',
          outcomeIds: ['MA-EXT-02'], topicIds: ['MA-EXT-02'],
          explanation: '(a+b)ⁿ = Σᵣ₌₀ⁿ ⁿCᵣ aⁿ⁻ʳ bʳ. The general term is Tᵣ₊₁ = ⁿCᵣ aⁿ⁻ʳ bʳ. To find a specific term, set the power of the wanted variable and solve for r.',
        },
      ],
    },
    {
      levelId: 'y12-ext1-l4', levelNum: 4, title: 'Advanced Calculus', emoji: '∫', color: '#10B981',
      stages: [
        {
          stageId: 'y12-ext1-l4-s4a', code: '4A', title: 'Integration by Parts',
          outcomeIds: ['MA-EXT-03'], topicIds: ['MA-EXT-03'],
          explanation: '∫u dv = uv − ∫v du. Choose u to differentiate (LIATE: Logs, Inverse trig, Algebraic, Trig, Exponential) and dv to integrate. Sometimes apply twice for integrals like ∫eˣsinx dx.',
        },
        {
          stageId: 'y12-ext1-l4-s4b', code: '4B', title: 'Differential Equations',
          outcomeIds: ['MA-EXT-04'], topicIds: ['MA-EXT-04'],
          explanation: 'For separable ODEs dy/dx = f(x)g(y): rearrange to dy/g(y) = f(x)dx, then integrate both sides. For exponential growth/decay: dN/dt = kN gives N = N₀eᵏᵗ.',
        },
      ],
    },
  ],
}

// ── YEAR 12 STANDARD ─────────────────────────────────────────────────────────
const YEAR_12_STANDARD_MISSION: Mission = {
  missionId: 'y12-std',
  title: 'Year 12 Standard Mathematics',
  year: 12,
  course: 'standard',
  shortLabel: 'Std',
  levels: [
    {
      levelId: 'y12-std-l1', levelNum: 1, title: 'Financial Mathematics', emoji: '💰', color: '#10B981',
      stages: [
        {
          stageId: 'y12-std-l1-s1a', code: '1A', title: 'Annuities & Loan Repayments',
          outcomeIds: ['MA-FIN-03', 'MA-FIN-04'], topicIds: ['MA-FIN-03', 'MA-FIN-04'],
          explanation: 'Annuity: a series of equal payments. Future value FV = M × ((1+r)ⁿ - 1)/r. Present value PV = M × (1 - (1+r)⁻ⁿ)/r. Use these formulas for savings plans and mortgages.',
        },
        {
          stageId: 'y12-std-l1-s1b', code: '1B', title: 'Investments & Depreciation',
          outcomeIds: ['MA-FIN-05'], topicIds: ['MA-FIN-05'],
          explanation: 'Straight-line depreciation: value decreases by a fixed amount each year. Reducing balance: V = V₀(1-r)ⁿ decreases by a fixed percentage. Use reducing balance for cars, assets.',
        },
      ],
    },
    {
      levelId: 'y12-std-l2', levelNum: 2, title: 'Statistical Analysis', emoji: '📊', color: '#F59E0B',
      stages: [
        {
          stageId: 'y12-std-l2-s2a', code: '2A', title: 'Normal Distribution',
          outcomeIds: ['MA-STAT-05'], topicIds: ['MA-STAT-05'],
          explanation: 'The normal distribution is bell-shaped with mean μ and standard deviation σ. 68-95-99.7 rule: 68% within 1σ, 95% within 2σ, 99.7% within 3σ of the mean.',
        },
        {
          stageId: 'y12-std-l2-s2b', code: '2B', title: 'Bivariate Data & Correlation',
          outcomeIds: ['MA-STAT-04'], topicIds: ['MA-STAT-04'],
          explanation: 'Scatter plots show relationships. Pearson\'s r measures linear correlation: r=1 perfect positive, r=-1 perfect negative, r=0 no correlation. Regression line predicts y from x.',
        },
      ],
    },
    {
      levelId: 'y12-std-l3', levelNum: 3, title: 'Networks & Paths', emoji: '🕸️', color: '#6366F1',
      stages: [
        {
          stageId: 'y12-std-l3-s3a', code: '3A', title: 'Networks',
          outcomeIds: ['MA-COORD-01'], topicIds: ['MA-COORD-01'],
          explanation: 'A network (graph) has vertices (nodes) and edges (connections). Degree of a vertex = number of edges meeting it. An Euler path traverses each edge exactly once.',
        },
        {
          stageId: 'y12-std-l3-s3b', code: '3B', title: 'Critical Path Analysis',
          outcomeIds: ['MA-COORD-01'], topicIds: ['MA-COORD-01'],
          explanation: 'Critical path analysis finds the minimum project time. Draw an activity network, find earliest start/latest finish times for each activity. The critical path has zero float time.',
        },
      ],
    },
  ],
}

// ── YEAR 12 EXTENSION 2 ───────────────────────────────────────────────────────
const YEAR_12_EXT2_MISSION: Mission = {
  missionId: 'y12-ext2',
  title: 'Year 12 Extension 2',
  year: 12,
  course: 'extension2',
  shortLabel: 'Ext 2',
  levels: [
    {
      levelId: 'y12-ext2-l1', levelNum: 1, title: 'Complex Numbers', emoji: '𝑖', color: '#EC4899',
      stages: [
        {
          stageId: 'y12-ext2-l1-s1a', code: '1A', title: 'Introduction to Complex Numbers',
          outcomeIds: ['MA-EXT-07'], topicIds: ['MA-EXT-07'],
          explanation: 'Complex numbers z = a + bi where i = √(-1). Real part Re(z) = a, imaginary part Im(z) = b. Add by combining real and imaginary parts separately. Conjugate z̄ = a - bi.',
        },
        {
          stageId: 'y12-ext2-l1-s1b', code: '1B', title: 'Argand Diagram & Polar Form',
          outcomeIds: ['MA-EXT-07'], topicIds: ['MA-EXT-07'],
          explanation: 'Plot z = a+bi as point (a,b) on Argand diagram. Modulus |z| = √(a²+b²). Argument arg(z) = tan⁻¹(b/a). Polar form: z = r(cos θ + i sin θ) = re^(iθ).',
        },
        {
          stageId: 'y12-ext2-l1-s1c', code: '1C', title: 'De Moivre\'s Theorem',
          outcomeIds: ['MA-EXT-07'], topicIds: ['MA-EXT-07'],
          explanation: 'De Moivre: (cos θ + i sin θ)ⁿ = cos(nθ) + i sin(nθ). Use to find powers and roots of complex numbers. n-th roots of unity: z^n = 1 has n solutions evenly spaced on unit circle.',
        },
      ],
    },
    {
      levelId: 'y12-ext2-l2', levelNum: 2, title: 'Advanced Mechanics', emoji: '⚡', color: '#F97316',
      stages: [
        {
          stageId: 'y12-ext2-l2-s2a', code: '2A', title: 'Projectile Motion',
          outcomeIds: ['MA-EXT-05'], topicIds: ['MA-EXT-05'],
          explanation: 'Horizontal: no acceleration, x = v₀cos(α)t. Vertical: gravity, y = v₀sin(α)t - ½gt². Eliminate t to get trajectory equation. Maximum range occurs at α = 45° (no air resistance).',
        },
        {
          stageId: 'y12-ext2-l2-s2b', code: '2B', title: 'Simple Harmonic Motion',
          outcomeIds: ['MA-EXT-04'], topicIds: ['MA-EXT-04'],
          explanation: 'SHM: ẍ = -n²x. Solution: x = A cos(nt + φ). Amplitude A, period 2π/n, frequency n/2π. Velocity v = ±n√(A²-x²). Maximum speed at x=0; maximum acceleration at |x|=A.',
        },
      ],
    },
  ],
}

// ── ALL MISSIONS INDEX ────────────────────────────────────────────────────────

const ALL_MISSIONS: Mission[] = [
  YEAR_9_MISSION,
  YEAR_10_MISSION,
  YEAR_11_STANDARD_MISSION,
  YEAR_11_ADVANCED_MISSION,
  YEAR_11_EXT1_MISSION,
  YEAR_11_EXT2_MISSION,
  YEAR_12_STANDARD_MISSION,
  YEAR_12_ADVANCED_MISSION,
  YEAR_12_EXT1_MISSION,
  YEAR_12_EXT2_MISSION,
]

// ── Public API ────────────────────────────────────────────────────────────────

/** Get the mission for a given year + course combination */
export function getMission(year: number, course: string): Mission | null {
  if (year <= 10) {
    return ALL_MISSIONS.find(m => m.year === year) ?? null
  }
  return ALL_MISSIONS.find(m => m.year === year && m.course === course) ?? null
}

/** Get all missions (for admin/debug) */
export function getAllMissions(): Mission[] {
  return ALL_MISSIONS
}

/** Find a specific stage by ID across all missions */
export function findStage(stageId: string): { mission: Mission; level: Level; stage: Stage } | null {
  for (const mission of ALL_MISSIONS) {
    for (const level of mission.levels) {
      const stage = level.stages.find(s => s.stageId === stageId)
      if (stage) return { mission, level, stage }
    }
  }
  return null
}

/** Get all topic/outcome IDs for a given mission (for filtering questions) */
export function getMissionOutcomeIds(mission: Mission): string[] {
  const ids = new Set<string>()
  for (const level of mission.levels) {
    for (const stage of level.stages) {
      for (const id of stage.outcomeIds) ids.add(id)
    }
  }
  return Array.from(ids)
}

/** Course labels for display */
export const COURSE_LABELS: Record<string, string> = {
  all:        'All Topics',
  standard:   'Standard',
  advanced:   'Advanced',
  extension1: 'Extension 1',
  extension2: 'Extension 2',
}

/** Year+course combinations available for selection */
export const YEAR_COURSES: Array<{
  year: number; course: string; label: string; shortLabel: string; missionId: string; available: boolean
}> = [
  { year: 9,  course: 'all',        label: 'Year 9',                   shortLabel: 'Yr 9',    missionId: 'y9',       available: true  },
  { year: 10, course: 'all',        label: 'Year 10',                  shortLabel: 'Yr 10',   missionId: 'y10',      available: true  },
  { year: 11, course: 'standard',   label: 'Year 11 Standard',         shortLabel: '11 Std',  missionId: 'y11-std',  available: true  },
  { year: 11, course: 'advanced',   label: 'Year 11 Advanced',         shortLabel: '11 Adv',  missionId: 'y11-adv',  available: true  },
  { year: 11, course: 'extension1', label: 'Year 11 Extension 1',      shortLabel: '11 Ext1', missionId: 'y11-ext1', available: true  },
  { year: 11, course: 'extension2', label: 'Year 11 Extension 2',      shortLabel: '11 Ext2', missionId: 'y11-ext2', available: true  },
  { year: 12, course: 'standard',   label: 'Year 12 Standard',         shortLabel: '12 Std',  missionId: 'y12-std',  available: true  },
  { year: 12, course: 'advanced',   label: 'Year 12 Advanced',         shortLabel: '12 Adv',  missionId: 'y12-adv',  available: true  },
  { year: 12, course: 'extension1', label: 'Year 12 Extension 1',      shortLabel: '12 Ext1', missionId: 'y12-ext1', available: true  },
  { year: 12, course: 'extension2', label: 'Year 12 Extension 2',      shortLabel: '12 Ext2', missionId: 'y12-ext2', available: true  },
]
