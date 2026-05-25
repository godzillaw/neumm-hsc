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
    // ── Chapter 1: Algebra ───────────────────────────────────────────────────
    {
      levelId: 'y9-l1', levelNum: 1, title: 'Algebra', emoji: '✏️', color: '#6366F1',
      stages: [
        {
          stageId: 'y9-l1-s1', code: '1A', title: 'Reviewing Algebra',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'Review the language of algebra: terms, coefficients, like terms, and expressions. Simplify by collecting like terms and applying the four operations.',
        },
        {
          stageId: 'y9-l1-s2', code: '1B', title: 'Expanding Expressions',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'Expand brackets using the distributive law: a(b+c) = ab+ac. For double brackets (a+b)(c+d) use FOIL. Perfect squares and difference of squares are key special cases.',
        },
        {
          stageId: 'y9-l1-s3', code: '1C', title: 'Factorising Using the HCF',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'Factorising is the reverse of expanding. Find the highest common factor (HCF) of all terms and place it outside the brackets: 6x² + 9x = 3x(2x + 3).',
        },
        {
          stageId: 'y9-l1-s4', code: '1D', title: 'Factorising the Difference of Two Squares',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'a² − b² = (a+b)(a−b). Recognise perfect squares in both terms, then apply this identity directly. Always check for a common factor before using this formula.',
        },
        {
          stageId: 'y9-l1-s5', code: '1E', title: 'Factorising Trinomials',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'To factorise x² + bx + c, find two numbers that multiply to c and add to b: x² + 5x + 6 = (x+2)(x+3). For ax² + bx + c, use the splitting method.',
        },
        {
          stageId: 'y9-l1-s6', code: '1F', title: 'Algebraic Fractions',
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
          stageId: 'y9-l2-s1', code: '2A', title: 'Solving Linear Equations',
          outcomeIds: ['MA-ALG-03'], topicIds: ['MA-ALG-03'],
          explanation: 'Isolate the variable by performing inverse operations on both sides. Expand brackets and collect like terms first. Always check your answer by substituting back.',
        },
        {
          stageId: 'y9-l2-s2', code: '2B', title: 'Solving Quadratic Equations',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'Rearrange to ax² + bx + c = 0, then factorise and set each factor to zero, or use the quadratic formula x = (−b ± √(b²−4ac))/2a.',
        },
        {
          stageId: 'y9-l2-s3', code: '2C', title: 'Solving Simultaneous Equations',
          outcomeIds: ['MA-ALG-03'], topicIds: ['MA-ALG-03'],
          explanation: 'Use substitution (rearrange one equation, substitute into the other) or elimination (multiply equations to match a coefficient, then add or subtract).',
        },
        {
          stageId: 'y9-l2-s4', code: '2D', title: 'Using Graphs to Solve Equations',
          outcomeIds: ['MA-ALG-03'], topicIds: ['MA-ALG-03'],
          explanation: 'Graph each equation; the intersection point gives the solution. This method works for any pair of equations, including non-linear ones.',
        },
        {
          stageId: 'y9-l2-s5', code: '2E', title: 'Linear Inequalities',
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
          stageId: 'y9-l4-s1', code: '4A', title: 'Trigonometric Ratios (SOH CAH TOA)',
          outcomeIds: ['MA-TRIG-07'], topicIds: ['MA-TRIG-07'],
          explanation: 'sin θ = O/H, cos θ = A/H, tan θ = O/A. Label sides as Opposite, Adjacent, Hypotenuse relative to the angle. Use your calculator for non-special angles.',
        },
        {
          stageId: 'y9-l4-s2', code: '4B', title: 'Finding an Unknown Side',
          outcomeIds: ['MA-TRIG-07'], topicIds: ['MA-TRIG-07'],
          explanation: 'Choose the ratio that links the unknown side to the known side and angle. Multiply or divide to isolate the unknown. Always round at the final step only.',
        },
        {
          stageId: 'y9-l4-s3', code: '4C', title: 'Finding an Unknown Angle',
          outcomeIds: ['MA-TRIG-07'], topicIds: ['MA-TRIG-07'],
          explanation: 'Use the inverse trig functions: θ = sin⁻¹(O/H), θ = cos⁻¹(A/H), θ = tan⁻¹(O/A). Your calculator gives the principal angle; check the context for obtuse solutions.',
        },
        {
          stageId: 'y9-l4-s4', code: '4D', title: 'Angles of Elevation and Depression',
          outcomeIds: ['MA-TRIG-08'], topicIds: ['MA-TRIG-08'],
          explanation: 'Elevation is measured up from horizontal; depression is measured down. Draw and label the right triangle, identify the angle, then apply the appropriate trig ratio.',
        },
        {
          stageId: 'y9-l4-s5', code: '4E', title: 'Bearings',
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
          stageId: 'y9-l5-s1', code: '5A', title: 'Graphing Linear Relationships',
          outcomeIds: ['MA-COORD-02'], topicIds: ['MA-COORD-02'],
          explanation: 'Plot y = mx + b using the y-intercept b and gradient m = rise/run. Alternatively, find two intercepts (set x=0 for y-intercept, set y=0 for x-intercept) and draw the line through them.',
        },
        {
          stageId: 'y9-l5-s2', code: '5B', title: 'Finding the Equation of a Line',
          outcomeIds: ['MA-COORD-02'], topicIds: ['MA-COORD-02'],
          explanation: 'Given gradient m and y-intercept b: y = mx + b. Given two points: find m first, then substitute one point to find b. Given gradient and one point: use y − y₁ = m(x − x₁).',
        },
        {
          stageId: 'y9-l5-s3', code: '5C', title: 'Parallel and Perpendicular Lines',
          outcomeIds: ['MA-COORD-02'], topicIds: ['MA-COORD-02'],
          explanation: 'Parallel lines have equal gradients. Perpendicular lines have gradients whose product is −1: m₂ = −1/m₁. Use these to find equations of lines through given points.',
        },
        {
          stageId: 'y9-l5-s4', code: '5D', title: 'Length and Midpoint',
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
          stageId: 'y11-adv-l1-s1a', code: '1A', title: 'Arithmetic with Algebraic Expressions',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'Collect like terms, expand brackets using the distributive law, and simplify products. Recognise and apply: (a+b)² = a²+2ab+b², (a−b)² = a²−2ab+b², a²−b² = (a+b)(a−b).',
        },
        {
          stageId: 'y11-adv-l1-s1b', code: '1B', title: 'Factorising',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'Factorise by: (1) taking the HCF, (2) difference of squares, (3) trinomials x²+bx+c=(x+p)(x+q), (4) grouping. Always take the HCF first before applying other methods.',
        },
        {
          stageId: 'y11-adv-l1-s1c', code: '1C', title: 'Algebraic Fractions',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'Simplify by factorising then cancelling. Add/subtract: find the LCD. Multiply: cancel across numerators and denominators. Divide: multiply by the reciprocal.',
        },
        {
          stageId: 'y11-adv-l1-s1d', code: '1D', title: 'Solving Linear and Quadratic Equations',
          outcomeIds: ['MA-ALG-03'], topicIds: ['MA-ALG-03'],
          explanation: 'Rearrange linear equations using inverse operations. Solve quadratics by factorising, completing the square, or x = (−b ± √Δ)/2a. Discriminant Δ = b²−4ac determines the number of real solutions.',
        },
        {
          stageId: 'y11-adv-l1-s1e', code: '1E', title: 'Solving Simultaneous Equations',
          outcomeIds: ['MA-ALG-03'], topicIds: ['MA-ALG-03'],
          explanation: 'Substitution: rearrange one equation, substitute into the other. Elimination: multiply to match a coefficient, then add or subtract. Non-linear simultaneous equations may give 0, 1, or 2 solutions.',
        },
        {
          stageId: 'y11-adv-l1-s1f', code: '1F', title: 'Completing the Square',
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
          stageId: 'y11-adv-l2-s2a', code: '2A', title: 'Real Numbers and Intervals',
          outcomeIds: ['MA-ALG-08'], topicIds: ['MA-ALG-08'],
          explanation: 'ℝ = rationals ∪ irrationals. Represent intervals: [a,b] closed, (a,b) open, [a,b) half-open. On a number line, use filled circles for closed endpoints and open circles for open.',
        },
        {
          stageId: 'y11-adv-l2-s2b', code: '2B', title: 'Surds and Their Arithmetic',
          outcomeIds: ['MA-ALG-08'], topicIds: ['MA-ALG-08'],
          explanation: 'Simplify √(ab) = √a·√b. Add like surds: 3√5 + 7√5 = 10√5. Multiply using FOIL. Surds give exact values — always preferred in exam answers over rounded decimals.',
        },
        {
          stageId: 'y11-adv-l2-s2c', code: '2C', title: 'Further Simplification of Surds',
          outcomeIds: ['MA-ALG-08'], topicIds: ['MA-ALG-08'],
          explanation: 'Simplify by finding the largest perfect-square factor: √72 = √(36·2) = 6√2. Expand surd products: (2+√3)² = 7+4√3. Use (a+√b)(a−√b) = a²−b to get rational results.',
        },
        {
          stageId: 'y11-adv-l2-s2d', code: '2D', title: 'Rationalising the Denominator',
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
          stageId: 'y11-adv-l3-s3b', code: '3B', title: 'Graphs of Functions',
          outcomeIds: ['MA-FUNC-02'], topicIds: ['MA-FUNC-02'],
          explanation: 'Know key graphs: y = x (line), y = x² (parabola), y = x³ (cubic), y = 1/x (hyperbola), y = √x (half-parabola), y = |x| (V-shape). Identify domain, range, intercepts, and asymptotes for each.',
        },
        {
          stageId: 'y11-adv-l3-s3c', code: '3C', title: 'Review of Linear Graphs',
          outcomeIds: ['MA-COORD-02'], topicIds: ['MA-COORD-02'],
          explanation: 'y = mx + b: m = gradient, b = y-intercept. Find the equation given two points or given gradient and one point using y − y₁ = m(x − x₁). Parallel: equal gradients. Perpendicular: m₁m₂ = −1.',
        },
        {
          stageId: 'y11-adv-l3-s3d', code: '3D', title: 'The Quadratic Function and Its Graph',
          outcomeIds: ['MA-ALG-02'], topicIds: ['MA-ALG-02'],
          explanation: 'Vertex form y = a(x−h)² + k: vertex at (h,k), axis x = h. Intercept form y = a(x−p)(x−q): x-intercepts at p and q. Find the vertex from standard form: x = −b/2a.',
        },
        {
          stageId: 'y11-adv-l3-s3e', code: '3E', title: 'The Discriminant',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'Δ = b²−4ac. If Δ > 0: two distinct real roots (parabola cuts x-axis twice). If Δ = 0: one repeated root (parabola touches x-axis). If Δ < 0: no real roots (parabola does not touch x-axis).',
        },
        {
          stageId: 'y11-adv-l3-s3f', code: '3F', title: 'Further Parabolas — Locus Definition',
          outcomeIds: ['MA-ALG-02'], topicIds: ['MA-ALG-02'],
          explanation: 'A parabola is the locus of points equidistant from a focus and a directrix. Standard form x² = 4ay has focus at (0,a) and directrix y = −a. This definition underpins conics.',
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
          stageId: 'y11-adv-l4-s4b', code: '4B', title: 'Reflections in the Axes',
          outcomeIds: ['MA-FUNC-05'], topicIds: ['MA-FUNC-05'],
          explanation: 'y = −f(x) reflects in the x-axis (flips vertically). y = f(−x) reflects in the y-axis (flips horizontally). Apply translations after reflections for combined transformations.',
        },
        {
          stageId: 'y11-adv-l4-s4c', code: '4C', title: 'Even and Odd Symmetry',
          outcomeIds: ['MA-FUNC-05'], topicIds: ['MA-FUNC-05'],
          explanation: 'Even function: f(−x) = f(x) — symmetric about the y-axis. Odd function: f(−x) = −f(x) — symmetric about the origin. Check by substituting −x. Many functions are neither.',
        },
        {
          stageId: 'y11-adv-l4-s4d', code: '4D', title: 'Horizontal and Vertical Dilations',
          outcomeIds: ['MA-FUNC-05'], topicIds: ['MA-FUNC-05'],
          explanation: 'y = af(x) stretches vertically by factor |a|; reflects if a < 0. y = f(bx) compresses horizontally by factor 1/|b|; reflects if b < 0. Dilations change shape as well as position.',
        },
        {
          stageId: 'y11-adv-l4-s4e', code: '4E', title: 'Combining Transformations',
          outcomeIds: ['MA-FUNC-05'], topicIds: ['MA-FUNC-05'],
          explanation: 'Apply transformations in order: horizontal translations and dilations first (inside the function), then vertical dilations, then vertical translations. Sketch intermediate stages if needed.',
        },
      ],
    },
    // ── Chapter 5: Further Graphs ─────────────────────────────────────────────
    {
      levelId: 'y11-adv-l5', levelNum: 5, title: 'Further Graphs', emoji: '📐', color: '#14B8A6',
      stages: [
        {
          stageId: 'y11-adv-l5-s5a', code: '5A', title: 'Circles and Semi-Circles',
          outcomeIds: ['MA-FUNC-07'], topicIds: ['MA-FUNC-07'],
          explanation: '(x−h)² + (y−k)² = r² is a circle with centre (h,k) and radius r. Complete the square on both x and y terms to convert general form. y = √(r²−x²) is the upper semi-circle (a function).',
        },
        {
          stageId: 'y11-adv-l5-s5b', code: '5B', title: 'The Hyperbola y = k/(x−a) + b',
          outcomeIds: ['MA-FUNC-07'], topicIds: ['MA-FUNC-07'],
          explanation: 'Standard hyperbola y = 1/x has asymptotes x = 0, y = 0. Shift by (a, b): y = k/(x−a) + b has asymptotes x = a, y = b. Sketch by locating the asymptotes, then the two branches.',
        },
        {
          stageId: 'y11-adv-l5-s5c', code: '5C', title: 'Absolute Value Functions',
          outcomeIds: ['MA-FUNC-06'], topicIds: ['MA-FUNC-06'],
          explanation: '|x| = x if x ≥ 0, −x if x < 0. Graph y = |f(x)| by reflecting negative portions above the x-axis. Solve |ax + b| = c by considering both cases: ax + b = c and ax + b = −c.',
        },
        {
          stageId: 'y11-adv-l5-s5d', code: '5D', title: 'Graphing Using Technology',
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
          stageId: 'y11-adv-l6-s6a', code: '6A', title: 'Trigonometric Ratios and Exact Values',
          outcomeIds: ['MA-TRIG-01'], topicIds: ['MA-TRIG-01'],
          explanation: 'SOH CAH TOA for right triangles. Exact values: sin30°=½, cos30°=√3/2, tan30°=1/√3; sin45°=cos45°=1/√2; sin60°=√3/2, cos60°=½. Memorise these from special triangles.',
        },
        {
          stageId: 'y11-adv-l6-s6b', code: '6B', title: 'Trigonometric Functions of Any Angle',
          outcomeIds: ['MA-TRIG-01'], topicIds: ['MA-TRIG-01'],
          explanation: 'Use the unit circle to extend trig to any angle. ASTC rule: All positive in Q1, Sin in Q2, Tan in Q3, Cos in Q4. Reference angle: the acute angle to the x-axis. cos(180°−θ) = −cosθ, etc.',
        },
        {
          stageId: 'y11-adv-l6-s6c', code: '6C', title: 'Radian Measure',
          outcomeIds: ['MA-TRIG-09'], topicIds: ['MA-TRIG-09'],
          explanation: 'One radian is the angle subtended by an arc equal in length to the radius. π rad = 180°. Arc length l = rθ; sector area A = ½r²θ (θ in radians). Radians are essential for calculus of trig.',
        },
        {
          stageId: 'y11-adv-l6-s6d', code: '6D', title: 'Graphs of Sine, Cosine and Tangent',
          outcomeIds: ['MA-TRIG-02'], topicIds: ['MA-TRIG-02'],
          explanation: 'y = sin x: period 2π, amplitude 1, range [−1,1]. y = cos x: same but shifted π/2. y = tan x: period π, asymptotes where cos x = 0. Know 5 key points per cycle for sketching.',
        },
        {
          stageId: 'y11-adv-l6-s6e', code: '6E', title: 'Transformations of Trig Graphs',
          outcomeIds: ['MA-TRIG-02'], topicIds: ['MA-TRIG-02'],
          explanation: 'y = a sin(bx + c) + d: amplitude |a|, period 2π/|b|, phase shift −c/b, vertical shift d. Identify each parameter from the equation and sketch one full period from 5 key points.',
        },
        {
          stageId: 'y11-adv-l6-s6f', code: '6F', title: 'The Sine and Cosine Rules',
          outcomeIds: ['MA-TRIG-07'], topicIds: ['MA-TRIG-07'],
          explanation: 'Sine rule: a/sinA = b/sinB = c/sinC. Cosine rule: a² = b²+c²−2bc cosA. Use sine rule with a known angle-side pair; cosine rule with SAS or SSS. Area = ½ab sinC.',
        },
      ],
    },
    // ── Chapter 7: Exponential and Logarithmic Functions ─────────────────────
    {
      levelId: 'y11-adv-l7', levelNum: 7, title: 'Exponential and Log Functions', emoji: '📈', color: '#10B981',
      stages: [
        {
          stageId: 'y11-adv-l7-s7a', code: '7A', title: 'Exponential Functions and Their Graphs',
          outcomeIds: ['MA-EXP-01', 'MA-EXP-02'], topicIds: ['MA-EXP-01', 'MA-EXP-02'],
          explanation: 'y = aˣ (a > 0, a ≠ 1) passes through (0,1) with horizontal asymptote y = 0. a > 1: increasing (growth). 0 < a < 1: decreasing (decay). Natural base e ≈ 2.718 is fundamental in calculus.',
        },
        {
          stageId: 'y11-adv-l7-s7b', code: '7B', title: 'Logarithms',
          outcomeIds: ['MA-EXP-03'], topicIds: ['MA-EXP-03'],
          explanation: 'log_a(x) = y ⟺ aʸ = x. Domain of log: x > 0. Graph of y = log_a(x) is the reflection of y = aˣ in y = x. ln x = log_e x. Change of base: log_a(x) = ln x / ln a.',
        },
        {
          stageId: 'y11-adv-l7-s7c', code: '7C', title: 'Laws of Logarithms',
          outcomeIds: ['MA-EXP-04'], topicIds: ['MA-EXP-04'],
          explanation: 'Product: log(AB) = logA + logB. Quotient: log(A/B) = logA − logB. Power: log(Aⁿ) = n logA. These laws are used to simplify expressions, solve log equations, and differentiate log functions.',
        },
        {
          stageId: 'y11-adv-l7-s7d', code: '7D', title: 'Graphs of Log Functions and Transformations',
          outcomeIds: ['MA-EXP-01'], topicIds: ['MA-EXP-01'],
          explanation: 'y = ln(x): domain x > 0, vertical asymptote x = 0. Apply transformations: y = ln(x − h) + k shifts right h and up k. The graph and exponential are reflections in y = x.',
        },
        {
          stageId: 'y11-adv-l7-s7e', code: '7E', title: 'Exponential Growth and Decay',
          outcomeIds: ['MA-EXP-02'], topicIds: ['MA-EXP-02'],
          explanation: 'A = A₀ eᵏᵗ: k > 0 gives growth, k < 0 gives decay. The half-life T satisfies e^(kT) = ½. Model real situations (population, radioactive decay, cooling) by identifying A₀ and k from given data.',
        },
      ],
    },
    // ── Chapter 8: Differentiation ────────────────────────────────────────────
    {
      levelId: 'y11-adv-l8', levelNum: 8, title: 'Differentiation', emoji: '∂', color: '#EC4899',
      stages: [
        {
          stageId: 'y11-adv-l8-s8a', code: '8A', title: 'Limits and First Principles',
          outcomeIds: ['MA-CALC-D01'], topicIds: ['MA-CALC-D01'],
          explanation: 'f\'(x) = lim[h→0] (f(x+h)−f(x))/h. This limit gives the gradient of the tangent — the instantaneous rate of change at x. Compute for simple functions like x² to understand the process.',
        },
        {
          stageId: 'y11-adv-l8-s8b', code: '8B', title: 'Differentiating Powers of x',
          outcomeIds: ['MA-CALC-D01'], topicIds: ['MA-CALC-D01'],
          explanation: 'Power rule: d/dx(xⁿ) = nxⁿ⁻¹. Sum rule: d/dx(f + g) = f\' + g\'. Constant multiple: d/dx(cf) = c·f\'. Differentiate each term separately. Apply to polynomials immediately.',
        },
        {
          stageId: 'y11-adv-l8-s8c', code: '8C', title: 'Differentiating Trig Functions',
          outcomeIds: ['MA-CALC-D04'], topicIds: ['MA-CALC-D04'],
          explanation: 'd/dx(sin x) = cos x; d/dx(cos x) = −sin x; d/dx(tan x) = sec²x. These results require x to be in radians. Use the chain rule for d/dx(sin(f(x))) = cos(f(x))·f\'(x).',
        },
        {
          stageId: 'y11-adv-l8-s8d', code: '8D', title: 'Differentiating Exponential and Log Functions',
          outcomeIds: ['MA-CALC-D05', 'MA-CALC-D06'], topicIds: ['MA-CALC-D05', 'MA-CALC-D06'],
          explanation: 'd/dx(eˣ) = eˣ; d/dx(ln x) = 1/x. Chain rule extensions: d/dx(e^f(x)) = e^f(x)·f\'(x); d/dx(ln(f(x))) = f\'(x)/f(x). Recognise f\'(x)/f(x) for integration.',
        },
        {
          stageId: 'y11-adv-l8-s8e', code: '8E', title: 'The Product, Quotient and Chain Rules',
          outcomeIds: ['MA-CALC-D02', 'MA-CALC-D03'], topicIds: ['MA-CALC-D02', 'MA-CALC-D03'],
          explanation: 'Product: (uv)\' = u\'v + uv\'. Quotient: (u/v)\' = (u\'v − uv\')/v². Chain: [f(g(x))]\' = f\'(g(x))·g\'(x). Practice identifying which rule applies before differentiating.',
        },
      ],
    },
    // ── Chapter 9: Geometry of the Derivative ─────────────────────────────────
    {
      levelId: 'y11-adv-l9', levelNum: 9, title: 'Geometry of the Derivative', emoji: '📐', color: '#F97316',
      stages: [
        {
          stageId: 'y11-adv-l9-s9a', code: '9A', title: 'Increasing, Decreasing, and Stationary',
          outcomeIds: ['MA-CALC-D07'], topicIds: ['MA-CALC-D07'],
          explanation: 'f\'(x) > 0: increasing. f\'(x) < 0: decreasing. f\'(x) = 0: stationary point. Classify stationary points using a sign diagram (changes in sign of f\') or the second derivative test.',
        },
        {
          stageId: 'y11-adv-l9-s9b', code: '9B', title: 'Second Derivative and Concavity',
          outcomeIds: ['MA-CALC-D08'], topicIds: ['MA-CALC-D08'],
          explanation: 'f\'\'(x) > 0: concave up (smile). f\'\'(x) < 0: concave down (frown). A point of inflection is where concavity changes; f\'\'(x) = 0 is a necessary (not sufficient) condition.',
        },
        {
          stageId: 'y11-adv-l9-s9c', code: '9C', title: 'Curve Sketching',
          outcomeIds: ['MA-CALC-D08'], topicIds: ['MA-CALC-D08'],
          explanation: 'Full curve sketch: (1) domain, (2) intercepts, (3) stationary points, (4) nature of stationary points, (5) inflection points, (6) asymptotes, (7) behaviour as x → ±∞. Connect these features.',
        },
        {
          stageId: 'y11-adv-l9-s9d', code: '9D', title: 'Optimisation Problems',
          outcomeIds: ['MA-CALC-D09'], topicIds: ['MA-CALC-D09'],
          explanation: 'Define a variable, write an expression for the quantity to optimise, differentiate, set equal to zero, and test whether it is a max or min. Always check endpoints if the domain is restricted.',
        },
        {
          stageId: 'y11-adv-l9-s9e', code: '9E', title: 'Tangents and Normals',
          outcomeIds: ['MA-CALC-D07'], topicIds: ['MA-CALC-D07'],
          explanation: 'Tangent at (a, f(a)): gradient m = f\'(a); equation y − f(a) = m(x − a). Normal: gradient −1/f\'(a) (perpendicular). Find intersection of tangent/normal with other curves by simultaneous equations.',
        },
      ],
    },
    // ── Chapter 10: Integration ───────────────────────────────────────────────
    {
      levelId: 'y11-adv-l10', levelNum: 10, title: 'Integration', emoji: '∫', color: '#6366F1',
      stages: [
        {
          stageId: 'y11-adv-l10-s10a', code: '10A', title: 'Anti-differentiation and Indefinite Integrals',
          outcomeIds: ['MA-CALC-I01'], topicIds: ['MA-CALC-I01'],
          explanation: '∫f\'(x) dx = f(x) + C. Power rule: ∫xⁿ dx = xⁿ⁺¹/(n+1) + C (n ≠ −1). The constant C is called the constant of integration. Find C using an initial condition such as f(0) = 2.',
        },
        {
          stageId: 'y11-adv-l10-s10b', code: '10B', title: 'Definite Integrals and the Fundamental Theorem',
          outcomeIds: ['MA-CALC-I02'], topicIds: ['MA-CALC-I02'],
          explanation: '∫[a,b] f(x) dx = F(b) − F(a) where F is any antiderivative. This gives the signed area between y = f(x) and the x-axis from x = a to x = b. Negative area is below the axis.',
        },
        {
          stageId: 'y11-adv-l10-s10c', code: '10C', title: 'Areas Under and Between Curves',
          outcomeIds: ['MA-CALC-I07'], topicIds: ['MA-CALC-I07'],
          explanation: 'For area below the x-axis, take the absolute value: A = |∫f(x) dx|. For area between f and g: A = ∫[a,b] |f(x) − g(x)| dx. Find intersection points first to determine limits.',
        },
        {
          stageId: 'y11-adv-l10-s10d', code: '10D', title: 'Integrating Trig, Exponential and Log',
          outcomeIds: ['MA-CALC-I03', 'MA-CALC-I04'], topicIds: ['MA-CALC-I03', 'MA-CALC-I04'],
          explanation: '∫sin x dx = −cos x + C; ∫cos x dx = sin x + C; ∫eˣ dx = eˣ + C; ∫(1/x) dx = ln|x| + C. For ∫f\'(x)/f(x) dx = ln|f(x)| + C — a critical pattern to recognise.',
        },
      ],
    },
    // ── Chapter 11: Probability ───────────────────────────────────────────────
    {
      levelId: 'y11-adv-l11', levelNum: 11, title: 'Probability', emoji: '🎲', color: '#F59E0B',
      stages: [
        {
          stageId: 'y11-adv-l11-s11a', code: '11A', title: 'Probability and Venn Diagrams',
          outcomeIds: ['MA-PROB-01'], topicIds: ['MA-PROB-01'],
          explanation: 'P(A or B) = P(A) + P(B) − P(A and B). Venn diagrams partition a sample space. Complementary: P(not A) = 1 − P(A). Mutually exclusive events: P(A and B) = 0.',
        },
        {
          stageId: 'y11-adv-l11-s11b', code: '11B', title: 'Conditional Probability and Independence',
          outcomeIds: ['MA-PROB-02'], topicIds: ['MA-PROB-02'],
          explanation: 'P(A|B) = P(A and B)/P(B). A and B are independent if P(A and B) = P(A)·P(B), equivalently P(A|B) = P(A). Use two-way tables to calculate conditional probabilities efficiently.',
        },
        {
          stageId: 'y11-adv-l11-s11c', code: '11C', title: 'Counting Using Permutations and Combinations',
          outcomeIds: ['MA-PROB-01'], topicIds: ['MA-PROB-01'],
          explanation: 'Permutations (order matters): ⁿPᵣ = n!/(n−r)!. Combinations (order doesn\'t matter): ⁿCᵣ = n!/(r!(n−r)!). Identify which applies: "arrange" → permutation; "choose" → combination.',
        },
      ],
    },
    // ── Chapter 12: Discrete Probability Distributions ────────────────────────
    {
      levelId: 'y11-adv-l12', levelNum: 12, title: 'Statistical Analysis', emoji: '📊', color: '#10B981',
      stages: [
        {
          stageId: 'y11-adv-l12-s12a', code: '12A', title: 'Classifying and Displaying Data',
          outcomeIds: ['MA-STAT-01'], topicIds: ['MA-STAT-01'],
          explanation: 'Displays: histograms (continuous), dot plots, stem-and-leaf, box plots. Always label axes. Describe distributions by their shape (symmetric/skewed), centre, spread, and outliers.',
        },
        {
          stageId: 'y11-adv-l12-s12b', code: '12B', title: 'Discrete Probability Distributions',
          outcomeIds: ['MA-STAT-06'], topicIds: ['MA-STAT-06'],
          explanation: 'A probability distribution assigns P(X = x) to each value x. Requirements: all probabilities are non-negative and sum to 1. E(X) = Σ x·P(X = x) is the expected value (mean).',
        },
        {
          stageId: 'y11-adv-l12-s12c', code: '12C', title: 'Mean and Variance of a Distribution',
          outcomeIds: ['MA-STAT-06'], topicIds: ['MA-STAT-06'],
          explanation: 'E(X) = μ = Σ x·P(x). Var(X) = E(X²) − [E(X)]² = Σ x²P(x) − μ². Standard deviation = √Var(X). These measure the centre and spread of the distribution.',
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
        },
        {
          stageId: 'y11-ext1-l1-s1b', code: '1B', title: 'Factorising',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'Factorise by: (1) HCF, (2) difference of squares, (3) trinomials, (4) grouping, (5) sum/difference of cubes a³±b³=(a±b)(a²∓ab+b²). Always take the HCF before any other method.',
        },
        {
          stageId: 'y11-ext1-l1-s1c', code: '1C', title: 'Algebraic Fractions',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'Simplify by factorising then cancelling. Add/subtract with LCD. Multiply by cancelling common factors first. Divide by multiplying by the reciprocal. Factorise completely before cancelling.',
        },
        {
          stageId: 'y11-ext1-l1-s1d', code: '1D', title: 'Solving Linear and Quadratic Equations',
          outcomeIds: ['MA-ALG-03'], topicIds: ['MA-ALG-03'],
          explanation: 'Linear equations: isolate the variable using inverse operations. Quadratic: factorise, complete the square, or use x = (−b ± √Δ)/2a. Δ = b²−4ac determines the number of real solutions.',
        },
        {
          stageId: 'y11-ext1-l1-s1e', code: '1E', title: 'Solving Simultaneous Equations',
          outcomeIds: ['MA-ALG-03'], topicIds: ['MA-ALG-03'],
          explanation: 'Substitution or elimination for linear systems. For a line and a parabola, substitute the linear equation into the quadratic — the discriminant gives the number of intersections.',
        },
        {
          stageId: 'y11-ext1-l1-s1f', code: '1F', title: 'Completing the Square',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'ax²+bx+c = a(x+b/2a)²−(b²−4ac)/4a. This vertex form immediately gives vertex (−b/2a, −Δ/4a). Essential for graphing parabolas and will reappear in integration.',
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
        },
        {
          stageId: 'y11-ext1-l2-s2b', code: '2B', title: 'Surds and Their Arithmetic',
          outcomeIds: ['MA-ALG-08'], topicIds: ['MA-ALG-08'],
          explanation: '√(ab) = √a·√b. Simplify using the largest perfect-square factor: √72 = 6√2. Add like surds. Expand surd products using FOIL. Surds give exact answers — always preferred in exams.',
        },
        {
          stageId: 'y11-ext1-l2-s2c', code: '2C', title: 'Further Simplification of Surds',
          outcomeIds: ['MA-ALG-08'], topicIds: ['MA-ALG-08'],
          explanation: 'Expand and simplify expressions like (3+2√5)²=29+12√5. Use conjugate (a+√b)(a−√b)=a²−b to obtain rational results. Practice quickly identifying the conjugate.',
        },
        {
          stageId: 'y11-ext1-l2-s2d', code: '2D', title: 'Rationalising the Denominator',
          outcomeIds: ['MA-ALG-08'], topicIds: ['MA-ALG-08'],
          explanation: 'Multiply 1/√a by √a/√a. Multiply 1/(a+√b) by (a−√b)/(a−√b). For nested surds 1/(√a+√b) use conjugate (√a−√b). Final answer must have a rational denominator.',
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
        },
        {
          stageId: 'y11-ext1-l3-s3b', code: '3B', title: 'Functions, Relations, and Graphs',
          outcomeIds: ['MA-FUNC-02'], topicIds: ['MA-FUNC-02'],
          explanation: 'Key graphs: line, parabola (y=x²), cubic (y=x³), hyperbola (y=1/x), square root (y=√x), absolute value (y=|x|). For each: identify domain, range, intercepts, and key features.',
        },
        {
          stageId: 'y11-ext1-l3-s3c', code: '3C', title: 'Review of Linear Graphs',
          outcomeIds: ['MA-COORD-02'], topicIds: ['MA-COORD-02'],
          explanation: 'y = mx+b: m = gradient = rise/run, b = y-intercept. Find equation from two points. Parallel: equal gradients. Perpendicular: m₁m₂ = −1. Gradient of vertical line is undefined.',
        },
        {
          stageId: 'y11-ext1-l3-s3d', code: '3D', title: 'Quadratic Functions — Factoring and the Graph',
          outcomeIds: ['MA-ALG-02'], topicIds: ['MA-ALG-02'],
          explanation: 'y = a(x−p)(x−q): x-intercepts at p and q; axis of symmetry at x = (p+q)/2; vertex at the midpoint. Sign of a determines whether parabola opens up (a>0) or down (a<0).',
        },
        {
          stageId: 'y11-ext1-l3-s3e', code: '3E', title: 'Completing the Square and the Graph',
          outcomeIds: ['MA-ALG-02'], topicIds: ['MA-ALG-02'],
          explanation: 'Vertex form y = a(x−h)²+k: vertex (h,k), axis x = h. To convert: complete the square. The vertex is the minimum if a>0 (maximum if a<0).',
        },
        {
          stageId: 'y11-ext1-l3-s3f', code: '3F', title: 'The Quadratic Formula and the Discriminant',
          outcomeIds: ['MA-ALG-01', 'MA-ALG-02'], topicIds: ['MA-ALG-01', 'MA-ALG-02'],
          explanation: 'x = (−b ± √Δ)/2a where Δ = b²−4ac. Δ > 0: two real roots. Δ = 0: one (tangent to x-axis). Δ < 0: no real roots. Use Δ to determine conditions on parameters (e.g. find k so Δ > 0).',
        },
        {
          stageId: 'y11-ext1-l3-s3g', code: '3G', title: 'Powers, Cubics, and Circles',
          outcomeIds: ['MA-FUNC-07'], topicIds: ['MA-FUNC-07'],
          explanation: 'y = xⁿ: even n gives a U-shape (symmetric about y-axis); odd n gives an S-shape. Cubic y = x³ has a horizontal tangent at origin. Circle (x−h)²+(y−k)²=r²: complete the square to find centre and radius.',
        },
        {
          stageId: 'y11-ext1-l3-s3h', code: '3H', title: 'Two Graphs with Asymptotes',
          outcomeIds: ['MA-FUNC-07'], topicIds: ['MA-FUNC-07'],
          explanation: 'y = 1/x: asymptotes at x=0, y=0; branches in Q1 and Q3. y = 1/x²: asymptotes at x=0, y=0; both branches above x-axis (always positive). Transformations shift the asymptotes.',
        },
        {
          stageId: 'y11-ext1-l3-s3i', code: '3I', title: 'Direct and Inverse Variation',
          outcomeIds: ['MA-ALG-05'], topicIds: ['MA-ALG-05'],
          explanation: 'Direct variation: y = kx (or y = kxⁿ) — graph through origin. Inverse variation: y = k/x — hyperbola. Find k from a given data pair, then use the formula to answer questions.',
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
        },
        {
          stageId: 'y11-ext1-l4-s4b', code: '4B', title: 'Quadratic Equations and Inequations',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'To solve ax²+bx+c > 0 or < 0: find roots (where =0), then use a sign diagram to determine where the expression is positive or negative. Sketch the parabola to read off the solution.',
        },
        {
          stageId: 'y11-ext1-l4-s4c', code: '4C', title: 'The Discriminant',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'Δ = b²−4ac. Use Δ to prove equations have solutions, to find the number of intersections of a line and a parabola, or to find values of a parameter for which a quadratic has real/equal/no roots.',
        },
        {
          stageId: 'y11-ext1-l4-s4d', code: '4D', title: 'Quadratic Identities',
          outcomeIds: ['MA-ALG-01'], topicIds: ['MA-ALG-01'],
          explanation: 'A quadratic identity holds for ALL values of x. Equate coefficients of x², x, and the constant term to find unknown constants. Example: 2x²+5x+1 ≡ a(x+1)² + b(x+1) + c — find a, b, c.',
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
        },
        {
          stageId: 'y11-ext1-l5-s5b', code: '5B', title: 'Reflection in the y-axis and x-axis',
          outcomeIds: ['MA-FUNC-05'], topicIds: ['MA-FUNC-05'],
          explanation: 'y = f(−x): reflect in the y-axis (replace every x with −x). y = −f(x): reflect in the x-axis (negate all y-values). Apply to any graph by considering how the key features move.',
        },
        {
          stageId: 'y11-ext1-l5-s5c', code: '5C', title: 'Even and Odd Symmetry',
          outcomeIds: ['MA-FUNC-05'], topicIds: ['MA-FUNC-05'],
          explanation: 'Even: f(−x) = f(x) — symmetric about y-axis (e.g. y=x², y=cos x). Odd: f(−x) = −f(x) — symmetric about the origin (e.g. y=x³, y=sin x). Test by substituting −x.',
        },
        {
          stageId: 'y11-ext1-l5-s5d', code: '5D', title: 'Horizontal and Vertical Dilations',
          outcomeIds: ['MA-FUNC-05'], topicIds: ['MA-FUNC-05'],
          explanation: 'y = af(x): vertical dilation by factor |a|, reflects in x-axis if a<0. y = f(bx): horizontal dilation by factor 1/|b|, reflects in y-axis if b<0. These change the shape, not just the position.',
        },
        {
          stageId: 'y11-ext1-l5-s5e', code: '5E', title: 'The Absolute Value Function',
          outcomeIds: ['MA-FUNC-06'], topicIds: ['MA-FUNC-06'],
          explanation: 'y = |f(x)|: reflect the portions where f(x)<0 back above the x-axis. y = f(|x|): reflect the right half of the graph onto the left (ensuring even symmetry). Solve |ax+b|=c by two cases.',
        },
        {
          stageId: 'y11-ext1-l5-s5f', code: '5F', title: 'Composite Functions',
          outcomeIds: ['MA-FUNC-03'], topicIds: ['MA-FUNC-03'],
          explanation: '(f∘g)(x) = f(g(x)): apply g first, then f. Domain of f∘g: all x in domain of g such that g(x) is in domain of f. Note: f∘g ≠ g∘f in general. Specify domain and range for each composite.',
        },
        {
          stageId: 'y11-ext1-l5-s5g', code: '5G', title: 'Combining Transformations',
          outcomeIds: ['MA-FUNC-05'], topicIds: ['MA-FUNC-05'],
          explanation: 'Apply transformations in the correct order from the inside out: (1) horizontal dilation/reflection, (2) horizontal translation, (3) vertical dilation/reflection, (4) vertical translation.',
        },
        {
          stageId: 'y11-ext1-l5-s5h', code: '5H', title: 'Continuity and Piecewise-Defined Functions',
          outcomeIds: ['MA-FUNC-07'], topicIds: ['MA-FUNC-07'],
          explanation: 'A piecewise function uses different rules on different intervals. Check continuity at boundaries: is the left-hand limit equal to the right-hand limit and the function value? Sketch each piece separately.',
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
        },
        {
          stageId: 'y11-ext1-l6-s6b', code: '6B', title: 'The Sign of a Function',
          outcomeIds: ['MA-FUNC-07'], topicIds: ['MA-FUNC-07'],
          explanation: 'A sign diagram shows where a function is positive, negative, or zero. Factorise fully, mark the zeros and vertical asymptotes on a number line, then test a value in each interval.',
        },
        {
          stageId: 'y11-ext1-l6-s6c', code: '6C', title: 'Sketching Reciprocal Functions',
          outcomeIds: ['MA-FUNC-07'], topicIds: ['MA-FUNC-07'],
          explanation: 'To sketch y = 1/f(x): zeros of f become vertical asymptotes; where f is large, 1/f is small; where f is small and positive, 1/f is large. Sign of 1/f matches sign of f. Sketch f first, then take reciprocal.',
        },
        {
          stageId: 'y11-ext1-l6-s6d', code: '6D', title: 'Sketching Sums and Differences',
          outcomeIds: ['MA-FUNC-07'], topicIds: ['MA-FUNC-07'],
          explanation: 'To sketch y = f(x)+g(x): add the y-values of f and g at each x. Key technique: wherever f or g is zero, the sum equals the other function alone. Add ordinates at many x-values and join smoothly.',
        },
        {
          stageId: 'y11-ext1-l6-s6e', code: '6E', title: 'Modifying Functions Using Absolute Value',
          outcomeIds: ['MA-FUNC-06'], topicIds: ['MA-FUNC-06'],
          explanation: 'y = |f(x)|: keep positive parts, reflect negative parts above x-axis. y = f(|x|): draw the right half (x≥0), then reflect it in the y-axis. These produce graphs with V-shaped features.',
        },
        {
          stageId: 'y11-ext1-l6-s6f', code: '6F', title: 'Inverse Relations and Functions',
          outcomeIds: ['MA-FUNC-04'], topicIds: ['MA-FUNC-04'],
          explanation: 'The inverse relation of y=f(x) is obtained by swapping x and y. It is a function only if f is one-to-one (horizontal line test). Graphically, the inverse is the reflection in y=x.',
        },
        {
          stageId: 'y11-ext1-l6-s6g', code: '6G', title: 'Inverse Function Notation',
          outcomeIds: ['MA-FUNC-04'], topicIds: ['MA-FUNC-04'],
          explanation: 'If f is one-to-one, its inverse f⁻¹ satisfies f⁻¹(f(x)) = x and f(f⁻¹(y)) = y. To find f⁻¹: write y=f(x), swap x and y, rearrange for y. State the domain and range of f⁻¹.',
        },
        {
          stageId: 'y11-ext1-l6-s6h', code: '6H', title: 'Defining Functions Parametrically',
          outcomeIds: ['MA-FUNC-07'], topicIds: ['MA-FUNC-07'],
          explanation: 'Parametric equations express x and y as functions of a parameter t: x=f(t), y=g(t). Eliminate t to find the Cartesian equation. Identify the range of t to determine which part of the curve is traced.',
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
        },
        {
          stageId: 'y11-ext1-l7-s7b', code: '7B', title: 'Radian Measure',
          outcomeIds: ['MA-TRIG-09'], topicIds: ['MA-TRIG-09'],
          explanation: 'π rad = 180°. Convert by multiplying: degrees → radians: ×π/180; radians → degrees: ×180/π. Arc length l = rθ; sector area A = ½r²θ. Radians are required for all calculus of trig functions.',
        },
        {
          stageId: 'y11-ext1-l7-s7c', code: '7C', title: 'Trigonometric Functions of Any Angle',
          outcomeIds: ['MA-TRIG-01'], topicIds: ['MA-TRIG-01'],
          explanation: 'Extend trig to all angles using the unit circle. sin(180°−θ)=sinθ, cos(180°−θ)=−cosθ. Related angles: sin(−θ)=−sinθ (odd), cos(−θ)=cosθ (even). Use ASTC and reference angles.',
        },
        {
          stageId: 'y11-ext1-l7-s7d', code: '7D', title: 'The Sine Rule and Its Ambiguous Case',
          outcomeIds: ['MA-TRIG-07'], topicIds: ['MA-TRIG-07'],
          explanation: 'a/sinA = b/sinB = c/sinC. Ambiguous case (SSA): when using sine rule to find an angle, there may be two triangles (both θ and 180°−θ are valid). Always check whether both solutions fit the given information.',
        },
        {
          stageId: 'y11-ext1-l7-s7e', code: '7E', title: 'The Cosine Rule and Area Formula',
          outcomeIds: ['MA-TRIG-07'], topicIds: ['MA-TRIG-07'],
          explanation: 'Cosine rule: a²=b²+c²−2bc cosA; rearranged: cosA=(b²+c²−a²)/2bc. Area = ½ab sinC. Use cosine rule for SAS or SSS; sine rule when you have an angle-side pair.',
        },
        {
          stageId: 'y11-ext1-l7-s7f', code: '7F', title: 'Problems in Three Dimensions',
          outcomeIds: ['MA-TRIG-08'], topicIds: ['MA-TRIG-08'],
          explanation: 'Identify the right-angled and oblique triangles within the 3D figure. Draw and label separate 2D diagrams for each triangle. Solve systematically, passing answers from one triangle to the next.',
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
        },
        {
          stageId: 'y11-ext1-l8-s8b', code: '8B', title: 'Transformations of Trig Graphs',
          outcomeIds: ['MA-TRIG-02'], topicIds: ['MA-TRIG-02'],
          explanation: 'y = a sin(bx+c)+d: amplitude |a|, period 2π/|b|, phase shift −c/b, vertical shift d. Apply transformations methodically: dilation, then shift. Identify all parameters from the equation.',
        },
        {
          stageId: 'y11-ext1-l8-s8c', code: '8C', title: 'Inverse Trigonometric Functions',
          outcomeIds: ['MA-TRIG-05'], topicIds: ['MA-TRIG-05'],
          explanation: 'sin⁻¹x: domain [−1,1], range [−π/2, π/2]. cos⁻¹x: domain [−1,1], range [0,π]. tan⁻¹x: domain ℝ, range (−π/2, π/2). Restricted domains make each inverse a true function.',
        },
        {
          stageId: 'y11-ext1-l8-s8d', code: '8D', title: 'Solving Trigonometric Equations',
          outcomeIds: ['MA-TRIG-04'], topicIds: ['MA-TRIG-04'],
          explanation: 'Find all solutions in a given domain. Use inverse trig for the principal value, then apply symmetry of the unit circle (ASTC) to find all others. For compound angles, adjust the domain first.',
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
        },
        {
          stageId: 'y11-ext1-l9-s9b', code: '9B', title: 'Differentiating Powers of x',
          outcomeIds: ['MA-CALC-D01'], topicIds: ['MA-CALC-D01'],
          explanation: 'd/dx(xⁿ) = nxⁿ⁻¹ for any rational n. Sum and constant multiple rules apply. Write expressions with negative and fractional indices before differentiating: √x = x^(1/2), 1/x = x⁻¹.',
        },
        {
          stageId: 'y11-ext1-l9-s9c', code: '9C', title: 'Differentiating Trig, Exp and Log Functions',
          outcomeIds: ['MA-CALC-D04', 'MA-CALC-D05', 'MA-CALC-D06'], topicIds: ['MA-CALC-D04', 'MA-CALC-D05', 'MA-CALC-D06'],
          explanation: 'd/dx(sin x)=cos x; d/dx(cos x)=−sin x; d/dx(tan x)=sec²x; d/dx(eˣ)=eˣ; d/dx(ln x)=1/x. All require x in radians. Memorise these and extend with the chain rule.',
        },
        {
          stageId: 'y11-ext1-l9-s9d', code: '9D', title: 'The Product and Quotient Rules',
          outcomeIds: ['MA-CALC-D02'], topicIds: ['MA-CALC-D02'],
          explanation: 'Product: (uv)\'=u\'v+uv\'. Quotient: (u/v)\'=(u\'v−uv\')/v². Identify u and v clearly before applying. Product rule often easier than quotient — rewrite a/b as a·b⁻¹ if convenient.',
        },
        {
          stageId: 'y11-ext1-l9-s9e', code: '9E', title: 'The Chain Rule',
          outcomeIds: ['MA-CALC-D03'], topicIds: ['MA-CALC-D03'],
          explanation: 'd/dx[f(g(x))] = f\'(g(x))·g\'(x). Identify outer and inner functions. Differentiate outer (leave inner unchanged), then multiply by derivative of inner. Essential for composite functions.',
        },
        {
          stageId: 'y11-ext1-l9-s9f', code: '9F', title: 'Rates of Change',
          outcomeIds: ['MA-CALC-D07'], topicIds: ['MA-CALC-D07'],
          explanation: 'The derivative dy/dx gives the instantaneous rate of change of y with respect to x. Interpret in context: velocity = dx/dt, acceleration = dv/dt. Use units in all answers.',
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
          explanation: 'f\'(x) > 0: increasing. f\'(x) < 0: decreasing. f\'(x) = 0: stationary. Types of stationary points: local max, local min, or horizontal point of inflection. Use a sign diagram of f\'(x) to classify.',
        },
        {
          stageId: 'y11-ext1-l10-s10b', code: '10B', title: 'Second Derivative, Concavity, and Points of Inflection',
          outcomeIds: ['MA-CALC-D08'], topicIds: ['MA-CALC-D08'],
          explanation: 'f\'\'(x) > 0: concave up. f\'\'(x) < 0: concave down. Inflection point: concavity changes (f\'\'=0 is necessary but not sufficient — test the sign change). Second derivative test for stationary points.',
        },
        {
          stageId: 'y11-ext1-l10-s10c', code: '10C', title: 'Curve Sketching Using the Derivative',
          outcomeIds: ['MA-CALC-D08'], topicIds: ['MA-CALC-D08'],
          explanation: 'Full sketch procedure: domain, intercepts, stationary points (f\'=0), nature (sign diagram of f\'), inflections (f\'\'=0, test sign change), asymptotes, end behaviour. Combine all features.',
        },
        {
          stageId: 'y11-ext1-l10-s10d', code: '10D', title: 'Optimisation Problems',
          outcomeIds: ['MA-CALC-D09'], topicIds: ['MA-CALC-D09'],
          explanation: 'Model the problem: define the variable, write a formula for the quantity to optimise, differentiate, solve f\'=0. Verify it is a max or min using the second derivative or sign diagram. Check endpoints.',
        },
        {
          stageId: 'y11-ext1-l10-s10e', code: '10E', title: 'Tangents, Normals, and Related Rates',
          outcomeIds: ['MA-CALC-D07'], topicIds: ['MA-CALC-D07'],
          explanation: 'Tangent at (a, f(a)): m = f\'(a). Normal: m = −1/f\'(a). Related rates: use the chain rule dy/dt = (dy/dx)·(dx/dt) to link rates of change. Label all variables and their rates clearly.',
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
        },
        {
          stageId: 'y11-ext1-l11-s11b', code: '11B', title: 'Definite Integrals and Area',
          outcomeIds: ['MA-CALC-I02'], topicIds: ['MA-CALC-I02'],
          explanation: '∫[a,b] f(x) dx = F(b) − F(a). Signed area: negative below x-axis. For total (unsigned) area: split at roots and take absolute values. ∫[a,a] f dx = 0; ∫[b,a] = −∫[a,b].',
        },
        {
          stageId: 'y11-ext1-l11-s11c', code: '11C', title: 'Areas Between Curves',
          outcomeIds: ['MA-CALC-I07'], topicIds: ['MA-CALC-I07'],
          explanation: 'Area between y=f(x) and y=g(x) from a to b: ∫[a,b] |f(x)−g(x)| dx. Find intersection points first (these are the limits). If the curves cross in the interval, split the integral at that point.',
        },
        {
          stageId: 'y11-ext1-l11-s11d', code: '11D', title: 'Integration by Substitution',
          outcomeIds: ['MA-CALC-I05'], topicIds: ['MA-CALC-I05'],
          explanation: 'Let u = g(x), then du = g\'(x)dx. Rewrite ∫f(g(x))g\'(x)dx = ∫f(u)du. For definite integrals, change the limits using u = g(x). Recognise the pattern: the integrand contains g\'(x) as a factor.',
        },
      ],
    },
    // ── Chapter 12: Combinatorics ─────────────────────────────────────────────
    {
      levelId: 'y11-ext1-l12', levelNum: 12, title: 'Combinatorics', emoji: '🎯', color: '#F59E0B',
      stages: [
        {
          stageId: 'y11-ext1-l12-s12a', code: '12A', title: 'Counting Using Multiplication and Addition',
          outcomeIds: ['MA-PROB-03'], topicIds: ['MA-PROB-03'],
          explanation: 'Multiplication principle: if task 1 has m ways and task 2 has n ways, together they have m×n ways. Addition principle: if events are mutually exclusive, add the counts. Use for basic counting problems.',
        },
        {
          stageId: 'y11-ext1-l12-s12b', code: '12B', title: 'Permutations',
          outcomeIds: ['MA-PROB-03'], topicIds: ['MA-PROB-03'],
          explanation: 'A permutation is an ordered arrangement. ⁿPᵣ = n!/(n−r)! ways to choose r objects from n in order. Special case: n! arrangements of n distinct objects. n! = n × (n−1) × … × 2 × 1.',
        },
        {
          stageId: 'y11-ext1-l12-s12c', code: '12C', title: 'Permutations with Restrictions',
          outcomeIds: ['MA-PROB-03'], topicIds: ['MA-PROB-03'],
          explanation: 'Restrictions: (1) fix certain objects in place first, then arrange the rest; (2) treat objects that must be adjacent as a single unit; (3) subtract arrangements that violate the condition from total.',
        },
        {
          stageId: 'y11-ext1-l12-s12d', code: '12D', title: 'Combinations',
          outcomeIds: ['MA-PROB-03'], topicIds: ['MA-PROB-03'],
          explanation: 'ⁿCᵣ = n!/(r!(n−r)!) counts selections of r from n when order doesn\'t matter. Key identity: ⁿCᵣ = ⁿC(n−r). "Choose" problems use combinations; "arrange" problems use permutations.',
        },
        {
          stageId: 'y11-ext1-l12-s12e', code: '12E', title: 'Combinations with Restrictions and Applications',
          outcomeIds: ['MA-PROB-03'], topicIds: ['MA-PROB-03'],
          explanation: 'Include/exclude restrictions: (1) fix required objects, choose the rest; (2) subtract cases with excluded objects from total. Probability = (favourable combinations)/(total combinations).',
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
    // ── Chapter 3: Trigonometric Functions ────────────────────────────────────
    {
      levelId: 'y12-adv-l3', levelNum: 3, title: 'Trigonometric Functions', emoji: '〜', color: '#0EA5E9',
      stages: [
        {
          stageId: 'y12-adv-l3-s3a', code: '3A', title: 'Pythagorean and Compound Angle Identities',
          outcomeIds: ['MA-TRIG-03'], topicIds: ['MA-TRIG-03'],
          explanation: 'Pythagorean: sin²x+cos²x=1; 1+tan²x=sec²x; 1+cot²x=cosec²x. Compound: sin(A±B)=sinA cosB±cosA sinB; cos(A±B)=cosA cosB∓sinA sinB. Use to simplify and prove identities.',
        },
        {
          stageId: 'y12-adv-l3-s3b', code: '3B', title: 'Double Angle Formulae',
          outcomeIds: ['MA-TRIG-03'], topicIds: ['MA-TRIG-03'],
          explanation: 'sin 2A = 2 sinA cosA. cos 2A = cos²A−sin²A = 2cos²A−1 = 1−2sin²A. tan 2A = 2tanA/(1−tan²A). Use double angle results to integrate trig squares: ∫sin²x dx using cos2x identity.',
        },
        {
          stageId: 'y12-adv-l3-s3c', code: '3C', title: 'Solving Trigonometric Equations',
          outcomeIds: ['MA-TRIG-04'], topicIds: ['MA-TRIG-04'],
          explanation: 'Use identities to reduce all trig in an equation to one function. Find the principal value using inverse trig. Apply symmetry of unit circle (ASTC) to find all solutions in the domain. Always work in radians.',
        },
        {
          stageId: 'y12-adv-l3-s3d', code: '3D', title: 'Auxiliary Angle Method',
          outcomeIds: ['MA-TRIG-04'], topicIds: ['MA-TRIG-04'],
          explanation: 'a sinx + b cosx = R sin(x+α) where R=√(a²+b²) and tanα=b/a. This converts a sum of trig functions to a single sinusoidal — useful for finding maximum values and solving equations.',
        },
      ],
    },
    // ── Chapter 4: Differentiation ────────────────────────────────────────────
    {
      levelId: 'y12-adv-l4', levelNum: 4, title: 'Differentiation', emoji: '∂', color: '#EC4899',
      stages: [
        {
          stageId: 'y12-adv-l4-s4a', code: '4A', title: 'Differentiating Trig, Exp, and Log Functions',
          outcomeIds: ['MA-CALC-D04', 'MA-CALC-D05', 'MA-CALC-D06'], topicIds: ['MA-CALC-D04', 'MA-CALC-D05', 'MA-CALC-D06'],
          explanation: 'd/dx(sinx)=cosx; d/dx(cosx)=−sinx; d/dx(tanx)=sec²x; d/dx(eˣ)=eˣ; d/dx(ln x)=1/x. With chain rule: d/dx(sin(f(x)))=cos(f(x))·f\'(x). These are the most tested derivatives in HSC.',
        },
        {
          stageId: 'y12-adv-l4-s4b', code: '4B', title: 'Curve Sketching Using Calculus',
          outcomeIds: ['MA-CALC-D08'], topicIds: ['MA-CALC-D08'],
          explanation: 'Systematic sketch: domain, intercepts, asymptotes, stationary points (f\'=0, sign diagram), inflections (f\'\'=0, sign change in f\'\'). Combine all features. The sketch should be consistent with all information found.',
        },
        {
          stageId: 'y12-adv-l4-s4c', code: '4C', title: 'Optimisation Problems',
          outcomeIds: ['MA-CALC-D09'], topicIds: ['MA-CALC-D09'],
          explanation: 'Model → differentiate → solve f\'=0 → test (second derivative or sign diagram) → check endpoints. Write a sentence answering the question in context. Draw a diagram if geometry is involved.',
        },
        {
          stageId: 'y12-adv-l4-s4d', code: '4D', title: 'Rates of Change and Related Rates',
          outcomeIds: ['MA-CALC-D07'], topicIds: ['MA-CALC-D07'],
          explanation: 'dy/dt = (dy/dx)·(dx/dt) — chain rule for related rates. Label every variable and rate with units. Kinematics: position x, velocity v=dx/dt, acceleration a=dv/dt=v(dv/dx).',
        },
      ],
    },
    // ── Chapter 5: Integration ────────────────────────────────────────────────
    {
      levelId: 'y12-adv-l5', levelNum: 5, title: 'Integration', emoji: '∫', color: '#10B981',
      stages: [
        {
          stageId: 'y12-adv-l5-s5a', code: '5A', title: 'Integrating Trig, Exponential, and Log Functions',
          outcomeIds: ['MA-CALC-I03', 'MA-CALC-I04'], topicIds: ['MA-CALC-I03', 'MA-CALC-I04'],
          explanation: '∫sinx dx=−cosx+C; ∫cosx dx=sinx+C; ∫sec²x dx=tanx+C; ∫eˣ dx=eˣ+C; ∫(1/x)dx=ln|x|+C. For ∫f\'(x)/f(x) dx=ln|f(x)|+C. Use double-angle formulas to integrate sin²x and cos²x.',
        },
        {
          stageId: 'y12-adv-l5-s5b', code: '5B', title: 'Integration by Substitution',
          outcomeIds: ['MA-CALC-I05'], topicIds: ['MA-CALC-I05'],
          explanation: 'Let u=g(x), du=g\'(x)dx. Rewrite the integral in terms of u alone, integrate, then back-substitute. For definite integrals, convert limits using u=g(a) and u=g(b).',
        },
        {
          stageId: 'y12-adv-l5-s5c', code: '5C', title: 'Area Under and Between Curves',
          outcomeIds: ['MA-CALC-I07'], topicIds: ['MA-CALC-I07'],
          explanation: 'Signed area: ∫[a,b] f(x) dx. Total area: integrate |f(x)|, splitting at x-intercepts. Area between curves: ∫[a,b] (f(x)−g(x)) dx, where a and b are intersection points.',
        },
        {
          stageId: 'y12-adv-l5-s5d', code: '5D', title: 'Volumes of Solids of Revolution',
          outcomeIds: ['MA-CALC-I08'], topicIds: ['MA-CALC-I08'],
          explanation: 'Volume rotating y=f(x) about x-axis: V = π∫[a,b] [f(x)]² dx. About y-axis: V = π∫[c,d] [g(y)]² dy (rewrite x as a function of y). Find the integration limits from the geometry.',
        },
      ],
    },
    // ── Chapter 6: The Exponential Function ───────────────────────────────────
    {
      levelId: 'y12-adv-l6', levelNum: 6, title: 'Exponential and Log Functions', emoji: '📈', color: '#F59E0B',
      stages: [
        {
          stageId: 'y12-adv-l6-s6a', code: '6A', title: 'The Exponential Function y = eˣ',
          outcomeIds: ['MA-EXP-01', 'MA-EXP-02'], topicIds: ['MA-EXP-01', 'MA-EXP-02'],
          explanation: 'y=eˣ is the unique function equal to its own derivative. Sketch and apply transformations. Exponential growth: y=Aeᵏᵗ (k>0); decay: y=Ae⁻ᵏᵗ (k>0). The rate of change is proportional to the current value.',
        },
        {
          stageId: 'y12-adv-l6-s6b', code: '6B', title: 'The Logarithmic Function y = ln x',
          outcomeIds: ['MA-EXP-03', 'MA-EXP-04'], topicIds: ['MA-EXP-03', 'MA-EXP-04'],
          explanation: 'y=ln x: domain x>0, range ℝ, x-intercept at x=1, vertical asymptote x=0. Laws: ln(AB)=lnA+lnB; ln(A/B)=lnA−lnB; ln(Aⁿ)=n lnA. Differentiate and integrate using chain rule.',
        },
        {
          stageId: 'y12-adv-l6-s6c', code: '6C', title: 'Applications of Exponential Growth and Decay',
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
