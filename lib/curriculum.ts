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

// ── YEAR 9 (NSW Stage 5 Core — NESA 2022 K-10 Syllabus) ──────────────────────
const YEAR_9_MISSION: Mission = {
  missionId: 'y9',
  title: 'Year 9 Mathematics',
  year: 9,
  course: 'all',
  shortLabel: 'Yr 9',
  levels: [
    // ── Level 1: Financial Mathematics ──────────────────────────────────────
    {
      levelId: 'y9-l1', levelNum: 1, title: 'Financial Mathematics', emoji: '💰', color: '#10B981',
      stages: [
        {
          stageId: 'y9-l1-s1', code: '1A', title: 'Earning Money',
          outcomeIds: ['MA5-FIN-C-01'], topicIds: ['MA5-FIN-C-01'],
          explanation: 'Calculate wages (hourly rate × hours), salaries, overtime rates, commission, and piecework pay. Understand PAYG (Pay As You Go) income tax: gross income minus tax deductions gives net (take-home) pay.',
        },
        {
          stageId: 'y9-l1-s2', code: '1B', title: 'Simple Interest and Spending',
          outcomeIds: ['MA5-FIN-C-01'], topicIds: ['MA5-FIN-C-01'],
          explanation: 'Simple interest: I = Prt where P is principal, r is annual rate (as decimal), t is time in years. Total amount A = P + I. Also solve problems involving discounts, GST, and best-buy comparisons.',
        },
      ],
    },
    // ── Level 2: Numbers of Any Magnitude ───────────────────────────────────
    {
      levelId: 'y9-l2', levelNum: 2, title: 'Numbers of Any Magnitude', emoji: '🔢', color: '#F59E0B',
      stages: [
        {
          stageId: 'y9-l2-s1', code: '2A', title: 'Scientific Notation',
          outcomeIds: ['MA5-MAG-C-01'], topicIds: ['MA5-MAG-C-01'],
          explanation: 'Express very large and very small numbers in scientific notation: a × 10ⁿ where 1 ≤ a < 10. Large: 4 500 000 = 4.5 × 10⁶. Small: 0.000032 = 3.2 × 10⁻⁵. Use index laws to multiply and divide.',
        },
        {
          stageId: 'y9-l2-s2', code: '2B', title: 'Significant Figures and Error',
          outcomeIds: ['MA5-MAG-C-01'], topicIds: ['MA5-MAG-C-01'],
          explanation: 'Round numbers to a specified number of significant figures. Absolute error = |measured − true|. Percentage error = (absolute error / true value) × 100%. Understand limits of accuracy in measurement.',
        },
      ],
    },
    // ── Level 3: Algebra & Indices ───────────────────────────────────────────
    {
      levelId: 'y9-l3', levelNum: 3, title: 'Algebra & Indices', emoji: '✏️', color: '#6366F1',
      stages: [
        {
          stageId: 'y9-l3-s1', code: '3A', title: 'Algebraic Techniques A',
          outcomeIds: ['MA5-ALG-C-01'], topicIds: ['MA5-ALG-C-01'],
          explanation: 'Simplify algebraic fractions with numerical denominators by finding the LCD and cancelling common factors. Expand algebraic expressions including products with two or more terms.',
        },
        {
          stageId: 'y9-l3-s2', code: '3B', title: 'Indices A',
          outcomeIds: ['MA5-IND-C-01'], topicIds: ['MA5-IND-C-01'],
          explanation: 'Apply index laws to algebraic expressions: aᵐ × aⁿ = aᵐ⁺ⁿ, aᵐ ÷ aⁿ = aᵐ⁻ⁿ, (aᵐ)ⁿ = aᵐⁿ, a⁰ = 1. Simplify expressions with negative-integer indices: a⁻ⁿ = 1/aⁿ.',
        },
      ],
    },
    // ── Level 4: Equations ───────────────────────────────────────────────────
    {
      levelId: 'y9-l4', levelNum: 4, title: 'Equations', emoji: '⚖️', color: '#8B5CF6',
      stages: [
        {
          stageId: 'y9-l4-s1', code: '4A', title: 'Equations A',
          outcomeIds: ['MA5-EQU-C-01'], topicIds: ['MA5-EQU-C-01'],
          explanation: 'Solve linear equations of up to 3 steps by performing inverse operations on both sides. Includes equations with brackets, like terms, and one algebraic fraction. Always check by substituting back.',
        },
      ],
    },
    // ── Level 5: Linear Relationships ────────────────────────────────────────
    {
      levelId: 'y9-l5', levelNum: 5, title: 'Linear Relationships', emoji: '📉', color: '#EC4899',
      stages: [
        {
          stageId: 'y9-l5-s1', code: '5A', title: 'Linear Relationships A',
          outcomeIds: ['MA5-LIN-C-01'], topicIds: ['MA5-LIN-C-01'],
          explanation: 'Find distance between 2 points using d = √((x₂−x₁)² + (y₂−y₁)²). Find midpoint M = ((x₁+x₂)/2, (y₁+y₂)/2). Calculate gradient m = (y₂−y₁)/(x₂−x₁). Graph linear equations on the Cartesian plane.',
        },
        {
          stageId: 'y9-l5-s2', code: '5B', title: 'Linear Relationships B',
          outcomeIds: ['MA5-LIN-C-02'], topicIds: ['MA5-LIN-C-02'],
          explanation: 'Graph and interpret y = mx + b: m is gradient, b is y-intercept. Identify and use the gradient–intercept form to write equations of lines. Recognise and find equations of parallel lines (equal m) and perpendicular lines (m₁ × m₂ = −1).',
        },
      ],
    },
    // ── Level 6: Non-Linear Relationships ────────────────────────────────────
    {
      levelId: 'y9-l6', levelNum: 6, title: 'Non-Linear Relationships', emoji: '📈', color: '#F97316',
      stages: [
        {
          stageId: 'y9-l6-s1', code: '6A', title: 'Non-Linear Relationships A',
          outcomeIds: ['MA5-NLI-C-01'], topicIds: ['MA5-NLI-C-01'],
          explanation: 'Identify connections between algebraic and graphical forms of quadratic (y = ax²+bx+c) and exponential (y = aˣ) relationships. Recognise key features: turning points, intercepts, asymptotes.',
        },
        {
          stageId: 'y9-l6-s2', code: '6B', title: 'Non-Linear Relationships B',
          outcomeIds: ['MA5-NLI-C-02'], topicIds: ['MA5-NLI-C-02'],
          explanation: 'Graph and compare parabolas y = ax²+bx+c (vertex, axis of symmetry, intercepts) and exponential curves y = aˣ (growth a>1, decay 0<a<1, asymptote y=0). Describe transformations and features.',
        },
      ],
    },
    // ── Level 7: Measurement ─────────────────────────────────────────────────
    {
      levelId: 'y9-l7', levelNum: 7, title: 'Measurement', emoji: '📏', color: '#0EA5E9',
      stages: [
        {
          stageId: 'y9-l7-s1', code: '7A', title: 'Area and Surface Area A',
          outcomeIds: ['MA5-ARE-C-01'], topicIds: ['MA5-ARE-C-01'],
          explanation: 'Solve problems involving areas of composite shapes (triangles, quadrilaterals, circles, sectors). Find surface areas of right prisms and cylinders. SA of cylinder = 2πr² + 2πrh.',
        },
        {
          stageId: 'y9-l7-s2', code: '7B', title: 'Volume A',
          outcomeIds: ['MA5-VOL-C-01'], topicIds: ['MA5-VOL-C-01'],
          explanation: 'Solve problems involving volumes of composite solids built from right prisms and cylinders. Volume of prism = base area × height. Volume of cylinder = πr²h. Convert between cubic units.',
        },
      ],
    },
    // ── Level 8: Trigonometry ─────────────────────────────────────────────────
    {
      levelId: 'y9-l8', levelNum: 8, title: 'Trigonometry', emoji: '📐', color: '#14B8A6',
      stages: [
        {
          stageId: 'y9-l8-s1', code: '8A', title: 'Trigonometry A',
          outcomeIds: ['MA5-TRG-C-01'], topicIds: ['MA5-TRG-C-01'],
          explanation: 'Apply trigonometric ratios (SOH CAH TOA) to find unknown sides and angles in right-angled triangles. sin θ = O/H, cos θ = A/H, tan θ = O/A. Use inverse functions to find angles. Round at the final step.',
        },
        {
          stageId: 'y9-l8-s2', code: '8B', title: 'Trigonometry B',
          outcomeIds: ['MA5-TRG-C-02'], topicIds: ['MA5-TRG-C-02'],
          explanation: 'Apply trigonometry to solve problems involving angles of elevation and depression, and bearings. Bearings are measured clockwise from North (000°–360°). Draw clear diagrams labelling the right-angled triangle.',
        },
      ],
    },
    // ── Level 9: Geometry ─────────────────────────────────────────────────────
    {
      levelId: 'y9-l9', levelNum: 9, title: 'Geometry', emoji: '🔷', color: '#6366F1',
      stages: [
        {
          stageId: 'y9-l9-s1', code: '9A', title: 'Properties of Geometrical Figures A',
          outcomeIds: ['MA5-GEO-C-01'], topicIds: ['MA5-GEO-C-01'],
          explanation: 'Identify and apply properties of similar figures: corresponding angles are equal, corresponding sides are in the same ratio (scale factor k). Solve problems using ratios and scale factors. Area scales by k², volume by k³.',
        },
      ],
    },
    // ── Level 10: Statistics & Probability ───────────────────────────────────
    {
      levelId: 'y9-l10', levelNum: 10, title: 'Statistics & Probability', emoji: '📊', color: '#8B5CF6',
      stages: [
        {
          stageId: 'y9-l10-s1', code: '10A', title: 'Data Analysis A',
          outcomeIds: ['MA5-DAT-C-01'], topicIds: ['MA5-DAT-C-01'],
          explanation: 'Calculate and interpret standard deviation as a measure of spread. Find quartiles Q1, Q3, and IQR = Q3 − Q1. Represent datasets using box plots and use them to compare distributions (centre, spread, shape, outliers).',
        },
        {
          stageId: 'y9-l10-s2', code: '10B', title: 'Data Analysis B',
          outcomeIds: ['MA5-DAT-C-02'], topicIds: ['MA5-DAT-C-02'],
          explanation: 'Identify and classify datasets involving two variables (bivariate data). Construct and interpret scatterplots. Describe the direction (positive/negative), strength, and form of the relationship. Correlation ≠ causation.',
        },
        {
          stageId: 'y9-l10-s3', code: '10C', title: 'Probability A',
          outcomeIds: ['MA5-PRO-C-01'], topicIds: ['MA5-PRO-C-01'],
          explanation: 'Solve problems using tree diagrams and tables for multistage chance experiments, with and without replacement. For independent events: P(A and B) = P(A) × P(B). Use simulations to estimate probabilities.',
        },
      ],
    },
  ],
}

// ── YEAR 10 (NSW Stage 5 Path — NESA 2022 K-10 Syllabus) ─────────────────────
const YEAR_10_MISSION: Mission = {
  missionId: 'y10',
  title: 'Year 10 Mathematics',
  year: 10,
  course: 'all',
  shortLabel: 'Yr 10',
  levels: [
    // ── Level 1: Financial Mathematics ──────────────────────────────────────
    {
      levelId: 'y10-l1', levelNum: 1, title: 'Financial Mathematics', emoji: '💰', color: '#10B981',
      stages: [
        {
          stageId: 'y10-l1-s1', code: '1A', title: 'Compound Interest and Depreciation',
          outcomeIds: ['MA5-FIN-C-02'], topicIds: ['MA5-FIN-C-02'],
          explanation: 'Compound interest: A = P(1 + r)ⁿ where r is rate per period and n is number of periods. Depreciation (reducing balance): V = P(1 − r)ⁿ. Adjust r and n for different compounding frequencies. Compare with simple interest.',
        },
      ],
    },
    // ── Level 2: Algebra — Path ──────────────────────────────────────────────
    {
      levelId: 'y10-l2', levelNum: 2, title: 'Algebra', emoji: '✏️', color: '#6366F1',
      stages: [
        {
          stageId: 'y10-l2-s1', code: '2A', title: 'Algebraic Techniques B',
          outcomeIds: ['MA5-ALG-P-01'], topicIds: ['MA5-ALG-P-01'],
          explanation: 'Factorise by taking out a common algebraic factor. Expand binomial products using FOIL. Factorise monic quadratic expressions x²+bx+c by finding two numbers that multiply to c and add to b.',
        },
        {
          stageId: 'y10-l2-s2', code: '2B', title: 'Algebraic Techniques C',
          outcomeIds: ['MA5-ALG-P-02'], topicIds: ['MA5-ALG-P-02'],
          explanation: 'Simplify algebraic fractions involving binomial numerators. Expand and factorise using special products: difference of two squares a²−b²=(a+b)(a−b), perfect squares (a±b)²=a²±2ab+b². Factorise non-monic quadratics ax²+bx+c.',
        },
        {
          stageId: 'y10-l2-s3', code: '2C', title: 'Indices B',
          outcomeIds: ['MA5-IND-P-01'], topicIds: ['MA5-IND-P-01'],
          explanation: 'Apply index laws to algebraic expressions involving negative-integer indices. Simplify expressions like (2x⁻³y²)⁻² by applying all index laws in sequence. Express answers without negative indices.',
        },
        {
          stageId: 'y10-l2-s4', code: '2D', title: 'Indices C — Surds and Fractional Indices',
          outcomeIds: ['MA5-IND-P-02'], topicIds: ['MA5-IND-P-02'],
          explanation: 'Surds are irrational roots: √2, √3, etc. Simplify: √12 = 2√3. Rationalise denominators: 1/√2 = √2/2. Fractional indices: a^(1/n) = ⁿ√a and a^(m/n) = (ⁿ√a)ᵐ. Apply index laws to expressions with fractional indices.',
        },
      ],
    },
    // ── Level 3: Equations — Path ────────────────────────────────────────────
    {
      levelId: 'y10-l3', levelNum: 3, title: 'Equations', emoji: '⚖️', color: '#8B5CF6',
      stages: [
        {
          stageId: 'y10-l3-s1', code: '3A', title: 'Equations B',
          outcomeIds: ['MA5-EQU-P-01'], topicIds: ['MA5-EQU-P-01'],
          explanation: 'Solve monic quadratic equations x²+bx+c=0 by factorising or quadratic formula. Solve simple cubic equations ax³=k. Solve linear inequalities and graph solutions on a number line; reverse the inequality when multiplying/dividing by a negative.',
        },
        {
          stageId: 'y10-l3-s2', code: '3B', title: 'Equations C',
          outcomeIds: ['MA5-EQU-P-02'], topicIds: ['MA5-EQU-P-02'],
          explanation: 'Rearrange literal equations (change the subject). Solve non-monic quadratic equations ax²+bx+c=0 using factorisation or the quadratic formula x=(−b±√(b²−4ac))/2a. Solve linear simultaneous equations by substitution and elimination.',
        },
      ],
    },
    // ── Level 4: Relationships & Graphs — Path ───────────────────────────────
    {
      levelId: 'y10-l4', levelNum: 4, title: 'Relationships & Graphs', emoji: '📉', color: '#EC4899',
      stages: [
        {
          stageId: 'y10-l4-s1', code: '4A', title: 'Linear Relationships C',
          outcomeIds: ['MA5-LIN-P-01'], topicIds: ['MA5-LIN-P-01'],
          explanation: 'Apply midpoint, gradient, and distance formulas to solve coordinate geometry problems. Use various forms of line equations: general form ax+by+c=0, point-gradient form y−y₁=m(x−x₁). Identify and apply line and rotational symmetry in graphs.',
        },
        {
          stageId: 'y10-l4-s2', code: '4B', title: 'Non-Linear Relationships C',
          outcomeIds: ['MA5-NLI-P-01'], topicIds: ['MA5-NLI-P-01'],
          explanation: 'Graph and describe transformations of parabolas y=a(x−h)²+k, exponentials y=aˣ+c, hyperbolas y=k/x+c, and circles (x−h)²+(y−k)²=r². Complete the square to find the centre and radius of a circle from general form.',
        },
        {
          stageId: 'y10-l4-s3', code: '4C', title: 'Functions and Other Graphs',
          outcomeIds: ['MA5-FNC-P-01'], topicIds: ['MA5-FNC-P-01'],
          explanation: 'Define relations and functions. Use function notation f(x). Find domain and range and graph functions. Graph regions corresponding to linear inequalities in one and two variables. Use the vertical line test to determine if a relation is a function.',
        },
      ],
    },
    // ── Level 5: Polynomials & Logarithms — Path ─────────────────────────────
    {
      levelId: 'y10-l5', levelNum: 5, title: 'Polynomials & Logarithms', emoji: '🔢', color: '#F59E0B',
      stages: [
        {
          stageId: 'y10-l5-s1', code: '5A', title: 'Polynomials',
          outcomeIds: ['MA5-POL-P-01'], topicIds: ['MA5-POL-P-01'],
          explanation: 'Define polynomials P(x) = aₙxⁿ + … + a₁x + a₀. Add, subtract, and multiply polynomials. Divide using long division: P(x) = D(x)Q(x) + R(x). Remainder theorem: remainder = P(a) when dividing by (x−a). Factor theorem: (x−a) is a factor iff P(a)=0. Graph polynomials using roots and end behaviour.',
        },
        {
          stageId: 'y10-l5-s2', code: '5B', title: 'Logarithms',
          outcomeIds: ['MA5-LOG-P-01'], topicIds: ['MA5-LOG-P-01'],
          explanation: 'log_a(x) = y means aʸ = x. Log laws: log(AB) = logA + logB; log(A/B) = logA − logB; log(Aⁿ) = n logA; log_a(a) = 1; log_a(1) = 0. Change of base: log_a(x) = log(x)/log(a). Solve exponential equations using logarithms.',
        },
      ],
    },
    // ── Level 6: Variation & Rates of Change — Path ──────────────────────────
    {
      levelId: 'y10-l6', levelNum: 6, title: 'Variation & Rates of Change', emoji: '📈', color: '#14B8A6',
      stages: [
        {
          stageId: 'y10-l6-s1', code: '6A', title: 'Variation A',
          outcomeIds: ['MA5-RAT-P-01'], topicIds: ['MA5-RAT-P-01'],
          explanation: 'Direct variation: y = kx (proportional — graph is a line through origin). Inverse variation: y = k/x (graph is a hyperbola). Find k from a given data pair. Identify and distinguish between direct and inverse variation from tables, graphs, and equations.',
        },
        {
          stageId: 'y10-l6-s2', code: '6B', title: 'Variation B — Rates of Change',
          outcomeIds: ['MA5-RAT-P-02'], topicIds: ['MA5-RAT-P-02'],
          explanation: 'Analyse graphs that are increasing or decreasing at a constant or variable rate. Interpret gradient of a graph as an instantaneous rate of change. Construct graphical representations of rates of change from descriptions and tables.',
        },
      ],
    },
    // ── Level 7: Further Trigonometry — Path ─────────────────────────────────
    {
      levelId: 'y10-l7', levelNum: 7, title: 'Further Trigonometry', emoji: '📐', color: '#F97316',
      stages: [
        {
          stageId: 'y10-l7-s1', code: '7A', title: 'Trigonometry C — 3D Problems',
          outcomeIds: ['MA5-TRG-P-01'], topicIds: ['MA5-TRG-P-01'],
          explanation: 'Solve 3-dimensional problems involving right-angled triangles by identifying and extracting 2D right-angled triangles from the 3D figure. Draw clear diagrams. Apply Pythagoras and SOH CAH TOA systematically across multiple triangles.',
        },
        {
          stageId: 'y10-l7-s2', code: '7B', title: 'Trigonometry D — Sine & Cosine Rules',
          outcomeIds: ['MA5-TRG-P-02'], topicIds: ['MA5-TRG-P-02'],
          explanation: 'Use exact trig values (sin/cos/tan of 30°, 45°, 60°). Sine rule: a/sinA = b/sinB (use when angle and opposite side are known). Cosine rule: a²=b²+c²−2bc cosA (use for SAS or SSS). Area = ½ab sinC. Apply to bearings and practical problems.',
        },
      ],
    },
    // ── Level 8: Further Measurement — Path ──────────────────────────────────
    {
      levelId: 'y10-l8', levelNum: 8, title: 'Further Measurement', emoji: '📏', color: '#0EA5E9',
      stages: [
        {
          stageId: 'y10-l8-s1', code: '8A', title: 'Area and Surface Area B',
          outcomeIds: ['MA5-ARE-P-01'], topicIds: ['MA5-ARE-P-01'],
          explanation: 'Find surface areas of right pyramids (base + triangular faces), cones (πrl + πr²), and spheres (4πr²). Solve problems involving composite solids. Convert between units of area.',
        },
        {
          stageId: 'y10-l8-s2', code: '8B', title: 'Volume B',
          outcomeIds: ['MA5-VOL-P-01'], topicIds: ['MA5-VOL-P-01'],
          explanation: 'Find volumes of right pyramids (⅓ × base area × h), cones (⅓πr²h), and spheres (4/3πr³). Solve problems involving composite solids and related rates. Convert between cubic units.',
        },
      ],
    },
    // ── Level 9: Geometry — Path ──────────────────────────────────────────────
    {
      levelId: 'y10-l9', levelNum: 9, title: 'Geometry', emoji: '🔷', color: '#6366F1',
      stages: [
        {
          stageId: 'y10-l9-s1', code: '9A', title: 'Properties of Geometrical Figures B',
          outcomeIds: ['MA5-GEO-P-01'], topicIds: ['MA5-GEO-P-01'],
          explanation: 'Establish and apply the four congruence tests (SSS, SAS, AAS, RHS). Develop and apply the three similarity conditions (AA, SAS ratio, SSS ratio). Use congruence and similarity to solve problems involving properties of triangles, quadrilaterals, and other plane shapes.',
        },
        {
          stageId: 'y10-l9-s2', code: '9B', title: 'Properties of Geometrical Figures C',
          outcomeIds: ['MA5-GEO-P-02'], topicIds: ['MA5-GEO-P-02'],
          explanation: 'Construct formal two-column or paragraph proofs involving congruent and similar triangles. Prove properties of plane shapes (e.g. diagonals of a parallelogram bisect each other). Give reasons for every step.',
        },
        {
          stageId: 'y10-l9-s3', code: '9C', title: 'Circle Geometry',
          outcomeIds: ['MA5-CIR-P-01'], topicIds: ['MA5-CIR-P-01'],
          explanation: 'Prove and apply circle theorems: angle at centre = 2 × angle at circumference; angles in the same segment are equal; angle in a semicircle = 90°; opposite angles in a cyclic quadrilateral are supplementary. Tangent–radius perpendicularity, equal tangents from external point, alternate segment theorem.',
        },
      ],
    },
    // ── Level 10: Networks & Further Statistics — Path ────────────────────────
    {
      levelId: 'y10-l10', levelNum: 10, title: 'Networks & Further Statistics', emoji: '🕸️', color: '#8B5CF6',
      stages: [
        {
          stageId: 'y10-l10-s1', code: '10A', title: 'Introduction to Networks',
          outcomeIds: ['MA5-NET-P-01'], topicIds: ['MA5-NET-P-01'],
          explanation: 'A graph/network has vertices and edges. Degree of a vertex = number of edges. Euler\'s formula for planar graphs: V − E + F = 2. An Eulerian trail uses every edge once (exists iff exactly 0 or 2 odd-degree vertices). An Eulerian circuit returns to the start (exists iff all vertices have even degree).',
        },
        {
          stageId: 'y10-l10-s2', code: '10B', title: 'Data Analysis C — Statistical Inquiry',
          outcomeIds: ['MA5-DAT-P-01'], topicIds: ['MA5-DAT-P-01'],
          explanation: 'Plan, conduct, and review a statistical inquiry: formulate a question, collect data (census or sample), choose appropriate displays and summary statistics, analyse results, and draw conclusions. Evaluate the validity and reliability of data sources.',
        },
        {
          stageId: 'y10-l10-s3', code: '10C', title: 'Probability B — Venn Diagrams & Conditional',
          outcomeIds: ['MA5-PRO-P-01'], topicIds: ['MA5-PRO-P-01'],
          explanation: 'Use Venn diagrams and two-way tables to organise data and calculate probabilities. Conditional probability: P(A|B) = P(A∩B)/P(B). Test independence: A and B are independent iff P(A∩B) = P(A) × P(B). Apply to problems involving selection with and without replacement.',
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
    // ── Area: Algebra ────────────────────────────────────────────────────────
    {
      levelId: 'y11-std-l1', levelNum: 1, title: 'Algebra', emoji: '✏️', color: '#6366F1',
      stages: [
        {
          stageId: 'y11-std-l1-s1', code: '1A', title: 'Formulae and Equations',
          outcomeIds: ['MS11-1'], topicIds: ['MS-A1'],
          explanation: 'Substitute values into formulae and rearrange to solve for an unknown. Solve linear and simple non-linear equations, and pairs of simultaneous linear equations. Convert units before substituting and always verify by back-substitution.',
        },
        {
          stageId: 'y11-std-l1-s2', code: '1B', title: 'Linear Relationships',
          outcomeIds: ['MS11-2'], topicIds: ['MS-A2'],
          explanation: 'A linear relationship has the form y = mx + b. The gradient m measures rate of change and the y-intercept b is the starting value. Graph lines, find intersections, and interpret gradients and intercepts in real-world contexts such as distance-time and cost functions.',
        },
      ],
    },
    // ── Area: Financial Mathematics ──────────────────────────────────────────
    {
      levelId: 'y11-std-l2', levelNum: 2, title: 'Financial Mathematics', emoji: '💰', color: '#10B981',
      stages: [
        {
          stageId: 'y11-std-l2-s1', code: '2A', title: 'Earning Money',
          outcomeIds: ['MS11-3'], topicIds: ['MS-F1'],
          explanation: 'Calculate wages, salaries, overtime, commission, piecework, and allowances. Understand gross and net income, and how income tax is applied using tax brackets. Manage and interpret payslips and timesheets.',
        },
        {
          stageId: 'y11-std-l2-s2', code: '2B', title: 'Managing Money',
          outcomeIds: ['MS11-4'], topicIds: ['MS-F2'],
          explanation: 'Apply simple interest I = Prn and compound interest A = P(1 + r)ⁿ to savings, investments, and loans. Compare the effect of different compounding periods. Interpret and construct budgets, and analyse the cost of credit cards and consumer loans.',
        },
      ],
    },
    // ── Area: Measurement ────────────────────────────────────────────────────
    {
      levelId: 'y11-std-l3', levelNum: 3, title: 'Measurement', emoji: '📏', color: '#0EA5E9',
      stages: [
        {
          stageId: 'y11-std-l3-s1', code: '3A', title: 'Applications of Measurement',
          outcomeIds: ['MS11-5'], topicIds: ['MS-M1'],
          explanation: 'Calculate perimeters, areas, surface areas, and volumes of common 2D and 3D shapes including composite figures. Convert between units within the metric system. Apply Pythagoras\' theorem and right-angle trigonometry (sin, cos, tan) to practical problems.',
        },
        {
          stageId: 'y11-std-l3-s2', code: '3B', title: 'Time and Location',
          outcomeIds: ['MS11-6'], topicIds: ['MS-M2'],
          explanation: 'Convert between 12-hour and 24-hour time, and between time units. Solve problems involving time zones, daylight saving, and the International Date Line. Interpret timetables and use maps and scales to calculate distances and directions.',
        },
      ],
    },
    // ── Area: Networks ───────────────────────────────────────────────────────
    {
      levelId: 'y11-std-l4', levelNum: 4, title: 'Networks', emoji: '🕸️', color: '#8B5CF6',
      stages: [
        {
          stageId: 'y11-std-l4-s1', code: '4A', title: 'Networks, Paths and Trees',
          outcomeIds: ['MS11-7'], topicIds: ['MS-N1'],
          explanation: 'A network consists of vertices connected by edges. The degree of a vertex equals its number of edges, and the sum of all degrees equals twice the number of edges. Identify Euler paths and circuits, find minimum spanning trees using Prim\'s or Kruskal\'s algorithm, and determine shortest paths through weighted networks.',
        },
      ],
    },
    // ── Area: Statistics ─────────────────────────────────────────────────────
    {
      levelId: 'y11-std-l5', levelNum: 5, title: 'Statistics', emoji: '📊', color: '#F59E0B',
      stages: [
        {
          stageId: 'y11-std-l5-s1', code: '5A', title: 'Data Analysis',
          outcomeIds: ['MS11-8'], topicIds: ['MS-S1'],
          explanation: 'Classify data as categorical or numerical, and as discrete or continuous. Display data using histograms, stem-and-leaf plots, dot plots, and box plots. Calculate and interpret mean, median, mode, range, and standard deviation. Compare distributions by centre, spread, and shape, and identify outliers using the IQR rule.',
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
    // ── Area: Functions ──────────────────────────────────────────────────────
    {
      levelId: 'y11-adv-l1', levelNum: 1, title: 'Working with Functions', emoji: '✏️', color: '#6366F1',
      stages: [
        {
          stageId: 'y11-adv-l1-s1', code: '1A', title: 'Algebraic Techniques',
          outcomeIds: ['MA11-1'], topicIds: ['MA-F1'],
          explanation: 'Master the algebraic toolkit required throughout Advanced: expand and factorise expressions using HCF, difference of squares, grouping, and trinomials; simplify algebraic fractions; apply index laws including fractional and negative indices; simplify surds and rationalise denominators. These skills underpin all later topics.',
        },
        {
          stageId: 'y11-adv-l1-s2', code: '1B', title: 'Introduction to Functions',
          outcomeIds: ['MA11-1'], topicIds: ['MA-F1'],
          explanation: 'A function assigns exactly one output to each input and passes the vertical line test. Use function notation f(x), state domain and range, and classify relations as one-to-one, many-to-one, or one-to-many. Understand interval notation [a, b), (a, b), etc.',
        },
        {
          stageId: 'y11-adv-l1-s3', code: '1C', title: 'Linear, Quadratic and Cubic Functions',
          outcomeIds: ['MA11-1'], topicIds: ['MA-F1'],
          explanation: 'Graph y = mx + b (gradient and intercept), y = ax² + bx + c (parabola — vertex via x = −b/2a or completing the square, discriminant Δ = b²−4ac for roots), and y = ax³ + bx² + cx + d (cubic). Solve simultaneous equations involving these functions to find intersections.',
        },
        {
          stageId: 'y11-adv-l1-s4', code: '1D', title: 'Reciprocal, Piecewise, Absolute Value and Variation',
          outcomeIds: ['MA11-1'], topicIds: ['MA-F1'],
          explanation: 'Sketch y = k/x (rectangular hyperbola) and y = k/(x − a) + b with asymptotes. Define and graph piecewise functions over restricted domains. Graph y = |f(x)| and y = f(|x|). Solve equations involving absolute value. Model direct variation y = kx and inverse variation y = k/x.',
        },
        {
          stageId: 'y11-adv-l1-s5', code: '1E', title: 'Circles and Graph Transformations',
          outcomeIds: ['MA11-1'], topicIds: ['MA-F1'],
          explanation: 'The circle (x − h)² + (y − k)² = r² has centre (h, k) and radius r; complete the square to convert from general form. Apply transformations: y = f(x) + k (vertical shift), y = f(x − h) (horizontal shift), y = −f(x) (reflection in x-axis), y = f(−x) (reflection in y-axis), y = af(x) and y = f(bx) (dilations).',
        },
      ],
    },
    // ── Area: Trigonometric Functions ────────────────────────────────────────
    {
      levelId: 'y11-adv-l2', levelNum: 2, title: 'Trigonometric Functions', emoji: '📐', color: '#8B5CF6',
      stages: [
        {
          stageId: 'y11-adv-l2-s1', code: '2A', title: 'Trigonometry of Acute Angles and Any Magnitude',
          outcomeIds: ['MA11-3'], topicIds: ['MA-T1'],
          explanation: 'SOH CAH TOA for right triangles. Know exact values for 30°, 45°, 60° from special triangles. Extend to any angle using the unit circle and the ASTC rule: All positive in Q1, Sin in Q2, Tan in Q3, Cos in Q4. Evaluate trig of obtuse and reflex angles using related acute angles.',
        },
        {
          stageId: 'y11-adv-l2-s2', code: '2B', title: 'Radians and Trigonometric Identities',
          outcomeIds: ['MA11-3'], topicIds: ['MA-T1'],
          explanation: 'Convert between degrees and radians: π rad = 180°. Arc length s = rθ, sector area A = ½r²θ (θ in radians). Key identities: sin²θ + cos²θ = 1, tanθ = sinθ/cosθ. Use the sine rule a/sinA = b/sinB, cosine rule a² = b²+c²−2bc cosA, and area = ½ab sinC for non-right triangles.',
        },
        {
          stageId: 'y11-adv-l2-s3', code: '2C', title: 'Trigonometric Equations',
          outcomeIds: ['MA11-3'], topicIds: ['MA-T2'],
          explanation: 'Solve equations such as sin x = k and 2cos x − 1 = 0 for x in a given interval. Use the unit circle and symmetry to find all solutions. Express exact answers in radians where possible. Prove trigonometric identities by manipulating one side using known identities.',
        },
      ],
    },
    // ── Area: Calculus ───────────────────────────────────────────────────────
    {
      levelId: 'y11-adv-l3', levelNum: 3, title: 'Introduction to Differentiation', emoji: '∂', color: '#0EA5E9',
      stages: [
        {
          stageId: 'y11-adv-l3-s1', code: '3A', title: 'Estimating Change and the Derivative',
          outcomeIds: ['MA11-5'], topicIds: ['MA-C1'],
          explanation: 'The gradient of a secant chord approximates the rate of change. The derivative f\'(x) = lim[h→0] (f(x+h)−f(x))/h is the gradient of the tangent — the instantaneous rate of change. Understand that differentiability requires continuity but not vice versa.',
        },
        {
          stageId: 'y11-adv-l3-s2', code: '3B', title: 'Differentiation Rules',
          outcomeIds: ['MA11-5'], topicIds: ['MA-C1'],
          explanation: 'Power rule: d/dx(xⁿ) = nxⁿ⁻¹. Chain rule: [f(g(x))]\' = f\'(g(x))·g\'(x). Product rule: (uv)\' = u\'v + uv\'. Quotient rule: (u/v)\' = (u\'v − uv\')/v². Apply to polynomials, and functions with negative and fractional indices.',
        },
        {
          stageId: 'y11-adv-l3-s3', code: '3C', title: 'Graphical Applications of the Derivative',
          outcomeIds: ['MA11-5'], topicIds: ['MA-C1'],
          explanation: 'Find equations of tangents and normals (m_normal = −1/m_tangent). f\'(x) > 0 means increasing, f\'(x) < 0 means decreasing, f\'(x) = 0 means stationary. Classify stationary points using sign diagrams of f\' or the second derivative test: f\'\'(a) > 0 → min, f\'\'(a) < 0 → max.',
        },
        {
          stageId: 'y11-adv-l3-s4', code: '3D', title: 'The Derivative as a Rate of Change',
          outcomeIds: ['MA11-5'], topicIds: ['MA-C1'],
          explanation: 'dy/dx is the rate of change of y with respect to x. In kinematics, v = ds/dt (velocity) and a = dv/dt (acceleration). Solve optimisation problems by setting f\'(x) = 0 and confirming the nature of the stationary point. Always check endpoints on a closed domain.',
        },
      ],
    },
    // ── Area: Exponential and Logarithmic Functions ──────────────────────────
    {
      levelId: 'y11-adv-l4', levelNum: 4, title: 'Exponential and Logarithmic Functions', emoji: '📈', color: '#EC4899',
      stages: [
        {
          stageId: 'y11-adv-l4-s1', code: '4A', title: 'Exponential Functions',
          outcomeIds: ['MA11-4'], topicIds: ['MA-E1'],
          explanation: 'Graph y = aˣ for a > 1 (growth) and 0 < a < 1 (decay). The function passes through (0, 1) with horizontal asymptote y = 0. The natural exponential y = eˣ satisfies d/dx(eˣ) = eˣ. Model growth and decay with A = A₀eᵏᵗ. Apply transformations to exponential graphs.',
        },
        {
          stageId: 'y11-adv-l4-s2', code: '4B', title: 'Logarithmic Functions',
          outcomeIds: ['MA11-4'], topicIds: ['MA-E2'],
          explanation: 'log_a x = y ⟺ aʸ = x. Laws: log(AB) = logA + logB, log(A/B) = logA − logB, log(Aⁿ) = n logA. Change of base: log_a x = ln x / ln a. Graph y = ln x (passes through (1,0), asymptote x = 0) — the reflection of y = eˣ in y = x. Solve exponential and logarithmic equations.',
        },
      ],
    },
    // ── Area: Statistical Analysis ───────────────────────────────────────────
    {
      levelId: 'y11-adv-l5', levelNum: 5, title: 'Statistical Analysis', emoji: '🎲', color: '#14B8A6',
      stages: [
        {
          stageId: 'y11-adv-l5-s1', code: '5A', title: 'Sets, Probability and Conditional Probability',
          outcomeIds: ['MA11-7'], topicIds: ['MA-S1'],
          explanation: 'Set notation: A ∪ B (union), A ∩ B (intersection), A\' (complement). Addition theorem: P(A ∪ B) = P(A) + P(B) − P(A ∩ B). Conditional probability: P(A|B) = P(A ∩ B)/P(B). Independent events: P(A|B) = P(A). Use Venn diagrams, two-way tables, and tree diagrams to organise and compute probabilities.',
        },
        {
          stageId: 'y11-adv-l5-s2', code: '5B', title: 'Discrete Probability Distributions and Data',
          outcomeIds: ['MA11-7'], topicIds: ['MA-S1'],
          explanation: 'A discrete probability distribution lists P(X = x) for all x, with all values in [0,1] summing to 1. Expected value E(X) = Σ x·P(X=x). Variance Var(X) = E(X²) − [E(X)]² and standard deviation σ = √Var(X). Interpret and compare data displays including histograms, box plots, and cumulative frequency graphs.',
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
    // ── Area: Functions ──────────────────────────────────────────────────────
    {
      levelId: 'y11-ext1-l1', levelNum: 1, title: 'Further Work with Functions', emoji: '✏️', color: '#6366F1',
      stages: [
        {
          stageId: 'y11-ext1-l1-s1', code: '1A', title: 'Graphical Relationships',
          outcomeIds: ['ME11-1'], topicIds: ['ME-F1'],
          explanation: 'Extend function graphing to derived graphs. Given y = f(x), sketch y = 1/f(x) (reciprocal), y = |f(x)| (fold negatives up), y = f(|x|) (reflect right half), and y = f(x) ± g(x) (add/subtract ordinates). Identify key features — asymptotes, zeroes, turning points — in each derived graph from those of the original.',
        },
        {
          stageId: 'y11-ext1-l1-s2', code: '1B', title: 'Inverse Functions',
          outcomeIds: ['ME11-1'], topicIds: ['ME-F1'],
          explanation: 'A function has an inverse if and only if it is one-to-one (passes the horizontal line test). The inverse f⁻¹ is the reflection of f in the line y = x; swap x and y then rearrange. The domain of f⁻¹ equals the range of f and vice versa. Restrict domains to create one-to-one functions.',
        },
        {
          stageId: 'y11-ext1-l1-s3', code: '1C', title: 'Parametric Form of a Function or Relation',
          outcomeIds: ['ME11-1'], topicIds: ['ME-F1'],
          explanation: 'A curve can be defined parametrically as x = f(t), y = g(t). Eliminate the parameter t to obtain the Cartesian equation. For example, x = cos t, y = sin t gives x² + y² = 1 (circle). Parametric form is useful for curves that are not functions in Cartesian form.',
        },
      ],
    },
    {
      levelId: 'y11-ext1-l2', levelNum: 2, title: 'Polynomials', emoji: '🔢', color: '#8B5CF6',
      stages: [
        {
          stageId: 'y11-ext1-l2-s1', code: '2A', title: 'Language, Notation and Graphs of Polynomials',
          outcomeIds: ['ME11-1'], topicIds: ['ME-F2'],
          explanation: 'A polynomial P(x) = aₙxⁿ + ... + a₁x + a₀ has degree n. The leading coefficient, constant term, and degree determine end behaviour. Sketch polynomial graphs by analysing zeroes (x-intercepts), their multiplicity (single zero: crosses; double zero: touches; triple zero: inflects), and end behaviour as x → ±∞.',
        },
        {
          stageId: 'y11-ext1-l2-s2', code: '2B', title: 'Division of Polynomials and the Remainder Theorem',
          outcomeIds: ['ME11-1'], topicIds: ['ME-F2'],
          explanation: 'Divide P(x) by (x − a) using long division or synthetic division to obtain P(x) = (x − a)Q(x) + R. The Remainder Theorem states R = P(a). The Factor Theorem: (x − a) is a factor of P(x) if and only if P(a) = 0. Use these to factorise polynomials and solve polynomial equations.',
        },
        {
          stageId: 'y11-ext1-l2-s3', code: '2C', title: 'Sums and Products of Roots',
          outcomeIds: ['ME11-1'], topicIds: ['ME-F2'],
          explanation: 'For ax³ + bx² + cx + d = 0 with roots α, β, γ: sum α+β+γ = −b/a, sum of products αβ+αγ+βγ = c/a, product αβγ = −d/a. These Vieta\'s formulas allow problems about roots to be solved without finding the roots explicitly. Similar results hold for quadratics and higher-degree polynomials.',
        },
      ],
    },
    {
      levelId: 'y11-ext1-l3', levelNum: 3, title: 'Inequalities', emoji: '📉', color: '#0EA5E9',
      stages: [
        {
          stageId: 'y11-ext1-l3-s1', code: '3A', title: 'Inequalities',
          outcomeIds: ['ME11-2'], topicIds: ['ME-F3'],
          explanation: 'Solve linear, quadratic, and rational inequalities algebraically and graphically. For quadratic inequalities, find the roots then use a sign diagram or parabola sketch to determine where the expression is positive or negative. For rational inequalities, multiply through carefully avoiding sign errors — or use a sign diagram on the factorised form.',
        },
      ],
    },
    // ── Area: Trigonometric Functions ────────────────────────────────────────
    {
      levelId: 'y11-ext1-l4', levelNum: 4, title: 'Further Trigonometry', emoji: '📐', color: '#EC4899',
      stages: [
        {
          stageId: 'y11-ext1-l4-s1', code: '4A', title: 'Trigonometry in 3D',
          outcomeIds: ['ME11-3'], topicIds: ['ME-T1'],
          explanation: 'Solve 3D trigonometric problems by identifying right-angled triangles within the figure and working through a sequence of 2D calculations. Draw and label clear diagrams. Bearings, angles of elevation and depression, and cross-sections of 3D solids are common contexts.',
        },
        {
          stageId: 'y11-ext1-l4-s2', code: '4B', title: 'Further Trigonometric Identities',
          outcomeIds: ['ME11-3'], topicIds: ['ME-T1'],
          explanation: 'Compound angle formulas: sin(A±B) = sinA cosB ± cosA sinB; cos(A±B) = cosA cosB ∓ sinA sinB. Double angle formulas: sin2A = 2 sinA cosA; cos2A = cos²A − sin²A = 1 − 2sin²A = 2cos²A − 1. Use these to prove identities and evaluate exact trig values of non-standard angles.',
        },
        {
          stageId: 'y11-ext1-l4-s3', code: '4C', title: 'Further Trigonometric Equations',
          outcomeIds: ['ME11-3'], topicIds: ['ME-T1'],
          explanation: 'Solve equations using compound and double angle identities to reduce to simpler forms. The auxiliary angle method: a sinθ + b cosθ = R sin(θ + φ) where R = √(a²+b²) and tan φ = b/a. Find all solutions in a given interval using the unit circle and periodicity.',
        },
      ],
    },
    // ── Area: Combinatorics ──────────────────────────────────────────────────
    {
      levelId: 'y11-ext1-l5', levelNum: 5, title: 'Combinatorics', emoji: '🔢', color: '#F59E0B',
      stages: [
        {
          stageId: 'y11-ext1-l5-s1', code: '5A', title: 'Permutations and Combinations',
          outcomeIds: ['ME11-5'], topicIds: ['ME-A1'],
          explanation: 'A permutation is an ordered selection: ⁿPᵣ = n!/(n−r)!. A combination is an unordered selection: ⁿCᵣ = n!/[r!(n−r)!] = C(n,r). Solve counting problems by deciding whether order matters. Include restricted cases (e.g., fixed elements, elements together/apart) by treating them as a unit or using complementary counting.',
        },
        {
          stageId: 'y11-ext1-l5-s2', code: '5B', title: 'The Binomial Theorem',
          outcomeIds: ['ME11-5'], topicIds: ['ME-A1'],
          explanation: '(x + y)ⁿ = Σ C(n,r) xⁿ⁻ʳ yʳ for r = 0 to n. Pascal\'s triangle provides the binomial coefficients C(n,r). The general term is T(r+1) = C(n,r) xⁿ⁻ʳ yʳ — use this to find a specific term without expanding fully. Key identities: C(n,0)+C(n,1)+...+C(n,n) = 2ⁿ.',
        },
      ],
    },
  ],
}

// ── YEAR 11 EXTENSION 2 ───────────────────────────────────────────────────────
// NOTE: Extension 2 is a Year 12 course only. In Year 11, students who intend
// to study Ext 2 complete the full Advanced + Extension 1 courses.
const YEAR_11_EXT2_MISSION: Mission = {
  missionId: 'y11-ext2',
  title: 'Year 11 Extension 2 Pathway',
  year: 11,
  course: 'extension2',
  shortLabel: 'Ext 2',
  levels: [
    {
      levelId: 'y11-ext2-l1', levelNum: 1, title: 'Extension 2 Begins in Year 12', emoji: '📌', color: '#6B7A99',
      stages: [
        {
          stageId: 'y11-ext2-l1-s1', code: '1A', title: 'No Year 11 Extension 2 Content',
          outcomeIds: [], topicIds: [],
          explanation: 'Extension 2 is a Year 12 course only. In Year 11, students who plan to study Extension 2 complete the full Year 11 Advanced and Year 11 Extension 1 courses. Switch to the Advanced or Extension 1 mission to begin your Year 11 studies.',
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
    // ── Area: Functions ──────────────────────────────────────────────────────
    {
      levelId: 'y12-adv-l1', levelNum: 1, title: 'Functions and Modelling', emoji: '✏️', color: '#6366F1',
      stages: [
        {
          stageId: 'y12-adv-l1-s1', code: '1A', title: 'Further Graph Transformations and Modelling',
          outcomeIds: ['MA12-1'], topicIds: ['MA-F1'],
          explanation: 'Apply the full suite of transformations — vertical/horizontal shifts, dilations, reflections — to a wider class of functions including exponential, logarithmic, and trigonometric. Use transformations to fit models to data. Determine parameter values from the graph and interpret them in context.',
        },
        {
          stageId: 'y12-adv-l1-s2', code: '1B', title: 'Transformations of Trigonometric Functions',
          outcomeIds: ['MA12-1'], topicIds: ['MA-F1'],
          explanation: 'Graph y = a sin(bx + c) + d: amplitude |a|, period 2π/b, phase shift −c/b, vertical shift d. Similarly for cosine and tangent. Sketch these by identifying key features, then apply transformations. Interpret amplitude and period in physical contexts such as tides and sound waves.',
        },
        {
          stageId: 'y12-adv-l1-s3', code: '1C', title: 'Modelling with Functions',
          outcomeIds: ['MA12-1'], topicIds: ['MA-F1'],
          explanation: 'Select an appropriate function type (linear, quadratic, exponential, trigonometric) to model a real-world relationship. Fit parameters using given data points. Evaluate the quality of the model, identify limitations, and use it to make predictions within and beyond the data range.',
        },
      ],
    },
    // ── Area: Calculus ───────────────────────────────────────────────────────
    {
      levelId: 'y12-adv-l2', levelNum: 2, title: 'Differential Calculus', emoji: '∂', color: '#8B5CF6',
      stages: [
        {
          stageId: 'y12-adv-l2-s1', code: '2A', title: 'Differentiation with Exponential, Log and Trig',
          outcomeIds: ['MA12-3'], topicIds: ['MA-C3'],
          explanation: 'd/dx(eˣ) = eˣ, d/dx(e^f(x)) = f\'(x)e^f(x). d/dx(ln x) = 1/x, d/dx(ln f(x)) = f\'(x)/f(x). d/dx(sin x) = cos x, d/dx(cos x) = −sin x, d/dx(tan x) = sec²x. Chain, product, and quotient rules apply to all combinations. Express answers in simplest exact form.',
        },
        {
          stageId: 'y12-adv-l2-s2', code: '2B', title: 'Using Derivatives — Curve Sketching and Optimisation',
          outcomeIds: ['MA12-3'], topicIds: ['MA-C3'],
          explanation: 'Classify stationary points using f″(x): f″(a) > 0 → local min, f″(a) < 0 → local max, f″(a) = 0 → test further. Points of inflection occur where concavity changes. Perform full curve sketches including domain, intercepts, stationary points, inflections, and asymptotes. Solve optimisation problems over open and closed domains.',
        },
      ],
    },
    {
      levelId: 'y12-adv-l3', levelNum: 3, title: 'Integral Calculus', emoji: '∫', color: '#0EA5E9',
      stages: [
        {
          stageId: 'y12-adv-l3-s1', code: '3A', title: 'Primitive Functions and the Definite Integral',
          outcomeIds: ['MA12-4'], topicIds: ['MA-C4'],
          explanation: 'Antidifferentiation (primitive functions): ∫xⁿ dx = xⁿ⁺¹/(n+1) + C (n ≠ −1), ∫eˣ dx = eˣ + C, ∫(1/x) dx = ln|x| + C. The Fundamental Theorem: ∫[a,b] f(x) dx = F(b) − F(a). The definite integral gives signed area. Use substitution to evaluate more complex integrals.',
        },
        {
          stageId: 'y12-adv-l3-s2', code: '3B', title: 'Integration with Exponential, Log and Trig',
          outcomeIds: ['MA12-4'], topicIds: ['MA-C4'],
          explanation: '∫eˣ dx = eˣ + C; ∫e^(kx) dx = (1/k)e^(kx) + C. ∫(1/x) dx = ln|x| + C; ∫(f\'(x)/f(x)) dx = ln|f(x)| + C. ∫sin x dx = −cos x + C; ∫cos x dx = sin x + C; ∫sec²x dx = tan x + C. Combine with the chain rule in reverse (substitution) for composed functions.',
        },
        {
          stageId: 'y12-adv-l3-s3', code: '3C', title: 'Areas Under and Between Curves',
          outcomeIds: ['MA12-4'], topicIds: ['MA-C4'],
          explanation: 'Area between y = f(x) and the x-axis from a to b: take |∫[a,b] f(x) dx|, splitting at x-intercepts where f(x) < 0. Area between f and g: A = ∫[a,b] |f(x) − g(x)| dx; find intersection points first to set limits. Trapezoidal rule for numerical approximation: A ≈ (h/2)[y₀ + 2(y₁+...+yₙ₋₁) + yₙ].',
        },
      ],
    },
    {
      levelId: 'y12-adv-l4', levelNum: 4, title: 'Applications of Calculus', emoji: '📈', color: '#EC4899',
      stages: [
        {
          stageId: 'y12-adv-l4-s1', code: '4A', title: 'Rates of Change and Related Rates',
          outcomeIds: ['MA12-4'], topicIds: ['MA-C4'],
          explanation: 'Interpret dy/dx as a rate of change. Related rates: if y is a function of x, and x is a function of t, then dy/dt = (dy/dx)(dx/dt). Set up equations linking the quantities, differentiate implicitly with respect to t, then substitute known values. Applications: filling/draining tanks, expanding shapes, and kinematics.',
        },
      ],
    },
    // ── Area: Sequences and Series ───────────────────────────────────────────
    {
      levelId: 'y12-adv-l5', levelNum: 5, title: 'Sequences and Series', emoji: '🔢', color: '#14B8A6',
      stages: [
        {
          stageId: 'y12-adv-l5-s1', code: '5A', title: 'Arithmetic Sequences and Series',
          outcomeIds: ['MA12-2'], topicIds: ['MA-M1'],
          explanation: 'Arithmetic sequence: Tₙ = a + (n−1)d. Common difference d = Tₙ₊₁ − Tₙ. Sum of n terms: Sₙ = (n/2)[2a + (n−1)d] = (n/2)(a + l) where l is the last term. Recognise arithmetic sequences in context (fixed-rate pay rises, constant depreciation) and find n, a, d, Sₙ given partial information.',
        },
        {
          stageId: 'y12-adv-l5-s2', code: '5B', title: 'Geometric Sequences and Series',
          outcomeIds: ['MA12-2'], topicIds: ['MA-M1'],
          explanation: 'Geometric sequence: Tₙ = arⁿ⁻¹. Common ratio r = Tₙ₊₁/Tₙ. Sum of n terms: Sₙ = a(rⁿ − 1)/(r − 1) for r ≠ 1. Limiting sum for |r| < 1: S∞ = a/(1 − r). Applications: compound interest, population models, and recurring decimals. Distinguish arithmetic from geometric by testing ratios and differences.',
        },
      ],
    },
    // ── Area: Statistical Analysis ───────────────────────────────────────────
    {
      levelId: 'y12-adv-l6', levelNum: 6, title: 'Statistical Analysis', emoji: '📊', color: '#F59E0B',
      stages: [
        {
          stageId: 'y12-adv-l6-s1', code: '6A', title: 'Discrete and Continuous Random Variables',
          outcomeIds: ['MA12-8'], topicIds: ['MA-S2'],
          explanation: 'A discrete random variable X has a probability distribution P(X = x) ≥ 0 with ΣP = 1. E(X) = Σx·P(X=x), Var(X) = E(X²) − [E(X)]². A continuous random variable is described by a probability density function f(x) where P(a ≤ X ≤ b) = ∫[a,b] f(x) dx and ∫f(x) dx = 1.',
        },
        {
          stageId: 'y12-adv-l6-s2', code: '6B', title: 'The Normal Distribution',
          outcomeIds: ['MA12-8'], topicIds: ['MA-S2'],
          explanation: 'The normal distribution N(μ, σ²) is symmetric and bell-shaped. Standardise using z = (x − μ)/σ to use the standard normal N(0, 1). Use tables or a calculator to find probabilities and percentiles. The empirical rule: ≈68% within 1σ, ≈95% within 2σ, ≈99.7% within 3σ of the mean.',
        },
      ],
    },
    // ── Area: Financial Mathematics ──────────────────────────────────────────
    {
      levelId: 'y12-adv-l7', levelNum: 7, title: 'Financial Mathematics', emoji: '💰', color: '#10B981',
      stages: [
        {
          stageId: 'y12-adv-l7-s1', code: '7A', title: 'Reducing Balance Loans',
          outcomeIds: ['MA12-2'], topicIds: ['MA-M1'],
          explanation: 'For a reducing balance loan with principal P, monthly interest rate r, and n repayments of M: the balance after n payments follows a recurrence relation. The outstanding balance after k payments is Aₖ = Aₖ₋₁(1+r) − M. Calculate repayment amounts, time to repay, and total interest paid.',
        },
        {
          stageId: 'y12-adv-l7-s2', code: '7B', title: 'Annuities',
          outcomeIds: ['MA12-2'], topicIds: ['MA-M1'],
          explanation: 'An annuity is a series of equal payments at regular intervals. Present value PV = M[1 − (1+r)⁻ⁿ]/r; future value FV = M[(1+r)ⁿ − 1]/r. Use these to calculate loan repayments, superannuation savings, and investment values. Tables and recurrence relations can also be used.',
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
    // ── Area: Proof ──────────────────────────────────────────────────────────
    {
      levelId: 'y12-ext1-l1', levelNum: 1, title: 'Proof', emoji: '🔍', color: '#6366F1',
      stages: [
        {
          stageId: 'y12-ext1-l1-s1', code: '1A', title: 'Proof by Mathematical Induction',
          outcomeIds: ['ME12-1'], topicIds: ['ME-P1'],
          explanation: 'Mathematical induction proves a statement P(n) for all positive integers n ≥ n₀ in two steps: (1) Base case: verify P(n₀) is true. (2) Inductive step: assume P(k) is true (inductive hypothesis), then prove P(k+1) is true. Applications include proving divisibility results, summation formulas (e.g. Σr = n(n+1)/2), and inequalities.',
        },
      ],
    },
    // ── Area: Vectors ────────────────────────────────────────────────────────
    {
      levelId: 'y12-ext1-l2', levelNum: 2, title: 'Vectors', emoji: '→', color: '#8B5CF6',
      stages: [
        {
          stageId: 'y12-ext1-l2-s1', code: '2A', title: 'Vector Representation and Operations',
          outcomeIds: ['ME12-2'], topicIds: ['ME-V1'],
          explanation: 'A vector has magnitude and direction. In component form: a = a₁i + a₂j (2D) or a = a₁i + a₂j + a₃k (3D). Addition: a + b = (a₁+b₁)i + (a₂+b₂)j. Scalar multiplication: ka scales the magnitude. The zero vector 0 has zero magnitude. Position vectors locate a point relative to the origin.',
        },
        {
          stageId: 'y12-ext1-l2-s2', code: '2B', title: 'Dot Product and Projections',
          outcomeIds: ['ME12-2'], topicIds: ['ME-V1'],
          explanation: 'Dot product: a·b = a₁b₁ + a₂b₂ + a₃b₃ = |a||b|cosθ. Use to find the angle between vectors: cosθ = (a·b)/(|a||b|). Vectors are perpendicular iff a·b = 0. The scalar projection of b onto a is (a·b)/|a|; the vector projection is [(a·b)/|a|²]a.',
        },
        {
          stageId: 'y12-ext1-l2-s3', code: '2C', title: 'Projectile Motion',
          outcomeIds: ['ME12-2'], topicIds: ['ME-V1'],
          explanation: 'Projectile motion under gravity with initial speed V at angle α: x = Vt cosα, y = Vt sinα − ½gt². Time of flight, range, and maximum height are derived by eliminating t. Cartesian equation: y = x tanα − gx²/(2V²cos²α). In vector form: r(t) = (V cosα)t i + (V sinα t − ½gt²)j.',
        },
      ],
    },
    // ── Area: Trigonometric Functions ────────────────────────────────────────
    {
      levelId: 'y12-ext1-l3', levelNum: 3, title: 'Inverse Trigonometric Functions', emoji: '📐', color: '#0EA5E9',
      stages: [
        {
          stageId: 'y12-ext1-l3-s1', code: '3A', title: 'Inverse Trig Definitions and Graphs',
          outcomeIds: ['ME12-3'], topicIds: ['ME-T1'],
          explanation: 'sin⁻¹x: domain [−1,1], range [−π/2, π/2]. cos⁻¹x: domain [−1,1], range [0,π]. tan⁻¹x: domain ℝ, range (−π/2, π/2). These restricted domains ensure each is a function. Graphs are reflections of the corresponding trig function in y = x. Know exact values: sin⁻¹(1/2) = π/6, cos⁻¹(0) = π/2, tan⁻¹(1) = π/4.',
        },
      ],
    },
    // ── Area: Calculus ───────────────────────────────────────────────────────
    {
      levelId: 'y12-ext1-l4', levelNum: 4, title: 'Further Calculus', emoji: '∂', color: '#EC4899',
      stages: [
        {
          stageId: 'y12-ext1-l4-s1', code: '4A', title: 'Further Differentiation Techniques',
          outcomeIds: ['ME12-5'], topicIds: ['ME-C2'],
          explanation: 'd/dx(sin⁻¹x) = 1/√(1−x²), d/dx(cos⁻¹x) = −1/√(1−x²), d/dx(tan⁻¹x) = 1/(1+x²). Implicit differentiation: differentiate both sides with respect to x, treating y as a function of x and applying the chain rule. Used for curves defined implicitly such as circles and ellipses.',
        },
        {
          stageId: 'y12-ext1-l4-s2', code: '4B', title: 'Techniques of Integration',
          outcomeIds: ['ME12-5'], topicIds: ['ME-C2'],
          explanation: '∫1/√(1−x²) dx = sin⁻¹x + C; ∫1/(1+x²) dx = tan⁻¹x + C. Integration by substitution: let u = g(x), then ∫f(g(x))g\'(x) dx = ∫f(u) du. Integration by parts: ∫u dv = uv − ∫v du. Choose u = LIATE order (logarithm, inverse trig, algebraic, trig, exponential).',
        },
        {
          stageId: 'y12-ext1-l4-s3', code: '4C', title: 'Further Applications of Calculus',
          outcomeIds: ['ME12-5'], topicIds: ['ME-C2'],
          explanation: 'Multiplicity of zeroes affects graph shape at intercepts. Further rates of change and related rates problems. Area between curves and volumes of revolution: V = π∫[a,b] [f(x)]² dx (disc/washer method). Differential equations: solve dy/dx = f(x) by direct integration, and separable equations dy/dx = g(x)h(y) by separation of variables.',
        },
      ],
    },
    // ── Area: Statistical Analysis ───────────────────────────────────────────
    {
      levelId: 'y12-ext1-l5', levelNum: 5, title: 'Statistical Analysis', emoji: '📊', color: '#14B8A6',
      stages: [
        {
          stageId: 'y12-ext1-l5-s1', code: '5A', title: 'Binomial Distributions',
          outcomeIds: ['ME12-6'], topicIds: ['ME-S1'],
          explanation: 'A Bernoulli trial has two outcomes: success (probability p) and failure (1−p). If X counts successes in n independent Bernoulli trials, then X ~ Bin(n, p): P(X = k) = C(n,k) pᵏ(1−p)ⁿ⁻ᵏ, E(X) = np, Var(X) = np(1−p). The sample proportion p̂ = X/n has mean p and variance p(1−p)/n, and is approximately normal for large n.',
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
    // ── Area: Algebra ────────────────────────────────────────────────────────
    {
      levelId: 'y12-std-l1', levelNum: 1, title: 'Algebra', emoji: '✏️', color: '#6366F1',
      stages: [
        {
          stageId: 'y12-std-l1-s1', code: '1A', title: 'Algebraic Relationships',
          outcomeIds: ['MS2-12-1'], topicIds: ['MS-A4'],
          explanation: 'Identify and interpret types of algebraic relationships: linear (y = mx + b), quadratic (y = ax² + bx + c), exponential (y = ab^x), and reciprocal (y = k/x). Sketch graphs by recognising key features — intercepts, vertex, asymptotes, turning points. Use equations to solve problems in practical contexts.',
        },
      ],
    },
    // ── Area: Financial Mathematics ──────────────────────────────────────────
    {
      levelId: 'y12-std-l2', levelNum: 2, title: 'Financial Mathematics', emoji: '💰', color: '#10B981',
      stages: [
        {
          stageId: 'y12-std-l2-s1', code: '2A', title: 'Investment and Loans',
          outcomeIds: ['MS2-12-2'], topicIds: ['MS-F4'],
          explanation: 'Apply compound interest A = P(1 + r)ⁿ to investments and loans. For reducing balance loans, each repayment covers interest on the outstanding balance and reduces the principal. Use tables, recurrence relations (Aₙ = Aₙ₋₁(1+r) − M), and technology to calculate repayments, outstanding balances, and total interest paid.',
        },
        {
          stageId: 'y12-std-l2-s2', code: '2B', title: 'Annuities',
          outcomeIds: ['MS2-12-2'], topicIds: ['MS-F5'],
          explanation: 'An annuity is a sequence of equal payments at regular intervals. Future value FV = M[(1+r)ⁿ − 1]/r accumulates to a lump sum. Present value PV = M[1 − (1+r)⁻ⁿ]/r finds the loan principal. Use these formulas and tables to plan superannuation, mortgage repayments, and savings targets.',
        },
      ],
    },
    // ── Area: Measurement ────────────────────────────────────────────────────
    {
      levelId: 'y12-std-l3', levelNum: 3, title: 'Measurement', emoji: '📏', color: '#0EA5E9',
      stages: [
        {
          stageId: 'y12-std-l3-s1', code: '3A', title: 'Non-Right-Angled Trigonometry',
          outcomeIds: ['MS2-12-3'], topicIds: ['MS-M6'],
          explanation: 'Sine rule: a/sinA = b/sinB = c/sinC — use with AAS, ASA, or SSA (beware ambiguous case). Cosine rule: c² = a² + b² − 2ab cosC — use with SAS or SSS. Area of triangle = ½ab sinC. Apply to surveying, bearings, and navigation problems. Draw clear diagrams and set up equations systematically.',
        },
        {
          stageId: 'y12-std-l3-s2', code: '3B', title: 'Rates and Ratios',
          outcomeIds: ['MS2-12-3'], topicIds: ['MS-M7'],
          explanation: 'Rates compare quantities with different units (km/h, $/L, mL/min). Solve rate problems by forming equations and substituting. Scale drawings: actual measurement = scale measurement × ratio. Interpret plans and maps using scales. Divide quantities in given ratios and solve problems involving proportional reasoning.',
        },
      ],
    },
    // ── Area: Networks ───────────────────────────────────────────────────────
    {
      levelId: 'y12-std-l4', levelNum: 4, title: 'Networks', emoji: '🕸️', color: '#8B5CF6',
      stages: [
        {
          stageId: 'y12-std-l4-s1', code: '4A', title: 'Network Flow',
          outcomeIds: ['MS2-12-4'], topicIds: ['MS-N2'],
          explanation: 'A flow network has a source (in-flow only), a sink (out-flow only), and edges with capacities. The flow through each vertex satisfies conservation: in-flow = out-flow. The maximum flow equals the minimum cut (max-flow min-cut theorem). Identify minimum cuts to find the maximum flow through a network.',
        },
        {
          stageId: 'y12-std-l4-s2', code: '4B', title: 'Critical Path Analysis',
          outcomeIds: ['MS2-12-4'], topicIds: ['MS-N3'],
          explanation: 'Model a project as a network of activities with durations and precedence constraints. Earliest start time (EST) and latest start time (LST) are found by forward and backward passes. Float = LST − EST. The critical path consists of activities with zero float — any delay on the critical path delays the project.',
        },
      ],
    },
    // ── Area: Statistics ─────────────────────────────────────────────────────
    {
      levelId: 'y12-std-l5', levelNum: 5, title: 'Statistics', emoji: '📊', color: '#F59E0B',
      stages: [
        {
          stageId: 'y12-std-l5-s1', code: '5A', title: 'Bivariate Data Analysis',
          outcomeIds: ['MS2-12-5'], topicIds: ['MS-S4'],
          explanation: 'A scatterplot displays two numerical variables. Pearson\'s correlation coefficient r measures linear association: r ∈ [−1, 1]. The least-squares regression line ŷ = a + bx minimises the sum of squared residuals. Use the regression line to predict y for a given x, but only interpolate (not extrapolate). Correlation does not imply causation.',
        },
        {
          stageId: 'y12-std-l5-s2', code: '5B', title: 'Relative Frequency and Probability',
          outcomeIds: ['MS2-12-5'], topicIds: ['MS-S5'],
          explanation: 'Relative frequency = (frequency)/(total) estimates probability. P(event) = (favourable outcomes)/(equally likely total). Complementary: P(A\') = 1 − P(A). Venn diagrams and two-way tables organise two events. Expected frequency = n × P(event). Multi-stage events: use tree diagrams and the multiplication principle.',
        },
        {
          stageId: 'y12-std-l5-s3', code: '5C', title: 'The Normal Distribution',
          outcomeIds: ['MS2-12-5'], topicIds: ['MS-S5'],
          explanation: 'The normal distribution is symmetric and bell-shaped with mean μ and standard deviation σ. Standardise with z = (x − μ)/σ to compare values from different distributions. Empirical rule: 68% within 1σ, 95% within 2σ, 99.7% within 3σ. Use z-scores to find probabilities and percentiles.',
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
    // ── Area: Proof ──────────────────────────────────────────────────────────
    {
      levelId: 'y12-ext2-l1', levelNum: 1, title: 'Proof', emoji: '🔍', color: '#6366F1',
      stages: [
        {
          stageId: 'y12-ext2-l1-s1', code: '1A', title: 'The Nature of Proof',
          outcomeIds: ['MEX12-1'], topicIds: ['MEX-P1'],
          explanation: 'Prove inequalities using algebraic techniques: multiply out and rearrange, use AM-GM inequality, or argue via properties of squares (x² ≥ 0). Prove conditional statements and biconditionals. Further proof by mathematical induction: summation formulas, divisibility, inequalities, and matrix powers. Understand the structure of a rigorous proof and avoid circular arguments.',
        },
      ],
    },
    // ── Area: Vectors ────────────────────────────────────────────────────────
    {
      levelId: 'y12-ext2-l2', levelNum: 2, title: 'Further Work with Vectors', emoji: '→', color: '#8B5CF6',
      stages: [
        {
          stageId: 'y12-ext2-l2-s1', code: '2A', title: 'Vector Equations of Lines and Curves',
          outcomeIds: ['MEX12-2'], topicIds: ['MEX-V1'],
          explanation: 'The vector equation of a line through point a with direction d is r = a + td, t ∈ ℝ. Convert between vector, parametric, and Cartesian forms. Find intersections by equating components. The vector equation of a circle and other curves. Apply vectors to prove geometrical results such as concurrency of medians and perpendicularity.',
        },
      ],
    },
    // ── Area: Complex Numbers ────────────────────────────────────────────────
    {
      levelId: 'y12-ext2-l3', levelNum: 3, title: 'Complex Numbers', emoji: '𝑖', color: '#0EA5E9',
      stages: [
        {
          stageId: 'y12-ext2-l3-s1', code: '3A', title: 'Introduction to Complex Numbers',
          outcomeIds: ['MEX12-3'], topicIds: ['MEX-N1'],
          explanation: 'Define i = √(−1), so i² = −1. A complex number z = x + iy has real part Re(z) = x and imaginary part Im(z) = y. The Argand diagram plots z as the point (x, y). Modulus: |z| = √(x²+y²). Argument: arg(z) = θ where tanθ = y/x (with correct quadrant). Conjugate: z̄ = x − iy. Polar form: z = r(cosθ + i sinθ) = re^(iθ). De Moivre\'s theorem: zⁿ = rⁿ(cos nθ + i sin nθ).',
        },
      ],
    },
    // ── Area: Calculus ───────────────────────────────────────────────────────
    {
      levelId: 'y12-ext2-l4', levelNum: 4, title: 'Further Integration', emoji: '∫', color: '#EC4899',
      stages: [
        {
          stageId: 'y12-ext2-l4-s1', code: '4A', title: 'Further Integration Techniques',
          outcomeIds: ['MEX12-5'], topicIds: ['MEX-C1'],
          explanation: 'Advanced integration: partial fractions (decompose rational functions before integrating), trigonometric substitutions (x = a sinθ or a tanθ to integrate √(a²−x²) or 1/(a²+x²)), integration by parts applied repeatedly or in a table. Evaluate definite integrals involving these techniques and identify when each method applies.',
        },
      ],
    },
    // ── Area: Mechanics ──────────────────────────────────────────────────────
    {
      levelId: 'y12-ext2-l5', levelNum: 5, title: 'Mechanics', emoji: '⚡', color: '#14B8A6',
      stages: [
        {
          stageId: 'y12-ext2-l5-s1', code: '5A', title: 'Applications of Calculus to Mechanics',
          outcomeIds: ['MEX12-6'], topicIds: ['MEX-M1'],
          explanation: 'Newton\'s second law: F = ma = m(dv/dt). Solve equations of motion involving forces such as gravity, air resistance proportional to velocity or velocity squared, and spring forces. Express acceleration as a = v(dv/dx) to solve problems where the force depends on position. Model and solve simple harmonic motion x = a sin(nt + φ) where a is amplitude and n is angular frequency, giving a = −n²x.',
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
  { year: 11, course: 'extension2', label: 'Year 11 Extension 2',      shortLabel: '11 Ext2', missionId: 'y11-ext2', available: false },
  { year: 12, course: 'standard',   label: 'Year 12 Standard',         shortLabel: '12 Std',  missionId: 'y12-std',  available: true  },
  { year: 12, course: 'advanced',   label: 'Year 12 Advanced',         shortLabel: '12 Adv',  missionId: 'y12-adv',  available: true  },
  { year: 12, course: 'extension1', label: 'Year 12 Extension 1',      shortLabel: '12 Ext1', missionId: 'y12-ext1', available: true  },
  { year: 12, course: 'extension2', label: 'Year 12 Extension 2',      shortLabel: '12 Ext2', missionId: 'y12-ext2', available: true  },
]
