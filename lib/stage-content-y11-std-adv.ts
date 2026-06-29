import type { ExplanationBlock } from './curriculum'

export const STAGE_CONTENT_Y11_STD_ADV: Record<string, ExplanationBlock[]> = {

  // ══════════════════════════════════════════════════════════════════════════
  // YEAR 11 STANDARD
  // ══════════════════════════════════════════════════════════════════════════

  // ── Std L1 S1: Formulae and Equations ─────────────────────────────────────
  'y11-std-l1-s1': [
    {
      type: 'text',
      body: 'Algebra is the language of mathematics. A formula expresses a relationship between quantities using pronumerals (letters). To evaluate a formula, substitute known values and simplify. To solve an equation, apply inverse operations in reverse order to isolate the unknown. These skills underpin every other topic in Standard Mathematics.',
    },
    {
      type: 'rules',
      heading: 'Order of operations (BODMAS)',
      items: [
        'Brackets first',
        'Orders (powers and roots)',
        'Division and Multiplication (left to right)',
        'Addition and Subtraction (left to right)',
      ],
    },
    {
      type: 'steps',
      heading: 'Substituting into a formula',
      items: [
        'Write the formula.',
        'Replace each pronumeral with its given value.',
        'Follow BODMAS to simplify step by step.',
        'State the answer with correct units.',
      ],
    },
    {
      type: 'steps',
      heading: 'Solving a linear equation',
      items: [
        'Expand any brackets.',
        'Collect like terms on each side.',
        'Apply inverse operations to isolate the unknown — undo addition/subtraction first, then multiplication/division.',
        'Check by substituting your answer back into the original equation.',
      ],
    },
    {
      type: 'example',
      question: 'The formula for simple interest is I = PRT/100. Find I when P = 4000, R = 5, T = 3.',
      steps: [
        '$I = \\dfrac{PRT}{100} = \\dfrac{4000 \\times 5 \\times 3}{100}$.',
        '$= \\dfrac{60\\,000}{100} = 600$.',
        'Simple interest $= \\$600$.',
      ],
    },
    {
      type: 'example',
      question: 'Solve 3(2x − 1) = 15.',
      steps: [
        'Expand: $6x - 3 = 15$.',
        'Add 3 to both sides: $6x = 18$.',
        'Divide by 6: $x = 3$.',
        'Check: $3(2 \\times 3 - 1) = 3 \\times 5 = 15$ ✓.',
      ],
    },
    {
      type: 'tip',
      body: 'When substituting, place brackets around negative values to avoid sign errors. For example, if x = −3 and the formula has x², write (−3)² = 9, not −3² = −9.',
    },
  ],

  // ── Std L1 S2: Linear Relationships ──────────────────────────────────────
  'y11-std-l1-s2': [
    {
      type: 'text',
      body: 'A linear relationship has a constant rate of change — its graph is a straight line. The gradient (slope) measures steepness; the y-intercept is where the line crosses the y-axis. Linear models are used whenever one quantity changes at a constant rate relative to another.',
    },
    {
      type: 'formula',
      latex: 'y = mx + b',
      label: 'Gradient–intercept form (m = gradient, b = y-intercept)',
    },
    {
      type: 'formula',
      latex: 'm = \\frac{y_2 - y_1}{x_2 - x_1} = \\frac{\\text{rise}}{\\text{run}}',
      label: 'Gradient between two points',
    },
    {
      type: 'rules',
      heading: 'Key facts about straight lines',
      items: [
        'Positive gradient: line rises left to right.',
        'Negative gradient: line falls left to right.',
        'Zero gradient: horizontal line $y = b$.',
        'Undefined gradient: vertical line $x = a$.',
        'Parallel lines have equal gradients.',
        'Perpendicular lines have gradients that multiply to $-1$: $m_1 m_2 = -1$.',
      ],
    },
    {
      type: 'steps',
      heading: 'Finding a line equation through two points',
      items: [
        'Calculate the gradient $m = (y_2 - y_1)/(x_2 - x_1)$.',
        'Substitute $m$ and one point into $y - y_1 = m(x - x_1)$.',
        'Rearrange to $y = mx + b$.',
      ],
    },
    {
      type: 'example',
      question: 'Find the equation of the line through (2, 1) and (6, 9).',
      steps: [
        '$m = \\dfrac{9 - 1}{6 - 2} = \\dfrac{8}{4} = 2$.',
        'Using point $(2, 1)$: $y - 1 = 2(x - 2)$.',
        '$y = 2x - 4 + 1 = 2x - 3$.',
      ],
    },
    {
      type: 'example',
      question: 'A taxi charges a $3 flagfall plus $2.50 per kilometre. Write the cost equation and find the cost for 12 km.',
      steps: [
        'Cost $C = 2.5d + 3$ where $d$ is distance in km.',
        '$C = 2.5(12) + 3 = 30 + 3 = \\$33$.',
      ],
    },
    {
      type: 'tip',
      body: 'The y-intercept in a real-world model often represents a fixed cost or starting value — always interpret it in context, not just as a number.',
    },
  ],

  // ── Std L2 S1: Earning Money ───────────────────────────────────────────────
  'y11-std-l2-s1': [
    {
      type: 'text',
      body: 'Understanding different types of income is an essential life skill. Wages are paid per hour; salaries are fixed annual amounts divided into pay periods. Additional income comes from overtime, commission, and allowances. Tax is deducted from gross income — the amount remaining after tax is net income (take-home pay).',
    },
    {
      type: 'rules',
      heading: 'Types of income',
      items: [
        'Wage: hourly rate × hours worked',
        'Salary: fixed annual amount (annual ÷ 52 = weekly; ÷ 26 = fortnightly; ÷ 12 = monthly)',
        'Overtime (time-and-a-half): 1.5 × hourly rate per extra hour',
        'Double time: 2 × hourly rate per extra hour',
        'Commission: percentage of sales value',
        'Piecework: fixed rate per item produced',
      ],
    },
    {
      type: 'formula',
      latex: '\\text{Net income} = \\text{Gross income} - \\text{Tax} - \\text{Other deductions}',
      label: 'Net (take-home) pay',
    },
    {
      type: 'example',
      question: 'Sarah earns $24/h for 38 h, plus 4 hours at time-and-a-half. Calculate her gross weekly wage.',
      steps: [
        'Normal pay: $24 \\times 38 = \\$912$.',
        'Overtime rate: $24 \\times 1.5 = \\$36$/h.',
        'Overtime pay: $36 \\times 4 = \\$144$.',
        'Gross wage $= 912 + 144 = \\$1056$.',
      ],
    },
    {
      type: 'example',
      question: 'A salesperson earns a base salary of $30 000 p.a. plus 3% commission on sales of $250 000. Find the total annual income.',
      steps: [
        'Commission $= 3\\% \\times 250\\,000 = 0.03 \\times 250\\,000 = \\$7500$.',
        'Total income $= 30\\,000 + 7500 = \\$37\\,500$.',
      ],
    },
    {
      type: 'tip',
      body: 'When converting a salary to a weekly rate, always divide by 52 — not by 4 × 12 = 48. A year has 52 weeks, not 48.',
    },
  ],

  // ── Std L2 S2: Managing Money ──────────────────────────────────────────────
  'y11-std-l2-s2': [
    {
      type: 'text',
      body: 'Managing money means understanding how interest accumulates on savings and loans. Simple interest grows linearly — you earn the same dollar amount each period. Compound interest grows exponentially — you earn interest on previously earned interest, so the total grows faster over time.',
    },
    {
      type: 'formula',
      latex: 'I = \\frac{PRT}{100}',
      label: 'Simple interest (P = principal, R = % per annum, T = years)',
    },
    {
      type: 'formula',
      latex: 'A = P\\left(1 + \\frac{r}{n}\\right)^{nt}',
      label: 'Compound interest (r = annual rate as decimal, n = compounding periods per year, t = years)',
    },
    {
      type: 'rules',
      heading: 'Comparing simple vs compound interest',
      items: [
        'Simple interest: interest is always calculated on the original principal.',
        'Compound interest: interest is calculated on the current balance (principal + previous interest).',
        'Over time, compound interest always produces a larger amount than simple interest at the same rate.',
        'More frequent compounding (monthly vs annually) produces a higher final amount.',
      ],
    },
    {
      type: 'example',
      question: 'Find the compound amount on $5000 invested at 4% p.a. compounded quarterly for 3 years.',
      steps: [
        '$P = 5000$, $r = 0.04$, $n = 4$, $t = 3$.',
        '$A = 5000\\left(1 + \\dfrac{0.04}{4}\\right)^{4 \\times 3} = 5000(1.01)^{12}$.',
        '$(1.01)^{12} \\approx 1.12683$.',
        '$A \\approx 5000 \\times 1.12683 = \\$5634.15$.',
        'Interest earned $= 5634.15 - 5000 = \\$634.15$.',
      ],
    },
    {
      type: 'example',
      question: 'A $2000 loan accrues simple interest at 6% p.a. How long until the interest reaches $360?',
      steps: [
        '$360 = \\dfrac{2000 \\times 6 \\times T}{100} = 120T$.',
        '$T = \\dfrac{360}{120} = 3$ years.',
      ],
    },
    {
      type: 'tip',
      body: 'For compound interest problems, always identify n (compounding frequency) carefully: annually n=1, semi-annually n=2, quarterly n=4, monthly n=12, fortnightly n=26, weekly n=52.',
    },
  ],

  // ── Std L3 S1: Applications of Measurement ────────────────────────────────
  'y11-std-l3-s1': [
    {
      type: 'text',
      body: 'Measurement involves calculating perimeters, areas, surface areas, and volumes of standard and composite shapes. Real-world applications require choosing appropriate units, converting between them, and interpreting answers in context. Errors in measurement (absolute, relative, and percentage error) quantify how accurate our measurements are.',
    },
    {
      type: 'rules',
      heading: 'Key area and volume formulas',
      items: [
        'Rectangle: $A = lw$',
        'Triangle: $A = \\tfrac{1}{2}bh$',
        'Circle: $A = \\pi r^2$, circumference $= 2\\pi r$',
        'Trapezium: $A = \\tfrac{1}{2}(a+b)h$',
        'Cylinder: $V = \\pi r^2 h$, $SA = 2\\pi r^2 + 2\\pi r h$',
        'Rectangular prism: $V = lwh$',
        'Sphere: $V = \\tfrac{4}{3}\\pi r^3$, $SA = 4\\pi r^2$',
        'Cone: $V = \\tfrac{1}{3}\\pi r^2 h$',
      ],
    },
    {
      type: 'formula',
      latex: '\\text{Percentage error} = \\frac{\\text{absolute error}}{\\text{measurement}} \\times 100\\%',
      label: 'Percentage error',
    },
    {
      type: 'steps',
      heading: 'Composite area problems',
      items: [
        'Divide the shape into standard shapes (rectangles, triangles, semicircles, etc.).',
        'Calculate the area of each part.',
        'Add areas (or subtract if a region is cut out).',
        'State units (cm², m², etc.).',
      ],
    },
    {
      type: 'example',
      question: 'Find the volume of a cylinder with radius 7 cm and height 12 cm. Give your answer correct to 1 decimal place.',
      steps: [
        '$V = \\pi r^2 h = \\pi \\times 7^2 \\times 12$.',
        '$= \\pi \\times 49 \\times 12 = 588\\pi$.',
        '$\\approx 1847.3$ cm³.',
      ],
    },
    {
      type: 'example',
      question: 'A measurement of 8.4 cm is recorded to the nearest 0.1 cm. Find the absolute error and percentage error.',
      steps: [
        'Absolute error $= \\tfrac{1}{2} \\times 0.1 = 0.05$ cm.',
        'Percentage error $= \\dfrac{0.05}{8.4} \\times 100\\% \\approx 0.60\\%$.',
      ],
    },
    {
      type: 'tip',
      body: 'For composite shapes, it helps to draw and label each sub-shape separately. Check that you have added the correct region — when a circle is cut out of a rectangle, subtract, not add.',
    },
  ],

  // ── Std L3 S2: Time and Location ──────────────────────────────────────────
  'y11-std-l3-s2': [
    {
      type: 'text',
      body: 'Time and location questions involve speed–distance–time relationships, reading timetables, and understanding time zones. Speed is the rate of change of distance with respect to time. Time zones are expressed as offsets from UTC (Coordinated Universal Time); Australia spans multiple time zones.',
    },
    {
      type: 'formula',
      latex: '\\text{Speed} = \\frac{\\text{Distance}}{\\text{Time}}, \\quad D = S \\times T, \\quad T = \\frac{D}{S}',
      label: 'Speed–Distance–Time triangle',
    },
    {
      type: 'rules',
      heading: 'Time zone rules',
      items: [
        'UTC is the global reference time.',
        'Moving east: add hours to UTC.',
        'Moving west: subtract hours from UTC.',
        'Australian Eastern Standard Time (AEST) $= $ UTC $+ 10$.',
        'Australian Central Standard Time (ACST) $= $ UTC $+ 9{:}30$.',
        'Australian Western Standard Time (AWST) $= $ UTC $+ 8$.',
        'Daylight saving adds 1 hour in NSW, VIC, SA, TAS, ACT.',
      ],
    },
    {
      type: 'steps',
      heading: 'Solving speed–distance–time problems',
      items: [
        'Identify the two given quantities and the unknown.',
        'Convert units if needed (e.g. km/h to m/s: multiply by $\\tfrac{1000}{3600} = \\tfrac{5}{18}$).',
        'Apply the correct formula: $D = ST$, $S = D/T$, or $T = D/S$.',
        'State the answer with correct units.',
      ],
    },
    {
      type: 'example',
      question: 'A train travels 360 km at an average speed of 90 km/h. How long does the journey take?',
      steps: [
        '$T = \\dfrac{D}{S} = \\dfrac{360}{90} = 4$ hours.',
      ],
    },
    {
      type: 'example',
      question: 'It is 3:00 pm in Sydney (AEST, UTC+10). What time is it in London (UTC+0) and in Los Angeles (UTC−8)?',
      steps: [
        'Sydney is UTC$+10$, so UTC time $= 3{:}00$ pm $- 10$ h $= 5{:}00$ am.',
        'London (UTC$+0$) $= 5{:}00$ am.',
        'Los Angeles (UTC$-8$) $= 5{:}00$ am $- 8$ h $= 9{:}00$ pm the previous day.',
      ],
    },
    {
      type: 'tip',
      body: 'When calculating travel time that crosses midnight, convert to 24-hour time first to avoid sign errors. For example, departing at 10:45 pm and arriving at 6:20 am is 7 hours 35 minutes.',
    },
  ],

  // ── Std L4 S1: Networks, Paths and Trees ──────────────────────────────────
  'y11-std-l4-s1': [
    {
      type: 'text',
      body: 'A network (graph) consists of vertices (nodes) connected by edges (arcs). Networks model real-world systems such as roads, computer networks, and supply chains. Key problems include finding the shortest path between vertices and finding a minimum spanning tree that connects all vertices at least cost.',
    },
    {
      type: 'rules',
      heading: 'Network terminology',
      items: [
        'Vertex (node): a point in the network.',
        'Edge (arc): a connection between two vertices; may be directed (one-way) or undirected.',
        'Weight: a value assigned to an edge (distance, time, cost).',
        'Degree of a vertex: the number of edges meeting at that vertex.',
        'Walk: a sequence of vertices connected by edges (repetition allowed).',
        'Path: a walk with no repeated vertices.',
        'Cycle: a path that returns to the starting vertex.',
        'Connected graph: every vertex is reachable from every other vertex.',
      ],
    },
    {
      type: 'rules',
      heading: 'Euler paths and circuits',
      items: [
        'An Euler path visits every edge exactly once.',
        'An Euler circuit is an Euler path that starts and ends at the same vertex.',
        'Euler path exists if the graph has exactly 0 or 2 vertices of odd degree.',
        'Euler circuit exists if every vertex has even degree.',
      ],
    },
    {
      type: 'steps',
      heading: 'Minimum spanning tree (Prim\'s algorithm)',
      items: [
        'Start at any vertex.',
        'Select the cheapest edge connecting the current tree to an unvisited vertex.',
        'Add that vertex to the tree.',
        'Repeat until all vertices are included.',
        'The total weight of all included edges is the minimum spanning tree weight.',
      ],
    },
    {
      type: 'steps',
      heading: 'Shortest path (Dijkstra\'s algorithm)',
      items: [
        'Assign the start vertex a distance of 0; all others ∞.',
        'Visit the unvisited vertex with the smallest tentative distance.',
        'Update neighbour distances: if (current distance + edge weight) < stored distance, update.',
        'Mark the current vertex as visited.',
        'Repeat until the destination is visited.',
      ],
    },
    {
      type: 'example',
      question: 'A network has 5 vertices with degrees 2, 3, 4, 3, 2. Does it have an Euler path? An Euler circuit?',
      steps: [
        'Count odd-degree vertices: degree 3 appears twice → 2 vertices of odd degree.',
        'Euler path: exists (exactly 2 odd-degree vertices) ✓.',
        'Euler circuit: does not exist (not all vertices have even degree) ✗.',
      ],
    },
    {
      type: 'tip',
      body: 'The sum of all vertex degrees always equals twice the number of edges (Handshaking Lemma). Use this to check your degree count: the sum must be even.',
    },
  ],

  // ── Std L5 S1: Data Analysis ───────────────────────────────────────────────
  'y11-std-l5-s1': [
    {
      type: 'text',
      body: 'Statistics involves collecting, summarising, and interpreting data. The centre of a dataset is described by the mean, median, and mode. Spread is described by range, interquartile range (IQR), and standard deviation. Box-and-whisker plots display the five-number summary; histograms show the shape of a distribution.',
    },
    {
      type: 'rules',
      heading: 'Measures of centre',
      items: [
        'Mean: $\\bar{x} = \\dfrac{\\sum x}{n}$ (sum of data ÷ number of values)',
        'Median: middle value when data is ordered (for even $n$, average of two middle values)',
        'Mode: most frequently occurring value (may be none or multiple)',
      ],
    },
    {
      type: 'rules',
      heading: 'Measures of spread',
      items: [
        'Range $= $ maximum $-$ minimum',
        'Interquartile range $\\text{IQR} = Q_3 - Q_1$',
        '$Q_1$ = median of the lower half; $Q_3$ = median of the upper half',
        'Outlier: a value more than $1.5 \\times \\text{IQR}$ below $Q_1$ or above $Q_3$',
        'Standard deviation $\\sigma$: measures how far values typically lie from the mean (calculator or formula)',
      ],
    },
    {
      type: 'rules',
      heading: 'Shape of a distribution',
      items: [
        'Symmetric (normal): mean ≈ median ≈ mode; bell-shaped.',
        'Positively skewed: tail to the right; mean > median > mode.',
        'Negatively skewed: tail to the left; mean < median < mode.',
        'Outliers pull the mean toward the tail but leave the median unchanged.',
      ],
    },
    {
      type: 'example',
      question: 'Find the median, Q1, Q3, and IQR of the dataset: 4, 7, 8, 10, 12, 15, 18, 21.',
      steps: [
        'Data is already ordered. $n = 8$.',
        'Median $= (10 + 12)/2 = 11$.',
        'Lower half: 4, 7, 8, 10 → $Q_1 = (7+8)/2 = 7.5$.',
        'Upper half: 12, 15, 18, 21 → $Q_3 = (15+18)/2 = 16.5$.',
        '$\\text{IQR} = 16.5 - 7.5 = 9$.',
      ],
    },
    {
      type: 'tip',
      body: 'When the question asks you to describe a dataset, address centre, spread, and shape — and mention any outliers. A single number such as the mean does not constitute a complete statistical description.',
    },
  ],

  // ══════════════════════════════════════════════════════════════════════════
  // YEAR 11 ADVANCED
  // ══════════════════════════════════════════════════════════════════════════

  // ── Adv L1 S1: Algebraic Techniques ───────────────────────────────────────
  'y11-adv-l1-s1': [
    {
      type: 'text',
      body: 'Year 11 Advanced Mathematics relies on fluent algebraic manipulation. This stage consolidates and extends key techniques: expanding, factorising, simplifying algebraic fractions, and working with surds and indices. These tools are applied constantly throughout all later topics — skill here pays dividends everywhere.',
    },
    {
      type: 'rules',
      heading: 'Factorising techniques',
      items: [
        'Highest common factor (HCF): always try this first.',
        'Difference of two squares (DOTS): $a^2 - b^2 = (a-b)(a+b)$.',
        'Perfect square trinomials: $a^2 \\pm 2ab + b^2 = (a \\pm b)^2$.',
        'General trinomial $x^2 + bx + c$: find two numbers with product $c$ and sum $b$.',
        'Trinomial $ax^2 + bx + c$: use the $ac$ method or complete the square.',
      ],
    },
    {
      type: 'rules',
      heading: 'Index laws',
      items: [
        '$a^m \\times a^n = a^{m+n}$',
        '$a^m \\div a^n = a^{m-n}$',
        '$(a^m)^n = a^{mn}$',
        '$a^0 = 1$',
        '$a^{-n} = \\dfrac{1}{a^n}$',
        '$a^{1/n} = \\sqrt[n]{a}$',
        '$a^{m/n} = (\\sqrt[n]{a})^m$',
      ],
    },
    {
      type: 'rules',
      heading: 'Surd rules',
      items: [
        '$\\sqrt{ab} = \\sqrt{a}\\,\\sqrt{b}$',
        '$\\sqrt{a/b} = \\sqrt{a}/\\sqrt{b}$',
        'To rationalise $\\dfrac{k}{\\sqrt{a}}$: multiply numerator and denominator by $\\sqrt{a}$.',
        'To rationalise $\\dfrac{k}{a + \\sqrt{b}}$: multiply by the conjugate $a - \\sqrt{b}$.',
      ],
    },
    {
      type: 'example',
      question: 'Factorise fully: 6x² − 7x − 3.',
      steps: [
        '$ac = 6 \\times (-3) = -18$. Find two numbers with product $-18$ and sum $-7$: they are $-9$ and $2$.',
        'Split middle term: $6x^2 - 9x + 2x - 3$.',
        'Group: $3x(2x - 3) + 1(2x - 3)$.',
        'Factor: $(3x + 1)(2x - 3)$.',
      ],
    },
    {
      type: 'example',
      question: 'Simplify: (3 + √5)(3 − √5).',
      steps: [
        'This is a difference of two squares: $(3)^2 - (\\sqrt{5})^2 = 9 - 5 = 4$.',
      ],
    },
    {
      type: 'tip',
      body: 'Rationalising the denominator means writing surds in the numerator, not the denominator. Always check whether the question asks you to simplify, expand, or factorise — these require different techniques.',
    },
  ],

  // ── Adv L1 S2: Introduction to Functions ──────────────────────────────────
  'y11-adv-l1-s2': [
    {
      type: 'text',
      body: 'A function assigns exactly one output y to every input x from its domain. This one-to-one or many-to-one requirement distinguishes functions from general relations. The vertical line test detects functions on a graph. Domain and range are the sets of allowed inputs and actual outputs respectively.',
    },
    {
      type: 'rules',
      heading: 'Function notation and key ideas',
      items: [
        'If $f(x) = x^2 - 3$, then $f(2) = 4 - 3 = 1$.',
        'Domain: set of all valid inputs (look for division by zero, square roots of negatives).',
        'Range: set of all output values produced.',
        'Vertical line test: a graph is a function if every vertical line meets it at most once.',
        'Horizontal line test: a function is one-to-one if every horizontal line meets it at most once.',
      ],
    },
    {
      type: 'steps',
      heading: 'Finding the natural domain',
      items: [
        'For $f(x) = \\sqrt{g(x)}$: require $g(x) \\geq 0$.',
        'For $f(x) = 1/g(x)$: exclude values where $g(x) = 0$.',
        'For $f(x) = \\ln(g(x))$: require $g(x) > 0$.',
        'The natural domain is the largest set for which the expression is defined.',
      ],
    },
    {
      type: 'example',
      question: 'State the natural domain and range of f(x) = √(4 − x).',
      steps: [
        'Require $4 - x \\geq 0 \\Rightarrow x \\leq 4$.',
        'Domain: $x \\leq 4$ or $(-\\infty,\\, 4]$.',
        'When $x \\leq 4$, $\\sqrt{4-x} \\geq 0$.',
        'Range: $y \\geq 0$ or $[0,\\, \\infty)$.',
      ],
    },
    {
      type: 'example',
      question: 'Given g(x) = 2x + 1, evaluate g(3), g(−1), and g(a + 2).',
      steps: [
        '$g(3) = 2(3)+1 = 7$.',
        '$g(-1) = 2(-1)+1 = -1$.',
        '$g(a+2) = 2(a+2)+1 = 2a+5$.',
      ],
    },
    {
      type: 'tip',
      body: 'A common error is forgetting that the domain of a composite function f(g(x)) is restricted by both functions: g(x) must be defined, AND g(x) must lie in the domain of f.',
    },
  ],

  // ── Adv L1 S3: Linear, Quadratic and Cubic Functions ──────────────────────
  'y11-adv-l1-s3': [
    {
      type: 'text',
      body: 'Linear, quadratic, and cubic functions form the core polynomial family. Linear graphs are straight lines; quadratics are parabolas with a vertex; cubics have an S-shape with one or two turning points. Understanding their algebraic forms and how to find key features — intercepts, vertex, turning points — is fundamental to all later calculus work.',
    },
    {
      type: 'formula',
      latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
      label: 'Quadratic formula',
    },
    {
      type: 'formula',
      latex: 'y = a(x - h)^2 + k',
      label: 'Vertex form of a parabola (vertex at (h, k))',
    },
    {
      type: 'rules',
      heading: 'Discriminant Δ = b² − 4ac',
      items: [
        '$\\Delta > 0$: two distinct real roots',
        '$\\Delta = 0$: one repeated real root (the parabola touches the $x$-axis)',
        '$\\Delta < 0$: no real roots (parabola does not cross the $x$-axis)',
      ],
    },
    {
      type: 'steps',
      heading: 'Completing the square',
      items: [
        'Write $ax^2 + bx + c = a\\left(x^2 + \\dfrac{b}{a}x\\right) + c$.',
        'Add and subtract $\\left(\\dfrac{b}{2a}\\right)^2$ inside the bracket.',
        'Factor the perfect square: $a\\left(x + \\dfrac{b}{2a}\\right)^2 - \\dfrac{b^2}{4a} + c$.',
        'Read off vertex $h = -b/(2a)$, $k = c - b^2/(4a)$.',
      ],
    },
    {
      type: 'example',
      question: 'Find the vertex and x-intercepts of y = x² − 4x + 3.',
      steps: [
        'Complete the square: $y = (x-2)^2 - 4 + 3 = (x-2)^2 - 1$.',
        'Vertex: $(2, -1)$.',
        '$x$-intercepts: $(x-2)^2 = 1 \\Rightarrow x - 2 = \\pm 1 \\Rightarrow x = 3$ or $x = 1$.',
      ],
    },
    {
      type: 'example',
      question: 'Factorise y = x³ − 7x + 6 given x = 1 is a root.',
      steps: [
        'Since $x = 1$ is a root, $(x-1)$ is a factor.',
        'Perform polynomial division or inspection: $x^3 - 7x + 6 = (x-1)(x^2+x-6)$.',
        'Factorise the quadratic: $(x-1)(x-2)(x+3)$.',
      ],
    },
    {
      type: 'tip',
      body: 'The axis of symmetry of a parabola y = ax² + bx + c is x = −b/(2a). The vertex y-value is found by substituting this x back into the original equation — do not confuse this with the discriminant formula.',
    },
  ],

  // ── Adv L1 S4: Reciprocal, Piecewise, Absolute Value and Variation ─────────
  'y11-adv-l1-s4': [
    {
      type: 'text',
      body: 'Beyond polynomials lie several important function types. The reciprocal function y = k/x forms a hyperbola with asymptotes on both axes. Absolute value functions produce V-shaped graphs. Piecewise functions are defined by different rules over different intervals. Variation describes proportional relationships between quantities.',
    },
    {
      type: 'rules',
      heading: 'Reciprocal function y = k/x',
      items: [
        'Vertical asymptote at $x = 0$; horizontal asymptote at $y = 0$.',
        'Graph lies in quadrants 1 and 3 if $k > 0$; in 2 and 4 if $k < 0$.',
        'Domain: $x \\neq 0$; Range: $y \\neq 0$.',
        'The general hyperbola $y = k/(x-a) + b$ has asymptotes $x = a$ and $y = b$.',
      ],
    },
    {
      type: 'rules',
      heading: 'Absolute value',
      items: [
        '$|x| = x$ if $x \\geq 0$; $|x| = -x$ if $x < 0$.',
        '$y = |f(x)|$: reflect any portion of $y = f(x)$ that is below the $x$-axis upward.',
        '$|x - a| = b \\Rightarrow x = a + b$ or $x = a - b$.',
        '$|x - a| \\leq b \\Rightarrow a - b \\leq x \\leq a + b$.',
      ],
    },
    {
      type: 'rules',
      heading: 'Variation',
      items: [
        'Direct variation: $y = kx$ (y varies directly as x)',
        'Inverse variation: $y = k/x$ (y varies inversely as x)',
        'Joint variation: $y = kxz$ (y varies jointly as x and z)',
        'Find $k$ (the constant of variation) by substituting a known pair $(x, y)$.',
      ],
    },
    {
      type: 'example',
      question: 'y varies inversely as x, and y = 6 when x = 4. Find y when x = 3.',
      steps: [
        '$y = k/x \\Rightarrow 6 = k/4 \\Rightarrow k = 24$.',
        '$y = 24/x$.',
        'When $x = 3$: $y = 24/3 = 8$.',
      ],
    },
    {
      type: 'example',
      question: 'Sketch y = |2x − 4|.',
      steps: [
        'Find zero of $2x - 4 = 0 \\Rightarrow x = 2$.',
        'For $x \\geq 2$: $y = 2x - 4$ (line with gradient 2).',
        'For $x < 2$: $y = -(2x-4) = -2x+4$ (line with gradient $-2$).',
        'V-shape with vertex at $(2, 0)$, y-intercept at $(0, 4)$.',
      ],
    },
    {
      type: 'tip',
      body: 'To solve |expression| = c, set up two cases: expression = c AND expression = −c. For inequalities |expression| < c, the solution is a single interval between the two case solutions.',
    },
  ],

  // ── Adv L1 S5: Circles and Graph Transformations ──────────────────────────
  'y11-adv-l1-s5': [
    {
      type: 'text',
      body: 'A circle is a locus of points equidistant from a centre. Its equation in standard form uses completing the square. Graph transformations — translations, reflections, and dilations — apply to all function families and are described systematically by replacing x or y with shifted or scaled versions.',
    },
    {
      type: 'formula',
      latex: '(x - h)^2 + (y - k)^2 = r^2',
      label: 'Circle with centre (h, k) and radius r',
    },
    {
      type: 'steps',
      heading: 'Converting a circle from general to standard form',
      items: [
        'Group $x$ terms and $y$ terms.',
        'Complete the square for $x$: add $(b/2)^2$ to both sides.',
        'Complete the square for $y$: add $(d/2)^2$ to both sides.',
        'Rewrite in the form $(x-h)^2 + (y-k)^2 = r^2$.',
        'Read off centre $(h, k)$ and radius $r = \\sqrt{\\text{RHS}}$.',
      ],
    },
    {
      type: 'rules',
      heading: 'Summary of graph transformations for y = f(x)',
      items: [
        '$y = f(x) + c$: translate up $c$ (down if $c < 0$)',
        '$y = f(x - a)$: translate right $a$ (left if $a < 0$)',
        '$y = -f(x)$: reflect in the $x$-axis',
        '$y = f(-x)$: reflect in the $y$-axis',
        '$y = kf(x)$, $k > 0$: vertical dilation by factor $k$',
        '$y = f(kx)$, $k > 0$: horizontal dilation by factor $1/k$',
      ],
    },
    {
      type: 'example',
      question: 'Find the centre and radius of x² + y² − 6x + 4y − 3 = 0.',
      steps: [
        'Group: $(x^2 - 6x) + (y^2 + 4y) = 3$.',
        'Complete the square: $(x^2 - 6x + 9) + (y^2 + 4y + 4) = 3 + 9 + 4$.',
        '$(x-3)^2 + (y+2)^2 = 16$.',
        'Centre $(3, -2)$, radius $= 4$.',
      ],
    },
    {
      type: 'example',
      question: 'Describe the transformation from y = x² to y = −(x + 2)² + 5.',
      steps: [
        'The $-1$ multiplier: reflect in the $x$-axis.',
        '$(x+2)$: translate left 2.',
        '$+5$: translate up 5.',
        'Overall: reflect in $x$-axis, then translate 2 left and 5 up. Vertex moves from $(0,0)$ to $(-2, 5)$.',
      ],
    },
    {
      type: 'tip',
      body: 'When completing the square, remember to add the same amount to BOTH sides of the equation. A frequent error is adding it only to the left-hand side, which changes the circle you started with.',
    },
  ],

  // ── Adv L2 S1: Trigonometry of Acute Angles and Any Magnitude ─────────────
  'y11-adv-l2-s1': [
    {
      type: 'text',
      body: 'Trigonometry extends beyond right-angled triangles to any triangle and any angle. SOHCAHTOA applies to right-angled triangles; the Sine Rule and Cosine Rule apply to all triangles. Angles of any magnitude (including obtuse and reflex) are handled by placing them in the unit circle and using the ASTC rule to determine signs.',
    },
    {
      type: 'formula',
      latex: '\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}',
      label: 'Sine Rule',
    },
    {
      type: 'formula',
      latex: 'c^2 = a^2 + b^2 - 2ab\\cos C',
      label: 'Cosine Rule',
    },
    {
      type: 'formula',
      latex: 'A = \\tfrac{1}{2}ab\\sin C',
      label: 'Area of a triangle',
    },
    {
      type: 'rules',
      heading: 'ASTC rule for signs in each quadrant',
      items: [
        'Quadrant 1 (0°–90°): All ratios positive.',
        'Quadrant 2 (90°–180°): Sine positive only.',
        'Quadrant 3 (180°–270°): Tangent positive only.',
        'Quadrant 4 (270°–360°): Cosine positive only.',
        'Memory aid: All Students Take Calculus.',
      ],
    },
    {
      type: 'rules',
      heading: 'Reference angle identities',
      items: [
        '$\\sin(180° - \\theta) = \\sin\\theta$',
        '$\\cos(180° - \\theta) = -\\cos\\theta$',
        '$\\sin(180° + \\theta) = -\\sin\\theta$',
        '$\\cos(360° - \\theta) = \\cos\\theta$',
      ],
    },
    {
      type: 'example',
      question: 'In triangle ABC, a = 8, b = 11, C = 40°. Find side c.',
      steps: [
        '$c^2 = 8^2 + 11^2 - 2(8)(11)\\cos 40°$.',
        '$= 64 + 121 - 176 \\times 0.766 = 185 - 134.8 = 50.2$.',
        '$c = \\sqrt{50.2} \\approx 7.09$.',
      ],
    },
    {
      type: 'example',
      question: 'Find the exact value of sin 135°.',
      steps: [
        '$135° = 180° - 45°$, so it is in quadrant 2 where sine is positive.',
        '$\\sin 135° = \\sin 45° = \\dfrac{\\sqrt{2}}{2}$.',
      ],
    },
    {
      type: 'tip',
      body: 'The ambiguous case of the Sine Rule occurs when you know two sides and the angle opposite the shorter side — there may be two valid triangles. Always check whether 180° minus your angle still gives a valid triangle.',
    },
  ],

  // ── Adv L2 S2: Radians and Trigonometric Identities ───────────────────────
  'y11-adv-l2-s2': [
    {
      type: 'text',
      body: 'Radians are an alternative unit for measuring angles, directly related to arc length. One radian is the angle subtended by an arc equal in length to the radius. In higher mathematics (and all calculus applications), radians are the required unit. Trigonometric identities are equations true for all values — they allow simplification of complicated trig expressions.',
    },
    {
      type: 'formula',
      latex: '\\pi \\text{ rad} = 180°, \\quad 1 \\text{ rad} = \\frac{180°}{\\pi} \\approx 57.3°',
      label: 'Radian–degree conversion',
    },
    {
      type: 'formula',
      latex: 'l = r\\theta, \\quad A = \\tfrac{1}{2}r^2\\theta',
      label: 'Arc length l and sector area A (θ in radians)',
    },
    {
      type: 'rules',
      heading: 'Fundamental trigonometric identities',
      items: [
        'Pythagorean identity: $\\sin^2\\theta + \\cos^2\\theta = 1$',
        'Derived: $1 + \\tan^2\\theta = \\sec^2\\theta$',
        'Derived: $1 + \\cot^2\\theta = \\csc^2\\theta$',
        'Quotient identity: $\\tan\\theta = \\dfrac{\\sin\\theta}{\\cos\\theta}$',
        'Reciprocal identities: $\\sec\\theta = 1/\\cos\\theta$, $\\csc\\theta = 1/\\sin\\theta$, $\\cot\\theta = 1/\\tan\\theta$',
      ],
    },
    {
      type: 'example',
      question: 'A sector has radius 6 cm and angle 2π/3. Find the arc length and area.',
      steps: [
        '$l = r\\theta = 6 \\times \\dfrac{2\\pi}{3} = 4\\pi$ cm.',
        '$A = \\dfrac{1}{2}r^2\\theta = \\dfrac{1}{2} \\times 36 \\times \\dfrac{2\\pi}{3} = 12\\pi$ cm².',
      ],
    },
    {
      type: 'example',
      question: 'Prove that (1 − sin²θ) / cos θ = cos θ.',
      steps: [
        'LHS $= \\dfrac{1 - \\sin^2\\theta}{\\cos\\theta}$.',
        'Apply Pythagorean identity: $1 - \\sin^2\\theta = \\cos^2\\theta$.',
        '$= \\dfrac{\\cos^2\\theta}{\\cos\\theta} = \\cos\\theta$ = RHS. ✓',
      ],
    },
    {
      type: 'tip',
      body: 'To prove a trig identity, work on one side only (usually the more complex side) and manipulate it until it matches the other side. Never move terms across the equals sign — that assumes what you are trying to prove.',
    },
  ],

  // ── Adv L2 S3: Trigonometric Equations ────────────────────────────────────
  'y11-adv-l2-s3': [
    {
      type: 'text',
      body: 'Trigonometric equations have infinitely many solutions because trig functions are periodic. On an exam, solutions are required within a specified domain. The process is: find the reference angle, use ASTC to determine which quadrants apply, then list all solutions in the domain.',
    },
    {
      type: 'steps',
      heading: 'Solving a basic trig equation',
      items: [
        'Isolate the trig ratio (e.g. $\\sin x = \\tfrac{1}{2}$).',
        'Find the reference angle $\\alpha$ using the inverse trig key (always gives a 1st-quadrant angle).',
        'Apply ASTC to determine which quadrants the solution is in.',
        'List all solutions in the given domain using symmetry angles ($180°-\\alpha$, $180°+\\alpha$, $360°-\\alpha$, etc.).',
        'In radians, use $\\pi - \\alpha$, $\\pi + \\alpha$, $2\\pi - \\alpha$.',
      ],
    },
    {
      type: 'steps',
      heading: 'Equations of the form sin(bx + c) = k',
      items: [
        'Let $u = bx + c$ and state the new domain for $u$.',
        'Solve $\\sin u = k$ for all $u$ in the new domain.',
        'Recover $x$ from each solution: $x = (u - c)/b$.',
      ],
    },
    {
      type: 'example',
      question: 'Solve 2 cos x − 1 = 0 for 0 ≤ x ≤ 2π.',
      steps: [
        '$\\cos x = \\tfrac{1}{2}$.',
        'Reference angle: $\\alpha = \\pi/3$.',
        'Cosine is positive in Q1 and Q4.',
        '$x = \\dfrac{\\pi}{3}$ or $x = 2\\pi - \\dfrac{\\pi}{3} = \\dfrac{5\\pi}{3}$.',
      ],
    },
    {
      type: 'example',
      question: 'Solve sin(2x) = √3/2 for 0° ≤ x ≤ 360°.',
      steps: [
        'Let $u = 2x$; new domain: $0° \\leq u \\leq 720°$.',
        '$\\sin u = \\dfrac{\\sqrt{3}}{2}$, reference angle $60°$.',
        'Sine positive in Q1 and Q2: $u = 60°, 120°, 420°, 480°$.',
        '$x = u/2$: $x = 30°, 60°, 210°, 240°$.',
      ],
    },
    {
      type: 'tip',
      body: 'When the equation has 2x or 3x inside the trig function, always extend the domain by the same factor (domain of u is 2 × or 3 × the domain of x). Missing solutions because the domain was not extended is the most common error in this topic.',
    },
  ],

  // ── Adv L3 S1: Estimating Change and the Derivative ───────────────────────
  'y11-adv-l3-s1': [
    {
      type: 'text',
      body: 'Differentiation measures the instantaneous rate of change of a function. The derivative f ′(x) is defined as the limit of the average rate of change (the gradient of a chord) as the chord length shrinks to zero. Geometrically, f ′(x) is the gradient of the tangent line to y = f(x) at the point x.',
    },
    {
      type: 'formula',
      latex: 'f\'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}',
      label: 'Definition of the derivative (first principles)',
    },
    {
      type: 'steps',
      heading: 'Differentiating from first principles',
      items: [
        'Write $f(x+h)$ by substituting $x + h$ into the function.',
        'Form the difference quotient $\\dfrac{f(x+h) - f(x)}{h}$.',
        'Expand the numerator and simplify; factor out $h$.',
        'Cancel $h$ and take the limit as $h \\to 0$.',
      ],
    },
    {
      type: 'example',
      question: 'Differentiate f(x) = x² from first principles.',
      steps: [
        '$f(x+h) = (x+h)^2 = x^2 + 2xh + h^2$.',
        '$f(x+h) - f(x) = 2xh + h^2 = h(2x + h)$.',
        '$\\dfrac{f(x+h)-f(x)}{h} = 2x + h$.',
        '$\\lim_{h\\to 0}(2x + h) = 2x$.',
        'Therefore $f\'(x) = 2x$.',
      ],
    },
    {
      type: 'text',
      body: 'The gradient of the tangent at x = a is f ′(a). The equation of the tangent line there is y − f(a) = f ′(a)(x − a). The normal is perpendicular to the tangent, so it has gradient −1/f ′(a) (provided f ′(a) ≠ 0).',
    },
    {
      type: 'example',
      question: 'Find the equation of the tangent to y = x² at x = 3.',
      steps: [
        '$f(x) = x^2 \\Rightarrow f\'(x) = 2x$.',
        'Gradient at $x = 3$: $f\'(3) = 6$.',
        'Point: $(3,\\, 9)$.',
        'Tangent: $y - 9 = 6(x - 3) \\Rightarrow y = 6x - 9$.',
      ],
    },
    {
      type: 'tip',
      body: 'From first principles, the most common error is not factoring h out of the numerator before cancelling. If h does not cancel, you have made an algebra error — go back and re-expand f(x + h).',
    },
  ],

  // ── Adv L3 S2: Differentiation Rules ──────────────────────────────────────
  'y11-adv-l3-s2': [
    {
      type: 'text',
      body: 'In practice, we differentiate using rules rather than first principles every time. The power rule handles polynomials. The chain rule handles composite functions. The product and quotient rules handle products and quotients. Mastering these three rules allows differentiation of almost any expression you will encounter.',
    },
    {
      type: 'formula',
      latex: '\\frac{d}{dx}[x^n] = nx^{n-1}',
      label: 'Power rule',
    },
    {
      type: 'formula',
      latex: '\\frac{d}{dx}[f(g(x))] = f\'(g(x)) \\cdot g\'(x)',
      label: 'Chain rule',
    },
    {
      type: 'formula',
      latex: '\\frac{d}{dx}[uv] = u\'v + uv\'',
      label: 'Product rule',
    },
    {
      type: 'formula',
      latex: '\\frac{d}{dx}\\!\\left[\\frac{u}{v}\\right] = \\frac{u\'v - uv\'}{v^2}',
      label: 'Quotient rule',
    },
    {
      type: 'rules',
      heading: 'Additional rules',
      items: [
        '$\\dfrac{d}{dx}[c] = 0$ (constant)',
        '$\\dfrac{d}{dx}[cf(x)] = c f\'(x)$ (constant multiple)',
        '$\\dfrac{d}{dx}[f \\pm g] = f\' \\pm g\'$ (sum/difference)',
      ],
    },
    {
      type: 'example',
      question: 'Differentiate y = (3x² + 1)⁵.',
      steps: [
        'Let $u = 3x^2 + 1$, so $y = u^5$.',
        '$\\dfrac{du}{dx} = 6x$, $\\dfrac{dy}{du} = 5u^4$.',
        'Chain rule: $\\dfrac{dy}{dx} = 5u^4 \\times 6x = 30x(3x^2+1)^4$.',
      ],
    },
    {
      type: 'example',
      question: 'Differentiate y = x² sin x.',
      steps: [
        'Let $u = x^2$, $v = \\sin x$.',
        '$u\' = 2x$, $v\' = \\cos x$.',
        '$y\' = 2x \\sin x + x^2 \\cos x$.',
      ],
    },
    {
      type: 'tip',
      body: 'For the chain rule, identify the "outer" and "inner" functions clearly. Differentiate the outer function (keeping the inner unchanged), then multiply by the derivative of the inner function.',
    },
  ],

  // ── Adv L3 S3: Graphical Applications of the Derivative ───────────────────
  'y11-adv-l3-s3': [
    {
      type: 'text',
      body: 'Derivatives reveal the geometric properties of graphs. Positive f ′(x) means increasing; negative means decreasing. Stationary points occur where f ′(x) = 0. The second derivative f ″(x) tells us about concavity — whether the curve is bending upward (concave up) or downward (concave down). Points where concavity changes are inflection points.',
    },
    {
      type: 'rules',
      heading: 'Using the first derivative',
      items: [
        '$f\'(x) > 0$: function is increasing.',
        '$f\'(x) < 0$: function is decreasing.',
        '$f\'(x) = 0$: stationary point (could be max, min, or inflection).',
      ],
    },
    {
      type: 'rules',
      heading: 'Classifying stationary points',
      items: [
        'First derivative test: examine the sign of $f\'$ either side of the stationary point.',
        '+ to − (left to right): local maximum.',
        '− to + (left to right): local minimum.',
        'No sign change: horizontal inflection point.',
        'Second derivative test: if $f\'(a) = 0$, then $f\'\'(a) > 0$ ⟹ local min; $f\'\'(a) < 0$ ⟹ local max.',
      ],
    },
    {
      type: 'rules',
      heading: 'Concavity and inflection',
      items: [
        '$f\'\'(x) > 0$: concave up (curve bends upward, like a cup).',
        '$f\'\'(x) < 0$: concave down (curve bends downward, like a cap).',
        'Inflection point: $f\'\'(x) = 0$ AND $f\'\'$ changes sign.',
      ],
    },
    {
      type: 'example',
      question: 'For f(x) = x³ − 3x, find stationary points and classify them.',
      steps: [
        '$f\'(x) = 3x^2 - 3 = 3(x^2-1) = 3(x-1)(x+1)$.',
        'Stationary points at $x = 1$ and $x = -1$.',
        '$f\'\'(x) = 6x$.',
        'At $x = 1$: $f\'\'(1) = 6 > 0$ → local minimum; $f(1) = 1 - 3 = -2$. Point: $(1, -2)$.',
        'At $x = -1$: $f\'\'(-1) = -6 < 0$ → local maximum; $f(-1) = -1 + 3 = 2$. Point: $(-1, 2)$.',
      ],
    },
    {
      type: 'tip',
      body: 'If the second derivative test is inconclusive (f ″(a) = 0), always use a sign table for f ′ to classify the stationary point. Never leave it unclassified — the examiner expects a definitive answer.',
    },
  ],

  // ── Adv L3 S4: The Derivative as a Rate of Change ─────────────────────────
  'y11-adv-l3-s4': [
    {
      type: 'text',
      body: 'The derivative is most powerfully interpreted as a rate of change. In motion problems, position s(t) gives displacement; s ′(t) = v(t) is velocity; v ′(t) = a(t) is acceleration. Positive velocity means moving in the positive direction; negative velocity means moving in the negative direction. Speed is |v(t)|.',
    },
    {
      type: 'rules',
      heading: 'Motion vocabulary',
      items: [
        'Displacement $s(t)$: position relative to a reference point.',
        'Velocity $v(t) = s\'(t)$: rate of change of displacement.',
        'Acceleration $a(t) = v\'(t) = s\'\'(t)$: rate of change of velocity.',
        'Speed $= |v(t)|$ (always non-negative).',
        'Particle at rest when $v(t) = 0$.',
        'Particle changes direction when $v(t)$ changes sign.',
      ],
    },
    {
      type: 'steps',
      heading: 'Solving a motion problem',
      items: [
        'Write down $s(t)$, then differentiate to find $v(t)$.',
        'Differentiate again to find $a(t)$.',
        'Solve $v(t) = 0$ to find when the particle is at rest or changes direction.',
        'Substitute into $s(t)$ to find positions at those times.',
        'Sketch the displacement–time graph if required.',
      ],
    },
    {
      type: 'example',
      question: 'A particle has displacement s = t³ − 6t² + 9t (t ≥ 0, metres, seconds). Find velocity and acceleration at t = 1, and determine when the particle is at rest.',
      steps: [
        '$v(t) = 3t^2 - 12t + 9$.',
        '$a(t) = 6t - 12$.',
        'At $t = 1$: $v = 3 - 12 + 9 = 0$ m/s; $a = 6 - 12 = -6$ m/s².',
        'Particle at rest when $v = 0$: $3(t^2 - 4t + 3) = 0 \\Rightarrow t = 1$ or $t = 3$.',
      ],
    },
    {
      type: 'tip',
      body: 'Total distance travelled is NOT the same as displacement. To find total distance, split the time interval at each t where v = 0, find displacement over each sub-interval, and add the absolute values.',
    },
  ],

  // ── Adv L4 S1: Exponential Functions ──────────────────────────────────────
  'y11-adv-l4-s1': [
    {
      type: 'text',
      body: 'Exponential functions have the variable in the exponent: y = aˣ. They model growth (a > 1) and decay (0 < a < 1). The special base e ≈ 2.718 is the natural exponential base, chosen because it has the elegant property that the derivative of eˣ is eˣ itself. All exponential functions can be rewritten in base e.',
    },
    {
      type: 'formula',
      latex: 'y = e^x, \\quad \\frac{d}{dx}[e^x] = e^x',
      label: 'The natural exponential and its derivative',
    },
    {
      type: 'rules',
      heading: 'Properties of exponential functions y = aˣ (a > 0, a ≠ 1)',
      items: [
        'Domain: all real $x$; Range: $y > 0$.',
        'y-intercept at $(0, 1)$ for all bases.',
        'Horizontal asymptote: $y = 0$.',
        'If $a > 1$: increasing function (growth).',
        'If $0 < a < 1$: decreasing function (decay).',
        '$a^x$ and $\\log_a x$ are inverse functions.',
      ],
    },
    {
      type: 'steps',
      heading: 'Solving exponential equations',
      items: [
        'If both sides have the same base, equate exponents directly.',
        'If not, take logarithms of both sides: $\\ln(a^x) = x\\ln a$.',
        'Solve the resulting linear (or quadratic) equation.',
        'Alternatively, let $u = a^x$ to convert to a polynomial equation.',
      ],
    },
    {
      type: 'example',
      question: 'Solve 3^(2x−1) = 27.',
      steps: [
        'Write $27 = 3^3$.',
        '$3^{2x-1} = 3^3 \\Rightarrow 2x - 1 = 3$.',
        '$2x = 4 \\Rightarrow x = 2$.',
      ],
    },
    {
      type: 'example',
      question: 'Solve 2^x = 7 correct to 3 decimal places.',
      steps: [
        'Take natural log: $x \\ln 2 = \\ln 7$.',
        '$x = \\dfrac{\\ln 7}{\\ln 2} = \\dfrac{1.9459}{0.6931} \\approx 2.807$.',
      ],
    },
    {
      type: 'tip',
      body: 'The number e is irrational (≈ 2.71828). Never approximate e as a fraction in exact answers. When a question says "exact answer", leave e in your expression — only evaluate numerically when asked for a decimal.',
    },
  ],

  // ── Adv L4 S2: Logarithmic Functions ──────────────────────────────────────
  'y11-adv-l4-s2': [
    {
      type: 'text',
      body: 'Logarithms are the inverse of exponential functions: log_a(y) = x means aˣ = y. The natural logarithm ln x = log_e x is the most important for calculus. The log laws allow logarithms of products, quotients, and powers to be broken apart — essential for solving equations and simplifying expressions.',
    },
    {
      type: 'formula',
      latex: 'y = \\log_a x \\iff a^y = x \\quad (a > 0,\\; a \\neq 1,\\; x > 0)',
      label: 'Definition of logarithm',
    },
    {
      type: 'rules',
      heading: 'Laws of logarithms',
      items: [
        '$\\log_a(mn) = \\log_a m + \\log_a n$',
        '$\\log_a\\!\\left(\\dfrac{m}{n}\\right) = \\log_a m - \\log_a n$',
        '$\\log_a(m^p) = p\\log_a m$',
        '$\\log_a 1 = 0$',
        '$\\log_a a = 1$',
        'Change of base: $\\log_a m = \\dfrac{\\ln m}{\\ln a}$',
      ],
    },
    {
      type: 'rules',
      heading: 'Properties of y = log_a x (a > 1)',
      items: [
        'Domain: $x > 0$; Range: all real $y$.',
        '$x$-intercept at $(1, 0)$.',
        'Vertical asymptote at $x = 0$.',
        'Increasing function (if $a > 1$).',
        'Inverse of $y = a^x$ — graphs are reflections in $y = x$.',
      ],
    },
    {
      type: 'example',
      question: 'Solve log₂(x + 1) + log₂(x − 1) = 3.',
      steps: [
        'Combine: $\\log_2[(x+1)(x-1)] = 3$.',
        '$\\log_2(x^2 - 1) = 3 \\Rightarrow x^2 - 1 = 2^3 = 8$.',
        '$x^2 = 9 \\Rightarrow x = \\pm 3$.',
        'Check: $x > 1$ required (argument of log must be positive): reject $x = -3$.',
        'Solution: $x = 3$.',
      ],
    },
    {
      type: 'example',
      question: 'Express log₃ 7 as a decimal using the change-of-base formula.',
      steps: [
        '$\\log_3 7 = \\dfrac{\\ln 7}{\\ln 3} = \\dfrac{1.9459}{1.0986} \\approx 1.771$.',
      ],
    },
    {
      type: 'tip',
      body: 'After solving a logarithmic equation, always check that each solution makes the original argument positive — negative or zero values inside a logarithm are undefined and must be rejected.',
    },
  ],

  // ── Adv L5 S1: Sets, Probability and Conditional Probability ──────────────
  'y11-adv-l5-s1': [
    {
      type: 'text',
      body: 'Probability quantifies uncertainty. Events are subsets of the sample space; set operations (union, intersection, complement) correspond to probability rules. Conditional probability P(A|B) is the probability of A given that B has occurred — the sample space is restricted to B. Independence means knowing B does not change the probability of A.',
    },
    {
      type: 'formula',
      latex: 'P(A \\cup B) = P(A) + P(B) - P(A \\cap B)',
      label: 'Addition rule',
    },
    {
      type: 'formula',
      latex: 'P(A\\mid B) = \\frac{P(A \\cap B)}{P(B)}, \\quad P(B) > 0',
      label: 'Conditional probability',
    },
    {
      type: 'formula',
      latex: 'P(A \\cap B) = P(A)\\cdot P(B\\mid A) = P(B)\\cdot P(A\\mid B)',
      label: 'Multiplication rule',
    },
    {
      type: 'rules',
      heading: 'Independence',
      items: [
        'A and B are independent if $P(A \\cap B) = P(A) \\times P(B)$.',
        'Equivalently: $P(A \\mid B) = P(A)$ (knowledge of $B$ does not affect $A$).',
        'Independent events are NOT the same as mutually exclusive events.',
        'Mutually exclusive: $P(A \\cap B) = 0$; if both have positive probability, they cannot be independent.',
      ],
    },
    {
      type: 'example',
      question: 'P(A) = 0.4, P(B) = 0.5, P(A ∩ B) = 0.2. Find P(A ∪ B) and P(A | B).',
      steps: [
        '$P(A \\cup B) = 0.4 + 0.5 - 0.2 = 0.7$.',
        '$P(A \\mid B) = \\dfrac{P(A \\cap B)}{P(B)} = \\dfrac{0.2}{0.5} = 0.4$.',
        'Note: $P(A\\mid B) = P(A) = 0.4$, so A and B are independent.',
      ],
    },
    {
      type: 'example',
      question: 'A bag has 3 red and 5 blue balls. Two are drawn without replacement. Find P(both red).',
      steps: [
        '$P(\\text{1st red}) = 3/8$.',
        '$P(\\text{2nd red} \\mid \\text{1st red}) = 2/7$ (only 7 balls remain, 2 red).',
        '$P(\\text{both red}) = \\dfrac{3}{8} \\times \\dfrac{2}{7} = \\dfrac{6}{56} = \\dfrac{3}{28}$.',
      ],
    },
    {
      type: 'tip',
      body: 'Without replacement means the probability changes for each draw — use conditional probability. With replacement means probabilities stay the same — multiply independent probabilities. Always check whether the question says "with" or "without" replacement.',
    },
  ],

  // ── Adv L5 S2: Discrete Probability Distributions and Data ────────────────
  'y11-adv-l5-s2': [
    {
      type: 'text',
      body: 'A discrete probability distribution lists all possible values of a random variable and their probabilities. The expected value (mean) is the long-run average outcome. The variance and standard deviation measure how spread out the outcomes are. Comparing distributions requires looking at both centre and spread.',
    },
    {
      type: 'formula',
      latex: 'E(X) = \\mu = \\sum x \\cdot P(X = x)',
      label: 'Expected value',
    },
    {
      type: 'formula',
      latex: '\\text{Var}(X) = \\sigma^2 = \\sum (x - \\mu)^2 P(X = x) = E(X^2) - [E(X)]^2',
      label: 'Variance',
    },
    {
      type: 'rules',
      heading: 'Requirements for a valid probability distribution',
      items: [
        'Each probability $P(X = x) \\geq 0$.',
        'All probabilities sum to 1: $\\sum P(X = x) = 1$.',
        'The distribution table must account for every possible outcome.',
      ],
    },
    {
      type: 'rules',
      heading: 'Linear transformation rules',
      items: [
        '$E(aX + b) = a\\,E(X) + b$',
        '$\\text{Var}(aX + b) = a^2\\,\\text{Var}(X)$',
        '$\\text{SD}(aX + b) = |a|\\,\\text{SD}(X)$',
      ],
    },
    {
      type: 'example',
      question: 'A die is biased: P(1) = 0.1, P(2) = 0.1, P(3) = 0.2, P(4) = 0.2, P(5) = 0.2, P(6) = 0.2. Find E(X) and Var(X).',
      steps: [
        '$E(X) = 1(0.1)+2(0.1)+3(0.2)+4(0.2)+5(0.2)+6(0.2)$',
        '$= 0.1+0.2+0.6+0.8+1.0+1.2 = 3.9$.',
        '$E(X^2) = 1(0.1)+4(0.1)+9(0.2)+16(0.2)+25(0.2)+36(0.2)$',
        '$= 0.1+0.4+1.8+3.2+5.0+7.2 = 17.7$.',
        '$\\text{Var}(X) = 17.7 - 3.9^2 = 17.7 - 15.21 = 2.49$.',
      ],
    },
    {
      type: 'example',
      question: 'If E(X) = 5 and Var(X) = 4, find E(3X − 2) and SD(3X − 2).',
      steps: [
        '$E(3X-2) = 3 \\times 5 - 2 = 13$.',
        '$\\text{Var}(3X-2) = 3^2 \\times 4 = 36$.',
        '$\\text{SD}(3X-2) = \\sqrt{36} = 6$.',
      ],
    },
    {
      type: 'tip',
      body: 'The variance formula E(X²) − [E(X)]² is faster in calculations. Compute E(X²) by summing x²·P(X=x) over all x, then subtract the square of E(X). Never confuse E(X²) with [E(X)]² — they are different quantities.',
    },
  ],
}
