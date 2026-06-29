import type { ExplanationBlock } from './curriculum'

export const STAGE_CONTENT_Y12_ADV: Record<string, ExplanationBlock[]> = {

  // ── L1 S1: Further Graph Transformations and Modelling ─────────────────────
  'y12-adv-l1-s1': [
    {
      type: 'text',
      body: 'A function can be transformed by stretching, reflecting, shifting horizontally, and shifting vertically. When all four are combined, the general form is y = af(b(x − h)) + k. The order in which you apply these transformations matters: horizontal effects (b and h) act on the input before vertical effects (a and k) act on the output.',
    },
    {
      type: 'formula',
      latex: 'y = a\\,f\\bigl(b(x - h)\\bigr) + k',
      label: 'General combined transformation',
    },
    {
      type: 'rules',
      heading: 'Effect of each parameter',
      items: [
        '$a$: vertical dilation by factor $|a|$; if $a < 0$, reflect in the $x$-axis',
        '$b$: horizontal dilation by factor $\\tfrac{1}{|b|}$; if $b < 0$, reflect in the $y$-axis',
        '$h$: horizontal translation — shift right by $h$ (left if $h < 0$)',
        '$k$: vertical translation — shift up by $k$ (down if $k < 0$)',
      ],
    },
    {
      type: 'steps',
      heading: 'How to sketch y = af(b(x − h)) + k from the base graph',
      items: [
        'Start with the base graph of $y = f(x)$ and identify key points.',
        'Apply horizontal dilation: replace every $x$-coordinate with $x/|b|$.',
        'Apply horizontal reflection if $b < 0$: negate each $x$-coordinate.',
        'Apply horizontal translation: add $h$ to every $x$-coordinate.',
        'Apply vertical dilation: multiply every $y$-coordinate by $|a|$.',
        'Apply vertical reflection if $a < 0$: negate each $y$-coordinate.',
        'Apply vertical translation: add $k$ to every $y$-coordinate.',
        'Draw the transformed graph through the new key points.',
      ],
    },
    {
      type: 'example',
      question: 'Sketch y = −2f(3(x − 1)) + 4 given that f(x) = x².',
      steps: [
        'Base function: $f(x) = x^2$, key point $(0, 0)$.',
        'Horizontal dilation by $\\tfrac{1}{3}$: key point stays at $x = 0$ (no change for the vertex).',
        'Horizontal translation right 1: vertex moves to $(1, 0)$.',
        'Vertical dilation by 2: vertex $y$-value $0 \\times 2 = 0$.',
        'Vertical reflection ($a = -2 < 0$): parabola opens downward.',
        'Vertical translation up 4: vertex moves to $(1, 4)$.',
        'Final graph: downward parabola with vertex $(1, 4)$, steeper than $y = x^2$.',
      ],
    },
    {
      type: 'tip',
      body: 'A common mistake is applying shifts before dilations. Always dilate (stretch/reflect) before translating (shifting). The formula b(x − h) means: shift h first when reading the transformation from the graph, but when transforming points, dilate x first, then shift.',
    },
    {
      type: 'tip',
      body: 'To read h directly from y = f(bx − c), rewrite as y = f(b(x − c/b)) so h = c/b. Do not confuse the c in bx − c with the horizontal shift.',
    },
  ],

  // ── L1 S2: Transformations of Trig Functions ───────────────────────────────
  'y12-adv-l1-s2': [
    {
      type: 'text',
      body: 'Trigonometric functions can be stretched and shifted just like any other function. The standard form y = A sin(bx + c) + d encodes four key features: amplitude, period, phase shift, and vertical shift. Reading these from an equation lets you sketch the graph without plotting individual points.',
    },
    {
      type: 'formula',
      latex: 'y = A\\sin(bx + c) + d',
      label: 'General sinusoidal form',
    },
    {
      type: 'rules',
      heading: 'Key features from parameters',
      items: [
        'Amplitude $= |A|$ (half the distance from minimum to maximum)',
        'Period $= \\dfrac{2\\pi}{|b|}$ (or $\\dfrac{360°}{|b|}$ in degrees)',
        'Phase shift $= -\\dfrac{c}{b}$ (positive = shift right)',
        'Vertical (midline) shift $= d$',
        'Maximum value $= d + |A|$,  minimum $= d - |A|$',
      ],
    },
    {
      type: 'steps',
      heading: 'Sketching y = A sin(bx + c) + d',
      items: [
        'Identify $A$, $b$, $c$, $d$ from the equation.',
        'State amplitude $|A|$, period $2\\pi/b$, phase shift $-c/b$, midline $y = d$.',
        'Draw the midline $y = d$ as a dashed horizontal line.',
        'Mark one full period starting at the phase shift $x = -c/b$.',
        'Divide the period into four equal quarters; place key points (max, zero-cross, min, zero-cross, max).',
        'Scale $y$-values by $|A|$ around the midline; reflect if $A < 0$.',
        'Extend the pattern left and right as needed.',
      ],
    },
    {
      type: 'example',
      question: 'For y = 3 sin(2x − π/3) + 1, state the amplitude, period, phase shift, and vertical shift.',
      steps: [
        'Rewrite: $y = 3\\sin\\!\\left(2\\left(x - \\dfrac{\\pi}{6}\\right)\\right) + 1$.',
        'Amplitude $= |3| = 3$.',
        'Period $= \\dfrac{2\\pi}{2} = \\pi$.',
        'Phase shift $= +\\dfrac{\\pi}{6}$ (right).',
        'Vertical shift $= +1$ (midline at $y = 1$).',
        'Maximum value $= 1 + 3 = 4$; minimum $= 1 - 3 = -2$.',
      ],
    },
    {
      type: 'example',
      question: 'Find an equation of the form y = A cos(bx) + d given: amplitude 2, period π, midline y = −1.',
      steps: [
        'Amplitude: $A = 2$.',
        'Period $= \\pi \\Rightarrow b = 2\\pi/\\pi = 2$.',
        'Vertical shift: $d = -1$.',
        'Equation: $y = 2\\cos(2x) - 1$.',
      ],
    },
    {
      type: 'tip',
      body: 'When determining the phase shift, always factor b out first. For y = sin(2x − π/3), the phase shift is NOT −π/3; it is −(π/3)/2 = −π/6. Factoring first prevents this error.',
    },
  ],

  // ── L1 S3: Modelling with Functions ────────────────────────────────────────
  'y12-adv-l1-s3': [
    {
      type: 'text',
      body: 'Mathematical modelling uses known function families to represent real-world situations. Choosing the right model depends on the behaviour of the data: is it growing at a constant rate, accelerating, doubling repeatedly, or oscillating? Once you have a model, every parameter carries a real-world meaning that must be stated in context.',
    },
    {
      type: 'rules',
      heading: 'Choosing a model type',
      items: [
        'Linear $y = mx + c$: constant rate of change (speed, cost per unit)',
        'Quadratic $y = ax^2 + bx + c$: acceleration, projectile height, area',
        'Exponential $y = Ae^{kt}$ or $y = Ab^t$: population growth/decay, compound interest',
        'Logarithmic $y = a\\ln(x) + b$: diminishing returns, pH/decibel scales',
        'Trigonometric $y = A\\sin(bt + c) + d$: tides, temperature cycles, sound waves',
      ],
    },
    {
      type: 'steps',
      heading: 'Modelling process',
      items: [
        'Identify the key behaviour (constant growth, rapid increase, periodic, etc.).',
        'Choose an appropriate function family.',
        'Substitute known data points to find the parameters.',
        'Verify the model against any remaining data.',
        'Interpret each parameter in the real-world context.',
        'State the domain restriction (e.g. $t \\geq 0$, $0 \\leq x \\leq 24$).',
      ],
    },
    {
      type: 'example',
      question: 'A population of bacteria starts at 500 and doubles every 3 hours. Write an exponential model and find the population after 10 hours.',
      steps: [
        'Model: $P = P_0 \\cdot 2^{t/3}$ where $t$ is time in hours.',
        'Initial value: $P_0 = 500$, so $P = 500 \\cdot 2^{t/3}$.',
        'After 10 hours: $P = 500 \\cdot 2^{10/3} = 500 \\cdot 2^{3.\\overline{3}}$.',
        '$2^{10/3} \\approx 10.08$, so $P \\approx 500 \\times 10.08 \\approx 5040$ bacteria.',
      ],
    },
    {
      type: 'example',
      question: 'The daily temperature (°C) in a city follows T = 12 sin(π/12 (t − 8)) + 18, where t is hours after midnight. Find the maximum temperature and when it occurs.',
      steps: [
        'Amplitude $= 12$, so maximum $= 18 + 12 = 30°$C.',
        'Maximum occurs when $\\sin = 1$, i.e. $\\pi/12(t - 8) = \\pi/2$.',
        '$t - 8 = 6 \\Rightarrow t = 14$ hours after midnight $= 2$:00 pm.',
      ],
    },
    {
      type: 'tip',
      body: 'Always report what the parameters mean. For P = 500 · 2^(t/3), "500 is the initial population" and "the population doubles every 3 hours" are required parts of any modelling answer.',
    },
  ],

  // ── L2 S1: Differentiation with Exponential, Log and Trig ──────────────────
  'y12-adv-l2-s1': [
    {
      type: 'text',
      body: 'Differentiation extends naturally to exponential, logarithmic, and trigonometric functions. Three rules — chain, product, and quotient — combine with the standard derivatives to handle composite and combined expressions. Mastering these expands the range of functions you can analyse.',
    },
    {
      type: 'rules',
      heading: 'Standard derivatives to memorise',
      items: [
        '$\\dfrac{d}{dx}[e^x] = e^x$',
        '$\\dfrac{d}{dx}[e^{f(x)}] = f\'(x)\\,e^{f(x)}$ (chain rule)',
        '$\\dfrac{d}{dx}[\\ln x] = \\dfrac{1}{x}$',
        '$\\dfrac{d}{dx}[\\ln f(x)] = \\dfrac{f\'(x)}{f(x)}$ (chain rule)',
        '$\\dfrac{d}{dx}[\\sin x] = \\cos x$',
        '$\\dfrac{d}{dx}[\\cos x] = -\\sin x$',
        '$\\dfrac{d}{dx}[\\tan x] = \\sec^2 x$',
      ],
    },
    {
      type: 'formula',
      latex: '\\frac{d}{dx}[u \\cdot v] = u\'v + uv\'',
      label: 'Product rule',
    },
    {
      type: 'formula',
      latex: '\\frac{d}{dx}\\!\\left[\\frac{u}{v}\\right] = \\frac{u\'v - uv\'}{v^2}',
      label: 'Quotient rule',
    },
    {
      type: 'formula',
      latex: '\\frac{d}{dx}[f(g(x))] = f\'(g(x))\\cdot g\'(x)',
      label: 'Chain rule',
    },
    {
      type: 'example',
      question: 'Differentiate y = e^(3x) · sin x.',
      steps: [
        'Let $u = e^{3x}$, $v = \\sin x$.',
        '$u\' = 3e^{3x}$ (chain rule), $v\' = \\cos x$.',
        'Product rule: $y\' = 3e^{3x}\\sin x + e^{3x}\\cos x$.',
        'Factor: $y\' = e^{3x}(3\\sin x + \\cos x)$.',
      ],
    },
    {
      type: 'example',
      question: 'Differentiate y = ln(x² + 1).',
      steps: [
        'Let $f(x) = x^2 + 1$, so $y = \\ln f(x)$.',
        '$f\'(x) = 2x$.',
        'Chain rule: $y\' = \\dfrac{f\'(x)}{f(x)} = \\dfrac{2x}{x^2 + 1}$.',
      ],
    },
    {
      type: 'tip',
      body: 'For d/dx[ln(f(x))], many students write 1/f(x) and forget to multiply by f ′(x). Always apply the chain rule: the answer is f ′(x)/f(x).',
    },
  ],

  // ── L2 S2: Using Derivatives — Curve Sketching and Optimisation ────────────
  'y12-adv-l2-s2': [
    {
      type: 'text',
      body: 'Derivatives reveal the shape of a graph. The first derivative tells us where the function is increasing or decreasing and locates stationary points. The second derivative determines concavity and confirms whether a stationary point is a local maximum, minimum, or inflection point. Optimisation problems ask for the global extreme value, which may occur at a stationary point or at an endpoint of the domain.',
    },
    {
      type: 'rules',
      heading: 'Stationary point classification',
      items: [
        'Stationary point where $f\'(x) = 0$.',
        'Local minimum if $f\'\'(x) > 0$ at that point.',
        'Local maximum if $f\'\'(x) < 0$ at that point.',
        'If $f\'\'(x) = 0$, use a sign table for $f\'$ to determine nature.',
        'Inflection point where $f\'\'(x) = 0$ AND $f\'\'$ changes sign.',
      ],
    },
    {
      type: 'steps',
      heading: 'Curve sketching checklist',
      items: [
        'Domain, intercepts ($x$- and $y$-intercepts).',
        'Find $f\'(x)$; solve $f\'(x) = 0$ for stationary points.',
        'Determine nature of each stationary point (second derivative or sign table).',
        'Find $f\'\'(x)$; solve $f\'\'(x) = 0$ for possible inflection points; confirm sign change.',
        'Identify asymptotes (vertical, horizontal, oblique).',
        'Sketch, marking all key points with coordinates.',
      ],
    },
    {
      type: 'steps',
      heading: 'Optimisation on a closed interval [a, b]',
      items: [
        'Define the quantity to be optimised as a function of one variable.',
        'Find the derivative and set it to zero — solve for critical points in $(a, b)$.',
        'Evaluate the function at each critical point AND at both endpoints $a$ and $b$.',
        'Compare all values: the largest is the global maximum, the smallest is the global minimum.',
        'State the answer in context with appropriate units.',
      ],
    },
    {
      type: 'example',
      question: 'Find and classify stationary points of f(x) = x³ − 3x² − 9x + 5.',
      steps: [
        '$f\'(x) = 3x^2 - 6x - 9 = 3(x^2 - 2x - 3) = 3(x-3)(x+1)$.',
        'Stationary points at $x = 3$ and $x = -1$.',
        '$f\'\'(x) = 6x - 6$.',
        'At $x = 3$: $f\'\'(3) = 12 > 0$ → local minimum; $f(3) = 27 - 27 - 27 + 5 = -22$.',
        'At $x = -1$: $f\'\'(-1) = -12 < 0$ → local maximum; $f(-1) = -1 - 3 + 9 + 5 = 10$.',
      ],
    },
    {
      type: 'tip',
      body: 'In word problems, always express the quantity to optimise in terms of a single variable before differentiating. Use any constraint equation to eliminate extra variables.',
    },
  ],

  // ── L3 S1: Primitive Functions and the Definite Integral ───────────────────
  'y12-adv-l3-s1': [
    {
      type: 'text',
      body: 'Integration is the reverse of differentiation. A primitive (antiderivative) F(x) of f(x) satisfies F ′(x) = f(x). Because the derivative of any constant is zero, primitives are not unique — the general antiderivative always includes + C. The Fundamental Theorem of Calculus connects antiderivatives to definite integrals, giving us a way to compute exact areas.',
    },
    {
      type: 'formula',
      latex: '\\int x^n\\,dx = \\frac{x^{n+1}}{n+1} + C \\quad (n \\neq -1)',
      label: 'Power rule for integration',
    },
    {
      type: 'formula',
      latex: '\\int_a^b f(x)\\,dx = F(b) - F(a)',
      label: 'Fundamental Theorem of Calculus (FTC)',
    },
    {
      type: 'rules',
      heading: 'Properties of definite integrals',
      items: [
        '$\\displaystyle\\int_a^b f(x)\\,dx = -\\int_b^a f(x)\\,dx$',
        '$\\displaystyle\\int_a^a f(x)\\,dx = 0$',
        '$\\displaystyle\\int_a^b [f(x) \\pm g(x)]\\,dx = \\int_a^b f(x)\\,dx \\pm \\int_a^b g(x)\\,dx$',
        'If $f(x) < 0$ on $[a,b]$, the definite integral is negative (signed area below $x$-axis).',
      ],
    },
    {
      type: 'steps',
      heading: 'Evaluating a definite integral',
      items: [
        'Find an antiderivative $F(x)$ (omit $+ C$ for definite integrals).',
        'Write $\\bigl[F(x)\\bigr]_a^b$.',
        'Substitute: $F(b) - F(a)$.',
        'Simplify to a single number.',
      ],
    },
    {
      type: 'example',
      question: 'Evaluate ∫₁³ (x² − 2x + 3) dx.',
      steps: [
        'Antiderivative: $F(x) = \\dfrac{x^3}{3} - x^2 + 3x$.',
        '$F(3) = 9 - 9 + 9 = 9$.',
        '$F(1) = \\tfrac{1}{3} - 1 + 3 = \\tfrac{7}{3}$.',
        '$\\displaystyle\\int_1^3 (x^2 - 2x + 3)\\,dx = 9 - \\frac{7}{3} = \\frac{20}{3}$.',
      ],
    },
    {
      type: 'tip',
      body: 'The "+ C" is required for indefinite integrals but must be omitted (or cancels) in definite integrals. Leaving it in a definite integral is not an error, but it wastes time and can confuse your working.',
    },
  ],

  // ── L3 S2: Integration with Exponential, Log and Trig ──────────────────────
  'y12-adv-l3-s2': [
    {
      type: 'text',
      body: 'Just as differentiation has rules for e^x, ln x, and trig functions, integration has corresponding antiderivative rules. Many integrals involving these functions require a simple substitution to match the standard form. Recognising the pattern — "the numerator is the derivative of the denominator" — is the key skill.',
    },
    {
      type: 'rules',
      heading: 'Standard integrals',
      items: [
        '$\\displaystyle\\int e^x\\,dx = e^x + C$',
        '$\\displaystyle\\int e^{ax+b}\\,dx = \\dfrac{1}{a}e^{ax+b} + C$',
        '$\\displaystyle\\int \\frac{1}{x}\\,dx = \\ln|x| + C$',
        '$\\displaystyle\\int \\frac{f\'(x)}{f(x)}\\,dx = \\ln|f(x)| + C$',
        '$\\displaystyle\\int \\sin x\\,dx = -\\cos x + C$',
        '$\\displaystyle\\int \\cos x\\,dx = \\sin x + C$',
        '$\\displaystyle\\int \\sec^2 x\\,dx = \\tan x + C$',
      ],
    },
    {
      type: 'steps',
      heading: 'Substitution method (u-substitution)',
      items: [
        'Identify an inner function $u = g(x)$ whose derivative $g\'(x)$ appears in the integrand.',
        'Compute $du = g\'(x)\\,dx$, then rewrite $dx = du/g\'(x)$.',
        'Rewrite the entire integral in terms of $u$.',
        'Integrate with respect to $u$ using standard rules.',
        'Substitute back $u = g(x)$ and add $+ C$.',
      ],
    },
    {
      type: 'example',
      question: 'Find ∫ 2x · e^(x²) dx.',
      steps: [
        'Let $u = x^2$, so $du = 2x\\,dx$.',
        'Integral becomes $\\displaystyle\\int e^u\\,du = e^u + C$.',
        'Substitute back: $= e^{x^2} + C$.',
      ],
    },
    {
      type: 'example',
      question: 'Find ∫ (3x²)/(x³ + 1) dx.',
      steps: [
        'Notice the numerator $3x^2$ is the derivative of $x^3 + 1$.',
        'So $\\displaystyle\\int \\frac{3x^2}{x^3+1}\\,dx = \\ln|x^3 + 1| + C$.',
      ],
    },
    {
      type: 'tip',
      body: 'The integral of 1/x is ln|x| + C — the absolute value bars are essential. Without them, the formula is undefined for x < 0, and you will lose marks in an exam for omitting them.',
    },
  ],

  // ── L3 S3: Areas Under and Between Curves ──────────────────────────────────
  'y12-adv-l3-s3': [
    {
      type: 'text',
      body: 'A definite integral gives signed area — positive when the curve is above the x-axis, negative when below. To find actual (geometric) area, you must split the integral at x-intercepts and take the absolute value of each piece. When finding the area between two curves, integrate the top curve minus the bottom curve.',
    },
    {
      type: 'formula',
      latex: 'A = \\int_a^b \\bigl|f(x)\\bigr|\\,dx',
      label: 'Area between curve and x-axis (actual area)',
    },
    {
      type: 'formula',
      latex: 'A = \\int_a^b \\bigl[f(x) - g(x)\\bigr]\\,dx \\quad \\text{when } f(x) \\geq g(x)',
      label: 'Area between two curves',
    },
    {
      type: 'steps',
      heading: 'Area between a curve and the x-axis',
      items: [
        'Solve $f(x) = 0$ to find $x$-intercepts in the interval.',
        'Split the integral at each $x$-intercept.',
        'Evaluate each sub-integral; take absolute value of any negative results.',
        'Add all the absolute values for the total area.',
      ],
    },
    {
      type: 'steps',
      heading: 'Area between two curves',
      items: [
        'Find intersections: solve $f(x) = g(x)$ to get limits of integration.',
        'Determine which curve is on top for each sub-interval (substitute a test point).',
        'Integrate: $A = \\displaystyle\\int_a^b [f(x) - g(x)]\\,dx$ where $f \\geq g$.',
        'If the curves cross, split at the crossing point and handle each part separately.',
      ],
    },
    {
      type: 'example',
      question: 'Find the area enclosed between y = x² − x − 2 and the x-axis from x = −1 to x = 3.',
      steps: [
        'Factor: $y = (x-2)(x+1)$, so zeros at $x = -1$ and $x = 2$.',
        'Curve is below $x$-axis on $[-1, 2]$, above on $[2, 3]$.',
        '$\\displaystyle\\int_{-1}^{2}(x^2-x-2)\\,dx = \\left[\\tfrac{x^3}{3}-\\tfrac{x^2}{2}-2x\\right]_{-1}^{2} = \\left(\\tfrac{8}{3}-2-4\\right)-\\left(-\\tfrac{1}{3}-\\tfrac{1}{2}+2\\right) = -\\tfrac{9}{2}$.',
        'Area for this piece $= \\tfrac{9}{2}$.',
        '$\\displaystyle\\int_{2}^{3}(x^2-x-2)\\,dx = \\left[\\tfrac{x^3}{3}-\\tfrac{x^2}{2}-2x\\right]_{2}^{3} = \\left(9-\\tfrac{9}{2}-6\\right)-\\left(\\tfrac{8}{3}-2-4\\right) = \\tfrac{11}{6}$.',
        'Total area $= \\dfrac{9}{2} + \\dfrac{11}{6} = \\dfrac{27}{6} + \\dfrac{11}{6} = \\dfrac{38}{6} = \\dfrac{19}{3}$ square units.',
      ],
    },
    {
      type: 'tip',
      body: 'Never blindly add two definite integrals when part of the area is below the x-axis — they will partially cancel. Always check for sign changes and split accordingly.',
    },
  ],

  // ── L4 S1: Rates of Change and Related Rates ───────────────────────────────
  'y12-adv-l4-s1': [
    {
      type: 'text',
      body: 'Rates of change appear whenever a quantity varies with time or with another variable. The derivative dy/dx measures the instantaneous rate at which y changes per unit change in x. Related rates problems use the chain rule to connect two rates that share a common variable — typically time.',
    },
    {
      type: 'formula',
      latex: '\\frac{dV}{dt} = \\frac{dV}{dr}\\cdot\\frac{dr}{dt}',
      label: 'Chain rule for related rates',
    },
    {
      type: 'steps',
      heading: 'Solving a related rates problem',
      items: [
        'Draw a diagram and label all relevant quantities with variables.',
        'Write an equation relating the variables (volume formula, Pythagoras, similar triangles, etc.).',
        'Differentiate both sides with respect to time $t$, using the chain rule.',
        'Substitute the known rates and values at the specific instant.',
        'Solve for the unknown rate.',
        'State the answer with correct units and sign (positive = increasing, negative = decreasing).',
      ],
    },
    {
      type: 'example',
      question: 'Air is pumped into a spherical balloon at 100 cm³/s. How fast is the radius increasing when r = 5 cm?',
      steps: [
        'Volume of sphere: $V = \\dfrac{4}{3}\\pi r^3$.',
        'Differentiate w.r.t. $t$: $\\dfrac{dV}{dt} = 4\\pi r^2 \\dfrac{dr}{dt}$.',
        'Given: $\\dfrac{dV}{dt} = 100$ cm³/s, $r = 5$ cm.',
        '$100 = 4\\pi(25)\\dfrac{dr}{dt} \\Rightarrow \\dfrac{dr}{dt} = \\dfrac{100}{100\\pi} = \\dfrac{1}{\\pi}$ cm/s.',
      ],
    },
    {
      type: 'text',
      body: 'Separable differential equations arise in growth/decay problems. The equation dP/dt = kP is solved by separating variables: dP/P = k dt, then integrating both sides to get ln P = kt + C, which gives P = Ae^(kt).',
    },
    {
      type: 'formula',
      latex: '\\frac{dP}{dt} = kP \\implies P = Ae^{kt}',
      label: 'Exponential growth/decay ODE',
    },
    {
      type: 'tip',
      body: 'In related rates, all variables are functions of time. When you differentiate an expression like r², the chain rule gives 2r · (dr/dt), not just 2r. Never forget the dr/dt.',
    },
  ],

  // ── L5 S1: Arithmetic Sequences and Series ─────────────────────────────────
  'y12-adv-l5-s1': [
    {
      type: 'text',
      body: 'An arithmetic sequence has a constant difference d between consecutive terms. Knowing any two of the four quantities — first term a, common difference d, number of terms n, and a specific term T_n — allows you to find the others. The sum formula S_n gives the total of the first n terms without adding them individually.',
    },
    {
      type: 'formula',
      latex: 'T_n = a + (n-1)d',
      label: 'nth term of an arithmetic sequence',
    },
    {
      type: 'formula',
      latex: 'S_n = \\frac{n}{2}\\bigl(2a + (n-1)d\\bigr) = \\frac{n}{2}(a + l)',
      label: 'Sum of first n terms (l = last term)',
    },
    {
      type: 'rules',
      heading: 'Key properties',
      items: [
        'Common difference: $d = T_{n+1} - T_n$ (must be constant)',
        'If $d > 0$, the sequence is increasing; if $d < 0$, decreasing.',
        'The terms are evenly spaced on a number line.',
        'The middle term of a finite AP equals the mean of all terms.',
      ],
    },
    {
      type: 'example',
      question: 'The 4th term of an AP is 17 and the 9th term is 37. Find a and d, then find S₂₀.',
      steps: [
        '$T_4 = a + 3d = 17$ and $T_9 = a + 8d = 37$.',
        'Subtract: $5d = 20 \\Rightarrow d = 4$.',
        '$a = 17 - 3(4) = 5$.',
        '$S_{20} = \\dfrac{20}{2}(2 \\times 5 + 19 \\times 4) = 10(10 + 76) = 10 \\times 86 = 860$.',
      ],
    },
    {
      type: 'example',
      question: 'How many terms of the AP 3, 7, 11, … are needed for the sum to exceed 500?',
      steps: [
        '$a = 3$, $d = 4$. Set $S_n > 500$.',
        '$S_n = \\dfrac{n}{2}(6 + 4(n-1)) = \\dfrac{n}{2}(4n+2) = n(2n+1)$.',
        'Solve $2n^2 + n > 500 \\Rightarrow 2n^2 + n - 500 > 0$.',
        'Quadratic formula: $n = \\dfrac{-1 + \\sqrt{1 + 4000}}{4} \\approx 15.6$.',
        'Since $n$ must be a positive integer: $n = 16$ (check: $S_{16} = 16 \\times 33 = 528 > 500$ ✓).',
      ],
    },
    {
      type: 'tip',
      body: 'When solving for n, remember it must be a positive integer. Always round up when the question asks for the first n where a sum exceeds a threshold.',
    },
  ],

  // ── L5 S2: Geometric Sequences and Series ──────────────────────────────────
  'y12-adv-l5-s2': [
    {
      type: 'text',
      body: 'A geometric sequence has a constant ratio r between consecutive terms. Unlike arithmetic sequences, geometric sequences can model exponential growth (|r| > 1) or decay (0 < |r| < 1). When |r| < 1, the infinite series converges to a finite sum S∞ — a remarkable fact useful for recurring decimals and long-run totals.',
    },
    {
      type: 'formula',
      latex: 'T_n = a\\,r^{n-1}',
      label: 'nth term of a geometric sequence',
    },
    {
      type: 'formula',
      latex: 'S_n = \\frac{a(r^n - 1)}{r - 1} \\quad (r \\neq 1)',
      label: 'Sum of first n terms',
    },
    {
      type: 'formula',
      latex: 'S_\\infty = \\frac{a}{1 - r} \\quad (|r| < 1)',
      label: 'Sum to infinity (limiting sum)',
    },
    {
      type: 'rules',
      heading: 'Key properties',
      items: [
        'Common ratio: $r = T_{n+1}/T_n$ (must be constant)',
        '$S_\\infty$ exists only when $|r| < 1$.',
        'If $r = 1$, all terms are equal and $S_n = na$.',
        'If $r < 0$, terms alternate in sign.',
      ],
    },
    {
      type: 'example',
      question: 'Express 0.\\overline{27} = 0.272727… as a fraction using an infinite GP.',
      steps: [
        '$0.272727\\ldots = 0.27 + 0.0027 + 0.000027 + \\cdots$',
        'This is a GP with $a = 0.27$ and $r = 0.01$.',
        '$S_\\infty = \\dfrac{0.27}{1 - 0.01} = \\dfrac{0.27}{0.99} = \\dfrac{27}{99} = \\dfrac{3}{11}$.',
      ],
    },
    {
      type: 'example',
      question: 'The 2nd term of a GP is 6 and the 5th term is 48. Find a and r, then S₈.',
      steps: [
        '$T_2 = ar = 6$ and $T_5 = ar^4 = 48$.',
        'Divide: $r^3 = 8 \\Rightarrow r = 2$.',
        '$a = 6/2 = 3$.',
        '$S_8 = \\dfrac{3(2^8 - 1)}{2 - 1} = 3 \\times 255 = 765$.',
      ],
    },
    {
      type: 'tip',
      body: 'To find r from two non-consecutive terms, divide them: T_m / T_n = r^(m−n). Then solve for r using the appropriate root. Always check that |r| < 1 before using S∞.',
    },
  ],

  // ── L6 S1: Discrete and Continuous Random Variables ────────────────────────
  'y12-adv-l6-s1': [
    {
      type: 'text',
      body: 'A random variable assigns a numerical value to each outcome of a probability experiment. Discrete random variables take countable values (e.g. number of heads); continuous random variables take values over an interval (e.g. height, time). The key summaries are the expected value (mean) and variance, which quantify centre and spread.',
    },
    {
      type: 'formula',
      latex: 'E(X) = \\sum x\\,P(X = x)',
      label: 'Expected value of a discrete RV',
    },
    {
      type: 'formula',
      latex: '\\text{Var}(X) = E(X^2) - [E(X)]^2',
      label: 'Variance (computational formula)',
    },
    {
      type: 'formula',
      latex: 'E(X^2) = \\sum x^2\\,P(X = x)',
      label: 'Second moment (discrete)',
    },
    {
      type: 'rules',
      heading: 'Properties of a probability distribution',
      items: [
        '$P(X = x) \\geq 0$ for all $x$',
        '$\\sum P(X = x) = 1$ (all probabilities sum to 1)',
        '$E(aX + b) = aE(X) + b$',
        '$\\text{Var}(aX + b) = a^2\\,\\text{Var}(X)$',
        '$\\text{SD}(X) = \\sqrt{\\text{Var}(X)}$',
      ],
    },
    {
      type: 'text',
      body: 'For a continuous random variable X with probability density function (PDF) f(x), probabilities are found by integration: P(a ≤ X ≤ b) = ∫f(x)dx. The total area under the PDF must equal 1. Unlike the discrete case, P(X = c) = 0 for any single value c.',
    },
    {
      type: 'formula',
      latex: 'P(a \\leq X \\leq b) = \\int_a^b f(x)\\,dx',
      label: 'Probability from a PDF',
    },
    {
      type: 'example',
      question: 'X has the distribution: P(X=1)=0.2, P(X=2)=0.5, P(X=3)=0.3. Find E(X) and Var(X).',
      steps: [
        '$E(X) = 1(0.2) + 2(0.5) + 3(0.3) = 0.2 + 1.0 + 0.9 = 2.1$.',
        '$E(X^2) = 1(0.2) + 4(0.5) + 9(0.3) = 0.2 + 2.0 + 2.7 = 4.9$.',
        '$\\text{Var}(X) = 4.9 - (2.1)^2 = 4.9 - 4.41 = 0.49$.',
        '$\\text{SD}(X) = \\sqrt{0.49} = 0.7$.',
      ],
    },
    {
      type: 'tip',
      body: 'Var(X) = E(X²) − [E(X)]² is the faster formula in exams. Do not confuse it with Var(X) = E[(X − μ)²]; they are equivalent, but the computational formula avoids repeated subtraction of μ.',
    },
  ],

  // ── L6 S2: The Normal Distribution ─────────────────────────────────────────
  'y12-adv-l6-s2': [
    {
      type: 'text',
      body: 'The normal distribution is the bell-shaped curve that describes many natural measurements — heights, exam scores, measurement errors. It is fully determined by its mean μ (centre) and standard deviation σ (spread). To use tables, we standardise by converting X to a z-score: z = (X − μ)/σ, which measures how many standard deviations a value is from the mean.',
    },
    {
      type: 'formula',
      latex: 'X \\sim N(\\mu,\\, \\sigma^2)',
      label: 'Notation: X is normally distributed with mean μ and variance σ²',
    },
    {
      type: 'formula',
      latex: 'Z = \\frac{X - \\mu}{\\sigma} \\sim N(0,\\,1)',
      label: 'Standardisation (Z-score)',
    },
    {
      type: 'rules',
      heading: 'Empirical rule (68–95–99.7)',
      items: [
        '$P(\\mu - \\sigma < X < \\mu + \\sigma) \\approx 68\\%$',
        '$P(\\mu - 2\\sigma < X < \\mu + 2\\sigma) \\approx 95\\%$',
        '$P(\\mu - 3\\sigma < X < \\mu + 3\\sigma) \\approx 99.7\\%$',
        'The normal curve is symmetric about $\\mu$, so $P(Z < 0) = 0.5$.',
      ],
    },
    {
      type: 'steps',
      heading: 'Using z-tables to find probabilities',
      items: [
        'Standardise: compute $z = (x - \\mu)/\\sigma$.',
        'Look up $\\Phi(z) = P(Z \\leq z)$ in the standard normal table.',
        'For $P(X > x)$: use $1 - \\Phi(z)$.',
        'For $P(a < X < b)$: use $\\Phi(z_b) - \\Phi(z_a)$.',
        'For negative $z$: use symmetry $\\Phi(-z) = 1 - \\Phi(z)$.',
      ],
    },
    {
      type: 'example',
      question: 'Heights are normally distributed with μ = 170 cm, σ = 8 cm. Find P(X > 182).',
      steps: [
        '$z = (182 - 170)/8 = 12/8 = 1.5$.',
        '$P(X > 182) = P(Z > 1.5) = 1 - \\Phi(1.5) = 1 - 0.9332 = 0.0668$.',
        'About $6.68\\%$ of people are taller than 182 cm.',
      ],
    },
    {
      type: 'example',
      question: 'Find the value of x such that P(X < x) = 0.90, given μ = 50, σ = 10.',
      steps: [
        'From the table, $\\Phi(z) = 0.90 \\Rightarrow z \\approx 1.282$.',
        '$x = \\mu + z\\sigma = 50 + 1.282 \\times 10 = 62.82$.',
      ],
    },
    {
      type: 'tip',
      body: 'The z-table gives P(Z ≤ z). Always sketch the normal curve and shade the region you want before looking up the table — this prevents you from accidentally using 1 − Φ(z) when you should use Φ(z).',
    },
  ],

  // ── L7 S1: Reducing Balance Loans ──────────────────────────────────────────
  'y12-adv-l7-s1': [
    {
      type: 'text',
      body: 'In a reducing balance loan, interest is charged each period on the outstanding balance, then a repayment M is made. This reduces the balance more each period as time goes on. The key insight is that the balance after n periods follows a geometric series, which leads to an explicit formula.',
    },
    {
      type: 'formula',
      latex: 'A_n = A_{n-1}(1 + r) - M',
      label: 'Recurrence relation (r = period interest rate)',
    },
    {
      type: 'formula',
      latex: 'A_n = A_0(1+r)^n - M\\cdot\\frac{(1+r)^n - 1}{r}',
      label: 'Explicit formula for balance after n periods',
    },
    {
      type: 'steps',
      heading: 'Finding the repayment M to pay off in n periods',
      items: [
        'Set $A_n = 0$ in the explicit formula.',
        '$0 = A_0(1+r)^n - M\\cdot\\dfrac{(1+r)^n - 1}{r}$.',
        'Solve for $M$: $M = \\dfrac{A_0\\,r\\,(1+r)^n}{(1+r)^n - 1}$.',
        'Substitute $A_0$ (principal), $r$ (monthly/fortnightly rate), $n$ (number of periods).',
        'Note: $r$ is the period rate — divide the annual rate by 12 for monthly repayments.',
      ],
    },
    {
      type: 'example',
      question: 'A $200 000 loan is at 6% p.a. compounded monthly over 25 years. Find the monthly repayment M.',
      steps: [
        '$A_0 = 200\\,000$, $r = 0.06/12 = 0.005$, $n = 25 \\times 12 = 300$.',
        '$(1.005)^{300} \\approx 4.4677$.',
        '$M = \\dfrac{200000 \\times 0.005 \\times 4.4677}{4.4677 - 1} = \\dfrac{4467.7}{3.4677} \\approx \\$1288.60$.',
      ],
    },
    {
      type: 'example',
      question: 'Using the recurrence relation, find the balance after 2 months for a $10 000 loan at 1% per month with monthly repayments of $500.',
      steps: [
        '$A_0 = 10\\,000$.',
        '$A_1 = 10000 \\times 1.01 - 500 = 10100 - 500 = 9600$.',
        '$A_2 = 9600 \\times 1.01 - 500 = 9696 - 500 = 9196$.',
      ],
    },
    {
      type: 'tip',
      body: 'Always convert the annual interest rate to the period rate before substituting. For monthly repayments, r = annual rate ÷ 12. For fortnightly repayments, r = annual rate ÷ 26.',
    },
  ],

  // ── L7 S2: Annuities ───────────────────────────────────────────────────────
  'y12-adv-l7-s2': [
    {
      type: 'text',
      body: 'An annuity is a series of equal regular payments. In a future value annuity (like superannuation), payments are invested and grow with interest. In a present value annuity (like a mortgage or pension), a lump sum is drawn down by regular payments. The two formulas are mirror images of each other.',
    },
    {
      type: 'formula',
      latex: 'FV_n = M\\cdot\\frac{(1+r)^n - 1}{r}',
      label: 'Future value of an annuity (end-of-period payments)',
    },
    {
      type: 'formula',
      latex: 'PV_n = M\\cdot\\frac{1 - (1+r)^{-n}}{r}',
      label: 'Present value of an annuity',
    },
    {
      type: 'rules',
      heading: 'Key relationships',
      items: [
        'FV and PV are related by: $FV = PV \\times (1+r)^n$',
        'A reducing balance loan has $PV = A_0$ (original principal)',
        'The repayment formula from Loan topic is the same as rearranging $PV_n = M \\cdot \\ldots$',
        'Superannuation: each contribution grows at interest — use FV formula',
        'Pension draw-down: a lump sum funds future payments — use PV formula',
      ],
    },
    {
      type: 'steps',
      heading: 'Superannuation (future value) problem',
      items: [
        'Identify $M$ (periodic contribution), $r$ (period interest rate), $n$ (number of payments).',
        'Use $FV_n = M \\cdot \\dfrac{(1+r)^n - 1}{r}$ to find the final balance.',
        'If there is also an existing lump sum $P_0$, add its future value: $FV = P_0(1+r)^n + M \\cdot \\dfrac{(1+r)^n - 1}{r}$.',
      ],
    },
    {
      type: 'example',
      question: 'Lucy deposits $500 per month into super at 6% p.a. compounded monthly for 30 years. Find the future value.',
      steps: [
        '$M = 500$, $r = 0.06/12 = 0.005$, $n = 30 \\times 12 = 360$.',
        '$(1.005)^{360} \\approx 6.0226$.',
        '$FV = 500 \\times \\dfrac{6.0226 - 1}{0.005} = 500 \\times \\dfrac{5.0226}{0.005} = 500 \\times 1004.52 \\approx \\$502\\,260$.',
      ],
    },
    {
      type: 'example',
      question: 'How much must be invested now at 5% p.a. compounded annually to fund annual pension payments of $20 000 for 15 years?',
      steps: [
        '$M = 20000$, $r = 0.05$, $n = 15$.',
        '$PV = 20000 \\times \\dfrac{1 - (1.05)^{-15}}{0.05}$.',
        '$(1.05)^{-15} \\approx 0.4810$.',
        '$PV = 20000 \\times \\dfrac{1 - 0.4810}{0.05} = 20000 \\times \\dfrac{0.519}{0.05} = 20000 \\times 10.38 = \\$207\\,600$.',
      ],
    },
    {
      type: 'tip',
      body: 'The FV formula assumes payments are made at the END of each period. If the first payment is made immediately (annuity-due), multiply the result by (1 + r). The exam will always specify which applies.',
    },
  ],
}
