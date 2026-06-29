/**
 * Maps every stageId → YouTube video ID (Eddie Woo / quality NSW math channels).
 * All IDs aligned to current curriculum.ts stage IDs.
 */
export const STAGE_VIDEOS: Record<string, string> = {

  // ─── Year 9 (Stage 5 Core) ────────────────────────────────────────────────
  'y9-l1-s1': 'n2XYXPNHC4E',   // Earning Money — wages, salary, tax (Eddie Woo)
  'y9-l1-s2': 'n2XYXPNHC4E',   // Simple Interest — I=Prt (Eddie Woo)
  'y9-l2-s1': '2JCu_WS30Xk',   // Scientific Notation (Eddie Woo)
  'y9-l2-s2': '2JCu_WS30Xk',   // Significant Figures and Error
  'y9-l3-s1': 'aI9fAobtplA',   // Algebraic Techniques A — expand/simplify
  'y9-l3-s2': '2JCu_WS30Xk',   // Indices A — index laws
  'y9-l4-s1': 'E0j5f8BMUZY',   // Equations A — linear equations
  'y9-l5-s1': 'YuHEpPpGHR4',   // Linear Relationships A — distance/midpoint/gradient
  'y9-l5-s2': 'YuHEpPpGHR4',   // Linear Relationships B — y=mx+b, parallel/perp
  'y9-l6-s1': '7fpKpShCeN8',   // Non-Linear Relationships A — parabolas/exponentials
  'y9-l6-s2': '7fpKpShCeN8',   // Non-Linear Relationships B — sketch parabolas
  'y9-l7-s1': '2RnOMLpXGUE',   // Area and Surface Area A — composite shapes, cylinders
  'y9-l7-s2': '2RnOMLpXGUE',   // Volume A — prisms and cylinders
  'y9-l8-s1': 'pJPMCcWDluY',   // Trigonometry A — SOH CAH TOA
  'y9-l8-s2': 'pJPMCcWDluY',   // Trigonometry B — elevation/depression/bearings
  'y9-l9-s1': 'KElPWKFYVRM',   // Properties of Geometrical Figures A — similarity
  'y9-l10-s1': 'XciN7hTtIRM',  // Data Analysis A — std deviation, box plots
  'y9-l10-s2': 'XciN7hTtIRM',  // Data Analysis B — scatter plots, correlation
  'y9-l10-s3': 'uzkc-qNVoOk',  // Probability A — tree diagrams, multi-stage

  // ─── Year 10 (Stage 5 Path) ───────────────────────────────────────────────
  'y10-l1-s1': 'n2XYXPNHC4E',  // Compound Interest and Depreciation A=P(1+r)^n
  'y10-l2-s1': 'RyfOdNjZlkw',  // Algebraic Techniques B — HCF, FOIL, monic quadratics
  'y10-l2-s2': 'RyfOdNjZlkw',  // Algebraic Techniques C — DOTS, perfect sq, non-monic
  'y10-l2-s3': '2JCu_WS30Xk',  // Indices B — negative indices in algebra
  'y10-l2-s4': '6QF-7OFMWRc',  // Indices C — surds, fractional indices
  'y10-l3-s1': 'E0j5f8BMUZY',  // Equations B — monic quadratics, cubics, inequalities
  'y10-l3-s2': 'E0j5f8BMUZY',  // Equations C — literal, non-monic quadratic formula, simultaneous
  'y10-l4-s1': 'YuHEpPpGHR4',  // Linear Relationships C — coordinate geometry
  'y10-l4-s2': '7fpKpShCeN8',  // Non-Linear Relationships C — transformations, circles
  'y10-l4-s3': 'vRBHZMxwhf4',  // Functions and Other Graphs — f(x), domain/range
  'y10-l5-s1': 'jh0SRxKi5gM',  // Polynomials — long division, remainder/factor theorems
  'y10-l5-s2': 'ntBWrcbAhaY',  // Logarithms — log laws, change of base
  'y10-l6-s1': 'YuHEpPpGHR4',  // Variation A — direct y=kx, inverse y=k/x
  'y10-l6-s2': 'YuHEpPpGHR4',  // Variation B — rates of change from graphs
  'y10-l7-s1': 'DEapEOdZJbQ',  // Trigonometry C — 3D right-angled triangle problems
  'y10-l7-s2': 'DEapEOdZJbQ',  // Trigonometry D — sine rule, cosine rule, area
  'y10-l8-s1': '2RnOMLpXGUE',  // Area and Surface Area B — pyramids, cones, spheres
  'y10-l8-s2': '2RnOMLpXGUE',  // Volume B — pyramids, cones, spheres
  'y10-l9-s1': 'KElPWKFYVRM',  // Properties of Geometrical Figures B — congruence/similarity
  'y10-l9-s2': 'KElPWKFYVRM',  // Properties of Geometrical Figures C — formal proofs
  'y10-l9-s3': 'AA6RfgP-AHU',  // Circle Geometry — all 7 theorems
  'y10-l10-s1': 'phrTvN4THBI', // Introduction to Networks — Euler trails/circuits
  'y10-l10-s2': 'XciN7hTtIRM', // Data Analysis C — statistical inquiry
  'y10-l10-s3': 'uzkc-qNVoOk', // Probability B — Venn diagrams, conditional probability

  // ─── Year 11 Standard ─────────────────────────────────────────────────────
  'y11-std-l1-s1': 'E0j5f8BMUZY',  // Formulae and Equations
  'y11-std-l1-s2': 'YuHEpPpGHR4',  // Linear Relationships
  'y11-std-l2-s1': 'n2XYXPNHC4E',  // Earning Money
  'y11-std-l2-s2': 'n2XYXPNHC4E',  // Managing Money — simple/compound interest
  'y11-std-l3-s1': '2RnOMLpXGUE',  // Applications of Measurement
  'y11-std-l3-s2': 'n2XYXPNHC4E',  // Time and Location
  'y11-std-l4-s1': 'phrTvN4THBI',  // Networks, Paths and Trees
  'y11-std-l5-s1': 'XciN7hTtIRM',  // Data Analysis

  // ─── Year 11 Advanced ─────────────────────────────────────────────────────
  'y11-adv-l1-s1': 'RyfOdNjZlkw',  // Algebraic Techniques
  'y11-adv-l1-s2': 'vRBHZMxwhf4',  // Introduction to Functions
  'y11-adv-l1-s3': '7fpKpShCeN8',  // Linear, Quadratic and Cubic Functions
  'y11-adv-l1-s4': '7OstCuWfV9A',  // Reciprocal, Piecewise, Absolute Value, Variation
  'y11-adv-l1-s5': 'cWc1ADDds8Y',  // Circles and Graph Transformations
  'y11-adv-l2-s1': 'pJPMCcWDluY',  // Trigonometry of Acute Angles and Any Magnitude
  'y11-adv-l2-s2': 'DEapEOdZJbQ',  // Radians and Trigonometric Identities
  'y11-adv-l2-s3': 'DEapEOdZJbQ',  // Trigonometric Equations
  'y11-adv-l3-s1': 'ILRrqghJzdE',  // Estimating Change and the Derivative
  'y11-adv-l3-s2': 'ILRrqghJzdE',  // Differentiation Rules
  'y11-adv-l3-s3': 'ILRrqghJzdE',  // Graphical Applications of the Derivative
  'y11-adv-l3-s4': 'ILRrqghJzdE',  // The Derivative as a Rate of Change
  'y11-adv-l4-s1': '7OstCuWfV9A',  // Exponential Functions
  'y11-adv-l4-s2': 'ntBWrcbAhaY',  // Logarithmic Functions
  'y11-adv-l5-s1': 'uzkc-qNVoOk',  // Sets, Probability and Conditional Probability
  'y11-adv-l5-s2': 'XciN7hTtIRM',  // Discrete Probability Distributions and Data

  // ─── Year 11 Extension 1 ──────────────────────────────────────────────────
  'y11-ext1-l1-s1': 'vRBHZMxwhf4',  // Graphical Relationships
  'y11-ext1-l1-s2': 'vRBHZMxwhf4',  // Inverse Functions
  'y11-ext1-l1-s3': 'cWc1ADDds8Y',  // Parametric Form
  'y11-ext1-l1-s4': 'E0j5f8BMUZY',  // Inequalities
  'y11-ext1-l2-s1': 'jh0SRxKi5gM',  // Language, Notation and Graphs of Polynomials
  'y11-ext1-l2-s2': 'jh0SRxKi5gM',  // Division and Remainder Theorem
  'y11-ext1-l2-s3': 'jh0SRxKi5gM',  // Sums and Products of Roots
  'y11-ext1-l3-s1': 'DEapEOdZJbQ',  // Trigonometry in 3D
  'y11-ext1-l3-s2': 'DEapEOdZJbQ',  // Further Trigonometric Identities
  'y11-ext1-l3-s3': 'DEapEOdZJbQ',  // Further Trigonometric Equations
  'y11-ext1-l4-s1': 'Ul4nl1S968E',  // Counting Techniques
  'y11-ext1-l4-s2': 'Ul4nl1S968E',  // Permutations and Combinations
  'y11-ext1-l5-s1': 'JVbbRCVBVRI',  // Binomial Expansions and Pascal's Triangle
  'y11-ext1-l5-s2': 'JVbbRCVBVRI',  // The Binomial Theorem and General Term

  // ─── Year 11 Extension 2 (placeholder — no Y11 Ext2 in NESA) ─────────────
  'y11-ext2-l1-s1': 'ILRrqghJzdE',

  // ─── Year 12 Advanced ─────────────────────────────────────────────────────
  'y12-adv-l1-s1': 'cWc1ADDds8Y',   // Further Graph Transformations
  'y12-adv-l1-s2': '5-sdU476MLA',   // Transformations of Trig Functions
  'y12-adv-l1-s3': 'YuHEpPpGHR4',  // Modelling with Functions
  'y12-adv-l2-s1': 'ILRrqghJzdE',  // Differentiation — chain/product/quotient rules + exp/log/trig
  'y12-adv-l2-s2': 'ILRrqghJzdE',  // Curve Sketching and Optimisation
  'y12-adv-l3-s1': 'K9q0E5ysDnw',  // Primitive Functions and the Definite Integral
  'y12-adv-l3-s2': 'K9q0E5ysDnw',  // Integration with Exp, Log and Trig
  'y12-adv-l3-s3': 'K9q0E5ysDnw',  // Areas Under and Between Curves
  'y12-adv-l4-s1': 'ILRrqghJzdE',  // Rates of Change and Related Rates
  'y12-adv-l5-s1': 'n2XYXPNHC4E',  // Arithmetic Sequences and Series
  'y12-adv-l5-s2': 'n2XYXPNHC4E',  // Geometric Sequences and Series
  'y12-adv-l6-s1': 'XciN7hTtIRM',  // Discrete and Continuous Random Variables
  'y12-adv-l6-s2': 'XciN7hTtIRM',  // The Normal Distribution
  'y12-adv-l7-s1': 'n2XYXPNHC4E',  // Reducing Balance Loans
  'y12-adv-l7-s2': 'n2XYXPNHC4E',  // Annuities

  // ─── Year 12 Extension 1 ──────────────────────────────────────────────────
  'y12-ext1-l1-s1': 'ILRrqghJzdE',  // Proof by Mathematical Induction
  'y12-ext1-l2-s1': 'tt2DGYOi3hc',  // Vector Representation and Operations
  'y12-ext1-l2-s2': 'tt2DGYOi3hc',  // Dot Product and Projections
  'y12-ext1-l2-s3': '_8ObUA1e61w',  // Projectile Motion
  'y12-ext1-l3-s1': 'M7F290AwLz4',  // Inverse Trig Definitions and Graphs
  'y12-ext1-l4-s1': 'ILRrqghJzdE',  // Further Differentiation Techniques
  'y12-ext1-l4-s2': 'K9q0E5ysDnw',  // Techniques of Integration
  'y12-ext1-l4-s3': 'K9q0E5ysDnw',  // Further Applications of Calculus
  'y12-ext1-l5-s1': 'c8W9_iaERnU',  // Binomial Distributions

  // ─── Year 12 Standard ─────────────────────────────────────────────────────
  'y12-std-l1-s1': 'E0j5f8BMUZY',   // Algebraic Relationships
  'y12-std-l2-s1': 'n2XYXPNHC4E',   // Investment and Loans
  'y12-std-l2-s2': 'n2XYXPNHC4E',   // Annuities
  'y12-std-l3-s1': 'DEapEOdZJbQ',   // Non-Right-Angled Trigonometry
  'y12-std-l3-s2': 'YuHEpPpGHR4',   // Rates and Ratios
  'y12-std-l4-s1': 'phrTvN4THBI',   // Network Flow
  'y12-std-l4-s2': 'phrTvN4THBI',   // Critical Path Analysis
  'y12-std-l5-s1': 'XciN7hTtIRM',   // Bivariate Data Analysis
  'y12-std-l5-s2': 'uzkc-qNVoOk',   // Relative Frequency and Probability
  'y12-std-l5-s3': 'XciN7hTtIRM',   // The Normal Distribution

  // ─── Year 12 Extension 2 ──────────────────────────────────────────────────
  'y12-ext2-l1-s1': 'RaoahH5O11w',  // Types of Proof
  'y12-ext2-l1-s2': 'ILRrqghJzdE',  // Proof by Mathematical Induction
  'y12-ext2-l1-s3': 'RaoahH5O11w',  // Inequalities and Further Proofs
  'y12-ext2-l2-s1': 'tt2DGYOi3hc',  // Vectors in 2D and 3D
  'y12-ext2-l2-s2': 'tt2DGYOi3hc',  // Vector Equations of Lines and Planes
  'y12-ext2-l2-s3': 'tt2DGYOi3hc',  // Geometric Proofs with Vectors
  'y12-ext2-l3-s1': 'c8W9_iaERnU',  // Arithmetic and the Argand Diagram
  'y12-ext2-l3-s2': 'c8W9_iaERnU',  // Modulus-Argument and Polar Form
  'y12-ext2-l3-s3': 'YVzvK7Slq-Q',  // De Moivre's Theorem and Roots
  'y12-ext2-l3-s4': 'YVzvK7Slq-Q',  // Curves and Loci on the Argand Diagram
  'y12-ext2-l4-s1': 'K9q0E5ysDnw',  // Integration by Parts and Substitution
  'y12-ext2-l4-s2': 'K9q0E5ysDnw',  // Partial Fractions and Trig Substitutions
  'y12-ext2-l4-s3': 'K9q0E5ysDnw',  // Volumes of Solids of Revolution
  'y12-ext2-l5-s1': '_8ObUA1e61w',  // Motion and Forces
  'y12-ext2-l5-s2': '_8ObUA1e61w',  // Simple Harmonic Motion
  'y12-ext2-l5-s3': '_8ObUA1e61w',  // Projectile Motion and Resisted Motion
}
