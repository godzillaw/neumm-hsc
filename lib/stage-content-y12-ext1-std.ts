import type { ExplanationBlock } from './curriculum'

export const STAGE_CONTENT_Y12_EXT1_STD: Record<string, ExplanationBlock[]> = {

  // ════════════════════════════════════════════════════════════════════════════
  // YEAR 12 EXTENSION 1
  // ════════════════════════════════════════════════════════════════════════════

  // ── L1 S1: Proof by Mathematical Induction ──────────────────────────────────
  'y12-ext1-l1-s1': [
    {
      type: 'text',
      body: 'Mathematical induction is a two-step proof technique used to establish that a statement P(n) is true for every integer n greater than or equal to some starting value n₀. The idea is like knocking over a row of dominoes: first you knock over the first one (base case), then you show that if one falls, the next must also fall (inductive step).',
    },
    {
      type: 'steps',
      heading: 'Structure of a proof by induction',
      items: [
        'State clearly what P(n) asserts.',
        'Base case: verify P(n₀) is true directly (usually n₀ = 1).',
        'Inductive hypothesis: assume P(k) is true for some arbitrary integer k ≥ n₀.',
        'Inductive step: using the assumption P(k), prove P(k + 1) is true.',
        'Conclude: by the principle of mathematical induction, P(n) is true for all n ≥ n₀.',
      ],
    },
    {
      type: 'formula',
      latex: '\\text{If } P(n_0) \\text{ is true, and } P(k) \\Rightarrow P(k+1) \\text{ for all } k \\ge n_0, \\text{ then } P(n) \\text{ is true for all } n \\ge n_0.',
      label: 'Principle of mathematical induction',
    },
    {
      type: 'example',
      question: 'Prove by mathematical induction that 1 + 2 + 3 + ⋯ + n = n(n+1)/2 for all positive integers n.',
      steps: [
        'Let $P(n)$: $\\displaystyle\\sum_{r=1}^{n} r = \\dfrac{n(n+1)}{2}$.',
        'Base case ($n = 1$): LHS $= 1$. RHS $= \\dfrac{1 \\cdot 2}{2} = 1$. $\\checkmark$',
        'Inductive hypothesis: assume $P(k)$ is true, i.e. $1 + 2 + \\cdots + k = \\dfrac{k(k+1)}{2}$.',
        'Inductive step: consider $1 + 2 + \\cdots + k + (k+1)$.',
        '$= \\dfrac{k(k+1)}{2} + (k+1)$ \\hspace{1em}(using the hypothesis)',
        '$= (k+1)\\!\\left(\\dfrac{k}{2} + 1\\right) = \\dfrac{(k+1)(k+2)}{2}$.',
        'This is $P(k+1)$ with $n = k+1$. So $P(k+1)$ is true.',
        'By mathematical induction, $P(n)$ is true for all $n \\ge 1$.',
      ],
    },
    {
      type: 'example',
      question: 'Prove by mathematical induction that 3ⁿ − 1 is divisible by 2 for all positive integers n.',
      steps: [
        'Let $P(n)$: $2 \\mid (3^n - 1)$.',
        'Base case ($n = 1$): $3^1 - 1 = 2$. $2 \\mid 2$. $\\checkmark$',
        'Inductive hypothesis: assume $3^k - 1 = 2m$ for some integer $m$, i.e. $3^k = 2m + 1$.',
        'Inductive step: $3^{k+1} - 1 = 3 \\cdot 3^k - 1 = 3(2m+1) - 1 = 6m + 3 - 1 = 6m + 2 = 2(3m+1)$.',
        'Since $3m + 1$ is an integer, $2 \\mid (3^{k+1} - 1)$. So $P(k+1)$ is true.',
        'By mathematical induction, $2 \\mid (3^n - 1)$ for all $n \\ge 1$.',
      ],
    },
    {
      type: 'tip',
      body: 'In the inductive step, always start from the LHS of P(k+1) and work toward the RHS, or start from a known identity and substitute the inductive hypothesis. Never assume what you are trying to prove.',
    },
    {
      type: 'tip',
      body: 'For divisibility proofs, express the quantity at stage k+1 in terms of the quantity at stage k. A common trick is to write 3^(k+1) = 3·3^k and then substitute 3^k from the inductive hypothesis.',
    },
  ],

  // ── L2 S1: Vector Representation and Operations ─────────────────────────────
  'y12-ext1-l2-s1': [
    {
      type: 'text',
      body: 'A vector is a quantity with both magnitude and direction. Unlike scalars (which have magnitude only), vectors describe displacement, velocity, and force. In the HSC course, vectors are written in component form using unit vectors i (horizontal) and j (vertical), or as column matrices.',
    },
    {
      type: 'formula',
      latex: '\\mathbf{a} = a_1\\,\\mathbf{i} + a_2\\,\\mathbf{j} = \\begin{pmatrix} a_1 \\\\ a_2 \\end{pmatrix}, \\quad |\\mathbf{a}| = \\sqrt{a_1^2 + a_2^2}',
      label: 'Component form and magnitude',
    },
    {
      type: 'rules',
      heading: 'Key vector operations',
      items: [
        'Addition: $\\mathbf{a} + \\mathbf{b} = (a_1 + b_1)\\,\\mathbf{i} + (a_2 + b_2)\\,\\mathbf{j}$',
        'Subtraction: $\\mathbf{a} - \\mathbf{b} = (a_1 - b_1)\\,\\mathbf{i} + (a_2 - b_2)\\,\\mathbf{j}$',
        'Scalar multiplication: $k\\mathbf{a} = ka_1\\,\\mathbf{i} + ka_2\\,\\mathbf{j}$ — scales magnitude by $|k|$, reverses direction if $k < 0$',
        'Unit vector in direction of $\\mathbf{a}$: $\\hat{\\mathbf{a}} = \\dfrac{\\mathbf{a}}{|\\mathbf{a}|}$',
        'Position vector of point $P(x, y)$: $\\overrightarrow{OP} = x\\,\\mathbf{i} + y\\,\\mathbf{j}$',
        'Vector from $A$ to $B$: $\\overrightarrow{AB} = \\overrightarrow{OB} - \\overrightarrow{OA}$',
      ],
    },
    {
      type: 'example',
      question: 'Given a = 3i − 4j and b = −i + 2j, find |a|, a + b, 2a − 3b, and a unit vector in the direction of a.',
      steps: [
        '$|\\mathbf{a}| = \\sqrt{3^2 + (-4)^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5$.',
        '$\\mathbf{a} + \\mathbf{b} = (3-1)\\,\\mathbf{i} + (-4+2)\\,\\mathbf{j} = 2\\,\\mathbf{i} - 2\\,\\mathbf{j}$.',
        '$2\\mathbf{a} - 3\\mathbf{b} = (6\\,\\mathbf{i} - 8\\,\\mathbf{j}) - (-3\\,\\mathbf{i} + 6\\,\\mathbf{j}) = 9\\,\\mathbf{i} - 14\\,\\mathbf{j}$.',
        'Unit vector: $\\hat{\\mathbf{a}} = \\dfrac{1}{5}(3\\,\\mathbf{i} - 4\\,\\mathbf{j}) = \\dfrac{3}{5}\\,\\mathbf{i} - \\dfrac{4}{5}\\,\\mathbf{j}$.',
      ],
    },
    {
      type: 'tip',
      body: 'Two vectors are parallel if one is a scalar multiple of the other: a = kb for some scalar k. They are equal only if they have identical components — parallel vectors at different positions are not equal as free vectors.',
    },
  ],

  // ── L2 S2: Dot Product and Projections ──────────────────────────────────────
  'y12-ext1-l2-s2': [
    {
      type: 'text',
      body: 'The dot product (also called scalar product) combines two vectors to give a single number. Its key application is finding the angle between two vectors and determining whether they are perpendicular. The scalar and vector projections let you decompose one vector along the direction of another.',
    },
    {
      type: 'formula',
      latex: '\\mathbf{a} \\cdot \\mathbf{b} = a_1 b_1 + a_2 b_2 = |\\mathbf{a}||\\mathbf{b}|\\cos\\theta',
      label: 'Dot product (two equivalent definitions)',
    },
    {
      type: 'rules',
      heading: 'Dot product properties',
      items: [
        '$\\mathbf{a} \\cdot \\mathbf{b} = \\mathbf{b} \\cdot \\mathbf{a}$ (commutative)',
        '$\\mathbf{a} \\cdot \\mathbf{a} = |\\mathbf{a}|^2$',
        'If $\\mathbf{a} \\perp \\mathbf{b}$ then $\\mathbf{a} \\cdot \\mathbf{b} = 0$ (and vice versa)',
        'Angle between vectors: $\\cos\\theta = \\dfrac{\\mathbf{a} \\cdot \\mathbf{b}}{|\\mathbf{a}||\\mathbf{b}|}$',
        'Scalar projection of $\\mathbf{b}$ onto $\\mathbf{a}$: $\\dfrac{\\mathbf{a} \\cdot \\mathbf{b}}{|\\mathbf{a}|}$',
        'Vector projection of $\\mathbf{b}$ onto $\\mathbf{a}$: $\\dfrac{\\mathbf{a} \\cdot \\mathbf{b}}{|\\mathbf{a}|^2}\\,\\mathbf{a}$',
      ],
    },
    {
      type: 'example',
      question: 'Given a = 2i + j and b = i − 3j, find a · b, the angle between a and b, and the vector projection of b onto a.',
      steps: [
        '$\\mathbf{a} \\cdot \\mathbf{b} = (2)(1) + (1)(-3) = 2 - 3 = -1$.',
        '$|\\mathbf{a}| = \\sqrt{4+1} = \\sqrt{5}$; $|\\mathbf{b}| = \\sqrt{1+9} = \\sqrt{10}$.',
        '$\\cos\\theta = \\dfrac{-1}{\\sqrt{5}\\cdot\\sqrt{10}} = \\dfrac{-1}{\\sqrt{50}} = \\dfrac{-1}{5\\sqrt{2}}$.',
        '$\\theta = \\cos^{-1}\\!\\left(\\dfrac{-1}{5\\sqrt{2}}\\right) \\approx 98.1°$.',
        'Vector projection of $\\mathbf{b}$ onto $\\mathbf{a}$: $\\dfrac{-1}{5}\\,(2\\,\\mathbf{i}+\\mathbf{j}) = -\\dfrac{2}{5}\\,\\mathbf{i} - \\dfrac{1}{5}\\,\\mathbf{j}$.',
      ],
    },
    {
      type: 'example',
      question: 'Find the value of λ so that a = 3i + λj and b = 2i − 4j are perpendicular.',
      steps: [
        'Perpendicular $\\Rightarrow$ $\\mathbf{a} \\cdot \\mathbf{b} = 0$.',
        '$(3)(2) + (\\lambda)(-4) = 0$.',
        '$6 - 4\\lambda = 0 \\Rightarrow \\lambda = \\dfrac{3}{2}$.',
      ],
    },
    {
      type: 'tip',
      body: 'The dot product can be negative (obtuse angle), zero (perpendicular), or positive (acute angle). The dot product gives a scalar, not a vector — do not write a · b as a vector.',
    },
  ],

  // ── L2 S3: Projectile Motion ─────────────────────────────────────────────────
  'y12-ext1-l2-s3': [
    {
      type: 'text',
      body: 'Projectile motion describes an object launched with an initial speed V at angle α above the horizontal, subject only to the downward acceleration due to gravity g ≈ 9.8 m/s². The horizontal and vertical components of motion are independent and are analysed separately using vectors.',
    },
    {
      type: 'formula',
      latex: '\\mathbf{r}(t) = (V\\cos\\alpha)\\,t\\,\\mathbf{i} + \\left(V\\sin\\alpha\\,t - \\tfrac{1}{2}g t^2\\right)\\mathbf{j}',
      label: 'Position vector of a projectile',
    },
    {
      type: 'rules',
      heading: 'Key projectile formulas',
      items: [
        'Horizontal displacement: $x = Vt\\cos\\alpha$',
        'Vertical displacement: $y = Vt\\sin\\alpha - \\tfrac{1}{2}gt^2$',
        'Time of flight: $T = \\dfrac{2V\\sin\\alpha}{g}$',
        'Range: $R = \\dfrac{V^2\\sin 2\\alpha}{g}$',
        'Maximum height: $H = \\dfrac{V^2\\sin^2\\!\\alpha}{2g}$',
        'Cartesian equation: $y = x\\tan\\alpha - \\dfrac{gx^2}{2V^2\\cos^2\\!\\alpha}$',
      ],
    },
    {
      type: 'example',
      question: 'A ball is projected at 20 m/s at 30° to the horizontal. Using g = 10 m/s², find (a) the time of flight, (b) the range, and (c) the maximum height.',
      steps: [
        '$V = 20$ m/s, $\\alpha = 30°$, $g = 10$ m/s².',
        '(a) Time of flight: $T = \\dfrac{2 \\times 20 \\times \\sin 30°}{10} = \\dfrac{2 \\times 20 \\times 0.5}{10} = 2$ s.',
        '(b) Range: $R = \\dfrac{20^2 \\times \\sin 60°}{10} = \\dfrac{400\\sqrt{3}/2}{10} = 20\\sqrt{3} \\approx 34.6$ m.',
        '(c) Max height: $H = \\dfrac{20^2 \\times \\sin^2 30°}{2 \\times 10} = \\dfrac{400 \\times 0.25}{20} = 5$ m.',
      ],
    },
    {
      type: 'steps',
      heading: 'How to eliminate t to get the Cartesian equation',
      items: [
        'From $x = Vt\\cos\\alpha$, express $t = \\dfrac{x}{V\\cos\\alpha}$.',
        'Substitute into $y = Vt\\sin\\alpha - \\tfrac{1}{2}gt^2$.',
        'Simplify: $y = x\\tan\\alpha - \\dfrac{gx^2}{2V^2\\cos^2\\!\\alpha}$.',
        'This is a downward parabola in $x$.',
      ],
    },
    {
      type: 'tip',
      body: 'Maximum range occurs at α = 45°. Complementary angles (e.g. 30° and 60°) give the same range. At maximum height, the vertical velocity is zero — differentiate y(t) and set equal to zero to find the time at which this occurs.',
    },
  ],

  // ── L3 S1: Inverse Trig Definitions and Graphs ──────────────────────────────
  'y12-ext1-l3-s1': [
    {
      type: 'text',
      body: 'The standard trigonometric functions are not one-to-one over their natural domains, so their inverses are only defined on restricted domains. The resulting inverse functions sin⁻¹, cos⁻¹, and tan⁻¹ (also written arcsin, arccos, arctan) are fundamental in calculus and appear in many integration formulas.',
    },
    {
      type: 'rules',
      heading: 'Domains and ranges of inverse trig functions',
      items: [
        '$y = \\sin^{-1} x$: domain $[-1,\\,1]$, range $\\left[-\\dfrac{\\pi}{2},\\,\\dfrac{\\pi}{2}\\right]$',
        '$y = \\cos^{-1} x$: domain $[-1,\\,1]$, range $[0,\\,\\pi]$',
        '$y = \\tan^{-1} x$: domain $\\mathbb{R}$, range $\\left(-\\dfrac{\\pi}{2},\\,\\dfrac{\\pi}{2}\\right)$',
      ],
    },
    {
      type: 'rules',
      heading: 'Key exact values',
      items: [
        '$\\sin^{-1}\\!\\tfrac{1}{2} = \\dfrac{\\pi}{6}$, $\\;\\sin^{-1}\\!\\tfrac{\\sqrt{2}}{2} = \\dfrac{\\pi}{4}$, $\\;\\sin^{-1}\\!\\tfrac{\\sqrt{3}}{2} = \\dfrac{\\pi}{3}$, $\\;\\sin^{-1}(0) = 0$',
        '$\\cos^{-1}\\!\\tfrac{\\sqrt{3}}{2} = \\dfrac{\\pi}{6}$, $\\;\\cos^{-1}\\!\\tfrac{\\sqrt{2}}{2} = \\dfrac{\\pi}{4}$, $\\;\\cos^{-1}\\!\\tfrac{1}{2} = \\dfrac{\\pi}{3}$, $\\;\\cos^{-1}(0) = \\dfrac{\\pi}{2}$',
        '$\\tan^{-1}(1) = \\dfrac{\\pi}{4}$, $\\;\\tan^{-1}(\\sqrt{3}) = \\dfrac{\\pi}{3}$, $\\;\\tan^{-1}\\!\\tfrac{1}{\\sqrt{3}} = \\dfrac{\\pi}{6}$, $\\;\\tan^{-1}(0) = 0$',
      ],
    },
    {
      type: 'rules',
      heading: 'Complementary angle identities',
      items: [
        '$\\sin^{-1} x + \\cos^{-1} x = \\dfrac{\\pi}{2}$ for $x \\in [-1,1]$',
        '$\\tan^{-1} x + \\tan^{-1}\\!\\dfrac{1}{x} = \\dfrac{\\pi}{2}$ for $x > 0$',
        '$\\sin^{-1}(-x) = -\\sin^{-1} x$ (odd function)',
        '$\\cos^{-1}(-x) = \\pi - \\cos^{-1} x$',
        '$\\tan^{-1}(-x) = -\\tan^{-1} x$ (odd function)',
      ],
    },
    {
      type: 'example',
      question: 'Evaluate (a) sin⁻¹(−√3/2), (b) cos⁻¹(−1/2), (c) tan⁻¹(−1).',
      steps: [
        '(a) $\\sin^{-1}(-\\tfrac{\\sqrt{3}}{2}) = -\\sin^{-1}(\\tfrac{\\sqrt{3}}{2}) = -\\dfrac{\\pi}{3}$.',
        '(b) $\\cos^{-1}(-\\tfrac{1}{2}) = \\pi - \\cos^{-1}(\\tfrac{1}{2}) = \\pi - \\dfrac{\\pi}{3} = \\dfrac{2\\pi}{3}$.',
        '(c) $\\tan^{-1}(-1) = -\\tan^{-1}(1) = -\\dfrac{\\pi}{4}$.',
      ],
    },
    {
      type: 'tip',
      body: 'The graphs of sin⁻¹, cos⁻¹, and tan⁻¹ are obtained by reflecting the restricted trig graph in the line y = x. For tan⁻¹, the horizontal asymptotes are y = ±π/2 (the range boundaries, never reached).',
    },
  ],

  // ── L4 S1: Further Differentiation Techniques ───────────────────────────────
  'y12-ext1-l4-s1': [
    {
      type: 'text',
      body: 'Year 12 Extension 1 extends the differentiation toolkit with derivatives of inverse trig functions and implicit differentiation. These arise naturally in integration and in problems where y cannot be isolated as an explicit function of x.',
    },
    {
      type: 'rules',
      heading: 'Derivatives of inverse trigonometric functions',
      items: [
        '$\\dfrac{d}{dx}\\bigl(\\sin^{-1} x\\bigr) = \\dfrac{1}{\\sqrt{1-x^2}}$',
        '$\\dfrac{d}{dx}\\bigl(\\cos^{-1} x\\bigr) = -\\dfrac{1}{\\sqrt{1-x^2}}$',
        '$\\dfrac{d}{dx}\\bigl(\\tan^{-1} x\\bigr) = \\dfrac{1}{1+x^2}$',
        'By chain rule: $\\dfrac{d}{dx}\\bigl(\\sin^{-1} f(x)\\bigr) = \\dfrac{f\'(x)}{\\sqrt{1-[f(x)]^2}}$',
      ],
    },
    {
      type: 'example',
      question: 'Differentiate (a) y = sin⁻¹(3x), (b) y = tan⁻¹(x²), (c) y = x cos⁻¹(x).',
      steps: [
        '(a) Chain rule: $\\dfrac{dy}{dx} = \\dfrac{3}{\\sqrt{1-9x^2}}$.',
        '(b) Chain rule: $\\dfrac{dy}{dx} = \\dfrac{2x}{1+x^4}$.',
        '(c) Product rule: $\\dfrac{dy}{dx} = \\cos^{-1}(x) + x \\cdot \\dfrac{-1}{\\sqrt{1-x^2}} = \\cos^{-1}(x) - \\dfrac{x}{\\sqrt{1-x^2}}$.',
      ],
    },
    {
      type: 'steps',
      heading: 'Implicit differentiation method',
      items: [
        'Differentiate both sides of the equation with respect to $x$.',
        'Whenever you differentiate a term in $y$, multiply by $\\dfrac{dy}{dx}$ (chain rule).',
        'Collect all $\\dfrac{dy}{dx}$ terms on one side.',
        'Factor out $\\dfrac{dy}{dx}$ and solve.',
      ],
    },
    {
      type: 'example',
      question: 'Find dy/dx for x² + y² = 25 (circle), and for x² + xy + y² = 7.',
      steps: [
        'Circle: differentiate implicitly: $2x + 2y\\dfrac{dy}{dx} = 0 \\Rightarrow \\dfrac{dy}{dx} = -\\dfrac{x}{y}$.',
        'Second curve: $2x + y + x\\dfrac{dy}{dx} + 2y\\dfrac{dy}{dx} = 0$.',
        'Collect: $\\dfrac{dy}{dx}(x + 2y) = -(2x + y)$.',
        '$\\dfrac{dy}{dx} = -\\dfrac{2x+y}{x+2y}$.',
      ],
    },
    {
      type: 'tip',
      body: 'Note that d/dx(cos⁻¹ x) = −d/dx(sin⁻¹ x). This means sin⁻¹ x and cos⁻¹ x have the same derivative up to sign — which is consistent with sin⁻¹ x + cos⁻¹ x = π/2 (constant).',
    },
  ],

  // ── L4 S2: Techniques of Integration ────────────────────────────────────────
  'y12-ext1-l4-s2': [
    {
      type: 'text',
      body: 'The Extension 1 course introduces standard integrals that produce inverse trig functions, integration by substitution to simplify complex integrands, and integration by parts for products of functions.',
    },
    {
      type: 'rules',
      heading: 'Standard inverse trig integrals',
      items: [
        '$\\displaystyle\\int \\dfrac{1}{\\sqrt{1-x^2}}\\,dx = \\sin^{-1} x + C$',
        '$\\displaystyle\\int \\dfrac{-1}{\\sqrt{1-x^2}}\\,dx = \\cos^{-1} x + C$',
        '$\\displaystyle\\int \\dfrac{1}{1+x^2}\\,dx = \\tan^{-1} x + C$',
        'Scaled versions: $\\displaystyle\\int \\dfrac{1}{\\sqrt{a^2-x^2}}\\,dx = \\sin^{-1}\\!\\dfrac{x}{a} + C$ and $\\displaystyle\\int \\dfrac{1}{a^2+x^2}\\,dx = \\dfrac{1}{a}\\tan^{-1}\\!\\dfrac{x}{a} + C$',
      ],
    },
    {
      type: 'steps',
      heading: 'Integration by substitution',
      items: [
        'Choose $u = g(x)$ so that $g\'(x)$ appears as a factor in the integrand.',
        'Compute $du = g\'(x)\\,dx$ and rewrite everything in terms of $u$.',
        'Integrate with respect to $u$.',
        'Substitute back to write the answer in terms of $x$.',
        'For definite integrals, change the limits: when $x = a$, $u = g(a)$; when $x = b$, $u = g(b)$.',
      ],
    },
    {
      type: 'example',
      question: 'Evaluate ∫ x(x² + 1)⁴ dx using substitution.',
      steps: [
        'Let $u = x^2 + 1$, so $du = 2x\\,dx$, i.e. $x\\,dx = \\tfrac{1}{2}du$.',
        '$\\displaystyle\\int x(x^2+1)^4\\,dx = \\int u^4 \\cdot \\tfrac{1}{2}\\,du = \\tfrac{1}{2} \\cdot \\dfrac{u^5}{5} + C = \\dfrac{(x^2+1)^5}{10} + C$.',
      ],
    },
    {
      type: 'formula',
      latex: '\\int u\\,dv = uv - \\int v\\,du',
      label: 'Integration by parts',
    },
    {
      type: 'rules',
      heading: 'LIATE rule for choosing u in integration by parts',
      items: [
        'L — Logarithmic functions (ln x, log x)',
        'I — Inverse trig functions (sin⁻¹ x, tan⁻¹ x, …)',
        'A — Algebraic functions (xⁿ, polynomials)',
        'T — Trigonometric functions (sin x, cos x)',
        'E — Exponential functions (eˣ, aˣ)',
        'Choose $u$ as the function that appears earliest in this list.',
      ],
    },
    {
      type: 'example',
      question: 'Evaluate ∫ x eˣ dx using integration by parts.',
      steps: [
        'Let $u = x$ (Algebraic), $dv = e^x\\,dx$.',
        'Then $du = dx$ and $v = e^x$.',
        '$\\displaystyle\\int x e^x\\,dx = x e^x - \\int e^x\\,dx = x e^x - e^x + C = e^x(x-1) + C$.',
      ],
    },
    {
      type: 'tip',
      body: 'For ∫ ln x dx, use parts with u = ln x, dv = dx. This gives x ln x − x + C. Similarly, ∫ sin⁻¹ x dx = x sin⁻¹ x + √(1−x²) + C.',
    },
  ],

  // ── L4 S3: Further Applications of Calculus ─────────────────────────────────
  'y12-ext1-l4-s3': [
    {
      type: 'text',
      body: 'This stage brings together integration techniques and extends their applications to volumes of revolution, related rates of change, and separable differential equations — powerful tools for modelling real-world phenomena.',
    },
    {
      type: 'formula',
      latex: 'V = \\pi \\int_a^b [f(x)]^2\\,dx',
      label: 'Volume of solid of revolution about the x-axis',
    },
    {
      type: 'steps',
      heading: 'Volume of revolution about the x-axis',
      items: [
        'Identify the curve $y = f(x)$ and the limits $a \\le x \\le b$.',
        'Rotate the region bounded by the curve and the $x$-axis about the $x$-axis.',
        'Each cross-section is a circle of radius $y = f(x)$, so area $= \\pi y^2$.',
        'Integrate: $V = \\pi \\displaystyle\\int_a^b [f(x)]^2\\,dx$.',
      ],
    },
    {
      type: 'example',
      question: 'Find the volume generated when y = √x, 0 ≤ x ≤ 4, is rotated about the x-axis.',
      steps: [
        '$V = \\pi \\displaystyle\\int_0^4 (\\sqrt{x})^2\\,dx = \\pi \\int_0^4 x\\,dx$.',
        '$= \\pi \\left[\\dfrac{x^2}{2}\\right]_0^4 = \\pi \\cdot \\dfrac{16}{2} = 8\\pi$ cubic units.',
      ],
    },
    {
      type: 'steps',
      heading: 'Solving separable differential equations',
      items: [
        'Write the equation as $\\dfrac{dy}{dx} = f(x)g(y)$.',
        'Separate: $\\dfrac{1}{g(y)}\\,dy = f(x)\\,dx$.',
        'Integrate both sides: $\\displaystyle\\int \\dfrac{1}{g(y)}\\,dy = \\int f(x)\\,dx$.',
        'Solve for $y$ (include the constant of integration $C$).',
        'Apply initial conditions to find $C$ if given.',
      ],
    },
    {
      type: 'example',
      question: 'Solve dy/dx = 2xy given y = 3 when x = 0.',
      steps: [
        'Separate: $\\dfrac{1}{y}\\,dy = 2x\\,dx$.',
        'Integrate: $\\ln|y| = x^2 + C$.',
        'Exponentiate: $y = A e^{x^2}$ where $A = e^C$.',
        'Initial condition $y(0) = 3$: $3 = A e^0 = A$, so $A = 3$.',
        'Solution: $y = 3e^{x^2}$.',
      ],
    },
    {
      type: 'tip',
      body: 'For related rates, draw a diagram, identify all changing quantities, write an equation connecting them, then differentiate both sides with respect to time t using the chain rule.',
    },
  ],

  // ── L5 S1: Binomial Distributions ───────────────────────────────────────────
  'y12-ext1-l5-s1': [
    {
      type: 'text',
      body: 'The binomial distribution models the number of successes in a fixed number of independent trials where each trial has the same probability of success. It is built on Bernoulli trials — experiments with exactly two outcomes: success (probability p) and failure (probability 1 − p).',
    },
    {
      type: 'formula',
      latex: 'X \\sim \\mathrm{Bin}(n,\\,p) \\implies P(X = k) = \\binom{n}{k}p^k(1-p)^{n-k}',
      label: 'Binomial probability formula',
    },
    {
      type: 'rules',
      heading: 'Properties of X ~ Bin(n, p)',
      items: [
        '$E(X) = np$ (expected number of successes)',
        '$\\mathrm{Var}(X) = np(1-p)$',
        '$\\mathrm{SD}(X) = \\sqrt{np(1-p)}$',
        'The sample proportion $\\hat{p} = X/n$ has $E(\\hat{p}) = p$ and $\\mathrm{Var}(\\hat{p}) = \\dfrac{p(1-p)}{n}$',
        'For large $n$, $\\hat{p}$ is approximately normally distributed (central limit theorem)',
      ],
    },
    {
      type: 'example',
      question: 'A biased coin has P(head) = 0.3. It is tossed 10 times. Find (a) P(X = 4), (b) P(X ≤ 2), (c) E(X) and SD(X).',
      steps: [
        '$X \\sim \\mathrm{Bin}(10,\\, 0.3)$.',
        '(a) $P(X=4) = \\dbinom{10}{4}(0.3)^4(0.7)^6 = 210 \\times 0.0081 \\times 0.117649 \\approx 0.2001$.',
        '(b) $P(X \\le 2) = P(X=0)+P(X=1)+P(X=2)$.',
        '$P(X=0) = (0.7)^{10} \\approx 0.0282$.',
        '$P(X=1) = 10(0.3)(0.7)^9 \\approx 0.1211$.',
        '$P(X=2) = 45(0.09)(0.7)^8 \\approx 0.2335$.',
        '$P(X \\le 2) \\approx 0.3828$.',
        '(c) $E(X) = 10 \\times 0.3 = 3$. $\\mathrm{SD}(X) = \\sqrt{10 \\times 0.3 \\times 0.7} = \\sqrt{2.1} \\approx 1.449$.',
      ],
    },
    {
      type: 'rules',
      heading: 'Checking if a binomial model is appropriate',
      items: [
        'Fixed number of trials $n$.',
        'Each trial is independent.',
        'Only two outcomes per trial (success/failure).',
        'Probability of success $p$ is constant for every trial.',
      ],
    },
    {
      type: 'tip',
      body: 'P(X ≥ k) = 1 − P(X ≤ k − 1). For P(X > k) use 1 − P(X ≤ k). Use your calculator\'s binomcdf function for cumulative probabilities rather than summing individual terms.',
    },
  ],

  // ════════════════════════════════════════════════════════════════════════════
  // YEAR 12 STANDARD
  // ════════════════════════════════════════════════════════════════════════════

  // ── L1 S1: Algebraic Relationships ──────────────────────────────────────────
  'y12-std-l1-s1': [
    {
      type: 'text',
      body: 'Year 12 Standard Mathematics builds on algebraic skills by connecting equations to the shape of their graphs. Recognising the type of relationship from its equation (or its graph) lets you choose the right model for a practical situation and extract meaning from it.',
    },
    {
      type: 'rules',
      heading: 'Key algebraic relationships and their graphs',
      items: [
        'Linear $y = mx + b$: straight line, gradient $m$, $y$-intercept $b$',
        'Quadratic $y = ax^2 + bx + c$: parabola, turning point (vertex), axis of symmetry at $x = -b/(2a)$',
        'Exponential $y = ab^x$ (with $b > 0, b \\ne 1$): always positive, asymptote at $y = 0$',
        'Reciprocal $y = k/x$: hyperbola, asymptotes at $x = 0$ and $y = 0$',
      ],
    },
    {
      type: 'steps',
      heading: 'Sketching a quadratic y = ax² + bx + c',
      items: [
        'Find the $y$-intercept: set $x = 0$, giving $y = c$.',
        'Find the $x$-intercepts (if any): solve $ax^2 + bx + c = 0$ using the quadratic formula.',
        'Find the vertex: $x = -b/(2a)$; substitute to get $y$.',
        'Determine orientation: opens up if $a > 0$, down if $a < 0$.',
        'Sketch smoothly through all key points.',
      ],
    },
    {
      type: 'example',
      question: 'Sketch y = −x² + 4x − 3 and identify its key features.',
      steps: [
        '$y$-intercept: $(0,\\,-3)$.',
        '$x$-intercepts: $-x^2+4x-3=0 \\Rightarrow x^2-4x+3=0 \\Rightarrow (x-1)(x-3)=0$; so $(1,0)$ and $(3,0)$.',
        'Vertex: $x = -4/(2 \\times -1) = 2$; $y = -4+8-3 = 1$. Vertex $(2,1)$.',
        '$a = -1 < 0$: opens downward.',
        'Maximum value $= 1$ at $x = 2$; parabola passes through $(0,-3)$, $(1,0)$, $(3,0)$.',
      ],
    },
    {
      type: 'example',
      question: 'A population model is P = 500 × 1.08^t. State the initial population and the annual growth rate.',
      steps: [
        'At $t = 0$: $P = 500 \\times 1.08^0 = 500$. Initial population is 500.',
        'Base $b = 1.08 = 1 + 0.08$, so the growth rate is $8\\%$ per year.',
        'The population multiplies by $1.08$ each year — exponential growth.',
      ],
    },
    {
      type: 'tip',
      body: 'For a reciprocal y = k/x: when k > 0 the curve is in the 1st and 3rd quadrants; when k < 0 it is in the 2nd and 4th quadrants. Both axes are asymptotes — the curve never touches them.',
    },
  ],

  // ── L2 S1: Investment and Loans ──────────────────────────────────────────────
  'y12-std-l2-s1': [
    {
      type: 'text',
      body: 'Compound interest grows an investment or debt exponentially. For loans, each repayment reduces the outstanding balance by first paying off the interest charged in that period, then reducing the principal. Understanding how this works lets you calculate total interest paid and choose the best financial product.',
    },
    {
      type: 'formula',
      latex: 'A = P\\bigl(1 + r\\bigr)^n',
      label: 'Compound interest: A = final amount, P = principal, r = rate per period, n = number of periods',
    },
    {
      type: 'rules',
      heading: 'Reducing balance loan recurrence relation',
      items: [
        '$A_0 = P$ (initial loan)',
        '$A_n = A_{n-1}(1+r) - M$ where $M$ is the repayment per period',
        'Each period: new balance = old balance × (1 + interest rate) − repayment',
        'Loan is repaid when $A_n = 0$',
      ],
    },
    {
      type: 'example',
      question: 'Ali invests $5 000 at 4% p.a. compounded quarterly for 3 years. How much does she have at the end?',
      steps: [
        'Rate per quarter: $r = 0.04/4 = 0.01$.',
        'Number of periods: $n = 3 \\times 4 = 12$.',
        '$A = 5000(1.01)^{12} = 5000 \\times 1.126825\\ldots \\approx \\$5634.13$.',
      ],
    },
    {
      type: 'example',
      question: 'A loan of $10 000 is charged 6% p.a. (monthly). Monthly repayment is $300. What is the outstanding balance after 2 months?',
      steps: [
        'Monthly rate $r = 0.06/12 = 0.005$.',
        'After month 1: $A_1 = 10000 \\times 1.005 - 300 = 10050 - 300 = \\$9750$.',
        'After month 2: $A_2 = 9750 \\times 1.005 - 300 = 9798.75 - 300 = \\$9498.75$.',
      ],
    },
    {
      type: 'tip',
      body: 'When comparing investments, convert all interest rates to an effective annual rate first. Compounding more frequently always yields a higher effective rate than the stated nominal rate.',
    },
  ],

  // ── L2 S2: Annuities ──────────────────────────────────────────────────────────
  'y12-std-l2-s2': [
    {
      type: 'text',
      body: 'An annuity is a series of equal payments made at regular intervals. Future value (FV) tells you how much a series of deposits will accumulate to (e.g. a savings plan). Present value (PV) tells you the current worth of a series of future payments (e.g. a loan).',
    },
    {
      type: 'formula',
      latex: 'FV = M\\,\\frac{(1+r)^n - 1}{r}',
      label: 'Future value of an annuity (M = payment per period, r = rate, n = periods)',
    },
    {
      type: 'formula',
      latex: 'PV = M\\,\\frac{1-(1+r)^{-n}}{r}',
      label: 'Present value of an annuity',
    },
    {
      type: 'example',
      question: 'Jasmine deposits $200 per month into a savings account earning 3% p.a. compounded monthly for 2 years. Find the future value.',
      steps: [
        '$M = 200$, $r = 0.03/12 = 0.0025$, $n = 24$.',
        '$FV = 200 \\times \\dfrac{(1.0025)^{24}-1}{0.0025}$.',
        '$(1.0025)^{24} \\approx 1.06178$.',
        '$FV = 200 \\times \\dfrac{0.06178}{0.0025} = 200 \\times 24.711 \\approx \\$4942.20$.',
      ],
    },
    {
      type: 'example',
      question: 'A car loan has monthly repayments of $450 for 5 years at 6% p.a. compounded monthly. What was the original loan (PV)?',
      steps: [
        '$M = 450$, $r = 0.005$, $n = 60$.',
        '$PV = 450 \\times \\dfrac{1-(1.005)^{-60}}{0.005}$.',
        '$(1.005)^{-60} \\approx 0.7414$.',
        '$PV = 450 \\times \\dfrac{0.2586}{0.005} = 450 \\times 51.726 \\approx \\$23\\,276.50$.',
      ],
    },
    {
      type: 'tip',
      body: 'Total amount paid = M × n. Total interest = Total paid − PV (for a loan) or Total paid − total deposits (for savings, where total interest = FV − M × n).',
    },
  ],

  // ── L3 S1: Non-Right-Angled Trigonometry ─────────────────────────────────────
  'y12-std-l3-s1': [
    {
      type: 'text',
      body: 'When a triangle has no right angle, you cannot use SOHCAHTOA directly. Instead, the sine rule and cosine rule extend trigonometry to any triangle. These rules are essential for surveying, navigation, and geometry problems involving bearings.',
    },
    {
      type: 'formula',
      latex: '\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}',
      label: 'Sine rule (use with AAS, ASA, or SSA)',
    },
    {
      type: 'formula',
      latex: 'c^2 = a^2 + b^2 - 2ab\\cos C',
      label: 'Cosine rule (use with SAS or SSS)',
    },
    {
      type: 'formula',
      latex: 'A = \\tfrac{1}{2}ab\\sin C',
      label: 'Area of a triangle',
    },
    {
      type: 'rules',
      heading: 'Choosing the right rule',
      items: [
        'AAS or ASA (two angles + one side) → Sine rule to find missing side',
        'SSA (two sides + non-included angle) → Sine rule; beware ambiguous case (two solutions possible)',
        'SAS (two sides + included angle) → Cosine rule to find missing side',
        'SSS (three sides) → Cosine rule rearranged to find an angle: $\\cos C = \\dfrac{a^2+b^2-c^2}{2ab}$',
      ],
    },
    {
      type: 'example',
      question: 'In triangle ABC, a = 8 m, b = 11 m, C = 40°. Find side c and the area.',
      steps: [
        'Use cosine rule: $c^2 = 8^2 + 11^2 - 2(8)(11)\\cos 40°$.',
        '$c^2 = 64 + 121 - 176 \\times 0.7660 = 185 - 134.82 = 50.18$.',
        '$c = \\sqrt{50.18} \\approx 7.08$ m.',
        'Area $= \\tfrac{1}{2} \\times 8 \\times 11 \\times \\sin 40° = 44 \\times 0.6428 \\approx 28.3$ m².',
      ],
    },
    {
      type: 'tip',
      body: 'The ambiguous case (SSA): when using the sine rule to find an angle, sinθ = k may give two solutions (θ and 180° − θ). Check whether both are geometrically possible by ensuring all three angles sum to 180° and are positive.',
    },
  ],

  // ── L3 S2: Rates and Ratios ───────────────────────────────────────────────────
  'y12-std-l3-s2': [
    {
      type: 'text',
      body: 'Rates compare two quantities measured in different units. Ratios compare two quantities in the same units. Both appear throughout everyday contexts — speed, fuel economy, scale drawings, ingredient proportions, and mixing concentrations.',
    },
    {
      type: 'rules',
      heading: 'Key rate and ratio skills',
      items: [
        'Rate: express as a fraction with units (e.g. 60 km/h, $3.50/L)',
        'Convert: multiply or divide by conversion factors to change units',
        'Scale: actual = scale factor × map measurement; scale ratio $1 : n$ means 1 cm represents $n$ cm',
        'Divide in ratio $a : b$: total parts $= a + b$; each share $= \\dfrac{a}{a+b} \\times \\text{total}$',
        'Proportion: if $y \\propto x$ then $y = kx$; find $k$ from a given pair',
      ],
    },
    {
      type: 'example',
      question: 'A car uses 8.5 L per 100 km. How many litres are needed for a 350 km trip? What is the cost at $2.10/L?',
      steps: [
        'Fuel $= \\dfrac{8.5}{100} \\times 350 = 29.75$ L.',
        'Cost $= 29.75 \\times 2.10 = \\$62.475 \\approx \\$62.48$.',
      ],
    },
    {
      type: 'example',
      question: 'A scale drawing uses a scale of 1 : 200. A room measures 3.5 cm on the plan. Find the actual length in metres.',
      steps: [
        'Actual length $= 3.5 \\times 200 = 700$ cm $= 7$ m.',
      ],
    },
    {
      type: 'example',
      question: 'Divide $2 400 between Alex and Ben in the ratio 3 : 5.',
      steps: [
        'Total parts $= 3 + 5 = 8$.',
        'Alex: $\\dfrac{3}{8} \\times 2400 = \\$900$.',
        'Ben: $\\dfrac{5}{8} \\times 2400 = \\$1500$.',
      ],
    },
    {
      type: 'tip',
      body: 'When converting between units, write the conversion factor as a fraction so unwanted units cancel. For example, to convert 90 km/h to m/s: 90 km/h × (1000 m/km) ÷ (3600 s/h) = 25 m/s.',
    },
  ],

  // ── L4 S1: Network Flow ───────────────────────────────────────────────────────
  'y12-std-l4-s1': [
    {
      type: 'text',
      body: 'A flow network models systems where a quantity (water, traffic, data) moves from a source to a sink through a network of directed edges. Each edge has a capacity limit. The maximum-flow min-cut theorem provides a systematic way to find the greatest possible flow.',
    },
    {
      type: 'rules',
      heading: 'Key network flow terms',
      items: [
        'Source: node where flow originates (no in-flow from outside)',
        'Sink: node where flow terminates (no out-flow)',
        'Capacity: maximum flow each edge can carry',
        'Flow conservation: at every internal node, total in-flow = total out-flow',
        'Cut: a set of edges whose removal disconnects source from sink',
        'Capacity of a cut: sum of capacities of cut edges going from source side to sink side',
        'Maximum flow = minimum cut capacity (max-flow min-cut theorem)',
      ],
    },
    {
      type: 'steps',
      heading: 'Finding maximum flow using minimum cut',
      items: [
        'Identify all cuts that separate the source from the sink.',
        'For each cut, add the capacities of forward-directed edges only (source → sink direction).',
        'The minimum cut capacity equals the maximum flow through the network.',
        'Verify by assigning flows to edges so each is at most its capacity and flow is conserved at each node.',
      ],
    },
    {
      type: 'example',
      question: 'A simple network has source S connected to nodes A (capacity 5) and B (capacity 3). A connects to sink T (capacity 4). B connects to T (capacity 6). Find the maximum flow.',
      steps: [
        'Possible cuts: Cut 1 = {SA, SB}, capacity = 5 + 3 = 8.',
        'Cut 2 = {AT, BT}, capacity = 4 + 6 = 10.',
        'Cut 3 = {SA, BT}, capacity = 5 + 6 = 11.',
        'Cut 4 = {AT, SB}, capacity = 4 + 3 = 7.',
        'Minimum cut = Cut 4, capacity = 7.',
        'Maximum flow = 7 units.',
        'Assign: 5 through S→A→T (limited to 4 by AT), so flow on SA = 4; 3 through S→B→T. Total = 4 + 3 = 7. ✓',
      ],
    },
    {
      type: 'tip',
      body: 'Only count edges pointing FROM the source side TO the sink side in a cut — do not count reverse-direction edges. A common error is including edges that go in the wrong direction.',
    },
  ],

  // ── L4 S2: Critical Path Analysis ────────────────────────────────────────────
  'y12-std-l4-s2': [
    {
      type: 'text',
      body: 'Critical path analysis (CPA) is a project management technique that identifies the sequence of dependent activities that determines the minimum project duration. Activities on the critical path have no slack — any delay in them delays the entire project.',
    },
    {
      type: 'rules',
      heading: 'Key CPA terms',
      items: [
        'Activity: a task with a duration and prerequisites',
        'EST (Earliest Start Time): the earliest an activity can begin',
        'LST (Latest Start Time): the latest an activity can begin without delaying the project',
        'Float (slack): $\\text{Float} = \\text{LST} - \\text{EST}$ — the time an activity can be delayed without affecting the project',
        'Critical path: path from start to finish where every activity has zero float',
        'Critical path length = minimum project duration',
      ],
    },
    {
      type: 'steps',
      heading: 'Forward and backward pass',
      items: [
        'Forward pass (left to right): compute EST for each activity.',
        'EST of the first activity = 0.',
        'EST of an activity = maximum of (EST + duration) for all immediate predecessors.',
        'Project duration = maximum EST + duration for all final activities.',
        'Backward pass (right to left): compute LST for each activity.',
        'LST of final activity = its EST (no slack at the end).',
        'LST of an activity = minimum of (LST of successors − duration of this activity).',
        'Float = LST − EST. Activities with float = 0 are on the critical path.',
      ],
    },
    {
      type: 'example',
      question: 'Three activities: A (3 days, no prerequisite), B (2 days, no prerequisite), C (4 days, requires A and B). Find ESTs, LSTs, floats, and the critical path.',
      steps: [
        'Forward pass: EST(A) = 0, EST(B) = 0.',
        'EST(C) = max(0+3, 0+2) = max(3, 2) = 3. Project duration = 3+4 = 7 days.',
        'Backward pass: LST(C) = 7−4 = 3.',
        'LST(A) = 3−3 = 0. LST(B) = 3−2 = 1.',
        'Float(A) = 0−0 = 0. Float(B) = 1−0 = 1. Float(C) = 3−3 = 0.',
        'Critical path: A → C (float = 0 throughout). Duration = 7 days.',
        'Activity B has 1 day of float — it can be delayed by 1 day without affecting the project.',
      ],
    },
    {
      type: 'tip',
      body: 'There can be more than one critical path. If two paths through the network both have zero float everywhere, both are critical — a delay on either delays the project.',
    },
  ],

  // ── L5 S1: Bivariate Data Analysis ───────────────────────────────────────────
  'y12-std-l5-s1': [
    {
      type: 'text',
      body: 'Bivariate data involves two numerical variables measured on the same individual. Scatterplots reveal the direction, form, and strength of any association. Pearson\'s correlation coefficient r quantifies linear association, and the least-squares line allows prediction.',
    },
    {
      type: 'rules',
      heading: 'Interpreting Pearson\'s r',
      items: [
        '$r \\in [-1, 1]$',
        '$r$ close to $+1$: strong positive linear association',
        '$r$ close to $-1$: strong negative linear association',
        '$r$ close to $0$: little or no linear association',
        'Guidelines: $|r| < 0.3$ weak; $0.3 \\le |r| < 0.7$ moderate; $|r| \\ge 0.7$ strong',
      ],
    },
    {
      type: 'formula',
      latex: '\\hat{y} = a + bx, \\quad b = r\\,\\frac{s_y}{s_x}, \\quad a = \\bar{y} - b\\bar{x}',
      label: 'Least-squares regression line (passes through the mean point)',
    },
    {
      type: 'steps',
      heading: 'Using and interpreting the regression line',
      items: [
        'Identify the response variable (y) and the explanatory variable (x).',
        'Use technology to find $r$ and the equation $\\hat{y} = a + bx$.',
        'Interpret $b$: for each unit increase in $x$, $y$ is predicted to change by $b$ units.',
        'Interpolate: predict $y$ for $x$ values within the data range.',
        'Extrapolate carefully — predictions outside the data range are unreliable.',
        'Remember: correlation does not imply causation.',
      ],
    },
    {
      type: 'example',
      question: 'A study finds r = 0.85 between study hours (x) and test score (y). The regression line is ŷ = 35 + 5x. Interpret the gradient and predict the score for 6 hours.',
      steps: [
        'Gradient $b = 5$: each additional hour of study is associated with a 5-point increase in score.',
        'At $x = 6$: $\\hat{y} = 35 + 5(6) = 35 + 30 = 65$.',
        '$r = 0.85$ indicates a strong positive linear association.',
        'Correlation does not mean studying more causes higher scores — both could be influenced by other factors.',
      ],
    },
    {
      type: 'tip',
      body: 'The least-squares line always passes through the point (x̄, ȳ). If you need to check your line equation, substituting the means should satisfy it exactly.',
    },
  ],

  // ── L5 S2: Relative Frequency and Probability ─────────────────────────────────
  'y12-std-l5-s2': [
    {
      type: 'text',
      body: 'Probability measures how likely an event is, on a scale from 0 (impossible) to 1 (certain). When outcomes are equally likely, probability = favourable/total. When outcomes are not equally likely, use relative frequencies from experiments, tables, or tree diagrams.',
    },
    {
      type: 'rules',
      heading: 'Core probability rules',
      items: [
        '$0 \\le P(A) \\le 1$ for any event $A$',
        '$P(A^\\prime) = 1 - P(A)$ (complementary events)',
        '$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$ (addition rule)',
        'If $A$ and $B$ are mutually exclusive: $P(A \\cup B) = P(A) + P(B)$',
        'If $A$ and $B$ are independent: $P(A \\cap B) = P(A) \\times P(B)$',
        'Conditional probability: $P(A | B) = \\dfrac{P(A \\cap B)}{P(B)}$',
      ],
    },
    {
      type: 'example',
      question: 'A bag contains 4 red, 3 blue, and 3 green marbles. One marble is drawn at random. Find P(red), P(not green), P(red or blue).',
      steps: [
        'Total $= 10$ marbles.',
        '$P(\\text{red}) = 4/10 = 2/5$.',
        '$P(\\text{not green}) = 1 - P(\\text{green}) = 1 - 3/10 = 7/10$.',
        '$P(\\text{red or blue}) = 4/10 + 3/10 = 7/10$ (mutually exclusive).',
      ],
    },
    {
      type: 'steps',
      heading: 'Using a two-way table',
      items: [
        'Label rows and columns with the two events and their complements.',
        'Fill in the given frequencies (or probabilities).',
        'Use row and column totals to find unknowns.',
        'Read off required probabilities directly from the table.',
      ],
    },
    {
      type: 'example',
      question: 'In a class of 30, 18 play sport. Of those who play sport, 12 also study music. Of those who don\'t play sport, 4 study music. Find P(sport and music) and P(sport | music).',
      steps: [
        '$P(\\text{sport and music}) = 12/30 = 2/5$.',
        'Total music: $12 + 4 = 16$.',
        '$P(\\text{sport} \\mid \\text{music}) = \\dfrac{12}{16} = \\dfrac{3}{4}$.',
      ],
    },
    {
      type: 'tip',
      body: 'Expected frequency = n × P(event). For example, if P(rain) = 0.3, in 200 days you expect 200 × 0.3 = 60 rainy days. This links probability theory to observed relative frequencies.',
    },
  ],

  // ── L5 S3: The Normal Distribution ───────────────────────────────────────────
  'y12-std-l5-s3': [
    {
      type: 'text',
      body: 'The normal distribution is a symmetric, bell-shaped distribution that models many real-world variables: heights, test scores, measurement errors. It is completely described by its mean μ (centre) and standard deviation σ (spread). The z-score allows comparison across different normal distributions.',
    },
    {
      type: 'formula',
      latex: 'z = \\frac{x - \\mu}{\\sigma}',
      label: 'Standardisation (z-score): measures how many standard deviations x is from the mean',
    },
    {
      type: 'rules',
      heading: 'Empirical (68–95–99.7) rule',
      items: [
        'Approximately $68\\%$ of data falls within $1\\sigma$ of the mean ($\\mu \\pm \\sigma$)',
        'Approximately $95\\%$ of data falls within $2\\sigma$ of the mean ($\\mu \\pm 2\\sigma$)',
        'Approximately $99.7\\%$ of data falls within $3\\sigma$ of the mean ($\\mu \\pm 3\\sigma$)',
        'The distribution is symmetric: $50\\%$ lies above the mean and $50\\%$ below',
      ],
    },
    {
      type: 'example',
      question: 'The heights of adult males are normally distributed with μ = 175 cm, σ = 8 cm. Find (a) P(height < 175), (b) P(167 < height < 183), (c) the z-score for a height of 191 cm.',
      steps: [
        '(a) $\\mu = 175$ is the mean; $P(X < 175) = 0.5$ (symmetry).',
        '(b) $167 = 175 - 8 = \\mu - \\sigma$ and $183 = 175 + 8 = \\mu + \\sigma$.',
        'By the empirical rule, $P(167 < X < 183) \\approx 68\\%$.',
        '(c) $z = (191-175)/8 = 16/8 = 2$. A height of 191 cm is 2 standard deviations above the mean.',
      ],
    },
    {
      type: 'steps',
      heading: 'Using z-scores to find probabilities',
      items: [
        'Standardise: compute $z = (x - \\mu)/\\sigma$.',
        'Use the normal distribution table (or calculator) to find the probability to the left of $z$.',
        'For $P(X > x)$: use $1 - P(X < x)$.',
        'For $P(a < X < b)$: compute $P(X < b) - P(X < a)$.',
        'To find $x$ given a probability: look up $z$ in the table, then $x = \\mu + z\\sigma$.',
      ],
    },
    {
      type: 'tip',
      body: 'A z-score of 0 corresponds to the mean. Positive z means above the mean; negative z means below. Because the distribution is symmetric, P(Z < −z) = P(Z > z) = 1 − P(Z < z).',
    },
  ],
}
