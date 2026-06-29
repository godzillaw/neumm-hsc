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
  // YEAR 12 EXTENSION 2 — expanded to match NESA 2024 syllabus
  // ══════════════════════════════════════════════════════════════════════════════

  // ── L1 S1: Types of Proof ────────────────────────────────────────────────────
  'y12-ext2-l1-s1': [
    { type: 'text', body: 'A mathematical proof is a logical argument that establishes the truth of a statement beyond doubt. There are several proof strategies; choosing the right one depends on the structure of the statement.' },
    { type: 'rules', heading: 'Four Proof Strategies', items: [
      '**Direct proof**: Assume P is true, then logically deduce Q. Works when the implication P → Q can be followed step by step.',
      '**Contrapositive**: Prove ¬Q → ¬P (equivalent to P → Q). Useful when the negation is easier to work with.',
      '**Contradiction**: Assume ¬P is true, then derive a logical impossibility. Used for statements like "there is no ..." or "√2 is irrational".',
      '**Exhaustion**: Check every case when there are finitely many. Must verify all cases are covered.',
      '**Counterexample**: Disprove "for all x, P(x)" by exhibiting one specific x where P(x) is false.',
    ]},
    { type: 'rules', heading: 'Necessary vs Sufficient', items: [
      '$P \\Rightarrow Q$: P is **sufficient** for Q; Q is **necessary** for P.',
      '$P \\Leftrightarrow Q$: P is both necessary and sufficient for Q ("if and only if").',
    ]},
    { type: 'example', question: 'Prove: if n² is even, then n is even (use contrapositive).', steps: [
      'Contrapositive: if n is odd, then n² is odd.',
      'Assume n is odd, so n = 2k + 1 for some integer k.',
      'Then n² = (2k+1)² = 4k² + 4k + 1 = 2(2k²+2k) + 1, which is odd. ✓',
      'Since the contrapositive is proved, the original statement is proved.',
    ]},
    { type: 'tip', body: 'Never assume what you are trying to prove. In a proof by contradiction, state clearly "Assume for contradiction that ..." and end with "This contradicts [something known to be true], so our assumption was false."' },
  ],

  // ── L1 S2: Proof by Mathematical Induction ───────────────────────────────────
  'y12-ext2-l1-s2': [
    { type: 'text', body: 'Mathematical induction proves a statement P(n) is true for all integers n ≥ n₀ by: (1) proving the base case P(n₀), and (2) proving that if P(k) is true (inductive hypothesis), then P(k+1) must also be true.' },
    { type: 'steps', heading: 'Induction Template', items: [
      '**Base case**: Prove P(1) [or P(0)] is true by direct substitution.',
      '**Inductive hypothesis**: Assume P(k) is true for some arbitrary integer $k \\geq 1$.',
      '**Inductive step**: Using the hypothesis, prove P(k+1) is true. This step is the core of the proof.',
      '**Conclusion**: By the principle of mathematical induction, P(n) is true for all $n \\geq 1$.',
    ]},
    { type: 'formula', latex: '\\sum_{r=1}^{n} r = \\frac{n(n+1)}{2}', label: 'Classic induction target' },
    { type: 'example', question: 'Prove by induction: $1 + 2 + 3 + \\cdots + n = \\dfrac{n(n+1)}{2}$ for all $n \\geq 1$.', steps: [
      'Base case (n=1): LHS = 1. RHS = 1×2/2 = 1. ✓',
      'Inductive hypothesis: Assume $1+2+\\cdots+k = k(k+1)/2$ for some $k \\geq 1$.',
      'Inductive step: Show true for n = k+1.',
      '$1+2+\\cdots+k+(k+1) = k(k+1)/2 + (k+1)$ [by hypothesis]',
      '$= (k+1)[k/2 + 1] = (k+1)(k+2)/2$. This is the formula with n = k+1. ✓',
      'By induction, the result holds for all $n \\geq 1$.',
    ]},
    { type: 'tip', body: 'In the inductive step, start with the LHS for n = k+1, identify the sum up to k (apply the hypothesis), then algebraically simplify to the RHS for n = k+1. Never start with "LHS = RHS" — that assumes what you need to prove.' },
  ],

  // ── L1 S3: Inequalities and Further Proofs ───────────────────────────────────
  'y12-ext2-l1-s3': [
    { type: 'text', body: 'Many inequality proofs rely on the fundamental fact that the square of any real number is non-negative: $x^2 \\geq 0$ for all real $x$, with equality iff $x = 0$.' },
    { type: 'formula', latex: '\\frac{a+b}{2} \\geq \\sqrt{ab} \\quad (a, b \\geq 0)', label: 'AM–GM Inequality' },
    { type: 'steps', heading: 'Proving an Inequality', items: [
      'Rearrange so one side is 0: show $\\text{LHS} - \\text{RHS} \\geq 0$.',
      'Factor or complete the square to express as a sum of squares or known non-negative quantities.',
      'State when equality holds.',
    ]},
    { type: 'example', question: 'Prove that $a^2 + b^2 \\geq 2ab$ for all real $a, b$.', steps: [
      'Consider $(a - b)^2 \\geq 0$ (square of a real number).',
      'Expand: $a^2 - 2ab + b^2 \\geq 0$.',
      'Rearrange: $a^2 + b^2 \\geq 2ab$. ✓',
      'Equality holds when $a = b$.',
    ]},
    { type: 'example', question: 'Use AM-GM to prove that if $x + y = 1$ and $x, y > 0$, then $xy \\leq \\frac{1}{4}$.', steps: [
      'By AM-GM: $(x+y)/2 \\geq \\sqrt{xy}$.',
      'Since $x + y = 1$: $1/2 \\geq \\sqrt{xy}$.',
      'Square: $1/4 \\geq xy$, i.e. $xy \\leq 1/4$. ✓',
      'Equality when $x = y = 1/2$.',
    ]},
    { type: 'tip', body: 'When proving by induction that one function dominates another (e.g. $2^n > n^2$ for $n \\geq 5$), the inductive step often requires multiplying the hypothesis by 2 and comparing.' },
  ],

  // ── L2 S1: Vectors in 2D and 3D ─────────────────────────────────────────────
  'y12-ext2-l2-s1': [
    { type: 'text', body: 'A vector has both magnitude and direction. In 2D we write $\\mathbf{v} = x\\mathbf{i} + y\\mathbf{j}$ or as a column $\\binom{x}{y}$. In 3D: $\\mathbf{v} = x\\mathbf{i} + y\\mathbf{j} + z\\mathbf{k}$.' },
    { type: 'rules', heading: 'Key Vector Operations', items: [
      'Addition: $(a_1\\mathbf{i}+a_2\\mathbf{j}) + (b_1\\mathbf{i}+b_2\\mathbf{j}) = (a_1+b_1)\\mathbf{i}+(a_2+b_2)\\mathbf{j}$',
      'Scalar multiple: $\\lambda\\mathbf{v} = \\lambda x\\mathbf{i} + \\lambda y\\mathbf{j}$',
      'Magnitude: $|\\mathbf{v}| = \\sqrt{x^2+y^2}$ (2D) or $\\sqrt{x^2+y^2+z^2}$ (3D)',
      'Unit vector: $\\hat{\\mathbf{v}} = \\mathbf{v}/|\\mathbf{v}|$',
      'Dot product: $\\mathbf{a}\\cdot\\mathbf{b} = a_1b_1+a_2b_2 = |\\mathbf{a}||\\mathbf{b}|\\cos\\theta$',
      'Perpendicular iff $\\mathbf{a}\\cdot\\mathbf{b} = 0$',
    ]},
    { type: 'example', question: 'Find the angle between $\\mathbf{a} = 3\\mathbf{i} + 4\\mathbf{j}$ and $\\mathbf{b} = \\mathbf{i} + 2\\mathbf{j}$.', steps: [
      '$\\mathbf{a}\\cdot\\mathbf{b} = 3\\times1 + 4\\times2 = 11$',
      '$|\\mathbf{a}| = \\sqrt{9+16} = 5$, $|\\mathbf{b}| = \\sqrt{1+4} = \\sqrt{5}$',
      '$\\cos\\theta = 11/(5\\sqrt{5})$',
      '$\\theta = \\cos^{-1}(11/(5\\sqrt{5})) \\approx 10.3°$',
    ]},
    { type: 'tip', body: 'The projection of vector $\\mathbf{a}$ onto $\\mathbf{b}$ is $\\text{proj}_{\\mathbf{b}}\\mathbf{a} = \\dfrac{\\mathbf{a}\\cdot\\mathbf{b}}{|\\mathbf{b}|^2}\\mathbf{b}$. The scalar projection (length) is $\\dfrac{\\mathbf{a}\\cdot\\mathbf{b}}{|\\mathbf{b}|}$.' },
  ],

  // ── L2 S2: Vector Equations of Lines and Planes ──────────────────────────────
  'y12-ext2-l2-s2': [
    { type: 'text', body: 'A line in 2D or 3D can be described using a position vector to a point on the line and a direction vector along the line.' },
    { type: 'formula', latex: '\\mathbf{r} = \\mathbf{a} + t\\mathbf{d}, \\quad t \\in \\mathbb{R}', label: 'Vector equation of a line' },
    { type: 'steps', heading: 'Converting Forms', items: [
      'From two points A and B: direction $\\mathbf{d} = \\overrightarrow{AB} = \\mathbf{b} - \\mathbf{a}$, then $\\mathbf{r} = \\mathbf{a} + t(\\mathbf{b}-\\mathbf{a})$.',
      'Parametric form: $x = a_1 + td_1$, $y = a_2 + td_2$.',
      'Cartesian form (eliminate t): $\\dfrac{x-a_1}{d_1} = \\dfrac{y-a_2}{d_2}$.',
      'Two lines are parallel if their direction vectors are scalar multiples. They intersect if there exist $s,t$ solving both parametric equations simultaneously.',
    ]},
    { type: 'example', question: 'Find the vector equation of the line through $A(1,2)$ and $B(3,7)$.', steps: [
      'Direction: $\\mathbf{d} = B - A = (3-1)\\mathbf{i} + (7-2)\\mathbf{j} = 2\\mathbf{i}+5\\mathbf{j}$.',
      'Vector equation: $\\mathbf{r} = (\\mathbf{i}+2\\mathbf{j}) + t(2\\mathbf{i}+5\\mathbf{j})$.',
      'Parametric: $x = 1+2t$, $y = 2+5t$.',
      'Cartesian: eliminate $t$: $(x-1)/2 = (y-2)/5$, i.e. $5x - 2y = 1$.',
    ]},
    { type: 'tip', body: 'Lines in 3D can be parallel, intersecting, or skew (neither parallel nor intersecting). Check for intersection by equating components — if the system is inconsistent, the lines are skew.' },
  ],

  // ── L2 S3: Geometric Proofs with Vectors ─────────────────────────────────────
  'y12-ext2-l2-s3': [
    { type: 'text', body: 'Vectors are a powerful tool for proving geometric results. Express all points as position vectors, then use vector algebra to establish the required relationship.' },
    { type: 'rules', heading: 'Key Vector Geometry Facts', items: [
      'Midpoint of AB: $\\mathbf{m} = \\frac{1}{2}(\\mathbf{a}+\\mathbf{b})$',
      'G divides AB in ratio m:n from A: $\\mathbf{g} = \\frac{n\\mathbf{a}+m\\mathbf{b}}{m+n}$',
      'Points are collinear iff $\\overrightarrow{AB} = k\\overrightarrow{AC}$ for some scalar $k$',
      'AB ⊥ CD iff $\\overrightarrow{AB}\\cdot\\overrightarrow{CD} = 0$',
    ]},
    { type: 'example', question: 'Prove that the diagonals of a parallelogram bisect each other.', steps: [
      'Let $A$, $B$, $C$, $D$ be vertices with position vectors $\\mathbf{a}, \\mathbf{b}, \\mathbf{c}, \\mathbf{d}$.',
      'Since ABCD is a parallelogram: $\\overrightarrow{AB} = \\overrightarrow{DC}$, so $\\mathbf{b}-\\mathbf{a} = \\mathbf{c}-\\mathbf{d}$, giving $\\mathbf{b}+\\mathbf{d} = \\mathbf{a}+\\mathbf{c}$.',
      'Midpoint of diagonal AC: $\\frac{1}{2}(\\mathbf{a}+\\mathbf{c})$.',
      'Midpoint of diagonal BD: $\\frac{1}{2}(\\mathbf{b}+\\mathbf{d})$.',
      'Since $\\mathbf{a}+\\mathbf{c} = \\mathbf{b}+\\mathbf{d}$, the midpoints are equal. ✓ The diagonals bisect each other.',
    ]},
    { type: 'tip', body: 'To prove three points are collinear, show $\\overrightarrow{AB} = k\\overrightarrow{BC}$ for some scalar k (they share the point B and are parallel).' },
  ],

  // ── L3 S1: Arithmetic and the Argand Diagram ─────────────────────────────────
  'y12-ext2-l3-s1': [
    { type: 'text', body: 'Complex numbers extend the real numbers by introducing $i = \\sqrt{-1}$. Every complex number has a real part and an imaginary part, and can be plotted on the Argand diagram.' },
    { type: 'formula', latex: 'z = x + iy, \\quad \\bar{z} = x - iy, \\quad |z| = \\sqrt{x^2+y^2}', label: 'Cartesian form' },
    { type: 'rules', heading: 'Arithmetic Rules', items: [
      'Add/subtract: $(a+bi)\\pm(c+di) = (a\\pm c)+(b\\pm d)i$',
      'Multiply: $(a+bi)(c+di) = (ac-bd)+(ad+bc)i$ (use FOIL, $i^2=-1$)',
      'Divide: multiply top and bottom by the conjugate $\\bar{z}$: $\\dfrac{a+bi}{c+di} = \\dfrac{(a+bi)(c-di)}{c^2+d^2}$',
      '$z\\bar{z} = |z|^2 = x^2+y^2$ (always real and ≥ 0)',
    ]},
    { type: 'example', question: 'Simplify $\\dfrac{3+2i}{1-i}$.', steps: [
      'Multiply by conjugate: $\\dfrac{(3+2i)(1+i)}{(1-i)(1+i)}$',
      'Denominator: $1+1 = 2$',
      'Numerator: $3+3i+2i+2i^2 = 3+5i-2 = 1+5i$',
      'Result: $\\dfrac{1+5i}{2} = \\dfrac{1}{2} + \\dfrac{5}{2}i$',
    ]},
    { type: 'tip', body: 'On the Argand diagram, $z$ and $\\bar{z}$ are reflections of each other in the real axis. Adding two complex conjugates gives a real number: $z + \\bar{z} = 2x$.' },
  ],

  // ── L3 S2: Modulus-Argument and Polar Form ───────────────────────────────────
  'y12-ext2-l3-s2': [
    { type: 'text', body: 'Every non-zero complex number can be written in polar (modulus-argument) form, which makes multiplication and division geometrically clear.' },
    { type: 'formula', latex: 'z = r(\\cos\\theta + i\\sin\\theta) = r\\operatorname{cis}\\theta', label: 'Polar form' },
    { type: 'rules', heading: 'Multiplication and Division in Polar Form', items: [
      '$z_1 z_2 = r_1 r_2 \\operatorname{cis}(\\theta_1+\\theta_2)$ — multiply moduli, add arguments',
      '$z_1/z_2 = (r_1/r_2)\\operatorname{cis}(\\theta_1-\\theta_2)$ — divide moduli, subtract arguments',
      'Principal argument: $\\theta \\in (-\\pi,\\, \\pi]$. Use the quadrant of $(x,y)$ to determine sign of $\\theta$.',
    ]},
    { type: 'table', headers: ['Quadrant', 'Sign of x', 'Sign of y', 'arg(z)'], rows: [
      ['1st', '+', '+', 'θ = arctan(y/x)'],
      ['2nd', '−', '+', 'θ = π − arctan(y/|x|)'],
      ['3rd', '−', '−', 'θ = −π + arctan(y/|x|)'],
      ['4th', '+', '−', 'θ = −arctan(|y|/x)'],
    ]},
    { type: 'example', question: 'Write $z = -1 + i$ in polar form.', steps: [
      '$r = \\sqrt{(-1)^2+1^2} = \\sqrt{2}$',
      '$z$ is in the 2nd quadrant: $\\theta = \\pi - \\arctan(1/1) = \\pi - \\pi/4 = 3\\pi/4$',
      '$z = \\sqrt{2}\\operatorname{cis}(3\\pi/4)$',
    ]},
    { type: 'tip', body: 'Geometrically: multiplying by $\\operatorname{cis}\\alpha$ rotates the point by angle $\\alpha$ about the origin. Multiplying by $r$ scales the modulus.' },
  ],

  // ── L3 S3: De Moivre's Theorem and Roots ─────────────────────────────────────
  "y12-ext2-l3-s3": [
    { type: 'text', body: "De Moivre's theorem is the key tool for computing powers of complex numbers and finding all nth roots." },
    { type: 'formula', latex: "(r\\operatorname{cis}\\theta)^n = r^n\\operatorname{cis}(n\\theta)", label: "De Moivre's Theorem" },
    { type: 'rules', heading: 'nth Roots of a Complex Number', items: [
      'The $n$ solutions of $z^n = w$ (where $w = R\\operatorname{cis}\\phi$) are:',
      '$z_k = R^{1/n}\\operatorname{cis}\\!\\left(\\dfrac{\\phi+2\\pi k}{n}\\right)$ for $k = 0, 1, \\ldots, n-1$',
      'The $n$ roots are equally spaced around a circle of radius $R^{1/n}$, separated by angles of $2\\pi/n$.',
      'Roots of unity ($w=1$, $R=1$, $\\phi=0$): $z_k = \\operatorname{cis}(2\\pi k/n)$',
    ]},
    { type: 'example', question: 'Find all cube roots of $z^3 = 8$.', steps: [
      'Write $8 = 8\\operatorname{cis}(0)$. So $R=8$, $\\phi=0$, $n=3$.',
      '$z_k = 8^{1/3}\\operatorname{cis}(2\\pi k/3) = 2\\operatorname{cis}(2\\pi k/3)$ for $k=0,1,2$.',
      '$z_0 = 2\\operatorname{cis}(0) = 2$',
      '$z_1 = 2\\operatorname{cis}(2\\pi/3) = 2(-\\tfrac{1}{2}+\\tfrac{\\sqrt{3}}{2}i) = -1+\\sqrt{3}i$',
      '$z_2 = 2\\operatorname{cis}(4\\pi/3) = -1-\\sqrt{3}i$',
    ]},
    { type: 'tip', body: "To use De Moivre's theorem to find trig identities: expand $(\\cos\\theta+i\\sin\\theta)^n$ with the binomial theorem, then equate real and imaginary parts to $\\cos(n\\theta)$ and $\\sin(n\\theta)$." },
  ],

  // ── L3 S4: Curves and Loci on the Argand Diagram ─────────────────────────────
  'y12-ext2-l3-s4': [
    { type: 'text', body: 'A locus is a set of points satisfying a given condition. On the Argand diagram, conditions on $|z-a|$ and $\\arg(z-a)$ define circles, rays, and lines.' },
    { type: 'table', headers: ['Condition', 'Locus', 'Description'], rows: [
      ['|z − a| = r', 'Circle', 'Centre a, radius r'],
      ['|z − a| = |z − b|', 'Line', 'Perpendicular bisector of segment from a to b'],
      ['arg(z − a) = θ', 'Ray', 'From point a at angle θ (not including a)'],
      ['|z − a| ≤ r', 'Disk', 'Closed disk centre a radius r'],
    ]},
    { type: 'steps', heading: 'Sketching a Locus', items: [
      'Identify the type from the condition (circle, line, ray, region).',
      'Convert to Cartesian form by writing $z = x+iy$ and expanding.',
      'Identify centre/radius or gradient/intercept.',
      'Plot, clearly marking key points and boundary conditions (open/closed).',
    ]},
    { type: 'example', question: 'Describe and sketch $|z - 2 - 3i| = \\sqrt{5}$.', steps: [
      'This has the form $|z - a| = r$ with $a = 2+3i$ and $r = \\sqrt{5}$.',
      'Locus: circle with centre $(2, 3)$ and radius $\\sqrt{5}$ on the Argand diagram.',
      'Cartesian: $(x-2)^2 + (y-3)^2 = 5$.',
    ]},
    { type: 'tip', body: 'For $\\arg(z-a)=\\theta$: this is a RAY starting at the point $a$ (not including $a$) going in direction $\\theta$. For a HALF-PLANE, conditions like $\\text{Im}(z) > 0$ mean $y > 0$.' },
  ],

  // ── L4 S1: Integration by Parts and Substitution ─────────────────────────────
  'y12-ext2-l4-s1': [
    { type: 'text', body: 'Two fundamental advanced integration techniques: substitution (reverse chain rule) and integration by parts (product rule in reverse).' },
    { type: 'formula', latex: '\\int u\\,dv = uv - \\int v\\,du', label: 'Integration by Parts' },
    { type: 'steps', heading: 'Choosing u (LIATE Rule)', items: [
      '**L**ogarithms: $\\ln x$, $\\log_a x$',
      '**I**nverse trig: $\\sin^{-1}x$, $\\tan^{-1}x$',
      '**A**lgebraic: $x^n$, polynomials',
      '**T**rigonometric: $\\sin x$, $\\cos x$',
      '**E**xponential: $e^x$, $a^x$',
      'Choose the first type that appears in your integral as $u$; the rest is $dv$.',
    ]},
    { type: 'example', question: 'Find $\\displaystyle\\int x e^x\\,dx$.', steps: [
      'Let $u = x$ (Algebraic, higher in LIATE), $dv = e^x\\,dx$.',
      'Then $du = dx$, $v = e^x$.',
      '$\\int xe^x\\,dx = xe^x - \\int e^x\\,dx = xe^x - e^x + C = e^x(x-1)+C$.',
    ]},
    { type: 'example', question: 'Find $\\displaystyle\\int \\ln x\\,dx$.', steps: [
      'Let $u = \\ln x$, $dv = dx$. Then $du = (1/x)\\,dx$, $v = x$.',
      '$\\int \\ln x\\,dx = x\\ln x - \\int x\\cdot\\frac{1}{x}\\,dx = x\\ln x - x + C$.',
    ]},
    { type: 'tip', body: 'If integration by parts gives $\\int f\\,dx = \\text{something} + k\\int f\\,dx$, collect the integral on the left: $(1-k)\\int f\\,dx = \\text{something}$, then divide.' },
  ],

  // ── L4 S2: Partial Fractions and Trig Substitutions ──────────────────────────
  'y12-ext2-l4-s2': [
    { type: 'text', body: 'Partial fractions decompose a rational function into simpler pieces that are easy to integrate. Trigonometric substitutions handle integrands involving $\\sqrt{a^2-x^2}$, $\\sqrt{x^2+a^2}$, etc.' },
    { type: 'rules', heading: 'Partial Fraction Forms', items: [
      'Distinct linear factors: $\\dfrac{A}{x-a} + \\dfrac{B}{x-b}$',
      'Repeated linear factor: $\\dfrac{A}{x-a} + \\dfrac{B}{(x-a)^2}$',
      'Irreducible quadratic: $\\dfrac{Ax+B}{x^2+bx+c}$',
      'If degree of numerator ≥ degree of denominator, do polynomial long division first.',
    ]},
    { type: 'rules', heading: 'Trigonometric Substitutions', items: [
      '$\\sqrt{a^2-x^2}$: substitute $x = a\\sin\\theta$',
      '$\\sqrt{a^2+x^2}$ or $a^2+x^2$: substitute $x = a\\tan\\theta$',
      '$\\sqrt{x^2-a^2}$: substitute $x = a\\sec\\theta$',
    ]},
    { type: 'example', question: 'Find $\\displaystyle\\int \\frac{1}{x^2-1}\\,dx$.', steps: [
      'Partial fractions: $\\dfrac{1}{(x-1)(x+1)} = \\dfrac{A}{x-1}+\\dfrac{B}{x+1}$',
      'Multiply through: $1 = A(x+1)+B(x-1)$. Set $x=1$: $A=\\tfrac{1}{2}$. Set $x=-1$: $B=-\\tfrac{1}{2}$.',
      '$\\int \\dfrac{1}{x^2-1}\\,dx = \\tfrac{1}{2}\\ln|x-1| - \\tfrac{1}{2}\\ln|x+1| + C = \\tfrac{1}{2}\\ln\\left|\\dfrac{x-1}{x+1}\\right|+C$',
    ]},
    { type: 'tip', body: 'After a trig substitution, always convert back to x at the end. Draw a right triangle labelled with the substitution to find all trig ratios in terms of x.' },
  ],

  // ── L4 S3: Volumes of Solids of Revolution ───────────────────────────────────
  'y12-ext2-l4-s3': [
    { type: 'text', body: 'Rotating a curve about an axis generates a 3D solid. The volume can be found by integrating the area of thin circular cross-sections (disks or washers).' },
    { type: 'formula', latex: 'V = \\pi\\int_a^b [f(x)]^2\\,dx', label: 'Rotation about x-axis (disk method)' },
    { type: 'rules', heading: 'Methods', items: [
      '**Disk method** (rotation about x-axis): $V = \\pi\\int_a^b [f(x)]^2\\,dx$',
      '**Washer method** (region between $y=f(x)$ and $y=g(x)$, $f\\geq g$): $V = \\pi\\int_a^b \\left([f(x)]^2-[g(x)]^2\\right)dx$',
      '**Rotation about y-axis**: $V = \\pi\\int_c^d [g(y)]^2\\,dy$ where $x = g(y)$',
      '**Shell method** (about y-axis): $V = 2\\pi\\int_a^b x f(x)\\,dx$',
    ]},
    { type: 'example', question: 'Find the volume when $y = \\sqrt{x}$ is rotated about the x-axis from $x=0$ to $x=4$.', steps: [
      '$V = \\pi\\int_0^4 (\\sqrt{x})^2\\,dx = \\pi\\int_0^4 x\\,dx$',
      '$= \\pi\\left[\\dfrac{x^2}{2}\\right]_0^4 = \\pi\\cdot 8 = 8\\pi$',
    ]},
    { type: 'tip', body: 'Always sketch the region first. For the washer method, the outer radius is $f(x)$ and the inner radius is $g(x)$ — subtracting the areas gives the washer cross-section $\\pi(f^2-g^2)$.' },
  ],

  // ── L5 S1: Motion and Forces ─────────────────────────────────────────────────
  'y12-ext2-l5-s1': [
    { type: 'text', body: "Newton's Second Law F = ma connects the net force on a particle to its acceleration. Calculus lets us solve equations of motion to find position, velocity, and acceleration as functions of time." },
    { type: 'formula', latex: 'F = ma = m\\frac{dv}{dt} = m\\frac{d^2x}{dt^2}', label: "Newton's Second Law" },
    { type: 'rules', heading: 'Three Useful Forms of Acceleration', items: [
      '$a = \\dfrac{dv}{dt}$ — use when force depends on time',
      '$a = v\\dfrac{dv}{dx}$ — use when force depends on position (e.g. spring, gravity)',
      '$a = \\dfrac{d^2x}{dt^2}$ — use for second-order ODEs',
    ]},
    { type: 'steps', heading: 'Solving a Motion Problem', items: [
      'Identify the forces and write $F = ma$ as a differential equation.',
      'Choose the correct form of $a$ (above) to separate variables.',
      'Integrate and apply initial conditions (e.g. $v = v_0$ at $t = 0$).',
      'Interpret: find when $v = 0$ (momentarily at rest), maximum speed, position.',
    ]},
    { type: 'example', question: 'A particle of mass 1 kg falls under gravity with air resistance $F_r = 2v$. Find $v(t)$ given $v(0)=0$.', steps: [
      'Net force downward: $F = mg - 2v = 10 - 2v$ (taking down as positive, $g=10$).',
      '$\\dfrac{dv}{dt} = 10 - 2v$. Separate: $\\dfrac{dv}{10-2v} = dt$.',
      'Integrate: $-\\tfrac{1}{2}\\ln|10-2v| = t + C$.',
      'At $t=0$, $v=0$: $C = -\\tfrac{1}{2}\\ln 10$. So $\\ln\\dfrac{10}{10-2v} = 2t$.',
      '$v = 5(1-e^{-2t})$. Terminal velocity: $v\\to 5$ m/s as $t\\to\\infty$.',
    ]},
    { type: 'tip', body: 'Terminal velocity occurs when acceleration = 0, i.e. when net force = 0. Set $F = 0$ in the equation of motion to find it directly without solving the ODE.' },
  ],

  // ── L5 S2: Simple Harmonic Motion ────────────────────────────────────────────
  'y12-ext2-l5-s2': [
    { type: 'text', body: 'Simple Harmonic Motion (SHM) occurs when the restoring force is proportional to displacement from equilibrium and directed towards it. It models springs, pendulums (small angles), and oscillating circuits.' },
    { type: 'formula', latex: '\\ddot{x} = -n^2 x \\implies x = a\\cos(nt+\\alpha)', label: 'SHM equation and general solution' },
    { type: 'rules', heading: 'Key SHM Results', items: [
      'Period: $T = 2\\pi/n$',
      'Amplitude: $a$ (maximum displacement from equilibrium)',
      'Velocity: $v^2 = n^2(a^2-x^2)$ — maximum speed $= na$ at $x=0$',
      'Acceleration: $\\ddot{x} = -n^2x$ — maximum $|a|= n^2a$ at $x=\\pm a$',
      'The particle oscillates between $x=-a$ and $x=a$.',
    ]},
    { type: 'example', question: 'A particle in SHM has amplitude 3 m and period $\\pi$ s. Find: (a) $n$, (b) max speed, (c) $v$ when $x=2$.', steps: [
      '(a) $T = \\pi \\Rightarrow 2\\pi/n = \\pi \\Rightarrow n = 2$.',
      '(b) Max speed $= na = 2\\times3 = 6$ m/s (at $x=0$).',
      '(c) $v^2 = n^2(a^2-x^2) = 4(9-4) = 20$. So $v = 2\\sqrt{5}$ m/s.',
    ]},
    { type: 'tip', body: 'To identify SHM from an equation of motion: get it into the form $\\ddot{x} = -n^2(x - c)$. Then $c$ is the equilibrium position and $n$ is the angular frequency. Shift $X = x-c$ and the motion in $X$ is standard SHM.' },
  ],

  // ── L5 S3: Projectile Motion and Resisted Motion ─────────────────────────────
  'y12-ext2-l5-s3': [
    { type: 'text', body: 'Projectile motion assumes no air resistance — horizontal velocity is constant and vertical acceleration is $-g$. Resisted motion adds a drag force opposing the velocity.' },
    { type: 'rules', heading: 'Projectile Motion Equations', items: [
      'Horizontal: $\\ddot{x} = 0 \\Rightarrow x = Vt\\cos\\alpha$',
      'Vertical: $\\ddot{y} = -g \\Rightarrow y = Vt\\sin\\alpha - \\tfrac{1}{2}gt^2$',
      'Eliminate $t$ for trajectory: $y = x\\tan\\alpha - \\dfrac{gx^2}{2V^2\\cos^2\\alpha}$',
      'Range: $R = V^2\\sin2\\alpha/g$ (max when $\\alpha=45°$)',
      'Max height: $H = V^2\\sin^2\\alpha/(2g)$',
      'Time of flight: $T = 2V\\sin\\alpha/g$',
    ]},
    { type: 'example', question: 'A ball is launched at $20$ m/s at $30°$ to the horizontal. Find the range ($g=10$).', steps: [
      '$R = V^2\\sin2\\alpha/g = 400\\times\\sin60°/10 = 40\\times(\\sqrt{3}/2) = 20\\sqrt{3} \\approx 34.6$ m.',
    ]},
    { type: 'steps', heading: 'Resisted Motion (e.g. drag $= -mkv$)', items: [
      'Write equation of motion: $m\\ddot{x} = -mkv \\Rightarrow \\dot{v} = -kv$.',
      'Separate and integrate: $\\int dv/v = -k\\int dt \\Rightarrow \\ln v = -kt+C$.',
      'Apply $v(0)=v_0$: $v = v_0 e^{-kt}$.',
      'Integrate again for position: $x = (v_0/k)(1-e^{-kt})$.',
    ]},
    { type: 'tip', body: 'In resisted motion problems, the particle asymptotically approaches terminal velocity (horizontal) or zero velocity (upward motion). There is no longer a neat closed-form range formula — set $y=0$ numerically or by simultaneous equations.' },
  ],
}
