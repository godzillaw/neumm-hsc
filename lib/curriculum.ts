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

/**
 * Structured explanation block — used to build rich "What you'll learn" cards.
 *  text    → a prose paragraph
 *  formula → a display-mode KaTeX formula (latex string) with optional label
 *  rules   → a headed bullet list of key rules / properties
 *  steps   → a numbered step list (e.g. method / algorithm)
 *  example → a worked example with a question and solution steps
 *  tip     → a highlighted "key insight / common mistake" callout
 *  table   → a small header + rows table (e.g. special values)
 */
export type ExplanationBlock =
  | { type: 'text';    body: string }
  | { type: 'formula'; latex: string; label?: string }
  | { type: 'rules';   heading?: string; items: string[] }
  | { type: 'steps';   heading?: string; items: string[] }
  | { type: 'example'; question: string; steps: string[] }
  | { type: 'tip';     body: string }
  | { type: 'table';   headers: string[]; rows: string[][] }

export interface Stage {
  stageId:     string              // e.g. 'y11-ext1-l1-s1a'
  code:        string              // e.g. '1A'
  title:       string              // e.g. 'Expanding Brackets'
  outcomeIds:  string[]            // maps to outcome_id values in DB
  topicIds:    string[]            // maps to topic prefixes in mastery_map
  videoHint?:  string              // YouTube video ID
  explanation: string              // short fallback string (used by AI question generator)
  content?:    ExplanationBlock[]  // rich structured explanation shown in the stage modal
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
    // ── Chapter 1: Algebra ───────────────────────────────────────────────────
    {
      levelId: 'y9-l1', levelNum: 1, title: 'Algebra', emoji: '✏️', color: '#6366F1',
      stages: [
        {
          stageId: 'y9-l1-s1', code: '2A', title: 'Reviewing Algebra',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'Review the language of algebra: terms, coefficients, like terms, and expressions. Simplify by collecting like terms and applying the four operations.',
        },
        {
          stageId: 'y9-l1-s2', code: '2B', title: 'Expanding Expressions',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'Expand brackets using the distributive law: a(b+c) = ab+ac. For double brackets (a+b)(c+d) use FOIL. Perfect squares and difference of squares are key special cases.',
        },
        {
          stageId: 'y9-l1-s3', code: '2C', title: 'Factorising Using the HCF',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'Factorising is the reverse of expanding. Find the highest common factor (HCF) of all terms and place it outside the brackets: 6x² + 9x = 3x(2x + 3).',
        },
        {
          stageId: 'y9-l1-s4', code: '2D', title: 'Factorising the Difference of Two Squares',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'a² − b² = (a+b)(a−b). Recognise perfect squares in both terms, then apply this identity directly. Always check for a common factor before using this formula.',
        },
        {
          stageId: 'y9-l1-s5', code: '2E', title: 'Factorising Trinomials',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'To factorise x² + bx + c, find two numbers that multiply to c and add to b: x² + 5x + 6 = (x+2)(x+3). For ax² + bx + c, use the splitting method.',
        },
        {
          stageId: 'y9-l1-s6', code: '2F', title: 'Algebraic Fractions',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'Simplify algebraic fractions by factorising numerator and denominator and cancelling common factors. Add and subtract by finding the LCD first.',
        },
      ],
    },
    // ── Chapter 2: Equations & Inequalities ─────────────────────────────────
    {
      levelId: 'y9-l2', levelNum: 2, title: 'Equations & Inequalities', emoji: '⚖️', color: '#8B5CF6',
      stages: [
        {
          stageId: 'y9-l2-s1', code: '2G', title: 'Solving Linear Equations',
          outcomeIds: ['MA-ALG-03'], topicIds: ['MA-ALG-03'],
          explanation: 'Isolate the variable by performing inverse operations on both sides. Expand brackets and collect like terms first. Always check your answer by substituting back.',
        },
        {
          stageId: 'y9-l2-s2', code: '2H', title: 'Solving Quadratic Equations',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'Rearrange to ax² + bx + c = 0, then factorise and set each factor to zero, or use the quadratic formula x = (−b ± √(b²−4ac))/2a.',
        },
        {
          stageId: 'y9-l2-s3', code: '2I', title: 'Solving Simultaneous Equations',
          outcomeIds: ['MA-ALG-03'], topicIds: ['MA-ALG-03'],
          explanation: 'Use substitution (rearrange one equation, substitute into the other) or elimination (multiply equations to match a coefficient, then add or subtract).',
        },
        {
          stageId: 'y9-l2-s4', code: '2J', title: 'Using Graphs to Solve Equations',
          outcomeIds: ['MA-ALG-03'], topicIds: ['MA-ALG-03'],
          explanation: 'Graph each equation; the intersection point gives the solution. This method works for any pair of equations, including non-linear ones.',
        },
        {
          stageId: 'y9-l2-s5', code: '2K', title: 'Linear Inequalities',
          outcomeIds: ['MA-ALG-05'], topicIds: ['MA-ALG-05'],
          explanation: 'Solve inequalities like equations, but reverse the inequality sign when multiplying or dividing by a negative number. Graph solutions on a number line.',
        },
      ],
    },
    // ── Chapter 3: Measurement ───────────────────────────────────────────────
    {
      levelId: 'y9-l3', levelNum: 3, title: 'Measurement', emoji: '📏', color: '#0EA5E9',
      stages: [
        {
          stageId: 'y9-l3-s1', code: '3A', title: 'Pythagoras\' Theorem',
          outcomeIds: ['MA-COORD-01'], topicIds: ['MA-COORD-01'],
          explanation: 'In a right triangle, a² + b² = c² where c is the hypotenuse. Use it to find missing sides and to test whether a triangle is right-angled.',
        },
        {
          stageId: 'y9-l3-s2', code: '3B', title: 'Perimeter and Area',
          outcomeIds: ['MA-COORD-01'], topicIds: ['MA-COORD-01'],
          explanation: 'Perimeter is the total boundary length; area is the enclosed surface. Know formulas for triangles, parallelograms, trapeziums, circles (A = πr²), and composite shapes.',
        },
        {
          stageId: 'y9-l3-s3', code: '3C', title: 'Surface Area',
          outcomeIds: ['MA-COORD-01'], topicIds: ['MA-COORD-01'],
          explanation: 'Surface area is the total area of all faces of a 3D solid. Draw a net if needed. Key solids: prisms (2 bases + rectangles), pyramids (1 base + triangles), cylinders (2 circles + rectangle).',
        },
        {
          stageId: 'y9-l3-s4', code: '3D', title: 'Volume',
          outcomeIds: ['MA-COORD-01'], topicIds: ['MA-COORD-01'],
          explanation: 'Volume of a prism = base area × height. Volume of a pyramid = ⅓ × base area × height. Cylinder: V = πr²h; Cone: V = ⅓πr²h; Sphere: V = 4/3 πr³.',
        },
      ],
    },
    // ── Chapter 4: Right-Angled Trigonometry ─────────────────────────────────
    {
      levelId: 'y9-l4', levelNum: 4, title: 'Trigonometry', emoji: '📐', color: '#14B8A6',
      stages: [
        {
          stageId: 'y9-l4-s1', code: '3E', title: 'Trigonometric Ratios (SOH CAH TOA)',
          outcomeIds: ['MA-TRIG-07'], topicIds: ['MA-TRIG-07'],
          explanation: 'sin θ = O/H, cos θ = A/H, tan θ = O/A. Label sides as Opposite, Adjacent, Hypotenuse relative to the angle. Use your calculator for non-special angles.',
        },
        {
          stageId: 'y9-l4-s2', code: '3F', title: 'Finding an Unknown Side',
          outcomeIds: ['MA-TRIG-07'], topicIds: ['MA-TRIG-07'],
          explanation: 'Choose the ratio that links the unknown side to the known side and angle. Multiply or divide to isolate the unknown. Always round at the final step only.',
        },
        {
          stageId: 'y9-l4-s3', code: '3G', title: 'Finding an Unknown Angle',
          outcomeIds: ['MA-TRIG-07'], topicIds: ['MA-TRIG-07'],
          explanation: 'Use the inverse trig functions: θ = sin⁻¹(O/H), θ = cos⁻¹(A/H), θ = tan⁻¹(O/A). Your calculator gives the principal angle; check the context for obtuse solutions.',
        },
        {
          stageId: 'y9-l4-s4', code: '3H', title: 'Angles of Elevation and Depression',
          outcomeIds: ['MA-TRIG-08'], topicIds: ['MA-TRIG-08'],
          explanation: 'Elevation is measured up from horizontal; depression is measured down. Draw and label the right triangle, identify the angle, then apply the appropriate trig ratio.',
        },
        {
          stageId: 'y9-l4-s5', code: '3I', title: 'Bearings',
          outcomeIds: ['MA-TRIG-08'], topicIds: ['MA-TRIG-08'],
          explanation: 'Bearings are measured clockwise from North (000° to 360°). Convert bearing problems into right triangles using north-south and east-west components.',
        },
      ],
    },
    // ── Chapter 5: Linear Relationships & Coordinate Geometry ───────────────
    {
      levelId: 'y9-l5', levelNum: 5, title: 'Coordinate Geometry', emoji: '📉', color: '#EC4899',
      stages: [
        {
          stageId: 'y9-l5-s1', code: '4A', title: 'Graphing Linear Relationships',
          outcomeIds: ['MA-COORD-02'], topicIds: ['MA-COORD-02'],
          explanation: 'Plot y = mx + b using the y-intercept b and gradient m = rise/run. Alternatively, find two intercepts (set x=0 for y-intercept, set y=0 for x-intercept) and draw the line through them.',
        },
        {
          stageId: 'y9-l5-s2', code: '4B', title: 'Finding the Equation of a Line',
          outcomeIds: ['MA-COORD-02'], topicIds: ['MA-COORD-02'],
          explanation: 'Given gradient m and y-intercept b: y = mx + b. Given two points: find m first, then substitute one point to find b. Given gradient and one point: use y − y₁ = m(x − x₁).',
        },
        {
          stageId: 'y9-l5-s3', code: '4C', title: 'Parallel and Perpendicular Lines',
          outcomeIds: ['MA-COORD-02'], topicIds: ['MA-COORD-02'],
          explanation: 'Parallel lines have equal gradients. Perpendicular lines have gradients whose product is −1: m₂ = −1/m₁. Use these to find equations of lines through given points.',
        },
        {
          stageId: 'y9-l5-s4', code: '4D', title: 'Length and Midpoint',
          outcomeIds: ['MA-COORD-02'], topicIds: ['MA-COORD-02'],
          explanation: 'Distance: d = √((x₂−x₁)² + (y₂−y₁)²) from Pythagoras. Midpoint: M = ((x₁+x₂)/2, (y₁+y₂)/2). These formulas apply to any two points on the number plane.',
        },
      ],
    },
    // ── Chapter 6: Indices & Scientific Notation ─────────────────────────────
    {
      levelId: 'y9-l6', levelNum: 6, title: 'Indices & Scientific Notation', emoji: '🔢', color: '#F59E0B',
      stages: [
        {
          stageId: 'y9-l6-s1', code: '6A', title: 'Index Laws: Multiplying and Dividing',
          outcomeIds: ['MA-ALG-08'], topicIds: ['MA-ALG-08'],
          explanation: 'aᵐ × aⁿ = aᵐ⁺ⁿ (multiply, add indices). aᵐ ÷ aⁿ = aᵐ⁻ⁿ (divide, subtract indices). These laws only apply when the bases are the same.',
        },
        {
          stageId: 'y9-l6-s2', code: '6B', title: 'Index Laws: Powers, Products and Quotients',
          outcomeIds: ['MA-ALG-08'], topicIds: ['MA-ALG-08'],
          explanation: '(aᵐ)ⁿ = aᵐⁿ (power of a power). (ab)ⁿ = aⁿbⁿ (power of a product). (a/b)ⁿ = aⁿ/bⁿ (power of a quotient). Apply these before the multiplication/division laws.',
        },
        {
          stageId: 'y9-l6-s3', code: '6C', title: 'Zero and Negative Indices',
          outcomeIds: ['MA-ALG-08'], topicIds: ['MA-ALG-08'],
          explanation: 'a⁰ = 1 for any non-zero a. a⁻ⁿ = 1/aⁿ — a negative index means reciprocal. Never leave a negative index in a final answer; write it as a fraction.',
        },
        {
          stageId: 'y9-l6-s4', code: '6D', title: 'Scientific Notation',
          outcomeIds: ['MA-ALG-08'], topicIds: ['MA-ALG-08'],
          explanation: 'Write numbers as a × 10ⁿ where 1 ≤ a < 10. Large numbers: 45 000 = 4.5 × 10⁴. Small numbers: 0.000 32 = 3.2 × 10⁻⁴. Multiply/divide by applying index laws.',
        },
        {
          stageId: 'y9-l6-s5', code: '6E', title: 'Fractional Indices',
          outcomeIds: ['MA-ALG-08'], topicIds: ['MA-ALG-08'],
          explanation: 'a^(1/n) = ⁿ√a (the nth root). a^(m/n) = (ⁿ√a)ᵐ. Evaluate fractional indices by taking the root first (to keep numbers small), then raising to the power.',
        },
      ],
    },
    // ── Chapter 7: Properties of Geometrical Figures ─────────────────────────
    {
      levelId: 'y9-l7', levelNum: 7, title: 'Geometrical Figures', emoji: '🔷', color: '#10B981',
      stages: [
        {
          stageId: 'y9-l7-s1', code: '7A', title: 'Triangles',
          outcomeIds: ['MA-COORD-01'], topicIds: ['MA-COORD-01'],
          explanation: 'Angle sum of a triangle = 180°. Exterior angle = sum of two non-adjacent interior angles. Congruent triangles have identical shape and size (SSS, SAS, AAS, RHS).',
        },
        {
          stageId: 'y9-l7-s2', code: '7B', title: 'Quadrilaterals',
          outcomeIds: ['MA-COORD-01'], topicIds: ['MA-COORD-01'],
          explanation: 'Angle sum of a quadrilateral = 360°. Know properties of parallelogram, rectangle, rhombus, square, trapezium, and kite — sides, angles, diagonals.',
        },
        {
          stageId: 'y9-l7-s3', code: '7C', title: 'Polygons',
          outcomeIds: ['MA-COORD-01'], topicIds: ['MA-COORD-01'],
          explanation: 'Sum of interior angles of an n-sided polygon = (n−2) × 180°. Each interior angle of a regular polygon = (n−2) × 180° / n. Exterior angles always sum to 360°.',
        },
        {
          stageId: 'y9-l7-s4', code: '7D', title: 'Similar Figures and Scale Factors',
          outcomeIds: ['MA-COORD-01'], topicIds: ['MA-COORD-01'],
          explanation: 'Similar figures have the same shape but different sizes. Corresponding sides are in the same ratio (the scale factor k). Area scales by k², volume scales by k³.',
        },
      ],
    },
    // ── Chapter 8: Probability ───────────────────────────────────────────────
    {
      levelId: 'y9-l8', levelNum: 8, title: 'Probability', emoji: '🎲', color: '#F97316',
      stages: [
        {
          stageId: 'y9-l8-s1', code: '8A', title: 'Probability Review',
          outcomeIds: ['MA-PROB-01'], topicIds: ['MA-PROB-01'],
          explanation: 'P(event) = (favourable outcomes) / (total equally likely outcomes). P ranges from 0 (impossible) to 1 (certain). P(A) + P(not A) = 1 always holds.',
        },
        {
          stageId: 'y9-l8-s2', code: '8B', title: 'Sample Space and Venn Diagrams',
          outcomeIds: ['MA-PROB-01'], topicIds: ['MA-PROB-01'],
          explanation: 'A sample space lists all possible outcomes. Venn diagrams show relationships between sets. P(A or B) = P(A) + P(B) − P(A and B) for any two events.',
        },
        {
          stageId: 'y9-l8-s3', code: '8C', title: 'Compound Events and Tree Diagrams',
          outcomeIds: ['MA-PROB-02'], topicIds: ['MA-PROB-02'],
          explanation: 'For multi-step experiments, multiply along branches and add across branches on a tree diagram. For independent events: P(A and B) = P(A) × P(B).',
        },
      ],
    },
    // ── Chapter 9: Statistics ────────────────────────────────────────────────
    {
      levelId: 'y9-l9', levelNum: 9, title: 'Statistics', emoji: '📊', color: '#6366F1',
      stages: [
        {
          stageId: 'y9-l9-s1', code: '9A', title: 'Classifying and Displaying Data',
          outcomeIds: ['MA-STAT-01'], topicIds: ['MA-STAT-01'],
          explanation: 'Data is categorical (groups) or numerical (measurements). Displays: dot plots, stem-and-leaf plots, frequency histograms. Choose based on data type and what you want to show.',
        },
        {
          stageId: 'y9-l9-s2', code: '9B', title: 'Measures of Location and Spread',
          outcomeIds: ['MA-STAT-02'], topicIds: ['MA-STAT-02'],
          explanation: 'Centre: mean (sum ÷ n), median (middle value), mode. Spread: range, interquartile range IQR = Q3 − Q1. Outliers are more than 1.5 × IQR beyond Q1 or Q3.',
        },
        {
          stageId: 'y9-l9-s3', code: '9C', title: 'Box Plots and Comparing Data Sets',
          outcomeIds: ['MA-STAT-03'], topicIds: ['MA-STAT-03'],
          explanation: 'Box plots show min, Q1, median, Q3, max. Place two box plots on the same axis to compare distributions. Comment on centre, spread, shape, and outliers.',
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
    // ── Chapter 1: Algebra ───────────────────────────────────────────────────
    {
      levelId: 'y10-l1', levelNum: 1, title: 'Algebra', emoji: '✏️', color: '#8B5CF6',
      stages: [
        {
          stageId: 'y10-l1-s1', code: '1A', title: 'Expanding and Factorising',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'Review expanding (removing brackets) and factorising (finding brackets). Master difference of squares, perfect squares, and trinomials — these appear throughout Year 10 and 11.',
        },
        {
          stageId: 'y10-l1-s2', code: '1B', title: 'Further Factorisation',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'Factorise ax² + bx + c where a ≠ 1 using the splitting method: find two numbers that multiply to ac and add to b, then group and factor. Sum and difference of cubes: a³ ± b³ = (a ± b)(a² ∓ ab + b²).',
        },
        {
          stageId: 'y10-l1-s3', code: '1C', title: 'Algebraic Fractions',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'Simplify by factorising then cancelling common factors. Add/subtract: use the lowest common denominator (LCD). Multiply/divide: cancel across numerators and denominators first.',
        },
        {
          stageId: 'y10-l1-s4', code: '1D', title: 'Quadratic Equations',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'Solve ax² + bx + c = 0 by factorising, completing the square, or using x = (−b ± √(b²−4ac))/2a. The discriminant Δ = b²−4ac tells you: Δ>0 (2 roots), Δ=0 (1 root), Δ<0 (no real roots).',
        },
        {
          stageId: 'y10-l1-s5', code: '1E', title: 'Simultaneous Equations',
          outcomeIds: ['MA-ALG-03'], topicIds: ['MA-ALG-03'],
          explanation: 'For non-linear simultaneous equations (e.g. line and parabola), substitute the linear equation into the other. The discriminant of the resulting quadratic tells you the number of intersections.',
        },
      ],
    },
    // ── Chapter 2: Logarithms and Equations ─────────────────────────────────
    {
      levelId: 'y10-l2', levelNum: 2, title: 'Logarithms & Equations', emoji: '🔢', color: '#6366F1',
      stages: [
        {
          stageId: 'y10-l2-s1', code: '2A', title: 'Review of Index Laws',
          outcomeIds: ['MA-ALG-08'], topicIds: ['MA-ALG-08'],
          explanation: 'Review all index laws: product rule, quotient rule, power of a power, zero index, negative indices, and fractional indices. These form the foundation for solving exponential equations.',
        },
        {
          stageId: 'y10-l2-s2', code: '2B', title: 'Logarithms and Their Laws',
          outcomeIds: ['MA-EXP-03'], topicIds: ['MA-EXP-03'],
          explanation: 'log_a(x) = y means aʸ = x. Log laws: log(AB) = logA + logB; log(A/B) = logA − logB; log(Aⁿ) = n·logA; log_a(a) = 1; log_a(1) = 0. Change of base: log_a(x) = log(x)/log(a).',
        },
        {
          stageId: 'y10-l2-s3', code: '2C', title: 'Solving Exponential and Log Equations',
          outcomeIds: ['MA-EXP-04'], topicIds: ['MA-EXP-04'],
          explanation: 'For 2ˣ = 16: make bases equal (2ˣ = 2⁴, so x = 4). For equations like 3ˣ = 10: take log of both sides x = log(10)/log(3). Always check that log arguments are positive.',
        },
        {
          stageId: 'y10-l2-s4', code: '2D', title: 'Harder Equations',
          outcomeIds: ['MA-ALG-03'], topicIds: ['MA-ALG-03'],
          explanation: 'Solve equations involving multiple fractions, nested brackets, or absolute values. For |ax + b| = c: solve ax + b = c and ax + b = −c separately, then check both solutions.',
        },
      ],
    },
    // ── Chapter 3: Functions and Other Graphs ────────────────────────────────
    {
      levelId: 'y10-l3', levelNum: 3, title: 'Functions & Graphs', emoji: '📉', color: '#EC4899',
      stages: [
        {
          stageId: 'y10-l3-s1', code: '3A', title: 'Functions and Relations',
          outcomeIds: ['MA-FUNC-01', 'MA-FUNC-02'], topicIds: ['MA-FUNC-01', 'MA-FUNC-02'],
          explanation: 'A function maps each input to exactly one output (vertical line test). Key functions: constant, linear, quadratic, absolute value. Domain and range restrict inputs and outputs.',
        },
        {
          stageId: 'y10-l3-s2', code: '3B', title: 'Quadratic Graphs',
          outcomeIds: ['MA-ALG-02'], topicIds: ['MA-ALG-02'],
          explanation: 'y = a(x−h)² + k has vertex (h, k), axis x = h, opens up if a > 0 (down if a < 0). Find intercepts by substituting x = 0 and solving y = 0. Sketch by plotting vertex and intercepts.',
        },
        {
          stageId: 'y10-l3-s3', code: '3C', title: 'The Hyperbola y = k/x',
          outcomeIds: ['MA-FUNC-07'], topicIds: ['MA-FUNC-07'],
          explanation: 'The hyperbola y = k/x has asymptotes at x = 0 and y = 0. k > 0 gives branches in Q1 and Q3; k < 0 gives branches in Q2 and Q4. Transformations shift the asymptotes.',
        },
        {
          stageId: 'y10-l3-s4', code: '3D', title: 'Exponential Graphs',
          outcomeIds: ['MA-EXP-01', 'MA-EXP-02'], topicIds: ['MA-EXP-01', 'MA-EXP-02'],
          explanation: 'y = aˣ: passes through (0,1), horizontal asymptote y = 0. a > 1 gives growth (increasing); 0 < a < 1 gives decay (decreasing). Reflections and shifts modify the asymptote and starting point.',
        },
        {
          stageId: 'y10-l3-s5', code: '3E', title: 'The Circle',
          outcomeIds: ['MA-FUNC-07'], topicIds: ['MA-FUNC-07'],
          explanation: 'Equation of circle with centre (h, k) and radius r: (x−h)² + (y−k)² = r². Expand to get the general form. Complete the square to convert general form back to centre-radius form.',
        },
      ],
    },
    // ── Chapter 4: Trigonometry ──────────────────────────────────────────────
    {
      levelId: 'y10-l4', levelNum: 4, title: 'Trigonometry', emoji: '〜', color: '#14B8A6',
      stages: [
        {
          stageId: 'y10-l4-s1', code: '4A', title: 'Trigonometry in Acute Triangles',
          outcomeIds: ['MA-TRIG-07'], topicIds: ['MA-TRIG-07'],
          explanation: 'Review SOH CAH TOA for right-angled triangles. Exact values: sin30°=½, cos30°=√3/2, sin45°=1/√2, sin60°=√3/2, tan45°=1. Always simplify using these exact values.',
        },
        {
          stageId: 'y10-l4-s2', code: '4B', title: 'The Sine Rule',
          outcomeIds: ['MA-TRIG-07'], topicIds: ['MA-TRIG-07'],
          explanation: 'a/sinA = b/sinB = c/sinC. Use when you know an angle and its opposite side plus one more piece. The ambiguous case arises when using the sine rule to find an angle — always check if two triangles are possible.',
        },
        {
          stageId: 'y10-l4-s3', code: '4C', title: 'The Cosine Rule',
          outcomeIds: ['MA-TRIG-07'], topicIds: ['MA-TRIG-07'],
          explanation: 'a² = b² + c² − 2bc·cosA. Use when you know two sides and the included angle (SAS) or all three sides (SSS). Rearranged: cosA = (b²+c²−a²)/2bc to find angles.',
        },
        {
          stageId: 'y10-l4-s4', code: '4D', title: 'Area of a Triangle and Radians',
          outcomeIds: ['MA-TRIG-09'], topicIds: ['MA-TRIG-09'],
          explanation: 'Area = ½ab·sinC. Radians: π rad = 180°. Arc length l = rθ, sector area A = ½r²θ (θ in radians). Radians simplify many formulas in higher mathematics.',
        },
        {
          stageId: 'y10-l4-s5', code: '4E', title: 'Problems in 3D',
          outcomeIds: ['MA-TRIG-08'], topicIds: ['MA-TRIG-08'],
          explanation: 'For 3D problems, identify right-angled or oblique triangles within the figure. Draw separate 2D diagrams for each triangle. Apply the appropriate rule systematically.',
        },
      ],
    },
    // ── Chapter 5: Polynomials ───────────────────────────────────────────────
    {
      levelId: 'y10-l5', levelNum: 5, title: 'Polynomials', emoji: '📐', color: '#F59E0B',
      stages: [
        {
          stageId: 'y10-l5-s1', code: '5A', title: 'Polynomials — Introduction',
          outcomeIds: ['MA-ALG-04'], topicIds: ['MA-ALG-04'],
          explanation: 'A polynomial is an expression aₙxⁿ + … + a₁x + a₀ with non-negative integer powers. Degree = highest power. Operations: add/subtract like terms; multiply using the distributive law.',
        },
        {
          stageId: 'y10-l5-s2', code: '5B', title: 'Dividing Polynomials',
          outcomeIds: ['MA-ALG-04'], topicIds: ['MA-ALG-04'],
          explanation: 'Long division of polynomials: set up like number long division. The division algorithm: P(x) = D(x)·Q(x) + R(x), where degree of R < degree of D. The result confirms the factor theorem.',
        },
        {
          stageId: 'y10-l5-s3', code: '5C', title: 'The Remainder and Factor Theorems',
          outcomeIds: ['MA-ALG-04'], topicIds: ['MA-ALG-04'],
          explanation: 'Remainder theorem: when P(x) is divided by (x−a), the remainder is P(a). Factor theorem: (x−a) is a factor of P(x) if and only if P(a) = 0. Use to test and find factors.',
        },
        {
          stageId: 'y10-l5-s4', code: '5D', title: 'Graphing Polynomials',
          outcomeIds: ['MA-FUNC-07'], topicIds: ['MA-FUNC-07'],
          explanation: 'Sketch by finding roots (y=0), y-intercept, and leading coefficient behaviour. A root of multiplicity 2 means the graph touches the x-axis; multiplicity 3 means it crosses with a cubic shape.',
        },
      ],
    },
    // ── Chapter 6: Variation ─────────────────────────────────────────────────
    {
      levelId: 'y10-l6', levelNum: 6, title: 'Variation', emoji: '📈', color: '#10B981',
      stages: [
        {
          stageId: 'y10-l6-s1', code: '6A', title: 'Direct Variation',
          outcomeIds: ['MA-ALG-05'], topicIds: ['MA-ALG-05'],
          explanation: 'y varies directly as x means y = kx (k ≠ 0). The graph is a straight line through the origin. Find k using any known pair (x, y): k = y/x.',
        },
        {
          stageId: 'y10-l6-s2', code: '6B', title: 'Inverse Variation',
          outcomeIds: ['MA-ALG-05'], topicIds: ['MA-ALG-05'],
          explanation: 'y varies inversely as x means y = k/x (k ≠ 0). The graph is a hyperbola. Find k using any known pair: k = xy. As x doubles, y halves.',
        },
        {
          stageId: 'y10-l6-s3', code: '6C', title: 'Further Variation',
          outcomeIds: ['MA-ALG-05'], topicIds: ['MA-ALG-05'],
          explanation: 'y varies directly as x² means y = kx². y varies inversely as √x means y = k/√x. Identify the type from context, use a data pair to find k, then use the formula to answer questions.',
        },
      ],
    },
    // ── Chapter 7: Statistics & Probability ─────────────────────────────────
    {
      levelId: 'y10-l7', levelNum: 7, title: 'Statistics & Probability', emoji: '📊', color: '#F97316',
      stages: [
        {
          stageId: 'y10-l7-s1', code: '7A', title: 'Data Analysis and Box Plots',
          outcomeIds: ['MA-STAT-03'], topicIds: ['MA-STAT-03'],
          explanation: 'Box plots display the five-number summary (min, Q1, median, Q3, max). Compare distributions using parallel box plots. Comment on shape (skewed vs symmetric), centre, spread, and outliers.',
        },
        {
          stageId: 'y10-l7-s2', code: '7B', title: 'Standard Deviation',
          outcomeIds: ['MA-STAT-04'], topicIds: ['MA-STAT-04'],
          explanation: 'Standard deviation σ measures spread around the mean. Calculated as the square root of the mean of squared deviations. Use your calculator\'s statistics mode; understand what a large vs small σ means.',
        },
        {
          stageId: 'y10-l7-s3', code: '7C', title: 'Probability — Venn Diagrams and Tables',
          outcomeIds: ['MA-PROB-01'], topicIds: ['MA-PROB-01'],
          explanation: 'P(A or B) = P(A) + P(B) − P(A and B). Use Venn diagrams or two-way tables to organise data. Independent events: P(A and B) = P(A) × P(B). Check independence using this formula.',
        },
        {
          stageId: 'y10-l7-s4', code: '7D', title: 'Conditional Probability',
          outcomeIds: ['MA-PROB-02'], topicIds: ['MA-PROB-02'],
          explanation: 'Conditional probability P(A|B) = P(A and B)/P(B): the probability of A given B has occurred. Dependent events change probability after each selection. Tree diagrams track changing probabilities.',
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
    // ── MS-A1/A2: Algebra — Formulae and Linear Relationships ────────────────
    {
      levelId: 'y11-std-l1', levelNum: 1, title: 'Algebra & Linear Relationships', emoji: '✏️', color: '#6366F1',
      stages: [
        {
          stageId: 'y11-std-l1-s1', code: '1A', title: 'Formulae and Equations',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'Substitute values into formulae and rearrange to solve for an unknown. Always convert units to the same system before substituting. Isolate the unknown using inverse operations.',
        },
        {
          stageId: 'y11-std-l1-s2', code: '1B', title: 'Solving Linear Equations',
          outcomeIds: ['MA-ALG-03'], topicIds: ['MA-ALG-03'],
          explanation: 'Solve linear equations by performing the same operation on both sides. For equations with fractions, multiply through by the LCD first. Always check your answer by substituting back.',
        },
        {
          stageId: 'y11-std-l1-s3', code: '1C', title: 'Linear Relationships and Graphs',
          outcomeIds: ['MA-COORD-02'], topicIds: ['MA-COORD-02'],
          explanation: 'y = mx + b: m is the gradient (rate of change), b is the y-intercept. To draw a line, find two points by substituting x-values. Interpret gradient as a real-world rate (e.g. \$/hour).',
        },
        {
          stageId: 'y11-std-l1-s4', code: '1D', title: 'Simultaneous Equations',
          outcomeIds: ['MA-ALG-03'], topicIds: ['MA-ALG-03'],
          explanation: 'Solve two linear equations simultaneously by substitution or elimination. Graphically, the solution is where the two lines intersect. Use this to find break-even points and budget crossovers.',
        },
      ],
    },
    // ── MS-M1/M2: Measurement and Working with Time ───────────────────────────
    {
      levelId: 'y11-std-l2', levelNum: 2, title: 'Measurement', emoji: '📏', color: '#0EA5E9',
      stages: [
        {
          stageId: 'y11-std-l2-s1', code: '2A', title: 'Perimeter, Area and Composite Shapes',
          outcomeIds: ['MA-COORD-01'], topicIds: ['MA-COORD-01'],
          explanation: 'Know area formulas for triangles, rectangles, parallelograms, trapeziums, and circles. Break composite shapes into standard shapes. Remember: area of sector = (θ/360°) × πr².',
        },
        {
          stageId: 'y11-std-l2-s2', code: '2B', title: 'Surface Area and Volume',
          outcomeIds: ['MA-COORD-01'], topicIds: ['MA-COORD-01'],
          explanation: 'Surface area = sum of all face areas. Volume of prism = area of cross-section × length. Know volumes of pyramids (⅓Ah), cylinders (πr²h), cones (⅓πr²h), and spheres (4/3πr³).',
        },
        {
          stageId: 'y11-std-l2-s3', code: '2C', title: 'Working with Time',
          outcomeIds: ['MA-COORD-01'], topicIds: ['MA-COORD-01'],
          explanation: 'Convert between time units and use timetables. Calculate time differences using 12-hour and 24-hour clocks. Understand time zones and the International Date Line for practical problems.',
        },
        {
          stageId: 'y11-std-l2-s4', code: '2D', title: 'Rates and Ratios',
          outcomeIds: ['MA-ALG-05'], topicIds: ['MA-ALG-05'],
          explanation: 'A rate compares two different quantities (e.g. km/h, $/kg). A ratio compares quantities of the same kind. Divide quantities in a given ratio by finding the total parts first.',
        },
      ],
    },
    // ── MS-F1: Money Matters (Financial Maths) ────────────────────────────────
    {
      levelId: 'y11-std-l3', levelNum: 3, title: 'Financial Mathematics', emoji: '💰', color: '#10B981',
      stages: [
        {
          stageId: 'y11-std-l3-s1', code: '3A', title: 'Income and Taxation',
          outcomeIds: ['MA-FIN-01'], topicIds: ['MA-FIN-01'],
          explanation: 'Types of income: salary (annual), wages (hourly), commission, piecework. Calculate gross income, then apply tax rates using tax brackets. Net income = gross − tax.',
        },
        {
          stageId: 'y11-std-l3-s2', code: '3B', title: 'Simple Interest',
          outcomeIds: ['MA-FIN-01'], topicIds: ['MA-FIN-01'],
          explanation: 'I = Prt: P is principal, r is the annual rate (as a decimal), t is time in years. Total amount A = P + I = P(1 + rt). Rearrange to find any unknown given the others.',
        },
        {
          stageId: 'y11-std-l3-s3', code: '3C', title: 'Compound Interest',
          outcomeIds: ['MA-FIN-02'], topicIds: ['MA-FIN-02'],
          explanation: 'A = P(1 + r)ⁿ where r is the rate per compounding period and n is the number of periods. Adjust r and n for monthly, quarterly compounding. Always check whether the answer is an amount or just the interest.',
        },
        {
          stageId: 'y11-std-l3-s4', code: '3D', title: 'Credit Cards and Loans',
          outcomeIds: ['MA-FIN-02'], topicIds: ['MA-FIN-02'],
          explanation: 'Credit cards charge interest on outstanding balances, often at very high rates. Calculate the interest charged if you don\'t pay in full. Understand minimum repayments and their long-term costs.',
        },
      ],
    },
    // ── MS-S1: Data Analysis ──────────────────────────────────────────────────
    {
      levelId: 'y11-std-l4', levelNum: 4, title: 'Statistical Analysis', emoji: '📊', color: '#F59E0B',
      stages: [
        {
          stageId: 'y11-std-l4-s1', code: '4A', title: 'Classifying and Displaying Data',
          outcomeIds: ['MA-STAT-01'], topicIds: ['MA-STAT-01'],
          explanation: 'Categorical data: bar/pie charts. Numerical: histograms, frequency polygons, stem-and-leaf. Grouped data: use class centres to calculate approximate mean. Choose the display that best tells the story.',
        },
        {
          stageId: 'y11-std-l4-s2', code: '4B', title: 'Summary Statistics',
          outcomeIds: ['MA-STAT-02'], topicIds: ['MA-STAT-02'],
          explanation: 'Mean (average), median (middle), mode (most frequent). Standard deviation σ measures spread. Small σ means data is clustered; large σ means widely spread. Use your calculator\'s STAT mode for efficiency.',
        },
        {
          stageId: 'y11-std-l4-s3', code: '4C', title: 'Box Plots and Comparing Distributions',
          outcomeIds: ['MA-STAT-03'], topicIds: ['MA-STAT-03'],
          explanation: 'Box plots: min, Q1, median, Q3, max. IQR = Q3 − Q1. Outliers: more than 1.5 × IQR from Q1 or Q3. Compare shape, centre, and spread for two distributions placed on the same axis.',
        },
        {
          stageId: 'y11-std-l4-s4', code: '4D', title: 'Scatterplots and Bivariate Data',
          outcomeIds: ['MA-STAT-04'], topicIds: ['MA-STAT-04'],
          explanation: 'A scatterplot shows the relationship between two numerical variables. Describe direction (positive/negative), strength (strong/weak/none), and form (linear/non-linear). Correlation does not imply causation.',
        },
      ],
    },
    // ── MS-S2: Relative Frequency and Probability ─────────────────────────────
    {
      levelId: 'y11-std-l5', levelNum: 5, title: 'Probability', emoji: '🎲', color: '#EC4899',
      stages: [
        {
          stageId: 'y11-std-l5-s1', code: '5A', title: 'Probability Basics',
          outcomeIds: ['MA-PROB-01'], topicIds: ['MA-PROB-01'],
          explanation: 'P(event) = (favourable) / (total). P ranges 0 to 1. Complementary: P(not A) = 1 − P(A). Experimental probability: relative frequency approaches theoretical probability over many trials.',
        },
        {
          stageId: 'y11-std-l5-s2', code: '5B', title: 'Multi-Stage Events and Tree Diagrams',
          outcomeIds: ['MA-PROB-02'], topicIds: ['MA-PROB-02'],
          explanation: 'Use tree diagrams for experiments with multiple stages. Multiply along branches (AND), add across branches (OR). For replacement: probabilities stay constant. For without replacement: update denominators.',
        },
        {
          stageId: 'y11-std-l5-s3', code: '5C', title: 'Counting Principles',
          outcomeIds: ['MA-PROB-01'], topicIds: ['MA-PROB-01'],
          explanation: 'Multiplication principle: if step 1 has m outcomes and step 2 has n outcomes, there are m × n outcomes total. Use this to count sample spaces without listing every outcome.',
        },
      ],
    },
    // ── MS-N1: Networks ───────────────────────────────────────────────────────
    {
      levelId: 'y11-std-l6', levelNum: 6, title: 'Networks', emoji: '🕸️', color: '#6366F1',
      stages: [
        {
          stageId: 'y11-std-l6-s1', code: '6A', title: 'Network Concepts',
          outcomeIds: ['MA-COORD-01'], topicIds: ['MA-COORD-01'],
          explanation: 'A network (graph) has vertices (nodes) and edges. Degree of a vertex = number of edges at that vertex. Sum of all degrees = 2 × number of edges (handshaking lemma).',
        },
        {
          stageId: 'y11-std-l6-s2', code: '6B', title: 'Euler Paths and Circuits',
          outcomeIds: ['MA-COORD-01'], topicIds: ['MA-COORD-01'],
          explanation: 'An Euler path uses each edge exactly once. An Euler circuit is an Euler path that returns to the start. Euler path exists iff there are exactly 0 or 2 odd-degree vertices. Euler circuit: all even degrees.',
        },
        {
          stageId: 'y11-std-l6-s3', code: '6C', title: 'Minimum Spanning Trees',
          outcomeIds: ['MA-COORD-01'], topicIds: ['MA-COORD-01'],
          explanation: 'A spanning tree connects all vertices with no cycles, using the minimum total edge weight. Prim\'s algorithm: start at any vertex, always add the shortest edge to an unvisited vertex.',
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
    // ── Chapter 1: Methods in Algebra ────────────────────────────────────────
    {
      levelId: 'y11-adv-l1', levelNum: 1, title: 'Methods in Algebra', emoji: '✏️', color: '#6366F1',
      stages: [
        {
          stageId: 'y11-adv-l1-s1a', code: '1A', title: 'Arithmetic with Pronumerals',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'Collect like terms, expand brackets using the distributive law, and simplify products. Recognise and apply: (a+b)² = a²+2ab+b², (a−b)² = a²−2ab+b², a²−b² = (a+b)(a−b).',
        },
        {
          stageId: 'y11-adv-l1-s1b', code: '1B', title: 'Expanding Brackets',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'Use the distributive law a(b+c) = ab+ac and FOIL for two brackets. Special products: (a+b)² = a²+2ab+b², (a−b)² = a²−2ab+b², (a+b)(a−b) = a²−b².',
        },
        {
          stageId: 'y11-adv-l1-s1c', code: '1C', title: 'Factoring',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'Factorise by: (1) taking the HCF, (2) difference of squares, (3) trinomials x²+bx+c=(x+p)(x+q), (4) grouping. Always take the HCF first before applying other methods.',
        },
        {
          stageId: 'y11-adv-l1-s1d', code: '1D', title: 'Algebraic Fractions',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'Simplify by factorising then cancelling. Add/subtract: find the LCD. Multiply: cancel across numerators and denominators. Divide: multiply by the reciprocal.',
        },
        {
          stageId: 'y11-adv-l1-s1e', code: '1E', title: 'Solving Linear Equations',
          outcomeIds: ['MA-ALG-03'], topicIds: ['MA-ALG-03'],
          explanation: 'Rearrange linear equations using inverse operations. Clear fractions by multiplying through by the LCD. Always check by substituting your solution back into the original equation.',
        },
        {
          stageId: 'y11-adv-l1-s1f', code: '1F', title: 'Solving Quadratic Equations',
          outcomeIds: ['MA-ALG-03'], topicIds: ['MA-ALG-03'],
          explanation: 'Solve quadratics by factorising, completing the square, or x = (−b ± √Δ)/2a. Discriminant Δ = b²−4ac: Δ>0 gives two solutions, Δ=0 gives one, Δ<0 gives none.',
        },
        {
          stageId: 'y11-adv-l1-s1g', code: '1G', title: 'Solving Simultaneous Equations',
          outcomeIds: ['MA-ALG-03'], topicIds: ['MA-ALG-03'],
          explanation: 'Substitution: rearrange one equation, substitute into the other. Elimination: multiply to match a coefficient, then add or subtract. Non-linear simultaneous equations may give 0, 1, or 2 solutions.',
        },
        {
          stageId: 'y11-adv-l1-s1h', code: '1H', title: 'Completing the Square',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'To complete the square for x² + bx: add and subtract (b/2)². This converts ax² + bx + c to a(x+h)² + k (vertex form). Essential for graphing parabolas and integrating later.',
        },
      ],
    },
    // ── Chapter 2: Numbers and Surds ─────────────────────────────────────────
    {
      levelId: 'y11-adv-l2', levelNum: 2, title: 'Numbers and Surds', emoji: '🔢', color: '#8B5CF6',
      stages: [
        {
          stageId: 'y11-adv-l2-s2a', code: '2A', title: 'Whole Numbers, Integers and Rationals',
          outcomeIds: ['MA-ALG-08'], topicIds: ['MA-ALG-08'],
          explanation: 'Natural numbers, integers, rationals (fractions) and irrationals. Represent intervals on the number line: [a,b] closed, (a,b) open, [a,b) half-open. All rational and irrational numbers together form the reals ℝ.',
        },
        {
          stageId: 'y11-adv-l2-s2b', code: '2B', title: 'Real Numbers and Approximations',
          outcomeIds: ['MA-ALG-08'], topicIds: ['MA-ALG-08'],
          explanation: 'Real numbers include rationals and irrationals. Approximate decimals by rounding to a given number of decimal places or significant figures. Understand the difference between exact and approximate values.',
        },
        {
          stageId: 'y11-adv-l2-s2c', code: '2C', title: 'Surds and Their Arithmetic',
          outcomeIds: ['MA-ALG-08'], topicIds: ['MA-ALG-08'],
          explanation: 'Simplify √(ab) = √a·√b. Add like surds: 3√5 + 7√5 = 10√5. Multiply using FOIL. Surds give exact values — always preferred in exam answers over rounded decimals.',
        },
        {
          stageId: 'y11-adv-l2-s2d', code: '2D', title: 'Further Simplification of Surds',
          outcomeIds: ['MA-ALG-08'], topicIds: ['MA-ALG-08'],
          explanation: 'Simplify by finding the largest perfect-square factor: √72 = √(36·2) = 6√2. Expand surd products: (2+√3)² = 7+4√3. Use (a+√b)(a−√b) = a²−b to get rational results.',
        },
        {
          stageId: 'y11-adv-l2-s2e', code: '2E', title: 'Rationalising the Denominator',
          outcomeIds: ['MA-ALG-08'], topicIds: ['MA-ALG-08'],
          explanation: 'For 1/√a: multiply by √a/√a. For 1/(a+√b): multiply by the conjugate (a−√b)/(a−√b). The result always has a rational denominator — required in all final answers.',
        },
      ],
    },
    // ── Chapter 3: Functions and Graphs ──────────────────────────────────────
    {
      levelId: 'y11-adv-l3', levelNum: 3, title: 'Functions and Graphs', emoji: '📉', color: '#0EA5E9',
      stages: [
        {
          stageId: 'y11-adv-l3-s3a', code: '3A', title: 'Functions and Function Notation',
          outcomeIds: ['MA-FUNC-01', 'MA-FUNC-02'], topicIds: ['MA-FUNC-01', 'MA-FUNC-02'],
          explanation: 'A function assigns exactly one output to each input (vertical line test). f(x) notation: f(3) means substitute x = 3. Domain = allowed inputs; Range = set of outputs.',
        },
        {
          stageId: 'y11-adv-l3-s3b', code: '3B', title: 'Functions, Relations and Graphs',
          outcomeIds: ['MA-FUNC-02'], topicIds: ['MA-FUNC-02'],
          explanation: 'Know key graphs: y = x (line), y = x² (parabola), y = x³ (cubic), y = 1/x (hyperbola), y = √x (half-parabola), y = |x| (V-shape). Identify domain, range, intercepts, and asymptotes for each.',
        },
        {
          stageId: 'y11-adv-l3-s3c', code: '3C', title: 'Review of Linear Graphs',
          outcomeIds: ['MA-COORD-02'], topicIds: ['MA-COORD-02'],
          explanation: 'y = mx + b: m = gradient, b = y-intercept. Find the equation given two points or given gradient and one point using y − y₁ = m(x − x₁). Parallel: equal gradients. Perpendicular: m₁m₂ = −1.',
        },
        {
          stageId: 'y11-adv-l3-s3d', code: '3D', title: 'Quadratic Functions — Factoring and the Graph',
          outcomeIds: ['MA-ALG-02'], topicIds: ['MA-ALG-02'],
          explanation: 'Vertex form y = a(x−h)² + k: vertex at (h,k), axis x = h. Intercept form y = a(x−p)(x−q): x-intercepts at p and q. Find the vertex from standard form: x = −b/2a.',
        },
        {
          stageId: 'y11-adv-l3-s3e', code: '3E', title: 'Completing the Square and the Graph',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'Complete the square to convert y = ax²+bx+c to vertex form y = a(x−h)²+k. This reveals the vertex (h,k) directly. Essential for parabola sketching and integration by substitution.',
        },
        {
          stageId: 'y11-adv-l3-s3f', code: '3F', title: 'The Quadratic Formula and the Graph',
          outcomeIds: ['MA-ALG-02'], topicIds: ['MA-ALG-02'],
          explanation: 'x = (−b ± √(b²−4ac))/2a. Discriminant Δ = b²−4ac: Δ>0 two roots, Δ=0 one root, Δ<0 no real roots. Use Δ to determine how the parabola intersects the x-axis.',
        },
        {
          stageId: 'y11-adv-l3-s3g', code: '3G', title: 'Powers, Polynomials and Circles',
          outcomeIds: ['MA-FUNC-07'], topicIds: ['MA-FUNC-07'],
          explanation: 'Sketch y = xⁿ for various n: even powers give U-shapes, odd powers give S-shapes. Circle (x−h)²+(y−k)² = r² has centre (h,k) radius r; complete the square to convert from general form.',
        },
        {
          stageId: 'y11-adv-l3-s3h', code: '3H', title: 'Two Graphs That Have Asymptotes',
          outcomeIds: ['MA-FUNC-07'], topicIds: ['MA-FUNC-07'],
          explanation: 'Hyperbola y = k/x: asymptotes x = 0, y = 0. Translated: y = k/(x−a)+b has asymptotes x = a, y = b. Exponential y = aˣ: passes through (0,1) with asymptote y = 0.',
        },
        {
          stageId: 'y11-adv-l3-s3i', code: '3I', title: 'Four Types of Relations',
          outcomeIds: ['MA-FUNC-01'], topicIds: ['MA-FUNC-01'],
          explanation: 'Classify relations as: (1) functions (pass vertical line test), (2) one-to-one functions (pass horizontal line test), (3) many-to-one, (4) one-to-many. Examples and counter-examples for each type.',
        },
      ],
    },
    // ── Chapter 4: Transformations and Symmetry ───────────────────────────────
    {
      levelId: 'y11-adv-l4', levelNum: 4, title: 'Transformations and Symmetry', emoji: '🔄', color: '#EC4899',
      stages: [
        {
          stageId: 'y11-adv-l4-s4a', code: '4A', title: 'Translations of Known Graphs',
          outcomeIds: ['MA-FUNC-05'], topicIds: ['MA-FUNC-05'],
          explanation: 'y = f(x) + k shifts up by k. y = f(x − h) shifts right by h. Combine: y = f(x − h) + k shifts right h and up k. The graph shape is unchanged; only its position moves.',
        },
        {
          stageId: 'y11-adv-l4-s4b', code: '4B', title: 'Reflections in the x-axis and y-axis',
          outcomeIds: ['MA-FUNC-05'], topicIds: ['MA-FUNC-05'],
          explanation: 'y = −f(x) reflects in the x-axis (flips vertically). y = f(−x) reflects in the y-axis (flips horizontally). Apply translations after reflections for combined transformations.',
        },
        {
          stageId: 'y11-adv-l4-s4c', code: '4C', title: 'Even and Odd Symmetry',
          outcomeIds: ['MA-FUNC-05'], topicIds: ['MA-FUNC-05'],
          explanation: 'Even function: f(−x) = f(x) — symmetric about the y-axis. Odd function: f(−x) = −f(x) — symmetric about the origin. Check by substituting −x. Many functions are neither.',
        },
        {
          stageId: 'y11-adv-l4-s4d', code: '4D', title: 'The Absolute Value Function',
          outcomeIds: ['MA-FUNC-06'], topicIds: ['MA-FUNC-06'],
          explanation: '|x| = x if x ≥ 0, −x if x < 0. Graph y = |f(x)| by reflecting negative portions above the x-axis. Solve |ax + b| = c by considering both cases: ax + b = c and ax + b = −c.',
        },
        {
          stageId: 'y11-adv-l4-s4e', code: '4E', title: 'Composite Functions',
          outcomeIds: ['MA-FUNC-05'], topicIds: ['MA-FUNC-05'],
          explanation: '(f∘g)(x) = f(g(x)): apply g first, then f. The domain of f∘g is the set of x in the domain of g such that g(x) is in the domain of f. Order matters: f∘g ≠ g∘f in general.',
        },
      ],
    },
    // ── Chapter 5: Further Graphs ─────────────────────────────────────────────
    {
      levelId: 'y11-adv-l5', levelNum: 5, title: 'Further Graphs', emoji: '📐', color: '#14B8A6',
      stages: [
        {
          stageId: 'y11-adv-l5-s5a', code: '6A', title: 'Circles and Semi-Circles',
          outcomeIds: ['MA-FUNC-07'], topicIds: ['MA-FUNC-07'],
          explanation: '(x−h)² + (y−k)² = r² is a circle with centre (h,k) and radius r. Complete the square on both x and y terms to convert general form. y = √(r²−x²) is the upper semi-circle (a function).',
        },
        {
          stageId: 'y11-adv-l5-s5b', code: '6B', title: 'The Hyperbola y = k/(x−a) + b',
          outcomeIds: ['MA-FUNC-07'], topicIds: ['MA-FUNC-07'],
          explanation: 'Standard hyperbola y = 1/x has asymptotes x = 0, y = 0. Shift by (a, b): y = k/(x−a) + b has asymptotes x = a, y = b. Sketch by locating the asymptotes, then the two branches.',
        },
        {
          stageId: 'y11-adv-l5-s5c', code: '6C', title: 'Absolute Value Functions',
          outcomeIds: ['MA-FUNC-06'], topicIds: ['MA-FUNC-06'],
          explanation: '|x| = x if x ≥ 0, −x if x < 0. Graph y = |f(x)| by reflecting negative portions above the x-axis. Solve |ax + b| = c by considering both cases: ax + b = c and ax + b = −c.',
        },
        {
          stageId: 'y11-adv-l5-s5d', code: '6D', title: 'Graphing Using Technology',
          outcomeIds: ['MA-FUNC-07'], topicIds: ['MA-FUNC-07'],
          explanation: 'Use graphing calculators or Desmos to verify hand-drawn sketches. Identify key features: intercepts, turning points, asymptotes. Technology confirms, but you must understand the theory.',
        },
      ],
    },
    // ── Chapter 6: Trigonometry ───────────────────────────────────────────────
    {
      levelId: 'y11-adv-l6', levelNum: 6, title: 'Trigonometry', emoji: '〜', color: '#F59E0B',
      stages: [
        {
          stageId: 'y11-adv-l6-s6a', code: '5A', title: 'Trigonometry with Right-Angled Triangles',
          outcomeIds: ['MA-TRIG-01'], topicIds: ['MA-TRIG-01'],
          explanation: 'SOH CAH TOA for right triangles. Exact values: sin30°=½, cos30°=√3/2, tan30°=1/√3; sin45°=cos45°=1/√2; sin60°=√3/2, cos60°=½. Memorise these from special triangles.',
        },
        {
          stageId: 'y11-adv-l6-s6b', code: '5B', title: 'Problems Involving Right-Angled Triangles',
          outcomeIds: ['MA-TRIG-01'], topicIds: ['MA-TRIG-01'],
          explanation: 'Identify the right angle, label sides relative to the given or required angle, choose the correct trig ratio. Angles of elevation and depression are measured from horizontal.',
        },
        {
          stageId: 'y11-adv-l6-s6c', code: '5C', title: 'Three-Dimensional Trigonometry',
          outcomeIds: ['MA-TRIG-08'], topicIds: ['MA-TRIG-08'],
          explanation: 'For 3D problems, draw 2D cross-sections containing the required angle or length. Label all known and unknown quantities, then apply trig ratios or Pythagoras systematically.',
        },
        {
          stageId: 'y11-adv-l6-s6d', code: '5D', title: 'Trigonometric Functions of a General Angle',
          outcomeIds: ['MA-TRIG-01'], topicIds: ['MA-TRIG-01'],
          explanation: 'Use the unit circle to extend trig to any angle. ASTC rule: All positive in Q1, Sin in Q2, Tan in Q3, Cos in Q4. Reference angle: the acute angle to the x-axis.',
        },
        {
          stageId: 'y11-adv-l6-s6e', code: '5E', title: 'Quadrant, Sign, and Related Acute Angle',
          outcomeIds: ['MA-TRIG-01'], topicIds: ['MA-TRIG-01'],
          explanation: 'cos(180°−θ) = −cosθ, sin(180°−θ) = sinθ. For any angle, find its quadrant using ASTC, then find the related acute angle. Use these to evaluate trig of angles outside 0°–90°.',
        },
        {
          stageId: 'y11-adv-l6-s6f', code: '5F', title: 'Given One Trigonometric Function, Find Another',
          outcomeIds: ['MA-TRIG-01'], topicIds: ['MA-TRIG-01'],
          explanation: 'Use the Pythagorean identity sin²θ + cos²θ = 1. If sinθ = 3/5, then cosθ = ±4/5 (sign depends on quadrant). Divide to get tanθ = sinθ/cosθ. Always consider the quadrant.',
        },
        {
          stageId: 'y11-adv-l6-s6g', code: '5G', title: 'Trigonometric Identities',
          outcomeIds: ['MA-TRIG-01'], topicIds: ['MA-TRIG-01'],
          explanation: 'Key identities: sin²θ + cos²θ = 1; 1 + tan²θ = sec²θ; 1 + cot²θ = cosec²θ. Use to simplify trig expressions or convert from one function to another before differentiating or integrating.',
        },
        {
          stageId: 'y11-adv-l6-s6h', code: '5H', title: 'Trigonometric Equations',
          outcomeIds: ['MA-TRIG-03'], topicIds: ['MA-TRIG-03'],
          explanation: 'For sin x = k: find the principal solution, then use symmetry to find all solutions in the required domain. Express answers as exact values where possible (e.g. x = π/6 not 30°).',
        },
        {
          stageId: 'y11-adv-l6-s6i', code: '5I', title: 'The Sine Rule and the Area Formula',
          outcomeIds: ['MA-TRIG-07'], topicIds: ['MA-TRIG-07'],
          explanation: 'Sine rule: a/sinA = b/sinB = c/sinC. Use when a known angle-side pair is available. Area = ½ab sinC. The ambiguous case arises when using the sine rule to find an angle.',
        },
        {
          stageId: 'y11-adv-l6-s6j', code: '5J', title: 'The Cosine Rule',
          outcomeIds: ['MA-TRIG-07'], topicIds: ['MA-TRIG-07'],
          explanation: 'a² = b² + c² − 2bc cosA. Use for SAS (two sides and the included angle) or SSS (three sides). Rearranged: cosA = (b²+c²−a²)/2bc to find angles.',
        },
        {
          stageId: 'y11-adv-l6-s6k', code: '5K', title: 'Problems Involving General Triangles',
          outcomeIds: ['MA-TRIG-07'], topicIds: ['MA-TRIG-07'],
          explanation: 'Decide between the sine rule and cosine rule: SAS or SSS → cosine rule; AAS or ASS → sine rule. Set up a diagram, mark all given information, then apply the appropriate rule systematically.',
        },
      ],
    },
    // ── Chapter 7: Exponential and Logarithmic Functions ─────────────────────
    {
      levelId: 'y11-adv-l7', levelNum: 7, title: 'Exponential and Logarithmic Functions', emoji: '📈', color: '#10B981',
      stages: [
        {
          stageId: 'y11-adv-l7-s7a', code: '7A', title: 'Indices',
          outcomeIds: ['MA-ALG-08'], topicIds: ['MA-ALG-08'],
          explanation: 'Review all index laws: product, quotient, power of a power, zero index, negative indices. Apply to simplify expressions with integer indices. These laws underpin both logarithms and exponential functions.',
        },
        {
          stageId: 'y11-adv-l7-s7b', code: '7B', title: 'Fractional Indices',
          outcomeIds: ['MA-ALG-08'], topicIds: ['MA-ALG-08'],
          explanation: 'a^(1/n) = ⁿ√a. a^(m/n) = (ⁿ√a)ᵐ. Evaluate by taking the root first then raising to the power. Convert between surd and index notation: √x = x^(1/2), ³√x² = x^(2/3).',
        },
        {
          stageId: 'y11-adv-l7-s7c', code: '7C', title: 'Logarithms',
          outcomeIds: ['MA-EXP-03'], topicIds: ['MA-EXP-03'],
          explanation: 'log_a(x) = y ⟺ aʸ = x. Domain of log: x > 0. Graph of y = log_a(x) is the reflection of y = aˣ in y = x. ln x = log_e x. Change of base: log_a(x) = ln x / ln a.',
        },
        {
          stageId: 'y11-adv-l7-s7d', code: '7D', title: 'The Laws for Logarithms',
          outcomeIds: ['MA-EXP-04'], topicIds: ['MA-EXP-04'],
          explanation: 'Product: log(AB) = logA + logB. Quotient: log(A/B) = logA − logB. Power: log(Aⁿ) = n logA. These laws are used to simplify expressions, solve log equations, and differentiate log functions.',
        },
        {
          stageId: 'y11-adv-l7-s7e', code: '7E', title: 'Equations Involving Logarithms and Indices',
          outcomeIds: ['MA-EXP-04'], topicIds: ['MA-EXP-04'],
          explanation: 'To solve 3ˣ = 20: take log of both sides, x = log20/log3. To solve log₂(x+1) = 3: convert to exponential form, x+1 = 8. Always check solutions are in the domain.',
        },
        {
          stageId: 'y11-adv-l7-s7f', code: '7F', title: 'Exponential and Logarithmic Graphs',
          outcomeIds: ['MA-EXP-01', 'MA-EXP-02'], topicIds: ['MA-EXP-01', 'MA-EXP-02'],
          explanation: 'y = aˣ: passes through (0,1), asymptote y = 0. y = log_a(x): passes through (1,0), asymptote x = 0. They are reflections in y = x. Apply transformations (shifts, dilations, reflections) to both.',
        },
        {
          stageId: 'y11-adv-l7-s7g', code: '7G', title: 'Applications of These Functions',
          outcomeIds: ['MA-EXP-02'], topicIds: ['MA-EXP-02'],
          explanation: 'A = A₀ eᵏᵗ models exponential growth (k>0) and decay (k<0). Use logs to find k or t. Applications include population growth, radioactive decay, compound interest, and Newton\'s law of cooling.',
        },
      ],
    },
    // ── Chapter 8: Differentiation ────────────────────────────────────────────
    {
      levelId: 'y11-adv-l8', levelNum: 8, title: 'Differentiation', emoji: '∂', color: '#EC4899',
      stages: [
        {
          stageId: 'y11-adv-l8-s8a', code: '8A', title: 'Tangents and the Derivative',
          outcomeIds: ['MA-CALC-D01'], topicIds: ['MA-CALC-D01'],
          explanation: 'The derivative f\'(x) gives the gradient of the tangent to y = f(x) at any point. As the secant approaches the tangent, the gradient approaches a limit — the derivative.',
        },
        {
          stageId: 'y11-adv-l8-s8b', code: '8B', title: 'The Derivative as a Limit',
          outcomeIds: ['MA-CALC-D01'], topicIds: ['MA-CALC-D01'],
          explanation: 'f\'(x) = lim[h→0] (f(x+h)−f(x))/h. This limit gives the gradient of the tangent — the instantaneous rate of change at x. Compute for simple functions like x² to understand the process.',
        },
        {
          stageId: 'y11-adv-l8-s8c', code: '8C', title: 'A Rule for Differentiating Powers of x',
          outcomeIds: ['MA-CALC-D01'], topicIds: ['MA-CALC-D01'],
          explanation: 'Power rule: d/dx(xⁿ) = nxⁿ⁻¹. Sum rule: d/dx(f + g) = f\' + g\'. Constant multiple: d/dx(cf) = c·f\'. Differentiate each term separately. Apply to polynomials immediately.',
        },
        {
          stageId: 'y11-adv-l8-s8d', code: '8D', title: 'Tangents and Normals — dy/dx Notation',
          outcomeIds: ['MA-CALC-D07'], topicIds: ['MA-CALC-D07'],
          explanation: 'Tangent at (a, f(a)): gradient m = f\'(a); equation y − f(a) = m(x − a). Normal: gradient −1/f\'(a) (perpendicular). Leibniz notation dy/dx is equivalent to f\'(x).',
        },
        {
          stageId: 'y11-adv-l8-s8e', code: '8E', title: 'Differentiating Powers with Negative Indices',
          outcomeIds: ['MA-CALC-D01'], topicIds: ['MA-CALC-D01'],
          explanation: 'Apply the power rule to negative powers: d/dx(x⁻ⁿ) = −nx⁻ⁿ⁻¹. Write fractions as negative powers before differentiating: 1/x² = x⁻², so d/dx(1/x²) = −2x⁻³.',
        },
        {
          stageId: 'y11-adv-l8-s8f', code: '8F', title: 'Differentiating Powers with Fractional Indices',
          outcomeIds: ['MA-CALC-D01'], topicIds: ['MA-CALC-D01'],
          explanation: 'Apply the power rule to fractional powers: d/dx(x^(m/n)) = (m/n)x^(m/n−1). Convert surds to index form before differentiating: √x = x^(1/2), ³√x = x^(1/3).',
        },
        {
          stageId: 'y11-adv-l8-s8g', code: '8G', title: 'The Chain Rule',
          outcomeIds: ['MA-CALC-D02'], topicIds: ['MA-CALC-D02'],
          explanation: '[f(g(x))]\' = f\'(g(x))·g\'(x). Identify the outer and inner functions. The chain rule applies whenever you have a function of a function: (x²+1)⁵, sin(3x), e^(x²), etc.',
        },
        {
          stageId: 'y11-adv-l8-s8h', code: '8H', title: 'The Product Rule',
          outcomeIds: ['MA-CALC-D03'], topicIds: ['MA-CALC-D03'],
          explanation: 'Product: (uv)\' = u\'v + uv\'. Identify u and v, find u\' and v\', then substitute. Use when you have a product of two functions where neither is just a constant.',
        },
        {
          stageId: 'y11-adv-l8-s8i', code: '8I', title: 'The Quotient Rule',
          outcomeIds: ['MA-CALC-D03'], topicIds: ['MA-CALC-D03'],
          explanation: 'Quotient: (u/v)\' = (u\'v − uv\')/v². Alternatively, write the quotient as a product using negative indices and apply the product rule. The quotient rule is faster for fractions with trig or exponentials.',
        },
        {
          stageId: 'y11-adv-l8-s8j', code: '8J', title: 'Rates of Change',
          outcomeIds: ['MA-CALC-D09'], topicIds: ['MA-CALC-D09'],
          explanation: 'dy/dx represents the rate of change of y with respect to x. In kinematics: v = dx/dt (velocity), a = dv/dt (acceleration). Related rates use the chain rule: dy/dt = (dy/dx)(dx/dt).',
        },
        {
          stageId: 'y11-adv-l8-s8k', code: '8K', title: 'Continuity',
          outcomeIds: ['MA-CALC-D01'], topicIds: ['MA-CALC-D01'],
          explanation: 'f is continuous at x = a if lim[x→a] f(x) = f(a). Geometrically, no gaps or jumps. Differentiability implies continuity, but continuity does not imply differentiability (e.g. |x| at x = 0).',
        },
        {
          stageId: 'y11-adv-l8-s8l', code: '8L', title: 'Differentiability',
          outcomeIds: ['MA-CALC-D01'], topicIds: ['MA-CALC-D01'],
          explanation: 'f is differentiable at x = a if the derivative exists (the limit exists). Sharp corners and cusps are not differentiable. Test differentiability by checking if left and right derivatives are equal.',
        },
      ],
    },
    // ── Chapter 9: Geometry of the Derivative ─────────────────────────────────
    {
      levelId: 'y11-adv-l9', levelNum: 9, title: 'Geometry of the Derivative', emoji: '📐', color: '#F97316',
      stages: [
        {
          stageId: 'y11-adv-l9-s9a', code: '9A', title: 'Increasing, Decreasing and Stationary at a Point',
          outcomeIds: ['MA-CALC-D07'], topicIds: ['MA-CALC-D07'],
          explanation: 'f\'(x) > 0: increasing. f\'(x) < 0: decreasing. f\'(x) = 0: stationary point. Classify stationary points using a sign diagram (changes in sign of f\') or the second derivative test.',
        },
        {
          stageId: 'y11-adv-l9-s9b', code: '9B', title: 'Stationary Points and Turning Points',
          outcomeIds: ['MA-CALC-D08'], topicIds: ['MA-CALC-D08'],
          explanation: 'A turning point is a stationary point where f\' changes sign. f\'\'(x) > 0 at stationary point → local minimum. f\'\'(x) < 0 → local maximum. f\'\'(x) = 0 → use sign diagram of f\'.',
        },
        {
          stageId: 'y11-adv-l9-s9c', code: '9C', title: 'Second Derivative and Points of Inflection',
          outcomeIds: ['MA-CALC-D08'], topicIds: ['MA-CALC-D08'],
          explanation: 'f\'\'(x) > 0: concave up. f\'\'(x) < 0: concave down. Points of inflection are where concavity changes; f\'\'(x) = 0 is necessary but not sufficient — check that concavity actually changes.',
        },
        {
          stageId: 'y11-adv-l9-s9d', code: '9D', title: 'Curve Sketching',
          outcomeIds: ['MA-CALC-D08'], topicIds: ['MA-CALC-D08'],
          explanation: 'Full curve sketch: (1) domain, (2) intercepts, (3) stationary points, (4) nature of stationary points, (5) inflection points, (6) asymptotes, (7) behaviour as x → ±∞. Connect these features.',
        },
        {
          stageId: 'y11-adv-l9-s9e', code: '9E', title: 'Optimisation Problems',
          outcomeIds: ['MA-CALC-D09'], topicIds: ['MA-CALC-D09'],
          explanation: 'Define a variable, write an expression for the quantity to optimise, differentiate, set equal to zero, and test whether it is a max or min. Always check endpoints if the domain is restricted.',
        },
      ],
    },
    // ── Chapter 10: Integration ───────────────────────────────────────────────
    {
      levelId: 'y11-adv-l10', levelNum: 10, title: 'Integration', emoji: '∫', color: '#6366F1',
      stages: [
        {
          stageId: 'y11-adv-l10-s10a', code: '10A', title: 'Areas and the Definite Integral',
          outcomeIds: ['MA-CALC-I02'], topicIds: ['MA-CALC-I02'],
          explanation: 'The definite integral ∫[a,b] f(x) dx gives the signed area between y = f(x) and the x-axis. Area under the x-axis counts negatively. Split the integral at x-intercepts if needed.',
        },
        {
          stageId: 'y11-adv-l10-s10b', code: '10B', title: 'The Fundamental Theorem of Calculus',
          outcomeIds: ['MA-CALC-I02'], topicIds: ['MA-CALC-I02'],
          explanation: '∫[a,b] f(x) dx = F(b) − F(a) where F is any antiderivative. Power rule: ∫xⁿ dx = xⁿ⁺¹/(n+1) + C (n ≠ −1). The constant C is the constant of integration.',
        },
        {
          stageId: 'y11-adv-l10-s10c', code: '10C', title: 'The Indefinite Integral',
          outcomeIds: ['MA-CALC-I01'], topicIds: ['MA-CALC-I01'],
          explanation: '∫f\'(x) dx = f(x) + C. Power rule: ∫xⁿ dx = xⁿ⁺¹/(n+1) + C. Find C using an initial condition. Definite integrals give numbers; indefinite integrals give families of functions.',
        },
        {
          stageId: 'y11-adv-l10-s10d', code: '10D', title: 'Areas of Compound Regions',
          outcomeIds: ['MA-CALC-I07'], topicIds: ['MA-CALC-I07'],
          explanation: 'For area below the x-axis, take the absolute value. For area between f and g: A = ∫[a,b] |f(x) − g(x)| dx. Find intersection points first to determine limits. Split at every crossing point.',
        },
      ],
    },
    // ── Chapter 11: Probability ───────────────────────────────────────────────
    {
      levelId: 'y11-adv-l11', levelNum: 11, title: 'Probability', emoji: '🎲', color: '#F59E0B',
      stages: [
        {
          stageId: 'y11-adv-l11-s11a', code: '11A', title: 'Probability and Sample Spaces',
          outcomeIds: ['MA-PROB-01'], topicIds: ['MA-PROB-01'],
          explanation: 'P(event) = favourable outcomes / total equally likely outcomes. Ranges from 0 to 1. List sample spaces using tables or systematic listing. Complementary events: P(not A) = 1 − P(A).',
        },
        {
          stageId: 'y11-adv-l11-s11b', code: '11B', title: 'Sample Space Graphs and Tree Diagrams',
          outcomeIds: ['MA-PROB-01'], topicIds: ['MA-PROB-01'],
          explanation: 'Use grids (sample space diagrams) for two-stage experiments. Tree diagrams list all outcomes as branches. Multiply along branches for probability of an outcome, add across branches.',
        },
        {
          stageId: 'y11-adv-l11-s11c', code: '11C', title: 'Sets and Venn Diagrams',
          outcomeIds: ['MA-PROB-01'], topicIds: ['MA-PROB-01'],
          explanation: 'Use set notation: A ∪ B (union), A ∩ B (intersection), A\' (complement). Venn diagrams show how sets overlap. Fill in regions using given information — work from the intersection outward.',
        },
        {
          stageId: 'y11-adv-l11-s11d', code: '11D', title: 'Venn Diagrams and the Addition Theorem',
          outcomeIds: ['MA-PROB-01'], topicIds: ['MA-PROB-01'],
          explanation: 'P(A ∪ B) = P(A) + P(B) − P(A ∩ B). Mutually exclusive: P(A ∩ B) = 0. Use the addition theorem to move between the algebraic and Venn diagram representations.',
        },
        {
          stageId: 'y11-adv-l11-s11e', code: '11E', title: 'Multi-Stage Experiments and the Product Rule',
          outcomeIds: ['MA-PROB-02'], topicIds: ['MA-PROB-02'],
          explanation: 'For independent events: P(A and B) = P(A) × P(B). For dependent events, multiply by conditional probability. Use tree diagrams to organise multi-stage experiments systematically.',
        },
        {
          stageId: 'y11-adv-l11-s11f', code: '11F', title: 'Probability Tree Diagrams',
          outcomeIds: ['MA-PROB-02'], topicIds: ['MA-PROB-02'],
          explanation: 'Tree diagrams display all outcomes of a multi-stage experiment. Multiply probabilities along each branch for the joint probability. Add branch probabilities for "or" (union) probabilities.',
        },
        {
          stageId: 'y11-adv-l11-s11g', code: '11G', title: 'Conditional Probability',
          outcomeIds: ['MA-PROB-02'], topicIds: ['MA-PROB-02'],
          explanation: 'P(A|B) = P(A ∩ B)/P(B). A and B are independent if P(A|B) = P(A). Use two-way tables for conditional probability questions: read the restricted sample space from the relevant row or column.',
        },
      ],
    },
    // ── Chapter 12: Discrete Probability Distributions ────────────────────────
    {
      levelId: 'y11-adv-l12', levelNum: 12, title: 'Probability Distributions', emoji: '📊', color: '#10B981',
      stages: [
        {
          stageId: 'y11-adv-l12-s12a', code: '12A', title: 'The Language of Probability Distributions',
          outcomeIds: ['MA-STAT-06'], topicIds: ['MA-STAT-06'],
          explanation: 'A probability distribution assigns P(X = x) to each value x. Requirements: all probabilities are non-negative and sum to 1. Display as a table or histogram.',
        },
        {
          stageId: 'y11-adv-l12-s12b', code: '12B', title: 'Expected Value',
          outcomeIds: ['MA-STAT-06'], topicIds: ['MA-STAT-06'],
          explanation: 'E(X) = μ = Σ x·P(X = x) is the expected value (long-run average). It need not be a value X can actually take. E(aX + b) = aE(X) + b for linear transformations.',
        },
        {
          stageId: 'y11-adv-l12-s12c', code: '12C', title: 'Variance and Standard Deviation',
          outcomeIds: ['MA-STAT-06'], topicIds: ['MA-STAT-06'],
          explanation: 'Var(X) = E(X²) − [E(X)]² = Σ x²P(x) − μ². Standard deviation σ = √Var(X). Var(aX + b) = a²Var(X). These measure the spread of the distribution around the mean.',
        },
        {
          stageId: 'y11-adv-l12-s12d', code: '12D', title: 'Sampling',
          outcomeIds: ['MA-STAT-06'], topicIds: ['MA-STAT-06'],
          explanation: 'A sample is a subset of a population. Random sampling gives every member an equal chance of selection. The sample mean x̄ is an estimate of the population mean μ. Larger samples give more reliable estimates.',
        },
      ],
    },
  ],
}

// ── YEAR 11 EXTENSION 1 ───────────────────────────────────────────────────────
const YEAR_11_EXT1_MISSION: Mission = {
  missionId: 'y11-ext1',
  title: 'Year 11 Extension 1',
  year: 11,
  course: 'extension1',
  shortLabel: 'Ext 1',
  levels: [
    // ── Chapter 1: Methods in Algebra ────────────────────────────────────────
    {
      levelId: 'y11-ext1-l1', levelNum: 1, title: 'Methods in Algebra', emoji: '✏️', color: '#6366F1',
      stages: [
        {
          stageId: 'y11-ext1-l1-s1a', code: '1A', title: 'Arithmetic with Algebraic Expressions',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'Collect like terms, expand using the distributive law, and simplify products. Master special expansions: (a+b)² = a²+2ab+b², (a−b)² = a²−2ab+b², a²−b² = (a+b)(a−b).',
          content: [
            { type: 'text', body: 'Algebra is the language of all higher mathematics. In this stage you will sharpen three core skills: collecting like terms, expanding brackets, and applying the three special-product identities that appear constantly throughout the Extension 1 course.' },
            { type: 'rules', heading: 'Like Terms', items: [
              'Like terms share the same variable(s) with the same exponent(s).',
              '3x² and −7x² are like terms; 3x² and 3x are NOT.',
              'Add or subtract the coefficients; the variable part stays the same.',
              'Example: 5x² − 2x + 3x² + 7x = 8x² + 5x',
            ]},
            { type: 'rules', heading: 'Expanding Brackets', items: [
              'Distributive law: a(b + c) = ab + ac',
              'FOIL for two binomials: (a+b)(c+d) = ac + ad + bc + bd',
              'Always expand before collecting like terms.',
            ]},
            { type: 'formula', latex: '(a+b)^2 = a^2 + 2ab + b^2', label: 'Perfect square (sum)' },
            { type: 'formula', latex: '(a-b)^2 = a^2 - 2ab + b^2', label: 'Perfect square (difference)' },
            { type: 'formula', latex: '(a+b)(a-b) = a^2 - b^2', label: 'Difference of two squares' },
            { type: 'example', question: 'Expand and simplify (3x − 2)² − (x + 1)(x − 1)', steps: [
              '(3x − 2)² = 9x² − 12x + 4   [perfect square identity]',
              '(x + 1)(x − 1) = x² − 1   [difference of squares]',
              'Result: 9x² − 12x + 4 − (x² − 1) = 8x² − 12x + 5',
            ]},
            { type: 'tip', body: 'Memorise the three special identities — they appear in over 80% of algebra questions. Write them out from memory at the start of every practice session until they are automatic.' },
          ],
        },
        {
          stageId: 'y11-ext1-l1-s1b', code: '1B', title: 'Factorising',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'Factorise by: (1) HCF, (2) difference of squares, (3) trinomials, (4) grouping, (5) sum/difference of cubes a³±b³=(a±b)(a²∓ab+b²). Always take the HCF before any other method.',
          content: [
            { type: 'text', body: 'Factorising is the reverse of expanding. A fully factorised expression cannot be broken down further. Mastery of all five factorisation methods is essential — they are used in solving equations, simplifying fractions, and sketching curves.' },
            { type: 'steps', heading: '5-Step Factorisation Checklist (always in this order)', items: [
              '1. Take out the Highest Common Factor (HCF) first — always.',
              '2. Check for Difference of Two Squares: a² − b² = (a+b)(a−b).',
              '3. Check for a perfect square trinomial: a² ± 2ab + b² = (a ± b)².',
              '4. Factorise a general trinomial ax² + bx + c by splitting the middle term.',
              '5. Try grouping in pairs for four-term expressions.',
            ]},
            { type: 'formula', latex: 'a^3 + b^3 = (a+b)(a^2 - ab + b^2)', label: 'Sum of cubes' },
            { type: 'formula', latex: 'a^3 - b^3 = (a-b)(a^2 + ab + b^2)', label: 'Difference of cubes' },
            { type: 'example', question: 'Factorise 2x³ − 16 completely', steps: [
              'Step 1 — HCF: 2x³ − 16 = 2(x³ − 8)',
              'Step 5 — Difference of cubes: x³ − 8 = x³ − 2³ = (x − 2)(x² + 2x + 4)',
              'Final answer: 2(x − 2)(x² + 2x + 4)',
            ]},
            { type: 'example', question: 'Factorise 6x² + x − 12', steps: [
              'Product = 6 × (−12) = −72; need two numbers that multiply to −72 and add to +1.',
              'Those numbers are +9 and −8: 9 × (−8) = −72, 9 + (−8) = 1.',
              'Split: 6x² + 9x − 8x − 12 = 3x(2x + 3) − 4(2x + 3) = (3x − 4)(2x + 3)',
            ]},
            { type: 'tip', body: 'ALWAYS take out the HCF first. Students who skip this step end up with messy quadratics that are hard to factorise. The HCF makes every subsequent step simpler.' },
          ],
        },
        {
          stageId: 'y11-ext1-l1-s1c', code: '1C', title: 'Algebraic Fractions',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'Simplify by factorising then cancelling. Add/subtract with LCD. Multiply by cancelling common factors first. Divide by multiplying by the reciprocal. Factorise completely before cancelling.',
          content: [
            { type: 'text', body: 'Algebraic fractions follow exactly the same rules as numerical fractions — the only extra step is factorising before you can cancel. Getting comfortable with algebraic fractions is critical for integration and rational function work later in the course.' },
            { type: 'rules', heading: 'Four Operations with Algebraic Fractions', items: [
              'Simplify: Factorise numerator and denominator fully, then cancel common factors.',
              'Multiply: Cancel any common factors across numerators and denominators first, then multiply across.',
              'Divide: Flip the second fraction (take its reciprocal), then multiply.',
              'Add/Subtract: Find the Lowest Common Denominator (LCD), rewrite each fraction with the LCD, then combine numerators.',
            ]},
            { type: 'example', question: 'Simplify $\\dfrac{x^2 - 4}{x^2 + 5x + 6}$', steps: [
              'Numerator: x² − 4 = (x+2)(x−2)',
              'Denominator: x² + 5x + 6 = (x+2)(x+3)',
              'Cancel (x+2): answer = $\\dfrac{x-2}{x+3}$',
            ]},
            { type: 'example', question: 'Add $\\dfrac{3}{x+1} + \\dfrac{2}{x-1}$', steps: [
              'LCD = (x+1)(x−1)',
              '$\\dfrac{3(x-1)}{(x+1)(x-1)} + \\dfrac{2(x+1)}{(x+1)(x-1)}$',
              '$= \\dfrac{3x - 3 + 2x + 2}{(x+1)(x-1)} = \\dfrac{5x - 1}{x^2 - 1}$',
            ]},
            { type: 'tip', body: 'Never cancel terms — only cancel factors. You cannot cancel the x in (x + 2)/x, because x is a term inside x + 2, not a factor of it. Factorise first, then cancel.' },
          ],
        },
        {
          stageId: 'y11-ext1-l1-s1d', code: '1D', title: 'Solving Linear and Quadratic Equations',
          outcomeIds: ['MA-ALG-03'], topicIds: ['MA-ALG-03'],
          explanation: 'Linear equations: isolate the variable using inverse operations. Quadratic: factorise, complete the square, or use x = (−b ± √Δ)/2a. Δ = b²−4ac determines the number of real solutions.',
          content: [
            { type: 'text', body: 'Equation solving is the most frequently tested skill across all HSC papers. You need three methods for quadratics and must choose the most efficient one for each question type.' },
            { type: 'rules', heading: 'Linear Equations', items: [
              'Isolate the unknown using inverse operations (opposite of + is −, opposite of × is ÷).',
              'Perform the same operation to both sides at every step.',
              'If the variable appears on both sides, collect all variable terms on one side first.',
            ]},
            { type: 'rules', heading: 'Three Methods for Quadratic Equations', items: [
              'Method 1 — Factorising: If factorisable, fastest. Set each factor = 0.',
              'Method 2 — Completing the Square: Convert to (x + p)² = q, then take the square root.',
              'Method 3 — Quadratic Formula: Always works. Use when factorising fails.',
            ]},
            { type: 'formula', latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}', label: 'Quadratic Formula' },
            { type: 'formula', latex: '\\Delta = b^2 - 4ac', label: 'Discriminant' },
            { type: 'table', headers: ['Δ value', 'Number of real solutions', 'Graph behaviour'], rows: [
              ['Δ > 0', 'Two distinct real roots', 'Parabola crosses x-axis twice'],
              ['Δ = 0', 'One repeated root', 'Parabola touches x-axis (tangent)'],
              ['Δ < 0', 'No real roots', 'Parabola does not cross x-axis'],
            ]},
            { type: 'example', question: 'Solve 2x² − 3x − 2 = 0 by factorising', steps: [
              'Find two numbers with product 2 × (−2) = −4 and sum −3: these are −4 and +1.',
              '2x² − 4x + x − 2 = 2x(x − 2) + 1(x − 2) = (2x + 1)(x − 2)',
              'x = −1/2 or x = 2',
            ]},
            { type: 'tip', body: 'Always check whether the quadratic factorises before reaching for the formula — factorising is faster and less error-prone. A quick test: compute b² − 4ac. If it is a perfect square, the quadratic factorises neatly.' },
          ],
        },
        {
          stageId: 'y11-ext1-l1-s1e', code: '1E', title: 'Solving Simultaneous Equations',
          outcomeIds: ['MA-ALG-03'], topicIds: ['MA-ALG-03'],
          explanation: 'Substitution or elimination for linear systems. For a line and a parabola, substitute the linear equation into the quadratic — the discriminant gives the number of intersections.',
          content: [
            { type: 'text', body: 'Simultaneous equations describe the points where two curves intersect. The method you choose depends on whether the system is purely linear or involves a non-linear curve (parabola, circle, hyperbola).' },
            { type: 'steps', heading: 'Method 1 — Substitution (best for mixed systems)', items: [
              '1. Make one variable the subject in one equation.',
              '2. Substitute the expression into the other equation.',
              '3. Solve the resulting single-variable equation.',
              '4. Back-substitute to find the other variable.',
              '5. Check both solutions in the original equations.',
            ]},
            { type: 'steps', heading: 'Method 2 — Elimination (best for two linear equations)', items: [
              '1. Multiply equations so one variable has equal (or opposite) coefficients.',
              '2. Add or subtract the equations to eliminate that variable.',
              '3. Solve for the remaining variable, then back-substitute.',
            ]},
            { type: 'example', question: 'Find the intersections of y = x + 1 and y = x² − 1', steps: [
              'Substitute y = x + 1 into y = x² − 1:',
              'x + 1 = x² − 1  →  x² − x − 2 = 0  →  (x−2)(x+1) = 0',
              'x = 2 or x = −1',
              'When x = 2: y = 3. When x = −1: y = 0.',
              'Intersection points: (2, 3) and (−1, 0).',
            ]},
            { type: 'text', body: 'When you substitute a linear equation into a quadratic, you always get a quadratic equation in one variable. The discriminant of that quadratic tells you how many intersections exist: Δ > 0 means two intersections, Δ = 0 means one (the line is a tangent), Δ < 0 means no intersection.' },
            { type: 'tip', body: 'For a line and parabola question that asks for conditions (e.g. "find the values of m for which the line is a tangent"), set up the substitution, form a quadratic, then apply Δ = 0.' },
          ],
        },
        {
          stageId: 'y11-ext1-l1-s1f', code: '1F', title: 'Completing the Square',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'ax²+bx+c = a(x+b/2a)²−(b²−4ac)/4a. This vertex form immediately gives vertex (−b/2a, −Δ/4a). Essential for graphing parabolas and will reappear in integration.',
          content: [
            { type: 'text', body: 'Completing the square is the technique of rewriting a quadratic expression into the form a(x + p)² + q. This "vertex form" immediately reveals the vertex of the parabola, and the technique reappears in Chapter 11 when integrating expressions like 1/(x² + bx + c).' },
            { type: 'steps', heading: 'Process for ax² + bx + c (a ≠ 1)', items: [
              '1. Factor out a from the x-terms: a(x² + (b/a)x) + c',
              '2. Inside the bracket, add and subtract (b/2a)².',
              '3. Rewrite the perfect square: a(x + b/2a)² − a·(b/2a)² + c',
              '4. Simplify the constant: −b²/4a + c = −Δ/4a  (where Δ = b²−4ac)',
              '5. Final form: a(x + b/2a)² − Δ/4a',
            ]},
            { type: 'formula', latex: 'ax^2 + bx + c = a\\!\\left(x + \\frac{b}{2a}\\right)^2 - \\frac{\\Delta}{4a}', label: 'Completed-square form' },
            { type: 'formula', latex: '\\text{Vertex} = \\left(-\\frac{b}{2a},\\; -\\frac{\\Delta}{4a}\\right)', label: 'Vertex of parabola' },
            { type: 'example', question: 'Complete the square for 2x² − 8x + 3', steps: [
              'Factor out 2 from x-terms: 2(x² − 4x) + 3',
              'Half of −4 is −2; (−2)² = 4. Add and subtract inside: 2(x² − 4x + 4 − 4) + 3',
              '= 2(x − 2)² − 8 + 3 = 2(x − 2)² − 5',
              'Vertex is (2, −5); parabola opens upward (a = 2 > 0).',
            ]},
            { type: 'tip', body: 'When a ≠ 1, students often forget to multiply the (b/2a)² correction by a when moving it outside the bracket. Write out every step — this is the most common source of errors in completing-the-square questions.' },
          ],
        },
      ],
    },
    // ── Chapter 2: Numbers and Surds ─────────────────────────────────────────
    {
      levelId: 'y11-ext1-l2', levelNum: 2, title: 'Numbers and Surds', emoji: '🔢', color: '#8B5CF6',
      stages: [
        {
          stageId: 'y11-ext1-l2-s2a', code: '2A', title: 'Real Numbers and Intervals',
          outcomeIds: ['MA-ALG-08'], topicIds: ['MA-ALG-08'],
          explanation: 'ℝ = rationals ∪ irrationals. Intervals: [a,b] closed, (a,b) open, [a,b) half-open. Represent solutions to inequalities as intervals and on number lines.',
          content: [
            { type: 'text', body: 'The real number system underpins everything in HSC Mathematics. Understanding how numbers are classified and how to represent sets of numbers using interval notation is the foundation for working with domains, ranges, and inequality solutions throughout the course.' },
            { type: 'table', headers: ['Set', 'Symbol', 'Examples', 'Key property'], rows: [
              ['Natural numbers', 'ℕ', '1, 2, 3, …', 'Counting numbers (positive integers)'],
              ['Integers', 'ℤ', '…, −2, −1, 0, 1, 2, …', 'Whole numbers including negatives'],
              ['Rational numbers', 'ℚ', '1/2, 0.75, −3', 'Can be written as p/q (p, q integers, q ≠ 0)'],
              ['Irrational numbers', '𝕀', '√2, π, e', 'Cannot be expressed as a fraction; decimal never terminates or repeats'],
              ['Real numbers', 'ℝ', 'All of the above', 'ℝ = ℚ ∪ 𝕀; every point on the number line'],
            ]},
            { type: 'rules', heading: 'Interval Notation', items: [
              '[a, b]: closed interval — includes both endpoints a and b.',
              '(a, b): open interval — excludes both endpoints.',
              '[a, b): half-open — includes a, excludes b.',
              '(a, ∞): all real numbers greater than a (∞ always uses a round bracket).',
              '(−∞, ∞) = ℝ: all real numbers.',
            ]},
            { type: 'example', question: 'Write the solution to −2 < x ≤ 5 in interval notation and on a number line', steps: [
              'Interval notation: (−2, 5]',
              'On the number line: open circle at −2, filled circle at 5, line connecting them.',
              'The open circle means −2 is NOT included; the filled circle means 5 IS included.',
            ]},
            { type: 'tip', body: 'Infinity (∞) is a concept, not a number — it can never be reached, so it ALWAYS gets a round bracket (never a square bracket). This is one of the most common notation errors in HSC responses.' },
          ],
        },
        {
          stageId: 'y11-ext1-l2-s2b', code: '2B', title: 'Surds and Their Arithmetic',
          outcomeIds: ['MA-ALG-08'], topicIds: ['MA-ALG-08'],
          explanation: '√(ab) = √a·√b. Simplify using the largest perfect-square factor: √72 = 6√2. Add like surds. Expand surd products using FOIL. Surds give exact answers — always preferred in exams.',
          content: [
            { type: 'text', body: 'A surd is an irrational root that cannot be simplified to a whole number or fraction — like √2 or ∛5. Surds arise naturally in geometry (diagonals, heights of triangles) and in solutions to quadratic equations. HSC questions almost always require exact answers, so you must be fluent with surd arithmetic.' },
            { type: 'formula', latex: '\\sqrt{ab} = \\sqrt{a} \\cdot \\sqrt{b} \\quad (a,b \\geq 0)', label: 'Product rule for surds' },
            { type: 'formula', latex: '\\sqrt{\\frac{a}{b}} = \\frac{\\sqrt{a}}{\\sqrt{b}} \\quad (a \\geq 0,\\; b > 0)', label: 'Quotient rule for surds' },
            { type: 'steps', heading: 'Simplifying Surds', items: [
              '1. Find the largest perfect-square factor of the number under the root.',
              '2. Write the radicand as that perfect square times the remainder.',
              '3. Apply the product rule and simplify the perfect square.',
              'Example: √72 = √(36 × 2) = √36 · √2 = 6√2',
            ]},
            { type: 'rules', heading: 'Adding and Subtracting Surds', items: [
              'Only like surds (same radicand) can be combined — just like like terms.',
              '3√2 + 5√2 = 8√2',
              '3√2 + 5√3 cannot be simplified further.',
              'Simplify each surd first, then check if they are like surds.',
            ]},
            { type: 'example', question: 'Simplify √50 − √18 + 2√8', steps: [
              '√50 = √(25×2) = 5√2',
              '√18 = √(9×2) = 3√2',
              '√8 = √(4×2) = 2√2, so 2√8 = 4√2',
              '5√2 − 3√2 + 4√2 = 6√2',
            ]},
            { type: 'tip', body: 'Always simplify each surd before trying to add or subtract. Students who try to combine surds without simplifying first will miss like terms and get the wrong answer.' },
          ],
        },
        {
          stageId: 'y11-ext1-l2-s2c', code: '2C', title: 'Further Simplification of Surds',
          outcomeIds: ['MA-ALG-08'], topicIds: ['MA-ALG-08'],
          explanation: 'Expand and simplify expressions like (3+2√5)²=29+12√5. Use conjugate (a+√b)(a−√b)=a²−b to obtain rational results. Practice quickly identifying the conjugate.',
          content: [
            { type: 'text', body: 'In this stage you will expand and simplify more complex surd expressions, including products and squares of binomials involving surds. The key identity is that the product of conjugate surd pairs always produces a rational number — this underpins rationalising the denominator in Stage 2D.' },
            { type: 'rules', heading: 'Expanding Surd Expressions', items: [
              'Use FOIL or the special identities — the algebra is identical to non-surd expressions.',
              'Remember: (√a)² = a for any a ≥ 0.',
              '(√a)(√b) = √(ab); collect like surd terms after expanding.',
            ]},
            { type: 'formula', latex: '(a + \\sqrt{b})(a - \\sqrt{b}) = a^2 - b', label: 'Conjugate pair — always rational' },
            { type: 'formula', latex: '(p + q\\sqrt{r})^2 = p^2 + q^2 r + 2pq\\sqrt{r}', label: 'Square of a surd binomial' },
            { type: 'example', question: 'Expand and simplify (3 + 2√5)²', steps: [
              'Using (p + q√r)² = p² + q²r + 2pq√r:',
              'p = 3, q = 2, r = 5',
              '= 9 + 4(5) + 2(3)(2)√5',
              '= 9 + 20 + 12√5 = 29 + 12√5',
            ]},
            { type: 'example', question: 'Expand (√6 + √2)(√6 − √2)', steps: [
              'This is a conjugate pair: (a + b)(a − b) = a² − b²',
              'a = √6, b = √2',
              '= (√6)² − (√2)² = 6 − 2 = 4',
              'The result is a whole number — no surds remain!',
            ]},
            { type: 'tip', body: 'Conjugate pairs are one of the most elegant tools in algebra. When you see (a + √b), immediately think "its conjugate is (a − √b), and their product is a² − b". This thought process will serve you across many topics.' },
          ],
        },
        {
          stageId: 'y11-ext1-l2-s2d', code: '2D', title: 'Rationalising the Denominator',
          outcomeIds: ['MA-ALG-08'], topicIds: ['MA-ALG-08'],
          explanation: 'Multiply 1/√a by √a/√a. Multiply 1/(a+√b) by (a−√b)/(a−√b). For nested surds 1/(√a+√b) use conjugate (√a−√b). Final answer must have a rational denominator.',
          content: [
            { type: 'text', body: 'A fraction with a surd in the denominator is not in simplified form. Rationalising means rewriting it with a rational denominator. This is required in all HSC exam answers and is also essential for later work on limits and integration.' },
            { type: 'steps', heading: 'Case 1: Single surd in denominator', items: [
              'Expression: a / √b',
              'Multiply top and bottom by √b:   a / √b × √b/√b = a√b / b',
              'Example: 6 / √3 = 6√3 / 3 = 2√3',
            ]},
            { type: 'steps', heading: 'Case 2: Binomial surd in denominator', items: [
              'Expression: p / (a + √b)',
              'The conjugate of (a + √b) is (a − √b).',
              'Multiply top and bottom by (a − √b):',
              'p(a − √b) / [(a + √b)(a − √b)] = p(a − √b) / (a² − b)',
              'The denominator is now rational.',
            ]},
            { type: 'example', question: 'Rationalise the denominator of $\\dfrac{4}{3 + \\sqrt{5}}$', steps: [
              'Conjugate of (3 + √5) is (3 − √5).',
              '$= \\dfrac{4(3 - \\sqrt{5})}{(3+\\sqrt{5})(3-\\sqrt{5})}$',
              'Denominator: 3² − (√5)² = 9 − 5 = 4.',
              '$= \\dfrac{4(3 - \\sqrt{5})}{4} = 3 - \\sqrt{5}$',
            ]},
            { type: 'example', question: 'Rationalise $\\dfrac{1}{\\sqrt{3} + \\sqrt{2}}$', steps: [
              'Conjugate: (√3 − √2).',
              '$= \\dfrac{\\sqrt{3} - \\sqrt{2}}{(\\sqrt{3})^2 - (\\sqrt{2})^2} = \\dfrac{\\sqrt{3} - \\sqrt{2}}{3 - 2} = \\sqrt{3} - \\sqrt{2}$',
            ]},
            { type: 'tip', body: 'Always state the conjugate you are using before multiplying. This makes your working clear to the marker and helps you avoid sign errors in the denominator.' },
          ],
        },
      ],
    },
    // ── Chapter 3: Functions and Graphs ──────────────────────────────────────
    {
      levelId: 'y11-ext1-l3', levelNum: 3, title: 'Functions and Graphs', emoji: '📉', color: '#0EA5E9',
      stages: [
        {
          stageId: 'y11-ext1-l3-s3a', code: '3A', title: 'Functions and Function Notation',
          outcomeIds: ['MA-FUNC-01', 'MA-FUNC-02'], topicIds: ['MA-FUNC-01', 'MA-FUNC-02'],
          explanation: 'A function maps each input to exactly one output (vertical line test). f(x) notation: evaluate by substituting. Domain restrictions: √x requires x≥0; 1/x requires x≠0.',
          content: [
            { type: 'text', body: 'A function is a rule that assigns exactly one output to every input in its domain. The function concept is fundamental — everything in the Extension 1 course (differentiation, integration, trig, inverses) is built on it.' },
            { type: 'rules', heading: 'Function vs Relation', items: [
              'A relation is any set of ordered pairs (x, y).',
              'A function is a special relation: each x-value maps to exactly ONE y-value.',
              'Vertical Line Test: draw a vertical line across the graph. If it crosses the graph at more than one point at any position, the graph is NOT a function.',
              'Example — function: y = x², y = sin x. NOT a function: x² + y² = 4 (circle), x = y².',
            ]},
            { type: 'rules', heading: 'Domain and Range', items: [
              'Domain: the set of all allowable x-values (inputs).',
              'Range: the set of all resulting y-values (outputs).',
              'Natural domain: the largest domain for which the function is defined.',
            ]},
            { type: 'table', headers: ['Expression', 'Restriction', 'Why'], rows: [
              ['√(f(x))', 'f(x) ≥ 0', 'Cannot take square root of a negative'],
              ['1/f(x)', 'f(x) ≠ 0', 'Cannot divide by zero'],
              ['log(f(x))', 'f(x) > 0', 'Log is only defined for positive arguments'],
            ]},
            { type: 'example', question: 'Find the natural domain of $f(x) = \\sqrt{4 - x^2}$', steps: [
              'Need 4 − x² ≥ 0   →   x² ≤ 4   →   −2 ≤ x ≤ 2',
              'Domain: [−2, 2]',
              'Note: this function describes the upper semicircle of radius 2.',
            ]},
            { type: 'tip', body: 'When a question asks you to evaluate f(2) or f(a + 1), replace every instance of x in the formula with the given expression. Bracket the substitution to avoid sign errors: f(a+1) = 3(a+1)² − 2 not 3a+1² − 2.' },
          ],
        },
        {
          stageId: 'y11-ext1-l3-s3b', code: '3B', title: 'Functions, Relations, and Graphs',
          outcomeIds: ['MA-FUNC-02'], topicIds: ['MA-FUNC-02'],
          explanation: 'Key graphs: line, parabola (y=x²), cubic (y=x³), hyperbola (y=1/x), square root (y=√x), absolute value (y=|x|). For each: identify domain, range, intercepts, and key features.',
          content: [
            { type: 'text', body: 'You need to instantly recognise and sketch six fundamental function shapes. These form the building blocks that will be translated, dilated, reflected, and combined throughout the rest of the course.' },
            { type: 'table', headers: ['Function', 'Shape', 'Domain', 'Range', 'Key features'], rows: [
              ['y = x', 'Straight line', 'ℝ', 'ℝ', 'Through origin, gradient 1'],
              ['y = x²', 'Parabola (U)', 'ℝ', '[0, ∞)', 'Vertex at origin, symmetric about y-axis'],
              ['y = x³', 'Cubic (S)', 'ℝ', 'ℝ', 'Inflection at origin, odd function'],
              ['y = 1/x', 'Hyperbola', 'x ≠ 0', 'y ≠ 0', 'Asymptotes: x = 0 and y = 0'],
              ['y = √x', 'Half-parabola', '[0, ∞)', '[0, ∞)', 'Starts at origin, curves right'],
              ['y = |x|', 'V-shape', 'ℝ', '[0, ∞)', 'Vertex at origin, gradient ±1'],
            ]},
            { type: 'rules', heading: 'Sketching Checklist', items: [
              'Find x-intercepts: set y = 0 and solve.',
              'Find y-intercept: substitute x = 0.',
              'Find domain and range.',
              'Identify key features: vertex, asymptotes, turning points.',
              'Check end behaviour: what happens as x → ±∞?',
            ]},
            { type: 'tip', body: 'Draw these six graphs from memory every day for the first week of this chapter. Knowing their shapes instinctively is the prerequisite for everything in Chapters 5 and 6 (transformations and further graphs).' },
          ],
        },
        {
          stageId: 'y11-ext1-l3-s3c', code: '3C', title: 'Review of Linear Graphs',
          outcomeIds: ['MA-COORD-02'], topicIds: ['MA-COORD-02'],
          explanation: 'y = mx+b: m = gradient = rise/run, b = y-intercept. Find equation from two points. Parallel: equal gradients. Perpendicular: m₁m₂ = −1. Gradient of vertical line is undefined.',
          content: [
            { type: 'text', body: 'Linear graphs underpin many Extension 1 topics — tangents to curves, lines intersecting parabolas, normal lines in differentiation. This stage consolidates the core formulas and relationships you need to know instantly.' },
            { type: 'formula', latex: 'm = \\frac{y_2 - y_1}{x_2 - x_1} = \\frac{\\text{rise}}{\\text{run}}', label: 'Gradient between two points' },
            { type: 'formula', latex: 'y - y_1 = m(x - x_1)', label: 'Point-gradient form (most useful)' },
            { type: 'formula', latex: 'y = mx + b', label: 'Gradient-intercept form' },
            { type: 'rules', heading: 'Parallel and Perpendicular Lines', items: [
              'Parallel lines: same gradient, m₁ = m₂ (but different y-intercepts).',
              'Perpendicular lines: gradients multiply to −1, i.e. m₁ × m₂ = −1.',
              'So if m₁ = 3, the perpendicular gradient is m₂ = −1/3.',
              'Horizontal line y = c has gradient 0. Vertical line x = k has undefined gradient.',
            ]},
            { type: 'example', question: 'Find the equation of the line through (1, −2) perpendicular to 2x − 3y + 6 = 0', steps: [
              'Rewrite: 3y = 2x + 6  →  y = (2/3)x + 2. Gradient = 2/3.',
              'Perpendicular gradient = −3/2.',
              'Using point-gradient: y − (−2) = −3/2(x − 1)',
              'y + 2 = −3/2 x + 3/2  →  y = −3/2 x − 1/2',
              'Or: 2y = −3x − 1  →  3x + 2y + 1 = 0',
            ]},
            { type: 'tip', body: 'Point-gradient form y − y₁ = m(x − x₁) is almost always the quickest way to write the equation of a line when you know the gradient and one point. Expand to y = mx + b only if the question requests that form.' },
          ],
        },
        {
          stageId: 'y11-ext1-l3-s3d', code: '3D', title: 'Quadratic Functions — Factoring and the Graph',
          outcomeIds: ['MA-ALG-02'], topicIds: ['MA-ALG-02'],
          explanation: 'y = a(x−p)(x−q): x-intercepts at p and q; axis of symmetry at x = (p+q)/2; vertex at the midpoint. Sign of a determines whether parabola opens up (a>0) or down (a<0).',
          content: [
            { type: 'text', body: 'The factored form of a quadratic immediately reveals its roots (x-intercepts) and the axis of symmetry. This is the most useful form for sketching and for intersection problems.' },
            { type: 'formula', latex: 'y = a(x - p)(x - q)', label: 'Factored form — roots at x = p and x = q' },
            { type: 'formula', latex: '\\text{Axis of symmetry: }\\; x = \\frac{p + q}{2}', label: 'Midpoint of the roots' },
            { type: 'rules', heading: 'Reading the Graph from Factored Form', items: [
              'x-intercepts: the roots p and q (set y = 0).',
              'y-intercept: substitute x = 0 to get y = apq.',
              'Axis of symmetry: x = (p + q)/2 (midpoint of the two roots).',
              'Vertex: substitute the axis value into y to find the y-coordinate.',
              'Opens up if a > 0; opens down if a < 0.',
            ]},
            { type: 'example', question: 'Sketch y = −2(x + 1)(x − 3)', steps: [
              'x-intercepts: x = −1 and x = 3 (set each factor to 0).',
              'y-intercept: y = −2(0+1)(0−3) = −2(1)(−3) = 6.',
              'Axis of symmetry: x = (−1 + 3)/2 = 1.',
              'Vertex: y = −2(1+1)(1−3) = −2(2)(−2) = 8. Vertex: (1, 8).',
              'Opens downward (a = −2 < 0). Sketch an inverted parabola through (−1,0), (0,6), (1,8), (3,0).',
            ]},
            { type: 'tip', body: 'Always find the y-intercept (x = 0) and the vertex when sketching a parabola — these five points (two roots, y-intercept, vertex, and axis) fully define the shape.' },
          ],
        },
        {
          stageId: 'y11-ext1-l3-s3e', code: '3E', title: 'Completing the Square and the Graph',
          outcomeIds: ['MA-ALG-02'], topicIds: ['MA-ALG-02'],
          explanation: 'Vertex form y = a(x−h)²+k: vertex (h,k), axis x = h. To convert: complete the square. The vertex is the minimum if a>0 (maximum if a<0).',
          content: [
            { type: 'text', body: 'Vertex form directly reveals the vertex and axis of symmetry without needing to find the roots. It is especially useful when the quadratic does not factorise (i.e. the discriminant is not a perfect square).' },
            { type: 'formula', latex: 'y = a(x - h)^2 + k', label: 'Vertex form — vertex at (h, k)' },
            { type: 'rules', heading: 'Reading the Graph from Vertex Form', items: [
              'Vertex: (h, k). Note the minus sign — if the equation is (x − 3)², then h = 3.',
              'Axis of symmetry: x = h.',
              'Minimum value k if a > 0 (parabola opens up); maximum value k if a < 0 (opens down).',
              'y-intercept: substitute x = 0.',
              'x-intercepts: set y = 0, solve a(x−h)² = −k  →  x = h ± √(−k/a). These exist only when −k/a ≥ 0.',
            ]},
            { type: 'example', question: 'Sketch y = 2(x − 1)² − 8', steps: [
              'Vertex: (1, −8). Axis: x = 1. Opens upward (a = 2 > 0).',
              'x-intercepts: 2(x−1)² = 8  →  (x−1)² = 4  →  x−1 = ±2  →  x = 3 or x = −1.',
              'y-intercept: y = 2(0−1)² − 8 = 2 − 8 = −6.',
              'Sketch: upward parabola, vertex at (1, −8), crossing x-axis at −1 and 3, y-intercept at −6.',
            ]},
            { type: 'tip', body: 'When a question says "find the minimum value of…" — immediately complete the square. The vertex form hands you the answer directly. This is much faster than using x = −b/2a and then substituting back.' },
          ],
        },
        {
          stageId: 'y11-ext1-l3-s3f', code: '3F', title: 'The Quadratic Formula and the Discriminant',
          outcomeIds: ['MA-ALG-01', 'MA-ALG-02'], topicIds: ['MA-ALG-01', 'MA-ALG-02'],
          explanation: 'x = (−b ± √Δ)/2a where Δ = b²−4ac. Δ > 0: two real roots. Δ = 0: one (tangent to x-axis). Δ < 0: no real roots. Use Δ to determine conditions on parameters (e.g. find k so Δ > 0).',
          content: [
            { type: 'text', body: 'The discriminant Δ = b² − 4ac is one of the most powerful tools in the HSC course. It not only tells you the number of real roots but also enables you to solve "find the values of k for which…" parameter questions that appear frequently in exams.' },
            { type: 'formula', latex: 'x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}, \\quad \\Delta = b^2 - 4ac', label: 'Quadratic formula and discriminant' },
            { type: 'table', headers: ['Discriminant', 'Number of real roots', 'Graph description'], rows: [
              ['Δ > 0', 'Two distinct real roots', 'Parabola crosses x-axis at two points'],
              ['Δ = 0', 'One repeated (double) root', 'Parabola is tangent to the x-axis'],
              ['Δ < 0', 'No real roots', 'Parabola does not intersect the x-axis'],
            ]},
            { type: 'example', question: 'Find the values of k for which 3x² + 2x + k = 0 has two distinct real roots', steps: [
              'For two distinct roots: Δ > 0.',
              'Δ = b² − 4ac = (2)² − 4(3)(k) = 4 − 12k.',
              '4 − 12k > 0  →  12k < 4  →  k < 1/3.',
              'Answer: k < 1/3.',
            ]},
            { type: 'example', question: 'For what value of m is y = mx − 1 tangent to y = x²?', steps: [
              'At the tangent point: x² = mx − 1  →  x² − mx + 1 = 0.',
              'For a tangent (one intersection): Δ = 0.',
              'Δ = m² − 4(1)(1) = m² − 4 = 0  →  m = ±2.',
            ]},
            { type: 'tip', body: 'For any "find k" question involving quadratics, immediately set up Δ > 0, Δ = 0, or Δ < 0 depending on whether the question asks for two roots, one root (tangent), or no real roots. This is a guaranteed technique for these question types.' },
          ],
        },
        {
          stageId: 'y11-ext1-l3-s3g', code: '3G', title: 'Powers, Cubics, and Circles',
          outcomeIds: ['MA-FUNC-07'], topicIds: ['MA-FUNC-07'],
          explanation: 'y = xⁿ: even n gives a U-shape (symmetric about y-axis); odd n gives an S-shape. Cubic y = x³ has a horizontal tangent at origin. Circle (x−h)²+(y−k)²=r²: complete the square to find centre and radius.',
          content: [
            { type: 'text', body: 'Beyond parabolas and lines, you need to know the shapes of power functions and circles. The circle is not a function (it fails the vertical line test), but it is a relation that appears frequently in geometry, parametrics, and integration problems.' },
            { type: 'rules', heading: 'Power Functions y = xⁿ', items: [
              'Even n (y = x², x⁴, x⁶, …): U-shaped, symmetric about y-axis (even function). Minimum at origin.',
              'Odd n (y = x³, x⁵, x⁷, …): S-shaped, symmetric about the origin (odd function). Inflection at origin.',
              'As n increases, the graph is flatter near 0 and steeper for |x| > 1.',
              'Key: y = x³ has a horizontal tangent at the origin (gradient = 0 at x = 0).',
            ]},
            { type: 'formula', latex: '(x - h)^2 + (y - k)^2 = r^2', label: 'Circle with centre (h, k) and radius r' },
            { type: 'steps', heading: 'Finding centre and radius by completing the square', items: [
              'Group x-terms and y-terms: (x² + 2gx) + (y² + 2fy) = −c.',
              'Complete the square for x: add and subtract g².',
              'Complete the square for y: add and subtract f².',
              'Rewrite as (x + g)² + (y + f)² = g² + f² − c.',
              'Centre = (−g, −f); radius = √(g² + f² − c).',
            ]},
            { type: 'example', question: 'Find the centre and radius of x² + y² − 4x + 6y − 3 = 0', steps: [
              '(x² − 4x) + (y² + 6y) = 3',
              '(x² − 4x + 4) + (y² + 6y + 9) = 3 + 4 + 9 = 16',
              '(x − 2)² + (y + 3)² = 16',
              'Centre: (2, −3); radius: 4.',
            ]},
            { type: 'tip', body: 'When completing the square for a circle, remember to add the same amounts to BOTH sides of the equation. Students often add to the left but forget to add to the right — this changes the circle entirely.' },
          ],
        },
        {
          stageId: 'y11-ext1-l3-s3h', code: '3H', title: 'Two Graphs with Asymptotes',
          outcomeIds: ['MA-FUNC-07'], topicIds: ['MA-FUNC-07'],
          explanation: 'y = 1/x: asymptotes at x=0, y=0; branches in Q1 and Q3. y = 1/x²: asymptotes at x=0, y=0; both branches above x-axis (always positive). Transformations shift the asymptotes.',
          content: [
            { type: 'text', body: 'The hyperbola y = 1/x and the truncus y = 1/x² are foundational graphs with asymptotes. Understanding them is essential for sketching reciprocal functions in Chapter 6 and for understanding limits in calculus.' },
            { type: 'table', headers: ['Feature', 'y = 1/x (hyperbola)', 'y = 1/x² (truncus)'], rows: [
              ['Vertical asymptote', 'x = 0', 'x = 0'],
              ['Horizontal asymptote', 'y = 0', 'y = 0'],
              ['Domain', 'x ≠ 0, i.e. (−∞,0)∪(0,∞)', 'x ≠ 0'],
              ['Range', 'y ≠ 0', 'y > 0'],
              ['Branches', 'Q1 and Q3 (odd function)', 'Both above x-axis (even function)'],
              ['Symmetry', 'Rotational symmetry about origin', 'Symmetric about y-axis'],
            ]},
            { type: 'rules', heading: 'Effect of Transformations on Asymptotes', items: [
              'y = 1/(x − h) + k: vertical asymptote moves to x = h, horizontal to y = k.',
              'The overall shape is identical to y = 1/x, just translated.',
              'The branches shift accordingly: if k > 0, both branches shift up.',
            ]},
            { type: 'example', question: 'Sketch $y = \\dfrac{1}{x-2} + 3$ and state its asymptotes', steps: [
              'Start with y = 1/x and apply transformations:',
              'Shift right 2: vertical asymptote moves to x = 2.',
              'Shift up 3: horizontal asymptote moves to y = 3.',
              'Branches are still in the regions above y = 3 (Q1-type) and below y = 3 (Q3-type) relative to the asymptotes.',
              'y-intercept: x = 0  →  y = 1/(0−2) + 3 = −1/2 + 3 = 5/2.',
            ]},
            { type: 'tip', body: 'Asymptotes are the skeleton of these graphs. Draw them as dashed lines first, then draw the branches approaching (but never touching) the asymptotes.' },
          ],
        },
        {
          stageId: 'y11-ext1-l3-s3i', code: '3I', title: 'Direct and Inverse Variation',
          outcomeIds: ['MA-ALG-05'], topicIds: ['MA-ALG-05'],
          explanation: 'Direct variation: y = kx (or y = kxⁿ) — graph through origin. Inverse variation: y = k/x — hyperbola. Find k from a given data pair, then use the formula to answer questions.',
          content: [
            { type: 'text', body: 'Variation describes how one quantity changes relative to another. Direct and inverse variation relationships appear in physics (Boyle\'s Law, gravity, springs) and in modelling questions on the HSC.' },
            { type: 'table', headers: ['Type', 'Formula', 'Graph', 'Key property'], rows: [
              ['Direct variation', 'y = kx', 'Straight line through origin', 'Doubling x doubles y'],
              ['Direct (power)', 'y = kxⁿ', 'Power curve through origin', 'y ∝ xⁿ'],
              ['Inverse variation', 'y = k/x', 'Hyperbola', 'Doubling x halves y'],
              ['Inverse (power)', 'y = k/xⁿ', 'Truncus-type curve', 'y ∝ 1/xⁿ'],
            ]},
            { type: 'steps', heading: 'Finding the constant of variation k', items: [
              '1. Identify the type of variation from the problem (e.g. "y varies directly as x²").',
              '2. Write the formula: y = kx² (for this example).',
              '3. Substitute the given data pair (x₀, y₀) to find k = y₀/x₀².',
              '4. Rewrite the formula with the found k.',
              '5. Use the formula to answer further questions.',
            ]},
            { type: 'example', question: 'y varies inversely as x². When x = 3, y = 4. Find y when x = 6.', steps: [
              'y = k/x².  Substituting x = 3, y = 4:  4 = k/9  →  k = 36.',
              'Formula: y = 36/x².',
              'When x = 6: y = 36/36 = 1.',
            ]},
            { type: 'tip', body: 'The phrase "y varies directly as x²" means y = kx²; "y varies inversely as x²" means y = k/x². Identify the key phrase and write the formula before doing anything else.' },
          ],
        },
      ],
    },
    // ── Chapter 4: Equations and Inequations ─────────────────────────────────
    {
      levelId: 'y11-ext1-l4', levelNum: 4, title: 'Equations and Inequations', emoji: '⚖️', color: '#EC4899',
      stages: [
        {
          stageId: 'y11-ext1-l4-s4a', code: '4A', title: 'Linear Equations and Inequations',
          outcomeIds: ['MA-ALG-03'], topicIds: ['MA-ALG-03'],
          explanation: 'Solve linear equations by isolating the variable. For inequalities, reverse the sign when multiplying or dividing by a negative. Express solutions as intervals or on a number line.',
          content: [
            { type: 'text', body: 'Linear equations and inequalities are the entry point for all equation-solving. The critical rule for inequalities — reverse the inequality sign when multiplying or dividing by a negative — trips up many students under exam pressure.' },
            { type: 'rules', heading: 'Solving Linear Equations', items: [
              'Perform the same inverse operation to both sides at every step.',
              'Clear fractions first by multiplying through by the LCD.',
              'If x appears on both sides, collect variable terms on one side and constants on the other.',
            ]},
            { type: 'rules', heading: 'CRITICAL Rule for Inequalities', items: [
              'Adding or subtracting a number: inequality sign stays the same.',
              'Multiplying or dividing by a POSITIVE number: sign stays the same.',
              'Multiplying or dividing by a NEGATIVE number: REVERSE the inequality sign.',
              'Example: −3x > 6  →  x < −2  (sign reversed when dividing by −3).',
            ]},
            { type: 'example', question: 'Solve $\\dfrac{2x-1}{3} - \\dfrac{x+2}{2} \\leq 1$', steps: [
              'Multiply through by 6 (LCD of 3 and 2): 2(2x−1) − 3(x+2) ≤ 6',
              '4x − 2 − 3x − 6 ≤ 6',
              'x − 8 ≤ 6',
              'x ≤ 14',
              'Solution: (−∞, 14]',
            ]},
            { type: 'tip', body: 'When you multiply or divide an inequality by a negative, write "FLIP" in the margin so you do not forget to reverse the sign. This single oversight causes more lost marks than almost any other error.' },
          ],
        },
        {
          stageId: 'y11-ext1-l4-s4b', code: '4B', title: 'Quadratic Equations and Inequations',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'To solve ax²+bx+c > 0 or < 0: find roots (where =0), then use a sign diagram to determine where the expression is positive or negative. Sketch the parabola to read off the solution.',
          content: [
            { type: 'text', body: 'Quadratic inequalities require a different approach to linear ones — you cannot simply "solve and reverse." The key tool is the sign diagram (or equivalently, sketching the parabola), which shows where the quadratic is positive or negative.' },
            { type: 'steps', heading: 'Sign Diagram Method for ax² + bx + c > 0', items: [
              '1. Find the roots by solving ax² + bx + c = 0 (factorise or use the formula).',
              '2. Draw a number line and mark the roots.',
              '3. Test a value in each interval (left of smaller root, between roots, right of larger root).',
              '4. Mark + or − in each interval based on the test.',
              '5. Read off the solution: the intervals where the sign matches the inequality.',
            ]},
            { type: 'example', question: 'Solve x² − x − 6 < 0', steps: [
              'Factorise: x² − x − 6 = (x − 3)(x + 2) = 0  →  roots: x = 3 and x = −2.',
              'Sign diagram: test x = 0 (between roots): (0−3)(0+2) = (−3)(2) = −6 < 0. ✓ negative.',
              'test x = 4 (right of 3): (1)(6) > 0, positive.',
              'test x = −3 (left of −2): (−6)(−1) > 0, positive.',
              'The quadratic is negative only between the roots.',
              'Solution: −2 < x < 3, i.e. (−2, 3).',
            ]},
            { type: 'rules', heading: 'Quick Rule (when a > 0)', items: [
              'If a > 0 (opens upward), the parabola is BELOW zero BETWEEN the roots.',
              'ax² + bx + c < 0  →  solution is the interval BETWEEN the two roots: (p, q).',
              'ax² + bx + c > 0  →  solution is OUTSIDE the roots: (−∞, p) ∪ (q, ∞).',
              'This quick rule only applies when the parabola opens upward (a > 0).',
            ]},
            { type: 'tip', body: 'Always check the sign of the leading coefficient a first. If a < 0, the parabola opens downward and the "inside/outside" rule reverses. The sign diagram method always works regardless of the sign of a.' },
          ],
        },
        {
          stageId: 'y11-ext1-l4-s4c', code: '4C', title: 'The Discriminant',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'Δ = b²−4ac. Use Δ to prove equations have solutions, to find the number of intersections of a line and a parabola, or to find values of a parameter for which a quadratic has real/equal/no roots.',
          content: [
            { type: 'text', body: 'The discriminant is a powerful single number that encodes everything about the nature of a quadratic\'s roots. Extension 1 uses it to answer questions about conditions on parameters — a high-frequency exam question type.' },
            { type: 'formula', latex: '\\Delta = b^2 - 4ac', label: 'Discriminant of ax² + bx + c' },
            { type: 'table', headers: ['Condition', 'Meaning', 'Graphical interpretation'], rows: [
              ['Δ > 0', 'Two distinct real roots', 'Parabola crosses x-axis twice'],
              ['Δ = 0', 'Equal (double) root', 'Parabola touches x-axis (tangent)'],
              ['Δ < 0', 'No real roots', 'Parabola entirely above or below x-axis'],
              ['Δ ≥ 0', 'At least one real root', 'Parabola meets x-axis'],
            ]},
            { type: 'example', question: 'Prove that x² + 3x + 5 > 0 for all real x', steps: [
              'Compute Δ: b² − 4ac = 9 − 20 = −11 < 0.',
              'Since Δ < 0, the quadratic has no real roots — it never crosses the x-axis.',
              'Since a = 1 > 0, the parabola opens upward and lies entirely above the x-axis.',
              'Therefore x² + 3x + 5 > 0 for all real x. ∎',
            ]},
            { type: 'example', question: 'Find the values of m for which mx² − 4x + m = 0 has two distinct real roots', steps: [
              'If m = 0: the equation becomes −4x = 0  →  x = 0 (only one root, not two distinct).',
              'If m ≠ 0: compute Δ = (−4)² − 4(m)(m) = 16 − 4m².',
              'For two distinct roots: Δ > 0  →  16 − 4m² > 0  →  m² < 4  →  −2 < m < 2.',
              'Combined with m ≠ 0: solution is −2 < m < 0 or 0 < m < 2.',
            ]},
            { type: 'tip', body: 'When the coefficient of x² contains the parameter (like mx²), always first check the case m = 0 separately — it might not give a quadratic at all, or might give a degenerate case that violates the required condition.' },
          ],
        },
        {
          stageId: 'y11-ext1-l4-s4d', code: '4D', title: 'Quadratic Identities',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'A quadratic identity holds for ALL values of x. Equate coefficients of x², x, and the constant term to find unknown constants. Example: 2x²+5x+1 ≡ a(x+1)² + b(x+1) + c — find a, b, c.',
          content: [
            { type: 'text', body: 'A quadratic identity (≡) is an equation that holds for all values of x — unlike an equation which holds only for specific values. To find unknown constants in an identity, you can equate coefficients or substitute convenient values of x.' },
            { type: 'rules', heading: 'Two Methods for Finding Constants', items: [
              'Method 1 — Equate Coefficients: Expand the right-hand side, then match coefficients of x², x, and the constant term on both sides.',
              'Method 2 — Substitution: Substitute specific x-values (often the roots of factors on the RHS) to find each constant directly. This is faster when the factors are linear.',
              'Both methods must give the same answer — use one to find and the other to check.',
            ]},
            { type: 'example', question: 'Find a, b, c if 2x² + 5x + 1 ≡ a(x+1)² + b(x+1) + c', steps: [
              'Method 2 (substitution):',
              'x = −1: 2(1) + 5(−1) + 1 = −2. RHS = a(0) + b(0) + c  →  c = −2.',
              'x = 0: 0 + 0 + 1 = 1. RHS = a(1) + b(1) + c = a + b − 2  →  a + b = 3.',
              'Equate x² coefficients: 2 = a.',
              'So a = 2, b = 3 − 2 = 1, c = −2.',
              'Verify: 2(x+1)² + 1(x+1) − 2 = 2x²+4x+2 + x+1 − 2 = 2x²+5x+1. ✓',
            ]},
            { type: 'tip', body: 'Quadratic identities are the foundation of partial fractions and completing-the-square proofs. The substitution method is almost always faster — substitute x = the root of each linear factor to isolate one constant at a time.' },
          ],
        },
      ],
    },
    // ── Chapter 5: Transformations and Symmetry ───────────────────────────────
    {
      levelId: 'y11-ext1-l5', levelNum: 5, title: 'Transformations and Symmetry', emoji: '🔄', color: '#F59E0B',
      stages: [
        {
          stageId: 'y11-ext1-l5-s5a', code: '5A', title: 'Translations of Known Graphs',
          outcomeIds: ['MA-FUNC-05'], topicIds: ['MA-FUNC-05'],
          explanation: 'y = f(x)+k shifts up by k. y = f(x−h) shifts right by h. Combine: y = f(x−h)+k gives right h, up k. Apply the translation to every key feature (vertex, intercepts, asymptotes).',
          content: [
            { type: 'text', body: 'Every graph in this course is a transformation of one of the six fundamental shapes from Stage 3B. Translations move the graph without changing its shape. Understanding them lets you sketch complex functions immediately from their equations.' },
            { type: 'table', headers: ['Transformation', 'Effect', 'What moves?'], rows: [
              ['y = f(x) + k  (k > 0)', 'Shift UP k units', 'All y-values increase by k'],
              ['y = f(x) + k  (k < 0)', 'Shift DOWN |k| units', 'All y-values decrease by |k|'],
              ['y = f(x − h)  (h > 0)', 'Shift RIGHT h units', 'All x-values increase by h'],
              ['y = f(x − h)  (h < 0)', 'Shift LEFT |h| units', 'All x-values decrease by |h|'],
              ['y = f(x − h) + k', 'Right h, up k', 'Both x and y shifted'],
            ]},
            { type: 'rules', heading: 'Key Features to Update After a Translation', items: [
              'Vertex of parabola: (h, k) in y = a(x−h)² + k.',
              'Asymptotes of hyperbola: x = h, y = k in y = 1/(x−h) + k.',
              'Centre of circle: shifts by (h, k).',
              'x-intercepts and y-intercept: substitute x = 0 or y = 0 after translating.',
            ]},
            { type: 'example', question: 'Describe the transformations mapping y = x² to y = (x+2)² − 3', steps: [
              'y = (x − (−2))² + (−3):  h = −2, k = −3.',
              'Shift LEFT 2 units and DOWN 3 units.',
              'Vertex moves from (0,0) to (−2, −3).',
              'Axis of symmetry: x = −2.',
            ]},
            { type: 'tip', body: 'The horizontal translation is "anti-intuitive" — y = f(x − 3) shifts RIGHT not left. Remember: to make (x − 3) = 0, you need x = 3, so the origin of the new graph is at x = 3.' },
          ],
        },
        {
          stageId: 'y11-ext1-l5-s5b', code: '5B', title: 'Reflection in the y-axis and x-axis',
          outcomeIds: ['MA-FUNC-05'], topicIds: ['MA-FUNC-05'],
          explanation: 'y = f(−x): reflect in the y-axis (replace every x with −x). y = −f(x): reflect in the x-axis (negate all y-values). Apply to any graph by considering how the key features move.',
          content: [
            { type: 'text', body: 'Reflections are rigid transformations that flip the graph over a line of symmetry. Together with translations and dilations, they form the complete toolkit for analysing any transformed function.' },
            { type: 'table', headers: ['Transformation', 'Effect', 'Rule'], rows: [
              ['y = f(−x)', 'Reflect in y-axis', 'Every point (a, b) maps to (−a, b)'],
              ['y = −f(x)', 'Reflect in x-axis', 'Every point (a, b) maps to (a, −b)'],
              ['y = −f(−x)', 'Reflect in both axes', 'Every point (a, b) maps to (−a, −b)  [180° rotation]'],
            ]},
            { type: 'rules', heading: 'How Key Features Change', items: [
              'y = f(−x): x-intercepts negate (p → −p); y-intercept unchanged; asymptotes reflect (x=a becomes x=−a).',
              'y = −f(x): y-intercept negates; x-intercepts unchanged; max becomes min.',
              'Always check: does the new graph make sense by testing a point?',
            ]},
            { type: 'example', question: 'If the graph of y = f(x) has a maximum at (2, 5) and passes through (0, 1), describe the graph of y = −f(x + 1)', steps: [
              'First apply x → x+1 (shift left 1): max moves to (1, 5), y-intercept goes to (−1, 1).',
              'Then apply y → −y (reflect in x-axis): max at (1,5) becomes min at (1, −5).',
              'The y-intercept of y = −f(x+1) at x=0: −f(0+1) = −f(1).',
              'Since the maximum was at (2, 5) and after shifting left 1 the max is at x=1, f(1)=5, so −f(1) = −5.',
            ]},
            { type: 'tip', body: 'When you see y = −f(x), think: "flip upside down." The shape is identical but inverted. A minimum becomes a maximum, a parabola opening up now opens down, and all y-values change sign.' },
          ],
        },
        {
          stageId: 'y11-ext1-l5-s5c', code: '5C', title: 'Even and Odd Symmetry',
          outcomeIds: ['MA-FUNC-05'], topicIds: ['MA-FUNC-05'],
          explanation: 'Even: f(−x) = f(x) — symmetric about y-axis (e.g. y=x², y=cos x). Odd: f(−x) = −f(x) — symmetric about the origin (e.g. y=x³, y=sin x). Test by substituting −x.',
          content: [
            { type: 'text', body: 'Even and odd functions have special symmetry properties that simplify integration (a definite integral of an odd function over a symmetric interval is zero) and graphing (half the work).' },
            { type: 'table', headers: ['Property', 'Even function', 'Odd function'], rows: [
              ['Defining condition', 'f(−x) = f(x)', 'f(−x) = −f(x)'],
              ['Symmetry', 'About the y-axis', 'About the origin (rotational)'],
              ['Graph property', 'Mirror image across y-axis', '180° rotational symmetry about origin'],
              ['Examples', 'x², x⁴, cos x, |x|', 'x, x³, sin x, tan x'],
              ['Integral over [−a, a]', '2∫₀ᵃ f(x) dx', '0'],
            ]},
            { type: 'steps', heading: 'Testing for Even/Odd Symmetry', items: [
              '1. Substitute −x into the function to find f(−x).',
              '2. If f(−x) = f(x): the function is even.',
              '3. If f(−x) = −f(x): the function is odd.',
              '4. If neither: the function is neither even nor odd.',
              'Note: f(x) = 0 (the zero function) is both even and odd.',
            ]},
            { type: 'example', question: 'Determine if f(x) = x³ − 2x is even, odd, or neither', steps: [
              'f(−x) = (−x)³ − 2(−x) = −x³ + 2x = −(x³ − 2x) = −f(x).',
              'Since f(−x) = −f(x), the function is ODD.',
              'Graphically: 180° rotational symmetry about the origin.',
            ]},
            { type: 'tip', body: 'Even functions contain only even powers of x (or cos, |x|). Odd functions contain only odd powers of x (or sin, tan). A function with a mix of even and odd powers (like x² + x) is neither.' },
          ],
        },
        {
          stageId: 'y11-ext1-l5-s5d', code: '5D', title: 'Horizontal and Vertical Dilations',
          outcomeIds: ['MA-FUNC-05'], topicIds: ['MA-FUNC-05'],
          explanation: 'y = af(x): vertical dilation by factor |a|, reflects in x-axis if a<0. y = f(bx): horizontal dilation by factor 1/|b|, reflects in y-axis if b<0. These change the shape, not just the position.',
          content: [
            { type: 'text', body: 'Dilations stretch or compress the graph. The vertical dilation multiplies all y-values; the horizontal dilation multiplies all x-values (but counter-intuitively, larger b means a narrower graph). Dilations are essential for understanding sinusoidal functions (period, amplitude) in Chapter 8.' },
            { type: 'table', headers: ['Transformation', 'Type', 'Effect on graph'], rows: [
              ['y = af(x), |a| > 1', 'Vertical stretch', 'Graph taller — all y-values multiplied by |a|'],
              ['y = af(x), 0 < |a| < 1', 'Vertical compression', 'Graph shorter — all y-values shrunk'],
              ['y = af(x), a < 0', 'Reflect in x-axis', 'Also flips vertically'],
              ['y = f(bx), |b| > 1', 'Horizontal compression', 'Graph narrower — x-values divided by b'],
              ['y = f(bx), 0 < |b| < 1', 'Horizontal stretch', 'Graph wider — x-values multiplied by 1/|b|'],
            ]},
            { type: 'example', question: 'Describe how y = 3 sin(2x) relates to y = sin x', steps: [
              'Factor: a = 3 (vertical), b = 2 (horizontal).',
              'Vertical dilation by factor 3: amplitude becomes 3 (y-values range from −3 to 3).',
              'Horizontal dilation by factor 1/2: period becomes 2π/2 = π (graph is compressed horizontally).',
              'Result: a sine wave with amplitude 3 and period π.',
            ]},
            { type: 'tip', body: 'Remember the horizontal dilation factor is 1/b, not b. If y = f(2x), the graph is compressed by factor 1/2 (narrower), not stretched by 2. This is the most commonly confused transformation.' },
          ],
        },
        {
          stageId: 'y11-ext1-l5-s5e', code: '5E', title: 'The Absolute Value Function',
          outcomeIds: ['MA-FUNC-06'], topicIds: ['MA-FUNC-06'],
          explanation: 'y = |f(x)|: reflect the portions where f(x)<0 back above the x-axis. y = f(|x|): reflect the right half of the graph onto the left (ensuring even symmetry). Solve |ax+b|=c by two cases.',
          content: [
            { type: 'text', body: 'The absolute value function |x| measures distance from zero — it is always non-negative. Graphically, it creates V-shapes and "bounces" parts of graphs above the x-axis. Solving equations and inequalities involving absolute value requires careful case analysis.' },
            { type: 'rules', heading: 'Two Types of Absolute Value Graphs', items: [
              'y = |f(x)|: Take the graph of y = f(x) and reflect any part BELOW the x-axis upward. (Positive parts unchanged.)',
              'y = f(|x|): Take the graph for x ≥ 0, then reflect it in the y-axis to get x ≤ 0 part. (Result is always an even function.)',
            ]},
            { type: 'steps', heading: 'Solving |ax + b| = c  (c ≥ 0)', items: [
              'Split into two cases: ax + b = c  OR  ax + b = −c.',
              'Solve each linear equation separately.',
              'Check both solutions satisfy the original equation.',
              'If c < 0: NO solution (absolute value is always ≥ 0).',
            ]},
            { type: 'steps', heading: 'Solving |ax + b| < c  (c > 0)', items: [
              'Equivalent to: −c < ax + b < c.',
              'Solve this compound inequality to find the solution interval.',
              'For |ax + b| > c: solve ax + b > c OR ax + b < −c separately.',
            ]},
            { type: 'example', question: 'Solve |2x − 3| ≤ 5', steps: [
              '−5 ≤ 2x − 3 ≤ 5',
              'Add 3: −2 ≤ 2x ≤ 8',
              'Divide by 2: −1 ≤ x ≤ 4',
              'Solution: [−1, 4]',
            ]},
            { type: 'tip', body: 'To sketch y = |f(x)|: first sketch y = f(x) in pencil, then "reflect" any part below the x-axis up (erase it, redraw it above). The x-intercepts of f become the V-points (vertices) of the absolute value graph.' },
          ],
        },
        {
          stageId: 'y11-ext1-l5-s5f', code: '5F', title: 'Composite Functions',
          outcomeIds: ['MA-FUNC-03'], topicIds: ['MA-FUNC-03'],
          explanation: '(f∘g)(x) = f(g(x)): apply g first, then f. Domain of f∘g: all x in domain of g such that g(x) is in domain of f. Note: f∘g ≠ g∘f in general. Specify domain and range for each composite.',
          content: [
            { type: 'text', body: 'A composite function applies one function and then feeds the result into another. Composite functions are fundamental to understanding the chain rule in differentiation — d/dx[f(g(x))] = f\'(g(x)) × g\'(x) — which you will use constantly in Chapter 9.' },
            { type: 'formula', latex: '(f \\circ g)(x) = f(g(x))', label: 'Composite function — apply g first, then f' },
            { type: 'rules', heading: 'Finding the Domain of f∘g', items: [
              'Step 1: The input x must be in the domain of g.',
              'Step 2: The output g(x) must be in the domain of f.',
              'The domain of f∘g is the set of all x satisfying BOTH conditions.',
              'This is often a restricted subset of the natural domain of g.',
            ]},
            { type: 'example', question: 'If f(x) = √x and g(x) = x − 4, find f∘g and its domain', steps: [
              'f(g(x)) = f(x − 4) = √(x − 4).',
              'Domain of g: all x (no restrictions).',
              'For f(g(x)) to be defined: g(x) ≥ 0  →  x − 4 ≥ 0  →  x ≥ 4.',
              'Domain of f∘g: [4, ∞).',
              'Range of f∘g: [0, ∞) (since √ gives non-negative outputs).',
            ]},
            { type: 'example', question: 'Are f∘g and g∘f the same for f(x) = x + 2, g(x) = x²?', steps: [
              'f(g(x)) = f(x²) = x² + 2.',
              'g(f(x)) = g(x + 2) = (x + 2)² = x² + 4x + 4.',
              'These are different — f∘g ≠ g∘f in general.',
            ]},
            { type: 'tip', body: 'The notation (f∘g)(x) = f(g(x)) reads as "f of g of x" — g acts first. Think of it as a pipeline: input → g → output₁ → f → final output.' },
          ],
        },
        {
          stageId: 'y11-ext1-l5-s5g', code: '5G', title: 'Combining Transformations',
          outcomeIds: ['MA-FUNC-05'], topicIds: ['MA-FUNC-05'],
          explanation: 'Apply transformations in the correct order from the inside out: (1) horizontal dilation/reflection, (2) horizontal translation, (3) vertical dilation/reflection, (4) vertical translation.',
          content: [
            { type: 'text', body: 'When multiple transformations are combined, order matters. The standard form y = af(bx − h) + k packs all four transformation types into one equation. Applying them in the wrong order gives a different — wrong — graph.' },
            { type: 'formula', latex: 'y = a\\,f(b(x - h)) + k', label: 'General transformed function' },
            { type: 'table', headers: ['Parameter', 'Transformation', 'Order'], rows: [
              ['b (inside)', 'Horizontal dilation by 1/|b|, reflect in y-axis if b < 0', '1st (innermost)'],
              ['h (inside)', 'Horizontal translation right by h', '2nd'],
              ['a (outside)', 'Vertical dilation by |a|, reflect in x-axis if a < 0', '3rd'],
              ['k (outside)', 'Vertical translation up by k', '4th (outermost)'],
            ]},
            { type: 'steps', heading: 'Approach: Track key points through transformations', items: [
              '1. Start with key points on y = f(x) — vertex, intercepts, etc.',
              '2. Apply b: multiply each x-coordinate by 1/b (and negate if b < 0).',
              '3. Apply h: add h to each x-coordinate.',
              '4. Apply a: multiply each y-coordinate by a (and negate if a < 0).',
              '5. Apply k: add k to each y-coordinate.',
              '6. Connect the transformed points to produce the final graph.',
            ]},
            { type: 'example', question: 'Describe the transformations in y = −2(x+3)² + 1 and state the vertex', steps: [
              'Write as y = −2·(x − (−3))² + 1. So: a = −2, b = 1, h = −3, k = 1.',
              'Start: vertex of y = x² is at (0, 0).',
              'b = 1: no horizontal dilation.',
              'h = −3: shift left 3 → vertex to (−3, 0).',
              'a = −2: vertical stretch by 2, reflect in x-axis → vertex stays at (−3, 0), opens downward.',
              'k = 1: shift up 1 → vertex to (−3, 1).',
              'Final vertex: (−3, 1). Parabola opens downward with dilation factor 2.',
            ]},
            { type: 'tip', body: 'Always factorise the x-expression first. y = 2(2x − 4)² must be rewritten as y = 2(2(x−2))² = 2·4·(x−2)² = 8(x−2)² before reading off h = 2.' },
          ],
        },
        {
          stageId: 'y11-ext1-l5-s5h', code: '5H', title: 'Continuity and Piecewise-Defined Functions',
          outcomeIds: ['MA-FUNC-07'], topicIds: ['MA-FUNC-07'],
          explanation: 'A piecewise function uses different rules on different intervals. Check continuity at boundaries: is the left-hand limit equal to the right-hand limit and the function value? Sketch each piece separately.',
          content: [
            { type: 'text', body: 'A piecewise (or hybrid) function applies different formulas on different parts of its domain. Real-world examples include tax brackets, shipping costs, and the absolute value function itself. Continuity at the join points is a key concept linking to limits in calculus.' },
            { type: 'rules', heading: 'Graphing a Piecewise Function', items: [
              '1. Identify the domain intervals for each piece.',
              '2. Sketch each piece separately on the correct interval.',
              '3. Use open circles (○) where endpoints are excluded, closed circles (●) where included.',
              '4. Check continuity at each boundary point.',
            ]},
            { type: 'rules', heading: 'Continuity at x = a', items: [
              'A function is continuous at x = a if three conditions hold:',
              '(i) f(a) is defined.',
              '(ii) The limit as x → a exists (left-hand limit = right-hand limit).',
              '(iii) The limit equals f(a).',
              'If any condition fails, the function is discontinuous at x = a.',
            ]},
            { type: 'example', question: 'Sketch f(x) = { x² for x < 1;  2−x for x ≥ 1 } and check continuity at x = 1', steps: [
              'Left piece: y = x² for x < 1. At x = 1 (excluded): y → 1. Draw open circle at (1, 1).',
              'Right piece: y = 2 − x for x ≥ 1. At x = 1: y = 2 − 1 = 1. Draw closed circle at (1, 1).',
              'Left-hand limit as x → 1⁻: 1² = 1.',
              'Right-hand limit as x → 1⁺: 2 − 1 = 1.',
              'f(1) = 2 − 1 = 1.',
              'All three conditions are met: f is continuous at x = 1.',
            ]},
            { type: 'tip', body: 'Draw each piece of a piecewise function with a different colour if possible, and carefully mark the endpoints with open or closed circles. The boundary points are where marks are most often lost.' },
          ],
        },
      ],
    },
    // ── Chapter 6: Further Graphs — Extension 1 ──────────────────────────────
    {
      levelId: 'y11-ext1-l6', levelNum: 6, title: 'Further Graphs', emoji: '📈', color: '#10B981',
      stages: [
        {
          stageId: 'y11-ext1-l6-s6a', code: '6A', title: 'Solving Two Particular Inequations',
          outcomeIds: ['MA-FUNC-07'], topicIds: ['MA-FUNC-07'],
          explanation: 'To solve 1/f(x) > 0: find where f(x) > 0 (1/f(x) has the same sign as f(x)). To solve 1/f(x) > g(x): avoid multiplying by f(x) (sign unknown); instead, multiply both sides by [f(x)]² or use a sign diagram.',
          content: [
            { type: 'text', body: 'Inequalities involving fractions require special care because multiplying both sides by an expression whose sign is unknown can reverse the inequality. There are two safe strategies: the sign diagram, and multiplying through by the square of the denominator (which is always positive).' },
            { type: 'rules', heading: 'Strategy 1: Sign Diagram', items: [
              'Move everything to one side: expression > 0.',
              'Combine into a single fraction over a common denominator.',
              'Factorise the numerator and denominator fully.',
              'Mark zeros (numerator = 0) and undefined points (denominator = 0) on a number line.',
              'Test the sign in each interval and read off the solution.',
            ]},
            { type: 'rules', heading: 'Strategy 2: Multiply by [f(x)]² (always positive)', items: [
              'Useful when the inequality is of the form 1/f(x) > g(x).',
              'Multiply both sides by [f(x)]² — this is always ≥ 0, so the sign never reverses.',
              'Be careful: if f(x) = 0, that x-value must be excluded from the domain.',
            ]},
            { type: 'example', question: 'Solve $\\dfrac{1}{x-1} > 2$', steps: [
              'Rearrange: $\\dfrac{1}{x-1} - 2 > 0$  →  $\\dfrac{1 - 2(x-1)}{x-1} > 0$',
              '$= \\dfrac{3 - 2x}{x-1} > 0$',
              'Zeros: x = 3/2 (numerator = 0) and x = 1 (undefined).',
              'Sign diagram: test x = 0: (3)/(−1) < 0; x = 1.2: (0.6)/(0.2) > 0; x = 2: (−1)/(1) < 0.',
              'Solution: 1 < x < 3/2, i.e. (1, 3/2).',
            ]},
            { type: 'tip', body: 'NEVER multiply both sides of an inequality by an expression involving x without checking the sign first. The safe alternatives are always: sign diagram, or multiply by the square of the denominator.' },
          ],
        },
        {
          stageId: 'y11-ext1-l6-s6b', code: '6B', title: 'The Sign of a Function',
          outcomeIds: ['MA-FUNC-07'], topicIds: ['MA-FUNC-07'],
          explanation: 'A sign diagram shows where a function is positive, negative, or zero. Factorise fully, mark the zeros and vertical asymptotes on a number line, then test a value in each interval.',
          content: [
            { type: 'text', body: 'The sign diagram is the most versatile tool in Extension 1. It tells you where any expression (polynomial, rational, or composite) is positive, negative, or zero — essential for inequalities, curve sketching, and determining where functions increase or decrease.' },
            { type: 'steps', heading: 'Building a Sign Diagram', items: [
              '1. Factorise the expression (or the numerator and denominator separately for fractions).',
              '2. Find all critical values: roots (where = 0) and vertical asymptotes (where undefined).',
              '3. Mark all critical values on a number line in order.',
              '4. Test one x-value in each interval (choose values that are easy to substitute).',
              '5. Mark + or − in each interval; mark 0 at roots and "undefined" at asymptotes.',
              '6. Read off the solution to the inequality from the sign diagram.',
            ]},
            { type: 'rules', heading: 'Sign Changes at Critical Values', items: [
              'At a simple root (odd power): the sign CHANGES (positive → negative or vice versa).',
              'At a double root (even power): the sign does NOT change (touches zero and bounces).',
              'At a vertical asymptote: the sign changes (function jumps from +∞ to −∞ or vice versa).',
            ]},
            { type: 'example', question: 'Determine the sign of $f(x) = \\dfrac{(x-1)^2(x+2)}{x-3}$', steps: [
              'Critical values: x = 1 (double root), x = −2 (simple root), x = 3 (undefined).',
              'Test x = −3 (left of −2): (16)(−1)/(−6) = positive. So: + | − | + | −',
              'Sign diagram (left to right): +, then − after x = −2, then stays − at x = 1 (double root, no sign change), then + after x = 3.',
              'f(x) > 0 when x < −2 or x > 3.',
            ]},
            { type: 'tip', body: 'Draw your sign diagram clearly with a horizontal line, critical values marked, and + or − written in each region. Examiners award method marks for a correct sign diagram even if you misread the solution at the end.' },
          ],
        },
        {
          stageId: 'y11-ext1-l6-s6c', code: '6C', title: 'Sketching Reciprocal Functions',
          outcomeIds: ['MA-FUNC-07'], topicIds: ['MA-FUNC-07'],
          explanation: 'To sketch y = 1/f(x): zeros of f become vertical asymptotes; where f is large, 1/f is small; where f is small and positive, 1/f is large. Sign of 1/f matches sign of f. Sketch f first, then take reciprocal.',
          content: [
            { type: 'text', body: 'Sketching y = 1/f(x) directly from the graph of y = f(x) is a powerful technique that avoids algebraic manipulation. The relationship between a function and its reciprocal follows clear visual rules.' },
            { type: 'table', headers: ['Feature of y = f(x)', 'Corresponding feature of y = 1/f(x)'], rows: [
              ['Zero (f(x) = 0)', 'Vertical asymptote'],
              ['Vertical asymptote', 'Zero (if the limit is finite from both sides)'],
              ['Large positive value', 'Small positive value (near 0)'],
              ['Small positive value (near 0)', 'Large positive value (→ +∞)'],
              ['Maximum of f', 'Minimum of 1/f (same x-value)'],
              ['Minimum of f', 'Maximum of 1/f (same x-value)'],
              ['f(x) = 1 or f(x) = −1', 'These points lie ON the reciprocal graph (unchanged)'],
            ]},
            { type: 'steps', heading: 'Method for Sketching y = 1/f(x)', items: [
              '1. Sketch y = f(x) first (lightly, as a guide).',
              '2. Mark the zeros of f: these become vertical asymptotes of 1/f.',
              '3. Mark the horizontal asymptote of f (if any): the reciprocal goes to zero there.',
              '4. Mark where f = 1 and f = −1: these points are on the reciprocal graph.',
              '5. Sketch branches of 1/f, following the sign and magnitude rules.',
            ]},
            { type: 'example', question: 'Sketch y = 1/(x² − 1) using y = x² − 1 as a guide', steps: [
              'f(x) = x² − 1 has zeros at x = ±1: these give vertical asymptotes of 1/f.',
              'f(x) = −1 at x = 0: so 1/f(0) = −1. Point (0, −1) is on the graph.',
              'As x → ±∞: f(x) → +∞, so 1/f(x) → 0⁺. Horizontal asymptote: y = 0.',
              'Between x = −1 and x = 1: f(x) < 0 (parabola below x-axis), so 1/f(x) < 0.',
              'Branches: one below x-axis between the asymptotes; two above x-axis outside.',
            ]},
            { type: 'tip', body: 'The phrase "where f is large, 1/f is small" is the central idea. Think of it as a seesaw: as f grows, 1/f shrinks. Always sketch y = f(x) first — the reciprocal graph is determined entirely by f.' },
          ],
        },
        {
          stageId: 'y11-ext1-l6-s6d', code: '6D', title: 'Sketching Sums and Differences',
          outcomeIds: ['MA-FUNC-07'], topicIds: ['MA-FUNC-07'],
          explanation: 'To sketch y = f(x)+g(x): add the y-values of f and g at each x. Key technique: wherever f or g is zero, the sum equals the other function alone. Add ordinates at many x-values and join smoothly.',
          content: [
            { type: 'text', body: 'Adding two functions graphically means adding their y-values at each x-coordinate. This "addition of ordinates" technique lets you sketch complex sums (like y = x + sin x) without plotting hundreds of points.' },
            { type: 'steps', heading: 'Method: Addition of Ordinates', items: [
              '1. Sketch y = f(x) and y = g(x) on the same axes.',
              '2. Identify key x-values: where f = 0, where g = 0, where they intersect.',
              '3. At x-values where f = 0: the sum equals g(x) alone.',
              '4. At x-values where g = 0: the sum equals f(x) alone.',
              '5. At other x-values: estimate the sum by adding the heights graphically.',
              '6. Join the calculated/estimated points with a smooth curve.',
            ]},
            { type: 'rules', heading: 'Useful Key Points', items: [
              'Where f(x) = −g(x): the sum is zero (these are x-intercepts of the sum).',
              'Where one function dominates (much larger): the sum looks like that function.',
              'As x → ±∞: the dominant term determines the end behaviour.',
            ]},
            { type: 'example', question: 'Sketch $y = x + \\frac{1}{x}$ for x > 0', steps: [
              'f(x) = x (line through origin); g(x) = 1/x (hyperbola branch in Q1).',
              'At x = 1: y = 1 + 1 = 2. At x = 2: y = 2 + 0.5 = 2.5. At x = 0.5: y = 0.5 + 2 = 2.5.',
              'As x → 0⁺: 1/x → +∞, so sum → +∞ (asymptote at x = 0).',
              'As x → +∞: x dominates, sum ≈ x (asymptotic to y = x).',
              'Minimum by calculus (dy/dx = 1 − 1/x² = 0 → x = 1): min value y = 2 at x = 1.',
            ]},
            { type: 'tip', body: 'Always calculate the sum at several strategic x-values (especially where one function is zero or where they are equal). A table of values at 4–6 x-values gives you enough information to draw a confident sketch.' },
          ],
        },
        {
          stageId: 'y11-ext1-l6-s6e', code: '6E', title: 'Modifying Functions Using Absolute Value',
          outcomeIds: ['MA-FUNC-06'], topicIds: ['MA-FUNC-06'],
          explanation: 'y = |f(x)|: keep positive parts, reflect negative parts above x-axis. y = f(|x|): draw the right half (x≥0), then reflect it in the y-axis. These produce graphs with V-shaped features.',
          content: [
            { type: 'text', body: 'Combining absolute value with other functions creates graphs with "bounces" and kinks. This stage extends Stage 5E by applying these modifications to more complex functions — not just linear ones.' },
            { type: 'rules', heading: 'y = |f(x)| — Reflect Below x-axis Up', items: [
              'Where f(x) ≥ 0: the graph is unchanged (|f(x)| = f(x)).',
              'Where f(x) < 0: the graph is reflected in the x-axis (|f(x)| = −f(x)).',
              'The result is always ≥ 0 — the graph never goes below the x-axis.',
              'Any x-intercepts of f become "bounce" points (V-shaped corners).',
            ]},
            { type: 'rules', heading: 'y = f(|x|) — Create Even Symmetry', items: [
              'For x ≥ 0: y = f(|x|) = f(x). The right half is identical to y = f(x).',
              'For x < 0: y = f(|x|) = f(−x). The left half is the reflection of the right half.',
              'The result is always an even function (symmetric about y-axis).',
              'Sketch the right half first, then mirror it.',
            ]},
            { type: 'example', question: 'Sketch y = |x² − 4|', steps: [
              'First sketch y = x² − 4 (parabola, vertex at (0, −4), crossing x-axis at x = ±2).',
              'The part below the x-axis (between x = −2 and x = 2) is reflected up.',
              'Result: The section between x = −2 and x = 2 becomes an upward hump (vertex at (0, 4)).',
              'Outside x = ±2: unchanged (already positive).',
              'The graph has sharp corners (kinks) at x = ±2.',
            ]},
            { type: 'tip', body: 'Sketch the original function y = f(x) first (in pencil), identify where it is negative, then "bounce" those sections upward. The kink points (where the bounce occurs) are always at the original x-intercepts.' },
          ],
        },
        {
          stageId: 'y11-ext1-l6-s6f', code: '6F', title: 'Inverse Relations and Functions',
          outcomeIds: ['MA-FUNC-04'], topicIds: ['MA-FUNC-04'],
          explanation: 'The inverse relation of y=f(x) is obtained by swapping x and y. It is a function only if f is one-to-one (horizontal line test). Graphically, the inverse is the reflection in y=x.',
          content: [
            { type: 'text', body: 'The inverse of a function "undoes" what the function does. Finding inverses is essential for solving equations, understanding logarithms (inverse of exponentials), and understanding the inverse trig functions in Stage 8C.' },
            { type: 'rules', heading: 'From Relation to Inverse', items: [
              'To find the inverse relation: swap x and y in the equation, then rearrange if possible.',
              'The inverse of y = f(x) is the relation x = f(y) — or equivalently, swap all x and y coordinates.',
              'Graphically: reflect the graph in the line y = x.',
              'The domain of f becomes the range of f⁻¹, and vice versa.',
            ]},
            { type: 'rules', heading: 'When is the Inverse a Function?', items: [
              'The inverse is a function if and only if f is one-to-one.',
              'Horizontal Line Test: if any horizontal line crosses the graph more than once, f is NOT one-to-one.',
              'If f is not one-to-one, restrict its domain to make it one-to-one, then find the inverse on that restricted domain.',
              'Example: y = x² is not one-to-one over ℝ; restrict to x ≥ 0 to get inverse y = √x.',
            ]},
            { type: 'example', question: 'Find the inverse of y = 2x + 3 and sketch both on the same axes', steps: [
              'Swap x and y: x = 2y + 3.',
              'Rearrange: y = (x − 3)/2.',
              'So f⁻¹(x) = (x − 3)/2.',
              'The original line has gradient 2, y-intercept 3.',
              'The inverse has gradient 1/2, y-intercept −3/2.',
              'Both lines intersect on y = x at the point (3, 3).',
            ]},
            { type: 'tip', body: 'The reflection line y = x acts as a mirror. Any point (a, b) on y = f(x) maps to (b, a) on y = f⁻¹(x). The x-intercept of f becomes the y-intercept of f⁻¹, and vice versa.' },
          ],
        },
        {
          stageId: 'y11-ext1-l6-s6g', code: '6G', title: 'Inverse Function Notation',
          outcomeIds: ['MA-FUNC-04'], topicIds: ['MA-FUNC-04'],
          explanation: 'If f is one-to-one, its inverse f⁻¹ satisfies f⁻¹(f(x)) = x and f(f⁻¹(y)) = y. To find f⁻¹: write y=f(x), swap x and y, rearrange for y. State the domain and range of f⁻¹.',
          content: [
            { type: 'text', body: 'The notation f⁻¹ denotes the inverse function — this is NOT the same as (f(x))⁻¹ = 1/f(x). The defining property is that applying f then f⁻¹ (or vice versa) returns the original input.' },
            { type: 'formula', latex: 'f^{-1}(f(x)) = x \\quad \\text{and} \\quad f(f^{-1}(y)) = y', label: 'Defining property of inverse functions' },
            { type: 'rules', heading: 'Properties of f⁻¹', items: [
              'Domain of f⁻¹ = Range of f.',
              'Range of f⁻¹ = Domain of f.',
              'The graph of f⁻¹ is the reflection of f in the line y = x.',
              'If f is one-to-one and f(a) = b, then f⁻¹(b) = a.',
            ]},
            { type: 'steps', heading: 'Finding f⁻¹ Algebraically', items: [
              '1. Write y = f(x).',
              '2. Swap x and y: x = f(y).',
              '3. Rearrange to make y the subject: y = f⁻¹(x).',
              '4. State the domain of f⁻¹ (= range of f).',
            ]},
            { type: 'example', question: 'Find f⁻¹(x) if $f(x) = \\sqrt{x - 3}$ for x ≥ 3', steps: [
              'y = √(x − 3).',
              'Swap: x = √(y − 3).',
              'Square both sides: x² = y − 3  →  y = x² + 3.',
              'Domain of f⁻¹: range of f = [0, ∞) (since √ gives non-negative outputs).',
              'So f⁻¹(x) = x² + 3 for x ≥ 0.',
            ]},
            { type: 'tip', body: 'Warning: f⁻¹(x) means "inverse function evaluated at x," NOT "1 divided by f(x)." The notation sin⁻¹(x) means the inverse sine function (arcsin), not 1/sin(x).' },
          ],
        },
        {
          stageId: 'y11-ext1-l6-s6h', code: '6H', title: 'Defining Functions Parametrically',
          outcomeIds: ['MA-FUNC-07'], topicIds: ['MA-FUNC-07'],
          explanation: 'Parametric equations express x and y as functions of a parameter t: x=f(t), y=g(t). Eliminate t to find the Cartesian equation. Identify the range of t to determine which part of the curve is traced.',
          content: [
            { type: 'text', body: 'Parametric equations describe a curve by expressing both x and y as functions of a third variable (the parameter), often denoted t. They are natural for describing motion, circles, and conics, and appear in Ext 2 and in many applications.' },
            { type: 'rules', heading: 'Working with Parametric Equations', items: [
              'The parameter t typically represents time, angle, or another underlying variable.',
              'As t varies over its domain, the point (x(t), y(t)) traces out the curve.',
              'To find the Cartesian equation: eliminate t by solving one equation for t and substituting into the other, or using a Pythagorean identity.',
            ]},
            { type: 'example', question: 'Eliminate t from x = 2cos t, y = 3sin t  (0 ≤ t ≤ 2π)', steps: [
              'From the equations: cos t = x/2 and sin t = y/3.',
              'Use the identity cos²t + sin²t = 1:',
              '(x/2)² + (y/3)² = 1.',
              'This is an ellipse with semi-axes a = 2 (x-direction) and b = 3 (y-direction).',
              'As t goes from 0 to 2π, the entire ellipse is traced once.',
            ]},
            { type: 'example', question: 'Find the Cartesian equation of x = t + 1, y = t² − 2', steps: [
              'From x = t + 1: t = x − 1.',
              'Substitute into y = t² − 2: y = (x − 1)² − 2.',
              'This is a parabola with vertex (1, −2).',
            ]},
            { type: 'tip', body: 'When eliminating t from trig parametrics, always think of the Pythagorean identity cos²t + sin²t = 1. This handles circular and elliptical parametrics in one clean step.' },
          ],
        },
      ],
    },
    // ── Chapter 7: Trigonometry ───────────────────────────────────────────────
    {
      levelId: 'y11-ext1-l7', levelNum: 7, title: 'Trigonometry', emoji: '〜', color: '#F97316',
      stages: [
        {
          stageId: 'y11-ext1-l7-s7a', code: '7A', title: 'Trigonometric Ratios and Exact Values',
          outcomeIds: ['MA-TRIG-01'], topicIds: ['MA-TRIG-01'],
          explanation: 'SOH CAH TOA for right triangles. Exact values: sin30°=½, cos30°=√3/2, tan60°=√3, sin45°=cos45°=1/√2. ASTC: All/Sin/Tan/Cos positive in Q1/Q2/Q3/Q4.',
          content: [
            { type: 'text', body: 'Trigonometry connects angles to side ratios in right triangles and, via the unit circle, to all angles. You must know the exact values for 30°, 45°, and 60° (and their radian equivalents) without hesitation — calculators are not always permitted, and exact values are required throughout the course.' },
            { type: 'formula', latex: '\\sin\\theta = \\frac{\\text{opposite}}{\\text{hypotenuse}}, \\quad \\cos\\theta = \\frac{\\text{adjacent}}{\\text{hypotenuse}}, \\quad \\tan\\theta = \\frac{\\text{opposite}}{\\text{adjacent}}', label: 'SOH CAH TOA' },
            { type: 'table', headers: ['Angle', '30° (π/6)', '45° (π/4)', '60° (π/3)', '90° (π/2)'], rows: [
              ['sin', '1/2', '1/√2', '√3/2', '1'],
              ['cos', '√3/2', '1/√2', '1/2', '0'],
              ['tan', '1/√3', '1', '√3', 'undefined'],
            ]},
            { type: 'rules', heading: 'ASTC — Signs by Quadrant', items: [
              'Q1 (0° to 90°): ALL ratios positive.',
              'Q2 (90° to 180°): SIN positive (cos, tan negative).',
              'Q3 (180° to 270°): TAN positive (sin, cos negative).',
              'Q4 (270° to 360°): COS positive (sin, tan negative).',
              'Memory aid: "All Students Take Calculus" (Q1, Q2, Q3, Q4).',
            ]},
            { type: 'example', question: 'Find the exact value of sin 120°', steps: [
              '120° is in Q2. Reference angle = 180° − 120° = 60°.',
              'In Q2, sin is positive.',
              'sin 120° = sin 60° = √3/2.',
            ]},
            { type: 'tip', body: 'Derive the exact value table from two special triangles: the 45-45-90 triangle (isosceles right triangle with legs 1, 1, hypotenuse √2) and the 30-60-90 triangle (equilateral triangle of side 2, cut in half). Never memorise without understanding the geometry behind these values.' },
          ],
        },
        {
          stageId: 'y11-ext1-l7-s7b', code: '7B', title: 'Radian Measure',
          outcomeIds: ['MA-TRIG-09'], topicIds: ['MA-TRIG-09'],
          explanation: 'π rad = 180°. Convert by multiplying: degrees → radians: ×π/180; radians → degrees: ×180/π. Arc length l = rθ; sector area A = ½r²θ. Radians are required for all calculus of trig functions.',
          content: [
            { type: 'text', body: 'Radians are the natural unit for angles in calculus and advanced mathematics. The derivative of sin x is cos x only when x is measured in radians. You must be completely comfortable switching between degrees and radians.' },
            { type: 'formula', latex: '\\pi \\text{ radians} = 180^\\circ', label: 'Core conversion fact' },
            { type: 'formula', latex: '\\theta_{\\text{rad}} = \\theta_{\\deg} \\times \\frac{\\pi}{180}, \\qquad \\theta_{\\deg} = \\theta_{\\text{rad}} \\times \\frac{180}{\\pi}', label: 'Conversion formulas' },
            { type: 'table', headers: ['Degrees', '0°', '30°', '45°', '60°', '90°', '180°', '270°', '360°'], rows: [
              ['Radians', '0', 'π/6', 'π/4', 'π/3', 'π/2', 'π', '3π/2', '2π'],
            ]},
            { type: 'formula', latex: 'l = r\\theta, \\qquad A = \\frac{1}{2}r^2\\theta \\quad (\\theta \\text{ in radians})', label: 'Arc length and sector area' },
            { type: 'example', question: 'A sector has radius 6 cm and arc length 9 cm. Find its area.', steps: [
              'From l = rθ: θ = l/r = 9/6 = 3/2 radians.',
              'Area = (1/2)r²θ = (1/2)(36)(3/2) = 27 cm².',
            ]},
            { type: 'tip', body: 'When using the arc length or sector area formulas, always check that the angle is in radians. If the angle is given in degrees, convert it first. Using degrees in these formulas is one of the most common errors.' },
          ],
        },
        {
          stageId: 'y11-ext1-l7-s7c', code: '7C', title: 'Trigonometric Functions of Any Angle',
          outcomeIds: ['MA-TRIG-01'], topicIds: ['MA-TRIG-01'],
          explanation: 'Extend trig to all angles using the unit circle. sin(180°−θ)=sinθ, cos(180°−θ)=−cosθ. Related angles: sin(−θ)=−sinθ (odd), cos(−θ)=cosθ (even). Use ASTC and reference angles.',
          content: [
            { type: 'text', body: 'The unit circle (radius 1 centred at origin) extends trigonometry beyond acute angles. Any point on the unit circle at angle θ has coordinates (cos θ, sin θ). This geometric definition works for all angles — positive, negative, and beyond 360°.' },
            { type: 'rules', heading: 'Unit Circle Definition', items: [
              'For angle θ measured anticlockwise from positive x-axis:',
              'cos θ = x-coordinate of the point on the unit circle.',
              'sin θ = y-coordinate of the point on the unit circle.',
              'tan θ = sin θ / cos θ = y/x (undefined when x = 0, i.e. θ = 90°, 270°, …)',
            ]},
            { type: 'table', headers: ['Identity', 'Formula', 'Reason'], rows: [
              ['Supplementary', 'sin(180°−θ) = sin θ', 'Q2 has same y-value as Q1 reference'],
              ['Supplementary', 'cos(180°−θ) = −cos θ', 'Q2 has negative x-value'],
              ['Negative angle', 'sin(−θ) = −sin θ', 'Reflection in x-axis, y negates'],
              ['Negative angle', 'cos(−θ) = cos θ', 'Reflection in x-axis, x unchanged'],
              ['Cofunction', 'sin(90°−θ) = cos θ', 'Complementary angles'],
              ['Cofunction', 'cos(90°−θ) = sin θ', 'Complementary angles'],
            ]},
            { type: 'example', question: 'Find the exact value of cos 210°', steps: [
              '210° = 180° + 30°, so 210° is in Q3.',
              'Reference angle = 210° − 180° = 30°.',
              'In Q3, cos is negative.',
              'cos 210° = −cos 30° = −√3/2.',
            ]},
            { type: 'tip', body: 'Method: (1) Determine the quadrant. (2) Find the reference angle (the acute angle to the nearest x-axis). (3) Apply ASTC to determine the sign. (4) Evaluate using the exact value table. Practice this four-step process until it is automatic.' },
          ],
        },
        {
          stageId: 'y11-ext1-l7-s7d', code: '7D', title: 'The Sine Rule and Its Ambiguous Case',
          outcomeIds: ['MA-TRIG-07'], topicIds: ['MA-TRIG-07'],
          explanation: 'a/sinA = b/sinB = c/sinC. Ambiguous case (SSA): when using sine rule to find an angle, there may be two triangles (both θ and 180°−θ are valid). Always check whether both solutions fit the given information.',
          content: [
            { type: 'text', body: 'The Sine Rule applies to any triangle (not just right-angled ones). It relates each side to the sine of the opposite angle. The ambiguous case — where two different triangles satisfy the given data — is an Extension 1 specialty and appears regularly in exams.' },
            { type: 'formula', latex: '\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}', label: 'Sine Rule' },
            { type: 'rules', heading: 'When to Use the Sine Rule', items: [
              'Use when you have: AAS (two angles and a side) or SSA (two sides and a non-included angle).',
              'Do NOT use when you have SAS or SSS — use the Cosine Rule instead.',
              'To find a side: rearrange so the unknown side is in the numerator.',
              'To find an angle: rearrange so the unknown sine is in the numerator, then apply arcsin.',
            ]},
            { type: 'rules', heading: 'The Ambiguous Case (SSA)', items: [
              'Arises when finding an angle using the sine rule (since sin θ = sin(180° − θ)).',
              'Both θ and (180° − θ) are possible solutions.',
              'Check: does 180° − θ leave enough degrees for the remaining angles? (Angles in a triangle sum to 180°.)',
              'If both fit: there are TWO valid triangles. State both solutions.',
              'If only one fits: there is ONE valid triangle.',
            ]},
            { type: 'example', question: 'In ΔABC, a = 7, b = 10, A = 30°. Find angle B.', steps: [
              'sin B / 10 = sin 30° / 7  →  sin B = 10 × 0.5 / 7 = 5/7.',
              'B = arcsin(5/7) ≈ 45.6°  (acute solution).',
              'OR B = 180° − 45.6° = 134.4°  (obtuse solution).',
              'Check: if B = 134.4°, then A + B = 30° + 134.4° = 164.4° < 180°. ✓ Valid.',
              'Both triangles exist: B ≈ 45.6° or B ≈ 134.4°. State both with full workings.',
            ]},
            { type: 'tip', body: 'Whenever you find an angle using the Sine Rule, always check for the ambiguous case. The HSC specifically tests this — a student who gives only one answer when two exist will lose marks.' },
          ],
        },
        {
          stageId: 'y11-ext1-l7-s7e', code: '7E', title: 'The Cosine Rule and Area Formula',
          outcomeIds: ['MA-TRIG-07'], topicIds: ['MA-TRIG-07'],
          explanation: 'Cosine rule: a²=b²+c²−2bc cosA; rearranged: cosA=(b²+c²−a²)/2bc. Area = ½ab sinC. Use cosine rule for SAS or SSS; sine rule when you have an angle-side pair.',
          content: [
            { type: 'text', body: 'The Cosine Rule generalises Pythagoras\' theorem to non-right triangles. It is used when you have two sides and the included angle (SAS) or all three sides (SSS). It never has an ambiguous case — the cosine function uniquely determines the angle in (0°, 180°).' },
            { type: 'formula', latex: 'a^2 = b^2 + c^2 - 2bc\\cos A', label: 'Cosine Rule (find a side)' },
            { type: 'formula', latex: '\\cos A = \\frac{b^2 + c^2 - a^2}{2bc}', label: 'Cosine Rule (find an angle)' },
            { type: 'formula', latex: '\\text{Area} = \\frac{1}{2}ab\\sin C', label: 'Area of a triangle' },
            { type: 'table', headers: ['Given information', 'Use', 'Why'], rows: [
              ['AAS or ASA', 'Sine Rule', 'You have an angle opposite a known side'],
              ['SSA', 'Sine Rule', 'Angle opposite a known side — check ambiguous case'],
              ['SAS', 'Cosine Rule', 'Two sides and the included angle'],
              ['SSS', 'Cosine Rule', 'All three sides, find any angle'],
            ]},
            { type: 'example', question: 'In ΔABC, a = 5, b = 7, C = 60°. Find c and the area.', steps: [
              'c² = a² + b² − 2ab cos C = 25 + 49 − 2(5)(7)(1/2) = 74 − 35 = 39.',
              'c = √39.',
              'Area = (1/2)(5)(7) sin 60° = (35/2)(√3/2) = 35√3/4.',
            ]},
            { type: 'tip', body: 'The cosine rule and Pythagoras are connected: when C = 90°, cos C = 0 and the formula reduces to c² = a² + b². This confirms that Pythagoras is a special case of the cosine rule.' },
          ],
        },
        {
          stageId: 'y11-ext1-l7-s7f', code: '7F', title: 'Problems in Three Dimensions',
          outcomeIds: ['MA-TRIG-08'], topicIds: ['MA-TRIG-08'],
          explanation: 'Identify the right-angled and oblique triangles within the 3D figure. Draw and label separate 2D diagrams for each triangle. Solve systematically, passing answers from one triangle to the next.',
          content: [
            { type: 'text', body: '3D trigonometry problems — involving buildings, towers, navigation, and surveying — are a guaranteed HSC question type. The key insight is that all 3D problems reduce to a series of 2D triangle problems. The skill is identifying which triangles to use.' },
            { type: 'steps', heading: 'Approach to 3D Problems', items: [
              '1. Draw a clear 3D diagram and label all given lengths and angles.',
              '2. Identify all triangles (right-angled and oblique) within the figure.',
              '3. Draw each triangle as a separate 2D diagram with full labels.',
              '4. Determine which triangle to solve first (usually the one with the most known values).',
              '5. Pass the calculated values to the next triangle and continue.',
              '6. Angles of elevation/depression are measured from the horizontal.',
            ]},
            { type: 'rules', heading: 'Key Definitions', items: [
              'Angle of elevation: angle measured upward from horizontal to the line of sight.',
              'Angle of depression: angle measured downward from horizontal to the line of sight.',
              'Bearing: measured clockwise from north (e.g. N 40° E = bearing of 040°).',
              'Elevation and depression angles are always measured at the observer, not the object.',
            ]},
            { type: 'example', question: 'A vertical pole of height h stands at point A. From point B (at the same level), 50 m from A, the angle of elevation to the top is 30°. From point C (same level, 70 m from A, with angle BAC = 60°), find the angle of elevation to the top.', steps: [
              'Triangle ABT (T = top of pole): tan 30° = h/50  →  h = 50 tan 30° = 50/√3 m.',
              'Triangle ABC: use cosine rule to find BC.',
              'BC² = 50² + 70² − 2(50)(70)cos 60° = 2500 + 4900 − 3500 = 3900. BC = √3900.',
              'Triangle BCT: tan(elevation from C) = h/70 = (50/√3)/70. Evaluate and find angle.',
            ]},
            { type: 'tip', body: 'Draw your 3D diagram large, with the horizontal base clearly shown as a flat surface. Mark every angle of elevation from the horizontal (not from a slanted line). Common error: measuring the angle from the wrong baseline.' },
          ],
        },
      ],
    },
    // ── Chapter 8: Trigonometric Functions ───────────────────────────────────
    {
      levelId: 'y11-ext1-l8', levelNum: 8, title: 'Trigonometric Functions', emoji: '📐', color: '#EC4899',
      stages: [
        {
          stageId: 'y11-ext1-l8-s8a', code: '8A', title: 'Graphs of Sine, Cosine and Tangent',
          outcomeIds: ['MA-TRIG-02'], topicIds: ['MA-TRIG-02'],
          explanation: 'y = sin x: period 2π, amplitude 1. y = cos x: same but shifted π/2 left. y = tan x: period π, asymptotes at x = π/2 + nπ. Sketch one full period using 5 key points.',
          content: [
            { type: 'text', body: 'The three trigonometric functions — sine, cosine, and tangent — are periodic: they repeat their pattern indefinitely. Understanding their graphs is the foundation for the transformations in Stage 8B and the solving of equations in Stage 8D.' },
            { type: 'table', headers: ['Feature', 'y = sin x', 'y = cos x', 'y = tan x'], rows: [
              ['Period', '2π', '2π', 'π'],
              ['Amplitude', '1', '1', 'undefined (no amplitude)'],
              ['Domain', 'ℝ', 'ℝ', 'x ≠ π/2 + nπ'],
              ['Range', '[−1, 1]', '[−1, 1]', 'ℝ'],
              ['y-intercept', '0', '1', '0'],
              ['Symmetry', 'Odd: sin(−x) = −sin x', 'Even: cos(−x) = cos x', 'Odd: tan(−x) = −tan x'],
            ]},
            { type: 'rules', heading: '5 Key Points for Sketching y = sin x (one period 0 to 2π)', items: [
              '(0, 0): starts at zero.',
              '(π/2, 1): reaches maximum.',
              '(π, 0): returns to zero.',
              '(3π/2, −1): reaches minimum.',
              '(2π, 0): completes one full cycle.',
            ]},
            { type: 'rules', heading: '5 Key Points for y = cos x (one period 0 to 2π)', items: [
              '(0, 1): starts at maximum.',
              '(π/2, 0): crosses zero.',
              '(π, −1): reaches minimum.',
              '(3π/2, 0): crosses zero.',
              '(2π, 1): completes cycle.',
            ]},
            { type: 'tip', body: 'Tangent has vertical asymptotes at x = π/2 + nπ (where cosine = 0). Between each pair of asymptotes, tan is an increasing S-curve passing through zero. Sketch the asymptotes first as dashed vertical lines, then draw the curve between them.' },
          ],
        },
        {
          stageId: 'y11-ext1-l8-s8b', code: '8B', title: 'Transformations of Trig Graphs',
          outcomeIds: ['MA-TRIG-02'], topicIds: ['MA-TRIG-02'],
          explanation: 'y = a sin(bx+c)+d: amplitude |a|, period 2π/|b|, phase shift −c/b, vertical shift d. Apply transformations methodically: dilation, then shift. Identify all parameters from the equation.',
          content: [
            { type: 'text', body: 'All four transformation types from Chapter 5 apply to trig functions. Understanding how each parameter affects the graph allows you to write equations from graphs (a common exam question type) and to sketch any trig function immediately.' },
            { type: 'formula', latex: 'y = a\\sin(bx + c) + d', label: 'General form of a sinusoidal function' },
            { type: 'table', headers: ['Parameter', 'Effect', 'Formula'], rows: [
              ['a', 'Amplitude (height from midline to peak)', '|a|; if a < 0, reflected in x-axis'],
              ['b', 'Period', '2π/|b| for sin and cos; π/|b| for tan'],
              ['c', 'Phase shift (horizontal translation)', '−c/b to the right'],
              ['d', 'Vertical shift (midline)', 'Midline: y = d'],
            ]},
            { type: 'steps', heading: 'Sketching y = a sin(bx + c) + d', items: [
              '1. State amplitude |a| and period 2π/|b|.',
              '2. Find phase shift: set bx + c = 0 → x = −c/b. This is the starting x.',
              '3. Find one period\'s worth of key x-values by adding T/4 at each step.',
              '4. Compute y at each key x-value and shift by d.',
              '5. Draw the curve through the key points.',
            ]},
            { type: 'example', question: 'Sketch y = 3 sin(2x − π/2) for 0 ≤ x ≤ 2π', steps: [
              'a = 3 → amplitude = 3.',
              'b = 2 → period = 2π/2 = π.',
              'Phase shift: 2x − π/2 = 0 → x = π/4.',
              'Key x-values (starting at π/4, adding π/4 each time): π/4, π/2, 3π/4, π, 5π/4.',
              'y-values at these x: 0, 3, 0, −3, 0 (one full cycle).',
              'Amplitude 3, period π, starts at (π/4, 0).',
            ]},
            { type: 'tip', body: 'To read the equation from a graph: amplitude = (max − min)/2; midline d = (max + min)/2; period = T, so b = 2π/T; find phase by reading where the cycle starts.' },
          ],
        },
        {
          stageId: 'y11-ext1-l8-s8c', code: '8C', title: 'Inverse Trigonometric Functions',
          outcomeIds: ['MA-TRIG-05'], topicIds: ['MA-TRIG-05'],
          explanation: 'sin⁻¹x: domain [−1,1], range [−π/2, π/2]. cos⁻¹x: domain [−1,1], range [0,π]. tan⁻¹x: domain ℝ, range (−π/2, π/2). Restricted domains make each inverse a true function.',
          content: [
            { type: 'text', body: 'Since sin, cos, and tan are NOT one-to-one over their full domains, we restrict each to a standard interval where it is one-to-one, then define the inverse on that interval. These restricted inverses — arcsin, arccos, arctan — are genuine functions with specific domains and ranges.' },
            { type: 'table', headers: ['Function', 'Domain', 'Range', 'Key values'], rows: [
              ['sin⁻¹x (arcsin)', '[−1, 1]', '[−π/2, π/2]', 'sin⁻¹(0) = 0; sin⁻¹(1) = π/2; sin⁻¹(−1) = −π/2'],
              ['cos⁻¹x (arccos)', '[−1, 1]', '[0, π]', 'cos⁻¹(0) = π/2; cos⁻¹(1) = 0; cos⁻¹(−1) = π'],
              ['tan⁻¹x (arctan)', 'ℝ', '(−π/2, π/2)', 'tan⁻¹(0) = 0; tan⁻¹(1) = π/4'],
            ]},
            { type: 'rules', heading: 'Key Properties', items: [
              'sin⁻¹(sin x) = x only when x ∈ [−π/2, π/2].',
              'sin(sin⁻¹ x) = x for any x ∈ [−1, 1].',
              'The range of cos⁻¹ is [0, π] — it never returns a negative value.',
              'tan⁻¹ has horizontal asymptotes at y = ±π/2.',
            ]},
            { type: 'example', question: 'Evaluate cos⁻¹(−√3/2) without a calculator', steps: [
              'We want the angle θ in [0, π] such that cos θ = −√3/2.',
              'cos(π/6) = √3/2, so cos(π − π/6) = cos(5π/6) = −√3/2.',
              'Since 5π/6 ∈ [0, π]: cos⁻¹(−√3/2) = 5π/6.',
            ]},
            { type: 'tip', body: 'The range of cos⁻¹ is [0, π] — it is always non-negative. The range of sin⁻¹ is [−π/2, π/2] — it can be negative. Always check your answer lies in the correct range for the inverse function you are using.' },
          ],
        },
        {
          stageId: 'y11-ext1-l8-s8d', code: '8D', title: 'Solving Trigonometric Equations',
          outcomeIds: ['MA-TRIG-04'], topicIds: ['MA-TRIG-04'],
          explanation: 'Find all solutions in a given domain. Use inverse trig for the principal value, then apply symmetry of the unit circle (ASTC) to find all others. For compound angles, adjust the domain first.',
          content: [
            { type: 'text', body: 'Trig equations have infinitely many solutions (the functions are periodic), so you must find all solutions within the specified domain. The process: find one reference solution using inverse trig, then use the unit circle symmetry to find all others in the domain.' },
            { type: 'steps', heading: 'Method: Solving sin θ = k or cos θ = k', items: [
              '1. Find the reference angle α = sin⁻¹|k| or cos⁻¹|k| (always positive).',
              '2. Determine which quadrants apply using ASTC and the sign of k.',
              '3. Write all solutions in the domain using the reference angle and quadrant symmetry.',
              '4. Check each solution lies in the given domain.',
            ]},
            { type: 'rules', heading: 'Symmetry Rules for the Unit Circle', items: [
              'sin θ = sin(π − θ): symmetric about θ = π/2.',
              'cos θ = cos(−θ) = cos(2π − θ): symmetric about θ = 0 and θ = π.',
              'tan θ = tan(θ + π): repeats every π.',
              'For extended domains: add 2πk (for sin/cos) or πk (for tan) to each solution.',
            ]},
            { type: 'example', question: 'Solve sin(2x) = √3/2 for 0 ≤ x ≤ 2π', steps: [
              'Let u = 2x. Domain of u: 0 ≤ 2x ≤ 4π, so 0 ≤ u ≤ 4π.',
              'sin u = √3/2 → u = π/3 (Q1) or u = π − π/3 = 2π/3 (Q2) in [0, 2π].',
              'Extended to [0, 4π]: add 2π to each: u = π/3, 2π/3, π/3 + 2π = 7π/3, 2π/3 + 2π = 8π/3.',
              'Back-substitute x = u/2: x = π/6, π/3, 7π/6, 4π/3.',
            ]},
            { type: 'tip', body: 'For compound angle equations like sin(2x + π/3) = k, ALWAYS adjust the domain first. Set 2x + π/3 = u, find the new domain for u, solve completely in u, then convert back to x at the very end.' },
          ],
        },
      ],
    },
    // ── Chapter 9: Differentiation ────────────────────────────────────────────
    {
      levelId: 'y11-ext1-l9', levelNum: 9, title: 'Differentiation', emoji: '∂', color: '#14B8A6',
      stages: [
        {
          stageId: 'y11-ext1-l9-s9a', code: '9A', title: 'Limits and First Principles',
          outcomeIds: ['MA-CALC-D01'], topicIds: ['MA-CALC-D01'],
          explanation: 'lim[h→0] (f(x+h)−f(x))/h is the derivative. Apply from first principles for simple functions to understand the concept. This limit equals the gradient of the tangent at the point.',
          content: [
            { type: 'text', body: 'Differentiation from first principles shows where the derivative comes from. The derivative is the limit of the average rate of change (gradient of the secant) as the gap shrinks to zero — giving the instantaneous rate of change (gradient of the tangent).' },
            { type: 'formula', latex: "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}", label: 'Definition of the derivative (first principles)' },
            { type: 'steps', heading: 'First Principles Method', items: [
              '1. Write f(x + h) by substituting (x + h) into the function.',
              '2. Compute f(x + h) − f(x) and simplify — cancel all terms that do not involve h.',
              '3. Divide by h (there will always be an h factor to cancel).',
              '4. Take the limit as h → 0 (substitute h = 0 into the simplified expression).',
            ]},
            { type: 'example', question: "Find f'(x) from first principles for f(x) = x²", steps: [
              'f(x + h) = (x + h)² = x² + 2xh + h²',
              'f(x + h) − f(x) = 2xh + h²',
              '(f(x+h) − f(x))/h = (2xh + h²)/h = 2x + h',
              'Limit as h → 0: f\'(x) = 2x',
            ]},
            { type: 'tip', body: 'In step 3, if you cannot cancel the h in the denominator, you have made an algebraic error in step 2 — go back and check. The h always cancels cleanly in first-principles derivations for polynomial and simple functions.' },
          ],
        },
        {
          stageId: 'y11-ext1-l9-s9b', code: '9B', title: 'Differentiating Powers of x',
          outcomeIds: ['MA-CALC-D01'], topicIds: ['MA-CALC-D01'],
          explanation: 'd/dx(xⁿ) = nxⁿ⁻¹ for any rational n. Sum and constant multiple rules apply. Write expressions with negative and fractional indices before differentiating: √x = x^(1/2), 1/x = x⁻¹.',
          content: [
            { type: 'text', body: 'The power rule is the workhorse of differentiation. It applies to any real (including fractional and negative) power of x. Before differentiating, rewrite all roots as fractional powers and all reciprocals as negative powers.' },
            { type: 'formula', latex: '\\frac{d}{dx}(x^n) = nx^{n-1}', label: 'Power rule (any real n)' },
            { type: 'formula', latex: '\\frac{d}{dx}(af(x)) = a f\'(x), \\qquad \\frac{d}{dx}(f \\pm g) = f\' \\pm g\'', label: 'Constant multiple and sum rules' },
            { type: 'rules', heading: 'Rewriting Before Differentiating', items: [
              '√x = x^(1/2),  so  d/dx(√x) = (1/2)x^(−1/2) = 1/(2√x)',
              '1/x = x^(−1),  so  d/dx(1/x) = −x^(−2) = −1/x²',
              '1/x² = x^(−2),  so  d/dx(1/x²) = −2x^(−3) = −2/x³',
              '∛x = x^(1/3),  so  d/dx(∛x) = (1/3)x^(−2/3)',
            ]},
            { type: 'example', question: "Differentiate y = 3x⁴ − 2x^(1/2) + 5/x", steps: [
              'Rewrite: y = 3x⁴ − 2x^(1/2) + 5x^(−1)',
              'dy/dx = 12x³ − 2·(1/2)x^(−1/2) + 5·(−1)x^(−2)',
              '= 12x³ − x^(−1/2) − 5x^(−2)',
              '= 12x³ − 1/√x − 5/x²',
            ]},
            { type: 'tip', body: 'Always rewrite surds and fractions using index notation before differentiating. Students who try to differentiate √x "by guessing" inevitably get the wrong answer. The power rule only applies to x^n form.' },
          ],
        },
        {
          stageId: 'y11-ext1-l9-s9c', code: '9C', title: 'Differentiating Trig, Exp and Log Functions',
          outcomeIds: ['MA-CALC-D04', 'MA-CALC-D05', 'MA-CALC-D06'], topicIds: ['MA-CALC-D04', 'MA-CALC-D05', 'MA-CALC-D06'],
          explanation: 'd/dx(sin x)=cos x; d/dx(cos x)=−sin x; d/dx(tan x)=sec²x; d/dx(eˣ)=eˣ; d/dx(ln x)=1/x. All require x in radians. Memorise these and extend with the chain rule.',
          content: [
            { type: 'text', body: 'The derivatives of the standard transcendental functions must be memorised — they are the building blocks that, combined with the product, quotient, and chain rules, allow you to differentiate any function you will encounter in this course.' },
            { type: 'table', headers: ['Function', 'Derivative', 'Condition'], rows: [
              ['sin x', 'cos x', 'x in radians'],
              ['cos x', '−sin x', 'x in radians'],
              ['tan x', 'sec² x = 1/cos²x', 'x in radians, x ≠ π/2 + nπ'],
              ['eˣ', 'eˣ', 'Unique: the only function equal to its own derivative'],
              ['aˣ', 'aˣ ln a', 'For any base a > 0, a ≠ 1'],
              ['ln x', '1/x', 'x > 0'],
              ['logₐ x', '1/(x ln a)', 'For any base a > 0, a ≠ 1'],
            ]},
            { type: 'rules', heading: 'Memory Aids', items: [
              'sin → cos → −sin → −cos → sin: the sine cycle repeats every 4 derivatives.',
              'eˣ is special: differentiating it gives itself back.',
              'ln x: think "log gives 1/x" — simpler than it looks.',
              'tan x: sec²x = 1 + tan²x is a useful equivalent.',
            ]},
            { type: 'example', question: "Differentiate y = e^x sin x (use product rule)", steps: [
              'u = eˣ, v = sin x.',
              "u' = eˣ, v' = cos x.",
              "dy/dx = u'v + uv' = eˣ sin x + eˣ cos x = eˣ(sin x + cos x).",
            ]},
            { type: 'tip', body: 'The derivatives of trig functions are only correct when x is in radians. If you accidentally use degrees in a calculus problem, all derivative values will be wrong by a factor of π/180.' },
          ],
        },
        {
          stageId: 'y11-ext1-l9-s9d', code: '9D', title: 'The Product and Quotient Rules',
          outcomeIds: ['MA-CALC-D02'], topicIds: ['MA-CALC-D02'],
          explanation: "Product: (uv)'=u'v+uv'. Quotient: (u/v)'=(u'v−uv')/v². Identify u and v clearly before applying. Product rule often easier than quotient — rewrite a/b as a·b⁻¹ if convenient.",
          content: [
            { type: 'text', body: 'When differentiating a product or quotient of two functions, the rules are more complex than simple addition. Identify u and v clearly, write them out, find each derivative, then apply the formula — never try to do it in your head.' },
            { type: 'formula', latex: "\\frac{d}{dx}(uv) = u'v + uv'", label: 'Product Rule' },
            { type: 'formula', latex: "\\frac{d}{dx}\\!\\left(\\frac{u}{v}\\right) = \\frac{u'v - uv'}{v^2}", label: 'Quotient Rule' },
            { type: 'steps', heading: 'Applying the Product Rule', items: [
              '1. Identify u and v.',
              "2. Find u' and v' using the standard rules.",
              "3. Apply: d/dx(uv) = u'v + uv'.",
              '4. Expand and simplify if required.',
            ]},
            { type: 'example', question: "Differentiate y = x³ ln x", steps: [
              'u = x³, v = ln x.',
              "u' = 3x², v' = 1/x.",
              "dy/dx = 3x² · ln x + x³ · (1/x) = 3x² ln x + x².",
              '= x²(3 ln x + 1).',
            ]},
            { type: 'example', question: 'Differentiate $y = \\dfrac{x^2 + 1}{\\sqrt{x}}$', steps: [
              'u = x² + 1, v = x^(1/2).',
              "u' = 2x, v' = (1/2)x^(−1/2).",
              "dy/dx = (2x · x^(1/2) − (x²+1)(1/2)x^(−1/2)) / x",
              'Multiply numerator and denominator by 2√x: = (4x² − x² − 1) / (2x^(3/2))',
              '$= \\dfrac{3x^2 - 1}{2x\\sqrt{x}}$',
            ]},
            { type: 'tip', body: 'Write out u, v, u\', v\' as four separate lines before applying any formula. This single habit eliminates most errors in product and quotient rule questions. The formula itself is mechanical — the errors happen in computing u\' and v\'.' },
          ],
        },
        {
          stageId: 'y11-ext1-l9-s9e', code: '9E', title: 'The Chain Rule',
          outcomeIds: ['MA-CALC-D03'], topicIds: ['MA-CALC-D03'],
          explanation: "d/dx[f(g(x))] = f'(g(x))·g'(x). Identify outer and inner functions. Differentiate outer (leave inner unchanged), then multiply by derivative of inner. Essential for composite functions.",
          content: [
            { type: 'text', body: 'The chain rule differentiates composite functions — functions "inside" other functions. It is the most important rule in calculus: without it, you cannot differentiate sin(x²), eˣ², (x²+1)³, or any other composite. Every rule you know extends via the chain rule.' },
            { type: 'formula', latex: "\\frac{d}{dx}[f(g(x))] = f'(g(x)) \\cdot g'(x)", label: 'Chain Rule' },
            { type: 'rules', heading: 'Chain Rule in Words', items: [
              'Differentiate the outer function, leaving the inner unchanged.',
              'Multiply the result by the derivative of the inner function.',
              'Outer function: what you would do last to evaluate the expression.',
              'Inner function: what is "inside" (the argument of the outer).',
            ]},
            { type: 'table', headers: ['Function', 'Outer f', 'Inner g', 'Derivative'], rows: [
              ['(x² + 1)⁵', 'u⁵', 'u = x²+1', '5(x²+1)⁴ · 2x = 10x(x²+1)⁴'],
              ['sin(3x)', 'sin u', 'u = 3x', 'cos(3x) · 3 = 3cos(3x)'],
              ['e^(x²)', 'eᵘ', 'u = x²', 'e^(x²) · 2x = 2xe^(x²)'],
              ['ln(x² + 1)', 'ln u', 'u = x²+1', '1/(x²+1) · 2x = 2x/(x²+1)'],
              ['√(sin x)', 'u^(1/2)', 'u = sin x', '(1/2)(sin x)^(−1/2) · cos x = cos x/(2√sin x)'],
            ]},
            { type: 'tip', body: 'The chain rule can be applied repeatedly for deeply nested functions: work from the outermost layer inward, multiplying a new derivative factor at each layer. For example, d/dx[sin²(3x)] = 2sin(3x)·cos(3x)·3.' },
          ],
        },
        {
          stageId: 'y11-ext1-l9-s9f', code: '9F', title: 'Rates of Change',
          outcomeIds: ['MA-CALC-D07'], topicIds: ['MA-CALC-D07'],
          explanation: 'The derivative dy/dx gives the instantaneous rate of change of y with respect to x. Interpret in context: velocity = dx/dt, acceleration = dv/dt. Use units in all answers.',
          content: [
            { type: 'text', body: 'Derivatives measure how fast one quantity changes with respect to another. This interpretation connects abstract calculus to real-world motion, growth, and decay problems. The chain rule links rates of change involving three or more variables.' },
            { type: 'table', headers: ['Quantity', 'Symbol', 'Derivative', 'Meaning'], rows: [
              ['Position', 'x(t) or s(t)', 'dx/dt or v', 'Velocity'],
              ['Velocity', 'v(t)', 'dv/dt or a', 'Acceleration'],
              ['Volume', 'V(t)', 'dV/dt', 'Rate of change of volume'],
              ['Population', 'P(t)', 'dP/dt', 'Rate of growth'],
            ]},
            { type: 'formula', latex: '\\frac{dy}{dt} = \\frac{dy}{dx} \\cdot \\frac{dx}{dt}', label: 'Chain rule for related rates' },
            { type: 'example', question: 'A balloon is being inflated. When r = 5 cm, dr/dt = 2 cm/s. Find dV/dt at this moment. [V = (4/3)πr³]', steps: [
              'dV/dr = 4πr².',
              'dV/dt = dV/dr · dr/dt = 4πr² · 2 = 8πr².',
              'When r = 5: dV/dt = 8π(25) = 200π cm³/s.',
            ]},
            { type: 'example', question: 'A particle moves so x = t³ − 6t. Find when it is at rest and find its acceleration then.', steps: [
              'Velocity: v = dx/dt = 3t² − 6. At rest: v = 0 → 3t² = 6 → t = √2 (taking t ≥ 0).',
              'Acceleration: a = dv/dt = 6t. At t = √2: a = 6√2 m/s².',
            ]},
            { type: 'tip', body: 'Always state the units in rates of change answers. If distance is in metres and time in seconds, velocity is m/s and acceleration is m/s². The units tell you what the derivative represents.' },
          ],
        },
      ],
    },
    // ── Chapter 10: The Geometry of the Derivative ────────────────────────────
    {
      levelId: 'y11-ext1-l10', levelNum: 10, title: 'Geometry of the Derivative', emoji: '📐', color: '#6366F1',
      stages: [
        {
          stageId: 'y11-ext1-l10-s10a', code: '10A', title: 'Increasing, Decreasing, and Stationary Points',
          outcomeIds: ['MA-CALC-D07'], topicIds: ['MA-CALC-D07'],
          explanation: "f'(x) > 0: increasing. f'(x) < 0: decreasing. f'(x) = 0: stationary. Types of stationary points: local max, local min, or horizontal point of inflection. Use a sign diagram of f'(x) to classify.",
          content: [
            { type: 'text', body: "The first derivative f'(x) is the gradient function. Its sign at each x-value tells you whether the curve is rising, falling, or flat. Combining this information with the types of stationary points gives you a complete picture of the function's behaviour." },
            { type: 'table', headers: ["f'(x)", 'Graph behaviour'], rows: [
              ["f'(x) > 0", 'Function is increasing (rising from left to right)'],
              ["f'(x) < 0", 'Function is decreasing (falling from left to right)'],
              ["f'(x) = 0", 'Stationary point — could be max, min, or horizontal inflection'],
            ]},
            { type: 'rules', heading: "Sign Diagram of f'(x) — Classifying Stationary Points", items: [
              "Solve f'(x) = 0 to find stationary points.",
              "Draw a sign diagram of f'(x) around each stationary point.",
              "Local maximum: f' changes from + to − (rising then falling).",
              "Local minimum: f' changes from − to + (falling then rising).",
              "Horizontal point of inflection: f' doesn't change sign (stays + or stays −).",
            ]},
            { type: 'example', question: "Find and classify the stationary points of f(x) = x³ − 3x + 2", steps: [
              "f'(x) = 3x² − 3 = 3(x² − 1) = 3(x−1)(x+1).",
              "f'(x) = 0 at x = 1 and x = −1.",
              "Sign diagram: test x = −2: f'(−2) = 3(4−1) = 9 > 0. Test x = 0: f'(0) = −3 < 0. Test x = 2: f'(2) = 9 > 0.",
              'Sign pattern: + | − | +.',
              'At x = −1: + → − : local maximum. f(−1) = −1 + 3 + 2 = 4. Max at (−1, 4).',
              'At x = 1: − → + : local minimum. f(1) = 1 − 3 + 2 = 0. Min at (1, 0).',
            ]},
            { type: 'tip', body: "A stationary point exists where f'(x) = 0, but f'(x) = 0 alone does not tell you the TYPE. Always draw a sign diagram of f'(x) on BOTH sides of the stationary point to classify it correctly." },
          ],
        },
        {
          stageId: 'y11-ext1-l10-s10b', code: '10B', title: 'Second Derivative, Concavity, and Points of Inflection',
          outcomeIds: ['MA-CALC-D08'], topicIds: ['MA-CALC-D08'],
          explanation: "f''(x) > 0: concave up. f''(x) < 0: concave down. Inflection point: concavity changes (f''=0 is necessary but not sufficient — test the sign change). Second derivative test for stationary points.",
          content: [
            { type: 'text', body: "The second derivative f''(x) measures how the gradient itself is changing — whether the curve is bending upward (concave up, like a bowl) or downward (concave down, like an arch). Points where the concavity changes are called inflection points." },
            { type: 'table', headers: ["f''(x)", 'Concavity', 'Visual'], rows: [
              ["f''(x) > 0", 'Concave up (curves upward)', 'Looks like ∪ — holds water'],
              ["f''(x) < 0", 'Concave down (curves downward)', 'Looks like ∩ — spills water'],
              ["f''(x) = 0", 'Possible inflection — check sign change of f\'\'', 'Test both sides'],
            ]},
            { type: 'rules', heading: 'Second Derivative Test for Stationary Points', items: [
              "At a stationary point where f'(a) = 0:",
              "If f''(a) > 0: local minimum (concave up at that point).",
              "If f''(a) < 0: local maximum (concave down at that point).",
              "If f''(a) = 0: test is inconclusive — use the sign diagram of f'(x) instead.",
            ]},
            { type: 'rules', heading: 'Finding Points of Inflection', items: [
              "Solve f''(x) = 0 to find candidates.",
              "Check that f'' changes sign at that point (test values on both sides).",
              "If f'' does not change sign, it is NOT an inflection point.",
              "Note: f''(x) = 0 is necessary but NOT sufficient for an inflection — always verify the sign change.",
            ]},
            { type: 'example', question: "Find the inflection point of f(x) = x³ − 3x² + 4", steps: [
              "f'(x) = 3x² − 6x. f''(x) = 6x − 6 = 6(x − 1).",
              "f''(x) = 0 when x = 1.",
              "Test: f''(0) = −6 < 0 (concave down). f''(2) = 6 > 0 (concave up). Sign changes. ✓",
              'Inflection point at x = 1: y = 1 − 3 + 4 = 2. Inflection at (1, 2).',
            ]},
            { type: 'tip', body: "Never conclude there is an inflection just because f''(a) = 0. For example, f(x) = x⁴ has f''(0) = 0 but no inflection at x = 0 (concavity doesn't change). Always verify the sign change of f''." },
          ],
        },
        {
          stageId: 'y11-ext1-l10-s10c', code: '10C', title: 'Curve Sketching Using the Derivative',
          outcomeIds: ['MA-CALC-D08'], topicIds: ['MA-CALC-D08'],
          explanation: "Full sketch procedure: domain, intercepts, stationary points (f'=0), nature (sign diagram of f'), inflections (f''=0, test sign change), asymptotes, end behaviour. Combine all features.",
          content: [
            { type: 'text', body: 'Curve sketching is the synthesis of everything you know about functions and calculus. A systematic, methodical approach — always in the same order — ensures you never miss a feature and earn full marks on this question type.' },
            { type: 'steps', heading: 'Complete Curve Sketching Procedure', items: [
              '1. Domain: identify any restrictions (x ≠ 0, x > 0, etc.).',
              '2. Intercepts: y-intercept (x = 0), x-intercepts (y = 0).',
              '3. Symmetry: test for even/odd function.',
              "4. Stationary points: solve f'(x) = 0; find y-values; classify (sign diagram or 2nd derivative test).",
              "5. Inflection points: solve f''(x) = 0; verify sign change of f''; find y-values.",
              "6. Increasing/decreasing: read from sign diagram of f'(x).",
              "7. Concavity: read from sign diagram of f''(x).",
              '8. Asymptotes: vertical (denominator = 0), horizontal (limit as x → ±∞).',
              '9. End behaviour: what happens as x → ±∞?',
              '10. Sketch: plot all found points, draw smooth curve respecting all properties.',
            ]},
            { type: 'example', question: "Sketch f(x) = x³ − 3x (key features only)", steps: [
              "Domain: ℝ. x-intercepts: x(x²−3) = 0 → x = 0, ±√3. y-intercept: 0.",
              "Odd function (symmetric about origin).",
              "f'(x) = 3x² − 3 = 3(x−1)(x+1) = 0 → x = ±1.",
              "f(-1) = 2 (local max); f(1) = −2 (local min).",
              "f''(x) = 6x = 0 → x = 0. Sign changes: inflection at (0, 0).",
              "End behaviour: x → +∞: f → +∞; x → −∞: f → −∞.",
            ]},
            { type: 'tip', body: 'Work through the sketch in exactly the same order every time. Under exam pressure, following a memorised procedure prevents you from forgetting steps. Label every feature on the graph: coordinates of turning points, inflections, and intercepts.' },
          ],
        },
        {
          stageId: 'y11-ext1-l10-s10d', code: '10D', title: 'Optimisation Problems',
          outcomeIds: ['MA-CALC-D09'], topicIds: ['MA-CALC-D09'],
          explanation: "Model the problem: define the variable, write a formula for the quantity to optimise, differentiate, solve f'=0. Verify it is a max or min using the second derivative or sign diagram. Check endpoints.",
          content: [
            { type: 'text', body: 'Optimisation (maximising or minimising a quantity) is calculus\'s most important application. The process is: set up a formula, reduce it to one variable using a constraint, differentiate, and find the critical points. Always verify the nature (max or min) and check the domain for endpoint values.' },
            { type: 'steps', heading: 'Optimisation Framework', items: [
              '1. Read the problem carefully. Draw a diagram.',
              '2. Define variable(s) clearly (e.g. "let x be the length in cm").',
              '3. Write a formula for the quantity to maximise/minimise (e.g. Area, Cost, Volume).',
              '4. Identify any constraints and use them to reduce to ONE variable.',
              "5. Differentiate and solve f'(x) = 0.",
              '6. Verify max or min: use second derivative test or sign diagram.',
              '7. Check domain endpoints if the domain is a closed interval.',
              '8. Answer the question in context with units.',
            ]},
            { type: 'example', question: 'A farmer has 200 m of fencing to enclose a rectangular paddock (one side is a river wall — no fencing needed). Find the dimensions for maximum area.', steps: [
              'Let width = x m (the two sides perpendicular to the river). Length = 200 − 2x m.',
              'Area A = x(200 − 2x) = 200x − 2x².',
              "A' = 200 − 4x = 0 → x = 50.",
              "A'' = −4 < 0: confirmed maximum.",
              'Width = 50 m, Length = 200 − 100 = 100 m. Max area = 50 × 100 = 5000 m².',
            ]},
            { type: 'tip', body: 'Always verify the answer is actually a maximum (or minimum) — use A\'\'(x) or a sign diagram. In closed-domain problems, also check the values at the endpoints. The maximum might occur at an endpoint, not an interior critical point.' },
          ],
        },
        {
          stageId: 'y11-ext1-l10-s10e', code: '10E', title: 'Tangents, Normals, and Related Rates',
          outcomeIds: ['MA-CALC-D07'], topicIds: ['MA-CALC-D07'],
          explanation: "Tangent at (a, f(a)): m = f'(a). Normal: m = −1/f'(a). Related rates: use the chain rule dy/dt = (dy/dx)·(dx/dt) to link rates of change. Label all variables and their rates clearly.",
          content: [
            { type: 'text', body: 'The tangent line touches a curve at exactly one point and has the same gradient as the curve there. The normal is perpendicular to the tangent. Both appear in geometry, parametric curves, and physics problems throughout the HSC.' },
            { type: 'rules', heading: 'Tangent and Normal Lines at x = a', items: [
              "Gradient of tangent: m_T = f'(a).",
              'Gradient of normal: m_N = −1/f\'(a)  (perpendicular means m₁m₂ = −1).',
              'Equation of tangent: y − f(a) = f\'(a)(x − a).',
              'Equation of normal: y − f(a) = −1/f\'(a) · (x − a).',
            ]},
            { type: 'example', question: "Find the tangent and normal to y = x² − 2x at x = 3", steps: [
              'At x = 3: y = 9 − 6 = 3. Point: (3, 3).',
              "y' = 2x − 2. At x = 3: m_T = 4.",
              'Tangent: y − 3 = 4(x − 3) → y = 4x − 9.',
              'Normal gradient: −1/4. Normal: y − 3 = −1/4(x − 3) → y = −x/4 + 15/4.',
            ]},
            { type: 'rules', heading: 'Related Rates', items: [
              'When two quantities x and y are related, their rates of change (with respect to time t) are also related.',
              "Use the chain rule: dy/dt = dy/dx · dx/dt.",
              'Label each rate with its variable and units before starting.',
              'Substitute specific values only AFTER differentiating the relationship.',
            ]},
            { type: 'tip', body: 'In related rates problems: (1) write the geometric relationship between the variables, (2) differentiate both sides with respect to t, (3) substitute the given instant values. Do NOT substitute the given values before differentiating — this is the most common error.' },
          ],
        },
      ],
    },
    // ── Chapter 11: Integration ───────────────────────────────────────────────
    {
      levelId: 'y11-ext1-l11', levelNum: 11, title: 'Integration', emoji: '∫', color: '#8B5CF6',
      stages: [
        {
          stageId: 'y11-ext1-l11-s11a', code: '11A', title: 'Anti-differentiation and Indefinite Integrals',
          outcomeIds: ['MA-CALC-I01'], topicIds: ['MA-CALC-I01'],
          explanation: '∫xⁿ dx = xⁿ⁺¹/(n+1) + C (n ≠ −1). ∫eˣ dx = eˣ + C. ∫(1/x) dx = ln|x| + C. ∫sin x dx = −cos x + C. ∫cos x dx = sin x + C. The constant C is found from an initial condition.',
          content: [
            { type: 'text', body: 'Integration is the reverse process of differentiation. Finding the anti-derivative of f(x) means finding a function F(x) such that F\'(x) = f(x). The constant of integration C accounts for the fact that infinitely many functions differ only by a constant yet have the same derivative.' },
            { type: 'table', headers: ['Function f(x)', 'Anti-derivative F(x) + C', 'Condition'], rows: [
              ['xⁿ', 'xⁿ⁺¹/(n+1) + C', 'n ≠ −1'],
              ['1/x = x⁻¹', 'ln|x| + C', 'x ≠ 0'],
              ['eˣ', 'eˣ + C', '—'],
              ['eᵃˣ', 'eᵃˣ/a + C', 'a ≠ 0'],
              ['sin x', '−cos x + C', 'x in radians'],
              ['cos x', 'sin x + C', 'x in radians'],
              ['sec²x', 'tan x + C', 'x in radians'],
            ]},
            { type: 'formula', latex: '\\int x^n \\, dx = \\frac{x^{n+1}}{n+1} + C \\quad (n \\neq -1)', label: 'Power rule for integration' },
            { type: 'rules', heading: 'Finding C from Initial Conditions', items: [
              'Integrate to get F(x) = … + C.',
              'Substitute the given point (x₀, y₀) into F(x₀) = y₀.',
              'Solve for C.',
              'Write the specific function F(x) with the found C.',
            ]},
            { type: 'example', question: "Find f(x) given f'(x) = 3x² − 2x and f(1) = 4", steps: [
              '∫(3x² − 2x) dx = x³ − x² + C.',
              'f(1) = 1 − 1 + C = C = 4.',
              'Therefore f(x) = x³ − x² + 4.',
            ]},
            { type: 'tip', body: 'Integration is harder than differentiation because there is no product rule or chain rule in reverse. For now, the strategy is pattern recognition — match the integrand to one of the standard forms. Stage 11D (substitution) handles composites.' },
          ],
        },
        {
          stageId: 'y11-ext1-l11-s11b', code: '11B', title: 'Definite Integrals and Area',
          outcomeIds: ['MA-CALC-I02'], topicIds: ['MA-CALC-I02'],
          explanation: '∫[a,b] f(x) dx = F(b) − F(a). Signed area: negative below x-axis. For total (unsigned) area: split at roots and take absolute values. ∫[a,a] f dx = 0; ∫[b,a] = −∫[a,b].',
          content: [
            { type: 'text', body: 'The definite integral gives the signed area between the curve y = f(x) and the x-axis over an interval [a, b]. "Signed" means regions below the x-axis contribute negative area. For total (actual) area, you must deal with this by splitting the integral at x-intercepts.' },
            { type: 'formula', latex: '\\int_a^b f(x)\\,dx = F(b) - F(a)', label: 'Fundamental Theorem of Calculus' },
            { type: 'rules', heading: 'Key Properties of Definite Integrals', items: [
              '∫ₐᵃ f(x) dx = 0  (same upper and lower limit).',
              '∫ₐᵇ f(x) dx = −∫ᵦᵃ f(x) dx  (swapping limits negates the integral).',
              '∫ₐᵇ [f(x) ± g(x)] dx = ∫ₐᵇ f(x) dx ± ∫ₐᵇ g(x) dx',
              '∫ₐᵇ k·f(x) dx = k · ∫ₐᵇ f(x) dx',
              'For even f(x): ∫₋ₐᵃ f(x) dx = 2∫₀ᵃ f(x) dx.',
              'For odd f(x): ∫₋ₐᵃ f(x) dx = 0.',
            ]},
            { type: 'rules', heading: 'Total Area (always positive)', items: [
              '1. Find all x-intercepts of f in [a, b].',
              '2. Split the integral at each x-intercept.',
              '3. Take the absolute value of each piece.',
              '4. Add the absolute values: Total area = Σ |∫ over each piece|.',
            ]},
            { type: 'example', question: 'Find the total area between y = x² − x and the x-axis from x = 0 to x = 2', steps: [
              'x-intercepts: x(x−1) = 0 → x = 0 and x = 1. Splits at x = 1.',
              '∫₀¹ (x²−x) dx = [x³/3 − x²/2]₀¹ = 1/3 − 1/2 = −1/6.',
              '∫₁² (x²−x) dx = [x³/3 − x²/2]₁² = (8/3 − 2) − (1/3 − 1/2) = 2/3 + 1/6 = 5/6.',
              'Total area = |−1/6| + |5/6| = 1/6 + 5/6 = 1.',
            ]},
            { type: 'tip', body: 'The most common error in area questions is forgetting to split the integral at x-intercepts. A negative definite integral does NOT mean the area is negative — it means the region is below the x-axis. Always sketch the curve to see where it crosses the x-axis.' },
          ],
        },
        {
          stageId: 'y11-ext1-l11-s11c', code: '11C', title: 'Areas Between Curves',
          outcomeIds: ['MA-CALC-I07'], topicIds: ['MA-CALC-I07'],
          explanation: 'Area between y=f(x) and y=g(x) from a to b: ∫[a,b] |f(x)−g(x)| dx. Find intersection points first (these are the limits). If the curves cross in the interval, split the integral at that point.',
          content: [
            { type: 'text', body: 'The area between two curves is found by integrating the difference of the functions — always (top function) minus (bottom function). The limits of integration are the x-coordinates where the curves intersect.' },
            { type: 'formula', latex: '\\text{Area} = \\int_a^b [f(x) - g(x)]\\,dx', label: 'Area between curves (f ≥ g on [a,b])' },
            { type: 'steps', heading: 'Method for Areas Between Curves', items: [
              '1. Find the intersection points: solve f(x) = g(x) for x. These give the limits a and b.',
              '2. Determine which function is on top (larger y-value) in the interval [a, b].',
              '3. Integrate (top − bottom) from a to b.',
              '4. If the curves cross inside [a, b], split the integral at the crossing point.',
              '5. Take absolute values of each piece and add.',
            ]},
            { type: 'example', question: 'Find the area enclosed by y = x² and y = x + 2', steps: [
              'Intersection: x² = x + 2 → x² − x − 2 = 0 → (x−2)(x+1) = 0 → x = −1, x = 2.',
              'On [−1, 2]: y = x + 2 is above y = x² (check x = 0: 2 > 0). ✓',
              'Area = ∫₋₁² (x+2 − x²) dx = [x²/2 + 2x − x³/3]₋₁²',
              '= (2 + 4 − 8/3) − (1/2 − 2 + 1/3) = (6 − 8/3) − (−3/2 + 1/3)',
              '= 10/3 + 7/6 = 20/6 + 7/6 = 27/6 = 9/2.',
            ]},
            { type: 'tip', body: 'Always verify which curve is on top by testing a value inside the interval — do not assume! If y₁ and y₂ swap over the interval, you must split the integral at the crossing point and handle each piece separately.' },
          ],
        },
        {
          stageId: 'y11-ext1-l11-s11d', code: '11D', title: 'Integration by Substitution',
          outcomeIds: ['MA-CALC-I05'], topicIds: ['MA-CALC-I05'],
          explanation: 'Let u = g(x), then du = g\'(x)dx. Rewrite ∫f(g(x))g\'(x)dx = ∫f(u)du. For definite integrals, change the limits using u = g(x). Recognise the pattern: the integrand contains g\'(x) as a factor.',
          content: [
            { type: 'text', body: 'Integration by substitution is the reverse of the chain rule. It works when the integrand is a composite function whose inner function\'s derivative also appears as a factor. Recognising this pattern is the key skill.' },
            { type: 'steps', heading: 'Method: Indefinite Integral', items: [
              '1. Identify u = g(x) (the inner function — usually the "complicated" part).',
              '2. Compute du/dx = g\'(x), then write du = g\'(x) dx.',
              '3. Substitute: replace g(x) with u and g\'(x) dx with du.',
              '4. Integrate with respect to u using standard rules.',
              '5. Back-substitute: replace u with g(x) and add + C.',
            ]},
            { type: 'steps', heading: 'Method: Definite Integral (change the limits)', items: [
              '1–3: Same as above.',
              '4. Change the x-limits to u-limits using u = g(x):  when x = a, u = g(a);  when x = b, u = g(b).',
              '5. Integrate with respect to u from g(a) to g(b).',
              '6. Do NOT back-substitute — evaluate directly with the new limits.',
            ]},
            { type: 'example', question: 'Find ∫ 2x(x² + 1)⁴ dx', steps: [
              'Let u = x² + 1. Then du/dx = 2x, so du = 2x dx.',
              'Integral becomes: ∫ u⁴ du.',
              '= u⁵/5 + C = (x² + 1)⁵/5 + C.',
            ]},
            { type: 'example', question: 'Evaluate ∫₀¹ x·eˣ² dx', steps: [
              'Let u = x². Then du = 2x dx, so x dx = du/2.',
              'Change limits: x = 0 → u = 0; x = 1 → u = 1.',
              '= ∫₀¹ eᵘ · (du/2) = (1/2)[eᵘ]₀¹ = (1/2)(e − 1).',
            ]},
            { type: 'tip', body: 'The "detective" approach: look for a function and its derivative both present in the integrand. If you see x·(x²+1)ⁿ, the x is almost the derivative of x²+1, suggesting u = x²+1. The missing factor (often a constant like 2) can be adjusted by multiplying and dividing.' },
          ],
        },
      ],
    },
    // ── Chapter 17: Combinatorics (Cambridge Extension 1 Ch 17) ──────────────
    {
      levelId: 'y11-ext1-l12', levelNum: 12, title: 'Combinatorics', emoji: '🎯', color: '#F59E0B',
      stages: [
        // 17A ─────────────────────────────────────────────────────────────────
        {
          stageId: 'y11-ext1-l12-s12a', code: '17A', title: 'Factorial Notation',
          outcomeIds: ['MA-PROB-03'], topicIds: ['MA-PROB-03'],
          explanation: 'n! = n × (n−1) × … × 2 × 1, with 0! = 1. Factorials count all arrangements of n distinct objects. Use the multiplication principle: if task 1 has m ways and task 2 has n ways, combined they have m × n ways.',
          content: [
            { type: 'text', body: 'Combinatorics is the mathematics of counting arrangements and selections. The factorial function is the foundational tool: n! (read "n factorial") counts the number of ways to arrange n distinct objects in a row.' },
            { type: 'formula', latex: 'n! = n \\times (n-1) \\times (n-2) \\times \\cdots \\times 2 \\times 1', label: 'Factorial definition' },
            { type: 'formula', latex: '0! = 1', label: 'Special case (by convention)' },
            { type: 'rules', heading: 'Multiplication Principle', items: [
              'If a task is done in stages, with m ways for stage 1 and n ways for stage 2 (independently), the total number of ways to complete BOTH stages is m × n.',
              'Extends to any number of stages: multiply all stage-counts together.',
              '"AND" signals multiplication: choosing a shirt AND pants = (shirt choices) × (pants choices).',
              '"OR" signals addition: travelling by bus OR train = (bus routes) + (train routes).',
            ]},
            { type: 'table', headers: ['n', 'n!'], rows: [
              ['1', '1'],
              ['2', '2'],
              ['3', '6'],
              ['4', '24'],
              ['5', '120'],
              ['6', '720'],
              ['10', '3 628 800'],
            ]},
            { type: 'example', question: 'In how many ways can 5 books be arranged on a shelf?', steps: [
              '5 choices for position 1, then 4 for position 2, then 3, 2, 1.',
              'Total = 5! = 5 × 4 × 3 × 2 × 1 = 120.',
            ]},
            { type: 'example', question: 'A student travels by bus (3 routes) OR train (2 routes) to school. How many options?', steps: [
              'The methods are mutually exclusive (choose one OR the other).',
              'Total = 3 + 2 = 5 options.',
            ]},
            { type: 'tip', body: 'Factorials grow extremely fast: 13! > 6 billion. When simplifying expressions like 8!/6!, cancel common factors: 8!/6! = 8 × 7 = 56. Never fully expand large factorials.' },
          ],
        },
        // 17B ─────────────────────────────────────────────────────────────────
        {
          stageId: 'y11-ext1-l12-s12b', code: '17B', title: 'Ordered Selections With and Without Repetition',
          outcomeIds: ['MA-PROB-03'], topicIds: ['MA-PROB-03'],
          explanation: 'Without repetition: ⁿPᵣ = n!/(n−r)! — choosing r objects from n in order, no repeats. With repetition: nʳ — each of r positions has n choices independently.',
          content: [
            { type: 'text', body: 'An ordered selection (arrangement) is one where the ORDER of the chosen objects matters. "ABC" and "BAC" are different ordered selections. There are two cases: without repetition (each object used at most once) and with repetition (objects may be reused).' },
            { type: 'formula', latex: '^nP_r = \\frac{n!}{(n-r)!} = n(n-1)(n-2)\\cdots(n-r+1)', label: 'Ordered selection WITHOUT repetition: r objects from n' },
            { type: 'formula', latex: 'n^r', label: 'Ordered selection WITH repetition: r positions, each with n choices' },
            { type: 'table', headers: ['Scenario', 'Formula', 'Example'], rows: [
              ['Arrange ALL n distinct objects', 'n!', '5 people in a row: 5! = 120'],
              ['Choose r from n, order matters, no repeat', 'ⁿPᵣ = n!/(n−r)!', '3-digit code from {A,B,C,D,E}: ⁵P₃ = 60'],
              ['Choose r from n, order matters, repeats allowed', 'nʳ', 'PIN: 4 digits 0–9 with repeats: 10⁴ = 10 000'],
            ]},
            { type: 'example', question: 'How many 3-letter codes can be formed from A, B, C, D, E with no repeated letters?', steps: [
              'Order matters (ABC ≠ BAC), no repetition.',
              '⁵P₃ = 5!/(5−3)! = 5!/2! = (5 × 4 × 3 × 2!)/(2!) = 5 × 4 × 3 = 60.',
            ]},
            { type: 'example', question: 'How many 4-digit PINs are possible if digits 0–9 may be repeated?', steps: [
              'Each digit independently has 10 choices.',
              'Total = 10 × 10 × 10 × 10 = 10⁴ = 10 000.',
            ]},
            { type: 'tip', body: 'Key question: "Can the same object appear more than once?" If YES → use nʳ. If NO → use ⁿPᵣ. Also check whether order matters; if not, use combinations (17E).' },
          ],
        },
        // 17C ─────────────────────────────────────────────────────────────────
        {
          stageId: 'y11-ext1-l12-s12c', code: '17C', title: 'Ordered Selections — Three More Principles',
          outcomeIds: ['MA-PROB-03'], topicIds: ['MA-PROB-03'],
          explanation: 'Three strategies for restricted arrangements: (1) fix required objects first, arrange the rest; (2) treat objects that must stay together as a single block; (3) complementary counting — subtract invalid arrangements from the total.',
          content: [
            { type: 'text', body: 'Most HSC combinatorics problems involve a restriction. Three standard strategies cover the vast majority of cases. Identifying which strategy applies is the key skill.' },
            { type: 'rules', heading: 'The Three Principles', items: [
              'Principle 1 — Fix then arrange: Place objects that must occupy specific positions first, then arrange the remaining objects in the remaining positions.',
              'Principle 2 — Treat as a block (bundle): Objects that must be adjacent are bundled into one unit. Count arrangements of units, then multiply by the internal arrangements of the block.',
              'Principle 3 — Complementary counting: Total (unrestricted) − Arrangements that violate the condition. Best for "must NOT be adjacent" or "must NOT be in a position" restrictions.',
            ]},
            { type: 'example', question: 'In how many ways can 5 people sit in a row if Alice must sit in the middle seat?', steps: [
              'Principle 1: Fix Alice in seat 3. Arrange remaining 4 people in 4 seats.',
              'Total = 4! = 24.',
            ]},
            { type: 'example', question: 'In how many ways can 4 men and 3 women sit in a row if all 3 women must sit together?', steps: [
              'Principle 2: Bundle the 3 women into one block. Now arrange 5 units (4 men + 1 block).',
              'Arrangements of 5 units = 5! = 120.',
              'Women within the block = 3! = 6.',
              'Total = 120 × 6 = 720.',
            ]},
            { type: 'example', question: 'In how many ways can 5 people sit in a row if two particular people (A and B) must NOT sit next to each other?', steps: [
              'Principle 3: Total arrangements = 5! = 120.',
              'Arrangements where A and B ARE together: bundle AB as one unit → 4! arrangements × 2 internal = 48.',
              'Answer = 120 − 48 = 72.',
            ]},
            { type: 'tip', body: 'Choose Principle 3 whenever the condition is negative ("must NOT"). Direct counting of the valid cases is often complicated; subtracting the violating cases from the total is almost always simpler.' },
          ],
        },
        // 17D ─────────────────────────────────────────────────────────────────
        {
          stageId: 'y11-ext1-l12-s12d', code: '17D', title: 'Ordered Selections With Identical Elements',
          outcomeIds: ['MA-PROB-03'], topicIds: ['MA-PROB-03'],
          explanation: 'When some objects are identical, divide out the factorial of each group of identical objects: arrangements = n! ÷ (p! × q! × r! × …), where p, q, r are the counts of each identical type.',
          content: [
            { type: 'text', body: 'When some of the n objects are identical, many arrangements that look different are actually the same. We correct for this by dividing out the factorials of the identical groups.' },
            { type: 'formula', latex: '\\text{Arrangements} = \\frac{n!}{p!\\, q!\\, r! \\cdots}', label: 'n objects with p identical of type 1, q of type 2, r of type 3, …' },
            { type: 'example', question: 'How many different arrangements are there of the letters in the word MISSISSIPPI?', steps: [
              'Total letters n = 11.',
              'Identical groups: M×1, I×4, S×4, P×2.',
              'Arrangements = 11! / (1! × 4! × 4! × 2!) = 39 916 800 / (1 × 24 × 24 × 2) = 34 650.',
            ]},
            { type: 'example', question: 'A row of 8 flags consists of 3 red, 3 blue, and 2 white flags (identical within each colour). How many distinct arrangements?', steps: [
              'n = 8, with 3 identical red, 3 identical blue, 2 identical white.',
              'Arrangements = 8! / (3! × 3! × 2!) = 40 320 / (6 × 6 × 2) = 40 320 / 72 = 560.',
            ]},
            { type: 'example', question: 'How many distinct 7-letter strings can be formed from the letters A, A, A, B, B, C, C?', steps: [
              'n = 7, with A×3, B×2, C×2.',
              'Arrangements = 7! / (3! × 2! × 2!) = 5040 / (6 × 2 × 2) = 5040 / 24 = 210.',
            ]},
            { type: 'tip', body: 'Always start by listing n (total objects) and identifying each group of identical objects and its count. Check that the counts add to n. Then apply the formula.' },
          ],
        },
        // 17E ─────────────────────────────────────────────────────────────────
        {
          stageId: 'y11-ext1-l12-s12e', code: '17E', title: 'Counting Unordered Selections',
          outcomeIds: ['MA-PROB-03'], topicIds: ['MA-PROB-03'],
          explanation: "ⁿCᵣ = n!/(r!(n−r)!) counts selections of r from n when order doesn't matter. Key identity: ⁿCᵣ = ⁿC(n−r). Use combinations for \"choose/select\" problems and permutations for \"arrange/order\" problems.",
          content: [
            { type: 'text', body: 'A combination (unordered selection) is a selection where the ORDER does not matter. Choosing a committee {Alice, Bob, Carol} is the same as {Bob, Carol, Alice} — it is the same committee.' },
            { type: 'formula', latex: '^nC_r = \\binom{n}{r} = \\frac{n!}{r!\\,(n-r)!}', label: 'Choose r from n, order does NOT matter' },
            { type: 'rules', heading: 'Key Properties', items: [
              'ⁿCᵣ = ⁿC(n−r): choosing r to include equals choosing (n−r) to exclude. Use this to simplify large r.',
              'ⁿC₀ = ⁿCₙ = 1: only one way to choose none or all.',
              'ⁿC₁ = n.',
              'Pascal\'s Identity: ⁿCᵣ = ⁿ⁻¹C(r−1) + ⁿ⁻¹Cᵣ.',
            ]},
            { type: 'table', headers: ['Keyword in problem', 'Use'], rows: [
              ['choose, select, pick, form a group/team/committee', 'Combinations — order does NOT matter'],
              ['arrange, order, sequence, rank, assign to labelled positions', 'Permutations — order MATTERS'],
            ]},
            { type: 'example', question: 'A committee of 4 is chosen from 10 people. How many possible committees?', steps: [
              '¹⁰C₄ = 10! / (4! × 6!) = (10 × 9 × 8 × 7) / (4 × 3 × 2 × 1) = 210.',
            ]},
            { type: 'example', question: 'From a group of 6 men and 5 women, choose 3 men and 2 women for a committee. How many ways?', steps: [
              'Choose 3 men from 6: ⁶C₃ = 20.',
              'Choose 2 women from 5: ⁵C₂ = 10.',
              'Total = 20 × 10 = 200 (multiply — both selections must be made).',
            ]},
            { type: 'tip', body: 'ⁿCᵣ = ⁿC(n−r) is a powerful shortcut: ²⁰C₁₇ = ²⁰C₃ = 1140. Always swap to whichever of r or n−r is smaller before computing.' },
          ],
        },
        // 17F ─────────────────────────────────────────────────────────────────
        {
          stageId: 'y11-ext1-l12-s12f', code: '17F', title: 'Using Counting in Probability',
          outcomeIds: ['MA-PROB-03'], topicIds: ['MA-PROB-03'],
          explanation: 'P(event) = (number of favourable outcomes) / (total number of equally likely outcomes). Use combinations or permutations to count both the sample space and the favourable outcomes.',
          content: [
            { type: 'text', body: 'When all outcomes in a sample space are equally likely, probability equals the ratio of favourable outcomes to total outcomes. Combinations and permutations let us count large sample spaces efficiently without listing every outcome.' },
            { type: 'formula', latex: 'P(\\text{event}) = \\frac{\\text{number of favourable outcomes}}{\\text{total number of outcomes}}', label: 'Equally likely outcomes' },
            { type: 'rules', heading: 'Strategy', items: [
              'Step 1: Count the TOTAL number of outcomes using combinations or permutations (depending on whether order matters).',
              'Step 2: Count the FAVOURABLE outcomes using the same method with any restrictions applied.',
              'Step 3: Divide. Simplify the fraction.',
              'For "at least" or "at most" events: use complementary probability — P(at least one) = 1 − P(none).',
            ]},
            { type: 'example', question: 'A hand of 5 cards is dealt from a standard 52-card deck. What is the probability the hand contains exactly 2 aces?', steps: [
              'Total 5-card hands: ⁵²C₅ = 2 598 960.',
              'Favourable: choose 2 aces from 4 AND 3 non-aces from 48.',
              'Favourable = ⁴C₂ × ⁴⁸C₃ = 6 × 17 296 = 103 776.',
              'P(exactly 2 aces) = 103 776 / 2 598 960 ≈ 0.0399.',
            ]},
            { type: 'example', question: '4 people are chosen at random from 6 men and 4 women. What is the probability that at least one woman is chosen?', steps: [
              'Total ways to choose 4 from 10: ¹⁰C₄ = 210.',
              'P(no women) = ⁶C₄/¹⁰C₄ = 15/210 = 1/14.',
              'P(at least one woman) = 1 − 1/14 = 13/14.',
            ]},
            { type: 'tip', body: 'Always use the same counting method for numerator and denominator (both ordered, or both unordered). Mixing permutations in the numerator with combinations in the denominator — or vice versa — gives a wrong answer.' },
          ],
        },
        // 17G ─────────────────────────────────────────────────────────────────
        {
          stageId: 'y11-ext1-l12-s12g', code: '17G', title: 'Arrangements in a Circle',
          outcomeIds: ['MA-PROB-03'], topicIds: ['MA-PROB-03'],
          explanation: 'Circular arrangements of n distinct objects: (n−1)! Fix one object to remove rotational equivalence, then arrange the remaining n−1 objects. If the circle can be flipped (necklace), divide by 2.',
          content: [
            { type: 'text', body: 'In a circular arrangement, there is no fixed "first" position — rotating the entire group gives the same arrangement. To count distinct circular arrangements, we fix one object to eliminate rotational equivalence, then arrange the rest.' },
            { type: 'formula', latex: '\\text{Circular arrangements of } n \\text{ distinct objects} = (n-1)!', label: 'Fix one object; arrange n−1 in the remaining positions' },
            { type: 'rules', heading: 'Key Points', items: [
              'Fix one person/object in any seat. This removes rotational duplicates.',
              'Arrange the remaining n−1 objects in the (n−1) remaining positions: (n−1)! ways.',
              'Necklace / bracelet (can flip): divide by 2, giving (n−1)!/2.',
              'Restrictions in circles: use the same block/complementary strategies as linear arrangements, but remember to fix one object first.',
            ]},
            { type: 'example', question: 'In how many ways can 6 people be seated around a circular table?', steps: [
              'Fix one person (say, person A) in any chair.',
              'Arrange the remaining 5 people in the 5 remaining chairs.',
              'Total = (6−1)! = 5! = 120.',
            ]},
            { type: 'example', question: 'In how many ways can 6 people sit around a circular table if two particular people (X and Y) must sit next to each other?', steps: [
              'Bundle X and Y as one block. Now arrange 5 units (4 others + 1 block) around the circle.',
              'Circular arrangements of 5 units = (5−1)! = 4! = 24.',
              'X and Y within the block can swap: × 2.',
              'Total = 24 × 2 = 48.',
            ]},
            { type: 'example', question: 'In how many ways can 5 different beads be arranged on a bracelet (flipping allowed)?', steps: [
              'Circular arrangements = (5−1)! = 4! = 24.',
              'Bracelet can be flipped, so divide by 2: 24/2 = 12.',
            ]},
            { type: 'tip', body: 'A common mistake is using n! for circular arrangements. Always ask: "Is there a fixed start point?" If no (circle, round table, necklace), use (n−1)!. If yes (e.g., seats are labelled/fixed), use n!.' },
          ],
        },
      ],
    },
  ],
}

// ── YEAR 11 EXTENSION 2 ───────────────────────────────────────────────────────
// NESA: Extension 2 is formally a Year 12 course. In Year 11, Ext 2 students
// study the full Ext 1 curriculum plus enrichment and early Ext 2 previews.
const YEAR_11_EXT2_MISSION: Mission = {
  missionId: 'y11-ext2',
  title: 'Year 11 Extension 2 Pathway',
  year: 11,
  course: 'extension2',
  shortLabel: 'Ext 2',
  levels: [
    // ── Chapter 1: Methods in Algebra (with Ext 2 enrichment) ────────────────
    {
      levelId: 'y11-ext2-l1', levelNum: 1, title: 'Methods in Algebra', emoji: '✏️', color: '#6366F1',
      stages: [
        {
          stageId: 'y11-ext2-l1-s1a', code: '1A', title: 'Expanding, Factorising and Special Identities',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'Master all expansions and factorisation methods. Key identities: (a±b)² = a²±2ab+b², a²−b² = (a+b)(a−b), a³±b³ = (a±b)(a²∓ab+b²). Sum/difference of cubes appear in Ext 2 integration.',
        },
        {
          stageId: 'y11-ext2-l1-s1b', code: '1B', title: 'Algebraic Fractions and Partial Fractions',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'Simplify, add, subtract, multiply, divide algebraic fractions. Partial fractions: A/((x+a)(x+b)) = P/(x+a) + Q/(x+b). Find P and Q by substituting roots of the denominator. Partial fractions are essential for Ext 2 integration.',
        },
        {
          stageId: 'y11-ext2-l1-s1c', code: '1C', title: 'Solving Equations and Inequalities with Sign Diagrams',
          outcomeIds: ['MA-ALG-03'], topicIds: ['MA-ALG-03'],
          explanation: 'Solve quadratics by factorising, completing the square, or formula. For inequalities: factorise, draw a sign diagram, read off the solution set. Always express solutions using interval notation.',
        },
        {
          stageId: 'y11-ext2-l1-s1d', code: '1D', title: 'Completing the Square and Quadratic Identities',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'Complete the square to produce vertex form. A quadratic identity holds for ALL x — equate coefficients to find unknowns. Both skills appear constantly in Ext 2 proofs and integration.',
        },
        {
          stageId: 'y11-ext2-l1-s1e', code: '1E', title: 'Simultaneous Equations (Linear and Non-linear)',
          outcomeIds: ['MA-ALG-03'], topicIds: ['MA-ALG-03'],
          explanation: 'Substitution or elimination for linear systems. For line and parabola/circle: substitute the linear equation into the other. The discriminant of the resulting quadratic gives the number of intersections.',
        },
      ],
    },
    // ── Chapter 2: Numbers and Surds ─────────────────────────────────────────
    {
      levelId: 'y11-ext2-l2', levelNum: 2, title: 'Numbers and Surds', emoji: '🔢', color: '#8B5CF6',
      stages: [
        {
          stageId: 'y11-ext2-l2-s2a', code: '2A', title: 'Real Numbers, Intervals and Inequalities',
          outcomeIds: ['MA-ALG-08'], topicIds: ['MA-ALG-08'],
          explanation: 'ℝ = rationals ∪ irrationals. Interval notation: [a,b], (a,b), [a,b), (a,b]. Solve compound inequalities and represent as intervals. Understand absolute value inequalities: |x−a| < r means a−r < x < a+r.',
        },
        {
          stageId: 'y11-ext2-l2-s2b', code: '2B', title: 'Surds: Simplification, Arithmetic and Rationalising',
          outcomeIds: ['MA-ALG-08'], topicIds: ['MA-ALG-08'],
          explanation: 'Simplify surds (find largest perfect-square factor). Add like surds. Expand products (FOIL). Rationalise: multiply by conjugate (a−√b)/(a−√b) or (√a−√b)/(√a−√b). All final answers must have rational denominators.',
        },
      ],
    },
    // ── Chapter 3: Functions and Graphs ──────────────────────────────────────
    {
      levelId: 'y11-ext2-l3', levelNum: 3, title: 'Functions and Graphs', emoji: '📉', color: '#0EA5E9',
      stages: [
        {
          stageId: 'y11-ext2-l3-s3a', code: '3A', title: 'Functions, Relations, Notation and Composition',
          outcomeIds: ['MA-FUNC-01', 'MA-FUNC-02', 'MA-FUNC-03'], topicIds: ['MA-FUNC-01', 'MA-FUNC-02', 'MA-FUNC-03'],
          explanation: 'Vertical line test for functions. Composite functions: (f∘g)(x) = f(g(x)) — apply g first. Domain of f∘g: x in domain of g with g(x) in domain of f. Key graphs: line, parabola, cubic, hyperbola, √x, |x|.',
        },
        {
          stageId: 'y11-ext2-l3-s3b', code: '3B', title: 'Quadratic Functions — Vertex, Intercept and Discriminant',
          outcomeIds: ['MA-ALG-02'], topicIds: ['MA-ALG-02'],
          explanation: 'Three forms: standard y=ax²+bx+c, vertex y=a(x−h)²+k, intercept y=a(x−p)(x−q). Convert by completing the square. Δ=b²−4ac determines number of x-intercepts. Use Δ to find parameter ranges.',
        },
        {
          stageId: 'y11-ext2-l3-s3c', code: '3C', title: 'Further Graphs: Powers, Cubics, Circles, Hyperbolas',
          outcomeIds: ['MA-FUNC-07'], topicIds: ['MA-FUNC-07'],
          explanation: 'y = xⁿ: even n gives U-shape (symmetric); odd n gives S-shape. Circle (x−h)²+(y−k)²=r². Hyperbola y=k/(x−a)+b: asymptotes x=a, y=b. Direct/inverse variation. Sketch by identifying key features.',
        },
        {
          stageId: 'y11-ext2-l3-s3d', code: '3D', title: 'Transformations: Translations, Dilations, Reflections',
          outcomeIds: ['MA-FUNC-05'], topicIds: ['MA-FUNC-05'],
          explanation: 'y=f(x)+k (shift up k), y=f(x−h) (shift right h), y=af(x) (vertical dilation), y=f(bx) (horizontal dilation), y=−f(x) (reflect x-axis), y=f(−x) (reflect y-axis). Apply in the correct order.',
        },
        {
          stageId: 'y11-ext2-l3-s3e', code: '3E', title: 'Absolute Value and Piecewise Functions',
          outcomeIds: ['MA-FUNC-06'], topicIds: ['MA-FUNC-06'],
          explanation: 'y=|f(x)|: reflect negative parts above x-axis. y=f(|x|): draw right half for x≥0, reflect to left. Piecewise: different rules on different intervals. Check continuity at boundary points.',
        },
        {
          stageId: 'y11-ext2-l3-s3f', code: '3F', title: 'Inverse Functions and Parametric Equations',
          outcomeIds: ['MA-FUNC-04'], topicIds: ['MA-FUNC-04'],
          explanation: 'f⁻¹ exists only if f is one-to-one. Find by swapping x and y. Graph: reflection in y=x. Parametric equations: x=f(t), y=g(t); eliminate t for Cartesian form. Essential Ext 2 skills.',
        },
        {
          stageId: 'y11-ext2-l3-s3g', code: '3G', title: 'Further Graph Sketching (Reciprocals, Sums, Signs)',
          outcomeIds: ['MA-FUNC-07'], topicIds: ['MA-FUNC-07'],
          explanation: 'Sketch y=1/f(x): zeros of f → asymptotes; large f → small 1/f. Sketch y=f+g by adding ordinates. Sign diagrams: factorise, mark zeros/asymptotes, test each interval. Essential for Ext 2 calculus.',
        },
      ],
    },
    // ── Chapter 4: Equations, Inequations, and Identities ────────────────────
    {
      levelId: 'y11-ext2-l4', levelNum: 4, title: 'Equations and Inequations', emoji: '⚖️', color: '#EC4899',
      stages: [
        {
          stageId: 'y11-ext2-l4-s4a', code: '4A', title: 'Linear and Quadratic Equations and Inequalities',
          outcomeIds: ['MA-ALG-03'], topicIds: ['MA-ALG-03'],
          explanation: 'Solve linear inequalities (flip sign for negative multiplication). Quadratic inequalities: find roots, draw sign diagram, read off intervals. Express answers using set notation and number lines.',
        },
        {
          stageId: 'y11-ext2-l4-s4b', code: '4B', title: 'The Discriminant and Quadratic Identities',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'Discriminant conditions for real/distinct/equal/no roots. Quadratic identities: coefficients of x², x, and constant all match — equate to find unknowns. Preview of completing the square for Ext 2 integration.',
        },
      ],
    },
    // ── Chapter 5: Transformations and Symmetry ───────────────────────────────
    {
      levelId: 'y11-ext2-l5', levelNum: 5, title: 'Transformations and Symmetry', emoji: '🔄', color: '#F59E0B',
      stages: [
        {
          stageId: 'y11-ext2-l5-s5a', code: '5A', title: 'All Transformations and Even/Odd Symmetry',
          outcomeIds: ['MA-FUNC-05'], topicIds: ['MA-FUNC-05'],
          explanation: 'Even: f(−x) = f(x) (symmetric about y-axis). Odd: f(−x) = −f(x) (symmetric about origin). Combine translations, dilations, and reflections in the correct order. Critical for sketching complex functions in Ext 2.',
        },
        {
          stageId: 'y11-ext2-l5-s5b', code: '5B', title: 'Composite and Piecewise Functions',
          outcomeIds: ['MA-FUNC-03', 'MA-FUNC-06'], topicIds: ['MA-FUNC-03', 'MA-FUNC-06'],
          explanation: 'Composite (f∘g)(x) = f(g(x)): specify domain carefully. Piecewise: check continuity and differentiability at boundary points. Absolute value functions are a special case of piecewise — essential in Ext 2 proofs.',
        },
      ],
    },
    // ── Chapter 6: Trigonometry ───────────────────────────────────────────────
    {
      levelId: 'y11-ext2-l6', levelNum: 6, title: 'Trigonometry', emoji: '〜', color: '#14B8A6',
      stages: [
        {
          stageId: 'y11-ext2-l6-s6a', code: '6A', title: 'Trig Ratios, Exact Values, ASTC and Radian Measure',
          outcomeIds: ['MA-TRIG-01', 'MA-TRIG-09'], topicIds: ['MA-TRIG-01', 'MA-TRIG-09'],
          explanation: 'Exact values from special triangles. ASTC for any angle. π rad = 180°. Arc length and sector area. These fundamentals underpin all trig calculus — work exclusively in radians from now on.',
        },
        {
          stageId: 'y11-ext2-l6-s6b', code: '6B', title: 'Graphs, Transformations and Inverse Trig Functions',
          outcomeIds: ['MA-TRIG-02', 'MA-TRIG-05'], topicIds: ['MA-TRIG-02', 'MA-TRIG-05'],
          explanation: 'y=A sin(Bx+C)+D: amplitude, period, phase shift, vertical shift. Inverse trig: sin⁻¹, cos⁻¹, tan⁻¹ with restricted domains and ranges. Solve trig equations using symmetry of the unit circle.',
        },
        {
          stageId: 'y11-ext2-l6-s6c', code: '6C', title: 'Sine Rule, Cosine Rule, and 3D Problems',
          outcomeIds: ['MA-TRIG-07', 'MA-TRIG-08'], topicIds: ['MA-TRIG-07', 'MA-TRIG-08'],
          explanation: 'Sine rule (including ambiguous case), cosine rule, area = ½ab sinC. Three-dimensional problems: identify triangles, draw 2D diagrams. The ambiguous case will appear in Ext 2 proofs.',
        },
      ],
    },
    // ── Chapter 7: Exponential and Log Functions ─────────────────────────────
    {
      levelId: 'y11-ext2-l7', levelNum: 7, title: 'Exponential and Log Functions', emoji: '📈', color: '#10B981',
      stages: [
        {
          stageId: 'y11-ext2-l7-s7a', code: '7A', title: 'Exponential and Log Functions and Their Graphs',
          outcomeIds: ['MA-EXP-01', 'MA-EXP-03'], topicIds: ['MA-EXP-01', 'MA-EXP-03'],
          explanation: 'y=aˣ: passes through (0,1), asymptote y=0. Natural base e. y=ln x: reflection of y=eˣ in y=x; domain x>0, vertical asymptote x=0. Apply transformations to both. Growth/decay models A=A₀eᵏᵗ.',
        },
        {
          stageId: 'y11-ext2-l7-s7b', code: '7B', title: 'Laws of Logarithms and Solving Equations',
          outcomeIds: ['MA-EXP-04'], topicIds: ['MA-EXP-04'],
          explanation: 'Product, quotient, power laws. Change of base. Solve exponential equations by taking logs. Solve log equations by converting to exponential form. Always check domain restrictions (arguments must be positive).',
        },
      ],
    },
    // ── Chapter 8 & 9: Differentiation and Geometry of Derivative ────────────
    {
      levelId: 'y11-ext2-l8', levelNum: 8, title: 'Differentiation', emoji: '∂', color: '#EC4899',
      stages: [
        {
          stageId: 'y11-ext2-l8-s8a', code: '8A', title: 'All Differentiation Rules',
          outcomeIds: ['MA-CALC-D01', 'MA-CALC-D02', 'MA-CALC-D03'], topicIds: ['MA-CALC-D01', 'MA-CALC-D02', 'MA-CALC-D03'],
          explanation: 'Power, product, quotient, chain rules. Differentiate sin, cos, tan, eˣ, ln x. All require x in radians. Chain rule for composites. Practice identifying which rule(s) to apply before starting.',
        },
        {
          stageId: 'y11-ext2-l8-s8b', code: '8B', title: 'Curve Sketching and Optimisation',
          outcomeIds: ['MA-CALC-D07', 'MA-CALC-D08', 'MA-CALC-D09'], topicIds: ['MA-CALC-D07', 'MA-CALC-D08', 'MA-CALC-D09'],
          explanation: 'Full sketch: domain, intercepts, stationary points (sign diagram of f\'), inflections (sign diagram of f\'\'), asymptotes, end behaviour. Optimisation: model, differentiate, solve, test, check endpoints.',
        },
        {
          stageId: 'y11-ext2-l8-s8c', code: '8C', title: 'Related Rates and Implicit Differentiation (Preview)',
          outcomeIds: ['MA-CALC-D07'], topicIds: ['MA-CALC-D07'],
          explanation: 'Related rates: dy/dt = (dy/dx)·(dx/dt). Label all quantities and their rates. Implicit differentiation: differentiate both sides with respect to x, treating y as a function of x. Preview of Ext 2 techniques.',
        },
      ],
    },
    // ── Chapter 10 & 11: Integration ─────────────────────────────────────────
    {
      levelId: 'y11-ext2-l9', levelNum: 9, title: 'Integration', emoji: '∫', color: '#6366F1',
      stages: [
        {
          stageId: 'y11-ext2-l9-s9a', code: '9A', title: 'Standard Integrals and Definite Integrals',
          outcomeIds: ['MA-CALC-I01', 'MA-CALC-I02'], topicIds: ['MA-CALC-I01', 'MA-CALC-I02'],
          explanation: '∫xⁿ, ∫eˣ, ∫(1/x), ∫sin x, ∫cos x. Definite integral = F(b)−F(a). Signed area vs unsigned area. Properties: linearity, reversing limits. Be careful with signs for area below the x-axis.',
        },
        {
          stageId: 'y11-ext2-l9-s9b', code: '9B', title: 'Integration by Substitution',
          outcomeIds: ['MA-CALC-I05'], topicIds: ['MA-CALC-I05'],
          explanation: 'Let u=g(x), du=g\'(x)dx. Recognise the pattern: the integrand contains g\'(x) as a factor. For definite integrals, convert limits using u=g(x). This is the most important integration technique for Ext 1 and 2.',
        },
        {
          stageId: 'y11-ext2-l9-s9c', code: '9C', title: 'Areas Between Curves and Applications',
          outcomeIds: ['MA-CALC-I07'], topicIds: ['MA-CALC-I07'],
          explanation: 'Area between f and g: ∫|f−g| dx. Find intersection points for limits. If curves cross in the interval, split the integral. Applications: volumes (preview) and kinematics (distance from velocity).',
        },
      ],
    },
    // ── Chapter 12: Combinatorics ─────────────────────────────────────────────
    {
      levelId: 'y11-ext2-l10', levelNum: 10, title: 'Combinatorics', emoji: '🎯', color: '#F59E0B',
      stages: [
        {
          stageId: 'y11-ext2-l10-s10a', code: '10A', title: 'Permutations and Combinations',
          outcomeIds: ['MA-PROB-03'], topicIds: ['MA-PROB-03'],
          explanation: 'Permutations ⁿPᵣ = n!/(n−r)! (ordered). Combinations ⁿCᵣ = n!/(r!(n−r)!) (unordered). Restrictions: fix required objects, treat adjacent objects as units, subtract invalid arrangements.',
        },
        {
          stageId: 'y11-ext2-l10-s10b', code: '10B', title: 'Combinatorial Proofs and the Binomial Theorem (Preview)',
          outcomeIds: ['MA-PROB-03'], topicIds: ['MA-PROB-03'],
          explanation: 'ⁿCᵣ + ⁿC(r+1) = ⁽ⁿ⁺¹⁾C(r+1) (Pascal\'s rule). (a+b)ⁿ = Σ ⁿCᵣ aⁿ⁻ʳbʳ. General term Tᵣ₊₁ = ⁿCᵣ aⁿ⁻ʳbʳ. This is a preview of the full Binomial Theorem treated in Year 12 Extension 1.',
        },
      ],
    },
    // ── Ext 2 Enrichment: Introduction to Complex Numbers ─────────────────────
    {
      levelId: 'y11-ext2-l11', levelNum: 11, title: 'Complex Numbers (Preview)', emoji: '𝑖', color: '#EC4899',
      stages: [
        {
          stageId: 'y11-ext2-l11-s11a', code: '11A', title: 'Introduction to Complex Numbers',
          outcomeIds: ['MA-EXT-07'], topicIds: ['MA-EXT-07'],
          explanation: 'i = √(−1), i² = −1. Complex numbers z = a+bi: real part Re(z)=a, imaginary part Im(z)=b. Add/subtract by combining real and imaginary parts separately. This is an early preview of the Year 12 Ext 2 topic.',
        },
        {
          stageId: 'y11-ext2-l11-s11b', code: '11B', title: 'Arithmetic with Complex Numbers',
          outcomeIds: ['MA-EXT-07'], topicIds: ['MA-EXT-07'],
          explanation: 'Multiply: (a+bi)(c+di) = (ac−bd)+(ad+bc)i using i²=−1. Conjugate z̄ = a−bi. Divide: multiply numerator and denominator by z̄. |z| = √(a²+b²). The Argand diagram plots z as point (a,b).',
        },
      ],
    },
    // ── Ext 2 Enrichment: Introduction to Proof ───────────────────────────────
    {
      levelId: 'y11-ext2-l12', levelNum: 12, title: 'Introduction to Proof', emoji: '🔍', color: '#8B5CF6',
      stages: [
        {
          stageId: 'y11-ext2-l12-s12a', code: '12A', title: 'Logic and Proof Methods',
          outcomeIds: ['MA-EXT-01'], topicIds: ['MA-EXT-01'],
          explanation: 'Proof by contradiction: assume the opposite is true, derive a contradiction. Proof by contrapositive: prove not-Q ⟹ not-P instead of P ⟹ Q. These form the foundation for Year 12 Ext 2 proof.',
        },
        {
          stageId: 'y11-ext2-l12-s12b', code: '12B', title: 'Mathematical Induction (Preview)',
          outcomeIds: ['MA-EXT-01'], topicIds: ['MA-EXT-01'],
          explanation: 'Three steps: (1) base case n=1, (2) assume true for n=k, (3) prove true for n=k+1 using the assumption. Full induction is a core Year 12 Ext 1 and Ext 2 topic — this is the first exposure.',
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
    // ── Chapter 1: Sequences and Series ──────────────────────────────────────
    {
      levelId: 'y12-adv-l1', levelNum: 1, title: 'Sequences and Series', emoji: '🔢', color: '#6366F1',
      stages: [
        {
          stageId: 'y12-adv-l1-s1a', code: '1A', title: 'Arithmetic Sequences and Series',
          outcomeIds: ['MA-SEQ-01'], topicIds: ['MA-SEQ-01'],
          explanation: 'AP: aₙ = a + (n−1)d. Sum: Sₙ = n/2(2a + (n−1)d) = n/2(a + l). Given any three of a, d, n, aₙ, you can find the others. Arithmetic series appear in financial contexts (constant repayments).',
        },
        {
          stageId: 'y12-adv-l1-s1b', code: '1B', title: 'Geometric Sequences and Series',
          outcomeIds: ['MA-SEQ-02'], topicIds: ['MA-SEQ-02'],
          explanation: 'GP: aₙ = arⁿ⁻¹. Sum: Sₙ = a(rⁿ−1)/(r−1). Sum to infinity: S∞ = a/(1−r) if |r| < 1. GPs model exponential growth/decay, compound interest, and depreciation.',
        },
        {
          stageId: 'y12-adv-l1-s1c', code: '1C', title: 'Limiting Sum and Applications',
          outcomeIds: ['MA-SEQ-02'], topicIds: ['MA-SEQ-02'],
          explanation: 'A GP converges (has a limiting sum) only when |r| < 1. S∞ = a/(1−r). Convert recurring decimals to fractions using S∞. Solve problems involving infinitely repeated processes.',
        },
      ],
    },
    // ── Chapter 2: Graphs and Equations ──────────────────────────────────────
    {
      levelId: 'y12-adv-l2', levelNum: 2, title: 'Graphs and Equations', emoji: '📉', color: '#8B5CF6',
      stages: [
        {
          stageId: 'y12-adv-l2-s2a', code: '2A', title: 'Graphing Polynomials and Rational Functions',
          outcomeIds: ['MA-FUNC-07', 'MA-FUNC-08'], topicIds: ['MA-FUNC-07', 'MA-FUNC-08'],
          explanation: 'Polynomials: roots, end behaviour, multiplicity. Rational functions: vertical asymptotes (denominator = 0), horizontal asymptotes (compare degrees), oblique asymptotes (degree of numerator one more than denominator).',
        },
        {
          stageId: 'y12-adv-l2-s2b', code: '2B', title: 'Solving Equations Graphically',
          outcomeIds: ['MA-FUNC-07'], topicIds: ['MA-FUNC-07'],
          explanation: 'Graph both sides of an equation and find intersection points. Particularly useful for equations like 2ˣ = x + 1. The number of intersections equals the number of solutions.',
        },
        {
          stageId: 'y12-adv-l2-s2c', code: '2C', title: 'Absolute Value Equations and Inequalities',
          outcomeIds: ['MA-FUNC-06'], topicIds: ['MA-FUNC-06'],
          explanation: '|f(x)| = g(x): solve f(x) = g(x) and f(x) = −g(x), check solutions. |f(x)| < g(x): solve −g(x) < f(x) < g(x). Sketch y=|f(x)| and y=g(x) to confirm solutions graphically.',
        },
      ],
    },
    // ── Chapter 3: Curve Sketching Using the Derivative ──────────────────────
    {
      levelId: 'y12-adv-l3', levelNum: 3, title: 'Trigonometric Functions', emoji: '〜', color: '#0EA5E9',
      stages: [
        {
          stageId: 'y12-adv-l3-s3a', code: '6A', title: 'Differentiation of Trigonometric Functions',
          outcomeIds: ['MA-TRIG-03'], topicIds: ['MA-TRIG-03'],
          explanation: 'Pythagorean: sin²x+cos²x=1; 1+tan²x=sec²x; 1+cot²x=cosec²x. Compound: sin(A±B)=sinA cosB±cosA sinB; cos(A±B)=cosA cosB∓sinA sinB. Use to simplify and prove identities.',
        },
        {
          stageId: 'y12-adv-l3-s3b', code: '6B', title: 'Applications of Differentiation of Trigonometric Functions',
          outcomeIds: ['MA-TRIG-03'], topicIds: ['MA-TRIG-03'],
          explanation: 'sin 2A = 2 sinA cosA. cos 2A = cos²A−sin²A = 2cos²A−1 = 1−2sin²A. tan 2A = 2tanA/(1−tan²A). Use double angle results to integrate trig squares: ∫sin²x dx using cos2x identity.',
        },
        {
          stageId: 'y12-adv-l3-s3c', code: '6C', title: 'Integration of Trigonometric Functions',
          outcomeIds: ['MA-TRIG-04'], topicIds: ['MA-TRIG-04'],
          explanation: 'Use identities to reduce all trig in an equation to one function. Find the principal value using inverse trig. Apply symmetry of unit circle (ASTC) to find all solutions in the domain. Always work in radians.',
        },
        {
          stageId: 'y12-adv-l3-s3d', code: '6D', title: 'Applications of Integration of Trigonometric Functions',
          outcomeIds: ['MA-TRIG-04'], topicIds: ['MA-TRIG-04'],
          explanation: 'a sinx + b cosx = R sin(x+α) where R=√(a²+b²) and tanα=b/a. This converts a sum of trig functions to a single sinusoidal — useful for finding maximum values and solving equations.',
        },
      ],
    },
    // ── Chapter 4: Integration ────────────────────────────────────────────────
    {
      levelId: 'y12-adv-l4', levelNum: 4, title: 'Differentiation', emoji: '∂', color: '#EC4899',
      stages: [
        {
          stageId: 'y12-adv-l4-s4a', code: '3A', title: 'Increasing, Decreasing and Stationary at a Point',
          outcomeIds: ['MA-CALC-D04', 'MA-CALC-D05', 'MA-CALC-D06'], topicIds: ['MA-CALC-D04', 'MA-CALC-D05', 'MA-CALC-D06'],
          explanation: 'd/dx(sinx)=cosx; d/dx(cosx)=−sinx; d/dx(tanx)=sec²x; d/dx(eˣ)=eˣ; d/dx(ln x)=1/x. With chain rule: d/dx(sin(f(x)))=cos(f(x))·f\'(x). These are the most tested derivatives in HSC.',
        },
        {
          stageId: 'y12-adv-l4-s4b', code: '3B', title: 'Stationary Points and Turning Points',
          outcomeIds: ['MA-CALC-D08'], topicIds: ['MA-CALC-D08'],
          explanation: 'Systematic sketch: domain, intercepts, asymptotes, stationary points (f\'=0, sign diagram), inflections (f\'\'=0, sign change in f\'\'). Combine all features. The sketch should be consistent with all information found.',
        },
        {
          stageId: 'y12-adv-l4-s4c', code: '3C', title: 'Global Maximum and Minimum',
          outcomeIds: ['MA-CALC-D09'], topicIds: ['MA-CALC-D09'],
          explanation: 'Model → differentiate → solve f\'=0 → test (second derivative or sign diagram) → check endpoints. Write a sentence answering the question in context. Draw a diagram if geometry is involved.',
        },
        {
          stageId: 'y12-adv-l4-s4d', code: '3D', title: 'Primitive Functions',
          outcomeIds: ['MA-CALC-D07'], topicIds: ['MA-CALC-D07'],
          explanation: 'dy/dt = (dy/dx)·(dx/dt) — chain rule for related rates. Label every variable and rate with units. Kinematics: position x, velocity v=dx/dt, acceleration a=dv/dt=v(dv/dx).',
        },
      ],
    },
    // ── Chapter 5: The Exponential and Logarithmic Functions ──────────────────
    {
      levelId: 'y12-adv-l5', levelNum: 5, title: 'Integration', emoji: '∫', color: '#10B981',
      stages: [
        {
          stageId: 'y12-adv-l5-s5a', code: '4A', title: 'Areas and the Definite Integral',
          outcomeIds: ['MA-CALC-I03', 'MA-CALC-I04'], topicIds: ['MA-CALC-I03', 'MA-CALC-I04'],
          explanation: '∫sinx dx=−cosx+C; ∫cosx dx=sinx+C; ∫sec²x dx=tanx+C; ∫eˣ dx=eˣ+C; ∫(1/x)dx=ln|x|+C. For ∫f\'(x)/f(x) dx=ln|f(x)|+C. Use double-angle formulas to integrate sin²x and cos²x.',
        },
        {
          stageId: 'y12-adv-l5-s5b', code: '4B', title: 'The Fundamental Theorem of Calculus',
          outcomeIds: ['MA-CALC-I05'], topicIds: ['MA-CALC-I05'],
          explanation: 'Let u=g(x), du=g\'(x)dx. Rewrite the integral in terms of u alone, integrate, then back-substitute. For definite integrals, convert limits using u=g(a) and u=g(b).',
        },
        {
          stageId: 'y12-adv-l5-s5c', code: '4C', title: 'Finding Areas by Integration',
          outcomeIds: ['MA-CALC-I07'], topicIds: ['MA-CALC-I07'],
          explanation: 'Signed area: ∫[a,b] f(x) dx. Total area: integrate |f(x)|, splitting at x-intercepts. Area between curves: ∫[a,b] (f(x)−g(x)) dx, where a and b are intersection points.',
        },
        {
          stageId: 'y12-adv-l5-s5d', code: '4D', title: 'The Reverse Chain Rule',
          outcomeIds: ['MA-CALC-I08'], topicIds: ['MA-CALC-I08'],
          explanation: 'Volume rotating y=f(x) about x-axis: V = π∫[a,b] [f(x)]² dx. About y-axis: V = π∫[c,d] [g(y)]² dy (rewrite x as a function of y). Find the integration limits from the geometry.',
        },
      ],
    },
    // ── Chapter 6: Trigonometric Functions ───────────────────────────────────
    {
      levelId: 'y12-adv-l6', levelNum: 6, title: 'Exponential and Log Functions', emoji: '📈', color: '#F59E0B',
      stages: [
        {
          stageId: 'y12-adv-l6-s6a', code: '5A', title: 'Review of Exponential Functions Base e',
          outcomeIds: ['MA-EXP-01', 'MA-EXP-02'], topicIds: ['MA-EXP-01', 'MA-EXP-02'],
          explanation: 'y=eˣ is the unique function equal to its own derivative. Sketch and apply transformations. Exponential growth: y=Aeᵏᵗ (k>0); decay: y=Ae⁻ᵏᵗ (k>0). The rate of change is proportional to the current value.',
        },
        {
          stageId: 'y12-adv-l6-s6b', code: '5B', title: 'Differentiation of Exponential Functions',
          outcomeIds: ['MA-EXP-03', 'MA-EXP-04'], topicIds: ['MA-EXP-03', 'MA-EXP-04'],
          explanation: 'y=ln x: domain x>0, range ℝ, x-intercept at x=1, vertical asymptote x=0. Laws: ln(AB)=lnA+lnB; ln(A/B)=lnA−lnB; ln(Aⁿ)=n lnA. Differentiate and integrate using chain rule.',
        },
        {
          stageId: 'y12-adv-l6-s6c', code: '5C', title: 'Review of Logarithmic Functions',
          outcomeIds: ['MA-EXP-02'], topicIds: ['MA-EXP-02'],
          explanation: 'dN/dt = kN has solution N = N₀eᵏᵗ. Given two conditions (e.g. initial amount and amount at time t), find k. Apply to population growth, radioactive decay, Newton\'s law of cooling.',
        },
      ],
    },
    // ── Chapter 7: Motion ─────────────────────────────────────────────────────
    {
      levelId: 'y12-adv-l7', levelNum: 7, title: 'Motion', emoji: '🚀', color: '#F97316',
      stages: [
        {
          stageId: 'y12-adv-l7-s7a', code: '7A', title: 'Kinematics — Displacement, Velocity, Acceleration',
          outcomeIds: ['MA-CALC-D07'], topicIds: ['MA-CALC-D07'],
          explanation: 'x = position; v = dx/dt = velocity; a = dv/dt = d²x/dt² = acceleration. Positive v means moving in positive direction; negative v means moving in negative direction. Speed = |v|.',
        },
        {
          stageId: 'y12-adv-l7-s7b', code: '7B', title: 'Kinematics — Using Integration',
          outcomeIds: ['MA-CALC-I07'], topicIds: ['MA-CALC-I07'],
          explanation: 'v = ∫a dt + C (use initial velocity to find C). x = ∫v dt + C (use initial position to find C). Distance travelled (not displacement) requires integrating |v|, splitting where v = 0.',
        },
      ],
    },
    // ── Chapter 8: Probability ────────────────────────────────────────────────
    {
      levelId: 'y12-adv-l8', levelNum: 8, title: 'Probability', emoji: '🎲', color: '#14B8A6',
      stages: [
        {
          stageId: 'y12-adv-l8-s8a', code: '8A', title: 'Conditional Probability and Independence',
          outcomeIds: ['MA-PROB-02'], topicIds: ['MA-PROB-02'],
          explanation: 'P(A|B) = P(A∩B)/P(B). Independent: P(A|B)=P(A), equivalently P(A∩B)=P(A)P(B). Bayes\' theorem: P(A|B) = P(B|A)P(A)/P(B). Two-way tables and tree diagrams help organise complex problems.',
        },
        {
          stageId: 'y12-adv-l8-s8b', code: '8B', title: 'Discrete Random Variables',
          outcomeIds: ['MA-STAT-06'], topicIds: ['MA-STAT-06'],
          explanation: 'A discrete random variable X takes distinct values. Probability distribution: each value has P(X=x)≥0 and all probabilities sum to 1. E(X)=Σx·P(X=x). Var(X)=E(X²)−[E(X)]².',
        },
        {
          stageId: 'y12-adv-l8-s8c', code: '8C', title: 'Binomial Distribution',
          outcomeIds: ['MA-STAT-07'], topicIds: ['MA-STAT-07'],
          explanation: 'B(n,p): n independent trials, each with probability p of success. P(X=r) = ⁿCᵣ pʳ (1−p)ⁿ⁻ʳ. E(X)=np; Var(X)=np(1−p). Use for repeated trials with two outcomes (success/failure).',
        },
      ],
    },
    // ── Chapter 9: Statistical Analysis ──────────────────────────────────────
    {
      levelId: 'y12-adv-l9', levelNum: 9, title: 'Statistical Analysis', emoji: '📊', color: '#6366F1',
      stages: [
        {
          stageId: 'y12-adv-l9-s9a', code: '9A', title: 'The Normal Distribution',
          outcomeIds: ['MA-STAT-05'], topicIds: ['MA-STAT-05'],
          explanation: 'Bell-shaped, symmetric about μ. Standardise: Z=(X−μ)/σ. 68-95-99.7 rule. Look up z-scores in tables to find probabilities. Inverse: given a probability, find the corresponding x value.',
        },
        {
          stageId: 'y12-adv-l9-s9b', code: '9B', title: 'Sampling and Sample Means',
          outcomeIds: ['MA-STAT-05'], topicIds: ['MA-STAT-05'],
          explanation: 'The sample mean x̄ is normally distributed with mean μ and standard deviation σ/√n (standard error). Larger n → less variability in sample means. This is the Central Limit Theorem.',
        },
        {
          stageId: 'y12-adv-l9-s9c', code: '9C', title: 'Confidence Intervals',
          outcomeIds: ['MA-STAT-05'], topicIds: ['MA-STAT-05'],
          explanation: '95% CI: x̄ ± 1.96·(σ/√n). 99% CI: x̄ ± 2.576·(σ/√n). Interpretation: we are 95% confident that the true population mean lies within this interval. Wider intervals = more confidence but less precision.',
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
    // ── Chapter 1: Proof by Mathematical Induction ────────────────────────────
    {
      levelId: 'y12-ext1-l1', levelNum: 1, title: 'Proof by Mathematical Induction', emoji: '🔍', color: '#6366F1',
      stages: [
        {
          stageId: 'y12-ext1-l1-s1a', code: '1A', title: 'The Principle of Mathematical Induction',
          outcomeIds: ['MA-EXT-01'], topicIds: ['MA-EXT-01'],
          explanation: '(1) Base case: verify P(1) is true. (2) Inductive step: assume P(k) is true and prove P(k+1) follows. (3) Conclusion: true for all n≥1. Clearly state the assumption and what must be proved in step 2.',
        },
        {
          stageId: 'y12-ext1-l1-s1b', code: '1B', title: 'Proving Divisibility and Inequalities by Induction',
          outcomeIds: ['MA-EXT-01'], topicIds: ['MA-EXT-01'],
          explanation: 'Divisibility: show P(k+1) − P(k) is divisible by the required number, using the assumption. Inequalities: show P(k+1) using P(k). Key: write the k+1 case explicitly before using the assumption.',
        },
        {
          stageId: 'y12-ext1-l1-s1c', code: '1C', title: 'Proving Series Formulae by Induction',
          outcomeIds: ['MA-EXT-01'], topicIds: ['MA-EXT-01'],
          explanation: 'Assume Σ(k terms) = f(k). Show Σ(k+1 terms) = f(k+1) by adding the (k+1)th term to f(k) and simplifying. The algebraic manipulation must yield f(k+1) exactly.',
        },
      ],
    },
    // ── Chapter 2: Vectors ────────────────────────────────────────────────────
    {
      levelId: 'y12-ext1-l2', levelNum: 2, title: 'Vectors', emoji: '→', color: '#0EA5E9',
      stages: [
        {
          stageId: 'y12-ext1-l2-s2a', code: '2A', title: 'Introduction to Vectors in 2D',
          outcomeIds: ['MA-EXT-06'], topicIds: ['MA-EXT-06'],
          explanation: 'A vector has magnitude and direction. Component form: a = xi + yj. |a| = √(x²+y²). Add tip-to-tail or by adding components. Scalar multiple: ka scales magnitude by |k| and reverses direction if k<0.',
        },
        {
          stageId: 'y12-ext1-l2-s2b', code: '2B', title: 'The Dot Product',
          outcomeIds: ['MA-EXT-06'], topicIds: ['MA-EXT-06'],
          explanation: 'a·b = |a||b|cosθ = a₁b₁+a₂b₂. If a·b=0, the vectors are perpendicular. Find the angle between vectors using cosθ = a·b/(|a||b|). Projection of a onto b: a_b = (a·b/|b|²)b.',
        },
        {
          stageId: 'y12-ext1-l2-s2c', code: '2C', title: 'Vectors and Geometry',
          outcomeIds: ['MA-EXT-06'], topicIds: ['MA-EXT-06'],
          explanation: 'Use vectors to prove geometric results: midpoints, parallel lines, collinear points. Position vector of point P: OP⃗. Midpoint of AB: ½(a+b). Prove parallelograms, medians, and other geometric properties.',
        },
        {
          stageId: 'y12-ext1-l2-s2d', code: '2D', title: 'Projectile Motion Using Vectors',
          outcomeIds: ['MA-EXT-06'], topicIds: ['MA-EXT-06'],
          explanation: 'Resolve into horizontal (constant velocity) and vertical (uniform acceleration −g). x = V cosα·t; y = V sinα·t − ½gt². Find range, maximum height, time of flight. Eliminate t for Cartesian equation of trajectory.',
        },
      ],
    },
    // ── Chapter 3: Trigonometric Equations ────────────────────────────────────
    {
      levelId: 'y12-ext1-l3', levelNum: 3, title: 'Trigonometric Equations', emoji: '〜', color: '#EC4899',
      stages: [
        {
          stageId: 'y12-ext1-l3-s3a', code: '3A', title: 'Sum and Product Identities',
          outcomeIds: ['MA-TRIG-03'], topicIds: ['MA-TRIG-03'],
          explanation: 'Product-to-sum: 2sinA cosB = sin(A+B)+sin(A−B). Sum-to-product: sinP+sinQ = 2sin((P+Q)/2)cos((P−Q)/2). Use these to solve equations and find exact values of compound angles.',
        },
        {
          stageId: 'y12-ext1-l3-s3b', code: '3B', title: 'The t-Formula (Weierstrass Substitution)',
          outcomeIds: ['MA-TRIG-03'], topicIds: ['MA-TRIG-03'],
          explanation: 'Let t = tan(x/2). Then sinx = 2t/(1+t²), cosx = (1−t²)/(1+t²), tanx = 2t/(1−t²). Converts trig equations to algebraic equations. Valid for x ≠ π (where t is undefined).',
        },
        {
          stageId: 'y12-ext1-l3-s3c', code: '3C', title: 'Harder Trigonometric Equations',
          outcomeIds: ['MA-TRIG-04'], topicIds: ['MA-TRIG-04'],
          explanation: 'Use identities, double-angle, and t-formula to simplify equations to a standard form. Multiple angles: 3x=... requires finding solutions then dividing. Always check that solutions satisfy any restrictions.',
        },
        {
          stageId: 'y12-ext1-l3-s3d', code: '3D', title: 'Inverse Trigonometric Functions and Their Derivatives',
          outcomeIds: ['MA-TRIG-05'], topicIds: ['MA-TRIG-05'],
          explanation: 'd/dx(sin⁻¹x) = 1/√(1−x²); d/dx(cos⁻¹x) = −1/√(1−x²); d/dx(tan⁻¹x) = 1/(1+x²). With chain rule: d/dx(sin⁻¹(f(x))) = f\'(x)/√(1−[f(x)]²). Essential for Extension 1 integration.',
        },
      ],
    },
    // ── Chapter 4: Integration Techniques ────────────────────────────────────
    {
      levelId: 'y12-ext1-l4', levelNum: 4, title: 'Integration Techniques', emoji: '∫', color: '#10B981',
      stages: [
        {
          stageId: 'y12-ext1-l4-s4a', code: '4A', title: 'Integration Involving Inverse Trig Functions',
          outcomeIds: ['MA-EXT-03'], topicIds: ['MA-EXT-03'],
          explanation: '∫1/√(a²−x²) dx = sin⁻¹(x/a)+C. ∫1/(a²+x²) dx = (1/a)tan⁻¹(x/a)+C. Recognise these forms and adjust constants. Completing the square may be needed to bring integrands to these forms.',
        },
        {
          stageId: 'y12-ext1-l4-s4b', code: '4B', title: 'Integration by Parts',
          outcomeIds: ['MA-EXT-03'], topicIds: ['MA-EXT-03'],
          explanation: '∫u dv = uv − ∫v du. Choose u to differentiate using LIATE: Logs, Inverse trig, Algebraic, Trig, Exponential. Apply twice for ∫eˣsinx dx: set up a system of equations with the repeated integral.',
        },
        {
          stageId: 'y12-ext1-l4-s4c', code: '4C', title: 'Harder Substitution and Reduction Formulae',
          outcomeIds: ['MA-CALC-I05'], topicIds: ['MA-CALC-I05'],
          explanation: 'Trigonometric substitution: for √(a²−x²) let x=a sinθ. Reduction formulae express Iₙ in terms of Iₙ₋₁ or Iₙ₋₂. Apply repeatedly to evaluate integrals like ∫sinⁿx dx.',
        },
      ],
    },
    // ── Chapter 5: Rates of Change ────────────────────────────────────────────
    {
      levelId: 'y12-ext1-l5', levelNum: 5, title: 'Rates of Change', emoji: '📈', color: '#F59E0B',
      stages: [
        {
          stageId: 'y12-ext1-l5-s5a', code: '5A', title: 'Related Rates of Change',
          outcomeIds: ['MA-CALC-D07'], topicIds: ['MA-CALC-D07'],
          explanation: 'Use the chain rule to relate rates: dy/dt = (dy/dx)·(dx/dt). Draw a diagram, define all variables, write a geometric relationship, differentiate implicitly with respect to time, substitute given values.',
        },
        {
          stageId: 'y12-ext1-l5-s5b', code: '5B', title: 'Differential Equations — Separable',
          outcomeIds: ['MA-EXT-04'], topicIds: ['MA-EXT-04'],
          explanation: 'dy/dx = f(x)g(y): separate variables to dy/g(y) = f(x)dx, then integrate both sides. Exponential growth/decay: dN/dt = kN → N = N₀eᵏᵗ. Newton\'s cooling: dT/dt = −k(T−T₀) → T = T₀ + Ae⁻ᵏᵗ.',
        },
        {
          stageId: 'y12-ext1-l5-s5c', code: '5C', title: 'Slope Fields and Qualitative Analysis',
          outcomeIds: ['MA-EXT-04'], topicIds: ['MA-EXT-04'],
          explanation: 'A slope field shows the gradient dy/dx at each point (x,y). Solution curves follow the slopes. Use to sketch solutions, identify equilibrium solutions (where dy/dx=0 for all time), and analyse long-term behaviour.',
        },
      ],
    },
    // ── Chapter 6: Motion ─────────────────────────────────────────────────────
    {
      levelId: 'y12-ext1-l6', levelNum: 6, title: 'Motion', emoji: '🚀', color: '#F97316',
      stages: [
        {
          stageId: 'y12-ext1-l6-s6a', code: '6A', title: 'Simple Harmonic Motion',
          outcomeIds: ['MA-EXT-04'], topicIds: ['MA-EXT-04'],
          explanation: 'SHM: ẍ = −n²x. Solution: x = A cos(nt+φ). Amplitude A, period 2π/n. Velocity: v² = n²(A²−x²). Max speed n·A at x=0; max acceleration n²A at |x|=A. Identify if ẍ = −n²x from context.',
        },
        {
          stageId: 'y12-ext1-l6-s6b', code: '6B', title: 'Projectile Motion',
          outcomeIds: ['MA-EXT-06'], topicIds: ['MA-EXT-06'],
          explanation: 'Horizontal: ẍ=0, so x=V cosα·t. Vertical: ÿ=−g, so y=V sinα·t−½gt². Eliminate t: y = x tanα − gx²/(2V²cos²α). Range R = V² sin2α/g (max at α=45°). Time of flight T = 2V sinα/g.',
        },
        {
          stageId: 'y12-ext1-l6-s6c', code: '6C', title: 'General Motion Along a Line',
          outcomeIds: ['MA-EXT-04'], topicIds: ['MA-EXT-04'],
          explanation: 'Write acceleration as a=f(x) (function of position) or a=g(v) (function of velocity). For a=f(x): use v(dv/dx)=f(x) → integrate. For a=g(v): use dv/dt=g(v) → separate variables.',
        },
      ],
    },
    // ── Chapter 7: The Binomial Theorem ───────────────────────────────────────
    {
      levelId: 'y12-ext1-l7', levelNum: 7, title: 'The Binomial Theorem', emoji: '📐', color: '#8B5CF6',
      stages: [
        {
          stageId: 'y12-ext1-l7-s7a', code: '7A', title: 'Pascal\'s Triangle and Binomial Coefficients',
          outcomeIds: ['MA-EXT-02'], topicIds: ['MA-EXT-02'],
          explanation: 'ⁿCᵣ = n!/(r!(n−r)!). Pascal\'s rule: ⁿCᵣ + ⁿCᵣ₊₁ = ⁽ⁿ⁺¹⁾Cᵣ₊₁. Key identities: ⁿC₀+ⁿC₁+…+ⁿCₙ = 2ⁿ (sum of row n). ⁿC₀−ⁿC₁+…±ⁿCₙ = 0 (alternating sum).',
        },
        {
          stageId: 'y12-ext1-l7-s7b', code: '7B', title: 'The Binomial Theorem',
          outcomeIds: ['MA-EXT-02'], topicIds: ['MA-EXT-02'],
          explanation: '(a+b)ⁿ = Σᵣ₌₀ⁿ ⁿCᵣ aⁿ⁻ʳbʳ. General term: Tᵣ₊₁ = ⁿCᵣ aⁿ⁻ʳbʳ. To find the term independent of x (or containing xᵏ): set the power of x equal to the required value and solve for r.',
        },
        {
          stageId: 'y12-ext1-l7-s7c', code: '7C', title: 'Harder Binomial Problems and Identities',
          outcomeIds: ['MA-EXT-02'], topicIds: ['MA-EXT-02'],
          explanation: 'Prove identities by substituting special values (x=1, x=−1) or differentiating/integrating the binomial expansion. Find the greatest term by computing Tᵣ₊₁/Tᵣ and finding when this ratio changes sign.',
        },
      ],
    },
    // ── Chapter 8: Statistical Analysis — Binomial Distribution ──────────────
    {
      levelId: 'y12-ext1-l8', levelNum: 8, title: 'Statistical Analysis', emoji: '📊', color: '#14B8A6',
      stages: [
        {
          stageId: 'y12-ext1-l8-s8a', code: '8A', title: 'The Binomial Distribution',
          outcomeIds: ['MA-STAT-07'], topicIds: ['MA-STAT-07'],
          explanation: 'X ~ B(n,p): n independent trials, probability p of success. P(X=r) = ⁿCᵣ pʳ(1−p)ⁿ⁻ʳ. E(X) = np; Var(X) = np(1−p); SD = √(np(1−p)). Use for repeated identical experiments with two outcomes.',
        },
        {
          stageId: 'y12-ext1-l8-s8b', code: '8B', title: 'Normal Approximation to the Binomial',
          outcomeIds: ['MA-STAT-07'], topicIds: ['MA-STAT-07'],
          explanation: 'For large n, B(n,p) ≈ N(np, np(1−p)). Use this approximation when np ≥ 5 and n(1−p) ≥ 5. Standardise: Z = (X−np)/√(np(1−p)). Apply continuity correction for better accuracy.',
        },
        {
          stageId: 'y12-ext1-l8-s8c', code: '8C', title: 'Sample Proportions and Confidence Intervals',
          outcomeIds: ['MA-STAT-07'], topicIds: ['MA-STAT-07'],
          explanation: 'Sample proportion p̂ = X/n estimates population proportion p. For large n: p̂ ~ N(p, p(1−p)/n). 95% CI for p: p̂ ± 1.96√(p̂(1−p̂)/n). The interval captures the true p in 95% of all samples.',
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
    // ── MS-A3/A4: Algebra — Types of Relationships ────────────────────────────
    {
      levelId: 'y12-std-l1', levelNum: 1, title: 'Algebra — Types of Relationships', emoji: '✏️', color: '#8B5CF6',
      stages: [
        {
          stageId: 'y12-std-l1-s1a', code: '1A', title: 'Simultaneous Linear Equations',
          outcomeIds: ['MA-ALG-03'], topicIds: ['MA-ALG-03'],
          explanation: 'Solve pairs of linear equations by substitution or elimination. Interpret the solution as the intersection point of two lines. Use in real contexts: break-even analysis, comparing phone plans.',
        },
        {
          stageId: 'y12-std-l1-s1b', code: '1B', title: 'Non-Linear Relationships',
          outcomeIds: ['MA-ALG-05'], topicIds: ['MA-ALG-05'],
          explanation: 'Quadratic y=ax²+bx+c: parabola, vertex at x=−b/2a. Exponential y=aˣ: passes through (0,1). Hyperbola y=k/x: asymptotes at x=0 and y=0. Identify curves from tables of values and context.',
        },
        {
          stageId: 'y12-std-l1-s1c', code: '1C', title: 'Reciprocal and Cubic Functions',
          outcomeIds: ['MA-ALG-05'], topicIds: ['MA-ALG-05'],
          explanation: 'Reciprocal y=1/x: product of x and y is constant (inverse variation). Cubic y=x³: S-shaped graph through origin. Recognise these curves in real-world data contexts.',
        },
      ],
    },
    // ── MS-M3/M4/M5: Measurement ──────────────────────────────────────────────
    {
      levelId: 'y12-std-l2', levelNum: 2, title: 'Measurement', emoji: '📏', color: '#0EA5E9',
      stages: [
        {
          stageId: 'y12-std-l2-s2a', code: '2A', title: 'Right-Angled Triangles — Trigonometry Review',
          outcomeIds: ['MA-TRIG-07'], topicIds: ['MA-TRIG-07'],
          explanation: 'SOH CAH TOA. Find missing sides and angles. Angles of elevation and depression. Bearings (clockwise from North). Apply to practical problems: heights, distances, navigation.',
        },
        {
          stageId: 'y12-std-l2-s2b', code: '2B', title: 'Non-Right-Angled Triangles — Sine and Cosine Rules',
          outcomeIds: ['MA-TRIG-07'], topicIds: ['MA-TRIG-07'],
          explanation: 'Sine rule: a/sinA = b/sinB = c/sinC. Cosine rule: a²=b²+c²−2bc cosA. Area = ½ab sinC. Choose the right rule based on known information. The ambiguous case: check if two triangles are possible.',
        },
        {
          stageId: 'y12-std-l2-s2c', code: '2C', title: 'Rates and Ratios',
          outcomeIds: ['MA-ALG-05'], topicIds: ['MA-ALG-05'],
          explanation: 'Rates compare different quantities (km/h, L/min). Ratios compare same quantities. Speed = distance/time; flow rate = volume/time. Use proportion to solve missing-value problems.',
        },
        {
          stageId: 'y12-std-l2-s2d', code: '2D', title: 'Scale Drawings and Similarity',
          outcomeIds: ['MA-COORD-01'], topicIds: ['MA-COORD-01'],
          explanation: 'Scale = drawing length / actual length. Find actual lengths from drawings by multiplying. Similar figures: sides in proportion. Calculate areas and volumes using scale factors (area: k², volume: k³).',
        },
      ],
    },
    // ── MS-F2/F3/F4: Financial Mathematics ────────────────────────────────────
    {
      levelId: 'y12-std-l3', levelNum: 3, title: 'Financial Mathematics', emoji: '💰', color: '#10B981',
      stages: [
        {
          stageId: 'y12-std-l3-s3a', code: '3A', title: 'Investments and Compound Interest',
          outcomeIds: ['MA-FIN-02'], topicIds: ['MA-FIN-02'],
          explanation: 'A = P(1+r)ⁿ: compound interest grows exponentially. Compare different compounding frequencies (annual, monthly, daily). Real return accounts for inflation: real rate ≈ nominal rate − inflation rate.',
        },
        {
          stageId: 'y12-std-l3-s3b', code: '3B', title: 'Depreciation',
          outcomeIds: ['MA-FIN-05'], topicIds: ['MA-FIN-05'],
          explanation: 'Straight-line: V = V₀ − D·n (decreases by a fixed amount each year). Declining balance: V = V₀(1−r)ⁿ (decreases by a fixed percentage). Find when asset value drops below a threshold.',
        },
        {
          stageId: 'y12-std-l3-s3c', code: '3C', title: 'Annuities — Future Value',
          outcomeIds: ['MA-FIN-03'], topicIds: ['MA-FIN-03'],
          explanation: 'Future value of an annuity: FV = M·((1+r)ⁿ−1)/r, where M is regular payment, r is rate per period, n is number of periods. Use for savings plans and superannuation.',
        },
        {
          stageId: 'y12-std-l3-s3d', code: '3D', title: 'Annuities — Present Value and Loan Repayments',
          outcomeIds: ['MA-FIN-04'], topicIds: ['MA-FIN-04'],
          explanation: 'Present value: PV = M·(1−(1+r)⁻ⁿ)/r. Repayment: M = PV·r/((1−(1+r)⁻ⁿ)). Use for mortgages and loans. Understand that early repayments save more interest than later repayments.',
        },
      ],
    },
    // ── MS-S3/S4/S5: Statistical Analysis ────────────────────────────────────
    {
      levelId: 'y12-std-l4', levelNum: 4, title: 'Statistical Analysis', emoji: '📊', color: '#F59E0B',
      stages: [
        {
          stageId: 'y12-std-l4-s4a', code: '4A', title: 'Bivariate Data, Correlation, and Regression',
          outcomeIds: ['MA-STAT-04'], topicIds: ['MA-STAT-04'],
          explanation: 'Pearson\'s r: +1 perfect positive, −1 perfect negative, 0 no linear correlation. Correlation ≠ causation. Least-squares regression line ŷ = a + bx: use to predict y for a given x within the data range.',
        },
        {
          stageId: 'y12-std-l4-s4b', code: '4B', title: 'The Normal Distribution',
          outcomeIds: ['MA-STAT-05'], topicIds: ['MA-STAT-05'],
          explanation: 'Bell-shaped, symmetric about μ. 68-95-99.7 rule: 68% within μ±σ, 95% within μ±2σ, 99.7% within μ±3σ. Convert to z-scores using z=(x−μ)/σ and look up probabilities in tables.',
        },
        {
          stageId: 'y12-std-l4-s4c', code: '4C', title: 'Sampling and Sampling Distributions',
          outcomeIds: ['MA-STAT-05'], topicIds: ['MA-STAT-05'],
          explanation: 'A sample statistic estimates a population parameter. Random sampling reduces bias. The distribution of sample means has mean μ and standard deviation σ/√n (standard error). Larger samples give better estimates.',
        },
        {
          stageId: 'y12-std-l4-s4d', code: '4D', title: 'Confidence Intervals',
          outcomeIds: ['MA-STAT-05'], topicIds: ['MA-STAT-05'],
          explanation: 'A 95% confidence interval is x̄ ± 1.96·(σ/√n). It means we are 95% confident the true mean lies in this interval — not that there is a 95% chance. Wider intervals give more confidence but less precision.',
        },
      ],
    },
    // ── MS-N2/N3: Networks ────────────────────────────────────────────────────
    {
      levelId: 'y12-std-l5', levelNum: 5, title: 'Networks', emoji: '🕸️', color: '#6366F1',
      stages: [
        {
          stageId: 'y12-std-l5-s5a', code: '5A', title: 'Network Concepts and Paths',
          outcomeIds: ['MA-COORD-01'], topicIds: ['MA-COORD-01'],
          explanation: 'Vertices, edges, degree. Euler path: each edge once (0 or 2 odd-degree vertices). Euler circuit: Euler path returning to start (all even degrees). Hamiltonian path: each vertex once.',
        },
        {
          stageId: 'y12-std-l5-s5b', code: '5B', title: 'Shortest Paths and Minimum Spanning Trees',
          outcomeIds: ['MA-COORD-01'], topicIds: ['MA-COORD-01'],
          explanation: 'Dijkstra\'s algorithm finds the shortest path between two vertices. Prim\'s (or Kruskal\'s) algorithm finds the minimum spanning tree — connects all vertices with minimum total edge weight.',
        },
        {
          stageId: 'y12-std-l5-s5c', code: '5C', title: 'Critical Path Analysis',
          outcomeIds: ['MA-COORD-01'], topicIds: ['MA-COORD-01'],
          explanation: 'Draw an activity network (forward and backward pass). Earliest start time (EST) and latest start time (LST) for each activity. Float = LST − EST. Critical path: all activities with zero float. Minimum project duration = length of critical path.',
        },
        {
          stageId: 'y12-std-l5-s5d', code: '5D', title: 'Flow Problems',
          outcomeIds: ['MA-COORD-01'], topicIds: ['MA-COORD-01'],
          explanation: 'Maximum flow through a network is determined by the minimum cut. A cut separates source from sink; its capacity is the sum of edge capacities crossing it. Max-flow min-cut theorem: maximum flow = minimum cut capacity.',
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
    // ── Chapter 1: Complex Numbers ────────────────────────────────────────────
    {
      levelId: 'y12-ext2-l1', levelNum: 1, title: 'Complex Numbers', emoji: '𝑖', color: '#EC4899',
      stages: [
        {
          stageId: 'y12-ext2-l1-s1a', code: '1A', title: 'Arithmetic of Complex Numbers',
          outcomeIds: ['MA-EXT-07'], topicIds: ['MA-EXT-07'],
          explanation: 'z = a+bi, i = √(−1). Add/subtract: combine real and imaginary parts. Multiply: use i²=−1. Divide: multiply by conjugate z̄=a−bi. |z|=√(a²+b²). The conjugate satisfies z+z̄=2Re(z) and zz̄=|z|².',
        },
        {
          stageId: 'y12-ext2-l1-s1b', code: '1B', title: 'The Argand Diagram and Geometric Interpretation',
          outcomeIds: ['MA-EXT-07'], topicIds: ['MA-EXT-07'],
          explanation: 'Plot z=a+bi as point (a,b). Addition is vector addition. |z₁−z₂| is the distance between z₁ and z₂. Loci: |z−a|=r is a circle; Re(z)=c is a vertical line; |z−z₁|=|z−z₂| is a perpendicular bisector.',
        },
        {
          stageId: 'y12-ext2-l1-s1c', code: '1C', title: 'Modulus-Argument (Polar) Form',
          outcomeIds: ['MA-EXT-07'], topicIds: ['MA-EXT-07'],
          explanation: 'z = r(cosθ + i sinθ) = r cis θ. Modulus r=|z|=√(a²+b²). Argument θ=arg(z)=tan⁻¹(b/a), adjusted for quadrant. Multiply: multiply moduli, add arguments. Divide: divide moduli, subtract arguments.',
        },
        {
          stageId: 'y12-ext2-l1-s1d', code: '1D', title: 'De Moivre\'s Theorem and Powers',
          outcomeIds: ['MA-EXT-07'], topicIds: ['MA-EXT-07'],
          explanation: 'De Moivre: (r cis θ)ⁿ = rⁿ cis(nθ). Use to expand (cosθ + i sinθ)ⁿ and derive multiple-angle formulae for cosⁿθ and sinⁿθ in terms of cosines/sines of multiples.',
        },
        {
          stageId: 'y12-ext2-l1-s1e', code: '1E', title: 'Roots of Complex Numbers',
          outcomeIds: ['MA-EXT-07'], topicIds: ['MA-EXT-07'],
          explanation: 'The nth roots of z = r cis θ are: z^(1/n) = r^(1/n) cis((θ+2kπ)/n) for k=0,1,…,n−1. They are equally spaced on a circle of radius r^(1/n). nth roots of unity: modulus 1, argument 2kπ/n.',
        },
        {
          stageId: 'y12-ext2-l1-s1f', code: '1F', title: 'Polynomials with Complex Roots and Loci',
          outcomeIds: ['MA-EXT-07'], topicIds: ['MA-EXT-07'],
          explanation: 'Real polynomials have complex roots in conjugate pairs. Factor theorem applies over ℂ. Complex loci: sketch sets like {z: arg(z−a) = θ} (ray), {z: Im(z/w) = 0} (line through origin). Combine conditions for regions.',
        },
      ],
    },
    // ── Chapter 2: Proof ──────────────────────────────────────────────────────
    {
      levelId: 'y12-ext2-l2', levelNum: 2, title: 'Proof', emoji: '🔍', color: '#6366F1',
      stages: [
        {
          stageId: 'y12-ext2-l2-s2a', code: '2A', title: 'The Language of Proof',
          outcomeIds: ['MA-EXT-01'], topicIds: ['MA-EXT-01'],
          explanation: 'Understand: implication (P⟹Q), converse (Q⟹P), contrapositive (¬Q⟹¬P), biconditional (P⟺Q). Proof by contrapositive proves ¬Q⟹¬P instead of P⟹Q (equally valid, sometimes easier).',
        },
        {
          stageId: 'y12-ext2-l2-s2b', code: '2B', title: 'Proof by Contradiction',
          outcomeIds: ['MA-EXT-01'], topicIds: ['MA-EXT-01'],
          explanation: 'Assume the negation of the statement is true, then derive a logical contradiction. Famous examples: √2 is irrational, there are infinitely many primes. State clearly what you are assuming and what contradiction you reach.',
        },
        {
          stageId: 'y12-ext2-l2-s2c', code: '2C', title: 'Mathematical Induction (Extended)',
          outcomeIds: ['MA-EXT-01'], topicIds: ['MA-EXT-01'],
          explanation: 'Prove results about inequalities, divisibility, and complex numbers by induction. Strong induction: assume true for all m≤k, prove for k+1. Induction does not apply unless base case and inductive step are both complete.',
        },
        {
          stageId: 'y12-ext2-l2-s2d', code: '2D', title: 'Inequalities — AM-GM and Cauchy-Schwarz',
          outcomeIds: ['MA-EXT-01'], topicIds: ['MA-EXT-01'],
          explanation: 'AM-GM: (a+b)/2 ≥ √(ab) for a,b≥0; equality when a=b. Cauchy-Schwarz: (a₁b₁+a₂b₂)² ≤ (a₁²+a₂²)(b₁²+b₂²). Use these to prove harder inequalities and optimise expressions.',
        },
      ],
    },
    // ── Chapter 3: Vectors (3D) ───────────────────────────────────────────────
    {
      levelId: 'y12-ext2-l3', levelNum: 3, title: 'Vectors in 3D', emoji: '→', color: '#0EA5E9',
      stages: [
        {
          stageId: 'y12-ext2-l3-s3a', code: '3A', title: '3D Vectors — Components and Operations',
          outcomeIds: ['MA-EXT-08'], topicIds: ['MA-EXT-08'],
          explanation: '3D vectors: a = a₁i + a₂j + a₃k. |a| = √(a₁²+a₂²+a₃²). Dot product: a·b = a₁b₁+a₂b₂+a₃b₃ = |a||b|cosθ. Zero dot product: perpendicular. Direction cosines and direction ratios.',
        },
        {
          stageId: 'y12-ext2-l3-s3b', code: '3B', title: 'Cross Product',
          outcomeIds: ['MA-EXT-08'], topicIds: ['MA-EXT-08'],
          explanation: 'a×b: magnitude |a||b|sinθ, direction perpendicular to both (right-hand rule). a×b = (a₂b₃−a₃b₂)i − (a₁b₃−a₃b₁)j + (a₁b₂−a₂b₁)k. Area of triangle = ½|a×b|. a×b = −b×a (anti-commutative).',
        },
        {
          stageId: 'y12-ext2-l3-s3c', code: '3C', title: 'Lines and Planes in 3D',
          outcomeIds: ['MA-EXT-08'], topicIds: ['MA-EXT-08'],
          explanation: 'Line: r = a + tb (a = position, b = direction). Plane: r·n = d (n = normal vector). Point-to-plane distance: d = |a·n − d|/|n|. Angle between line and plane, between two planes. Find intersection of line and plane.',
        },
      ],
    },
    // ── Chapter 4: Integration Techniques ─────────────────────────────────────
    {
      levelId: 'y12-ext2-l4', levelNum: 4, title: 'Integration Techniques', emoji: '∫', color: '#10B981',
      stages: [
        {
          stageId: 'y12-ext2-l4-s4a', code: '4A', title: 'Partial Fractions',
          outcomeIds: ['MA-EXT-09'], topicIds: ['MA-EXT-09'],
          explanation: 'Decompose rational functions: A/(x+a) + B/(x+b) for distinct linear factors; A/(x+a) + B/(x+a)² for repeated factors; (Ax+B)/(x²+bx+c) for irreducible quadratics. Multiply through and equate coefficients.',
        },
        {
          stageId: 'y12-ext2-l4-s4b', code: '4B', title: 'Trigonometric Substitution',
          outcomeIds: ['MA-EXT-09'], topicIds: ['MA-EXT-09'],
          explanation: '√(a²−x²): let x=a sinθ. √(a²+x²): let x=a tanθ. √(x²−a²): let x=a secθ. Convert to a trig integral, integrate, then back-substitute. Draw a right triangle to convert trig back to algebraic form.',
        },
        {
          stageId: 'y12-ext2-l4-s4c', code: '4C', title: 'Integration by Parts (Extended) and Reduction Formulae',
          outcomeIds: ['MA-EXT-09'], topicIds: ['MA-EXT-09'],
          explanation: '∫u dv = uv − ∫v du. Cyclic IBP: for ∫eˣsinx dx, apply twice to get Iₙ = [...]−Iₙ, then solve. Reduction formula Iₙ = f(n)·Iₙ₋₂ lets you reduce ∫sinⁿx or ∫cosⁿx to a base case.',
        },
        {
          stageId: 'y12-ext2-l4-s4d', code: '4D', title: 'The t-Substitution and Other Techniques',
          outcomeIds: ['MA-EXT-09'], topicIds: ['MA-EXT-09'],
          explanation: 't = tan(x/2): converts ∫R(sinx, cosx) dx to a rational function of t. Use for integrals like ∫1/(a+b sinx) dx. Reciprocal substitution and completing the square for harder algebraic integrands.',
        },
      ],
    },
    // ── Chapter 5: Mechanics ──────────────────────────────────────────────────
    {
      levelId: 'y12-ext2-l5', levelNum: 5, title: 'Mechanics', emoji: '⚡', color: '#F97316',
      stages: [
        {
          stageId: 'y12-ext2-l5-s5a', code: '5A', title: 'Simple Harmonic Motion (Extended)',
          outcomeIds: ['MA-EXT-05'], topicIds: ['MA-EXT-05'],
          explanation: 'SHM: ẍ = −n²x → x = A cos(nt+φ). V²=n²(A²−x²). Prove SHM by showing ẍ = −n²(x−c) for motion about equilibrium x=c. Apply to springs, pendulums, and electrical circuits.',
        },
        {
          stageId: 'y12-ext2-l5-s5b', code: '5B', title: 'Projectile Motion with Resistance',
          outcomeIds: ['MA-EXT-05'], topicIds: ['MA-EXT-05'],
          explanation: 'With air resistance kv: horizontal ẍ=−kẋ; vertical ÿ=−g−kẏ. Separate and solve each ODE. The terminal velocity is V=g/k (when ẍ=0). More complex than simple projectile — requires ODE solving.',
        },
        {
          stageId: 'y12-ext2-l5-s5c', code: '5C', title: 'Circular Motion',
          outcomeIds: ['MA-EXT-05'], topicIds: ['MA-EXT-05'],
          explanation: 'For uniform circular motion: centripetal acceleration a=v²/r=rω² directed toward centre. Centripetal force F=mv²/r. For non-uniform circular motion, tangential and radial components of acceleration both appear.',
        },
        {
          stageId: 'y12-ext2-l5-s5d', code: '5D', title: 'Resisted Motion Along a Line',
          outcomeIds: ['MA-EXT-05'], topicIds: ['MA-EXT-05'],
          explanation: 'For resistance proportional to velocity: mẍ=−mkẋ. Solve: v=v₀e^(−kt). For resistance proportional to v²: mẍ=−mkẋ². Terminal velocity v_T: when net force is zero. Use ODE techniques (separation of variables).',
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
