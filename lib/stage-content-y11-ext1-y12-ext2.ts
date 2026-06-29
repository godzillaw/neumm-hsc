import type { ExplanationBlock } from './curriculum'

export const STAGE_CONTENT_Y11_EXT1_Y12_EXT2: Record<string, ExplanationBlock[]> = {

  // ══════════════════════════════════════════════════════════════════════════════
  // YEAR 11 EXTENSION 1
  // ══════════════════════════════════════════════════════════════════════════════

  // ── L1 S1: Graphical Relationships ───────────────────────────────────────────
  'y11-ext1-l1-s1': [
    {
      type: 'text',
      body: 'Given the graph of y = f(x), you can sketch related graphs — such as y = |f(x)|, y = f(|x|), y = 1/f(x), y = [f(x)]², and y = √f(x) — by applying systematic point-by-point transformations. Understanding how each operation distorts the original graph is a core Extension 1 skill.',
    },
    {
      type: 'rules',
      heading: 'Key graphical relationships',
      items: [
        '|f(x)|: reflect any portion where f(x) < 0 up above the x-axis; the rest is unchanged.',
        'f(|x|): keep the graph for x ≥ 0 and reflect it in the y-axis (left side mirrors right).',
        '1/f(x): zeros of f become vertical asymptotes; where |f| is large, |1/f| is small and vice versa; sign is preserved.',
        '[f(x)]²: all y-values become non-negative; values between −1 and 1 shrink, values outside expand.',
        '√f(x): only exists where f(x) ≥ 0; stretches values in (0,1) upward, compresses values > 1 downward.',
      ],
    },
    {
      type: 'steps',
      heading: 'Strategy for sketching y = |f(x)|',
      items: [
        'Sketch y = f(x) first, noting all zeros, turning points, and asymptotes.',
        'Identify all regions where f(x) < 0 (graph is below the x-axis).',
        'Reflect those regions upward (multiply y-coordinates by −1).',
        'Leave all regions where f(x) ≥ 0 unchanged.',
        'The resulting graph touches the x-axis (it never goes below it).',
      ],
    },
    {
      type: 'steps',
      heading: 'Strategy for sketching y = 1/f(x)',
      items: [
        'Find all zeros of f(x) — these become vertical asymptotes of 1/f(x).',
        'Find all vertical asymptotes of f(x) — these become zeros of 1/f(x).',
        'Where f(x) = 1, then 1/f(x) = 1 (invariant points on y = 1).',
        'Where f(x) = −1, then 1/f(x) = −1 (invariant points on y = −1).',
        'Local maxima of f(x) correspond to local minima of 1/f(x) (when f > 0), and vice versa.',
      ],
    },
    {
      type: 'example',
      question: 'Given f(x) = x² − 1, sketch y = 1/f(x) and state its asymptotes.',
      steps: [
        'f(x) = 0 when x = ±1, so y = 1/f(x) has vertical asymptotes at x = 1 and x = −1.',
        'As x → ±∞, f(x) → ∞ so 1/f(x) → 0: horizontal asymptote at y = 0.',
        'f(0) = −1, so 1/f(0) = −1: the graph passes through (0, −1).',
        'For |x| > 1, f(x) > 0, so 1/f(x) > 0 (two positive branches).',
        'For |x| < 1, f(x) < 0, so 1/f(x) < 0 (one negative branch below x-axis).',
      ],
    },
    {
      type: 'tip',
      body: 'For y = f(|x|): first sketch y = f(x) for x ≥ 0 only, then mirror that right-hand portion across the y-axis. Any part of f(x) for x < 0 is completely discarded.',
    },
  ],

  // ── L1 S2: Inverse Functions ──────────────────────────────────────────────────
  'y11-ext1-l1-s2': [
    {
      type: 'text',
      body: 'The inverse of a function f, written f⁻¹, reverses the input-output relationship. If f maps x to y, then f⁻¹ maps y back to x. Graphically, y = f⁻¹(x) is the reflection of y = f(x) in the line y = x. A function only has an inverse that is also a function if the original function is one-to-one (passes the horizontal line test).',
    },
    {
      type: 'rules',
      heading: 'Conditions and properties',
      items: [
        'f⁻¹ exists as a function ⟺ f is one-to-one (each y-value has exactly one x-value).',
        'The domain of f⁻¹ equals the range of f, and vice versa.',
        'The graph of f⁻¹ is the reflection of the graph of f in the line y = x.',
        'f(f⁻¹(x)) = x for all x in the domain of f⁻¹, and f⁻¹(f(x)) = x for all x in the domain of f.',
        'If f is not one-to-one, restrict its domain to a maximal interval where it is — then find the inverse on that restricted domain.',
      ],
    },
    {
      type: 'steps',
      heading: 'How to find f⁻¹(x) algebraically',
      items: [
        'Write y = f(x).',
        'Swap x and y to get x = f(y).',
        'Solve for y in terms of x.',
        'Write f⁻¹(x) = (result), and state the domain of f⁻¹ (= range of f).',
      ],
    },
    {
      type: 'example',
      question: 'Find the inverse of f(x) = 2x − 3 and verify f(f⁻¹(x)) = x.',
      steps: [
        'Write y = 2x − 3.',
        'Swap: x = 2y − 3.',
        'Solve for y: x + 3 = 2y, so y = (x + 3)/2.',
        'Therefore f⁻¹(x) = (x + 3)/2, domain: all real numbers.',
        'Verify: f(f⁻¹(x)) = 2·(x+3)/2 − 3 = (x + 3) − 3 = x. ✓',
      ],
    },
    {
      type: 'example',
      question: 'Find the inverse of f(x) = x² with an appropriate domain restriction.',
      steps: [
        'f(x) = x² is not one-to-one on ℝ (parabola fails horizontal line test).',
        'Restrict domain to x ≥ 0 so f is one-to-one.',
        'Swap: x = y², with y ≥ 0.',
        'Solve: y = √x.',
        'So f⁻¹(x) = √x, with domain x ≥ 0.',
      ],
    },
    {
      type: 'tip',
      body: 'Do not confuse f⁻¹(x) (the inverse function) with [f(x)]⁻¹ = 1/f(x) (the reciprocal). They are completely different. The notation f⁻¹ specifically means the inverse function.',
    },
  ],

  // ── L1 S3: Parametric Form of a Function or Relation ─────────────────────────
  'y11-ext1-l1-s3': [
    {
      type: 'text',
      body: 'A curve can be described parametrically by expressing both x and y as functions of a third variable t (the parameter). Instead of y = f(x), we write x = f(t), y = g(t). This is especially useful for curves that are not functions (e.g. circles), or for describing motion where t represents time.',
    },
    {
      type: 'formula',
      latex: 'x = f(t),\\quad y = g(t),\\quad t \\in [a, b]',
      label: 'Parametric form',
    },
    {
      type: 'steps',
      heading: 'Converting parametric to Cartesian form',
      items: [
        'Write x = f(t) and y = g(t).',
        'From one equation, express t in terms of x (or y).',
        'Substitute into the other equation to eliminate t.',
        'Simplify to get a Cartesian relation in x and y.',
        'State any restrictions on x or y that arise from the parameter range.',
      ],
    },
    {
      type: 'example',
      question: 'Convert x = 2t, y = t² − 1 to Cartesian form.',
      steps: [
        'From x = 2t: t = x/2.',
        'Substitute into y = t² − 1: y = (x/2)² − 1 = x²/4 − 1.',
        'Cartesian form: y = x²/4 − 1 (a parabola with vertex at (0, −1)).',
      ],
    },
    {
      type: 'example',
      question: 'Convert the parametric equations x = 3cos θ, y = 3sin θ to Cartesian form.',
      steps: [
        'Square both: x² = 9cos²θ and y² = 9sin²θ.',
        'Add: x² + y² = 9(cos²θ + sin²θ) = 9.',
        'Cartesian form: x² + y² = 9 (circle, centre origin, radius 3).',
      ],
    },
    {
      type: 'rules',
      heading: 'Common parametric forms to recognise',
      items: [
        'Circle: x = r cos θ, y = r sin θ → x² + y² = r²',
        'Ellipse: x = a cos θ, y = b sin θ → x²/a² + y²/b² = 1',
        'Parabola: x = at², y = 2at → y² = 4ax (standard form)',
      ],
    },
    {
      type: 'tip',
      body: 'When converting parametric equations involving trig, look for a Pythagorean identity (sin²θ + cos²θ = 1, or 1 + tan²θ = sec²θ) to eliminate the parameter cleanly.',
    },
  ],

  // ── L1 S4: Inequalities ───────────────────────────────────────────────────────
  'y11-ext1-l1-s4': [
    {
      type: 'text',
      body: 'Extension 1 inequalities include rational inequalities (with variables in the denominator) and absolute value inequalities. The key principle: never multiply both sides of an inequality by an expression whose sign is unknown — instead, move everything to one side and use a sign table (test intervals) or a graphical argument.',
    },
    {
      type: 'rules',
      heading: 'Cardinal rules for inequalities',
      items: [
        'Multiplying or dividing by a NEGATIVE number reverses the inequality sign.',
        'NEVER multiply both sides by a variable expression (its sign is unknown).',
        'For rational inequalities: move everything to one side → f(x)/g(x) > 0 → use sign chart.',
        'For |f(x)| < a (a > 0): equivalent to −a < f(x) < a.',
        'For |f(x)| > a (a > 0): equivalent to f(x) < −a  OR  f(x) > a.',
      ],
    },
    {
      type: 'steps',
      heading: 'Solving a rational inequality',
      items: [
        'Move all terms to one side: write as a single fraction > 0 (or < 0).',
        'Factorise numerator and denominator completely.',
        'Find the critical values (zeros of numerator and denominator).',
        'Draw a number line and mark all critical values.',
        'Test the sign of the expression in each interval.',
        'Select intervals where the sign satisfies the inequality.',
        'Include endpoints only if they make the expression zero (not undefined).',
      ],
    },
    {
      type: 'example',
      question: 'Solve (x − 1)/(x + 2) ≥ 0.',
      steps: [
        'Critical values: x = 1 (numerator = 0) and x = −2 (denominator = 0).',
        'Test intervals: x < −2, −2 < x < 1, x > 1.',
        'x = −3: (−4)/(−1) = 4 > 0. ✓',
        'x = 0: (−1)/(2) = −½ < 0. ✗',
        'x = 2: (1)/(4) = ¼ > 0. ✓',
        'Include x = 1 (expression = 0), exclude x = −2 (undefined).',
        'Solution: x ≤ −2 is wrong (tested negative) — solution: x < −2 or x ≥ 1.',
      ],
    },
    {
      type: 'example',
      question: 'Solve |2x − 3| < 5.',
      steps: [
        'Rewrite: −5 < 2x − 3 < 5.',
        'Add 3: −2 < 2x < 8.',
        'Divide by 2: −1 < x < 4.',
        'Solution: x ∈ (−1, 4).',
      ],
    },
    {
      type: 'tip',
      body: 'A clean alternative: sketch y = (x−1)/(x+2) and observe where the graph is above the x-axis. This graphical check catches sign-table errors.',
    },
  ],

  // ── L2 S1: Language, Notation and Graphs of Polynomials ──────────────────────
  'y11-ext1-l2-s1': [
    {
      type: 'text',
      body: 'A polynomial is an expression of the form P(x) = aₙxⁿ + aₙ₋₁xⁿ⁻¹ + ⋯ + a₁x + a₀, where n is a non-negative integer and the coefficients aᵢ are real numbers. The leading term determines end behaviour, and the degree controls the maximum number of turning points and x-intercepts.',
    },
    {
      type: 'formula',
      latex: 'P(x) = a_n x^n + a_{n-1}x^{n-1} + \\cdots + a_1 x + a_0,\\quad a_n \\neq 0',
      label: 'General polynomial of degree n',
    },
    {
      type: 'rules',
      heading: 'Key terminology',
      items: [
        'Degree: the highest power of x with a non-zero coefficient.',
        'Leading coefficient: the coefficient of the highest power term (aₙ).',
        'Monic: leading coefficient equals 1.',
        'A degree-n polynomial has at most n real zeros and at most (n − 1) turning points.',
        'End behaviour: if aₙ > 0 and n even → both ends up; if aₙ < 0 and n even → both ends down; if n odd → opposite ends.',
      ],
    },
    {
      type: 'rules',
      heading: 'Multiplicity of zeros and graph behaviour',
      items: [
        'Simple zero (multiplicity 1): graph crosses the x-axis.',
        'Double zero (multiplicity 2): graph touches the x-axis and turns around.',
        'Triple zero (multiplicity 3): graph crosses with a horizontal inflection point.',
        'Generally: even multiplicity → touch; odd multiplicity → cross.',
      ],
    },
    {
      type: 'example',
      question: 'Sketch y = (x + 2)²(x − 1)(x − 3) without calculus.',
      steps: [
        'Degree: 2 + 1 + 1 = 4. Leading coefficient: positive. Both ends go up.',
        'Zeros: x = −2 (mult 2, touch), x = 1 (mult 1, cross), x = 3 (mult 1, cross).',
        'y-intercept: (0+2)²(0−1)(0−3) = 4 × (−1) × (−3) = 12.',
        'Sketch: starts high left → touches x-axis at −2 → goes down → crosses at 1 → crosses at 3 → rises to high right.',
      ],
    },
    {
      type: 'tip',
      body: 'To determine the sign of the polynomial in each interval between zeros, substitute a simple test value. Alternatively, track the sign starting from the far right (positive for positive leading coefficient) and flip sign each time you cross an odd-multiplicity zero.',
    },
  ],

  // ── L2 S2: Division of Polynomials and the Remainder Theorem ─────────────────
  'y11-ext1-l2-s2': [
    {
      type: 'text',
      body: 'When a polynomial P(x) is divided by a divisor D(x), the result is a quotient Q(x) and a remainder R(x), where deg(R) < deg(D). The Remainder Theorem states that when P(x) is divided by (x − a), the remainder equals P(a). The Factor Theorem follows: (x − a) is a factor of P(x) if and only if P(a) = 0.',
    },
    {
      type: 'formula',
      latex: 'P(x) = D(x)\\,Q(x) + R(x)',
      label: 'Division algorithm for polynomials',
    },
    {
      type: 'formula',
      latex: '\\text{When } D(x) = x - a:\\quad P(a) = R',
      label: 'Remainder Theorem',
    },
    {
      type: 'steps',
      heading: 'Long division of polynomials',
      items: [
        'Write P(x) and D(x) in descending powers (insert 0 coefficients for missing terms).',
        'Divide the leading term of P(x) by the leading term of D(x) → first term of Q(x).',
        'Multiply that term by the full D(x) and subtract from P(x).',
        'Bring down the next term and repeat.',
        'Stop when the degree of the remaining expression is less than deg(D).',
      ],
    },
    {
      type: 'example',
      question: 'Divide P(x) = x³ − 2x² + 4x − 8 by (x − 2) and find the remainder.',
      steps: [
        'By Remainder Theorem: P(2) = 8 − 8 + 8 − 8 = 0.',
        'Remainder = 0, so (x − 2) is a factor.',
        'Long division: x³ − 2x² + 4x − 8 = (x − 2)(x² + 4).',
        'Check: (x − 2)(x² + 4) = x³ + 4x − 2x² − 8 = x³ − 2x² + 4x − 8. ✓',
      ],
    },
    {
      type: 'example',
      question: 'Find the value of k if (x − 3) is a factor of P(x) = x³ − kx + 6.',
      steps: [
        'By Factor Theorem, P(3) = 0.',
        '27 − 3k + 6 = 0.',
        '33 − 3k = 0.',
        'k = 11.',
      ],
    },
    {
      type: 'tip',
      body: 'When dividing by a linear factor (x − a), synthetic division (also called the table method) is faster than long division. Write only the coefficients of P(x), use a as the divisor, and proceed by multiply-and-add.',
    },
  ],

  // ── L2 S3: Sums and Products of Roots ────────────────────────────────────────
  'y11-ext1-l2-s3': [
    {
      type: 'text',
      body: "Vieta's formulas relate the coefficients of a polynomial to symmetric functions of its roots, without needing to find the roots explicitly. For a cubic P(x) = ax³ + bx² + cx + d with roots α, β, γ, the sum, sum of pairwise products, and product of roots are all expressible in terms of a, b, c, d.",
    },
    {
      type: 'rules',
      heading: "Vieta's formulas for a cubic ax³ + bx² + cx + d = 0 with roots α, β, γ",
      items: [
        'α + β + γ = −b/a',
        'αβ + βγ + αγ = c/a',
        'αβγ = −d/a',
      ],
    },
    {
      type: 'rules',
      heading: "Vieta's formulas for a quadratic ax² + bx + c = 0 with roots α, β",
      items: [
        'α + β = −b/a',
        'αβ = c/a',
      ],
    },
    {
      type: 'steps',
      heading: 'Using symmetric functions to find expressions involving roots',
      items: [
        'Identify the required expression (e.g. α² + β² + γ², or 1/α + 1/β + 1/γ).',
        'Rewrite it in terms of elementary symmetric polynomials: α+β+γ, αβ+βγ+αγ, αβγ.',
        'Use: α² + β² + γ² = (α+β+γ)² − 2(αβ+βγ+αγ).',
        'Use: 1/α + 1/β + 1/γ = (αβ+βγ+αγ)/(αβγ).',
        'Substitute the values from the coefficients.',
      ],
    },
    {
      type: 'example',
      question: 'The roots of x³ − 6x² + 11x − 6 = 0 are α, β, γ. Find α² + β² + γ².',
      steps: [
        'α + β + γ = 6, αβ + βγ + αγ = 11, αβγ = 6.',
        'α² + β² + γ² = (α+β+γ)² − 2(αβ+βγ+αγ) = 36 − 22 = 14.',
      ],
    },
    {
      type: 'example',
      question: 'Find a cubic with roots 2, 3, 5.',
      steps: [
        'Sum: 2+3+5 = 10, so −b/a = 10.',
        'Sum of pairwise products: 2×3 + 3×5 + 2×5 = 6+15+10 = 31, so c/a = 31.',
        'Product: 2×3×5 = 30, so −d/a = 30.',
        'Taking a = 1: b = −10, c = 31, d = −30.',
        'Cubic: x³ − 10x² + 31x − 30 = 0.',
      ],
    },
    {
      type: 'tip',
      body: "Vieta's formulas always hold for ALL roots (including complex ones). When the polynomial has real coefficients, complex roots come in conjugate pairs, which is why real polynomials of odd degree always have at least one real root.",
    },
  ],

  // ── L3 S1: Trigonometry in 3D ─────────────────────────────────────────────────
  'y11-ext1-l3-s1': [
    {
      type: 'text',
      body: 'Trigonometry extends naturally to three-dimensional problems involving angles of elevation, bearings, and triangles embedded in space. The key tools are the sine rule, cosine rule, and the formula for the angle a line makes with a plane. Most 3D problems are solved by identifying the right 2D triangles and working with them one at a time.',
    },
    {
      type: 'formula',
      latex: '\\theta = \\arctan\\!\\left(\\frac{\\text{perpendicular height}}{\\text{horizontal distance}}\\right)',
      label: 'Angle of elevation (or depression)',
    },
    {
      type: 'rules',
      heading: 'Strategy for 3D trigonometry problems',
      items: [
        'Draw a clear 3D diagram and label all known lengths and angles.',
        'Identify a 2D triangle that contains the unknown quantity.',
        'Often you need to find an intermediate length in one triangle before solving another.',
        'The sine rule: a/sinA = b/sinB = c/sinC (use when you know an angle-opposite side pair).',
        'The cosine rule: a² = b² + c² − 2bc cosA (use when you know three sides, or two sides and the included angle).',
        'Area = ½ab sinC (when two sides and the included angle are known).',
      ],
    },
    {
      type: 'example',
      question: 'A vertical tower PQ stands at corner Q of a rectangular field. A and B are the other two corners on the same side. QA = 40 m, AB = 30 m, and the angle of elevation of P from A is 35°. Find the angle of elevation of P from B.',
      steps: [
        'Let height of tower = h. From A: tan 35° = h/40, so h = 40 tan 35° ≈ 28.0 m.',
        'QB² = QA² + AB² = 1600 + 900 = 2500, so QB = 50 m.',
        'Angle of elevation from B: θ = arctan(h/QB) = arctan(28.0/50) ≈ 29.3°.',
      ],
    },
    {
      type: 'tip',
      body: 'In 3D problems, always check whether you are looking for the angle that a line makes with a horizontal plane (angle of elevation) or with the vertical. The angle with the plane is the complement of the angle with the vertical.',
    },
  ],

  // ── L3 S2: Further Trigonometric Identities ───────────────────────────────────
  'y11-ext1-l3-s2': [
    {
      type: 'text',
      body: 'Extension 1 introduces the sum and difference formulas, double angle formulas, and the t-substitution (where t = tan(θ/2)). These identities let you simplify complex trig expressions, prove identities, and convert between different trig forms.',
    },
    {
      type: 'rules',
      heading: 'Sum and difference formulas',
      items: [
        'sin(A ± B) = sinA cosB ± cosA sinB',
        'cos(A ± B) = cosA cosB ∓ sinA sinB',
        'tan(A ± B) = (tanA ± tanB) / (1 ∓ tanA tanB)',
      ],
    },
    {
      type: 'rules',
      heading: 'Double angle formulas',
      items: [
        'sin 2A = 2 sinA cosA',
        'cos 2A = cos²A − sin²A = 2cos²A − 1 = 1 − 2sin²A',
        'tan 2A = 2tanA / (1 − tan²A)',
      ],
    },
    {
      type: 'rules',
      heading: 't-substitution: t = tan(θ/2)',
      items: [
        'sinθ = 2t/(1 + t²)',
        'cosθ = (1 − t²)/(1 + t²)',
        'tanθ = 2t/(1 − t²)',
      ],
    },
    {
      type: 'example',
      question: 'Prove that sin 3A = 3sinA − 4sin³A.',
      steps: [
        'sin 3A = sin(2A + A) = sin2A cosA + cos2A sinA.',
        '= 2sinA cosA · cosA + (1 − 2sin²A) sinA.',
        '= 2sinA cos²A + sinA − 2sin³A.',
        '= 2sinA(1 − sin²A) + sinA − 2sin³A.',
        '= 2sinA − 2sin³A + sinA − 2sin³A.',
        '= 3sinA − 4sin³A. ✓',
      ],
    },
    {
      type: 'tip',
      body: 'When proving an identity, work on the more complicated side first. Use the sum/difference or double angle formulas to expand, then look for Pythagorean identities (sin²+cos²=1) to simplify. Never "cross the equals sign" — that is, do not move terms from one side to the other while proving.',
    },
  ],

  // ── L3 S3: Further Trigonometric Equations ────────────────────────────────────
  'y11-ext1-l3-s3': [
    {
      type: 'text',
      body: 'Further trigonometric equations involve using identities to reduce complex equations to simple ones. The general solution accounts for all angles (over all periods) that satisfy the equation. The auxiliary angle method (R sin or R cos form) is powerful for solving equations of the form a sinx + b cosx = c.',
    },
    {
      type: 'formula',
      latex: 'a\\sin x + b\\cos x = R\\sin(x + \\alpha)',
      label: 'Auxiliary angle form, where R = √(a² + b²) and tanα = b/a',
    },
    {
      type: 'steps',
      heading: 'Solving a sinx + b cosx = c using auxiliary angle',
      items: [
        'Calculate R = √(a² + b²).',
        'Find α such that tanα = b/a (and check quadrant using signs of a and b).',
        'Rewrite as R sin(x + α) = c.',
        'Divide: sin(x + α) = c/R. Check |c/R| ≤ 1 for solutions to exist.',
        'Solve: x + α = arcsin(c/R) + 2kπ  or  x + α = π − arcsin(c/R) + 2kπ.',
        'Subtract α from each solution and restrict to the required domain.',
      ],
    },
    {
      type: 'example',
      question: 'Solve sin x + √3 cos x = 1 for 0 ≤ x ≤ 2π.',
      steps: [
        'a = 1, b = √3: R = √(1 + 3) = 2. tanα = √3/1, α = π/3.',
        'Equation becomes: 2 sin(x + π/3) = 1, so sin(x + π/3) = ½.',
        'x + π/3 = π/6 + 2kπ  or  x + π/3 = π − π/6 + 2kπ = 5π/6 + 2kπ.',
        'x = π/6 − π/3 = −π/6 (outside range) → add 2π → x = 11π/6.',
        'x = 5π/6 − π/3 = 5π/6 − 2π/6 = 3π/6 = π/2.',
        'Solutions: x = π/2 or x = 11π/6.',
      ],
    },
    {
      type: 'rules',
      heading: 'General solutions',
      items: [
        'sinx = k → x = arcsin(k) + 2nπ  or  x = π − arcsin(k) + 2nπ, n ∈ ℤ',
        'cosx = k → x = ±arccos(k) + 2nπ, n ∈ ℤ',
        'tanx = k → x = arctan(k) + nπ, n ∈ ℤ',
      ],
    },
    {
      type: 'tip',
      body: 'The t-substitution t = tan(x/2) converts a trig equation into a polynomial or rational equation in t. But watch out: the substitution is undefined when x = π + 2kπ (i.e. when tan(x/2) is undefined), so always check x = π separately.',
    },
  ],

  // ── L4 S1: Counting Techniques ────────────────────────────────────────────────
  'y11-ext1-l4-s1': [
    {
      type: 'text',
      body: 'Counting techniques are the foundation of probability and combinatorics. The fundamental principles are the multiplication principle (for successive independent choices) and the addition principle (for mutually exclusive alternatives). These underpin permutations and combinations.',
    },
    {
      type: 'rules',
      heading: 'Fundamental counting principles',
      items: [
        'Multiplication principle: if task A can be done in m ways and task B in n ways (independently), then both tasks together can be done in m × n ways.',
        'Addition principle: if task A can be done in m ways and task B in n ways, and these are mutually exclusive, then one or the other can be done in m + n ways.',
        'Arrangement principle: n distinct objects can be arranged in a line in n! = n × (n−1) × ⋯ × 2 × 1 ways.',
        '0! = 1 by convention.',
      ],
    },
    {
      type: 'example',
      question: 'How many 3-digit numbers (no repeated digits) can be formed from {1, 2, 3, 4, 5}?',
      steps: [
        'Hundreds digit: 5 choices.',
        'Tens digit: 4 choices (one used).',
        'Units digit: 3 choices.',
        'Total: 5 × 4 × 3 = 60.',
      ],
    },
    {
      type: 'example',
      question: 'In how many ways can 5 people sit in a row if two particular people (A and B) must sit together?',
      steps: [
        'Treat A and B as one unit → 4 units to arrange: 4! = 24 ways.',
        'A and B can be arranged within their unit in 2! = 2 ways.',
        'Total: 4! × 2! = 24 × 2 = 48.',
      ],
    },
    {
      type: 'steps',
      heading: 'Strategy: using complementary counting',
      items: [
        'Sometimes it is easier to count what you do NOT want.',
        'Count the total number of arrangements without restriction.',
        'Subtract the number of arrangements that violate the condition.',
        'Result = Total − (arrangements with the unwanted condition).',
      ],
    },
    {
      type: 'tip',
      body: 'For circular arrangements of n people, fix one person to remove rotational equivalence, then arrange the remaining (n−1) people: (n−1)! arrangements. For arrangements with reflective symmetry also equivalent (e.g. necklaces), divide by 2: (n−1)!/2.',
    },
  ],

  // ── L4 S2: Permutations and Combinations ──────────────────────────────────────
  'y11-ext1-l4-s2': [
    {
      type: 'text',
      body: 'A permutation is an ordered arrangement of objects; a combination is an unordered selection. The distinction is: order matters in permutations, order does not matter in combinations. These are computed using the formulas nPr and nCr (also written C(n,r) or "n choose r").',
    },
    {
      type: 'formula',
      latex: '^nP_r = \\frac{n!}{(n-r)!}',
      label: 'Permutations: ordered arrangements of r from n',
    },
    {
      type: 'formula',
      latex: '^nC_r = \\binom{n}{r} = \\frac{n!}{r!\\,(n-r)!}',
      label: 'Combinations: unordered selections of r from n',
    },
    {
      type: 'rules',
      heading: 'Key properties of combinations',
      items: [
        'ⁿCᵣ = ⁿCₙ₋ᵣ (choosing r to include = choosing n−r to exclude)',
        'ⁿC₀ = ⁿCₙ = 1',
        'ⁿCᵣ + ⁿCᵣ₊₁ = ⁿ⁺¹Cᵣ₊₁ (Pascal\'s identity)',
        'ⁿPᵣ = ⁿCᵣ × r! (a permutation = a combination × the arrangements of those r items)',
      ],
    },
    {
      type: 'example',
      question: 'A committee of 3 is chosen from 8 people. How many ways?',
      steps: [
        'Order does not matter (it is a committee, not ranked positions).',
        '⁸C₃ = 8!/(3! × 5!) = (8 × 7 × 6)/(3 × 2 × 1) = 336/6 = 56.',
      ],
    },
    {
      type: 'example',
      question: 'How many ways can a president, vice-president, and treasurer be chosen from 8 people?',
      steps: [
        'Order matters (different roles are distinct).',
        '⁸P₃ = 8!/(8−3)! = 8 × 7 × 6 = 336.',
      ],
    },
    {
      type: 'tip',
      body: 'Ask yourself: "If I swapped two of my chosen items, would I have a different outcome?" If yes → permutation. If no → combination. For example, {A, B, C} committee is the same as {C, A, B} committee → combination. But President=A, VP=B, Treasurer=C is different from President=B, VP=A, Treasurer=C → permutation.',
    },
  ],

  // ── L5 S1: Binomial Expansions and Pascal's Triangle ─────────────────────────
  'y11-ext1-l5-s1': [
    {
      type: 'text',
      body: "Pascal's triangle provides the coefficients for expanding (a + b)ⁿ. The entry in row n, position r (counting from 0) is ⁿCᵣ. Each entry is the sum of the two directly above it. The triangle also reveals combinatorial patterns including the hockey stick identity and the sum of each row equalling 2ⁿ.",
    },
    {
      type: 'rules',
      heading: "Pascal's Triangle (rows 0–5)",
      items: [
        'Row 0: 1',
        'Row 1: 1  1',
        'Row 2: 1  2  1',
        'Row 3: 1  3  3  1',
        'Row 4: 1  4  6  4  1',
        'Row 5: 1  5  10  10  5  1',
      ],
    },
    {
      type: 'formula',
      latex: '(a+b)^n = \\sum_{r=0}^{n} \\binom{n}{r} a^{n-r}\\,b^r',
      label: 'Binomial expansion',
    },
    {
      type: 'example',
      question: 'Expand (2x − 3)⁴ using Pascal\'s triangle.',
      steps: [
        'Row 4 coefficients: 1, 4, 6, 4, 1.',
        'a = 2x, b = −3, n = 4.',
        '= 1(2x)⁴ + 4(2x)³(−3) + 6(2x)²(−3)² + 4(2x)(−3)³ + 1(−3)⁴',
        '= 16x⁴ + 4(8x³)(−3) + 6(4x²)(9) + 4(2x)(−27) + 81',
        '= 16x⁴ − 96x³ + 216x² − 216x + 81.',
      ],
    },
    {
      type: 'rules',
      heading: 'Important identities from the binomial theorem',
      items: [
        'Setting a = b = 1: ∑ⁿCᵣ = 2ⁿ (sum of all entries in row n).',
        'Setting a = 1, b = −1: ∑(−1)ʳⁿCᵣ = 0 (alternating sum = 0).',
        'Sum of even-indexed terms = Sum of odd-indexed terms = 2ⁿ⁻¹.',
      ],
    },
    {
      type: 'tip',
      body: "Pascal's triangle is fine for small n, but for larger n (like n = 20) it's faster to use the formula ⁿCᵣ directly. The Binomial Theorem formula is always exact — Pascal's triangle just provides a visual aid.",
    },
  ],

  // ── L5 S2: The Binomial Theorem and General Term ──────────────────────────────
  'y11-ext1-l5-s2': [
    {
      type: 'text',
      body: 'The general term (T_{r+1}) of the binomial expansion (a + b)ⁿ lets you find any specific term without expanding the full expression. This is particularly useful for finding a specific term, the term independent of x, or the coefficient of a power of x.',
    },
    {
      type: 'formula',
      latex: 'T_{r+1} = \\binom{n}{r}\\,a^{n-r}\\,b^r',
      label: 'General term (r+1)-th term of (a + b)ⁿ, where r = 0, 1, 2, …, n',
    },
    {
      type: 'steps',
      heading: 'Finding the term independent of x (constant term)',
      items: [
        'Write the general term T_{r+1} using the formula.',
        'Simplify the powers of x (they will typically be xⁿ⁻ʳ × x⁻ʳ = xⁿ⁻²ʳ or similar).',
        'Set the power of x equal to zero and solve for r.',
        'Check r is a non-negative integer ≤ n; if so, substitute back to find the term.',
      ],
    },
    {
      type: 'example',
      question: 'Find the term independent of x in (x + 2/x)⁶.',
      steps: [
        'a = x, b = 2/x = 2x⁻¹, n = 6.',
        'T_{r+1} = ⁶Cᵣ · x^{6−r} · (2x⁻¹)ʳ = ⁶Cᵣ · 2ʳ · x^{6−r} · x^{−r} = ⁶Cᵣ · 2ʳ · x^{6−2r}.',
        'For independence from x: 6 − 2r = 0 → r = 3.',
        'T₄ = ⁶C₃ · 2³ = 20 × 8 = 160.',
      ],
    },
    {
      type: 'example',
      question: 'Find the coefficient of x³ in (2x − 1/x)⁷.',
      steps: [
        'a = 2x, b = −1/x = −x⁻¹, n = 7.',
        'T_{r+1} = ⁷Cᵣ · (2x)^{7−r} · (−x⁻¹)ʳ = ⁷Cᵣ · 2^{7−r} · (−1)ʳ · x^{7−r−r} = ⁷Cᵣ · 2^{7−r} · (−1)ʳ · x^{7−2r}.',
        'Set 7 − 2r = 3 → r = 2.',
        'Coefficient: ⁷C₂ · 2⁵ · (−1)² = 21 × 32 × 1 = 672.',
      ],
    },
    {
      type: 'tip',
      body: 'Always write out the general term fully before setting the power of x equal to the target. A common error is dropping the (−1)ʳ sign from a negative b-term. Track signs carefully.',
    },
  ],


  // ══════════════════════════════════════════════════════════════════════════════
  // YEAR 12 EXTENSION 2
  // ══════════════════════════════════════════════════════════════════════════════

  // ── L1 S1: The Nature of Proof ────────────────────────────────────────────────
  'y12-ext2-l1-s1': [
    {
      type: 'text',
      body: 'Mathematical proof is a logically airtight argument that establishes a statement is true for all relevant cases. Extension 2 requires fluency with several proof techniques: direct proof, proof by contrapositive, proof by contradiction, and proof by mathematical induction. Understanding the structure of each method is as important as executing the algebra.',
    },
    {
      type: 'rules',
      heading: 'Proof methods and when to use them',
      items: [
        'Direct proof: assume the hypothesis and deduce the conclusion via logical steps. Use when the path forward is clear.',
        'Contrapositive: prove "not Q ⟹ not P" instead of "P ⟹ Q" (logically equivalent). Use when the contrapositive is easier.',
        'Contradiction: assume the statement is false and derive a logical impossibility. Use for existence/impossibility results.',
        'Induction: prove a base case, then prove the inductive step. Use for statements about all positive integers (or a discrete set).',
      ],
    },
    {
      type: 'steps',
      heading: 'Structure of a proof by mathematical induction',
      items: [
        'State what you are proving: "Let P(n) be the statement …"',
        'Base case: verify P(1) (or P(0)) is true.',
        'Inductive hypothesis: assume P(k) is true for some k ≥ 1.',
        'Inductive step: prove P(k+1) is true using the assumption that P(k) is true.',
        'Conclusion: "By the principle of mathematical induction, P(n) is true for all n ≥ 1."',
      ],
    },
    {
      type: 'example',
      question: 'Prove by induction: 1 + 2 + 3 + ⋯ + n = n(n+1)/2.',
      steps: [
        'Base case (n=1): LHS = 1. RHS = 1×2/2 = 1. ✓',
        'Assume P(k): 1+2+⋯+k = k(k+1)/2.',
        'Prove P(k+1): 1+2+⋯+k+(k+1) = k(k+1)/2 + (k+1) = (k+1)[k/2 + 1] = (k+1)(k+2)/2.',
        'This is exactly the formula with n = k+1. ✓',
        'By induction, the result holds for all n ≥ 1.',
      ],
    },
    {
      type: 'example',
      question: 'Prove that √2 is irrational.',
      steps: [
        'Assume for contradiction that √2 = p/q where p, q are integers with gcd(p,q)=1.',
        'Then 2 = p²/q², so p² = 2q².',
        'Therefore p² is even, which means p is even. Write p = 2m.',
        'Then (2m)² = 2q² → 4m² = 2q² → q² = 2m².',
        'So q² is even, meaning q is even.',
        'But then p and q are both even, contradicting gcd(p,q) = 1. Contradiction. ✓',
      ],
    },
    {
      type: 'tip',
      body: 'In an induction proof, the inductive step must use the inductive hypothesis — not just verify the formula algebraically for n = k+1. The argument must show how truth at k implies truth at k+1.',
    },
  ],

  // ── L2 S1: Vector Equations of Lines and Curves ───────────────────────────────
  'y12-ext2-l2-s1': [
    {
      type: 'text',
      body: 'In 2D (and 3D), a line can be described by a vector equation: r = a + t·d, where a is a position vector of a point on the line, d is the direction vector, and t is a scalar parameter. This representation avoids the limitations of Cartesian form (e.g. vertical lines) and extends naturally to curves and 3D.',
    },
    {
      type: 'formula',
      latex: '\\mathbf{r} = \\mathbf{a} + t\\,\\mathbf{d},\\quad t \\in \\mathbb{R}',
      label: 'Vector equation of a line through point a with direction d',
    },
    {
      type: 'rules',
      heading: 'Key concepts',
      items: [
        'Two lines are parallel if their direction vectors are scalar multiples of each other.',
        'Two lines intersect if there exist values of t and s such that a + td = b + se.',
        'Two lines are skew (in 3D) if they are not parallel and do not intersect.',
        'The angle θ between two lines satisfies cosθ = |d₁·d₂| / (|d₁||d₂|).',
        'A curve can be expressed as r(t) = (f(t), g(t)), tracing out the curve as t varies.',
      ],
    },
    {
      type: 'steps',
      heading: 'Converting between vector and Cartesian forms (2D)',
      items: [
        'From vector form r = (a₁, a₂) + t(d₁, d₂): write x = a₁ + td₁, y = a₂ + td₂.',
        'Eliminate t: t = (x − a₁)/d₁ = (y − a₂)/d₂ (assuming d₁, d₂ ≠ 0).',
        'Cross-multiply: d₂(x − a₁) = d₁(y − a₂), which simplifies to a Cartesian line.',
      ],
    },
    {
      type: 'example',
      question: 'Find the vector equation of the line through (1, 3) and (4, −1).',
      steps: [
        'Direction vector: d = (4−1, −1−3) = (3, −4).',
        'Point on line: a = (1, 3).',
        'Vector equation: r = (1, 3) + t(3, −4).',
        'Parametric: x = 1 + 3t, y = 3 − 4t.',
        'Cartesian (eliminate t): (x−1)/3 = (y−3)/(−4), i.e. 4x + 3y = 13.',
      ],
    },
    {
      type: 'tip',
      body: 'The direction vector of a line is not unique — any scalar multiple works. The position vector a can be any point on the line. When checking if two vector equations describe the same line, verify the direction vectors are parallel AND that one point from each equation satisfies the other equation.',
    },
  ],

  // ── L3 S1: Introduction to Complex Numbers ────────────────────────────────────
  'y12-ext2-l3-s1': [
    {
      type: 'text',
      body: 'Complex numbers extend the real numbers by introducing i = √(−1), so that every quadratic equation has solutions. A complex number z = a + bi has real part Re(z) = a and imaginary part Im(z) = b. The modulus |z| = √(a² + b²) and argument arg(z) = arctan(b/a) give the polar representation.',
    },
    {
      type: 'formula',
      latex: 'z = a + bi,\\quad i^2 = -1',
      label: 'Rectangular (Cartesian) form',
    },
    {
      type: 'formula',
      latex: 'z = r(\\cos\\theta + i\\sin\\theta) = re^{i\\theta},\\quad r = |z|,\\;\\theta = \\arg(z)',
      label: 'Polar / exponential form (Euler\'s formula)',
    },
    {
      type: 'rules',
      heading: 'Arithmetic with complex numbers',
      items: [
        'Addition: (a+bi) + (c+di) = (a+c) + (b+d)i',
        'Subtraction: (a+bi) − (c+di) = (a−c) + (b−d)i',
        'Multiplication: (a+bi)(c+di) = (ac−bd) + (ad+bc)i',
        'Conjugate: z̄ = a − bi. Note: zz̄ = a² + b² = |z|².',
        'Division: z/w = z·w̄ / |w|² (multiply numerator and denominator by conjugate of denominator).',
      ],
    },
    {
      type: 'rules',
      heading: 'Modulus and argument',
      items: [
        '|z| = √(a² + b²)',
        '|zw| = |z||w|, |z/w| = |z|/|w|',
        'arg(zw) = arg(z) + arg(w), arg(z/w) = arg(z) − arg(w) (mod 2π)',
        'arg(z̄) = −arg(z)',
      ],
    },
    {
      type: 'example',
      question: 'Express z = 1 + i√3 in polar form and find z⁶.',
      steps: [
        '|z| = √(1 + 3) = 2.',
        'arg(z) = arctan(√3/1) = π/3 (first quadrant).',
        'Polar form: z = 2(cos π/3 + i sin π/3) = 2e^{iπ/3}.',
        'z⁶ = 2⁶ e^{i·6π/3} = 64 e^{i2π} = 64(cos 2π + i sin 2π) = 64.',
      ],
    },
    {
      type: 'tip',
      body: 'Use polar form for multiplication, division, and powers — these become simple arithmetic on moduli and arguments. Use rectangular form for addition and subtraction. The formula |z|² = zz̄ is essential for simplifying divisions.',
    },
  ],

  // ── L4 S1: Further Integration Techniques ─────────────────────────────────────
  'y12-ext2-l4-s1': [
    {
      type: 'text',
      body: 'Extension 2 integration introduces techniques beyond the standard methods: integration by parts, partial fractions, trigonometric substitution, and reduction formulas. Selecting the right method for a given integral is a key skill — look at the integrand\'s structure and match it to a method.',
    },
    {
      type: 'formula',
      latex: '\\int u\\,dv = uv - \\int v\\,du',
      label: 'Integration by parts (IBP)',
    },
    {
      type: 'rules',
      heading: 'Choosing u and dv in integration by parts (LIATE priority)',
      items: [
        'L — Logarithmic functions (ln x, log x)',
        'I — Inverse trig functions (arctan, arcsin, arccos)',
        'A — Algebraic functions (polynomials)',
        'T — Trigonometric functions (sin, cos)',
        'E — Exponential functions (eˣ)',
        'Choose u from the left of this list; dv is the rest. This gives a simpler ∫v du.',
      ],
    },
    {
      type: 'example',
      question: 'Find ∫x eˣ dx.',
      steps: [
        'Choose u = x (algebraic), dv = eˣ dx.',
        'Then du = dx, v = eˣ.',
        '∫x eˣ dx = x eˣ − ∫eˣ dx = x eˣ − eˣ + C = eˣ(x − 1) + C.',
      ],
    },
    {
      type: 'rules',
      heading: 'Partial fractions — cases',
      items: [
        'Distinct linear factors: A/(x−a) + B/(x−b).',
        'Repeated linear factor: A/(x−a) + B/(x−a)².',
        'Irreducible quadratic factor: (Ax+B)/(x²+bx+c).',
        'First perform polynomial long division if deg(numerator) ≥ deg(denominator).',
      ],
    },
    {
      type: 'example',
      question: 'Find ∫ 1/[(x+1)(x−2)] dx.',
      steps: [
        '1/[(x+1)(x−2)] = A/(x+1) + B/(x−2).',
        'Multiply out: 1 = A(x−2) + B(x+1).',
        'Set x = 2: 1 = 3B → B = 1/3.',
        'Set x = −1: 1 = −3A → A = −1/3.',
        '∫ = (−1/3)∫1/(x+1)dx + (1/3)∫1/(x−2)dx = (1/3)ln|(x−2)/(x+1)| + C.',
      ],
    },
    {
      type: 'tip',
      body: 'For integrals of the form ∫√(a²−x²)dx or ∫1/√(a²−x²)dx, use the substitution x = a sinθ. For ∫1/(a²+x²)dx, use x = a tanθ. These trigonometric substitutions exploit Pythagorean identities to simplify the integrand.',
    },
  ],

  // ── L5 S1: Applications of Calculus to Mechanics ──────────────────────────────
  'y12-ext2-l5-s1': [
    {
      type: 'text',
      body: 'In mechanics, calculus connects position x, velocity v = dx/dt, and acceleration a = dv/dt = d²x/dt². Acceleration can also be expressed as a = v dv/dx (using the chain rule), which is useful when acceleration depends on position. The equation of motion F = ma ties the mathematics to the physics.',
    },
    {
      type: 'formula',
      latex: 'v = \\frac{dx}{dt},\\quad a = \\frac{dv}{dt} = v\\,\\frac{dv}{dx} = \\frac{d^2x}{dt^2}',
      label: 'Kinematic relationships',
    },
    {
      type: 'rules',
      heading: 'Forms of acceleration and when to use each',
      items: [
        'a = dv/dt: use when a is a function of t. Integrate to find v(t), then integrate again for x(t).',
        'a = v dv/dx: use when a is a function of x (e.g. spring, gravity with air resistance). Integrate to find v²(x), then find t from dt = dx/v.',
        'Simple harmonic motion: a = −n²x (restoring force), giving x = A cos(nt + φ).',
      ],
    },
    {
      type: 'formula',
      latex: 'x = A\\cos(nt + \\varphi),\\quad v^2 = n^2(A^2 - x^2)',
      label: 'Simple Harmonic Motion (SHM)',
    },
    {
      type: 'example',
      question: 'A particle moves with a = 6t − 4. At t = 0, v = 2 and x = −1. Find x(t).',
      steps: [
        'Integrate a: v = ∫(6t−4) dt = 3t² − 4t + C.',
        'Apply v(0) = 2: C = 2. So v = 3t² − 4t + 2.',
        'Integrate v: x = ∫(3t²−4t+2) dt = t³ − 2t² + 2t + D.',
        'Apply x(0) = −1: D = −1. So x = t³ − 2t² + 2t − 1.',
      ],
    },
    {
      type: 'example',
      question: 'A particle has acceleration a = −4x. Find v in terms of x given v = 0 when x = 3.',
      steps: [
        'Use a = v dv/dx: v dv/dx = −4x.',
        'Separate and integrate: ∫v dv = ∫−4x dx → v²/2 = −2x² + C.',
        'Apply v = 0 when x = 3: 0 = −18 + C → C = 18.',
        'v² = −4x² + 36 = 4(9 − x²).',
        'This is SHM with n = 2, amplitude A = 3: v² = n²(A² − x²). ✓',
      ],
    },
    {
      type: 'tip',
      body: 'In SHM (a = −n²x), the particle oscillates between x = −A and x = A with period T = 2π/n. Maximum speed is nA (at x = 0, the equilibrium position). Maximum acceleration magnitude is n²A (at x = ±A, the extreme positions).',
    },
  ],
}
