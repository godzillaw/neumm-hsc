import type { ExplanationBlock } from './curriculum'

export const STAGE_CONTENT_Y9_Y10: Record<string, ExplanationBlock[]> = {

  // ════════════════════════════════════════════════════════════════════════════
  // YEAR 9
  // ════════════════════════════════════════════════════════════════════════════

  // ── Y9 L1 S1: Earning Money ─────────────────────────────────────────────────
  'y9-l1-s1': [
    {
      type: 'text',
      body: 'Income can take many forms: a wage is paid at an hourly rate, a salary is a fixed annual amount, overtime is paid at a higher rate for extra hours, commission is a percentage of sales, and piecework pays a fixed amount per item completed. After calculating gross income, income tax (PAYG) is deducted to give net (take-home) pay.',
    },
    {
      type: 'rules',
      heading: 'Income formulas',
      items: [
        'Wage = hourly rate × hours worked',
        'Overtime pay = overtime rate × overtime hours  (e.g. time-and-a-half = 1.5 × normal rate)',
        'Commission = percentage rate × value of sales',
        'Piecework pay = rate per piece × number of pieces',
        'Net pay = gross pay − tax deducted − other deductions',
      ],
    },
    {
      type: 'example',
      question: 'Mia earns $22.40/h and works 38 ordinary hours plus 3 hours at time-and-a-half. Calculate her gross weekly wage.',
      steps: [
        'Ordinary pay: $22.40 × 38 = $851.20',
        'Overtime rate: $22.40 × 1.5 = $33.60/h',
        'Overtime pay: $33.60 × 3 = $100.80',
        'Gross wage: $851.20 + $100.80 = $952.00',
      ],
    },
    {
      type: 'tip',
      body: 'Always identify what type of income is being described before choosing a formula. Commission problems often give a percentage — remember to convert to a decimal before multiplying.',
    },
  ],

  // ── Y9 L1 S2: Simple Interest and Spending ──────────────────────────────────
  'y9-l1-s2': [
    {
      type: 'text',
      body: 'Simple interest is calculated on the original principal only, making it grow linearly over time. Total amount (A) is what you end up with after adding the interest to the principal. Shopping problems often require applying discounts (subtract a percentage) or GST (add 10% in Australia), and best-buy comparisons use a unit price.',
    },
    {
      type: 'formula',
      latex: 'I = Prt \\qquad A = P + I = P(1 + rt)',
      label: 'Simple interest: P = principal, r = annual rate (decimal), t = time in years',
    },
    {
      type: 'steps',
      heading: 'Solving simple-interest problems',
      items: [
        'Identify P, r, and t — convert r to a decimal and t to years if needed.',
        'Substitute into I = Prt to find interest.',
        'Find total amount: A = P + I.',
        'To find a missing variable, rearrange the formula before substituting.',
      ],
    },
    {
      type: 'example',
      question: 'A $4 500 investment earns simple interest at 3.2% p.a. for 30 months. Find the interest earned and the total value.',
      steps: [
        'P = 4500, r = 0.032, t = 30/12 = 2.5 years.',
        'I = 4500 × 0.032 × 2.5 = $360.',
        'A = 4500 + 360 = $4 860.',
      ],
    },
    {
      type: 'rules',
      heading: 'Discounts, GST, and best buys',
      items: [
        'Discount: Sale price = original × (1 − discount%/100)',
        'GST (10%): Price including GST = original × 1.10',
        'Remove GST: Original = price ÷ 1.10',
        'Best buy: Calculate unit price (cost per gram, per mL, etc.) — lower unit price is the better deal.',
      ],
    },
    {
      type: 'tip',
      body: 'When comparing best buys, always convert to the same unit before dividing. A 750 mL bottle for $3.60 costs $0.0048/mL; a 1.25 L bottle for $5.50 costs $0.0044/mL — the larger bottle is cheaper per mL.',
    },
  ],

  // ── Y9 L2 S1: Scientific Notation ───────────────────────────────────────────
  'y9-l2-s1': [
    {
      type: 'text',
      body: 'Scientific notation (standard form) expresses any number as a × 10ⁿ, where 1 ≤ a < 10 and n is an integer. A positive n means a large number; a negative n means a small number between 0 and 1. Index laws let you multiply and divide numbers in scientific notation without converting to ordinary form.',
    },
    {
      type: 'formula',
      latex: 'a \\times 10^{n}, \\quad 1 \\le a < 10, \\quad n \\in \\mathbb{Z}',
      label: 'Scientific notation form',
    },
    {
      type: 'steps',
      heading: 'Converting to scientific notation',
      items: [
        'Move the decimal point until you have a number between 1 and 10.',
        'Count how many places you moved: right → negative power, left → positive power.',
        'Write a × 10ⁿ with the count as n.',
      ],
    },
    {
      type: 'table',
      headers: ['Ordinary number', 'Scientific notation'],
      rows: [
        ['4 500 000', '4.5 × 10⁶'],
        ['93 000 000 000', '9.3 × 10¹⁰'],
        ['0.000 032', '3.2 × 10⁻⁵'],
        ['0.0000001', '1 × 10⁻⁷'],
      ],
    },
    {
      type: 'rules',
      heading: 'Multiplying and dividing in scientific notation',
      items: [
        '$(a \\times 10^m) \\times (b \\times 10^n) = (a \\times b) \\times 10^{m+n}$',
        '$(a \\times 10^m) \\div (b \\times 10^n) = (a \\div b) \\times 10^{m-n}$',
        'Adjust if the result has a coefficient outside [1, 10).',
      ],
    },
    {
      type: 'example',
      question: 'Calculate (3.6 × 10⁸) ÷ (1.2 × 10⁵), giving the answer in scientific notation.',
      steps: [
        'Divide coefficients: 3.6 ÷ 1.2 = 3.',
        'Subtract exponents: 10⁸ ÷ 10⁵ = 10³.',
        'Answer: 3 × 10³.',
      ],
    },
    {
      type: 'tip',
      body: 'After multiplying or dividing, always check whether your coefficient is still between 1 and 10. If you get 12.4 × 10², rewrite it as 1.24 × 10³.',
    },
  ],

  // ── Y9 L2 S2: Significant Figures and Error ─────────────────────────────────
  'y9-l2-s2': [
    {
      type: 'text',
      body: 'Significant figures (sig figs) indicate the precision of a measurement — they are the digits that carry meaning. Zeros between non-zero digits and trailing zeros after a decimal point are significant; leading zeros are not. When a measurement is rounded, there is always some error: absolute error measures the size of the discrepancy, while percentage error shows it relative to the true value.',
    },
    {
      type: 'rules',
      heading: 'Rules for significant figures',
      items: [
        'All non-zero digits are significant.',
        'Zeros between non-zero digits are significant (e.g. 4 007 has 4 sig figs).',
        'Leading zeros are NOT significant (e.g. 0.0032 has 2 sig figs).',
        'Trailing zeros after a decimal point ARE significant (e.g. 3.400 has 4 sig figs).',
        'Trailing zeros in a whole number are ambiguous unless scientific notation is used.',
      ],
    },
    {
      type: 'formula',
      latex: '\\text{Absolute error} = |\\text{measured} - \\text{true}| \\qquad \\text{Percentage error} = \\frac{\\text{absolute error}}{\\text{true value}} \\times 100\\%',
      label: 'Error formulas',
    },
    {
      type: 'example',
      question: 'A student measures a rod as 18.3 cm; its true length is 18.6 cm. Find the absolute and percentage errors.',
      steps: [
        'Absolute error: |18.3 − 18.6| = 0.3 cm.',
        'Percentage error: (0.3 / 18.6) × 100% ≈ 1.6%.',
      ],
    },
    {
      type: 'tip',
      body: 'When rounding to a given number of significant figures, find the first digit to be dropped: if it is 5 or more, round the last kept digit up. The position of the decimal point does not affect the count of significant figures.',
    },
  ],

  // ── Y9 L3 S1: Algebraic Techniques A ────────────────────────────────────────
  'y9-l3-s1': [
    {
      type: 'text',
      body: 'Algebraic techniques let you simplify and manipulate expressions efficiently. Adding and subtracting algebraic fractions requires a common denominator, just like numeric fractions. Expanding uses the distributive law: every term inside the bracket is multiplied by the term outside.',
    },
    {
      type: 'steps',
      heading: 'Adding/subtracting algebraic fractions',
      items: [
        'Find the lowest common denominator (LCD) of all fractions.',
        'Rewrite each fraction with the LCD as the denominator.',
        'Add or subtract the numerators, keeping the denominator.',
        'Simplify the resulting fraction by cancelling common factors.',
      ],
    },
    {
      type: 'example',
      question: 'Simplify: x/3 + 2x/5',
      steps: [
        'LCD of 3 and 5 is 15.',
        'x/3 = 5x/15; 2x/5 = 6x/15.',
        '5x/15 + 6x/15 = 11x/15.',
      ],
    },
    {
      type: 'rules',
      heading: 'Expanding expressions',
      items: [
        'Distributive law: $a(b + c) = ab + ac$',
        'Two brackets: $(a + b)(c + d) = ac + ad + bc + bd$ (FOIL)',
        'Collect like terms after expanding.',
      ],
    },
    {
      type: 'example',
      question: 'Expand and simplify: 3(2x − 4) − 2(x + 1)',
      steps: [
        '3(2x − 4) = 6x − 12.',
        '−2(x + 1) = −2x − 2.',
        'Combined: 6x − 12 − 2x − 2 = 4x − 14.',
      ],
    },
    {
      type: 'tip',
      body: 'When subtracting a bracket like −2(x + 1), multiply every term inside by −2 — including the +1, which becomes −2. A common error is to forget to distribute the negative sign to every term.',
    },
  ],

  // ── Y9 L3 S2: Indices A ──────────────────────────────────────────────────────
  'y9-l3-s2': [
    {
      type: 'text',
      body: 'Index laws are shortcuts for working with powers of the same base. They reduce expressions involving multiplication, division, and powers of powers to simple addition or subtraction of exponents. A zero exponent always gives 1, and a negative exponent means "take the reciprocal".',
    },
    {
      type: 'rules',
      heading: 'Index laws',
      items: [
        '$a^m \\times a^n = a^{m+n}$ (same base: add exponents when multiplying)',
        '$a^m \\div a^n = a^{m-n}$ (same base: subtract exponents when dividing)',
        '$(a^m)^n = a^{mn}$ (power of a power: multiply exponents)',
        '$(ab)^n = a^n b^n$ (power of a product)',
        '$a^0 = 1$ for any $a \\ne 0$',
        '$a^{-n} = \\dfrac{1}{a^n}$ (negative index = reciprocal)',
      ],
    },
    {
      type: 'example',
      question: 'Simplify: (3x²y³) × (2x⁻¹y)',
      steps: [
        'Multiply coefficients: 3 × 2 = 6.',
        'Combine x: x² × x⁻¹ = x²⁺⁽⁻¹⁾ = x¹ = x.',
        'Combine y: y³ × y = y³⁺¹ = y⁴.',
        'Result: 6xy⁴.',
      ],
    },
    {
      type: 'example',
      question: 'Simplify: (4a³b)² ÷ (2ab²)²',
      steps: [
        'Expand each bracket: (4a³b)² = 16a⁶b²; (2ab²)² = 4a²b⁴.',
        '16a⁶b² ÷ 4a²b⁴ = 4 × a⁶⁻² × b²⁻⁴ = 4a⁴b⁻².',
        'With positive indices: 4a⁴/b².',
      ],
    },
    {
      type: 'tip',
      body: 'Index laws only apply when bases are the same. Never add or subtract exponents across different bases (e.g. x² × y³ cannot be simplified further).',
    },
  ],

  // ── Y9 L4 S1: Equations A ───────────────────────────────────────────────────
  'y9-l4-s1': [
    {
      type: 'text',
      body: 'Solving an equation means finding the value of the unknown that makes the equation true. You keep the equation balanced by performing the same inverse operation on both sides. Always expand brackets and collect like terms first, then isolate the variable step by step.',
    },
    {
      type: 'steps',
      heading: 'Strategy for solving linear equations',
      items: [
        'Expand all brackets.',
        'Collect like terms on each side.',
        'Move all variable terms to one side using addition or subtraction.',
        'Move all constant terms to the other side.',
        'Divide both sides by the coefficient of the variable.',
        'Check: substitute your answer back into the original equation.',
      ],
    },
    {
      type: 'example',
      question: 'Solve: 3(2x − 1) − 4 = 5(x + 2)',
      steps: [
        'Expand: 6x − 3 − 4 = 5x + 10.',
        'Simplify left side: 6x − 7 = 5x + 10.',
        'Subtract 5x from both sides: x − 7 = 10.',
        'Add 7 to both sides: x = 17.',
        'Check: 3(34 − 1) − 4 = 99 − 4 = 95; 5(17 + 2) = 95. ✓',
      ],
    },
    {
      type: 'example',
      question: 'Solve: x/3 + 2 = x/5 + 4',
      steps: [
        'Multiply every term by the LCD = 15: 5x + 30 = 3x + 60.',
        'Subtract 3x: 2x + 30 = 60.',
        'Subtract 30: 2x = 30.',
        'Divide by 2: x = 15.',
      ],
    },
    {
      type: 'tip',
      body: 'When fractions appear, multiplying every term by the LCD is usually the fastest approach — it clears all denominators in one step.',
    },
  ],

  // ── Y9 L5 S1: Linear Relationships A ────────────────────────────────────────
  'y9-l5-s1': [
    {
      type: 'text',
      body: 'The coordinate plane connects geometry and algebra. The distance formula (derived from Pythagoras) gives the exact length between two points. The midpoint formula finds the average position. The gradient (slope) measures steepness as rise over run. These three tools are the foundation of coordinate geometry.',
    },
    {
      type: 'formula',
      latex: 'd = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}',
      label: 'Distance between two points',
    },
    {
      type: 'formula',
      latex: 'M = \\left(\\frac{x_1+x_2}{2},\\; \\frac{y_1+y_2}{2}\\right)',
      label: 'Midpoint formula',
    },
    {
      type: 'formula',
      latex: 'm = \\frac{y_2 - y_1}{x_2 - x_1} = \\frac{\\text{rise}}{\\text{run}}',
      label: 'Gradient (slope)',
    },
    {
      type: 'example',
      question: 'For A(1, 3) and B(7, 11), find the distance AB, the midpoint M, and the gradient of AB.',
      steps: [
        'Distance: d = √((7−1)² + (11−3)²) = √(36 + 64) = √100 = 10.',
        'Midpoint: M = ((1+7)/2, (3+11)/2) = (4, 7).',
        'Gradient: m = (11−3)/(7−1) = 8/6 = 4/3.',
      ],
    },
    {
      type: 'tip',
      body: 'It does not matter which point you label (x₁, y₁) and which you label (x₂, y₂) for distance or midpoint — the answers are the same. For gradient, keep the same labelling throughout to avoid sign errors.',
    },
  ],

  // ── Y9 L5 S2: Linear Relationships B ────────────────────────────────────────
  'y9-l5-s2': [
    {
      type: 'text',
      body: 'The gradient–intercept form y = mx + b is the most useful equation of a line: m tells you the steepness (rise/run) and b tells you where the line crosses the y-axis. Parallel lines have equal gradients; perpendicular lines have gradients that are negative reciprocals of each other.',
    },
    {
      type: 'formula',
      latex: 'y = mx + b',
      label: 'Gradient–intercept form (m = gradient, b = y-intercept)',
    },
    {
      type: 'rules',
      heading: 'Parallel and perpendicular lines',
      items: [
        'Parallel lines: same gradient $m_1 = m_2$, different y-intercepts.',
        'Perpendicular lines: $m_1 \\times m_2 = -1$, i.e. $m_2 = -\\dfrac{1}{m_1}$.',
        'To find the equation of a line through a point $(x_1, y_1)$ with gradient $m$: substitute into $y - y_1 = m(x - x_1)$, then rearrange to $y = mx + b$.',
      ],
    },
    {
      type: 'example',
      question: 'Find the equation of the line perpendicular to y = 2x − 3 that passes through (4, 1).',
      steps: [
        'Gradient of given line: m₁ = 2.',
        'Perpendicular gradient: m₂ = −1/2.',
        'Using point (4, 1): y − 1 = −½(x − 4).',
        'Expand: y − 1 = −½x + 2.',
        'Equation: y = −½x + 3.',
      ],
    },
    {
      type: 'tip',
      body: 'To quickly read off gradient and y-intercept, rearrange the equation to y = mx + b form first. For example, 2x − 3y + 6 = 0 becomes y = (2/3)x + 2 (m = 2/3, b = 2).',
    },
  ],

  // ── Y9 L6 S1: Non-Linear Relationships A ────────────────────────────────────
  'y9-l6-s1': [
    {
      type: 'text',
      body: 'Not all relationships are linear. Quadratic functions (y = ax² + bx + c) produce parabolas — U-shaped (a > 0) or ∩-shaped (a < 0) curves. Exponential functions (y = aˣ) produce rapidly rising (a > 1) or falling (0 < a < 1) curves that never reach zero. Recognising the shape from the equation is the first step.',
    },
    {
      type: 'rules',
      heading: 'Key features of quadratics y = ax² + bx + c',
      items: [
        'Parabola opens upward if $a > 0$, downward if $a < 0$.',
        'Axis of symmetry: $x = -b/(2a)$.',
        'Turning point (vertex): substitute $x = -b/(2a)$ to find y.',
        'y-intercept: set $x = 0$ to get $(0, c)$.',
        'x-intercepts: solve $ax^2 + bx + c = 0$ (may have 0, 1, or 2 solutions).',
      ],
    },
    {
      type: 'rules',
      heading: 'Key features of exponentials y = aˣ',
      items: [
        'Always passes through $(0, 1)$ since $a^0 = 1$.',
        'Horizontal asymptote: $y = 0$ (x-axis).',
        '$a > 1$: exponential growth (curve rises steeply to the right).',
        '$0 < a < 1$: exponential decay (curve falls towards the asymptote).',
      ],
    },
    {
      type: 'tip',
      body: 'When identifying the type of relationship from a table of values, check differences: a constant first difference → linear; a constant second difference → quadratic; a constant ratio of successive terms → exponential.',
    },
  ],

  // ── Y9 L6 S2: Non-Linear Relationships B ────────────────────────────────────
  'y9-l6-s2': [
    {
      type: 'text',
      body: 'Sketching non-linear graphs accurately requires plotting key features rather than plotting dozens of individual points. For parabolas, find the vertex, axis of symmetry, intercepts, and note the direction of opening. For exponential curves, identify the asymptote, the y-intercept, and one or two additional points.',
    },
    {
      type: 'steps',
      heading: 'Sketching a parabola y = ax² + bx + c',
      items: [
        'Determine direction (up if a > 0, down if a < 0).',
        'Find the axis of symmetry: x = −b/(2a).',
        'Find the vertex: substitute x back in.',
        'Find the y-intercept: (0, c).',
        'Find x-intercepts (if they exist): solve ax² + bx + c = 0.',
        'Plot key points and draw a smooth curve.',
      ],
    },
    {
      type: 'steps',
      heading: 'Describing transformations',
      items: [
        'y = ax² → vertical dilation by |a|; reflection if a < 0.',
        'y = (x − h)² → horizontal shift right by h.',
        'y = x² + k → vertical shift up by k.',
        'Combining: y = a(x − h)² + k has vertex at (h, k).',
      ],
    },
    {
      type: 'example',
      question: 'Describe the transformations and sketch y = −(x + 2)² + 3.',
      steps: [
        'a = −1: parabola opens downward.',
        'h = −2, k = 3: vertex at (−2, 3).',
        'Axis of symmetry: x = −2.',
        'y-intercept: y = −(0 + 2)² + 3 = −4 + 3 = −1 → (0, −1).',
        'Sketch: downward parabola, vertex at (−2, 3), passing through (0, −1).',
      ],
    },
  ],

  // ── Y9 L7 S1: Area and Surface Area A ───────────────────────────────────────
  'y9-l7-s1': [
    {
      type: 'text',
      body: 'Area problems at Year 9 combine standard formulas with composite shapes. Surface area of a 3D solid is the total area of all its faces laid flat. Cylinders have two circular ends and one curved rectangular face.',
    },
    {
      type: 'table',
      headers: ['Shape', 'Area Formula'],
      rows: [
        ['Triangle', 'A = ½bh'],
        ['Parallelogram', 'A = bh'],
        ['Trapezium', 'A = ½(a + b)h'],
        ['Circle', 'A = πr²'],
        ['Sector (angle θ°)', 'A = (θ/360) × πr²'],
      ],
    },
    {
      type: 'formula',
      latex: 'SA_{\\text{cylinder}} = 2\\pi r^2 + 2\\pi r h',
      label: 'Surface area of a cylinder (two circles + curved face)',
    },
    {
      type: 'steps',
      heading: 'Composite areas',
      items: [
        'Break the shape into simpler parts whose formulas you know.',
        'Calculate each part separately.',
        'Add areas (or subtract for cut-out regions).',
        'State the units (e.g. cm², m²).',
      ],
    },
    {
      type: 'example',
      question: 'Find the surface area of a closed cylinder with radius 4 cm and height 10 cm.',
      steps: [
        'Two circles: 2 × π × 4² = 32π cm².',
        'Curved face: 2π × 4 × 10 = 80π cm².',
        'Total SA = 32π + 80π = 112π ≈ 351.9 cm².',
      ],
    },
    {
      type: 'tip',
      body: 'For a hollow cylinder (open at both ends) or a half-open cylinder, carefully identify which faces are present before summing areas.',
    },
  ],

  // ── Y9 L7 S2: Volume A ───────────────────────────────────────────────────────
  'y9-l7-s2': [
    {
      type: 'text',
      body: 'Volume of any right prism (including cylinders) is simply base area multiplied by height. Composite solids are broken into simpler parts. Unit conversions follow from the fact that 1 m = 100 cm, so 1 m³ = 1 000 000 cm³.',
    },
    {
      type: 'formula',
      latex: 'V_{\\text{prism}} = A_{\\text{base}} \\times h \\qquad V_{\\text{cylinder}} = \\pi r^2 h',
      label: 'Volume of prism and cylinder',
    },
    {
      type: 'table',
      headers: ['Conversion', 'Factor'],
      rows: [
        ['1 cm³ → mm³', '× 1000'],
        ['1 m³ → cm³', '× 1 000 000'],
        ['1 L → cm³', '= 1000 cm³'],
        ['1 kL → m³', '= 1 m³'],
      ],
    },
    {
      type: 'example',
      question: 'A composite solid consists of a rectangular prism (4 m × 3 m × 2 m) with a half-cylinder on top (radius 1.5 m, length 4 m). Find the total volume.',
      steps: [
        'Volume of rectangular prism: 4 × 3 × 2 = 24 m³.',
        'Volume of full cylinder: π × 1.5² × 4 = 9π m³.',
        'Half-cylinder: 9π/2 ≈ 14.14 m³.',
        'Total: 24 + 14.14 ≈ 38.1 m³.',
      ],
    },
    {
      type: 'tip',
      body: 'Always check units before calculating. If radius is in centimetres and height in metres, convert one to match the other first, then apply the formula.',
    },
  ],

  // ── Y9 L8 S1: Trigonometry A ─────────────────────────────────────────────────
  'y9-l8-s1': [
    {
      type: 'text',
      body: 'Trigonometry links angles to side ratios in right-angled triangles. The three primary ratios are sine, cosine, and tangent, remembered as SOH CAH TOA. Use these to find unknown sides when an angle and one side are known, or to find angles when two sides are known.',
    },
    {
      type: 'formula',
      latex: '\\sin\\theta = \\frac{O}{H}, \\quad \\cos\\theta = \\frac{A}{H}, \\quad \\tan\\theta = \\frac{O}{A}',
      label: 'SOH CAH TOA (O = opposite, A = adjacent, H = hypotenuse)',
    },
    {
      type: 'steps',
      heading: 'Finding an unknown side',
      items: [
        'Label the sides relative to the known angle: Opposite (O), Adjacent (A), Hypotenuse (H).',
        'Choose the ratio that involves the known side and the unknown side.',
        'Set up the equation and solve by multiplication or division.',
        'Round at the final step.',
      ],
    },
    {
      type: 'steps',
      heading: 'Finding an unknown angle',
      items: [
        'Label the two known sides (O, A, or H).',
        'Choose the ratio involving those two sides.',
        'Use the inverse function: θ = sin⁻¹(O/H), cos⁻¹(A/H), or tan⁻¹(O/A).',
        'Round to the required precision.',
      ],
    },
    {
      type: 'example',
      question: 'In a right triangle, the angle is 35° and the hypotenuse is 12 cm. Find the opposite side.',
      steps: [
        'Use sin: sin 35° = O/12.',
        'O = 12 × sin 35° ≈ 12 × 0.5736 ≈ 6.88 cm.',
      ],
    },
    {
      type: 'tip',
      body: 'Always draw and label the triangle before choosing a ratio. The hypotenuse is always opposite the right angle — it is always the longest side. The opposite and adjacent sides depend on which angle you are using.',
    },
  ],

  // ── Y9 L8 S2: Trigonometry B ─────────────────────────────────────────────────
  'y9-l8-s2': [
    {
      type: 'text',
      body: 'Angles of elevation and depression arise when you look up or down from the horizontal. Bearings describe direction using angles measured clockwise from North. Both topics require clear diagrams with right-angled triangles correctly labelled before applying trigonometric ratios.',
    },
    {
      type: 'rules',
      heading: 'Elevation, depression, and bearings',
      items: [
        'Angle of elevation: angle measured upward from the horizontal to an object above.',
        'Angle of depression: angle measured downward from the horizontal to an object below.',
        'Alternate interior angles mean the angle of elevation = angle of depression for the same pair of points.',
        'Bearings: always 3-digit clockwise from North (e.g. N35°E = bearing 035°).',
      ],
    },
    {
      type: 'example',
      question: 'A lighthouse is 80 m tall. From a boat, the angle of elevation to the top is 12°. How far is the boat from the base of the lighthouse?',
      steps: [
        'Draw a right triangle: vertical side = 80 m, angle at boat = 12°.',
        'tan 12° = 80 / d → d = 80 / tan 12°.',
        'd ≈ 80 / 0.2126 ≈ 376 m.',
      ],
    },
    {
      type: 'example',
      question: 'A plane flies 200 km on a bearing of 060°, then 150 km due South. How far is it from its starting point?',
      steps: [
        'Draw the two-leg journey and identify the right-triangle components.',
        'East component of first leg: 200 sin 60° ≈ 173.2 km.',
        'North component of first leg: 200 cos 60° = 100 km; South leg = 150 km → net South = 50 km.',
        'Distance: √(173.2² + 50²) ≈ √(29 998 + 2 500) ≈ √32 498 ≈ 180 km.',
      ],
    },
    {
      type: 'tip',
      body: 'Always draw bearings starting from North pointing up the page. Mark the angle clockwise from North so you can clearly see which trig ratio to apply.',
    },
  ],

  // ── Y9 L9 S1: Properties of Geometrical Figures A ───────────────────────────
  'y9-l9-s1': [
    {
      type: 'text',
      body: 'Similar figures have the same shape but different sizes. All corresponding angles are equal, and all corresponding sides are in the same ratio (the scale factor k). This scale factor is powerful: lengths scale by k, areas scale by k², and volumes scale by k³.',
    },
    {
      type: 'formula',
      latex: '\\frac{\\text{image length}}{\\text{original length}} = k \\qquad \\frac{\\text{image area}}{\\text{original area}} = k^2 \\qquad \\frac{\\text{image volume}}{\\text{original volume}} = k^3',
      label: 'Scale factor relationships',
    },
    {
      type: 'steps',
      heading: 'Solving similarity problems',
      items: [
        'Match corresponding vertices (named in the same order or from the diagram).',
        'Set up the ratio: image side / original side = k.',
        'Use k to find unknown sides: unknown = known × k.',
        'For area or volume, raise k to the appropriate power.',
      ],
    },
    {
      type: 'example',
      question: 'Two similar rectangles have corresponding sides of 6 cm and 9 cm. If the area of the smaller is 48 cm², find the area of the larger.',
      steps: [
        'Scale factor: k = 9/6 = 1.5.',
        'Area scale factor: k² = 1.5² = 2.25.',
        'Area of larger: 48 × 2.25 = 108 cm².',
      ],
    },
    {
      type: 'tip',
      body: 'Always identify which figure is the original and which is the image before computing k. If you set up the ratio the wrong way, your answers for lengths, areas, and volumes will all be inverted.',
    },
  ],

  // ── Y9 L10 S1: Data Analysis A ──────────────────────────────────────────────
  'y9-l10-s1': [
    {
      type: 'text',
      body: 'Standard deviation measures how spread out data values are around the mean — a larger standard deviation means the data is more spread. Quartiles split ordered data into four equal quarters. The interquartile range (IQR = Q3 − Q1) measures the spread of the middle 50% and is resistant to outliers. Box plots display all five key values: minimum, Q1, median, Q3, maximum.',
    },
    {
      type: 'rules',
      heading: 'Five-number summary and box plot',
      items: [
        'Minimum: smallest value.',
        'Q1 (lower quartile): median of the lower half.',
        'Q2 (median): middle value of the whole dataset.',
        'Q3 (upper quartile): median of the upper half.',
        'Maximum: largest value.',
        'IQR = Q3 − Q1.',
        'Potential outliers: values below Q1 − 1.5 × IQR or above Q3 + 1.5 × IQR.',
      ],
    },
    {
      type: 'example',
      question: 'Find the five-number summary for: 3, 7, 8, 12, 14, 17, 21, 25.',
      steps: [
        'Ordered data: 3, 7, 8, 12, 14, 17, 21, 25 (n = 8).',
        'Minimum = 3, Maximum = 25.',
        'Median (Q2): average of 4th and 5th = (12 + 14)/2 = 13.',
        'Q1: median of {3, 7, 8, 12} = (7 + 8)/2 = 7.5.',
        'Q3: median of {14, 17, 21, 25} = (17 + 21)/2 = 19.',
        'IQR = 19 − 7.5 = 11.5.',
      ],
    },
    {
      type: 'tip',
      body: 'To compare two datasets using box plots, look at: (1) medians — which distribution has a higher centre; (2) IQR — which is more spread; (3) range — overall spread; (4) any outliers or skew.',
    },
  ],

  // ── Y9 L10 S2: Data Analysis B ──────────────────────────────────────────────
  'y9-l10-s2': [
    {
      type: 'text',
      body: 'Bivariate data involves two variables measured on each individual. A scatterplot displays pairs (x, y) and lets you see the pattern between the variables. You describe the association by its direction (positive or negative), strength (strong, moderate, weak), and form (linear or non-linear). Correlation shows association — but association does not imply causation.',
    },
    {
      type: 'rules',
      heading: 'Describing scatterplot patterns',
      items: [
        'Direction: positive (both increase together), negative (one increases as the other decreases), or no association.',
        'Strength: strong (points close to a line), moderate, or weak (points very scattered).',
        'Form: linear (points suggest a straight line) or non-linear (curved pattern).',
        'Outliers: individual points that lie far from the overall pattern.',
      ],
    },
    {
      type: 'example',
      question: 'A scatterplot of study hours vs. test score shows points rising from bottom-left to top-right in a fairly tight band. Describe the association.',
      steps: [
        'Direction: positive (as study hours increase, test score increases).',
        'Strength: strong (points lie close to a straight line).',
        'Form: linear.',
        'Conclusion: there is a strong, positive linear association between study hours and test score.',
      ],
    },
    {
      type: 'tip',
      body: 'A line of best fit (trend line) is drawn through the middle of the data so that roughly equal numbers of points lie above and below it. You can use it to make predictions, but be cautious about extrapolating far beyond the data range.',
    },
  ],

  // ── Y9 L10 S3: Probability A ─────────────────────────────────────────────────
  'y9-l10-s3': [
    {
      type: 'text',
      body: 'Multi-stage chance experiments can be represented using tree diagrams (showing each branch of outcomes) or two-way tables. When events are independent, the probability of both occurring is the product of their individual probabilities. Without replacement, the probabilities on later branches change because the sample space shrinks.',
    },
    {
      type: 'rules',
      heading: 'Probability rules',
      items: [
        'P(A) is between 0 (impossible) and 1 (certain).',
        'Sum of all outcomes = 1.',
        'P(not A) = 1 − P(A).',
        'Independent events: P(A and B) = P(A) × P(B).',
        'Dependent events (without replacement): update the denominator after each selection.',
      ],
    },
    {
      type: 'example',
      question: 'A bag contains 4 red and 6 blue marbles. Two are drawn without replacement. Find P(both red).',
      steps: [
        'P(1st red) = 4/10 = 2/5.',
        'After 1 red removed: 3 red from 9 remaining. P(2nd red | 1st red) = 3/9 = 1/3.',
        'P(both red) = (2/5) × (1/3) = 2/15.',
      ],
    },
    {
      type: 'tip',
      body: 'When drawing a tree diagram, label each branch with its probability. Multiply along branches for "and", and add across branches for "or". Always check that probabilities on branches from any single node sum to 1.',
    },
  ],

  // ════════════════════════════════════════════════════════════════════════════
  // YEAR 10
  // ════════════════════════════════════════════════════════════════════════════

  // ── Y10 L1 S1: Compound Interest and Depreciation ────────────────────────────
  'y10-l1-s1': [
    {
      type: 'text',
      body: 'Compound interest is interest earned on both the original principal and the accumulated interest from previous periods. It grows exponentially, making it much more powerful than simple interest over long periods. Depreciation (reducing-balance) uses the same formula with the rate subtracted, modelling items that decrease in value each period.',
    },
    {
      type: 'formula',
      latex: 'A = P\\left(1 + r\\right)^n \\qquad V = P\\left(1 - r\\right)^n',
      label: 'A = amount after n periods (interest); V = value after n periods (depreciation)',
    },
    {
      type: 'rules',
      heading: 'Adjusting for compounding frequency',
      items: [
        'r = annual rate ÷ periods per year',
        'n = years × periods per year',
        'Quarterly: divide rate by 4, multiply years by 4.',
        'Monthly: divide rate by 12, multiply years by 12.',
      ],
    },
    {
      type: 'example',
      question: '$8 000 is invested at 6% p.a. compounded monthly for 3 years. Find the final amount.',
      steps: [
        'r = 0.06/12 = 0.005 per month.',
        'n = 3 × 12 = 36 months.',
        'A = 8000 × (1.005)³⁶ ≈ 8000 × 1.1967 ≈ $9 573.50.',
      ],
    },
    {
      type: 'example',
      question: 'A car costs $25 000 and depreciates at 15% p.a. Find its value after 4 years.',
      steps: [
        'V = 25 000 × (1 − 0.15)⁴ = 25 000 × (0.85)⁴.',
        '(0.85)⁴ ≈ 0.5220.',
        'V ≈ $13 050.',
      ],
    },
    {
      type: 'tip',
      body: 'To compare simple and compound interest, calculate both for the same P, r, and t. Compound interest always gives a larger (or equal) amount over more than one period, and the gap widens with time.',
    },
  ],

  // ── Y10 L2 S1: Algebraic Techniques B ───────────────────────────────────────
  'y10-l2-s1': [
    {
      type: 'text',
      body: 'Factorisation is the reverse of expansion. The three key techniques at this level are: taking out the highest common factor (HCF), expanding binomials using FOIL, and factorising monic quadratics by finding the factor pair.',
    },
    {
      type: 'steps',
      heading: 'Factorising monic quadratics x² + bx + c',
      items: [
        'Find two numbers that multiply to c and add to b.',
        'Write the factorised form: (x + p)(x + q) where p × q = c and p + q = b.',
        'Check by expanding back out.',
      ],
    },
    {
      type: 'example',
      question: 'Factorise: x² + 7x + 12',
      steps: [
        'Need two numbers that multiply to 12 and add to 7.',
        '3 × 4 = 12 and 3 + 4 = 7.',
        'Factorised: (x + 3)(x + 4).',
      ],
    },
    {
      type: 'example',
      question: 'Factorise: x² − 5x − 14',
      steps: [
        'Need two numbers that multiply to −14 and add to −5.',
        '−7 × 2 = −14 and −7 + 2 = −5.',
        'Factorised: (x − 7)(x + 2).',
      ],
    },
    {
      type: 'tip',
      body: 'Always take out the HCF first before attempting other factorisation methods. For example, 2x² + 8x + 6 = 2(x² + 4x + 3) = 2(x + 1)(x + 3).',
    },
  ],

  // ── Y10 L2 S2: Algebraic Techniques C ───────────────────────────────────────
  'y10-l2-s2': [
    {
      type: 'text',
      body: 'The special product identities allow rapid expansion and factorisation without FOIL. The difference of two squares and perfect square trinomial patterns appear frequently in algebra, calculus, and geometry. Factorising non-monic quadratics (where the leading coefficient is not 1) requires either the grouping (AC) method or the quadratic formula.',
    },
    {
      type: 'rules',
      heading: 'Special product identities',
      items: [
        'Difference of two squares: $a^2 - b^2 = (a+b)(a-b)$',
        'Perfect square (sum): $(a+b)^2 = a^2 + 2ab + b^2$',
        'Perfect square (difference): $(a-b)^2 = a^2 - 2ab + b^2$',
      ],
    },
    {
      type: 'steps',
      heading: 'Factorising non-monic quadratics ax² + bx + c (AC method)',
      items: [
        'Multiply a × c to get the product.',
        'Find two numbers that multiply to ac and add to b.',
        'Split the middle term bx into two terms using those numbers.',
        'Factor by grouping: take out HCF from each pair.',
      ],
    },
    {
      type: 'example',
      question: 'Factorise: 6x² + 11x + 4',
      steps: [
        'a × c = 6 × 4 = 24.',
        'Find two numbers: 8 × 3 = 24 and 8 + 3 = 11.',
        'Split: 6x² + 8x + 3x + 4.',
        'Group: 2x(3x + 4) + 1(3x + 4) = (2x + 1)(3x + 4).',
      ],
    },
    {
      type: 'example',
      question: 'Simplify: (x² − 9) / (x² + 6x + 9)',
      steps: [
        'Factorise numerator: x² − 9 = (x + 3)(x − 3).',
        'Factorise denominator: x² + 6x + 9 = (x + 3)².',
        'Cancel (x + 3): result = (x − 3)/(x + 3).',
      ],
    },
  ],

  // ── Y10 L2 S3: Indices B ─────────────────────────────────────────────────────
  'y10-l2-s3': [
    {
      type: 'text',
      body: 'All index laws extend to algebraic expressions with negative-integer indices. The key strategy is to apply laws in a logical order: deal with powers of powers first, then multiply or divide, then convert any remaining negative indices to positive form by taking reciprocals.',
    },
    {
      type: 'steps',
      heading: 'Simplifying expressions with negative indices',
      items: [
        'Apply the power of a power law first: $(a^m)^n = a^{mn}$.',
        'Multiply or divide using product/quotient laws.',
        'Convert negative indices: $a^{-n} = 1/a^n$.',
        'Express the answer with positive indices only.',
      ],
    },
    {
      type: 'example',
      question: 'Simplify: (2x⁻³y²)⁻²',
      steps: [
        'Apply the outer power −2 to each factor: 2⁻² × x⁶ × y⁻⁴.',
        '2⁻² = 1/4.',
        'Result: x⁶/(4y⁴).',
      ],
    },
    {
      type: 'example',
      question: 'Simplify: (3a²b⁻¹)³ ÷ (9a⁻¹b²)',
      steps: [
        'Expand numerator: 3³ × a⁶ × b⁻³ = 27a⁶b⁻³.',
        'Divide: 27a⁶b⁻³ ÷ 9a⁻¹b² = (27/9) × a⁶⁻⁽⁻¹⁾ × b⁻³⁻².',
        '= 3 × a⁷ × b⁻⁵ = 3a⁷/b⁵.',
      ],
    },
    {
      type: 'tip',
      body: 'When dividing, subtracting a negative exponent is the same as adding. For example, a⁶ ÷ a⁻¹ = a⁶⁻⁽⁻¹⁾ = a⁷. Keep track of signs carefully.',
    },
  ],

  // ── Y10 L2 S4: Indices C — Surds and Fractional Indices ──────────────────────
  'y10-l2-s4': [
    {
      type: 'text',
      body: 'Surds are irrational square (or higher) roots that cannot be simplified to a rational number. They are left in exact form. Fractional indices connect surds and powers: the denominator of the fraction is the root, and the numerator is the power. Rationalising the denominator removes surds from the bottom of a fraction.',
    },
    {
      type: 'formula',
      latex: 'a^{1/n} = \\sqrt[n]{a} \\qquad a^{m/n} = \\left(\\sqrt[n]{a}\\right)^m = \\sqrt[n]{a^m}',
      label: 'Fractional indices',
    },
    {
      type: 'rules',
      heading: 'Surd operations',
      items: [
        'Simplify: $\\sqrt{12} = \\sqrt{4 \\times 3} = 2\\sqrt{3}$',
        'Multiply: $\\sqrt{a} \\times \\sqrt{b} = \\sqrt{ab}$',
        'Add/subtract: only like surds can be combined (e.g. $3\\sqrt{2} + 5\\sqrt{2} = 8\\sqrt{2}$)',
        'Rationalise: $\\dfrac{1}{\\sqrt{a}} = \\dfrac{\\sqrt{a}}{a}$',
        'Rationalise (binomial): multiply by conjugate $\\dfrac{1}{a+\\sqrt{b}} \\times \\dfrac{a-\\sqrt{b}}{a-\\sqrt{b}}$',
      ],
    },
    {
      type: 'example',
      question: 'Simplify: (√75 − 2√3) / √3',
      steps: [
        '√75 = √(25×3) = 5√3.',
        'Numerator: 5√3 − 2√3 = 3√3.',
        '3√3 / √3 = 3.',
      ],
    },
    {
      type: 'example',
      question: 'Evaluate: 8^(2/3)',
      steps: [
        '8^(1/3) = ∛8 = 2.',
        '8^(2/3) = (8^(1/3))² = 2² = 4.',
      ],
    },
    {
      type: 'tip',
      body: 'To simplify √n, find the largest perfect-square factor of n. For √180: 180 = 36 × 5, so √180 = 6√5.',
    },
  ],

  // ── Y10 L3 S1: Equations B ───────────────────────────────────────────────────
  'y10-l3-s1': [
    {
      type: 'text',
      body: 'Solving quadratic equations requires choosing the best method: factorisation is fastest when the quadratic factors nicely; the quadratic formula always works. Linear inequalities are solved like equations except that multiplying or dividing by a negative number reverses the inequality sign.',
    },
    {
      type: 'formula',
      latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
      label: 'Quadratic formula for ax² + bx + c = 0',
    },
    {
      type: 'steps',
      heading: 'Solving by factorisation',
      items: [
        'Rearrange so the equation equals zero.',
        'Factorise the left side.',
        'Apply the Null Factor Law: if (x − p)(x − q) = 0, then x = p or x = q.',
      ],
    },
    {
      type: 'example',
      question: 'Solve: 2x² − 7x − 15 = 0',
      steps: [
        'Using the quadratic formula: a=2, b=−7, c=−15.',
        'Discriminant: (−7)² − 4(2)(−15) = 49 + 120 = 169.',
        'x = (7 ± 13) / 4.',
        'x = 20/4 = 5 or x = −6/4 = −3/2.',
      ],
    },
    {
      type: 'rules',
      heading: 'Solving linear inequalities',
      items: [
        'Treat like an equation: add, subtract, multiply, divide.',
        'If you multiply or divide by a negative number, REVERSE the inequality sign.',
        'Graph the solution on a number line (open circle for < or >, closed for ≤ or ≥).',
      ],
    },
    {
      type: 'tip',
      body: 'The discriminant Δ = b² − 4ac tells you how many solutions exist: Δ > 0 → two solutions; Δ = 0 → one solution; Δ < 0 → no real solutions.',
    },
  ],

  // ── Y10 L3 S2: Equations C ───────────────────────────────────────────────────
  'y10-l3-s2': [
    {
      type: 'text',
      body: 'Literal equations (or formula rearrangements) require isolating a specific variable by treating all others as constants. Simultaneous equations with two unknowns need two equations: substitution works well when one variable is already isolated; elimination works well when both equations have the same-coefficient terms.',
    },
    {
      type: 'steps',
      heading: 'Solving simultaneous equations by elimination',
      items: [
        'Multiply equations to make the coefficients of one variable equal.',
        'Add or subtract the equations to eliminate that variable.',
        'Solve the resulting single-variable equation.',
        'Substitute back to find the other variable.',
        'Check both values in the original equations.',
      ],
    },
    {
      type: 'example',
      question: 'Solve simultaneously: 3x + 2y = 16 and 5x − 2y = 0',
      steps: [
        'Add the equations (y terms cancel): 8x = 16 → x = 2.',
        'Substitute x = 2 into 3(2) + 2y = 16: 6 + 2y = 16 → y = 5.',
        'Solution: x = 2, y = 5.',
        'Check in 5x − 2y: 10 − 10 = 0. ✓',
      ],
    },
    {
      type: 'steps',
      heading: 'Rearranging literal equations',
      items: [
        'Identify the variable you want to isolate.',
        'Use inverse operations to move everything else to the other side.',
        'If the variable appears in more than one term, factorise it out first.',
      ],
    },
    {
      type: 'example',
      question: 'Make r the subject of A = πr²h.',
      steps: [
        'Divide both sides by πh: r² = A/(πh).',
        'Take the square root: r = √(A/(πh)).',
      ],
    },
  ],

  // ── Y10 L4 S1: Linear Relationships C ───────────────────────────────────────
  'y10-l4-s1': [
    {
      type: 'text',
      body: 'Coordinate geometry at Year 10 extends the basic formulas to more complex problems: finding equations of lines in different forms, working with intervals, and applying properties of lines to geometric proofs involving triangles and quadrilaterals.',
    },
    {
      type: 'rules',
      heading: 'Useful forms of a line equation',
      items: [
        'Gradient–intercept: $y = mx + b$',
        'Point–gradient: $y - y_1 = m(x - x_1)$',
        'General form: $ax + by + c = 0$ (all terms on one side)',
        'Two-intercept form: $\\dfrac{x}{a} + \\dfrac{y}{b} = 1$ (intercepts at $(a,0)$ and $(0,b)$)',
      ],
    },
    {
      type: 'example',
      question: 'Show that the triangle with vertices A(0,0), B(4,2), and C(2,6) is right-angled.',
      steps: [
        'Gradient AB: (2−0)/(4−0) = 1/2.',
        'Gradient AC: (6−0)/(2−0) = 3.',
        'Product: (1/2) × 3 = 3/2 ≠ −1, so AB is not ⊥ AC.',
        'Gradient BC: (6−2)/(2−4) = 4/(−2) = −2.',
        'Product of AB and BC gradients: (1/2) × (−2) = −1. ✓',
        'Therefore AB ⊥ BC, so the right angle is at B.',
      ],
    },
    {
      type: 'tip',
      body: 'For general form ax + by + c = 0, the gradient is −a/b and the y-intercept is −c/b. This is useful for quickly finding the gradient without rearranging fully.',
    },
  ],

  // ── Y10 L4 S2: Non-Linear Relationships C ───────────────────────────────────
  'y10-l4-s2': [
    {
      type: 'text',
      body: 'Year 10 graphs extend to a full family of non-linear curves. Each has a signature shape and key features. Completing the square converts a circle from general form to standard form, revealing the centre and radius directly.',
    },
    {
      type: 'table',
      headers: ['Curve', 'Equation', 'Key Feature'],
      rows: [
        ['Parabola', 'y = a(x−h)² + k', 'Vertex (h, k), axis x = h'],
        ['Exponential', 'y = aˣ + c', 'Asymptote y = c, y-intercept (0, a+c)'],
        ['Hyperbola', 'y = k/x + c', 'Asymptotes x = 0 and y = c'],
        ['Circle', '(x−h)² + (y−k)² = r²', 'Centre (h, k), radius r'],
      ],
    },
    {
      type: 'steps',
      heading: 'Completing the square for a circle',
      items: [
        'Group x-terms and y-terms together.',
        'Complete the square for x: add and subtract (coefficient of x ÷ 2)².',
        'Complete the square for y: add and subtract (coefficient of y ÷ 2)².',
        'Rewrite in the form (x − h)² + (y − k)² = r².',
      ],
    },
    {
      type: 'example',
      question: 'Find the centre and radius of x² + y² − 4x + 6y − 3 = 0.',
      steps: [
        'Group: (x² − 4x) + (y² + 6y) = 3.',
        'Complete square for x: (x − 2)² − 4.',
        'Complete square for y: (y + 3)² − 9.',
        '(x − 2)² − 4 + (y + 3)² − 9 = 3.',
        '(x − 2)² + (y + 3)² = 16.',
        'Centre (2, −3), radius 4.',
      ],
    },
  ],

  // ── Y10 L4 S3: Functions and Other Graphs ───────────────────────────────────
  'y10-l4-s3': [
    {
      type: 'text',
      body: 'A relation is any set of (x, y) pairs. A function is a special relation where each x-value maps to exactly one y-value — tested by the vertical line test. Function notation f(x) means "the output of f when the input is x". Domain is the set of allowed x-values; range is the set of resulting y-values.',
    },
    {
      type: 'rules',
      heading: 'Functions, domain, and range',
      items: [
        'Vertical line test: if any vertical line crosses the graph more than once, it is NOT a function.',
        'f(x) notation: $f(3)$ means substitute $x = 3$ into the rule for $f$.',
        'Domain: set of all valid input (x) values (watch for denominators ≠ 0 and square roots of negatives).',
        'Range: set of all output (y) values the function can produce.',
      ],
    },
    {
      type: 'rules',
      heading: 'Graphing linear inequalities in two variables',
      items: [
        'Sketch the boundary line (solid for ≤/≥, dashed for </> ).',
        'Test a point (often the origin) to determine which side satisfies the inequality.',
        'Shade the region containing the test point if it satisfies the inequality.',
      ],
    },
    {
      type: 'example',
      question: 'Find the domain and range of f(x) = √(x − 3).',
      steps: [
        'The expression under the root must be ≥ 0: x − 3 ≥ 0 → x ≥ 3.',
        'Domain: x ≥ 3 (or [3, ∞)).',
        'Square root outputs are always ≥ 0.',
        'Range: y ≥ 0 (or [0, ∞)).',
      ],
    },
    {
      type: 'tip',
      body: 'A circle fails the vertical line test, so it is a relation but not a function. A semicircle (top or bottom half) is a function.',
    },
  ],

  // ── Y10 L5 S1: Polynomials ───────────────────────────────────────────────────
  'y10-l5-s1': [
    {
      type: 'text',
      body: 'A polynomial is an expression with non-negative integer powers of x. The degree is the highest power. Polynomials can be added, subtracted, and multiplied. Division produces a quotient and remainder. The Remainder Theorem and Factor Theorem give powerful shortcuts for evaluating and factorising polynomials.',
    },
    {
      type: 'formula',
      latex: 'P(x) = D(x) \\cdot Q(x) + R(x)',
      label: 'Division algorithm: P = dividend, D = divisor, Q = quotient, R = remainder',
    },
    {
      type: 'rules',
      heading: 'Remainder and Factor Theorems',
      items: [
        'Remainder Theorem: when P(x) is divided by (x − a), the remainder = P(a).',
        'Factor Theorem: (x − a) is a factor of P(x) if and only if P(a) = 0.',
      ],
    },
    {
      type: 'example',
      question: 'Find the remainder when P(x) = x³ − 3x² + 2x − 5 is divided by (x − 2).',
      steps: [
        'By the Remainder Theorem, substitute x = 2.',
        'P(2) = 8 − 12 + 4 − 5 = −5.',
        'Remainder = −5.',
      ],
    },
    {
      type: 'example',
      question: 'Show that (x + 1) is a factor of P(x) = x³ + 2x² − x − 2, then fully factorise.',
      steps: [
        'P(−1) = −1 + 2 + 1 − 2 = 0. ✓ So (x + 1) is a factor.',
        'Divide P(x) by (x + 1): P(x) = (x + 1)(x² + x − 2).',
        'Factorise further: x² + x − 2 = (x + 2)(x − 1).',
        'Full factorisation: (x + 1)(x + 2)(x − 1).',
      ],
    },
    {
      type: 'tip',
      body: 'To sketch a polynomial, find x-intercepts (roots), determine end behaviour from the leading term, and note that an even-degree factor creates a "touching" point while an odd-degree factor creates a "crossing" point.',
    },
  ],

  // ── Y10 L5 S2: Logarithms ───────────────────────────────────────────────────
  'y10-l5-s2': [
    {
      type: 'text',
      body: 'Logarithms are the inverse of exponential functions: log_a(x) = y means aʸ = x. The log laws mirror the index laws and allow you to simplify, expand, or condense logarithmic expressions. Logarithms are the key tool for solving equations where the unknown is in the exponent.',
    },
    {
      type: 'formula',
      latex: '\\log_a x = y \\iff a^y = x',
      label: 'Definition of logarithm',
    },
    {
      type: 'rules',
      heading: 'Log laws',
      items: [
        '$\\log_a(MN) = \\log_a M + \\log_a N$ (product rule)',
        '$\\log_a(M/N) = \\log_a M - \\log_a N$ (quotient rule)',
        '$\\log_a(M^n) = n\\log_a M$ (power rule)',
        '$\\log_a a = 1$ and $\\log_a 1 = 0$',
        'Change of base: $\\log_a x = \\dfrac{\\log_{10} x}{\\log_{10} a} = \\dfrac{\\ln x}{\\ln a}$',
      ],
    },
    {
      type: 'example',
      question: 'Solve: 3ˣ = 50',
      steps: [
        'Take log of both sides: x log 3 = log 50.',
        'x = log 50 / log 3.',
        'x ≈ 1.699 / 0.4771 ≈ 3.56.',
      ],
    },
    {
      type: 'example',
      question: 'Express as a single logarithm: 2 log 5 + log 4 − log 10',
      steps: [
        '2 log 5 = log 25.',
        'log 25 + log 4 = log 100.',
        'log 100 − log 10 = log 10 = 1.',
      ],
    },
    {
      type: 'tip',
      body: 'Logarithms are only defined for positive inputs: log_a(x) requires x > 0 and a > 0, a ≠ 1. Always check your solutions are valid.',
    },
  ],

  // ── Y10 L6 S1: Variation A ───────────────────────────────────────────────────
  'y10-l6-s1': [
    {
      type: 'text',
      body: 'Direct variation means y increases proportionally with x — doubling x doubles y. Inverse variation means y decreases as x increases, so their product is constant. The constant of proportionality k is found from any known data pair and then used to write the equation.',
    },
    {
      type: 'formula',
      latex: '\\text{Direct: } y = kx \\qquad \\text{Inverse: } y = \\frac{k}{x}',
      label: 'Variation equations',
    },
    {
      type: 'rules',
      heading: 'Identifying variation type',
      items: [
        'Direct variation: graph is a straight line through the origin; ratio y/x is constant.',
        'Inverse variation: graph is a hyperbola; product xy is constant.',
        'Direct does NOT mean linear in general — y = kx² is "direct variation with x²".',
      ],
    },
    {
      type: 'example',
      question: 'y varies inversely as x. When x = 4, y = 15. Find y when x = 12.',
      steps: [
        'Inverse variation: y = k/x.',
        'Find k: 15 = k/4 → k = 60.',
        'When x = 12: y = 60/12 = 5.',
      ],
    },
    {
      type: 'tip',
      body: 'To distinguish from a table: check if y/x is constant (direct) or if xy is constant (inverse). If neither is constant, it may be a power variation (y = kxⁿ for some n).',
    },
  ],

  // ── Y10 L6 S2: Variation B — Rates of Change ─────────────────────────────────
  'y10-l6-s2': [
    {
      type: 'text',
      body: 'A rate of change describes how quickly one quantity changes with respect to another. On a graph, the gradient of a straight line gives a constant rate of change; the gradient of a curve at a point gives the instantaneous rate at that moment. Rates of change can be positive (increasing), negative (decreasing), or zero (constant).',
    },
    {
      type: 'rules',
      heading: 'Interpreting graphs of rates of change',
      items: [
        'Steeper positive gradient → faster increase.',
        'Steeper negative gradient → faster decrease.',
        'Zero gradient → constant (horizontal section).',
        'A curve can start steeply then flatten (decreasing rate) or start gently then rise steeply (increasing rate).',
      ],
    },
    {
      type: 'steps',
      heading: 'Sketching a rate-of-change graph from a description',
      items: [
        'Identify what is being measured on each axis.',
        'For each described phase, decide whether the quantity is increasing or decreasing.',
        'Identify whether the rate is constant (straight line) or changing (curve).',
        'Connect the phases smoothly.',
      ],
    },
    {
      type: 'example',
      question: 'A bath is filled at a constant rate for 5 minutes, left unchanged for 2 minutes, then emptied at twice the filling rate. Sketch the volume vs. time graph.',
      steps: [
        '0–5 min: straight line rising (constant fill rate).',
        '5–7 min: horizontal line (volume constant).',
        '7 min onwards: straight line falling with steeper gradient (double the rate).',
        'The emptying phase reaches zero in 2.5 min (half the time to fill).',
      ],
    },
  ],

  // ── Y10 L7 S1: Trigonometry C — 3D Problems ──────────────────────────────────
  'y10-l7-s1': [
    {
      type: 'text',
      body: '3D trigonometry problems involve three-dimensional figures such as rectangular prisms, pyramids, and poles. The technique is always the same: extract a 2D right-angled triangle from the 3D figure, label its sides, then apply Pythagoras or SOH CAH TOA. You may need to use Pythagoras first to find a diagonal before finding an angle.',
    },
    {
      type: 'steps',
      heading: 'Solving 3D trigonometry problems',
      items: [
        'Draw a clear 3D diagram and label all known measurements.',
        'Identify the right-angled triangle(s) that contain the unknown.',
        'Extract each 2D triangle and label it separately.',
        'Apply Pythagoras or trig ratios to find intermediate lengths or angles.',
        'Repeat for additional triangles if needed.',
        'State the answer with appropriate units and rounding.',
      ],
    },
    {
      type: 'example',
      question: 'A rectangular box is 10 cm long, 6 cm wide, and 4 cm high. Find the length of the space diagonal (corner to opposite corner).',
      steps: [
        'Find the base diagonal first: d = √(10² + 6²) = √(100 + 36) = √136 cm.',
        'The space diagonal is the hypotenuse of a vertical triangle with legs √136 and 4.',
        'Space diagonal = √(136 + 16) = √152 ≈ 12.3 cm.',
      ],
    },
    {
      type: 'tip',
      body: 'Always draw the intermediate triangle explicitly — do not try to work in 3D algebra directly. Naming the point where the internal diagonal touches the base often clarifies which triangle to use.',
    },
  ],

  // ── Y10 L7 S2: Trigonometry D — Sine & Cosine Rules ──────────────────────────
  'y10-l7-s2': [
    {
      type: 'text',
      body: 'The sine and cosine rules extend trigonometry beyond right-angled triangles to any triangle. The area formula ½ab sinC gives the area when two sides and their included angle are known — no need for a perpendicular height. Exact values for common angles allow exact answers in many calculations.',
    },
    {
      type: 'formula',
      latex: '\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}',
      label: 'Sine rule (use when angle and opposite side are known)',
    },
    {
      type: 'formula',
      latex: 'a^2 = b^2 + c^2 - 2bc\\cos A',
      label: 'Cosine rule (use for SAS or SSS situations)',
    },
    {
      type: 'formula',
      latex: '\\text{Area} = \\tfrac{1}{2}ab\\sin C',
      label: 'Area of a triangle (two sides and included angle)',
    },
    {
      type: 'table',
      headers: ['Angle', 'sin', 'cos', 'tan'],
      rows: [
        ['30°', '½', '√3/2', '1/√3'],
        ['45°', '1/√2', '1/√2', '1'],
        ['60°', '√3/2', '½', '√3'],
      ],
    },
    {
      type: 'example',
      question: 'In triangle ABC, AB = 7 cm, BC = 10 cm, angle B = 52°. Find the area and then AC.',
      steps: [
        'Area = ½ × 7 × 10 × sin 52° ≈ ½ × 70 × 0.788 ≈ 27.6 cm².',
        'Cosine rule: AC² = 7² + 10² − 2(7)(10) cos 52°.',
        'AC² = 49 + 100 − 140 × 0.6157 ≈ 149 − 86.2 ≈ 62.8.',
        'AC ≈ √62.8 ≈ 7.9 cm.',
      ],
    },
    {
      type: 'tip',
      body: 'The ambiguous case (SSA) occurs with the sine rule: two triangles may be possible. Check whether 180° minus the found angle still leaves a valid triangle (positive remaining angle sum).',
    },
  ],

  // ── Y10 L8 S1: Area and Surface Area B ───────────────────────────────────────
  'y10-l8-s1': [
    {
      type: 'text',
      body: 'Pyramids, cones, and spheres require dedicated surface area formulas. For a cone, the slant height l is the distance from the apex to any point on the base circle — it is found using Pythagoras from the perpendicular height and radius. Composite solids combine these shapes.',
    },
    {
      type: 'formula',
      latex: 'SA_{\\text{cone}} = \\pi r l + \\pi r^2 \\qquad l = \\sqrt{r^2 + h^2}',
      label: 'Cone surface area (curved face + base)',
    },
    {
      type: 'formula',
      latex: 'SA_{\\text{sphere}} = 4\\pi r^2',
      label: 'Sphere surface area',
    },
    {
      type: 'rules',
      heading: 'Surface area of a right pyramid',
      items: [
        'SA = base area + sum of triangular face areas.',
        'Each triangular face: ½ × base edge × slant height of that face.',
        'For a square pyramid: SA = s² + 4 × (½ × s × l) = s² + 2sl.',
      ],
    },
    {
      type: 'example',
      question: 'Find the total surface area of a cone with radius 5 cm and vertical height 12 cm.',
      steps: [
        'Slant height: l = √(5² + 12²) = √(25 + 144) = √169 = 13 cm.',
        'Curved surface: π × 5 × 13 = 65π cm².',
        'Base: π × 5² = 25π cm².',
        'Total SA = 65π + 25π = 90π ≈ 282.7 cm².',
      ],
    },
  ],

  // ── Y10 L8 S2: Volume B ───────────────────────────────────────────────────────
  'y10-l8-s2': [
    {
      type: 'text',
      body: 'Pyramids and cones have volume equal to one-third of the corresponding prism or cylinder with the same base and height. The sphere volume formula applies to complete spheres; half that gives a hemisphere. Composite solids are solved by breaking them into recognisable parts.',
    },
    {
      type: 'formula',
      latex: 'V_{\\text{pyramid}} = \\tfrac{1}{3} A_{\\text{base}} h \\qquad V_{\\text{cone}} = \\tfrac{1}{3}\\pi r^2 h \\qquad V_{\\text{sphere}} = \\tfrac{4}{3}\\pi r^3',
      label: 'Volume formulas',
    },
    {
      type: 'example',
      question: 'A composite solid is a cylinder (r = 4 cm, h = 10 cm) with a hemisphere on top (r = 4 cm). Find the total volume.',
      steps: [
        'Volume of cylinder: π × 4² × 10 = 160π cm³.',
        'Volume of hemisphere: ½ × (4/3)π × 4³ = ½ × (256π/3) = 128π/3 cm³.',
        'Total = 160π + 128π/3 = (480π + 128π)/3 = 608π/3 ≈ 636.7 cm³.',
      ],
    },
    {
      type: 'tip',
      body: 'For composite solids, sketch the solid and clearly mark which parts to add and which to subtract. A hollowed-out sphere, for instance, requires subtracting the inner sphere volume from the outer sphere volume.',
    },
  ],

  // ── Y10 L9 S1: Properties of Geometrical Figures B ──────────────────────────
  'y10-l9-s1': [
    {
      type: 'text',
      body: 'Congruence means identical shape and size; two triangles are congruent if they satisfy one of four tests. Similarity means same shape but different size; three tests apply. These tests are the formal justification for the reasoning used in geometric proofs.',
    },
    {
      type: 'table',
      headers: ['Type', 'Tests'],
      rows: [
        ['Congruence (≅)', 'SSS (three sides), SAS (two sides and included angle), AAS (two angles and a side), RHS (right angle, hypotenuse, side)'],
        ['Similarity (~)', 'AA (two equal angles), SAS ratio (two sides in proportion with included angle equal), SSS ratio (all sides in proportion)'],
      ],
    },
    {
      type: 'steps',
      heading: 'Writing a congruence or similarity statement',
      items: [
        'Match vertices in corresponding order.',
        'State the test used.',
        'List the matching sides or angles as evidence.',
        'Conclude: "∴ △ABC ≅ △DEF (by SAS)" or "∴ △ABC ~ △DEF (by AA)".',
      ],
    },
    {
      type: 'example',
      question: 'In △ABC and △DEF: AB = DE, BC = EF, AC = DF. Prove the triangles are congruent and state which angles are equal.',
      steps: [
        'AB = DE (given), BC = EF (given), AC = DF (given).',
        '∴ △ABC ≅ △DEF (by SSS).',
        'Therefore: ∠A = ∠D, ∠B = ∠E, ∠C = ∠F.',
      ],
    },
  ],

  // ── Y10 L9 S2: Properties of Geometrical Figures C ──────────────────────────
  'y10-l9-s2': [
    {
      type: 'text',
      body: 'A formal geometric proof is a logical argument where each statement is justified by a reason. Common reasons include: definitions, given information, congruence tests, properties of shapes (angles on a straight line sum to 180°, base angles of isosceles triangle are equal, etc.), and previously proved results.',
    },
    {
      type: 'steps',
      heading: 'Writing a geometric proof',
      items: [
        'State what you need to prove clearly.',
        'Write each step as a statement followed by its reason in brackets.',
        'Build from given information towards the conclusion.',
        'Use congruence or similarity to transfer information between triangles.',
        'End with "∴ [conclusion] as required" or "QED".',
      ],
    },
    {
      type: 'example',
      question: 'Prove that the diagonals of a parallelogram bisect each other.',
      steps: [
        'Let ABCD be a parallelogram with diagonals AC and BD meeting at M.',
        'AB ∥ CD (opposite sides of a parallelogram are parallel).',
        '∠MAB = ∠MCD (alternate interior angles, AB ∥ CD).',
        '∠MBA = ∠MDC (alternate interior angles, AB ∥ CD).',
        'AB = CD (opposite sides of a parallelogram are equal).',
        '∴ △MAB ≅ △MCD (by AAS).',
        '∴ MA = MC and MB = MD (matching sides of congruent triangles).',
        '∴ The diagonals bisect each other.',
      ],
    },
    {
      type: 'tip',
      body: 'Before writing the proof, draw a clear diagram and mark what you know. Look for which congruence test is satisfied — often the given information is set up to match exactly one test.',
    },
  ],

  // ── Y10 L9 S3: Circle Geometry ───────────────────────────────────────────────
  'y10-l9-s3': [
    {
      type: 'text',
      body: 'Circle theorems are powerful results that relate angles and lengths in circles. They are proved using the properties of isosceles triangles (formed by equal radii) and straight angles. Each theorem must be quoted as the reason in a proof — do not just state the result without justification.',
    },
    {
      type: 'rules',
      heading: 'Key circle theorems',
      items: [
        'Angle at the centre = twice the angle at the circumference (same arc).',
        'Angles in the same segment are equal.',
        'Angle in a semicircle = 90° (diameter subtends a right angle).',
        'Opposite angles of a cyclic quadrilateral are supplementary (sum to 180°).',
        'A tangent is perpendicular to the radius at the point of contact.',
        'Tangent from an external point: two tangents from the same external point are equal in length.',
        'Alternate segment theorem: the angle between a tangent and a chord = inscribed angle in the alternate segment.',
      ],
    },
    {
      type: 'example',
      question: 'O is the centre of a circle. Chord AB subtends an angle of 70° at the circumference. Find the angle AOB at the centre.',
      steps: [
        'By the angle-at-centre theorem: ∠AOB = 2 × ∠ACB (where C is any point on the major arc).',
        '∠AOB = 2 × 70° = 140°.',
      ],
    },
    {
      type: 'example',
      question: 'ABCD is a cyclic quadrilateral. ∠A = 115°. Find ∠C.',
      steps: [
        'Opposite angles of a cyclic quadrilateral are supplementary.',
        '∠A + ∠C = 180°.',
        '∠C = 180° − 115° = 65°.',
      ],
    },
    {
      type: 'tip',
      body: 'For the alternate segment theorem, the chord divides the circle into two segments. The angle the chord makes with the tangent at one end equals the inscribed angle in the opposite segment — draw the diagram carefully and label which segment is "alternate".',
    },
  ],

  // ── Y10 L10 S1: Introduction to Networks ────────────────────────────────────
  'y10-l10-s1': [
    {
      type: 'text',
      body: 'A graph (network) is a set of vertices (nodes) connected by edges (arcs). Networks model roads, pipelines, social connections, and more. Key results include Euler\'s formula for planar graphs and conditions for Eulerian trails and circuits based on vertex degree (the number of edges at a vertex).',
    },
    {
      type: 'formula',
      latex: 'V - E + F = 2',
      label: "Euler's formula for connected planar graphs (V = vertices, E = edges, F = faces including the outer face)",
    },
    {
      type: 'rules',
      heading: 'Eulerian paths and circuits',
      items: [
        'The degree of a vertex = number of edges meeting at it.',
        'Sum of all degrees = 2 × number of edges (each edge contributes 2).',
        'Eulerian trail (uses every edge once, start ≠ end): exists iff exactly 2 vertices have odd degree.',
        'Eulerian circuit (uses every edge once, start = end): exists iff ALL vertices have even degree.',
      ],
    },
    {
      type: 'example',
      question: 'A network has 6 vertices and 9 edges. How many faces does it have (assuming it is connected and planar)?',
      steps: [
        "Using Euler's formula: V − E + F = 2.",
        '6 − 9 + F = 2.',
        'F = 5.',
      ],
    },
    {
      type: 'tip',
      body: 'To check whether an Eulerian trail or circuit exists, count the degree of every vertex. If you find more than 2 vertices with odd degree, neither an Eulerian trail nor circuit exists.',
    },
  ],

  // ── Y10 L10 S2: Data Analysis C — Statistical Inquiry ────────────────────────
  'y10-l10-s2': [
    {
      type: 'text',
      body: 'A statistical inquiry follows a cycle: formulate a clear question, design data collection (census or sample), collect the data, choose appropriate displays and summary statistics, analyse results, and draw conclusions. The reliability and validity of conclusions depend on the quality of the data and the appropriateness of the methods used.',
    },
    {
      type: 'steps',
      heading: 'Statistical inquiry cycle (PPDAC)',
      items: [
        'Problem: define a clear statistical question.',
        'Plan: decide on census or sample; choose sampling method (random, stratified, systematic).',
        'Data: collect, organise, and clean the data.',
        'Analysis: calculate summary statistics (mean, median, range, SD, IQR); choose appropriate graphs.',
        'Conclusion: interpret results; comment on limitations; acknowledge potential bias.',
      ],
    },
    {
      type: 'rules',
      heading: 'Choosing appropriate displays',
      items: [
        'Categorical data: bar chart, pie chart.',
        'Numerical data (distribution): histogram, stem-and-leaf, box plot.',
        'Comparing two groups: parallel box plots, back-to-back stem-and-leaf.',
        'Bivariate data: scatterplot (with line of best fit if linear).',
        'Change over time: line graph.',
      ],
    },
    {
      type: 'tip',
      body: 'Always evaluate the source of data. A convenience sample (e.g. surveying friends) can introduce bias. Random sampling gives every member of the population an equal chance of being selected and produces the most reliable results.',
    },
  ],

  // ── Y10 L10 S3: Probability B — Venn Diagrams & Conditional ──────────────────
  'y10-l10-s3': [
    {
      type: 'text',
      body: 'Venn diagrams and two-way tables are visual tools for organising probability data involving two or more events. Conditional probability asks: "Given that B has already occurred, what is the probability of A?" Independence is a special condition where knowing one event occurred gives no information about the other.',
    },
    {
      type: 'formula',
      latex: 'P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}',
      label: 'Conditional probability formula',
    },
    {
      type: 'rules',
      heading: 'Independence and addition rule',
      items: [
        'A and B are independent if $P(A \\cap B) = P(A) \\times P(B)$.',
        'Equivalently: $P(A|B) = P(A)$ (knowing B does not change probability of A).',
        'Addition rule: $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$.',
        'For mutually exclusive events: $P(A \\cap B) = 0$, so $P(A \\cup B) = P(A) + P(B)$.',
      ],
    },
    {
      type: 'example',
      question: 'In a group of 50 students, 30 study Maths, 20 study English, and 10 study both. Find P(Maths | English).',
      steps: [
        'P(M ∩ E) = 10/50 = 1/5.',
        'P(E) = 20/50 = 2/5.',
        'P(M|E) = P(M ∩ E) / P(E) = (1/5) / (2/5) = 1/2.',
        'So 50% of English students also study Maths.',
      ],
    },
    {
      type: 'tip',
      body: 'Fill in a two-way table or Venn diagram before applying formulas. Start with the "both" region (intersection), then work outward to each individual event region, then to neither. The total of all regions equals the sample size.',
    },
  ],
}
