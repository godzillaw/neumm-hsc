/**
 * Maps every stageId → YouTube video ID (Eddie Woo / verified quality math channels).
 * Keeps curriculum.ts clean — video IDs live here, not scattered through 375 stage definitions.
 */
export const STAGE_VIDEOS: Record<string, string> = {
  // ─── Year 9 ───────────────────────────────────────────────────────────────
  // Algebra
  'y9-l1-s1': 'MlZCiiMkk3c',   // Reviewing Algebra - Eddie Woo
  'y9-l1-s2': 'aI9fAobtplA',   // Expanding Expressions
  'y9-l1-s3': 'RyfOdNjZlkw',   // Factorising HCF
  'y9-l1-s4': 'RyfOdNjZlkw',   // DOTS
  'y9-l1-s5': 'RyfOdNjZlkw',   // Factorising Trinomials
  'y9-l1-s6': 'aI9fAobtplA',   // Algebraic Fractions
  // Equations & Inequalities
  'y9-l2-s1': 'E0j5f8BMUZY',   // Linear Equations
  'y9-l2-s2': 'RyfOdNjZlkw',   // Quadratic Equations
  'y9-l2-s3': 'QVjBbzRdkA4',   // Simultaneous Equations
  'y9-l2-s4': 'E0j5f8BMUZY',   // Using Graphs
  'y9-l2-s5': 'E0j5f8BMUZY',   // Linear Inequalities
  // Measurement
  'y9-l3-s1': 'AA6RfgP-AHU',   // Pythagoras
  'y9-l3-s2': '2RnOMLpXGUE',   // Perimeter & Area
  'y9-l3-s3': '2RnOMLpXGUE',   // Surface Area
  'y9-l3-s4': '2RnOMLpXGUE',   // Volume
  // Trigonometry
  'y9-l4-s1': 'pJPMCcWDluY',   // SOH-CAH-TOA
  'y9-l4-s2': 'pJPMCcWDluY',   // Finding Unknown Side
  'y9-l4-s3': 'pJPMCcWDluY',   // Finding Unknown Angle
  'y9-l4-s4': 'pJPMCcWDluY',   // Elevation & Depression
  'y9-l4-s5': 'pJPMCcWDluY',   // Bearings
  // Coordinate Geometry
  'y9-l5-s1': 'YuHEpPpGHR4',   // Graphing Linear
  'y9-l5-s2': 'YuHEpPpGHR4',   // Equation of a Line
  'y9-l5-s3': 'YuHEpPpGHR4',   // Parallel & Perpendicular
  'y9-l5-s4': 'YuHEpPpGHR4',   // Length & Midpoint
  // Indices
  'y9-l6-s1': '2JCu_WS30Xk',   // Index Laws Multiply/Divide
  'y9-l6-s2': '2JCu_WS30Xk',   // Index Laws Powers
  'y9-l6-s3': '2JCu_WS30Xk',   // Zero & Negative
  'y9-l6-s4': '2JCu_WS30Xk',   // Scientific Notation
  'y9-l6-s5': '2JCu_WS30Xk',   // Fractional Indices
  // Geometry
  'y9-l7-s1': 'KElPWKFYVRM',   // Triangles
  'y9-l7-s2': 'KElPWKFYVRM',   // Quadrilaterals
  'y9-l7-s3': 'KElPWKFYVRM',   // Polygons
  'y9-l7-s4': 'KElPWKFYVRM',   // Similar Figures
  // Probability
  'y9-l8-s1': 'uzkc-qNVoOk',   // Probability Review
  'y9-l8-s2': 'uzkc-qNVoOk',   // Venn Diagrams
  'y9-l8-s3': 'uzkc-qNVoOk',   // Tree Diagrams
  // Statistics
  'y9-l9-s1': 'XciN7hTtIRM',   // Classifying Data
  'y9-l9-s2': 'XciN7hTtIRM',   // Measures of Location
  'y9-l9-s3': 'XciN7hTtIRM',   // Box Plots

  // ─── Year 10 ──────────────────────────────────────────────────────────────
  'y10-l1-s1': 'aI9fAobtplA',   // Expanding & Factorising
  'y10-l1-s2': 'RyfOdNjZlkw',   // Further Factorisation
  'y10-l1-s3': 'aI9fAobtplA',   // Algebraic Fractions
  'y10-l1-s4': 'RyfOdNjZlkw',   // Quadratic Equations
  'y10-l1-s5': 'QVjBbzRdkA4',   // Simultaneous Equations
  'y10-l2-s1': '2JCu_WS30Xk',   // Index Laws
  'y10-l2-s2': 'ntBWrcbAhaY',   // Logarithms
  'y10-l2-s3': '16H9vgX0_Mo',   // Solving Exp & Log Equations
  'y10-l2-s4': '16H9vgX0_Mo',   // Harder Equations
  'y10-l3-s1': 'vRBHZMxwhf4',   // Functions & Relations
  'y10-l3-s2': '7fpKpShCeN8',   // Quadratic Graphs
  'y10-l3-s3': '7OstCuWfV9A',   // Hyperbola
  'y10-l3-s4': '7OstCuWfV9A',   // Exponential Graphs
  'y10-l3-s5': '7fpKpShCeN8',   // The Circle
  'y10-l4-s1': 'pJPMCcWDluY',   // Trig Acute Triangles
  'y10-l4-s2': 'DEapEOdZJbQ',   // Sine Rule
  'y10-l4-s3': 'DEapEOdZJbQ',   // Cosine Rule
  'y10-l4-s4': 'DEapEOdZJbQ',   // Area & Radians
  'y10-l4-s5': 'DEapEOdZJbQ',   // Problems in 3D
  'y10-l5-s1': 'jh0SRxKi5gM',   // Polynomials Intro
  'y10-l5-s2': 'jh0SRxKi5gM',   // Dividing Polynomials
  'y10-l5-s3': 'jh0SRxKi5gM',   // Remainder & Factor Theorems
  'y10-l5-s4': 'jh0SRxKi5gM',   // Graphing Polynomials
  'y10-l6-s1': 'YuHEpPpGHR4',   // Direct Variation
  'y10-l6-s2': 'YuHEpPpGHR4',   // Inverse Variation
  'y10-l6-s3': 'YuHEpPpGHR4',   // Further Variation
  'y10-l7-s1': 'XciN7hTtIRM',   // Data Analysis
  'y10-l7-s2': 'XciN7hTtIRM',   // Standard Deviation
  'y10-l7-s3': 'uzkc-qNVoOk',   // Venn Diagrams & Tables
  'y10-l7-s4': 'uzkc-qNVoOk',   // Conditional Probability

  // ─── Year 11 Standard ─────────────────────────────────────────────────────
  'y11-std-l1-s1': 'E0j5f8BMUZY',
  'y11-std-l1-s2': 'E0j5f8BMUZY',
  'y11-std-l1-s3': 'YuHEpPpGHR4',
  'y11-std-l1-s4': 'QVjBbzRdkA4',
  'y11-std-l2-s1': '2RnOMLpXGUE',
  'y11-std-l2-s2': '2RnOMLpXGUE',
  'y11-std-l2-s3': '2RnOMLpXGUE',
  'y11-std-l2-s4': '2RnOMLpXGUE',
  'y11-std-l3-s1': 'n2XYXPNHC4E',  // Financial Math
  'y11-std-l3-s2': 'n2XYXPNHC4E',
  'y11-std-l3-s3': 'n2XYXPNHC4E',
  'y11-std-l3-s4': 'n2XYXPNHC4E',
  'y11-std-l4-s1': 'XciN7hTtIRM',
  'y11-std-l4-s2': 'XciN7hTtIRM',
  'y11-std-l4-s3': 'XciN7hTtIRM',
  'y11-std-l4-s4': 'XciN7hTtIRM',
  'y11-std-l5-s1': 'uzkc-qNVoOk',
  'y11-std-l5-s2': 'uzkc-qNVoOk',
  'y11-std-l5-s3': 'Ul4nl1S968E',
  'y11-std-l6-s1': 'phrTvN4THBI',  // Networks
  'y11-std-l6-s2': 'phrTvN4THBI',
  'y11-std-l6-s3': 'phrTvN4THBI',

  // ─── Year 11 Advanced ─────────────────────────────────────────────────────
  'y11-adv-l1-s1a': 'MlZCiiMkk3c',
  'y11-adv-l1-s1b': 'aI9fAobtplA',
  'y11-adv-l1-s1c': 'RyfOdNjZlkw',
  'y11-adv-l1-s1d': 'aI9fAobtplA',
  'y11-adv-l1-s1e': 'E0j5f8BMUZY',
  'y11-adv-l1-s1f': 'RyfOdNjZlkw',
  'y11-adv-l1-s1g': 'QVjBbzRdkA4',
  'y11-adv-l1-s1h': '6QF-7OFMWRc',
  'y11-adv-l2-s2a': 'vRBHZMxwhf4',
  'y11-adv-l2-s2b': 'YPcKs1OV-X0',
  'y11-adv-l2-s2c': 'cWc1ADDds8Y',
  'y11-adv-l2-s2d': 'YPcKs1OV-X0',
  'y11-adv-l2-s2e': 'YPcKs1OV-X0',
  'y11-adv-l3-s3a': '5-sdU476MLA',
  'y11-adv-l3-s3b': '7fpKpShCeN8',
  'y11-adv-l3-s3c': 'YuHEpPpGHR4',
  'y11-adv-l3-s3d': '7fpKpShCeN8',
  'y11-adv-l3-s3e': '6QF-7OFMWRc',
  'y11-adv-l3-s3f': 'RaoahH5O11w',
  'y11-adv-l3-s3g': '7fpKpShCeN8',
  'y11-adv-l3-s3h': '7OstCuWfV9A',
  'y11-adv-l3-s3i': 'YuHEpPpGHR4',
  'y11-adv-l4-s4a': 'E0j5f8BMUZY',
  'y11-adv-l4-s4b': 'RyfOdNjZlkw',
  'y11-adv-l4-s4c': 'RaoahH5O11w',
  'y11-adv-l4-s4d': 'RaoahH5O11w',
  'y11-adv-l4-s4e': 'E0j5f8BMUZY',
  'y11-adv-l5-s5a': 'pJPMCcWDluY',
  'y11-adv-l5-s5b': 'DEapEOdZJbQ',
  'y11-adv-l5-s5c': 'DEapEOdZJbQ',
  'y11-adv-l5-s5d': 'DEapEOdZJbQ',
  'y11-adv-l6-s6a': 'ntBWrcbAhaY',
  'y11-adv-l6-s6b': '16H9vgX0_Mo',
  'y11-adv-l6-s6c': '16H9vgX0_Mo',
  'y11-adv-l6-s6d': '7OstCuWfV9A',
  'y11-adv-l6-s6e': 'K9q0E5ysDnw',
  'y11-adv-l6-s6f': 'K9q0E5ysDnw',
  'y11-adv-l6-s6g': 'ntBWrcbAhaY',
  'y11-adv-l6-s6h': 'ntBWrcbAhaY',
  'y11-adv-l6-s6i': '16H9vgX0_Mo',
  'y11-adv-l6-s6j': '16H9vgX0_Mo',
  'y11-adv-l6-s6k': '16H9vgX0_Mo',
  'y11-adv-l7-s7a': 'pJPMCcWDluY',
  'y11-adv-l7-s7b': 'ILRrqghJzdE',
  'y11-adv-l7-s7c': 'ILRrqghJzdE',
  'y11-adv-l7-s7d': 'DEapEOdZJbQ',
  'y11-adv-l7-s7e': 'DEapEOdZJbQ',
  'y11-adv-l7-s7f': 'DEapEOdZJbQ',
  'y11-adv-l7-s7g': 'DEapEOdZJbQ',
  'y11-adv-l8-s8a': 'ILRrqghJzdE',
  'y11-adv-l8-s8b': 'ILRrqghJzdE',
  'y11-adv-l8-s8c': 'ILRrqghJzdE',
  'y11-adv-l8-s8d': 'ILRrqghJzdE',
  'y11-adv-l8-s8e': 'ILRrqghJzdE',
  'y11-adv-l8-s8f': 'ILRrqghJzdE',
  'y11-adv-l8-s8g': 'ILRrqghJzdE',
  'y11-adv-l8-s8h': 'ILRrqghJzdE',
  'y11-adv-l8-s8i': 'ILRrqghJzdE',
  'y11-adv-l8-s8j': 'ILRrqghJzdE',
  'y11-adv-l8-s8k': 'ILRrqghJzdE',
  'y11-adv-l8-s8l': 'ILRrqghJzdE',
  'y11-adv-l9-s9a': 'tt2DGYOi3hc',
  'y11-adv-l9-s9b': 'fXYhyyJpFe8',
  'y11-adv-l9-s9c': 'fXYhyyJpFe8',
  'y11-adv-l9-s9d': 'fXYhyyJpFe8',
  'y11-adv-l9-s9e': 'fXYhyyJpFe8',
  'y11-adv-l10-s10a': 'tt2DGYOi3hc',
  'y11-adv-l10-s10b': 'tt2DGYOi3hc',
  'y11-adv-l10-s10c': 'tt2DGYOi3hc',
  'y11-adv-l10-s10d': 'tt2DGYOi3hc',
  'y11-adv-l11-s11a': 'c8W9_iaERnU',
  'y11-adv-l11-s11b': 'Zg4dJVvwRko',
  'y11-adv-l11-s11c': 'c8W9_iaERnU',
  'y11-adv-l11-s11d': 'c8W9_iaERnU',
  'y11-adv-l11-s11e': 'c8W9_iaERnU',
  'y11-adv-l11-s11f': 'c8W9_iaERnU',
  'y11-adv-l11-s11g': 'c8W9_iaERnU',
  'y11-adv-l12-s12a': 'XciN7hTtIRM',
  'y11-adv-l12-s12b': 'XciN7hTtIRM',
  'y11-adv-l12-s12c': 'XciN7hTtIRM',
  'y11-adv-l12-s12d': 'XciN7hTtIRM',

  // ─── Year 11 Extension 1 ──────────────────────────────────────────────────
  'y11-ext1-l1-s1a': 'aI9fAobtplA',
  'y11-ext1-l1-s1b': 'RyfOdNjZlkw',
  'y11-ext1-l1-s1c': 'aI9fAobtplA',
  'y11-ext1-l1-s1d': 'E0j5f8BMUZY',
  'y11-ext1-l1-s1e': 'QVjBbzRdkA4',
  'y11-ext1-l1-s1f': '6QF-7OFMWRc',
  'y11-ext1-l2-s2a': 'vRBHZMxwhf4',
  'y11-ext1-l2-s2b': 'YPcKs1OV-X0',
  'y11-ext1-l2-s2c': 'cWc1ADDds8Y',
  'y11-ext1-l2-s2d': 'YPcKs1OV-X0',
  'y11-ext1-l3-s3a': '5-sdU476MLA',
  'y11-ext1-l3-s3b': '5-sdU476MLA',
  'y11-ext1-l3-s3c': 'YuHEpPpGHR4',
  'y11-ext1-l3-s3d': '7fpKpShCeN8',
  'y11-ext1-l3-s3e': '6QF-7OFMWRc',
  'y11-ext1-l3-s3f': 'RaoahH5O11w',
  'y11-ext1-l3-s3g': '7fpKpShCeN8',
  'y11-ext1-l3-s3h': '7OstCuWfV9A',
  'y11-ext1-l3-s3i': 'YuHEpPpGHR4',
  'y11-ext1-l4-s4a': 'E0j5f8BMUZY',
  'y11-ext1-l4-s4b': 'RaoahH5O11w',
  'y11-ext1-l4-s4c': 'RaoahH5O11w',
  'y11-ext1-l4-s4d': 'RaoahH5O11w',
  'y11-ext1-l5-s5a': 'yoliJSZVDnA',
  'y11-ext1-l5-s5b': 'OPnYuQmtgp4',
  'y11-ext1-l5-s5c': 'OPnYuQmtgp4',
  'y11-ext1-l5-s5d': 'OPnYuQmtgp4',
  'y11-ext1-l5-s5e': 'OPnYuQmtgp4',
  'y11-ext1-l5-s5f': '5-sdU476MLA',
  'y11-ext1-l5-s5g': 'yoliJSZVDnA',
  'y11-ext1-l5-s5h': '5-sdU476MLA',
  'y11-ext1-l6-s6a': 'E0j5f8BMUZY',
  'y11-ext1-l6-s6b': '5-sdU476MLA',
  'y11-ext1-l6-s6c': '7OstCuWfV9A',
  'y11-ext1-l6-s6d': '5-sdU476MLA',
  'y11-ext1-l6-s6e': 'OPnYuQmtgp4',
  'y11-ext1-l6-s6f': '5-sdU476MLA',
  'y11-ext1-l6-s6g': '5-sdU476MLA',
  'y11-ext1-l6-s6h': '5-sdU476MLA',
  'y11-ext1-l7-s7a': 'SiA-WTnKNgs',
  'y11-ext1-l7-s7b': 'ILRrqghJzdE',
  'y11-ext1-l7-s7c': 'ILRrqghJzdE',
  'y11-ext1-l7-s7d': 'DEapEOdZJbQ',
  'y11-ext1-l7-s7e': 'DEapEOdZJbQ',
  'y11-ext1-l7-s7f': 'DEapEOdZJbQ',
  'y11-ext1-l8-s8a': 'ILRrqghJzdE',
  'y11-ext1-l8-s8b': 'ILRrqghJzdE',
  'y11-ext1-l8-s8c': 'ILRrqghJzdE',
  'y11-ext1-l8-s8d': 'ILRrqghJzdE',
  'y11-ext1-l9-s9a': 'tt2DGYOi3hc',
  'y11-ext1-l9-s9b': 'fXYhyyJpFe8',
  'y11-ext1-l9-s9c': 'K9q0E5ysDnw',
  'y11-ext1-l9-s9d': '_8ObUA1e61w',
  'y11-ext1-l9-s9e': '_8ObUA1e61w',
  'y11-ext1-l9-s9f': 'tt2DGYOi3hc',
  'y11-ext1-l10-s10a': 'tt2DGYOi3hc',
  'y11-ext1-l10-s10b': 'tt2DGYOi3hc',
  'y11-ext1-l10-s10c': 'tt2DGYOi3hc',
  'y11-ext1-l10-s10d': 'tt2DGYOi3hc',
  'y11-ext1-l10-s10e': 'tt2DGYOi3hc',
  'y11-ext1-l11-s11a': 'c8W9_iaERnU',
  'y11-ext1-l11-s11b': 'Zg4dJVvwRko',
  'y11-ext1-l11-s11c': 'c8W9_iaERnU',
  'y11-ext1-l11-s11d': 'YVzvK7Slq-Q',
  'y11-ext1-l12-s12a': 'JVbbRCVBVRI',
  'y11-ext1-l12-s12b': 'JVbbRCVBVRI',
  'y11-ext1-l12-s12c': 'M7F290AwLz4',
  'y11-ext1-l12-s12d': 'M7F290AwLz4',
  'y11-ext1-l12-s12e': 'Ul4nl1S968E',
  'y11-ext1-l12-s12f': 'Ul4nl1S968E',
  'y11-ext1-l12-s12g': 'M7F290AwLz4',

  // ─── Year 11 Extension 2 Pathway ─────────────────────────────────────────
  'y11-ext2-l1-s1a': 'aI9fAobtplA',
  'y11-ext2-l1-s1b': 'RyfOdNjZlkw',
  'y11-ext2-l1-s1c': 'aI9fAobtplA',
  'y11-ext2-l1-s1d': 'E0j5f8BMUZY',
  'y11-ext2-l1-s1e': 'QVjBbzRdkA4',
  'y11-ext2-l2-s2a': 'YPcKs1OV-X0',
  'y11-ext2-l2-s2b': 'cWc1ADDds8Y',
  'y11-ext2-l3-s3a': '5-sdU476MLA',
  'y11-ext2-l3-s3b': '5-sdU476MLA',
  'y11-ext2-l3-s3c': '7fpKpShCeN8',
  'y11-ext2-l3-s3d': '6QF-7OFMWRc',
  'y11-ext2-l3-s3e': 'RaoahH5O11w',
  'y11-ext2-l3-s3f': '7OstCuWfV9A',
  'y11-ext2-l3-s3g': '7OstCuWfV9A',
  'y11-ext2-l4-s4a': 'SiA-WTnKNgs',
  'y11-ext2-l4-s4b': 'ILRrqghJzdE',
  'y11-ext2-l5-s5a': 'tt2DGYOi3hc',
  'y11-ext2-l5-s5b': 'fXYhyyJpFe8',
  'y11-ext2-l6-s6a': 'c8W9_iaERnU',
  'y11-ext2-l6-s6b': 'Zg4dJVvwRko',
  'y11-ext2-l6-s6c': 'YVzvK7Slq-Q',
  'y11-ext2-l7-s7a': 'JVbbRCVBVRI',
  'y11-ext2-l7-s7b': 'Ul4nl1S968E',
  'y11-ext2-l8-s8a': 'uzkc-qNVoOk',
  'y11-ext2-l8-s8b': 'uzkc-qNVoOk',
  'y11-ext2-l8-s8c': 'Ul4nl1S968E',
  'y11-ext2-l9-s9a': 'XciN7hTtIRM',
  'y11-ext2-l9-s9b': 'XciN7hTtIRM',
  'y11-ext2-l9-s9c': 'XciN7hTtIRM',
  'y11-ext2-l10-s10a': 'ntBWrcbAhaY',
  'y11-ext2-l10-s10b': '16H9vgX0_Mo',
  'y11-ext2-l11-s11a': 'AA6RfgP-AHU',
  'y11-ext2-l11-s11b': 'KElPWKFYVRM',
  'y11-ext2-l12-s12a': 'phrTvN4THBI',
  'y11-ext2-l12-s12b': 'phrTvN4THBI',

  // ─── Year 12 Advanced ─────────────────────────────────────────────────────
  'y12-adv-l1-s1a': 'tt2DGYOi3hc',
  'y12-adv-l1-s1b': 'K9q0E5ysDnw',
  'y12-adv-l1-s1c': '_8ObUA1e61w',
  'y12-adv-l2-s2a': 'tt2DGYOi3hc',
  'y12-adv-l2-s2b': 'tt2DGYOi3hc',
  'y12-adv-l2-s2c': 'tt2DGYOi3hc',
  'y12-adv-l3-s3a': 'c8W9_iaERnU',
  'y12-adv-l3-s3b': 'Zg4dJVvwRko',
  'y12-adv-l3-s3c': 'c8W9_iaERnU',
  'y12-adv-l3-s3d': 'YVzvK7Slq-Q',
  'y12-adv-l4-s4a': 'ILRrqghJzdE',
  'y12-adv-l4-s4b': 'ILRrqghJzdE',
  'y12-adv-l4-s4c': 'ILRrqghJzdE',
  'y12-adv-l4-s4d': 'ILRrqghJzdE',
  'y12-adv-l5-s5a': 'ntBWrcbAhaY',
  'y12-adv-l5-s5b': '16H9vgX0_Mo',
  'y12-adv-l5-s5c': 'K9q0E5ysDnw',
  'y12-adv-l5-s5d': '7OstCuWfV9A',
  'y12-adv-l6-s6a': '7fpKpShCeN8',
  'y12-adv-l6-s6b': 'RaoahH5O11w',
  'y12-adv-l6-s6c': '6QF-7OFMWRc',
  'y12-adv-l7-s7a': 'uzkc-qNVoOk',
  'y12-adv-l7-s7b': 'uzkc-qNVoOk',
  'y12-adv-l8-s8a': 'XciN7hTtIRM',
  'y12-adv-l8-s8b': 'XciN7hTtIRM',
  'y12-adv-l8-s8c': 'XciN7hTtIRM',
  'y12-adv-l9-s9a': 'n2XYXPNHC4E',
  'y12-adv-l9-s9b': 'n2XYXPNHC4E',
  'y12-adv-l9-s9c': 'n2XYXPNHC4E',

  // ─── Year 12 Extension 1 ──────────────────────────────────────────────────
  'y12-ext1-l1-s1a': 'ILRrqghJzdE',
  'y12-ext1-l1-s1b': 'ILRrqghJzdE',
  'y12-ext1-l1-s1c': 'ILRrqghJzdE',
  'y12-ext1-l2-s2a': 'Ul4nl1S968E',
  'y12-ext1-l2-s2b': 'JVbbRCVBVRI',
  'y12-ext1-l2-s2c': 'M7F290AwLz4',
  'y12-ext1-l2-s2d': 'Ul4nl1S968E',
  'y12-ext1-l3-s3a': 'YVzvK7Slq-Q',
  'y12-ext1-l3-s3b': 'YVzvK7Slq-Q',
  'y12-ext1-l3-s3c': 'YVzvK7Slq-Q',
  'y12-ext1-l3-s3d': 'YVzvK7Slq-Q',
  'y12-ext1-l4-s4a': 'tt2DGYOi3hc',
  'y12-ext1-l4-s4b': 'tt2DGYOi3hc',
  'y12-ext1-l4-s4c': 'tt2DGYOi3hc',
  'y12-ext1-l5-s5a': 'c8W9_iaERnU',
  'y12-ext1-l5-s5b': 'c8W9_iaERnU',
  'y12-ext1-l5-s5c': 'YVzvK7Slq-Q',
  'y12-ext1-l6-s6a': 'ntBWrcbAhaY',
  'y12-ext1-l6-s6b': '16H9vgX0_Mo',
  'y12-ext1-l6-s6c': 'K9q0E5ysDnw',
  'y12-ext1-l7-s7a': 'ILRrqghJzdE',
  'y12-ext1-l7-s7b': 'ILRrqghJzdE',
  'y12-ext1-l7-s7c': 'ILRrqghJzdE',
  'y12-ext1-l8-s8a': 'XciN7hTtIRM',
  'y12-ext1-l8-s8b': 'XciN7hTtIRM',
  'y12-ext1-l8-s8c': 'XciN7hTtIRM',

  // ─── Year 12 Standard ─────────────────────────────────────────────────────
  'y12-std-l1-s1a': 'n2XYXPNHC4E',
  'y12-std-l1-s1b': 'n2XYXPNHC4E',
  'y12-std-l1-s1c': 'n2XYXPNHC4E',
  'y12-std-l2-s2a': '2RnOMLpXGUE',
  'y12-std-l2-s2b': '2RnOMLpXGUE',
  'y12-std-l2-s2c': '2RnOMLpXGUE',
  'y12-std-l2-s2d': '2RnOMLpXGUE',
  'y12-std-l3-s3a': 'XciN7hTtIRM',
  'y12-std-l3-s3b': 'XciN7hTtIRM',
  'y12-std-l3-s3c': 'XciN7hTtIRM',
  'y12-std-l3-s3d': 'XciN7hTtIRM',
  'y12-std-l4-s4a': 'E0j5f8BMUZY',
  'y12-std-l4-s4b': 'YuHEpPpGHR4',
  'y12-std-l4-s4c': 'YuHEpPpGHR4',
  'y12-std-l4-s4d': 'YuHEpPpGHR4',
  'y12-std-l5-s5a': 'phrTvN4THBI',
  'y12-std-l5-s5b': 'phrTvN4THBI',
  'y12-std-l5-s5c': 'phrTvN4THBI',
  'y12-std-l5-s5d': 'phrTvN4THBI',

  // ─── Year 12 Extension 2 ──────────────────────────────────────────────────
  'y12-ext2-l1-s1a': 'aI9fAobtplA',
  'y12-ext2-l1-s1b': 'RyfOdNjZlkw',
  'y12-ext2-l1-s1c': '6QF-7OFMWRc',
  'y12-ext2-l1-s1d': 'RaoahH5O11w',
  'y12-ext2-l1-s1e': '7fpKpShCeN8',
  'y12-ext2-l1-s1f': '7OstCuWfV9A',
  'y12-ext2-l2-s2a': 'tt2DGYOi3hc',
  'y12-ext2-l2-s2b': '_8ObUA1e61w',
  'y12-ext2-l2-s2c': '_8ObUA1e61w',
  'y12-ext2-l2-s2d': 'YVzvK7Slq-Q',
  'y12-ext2-l3-s3a': 'c8W9_iaERnU',
  'y12-ext2-l3-s3b': 'YVzvK7Slq-Q',
  'y12-ext2-l3-s3c': 'YVzvK7Slq-Q',
  'y12-ext2-l4-s4a': 'ILRrqghJzdE',
  'y12-ext2-l4-s4b': 'ILRrqghJzdE',
  'y12-ext2-l4-s4c': 'ILRrqghJzdE',
  'y12-ext2-l4-s4d': 'ILRrqghJzdE',
  'y12-ext2-l5-s5a': 'Ul4nl1S968E',
  'y12-ext2-l5-s5b': 'JVbbRCVBVRI',
  'y12-ext2-l5-s5c': 'M7F290AwLz4',
  'y12-ext2-l5-s5d': 'Ul4nl1S968E',
};
