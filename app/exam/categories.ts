// ─── Topic catalogue (no 'use server' — safe to import in Client Components) ──

export const EXAM_CATEGORIES: Array<{
  name:     string
  emoji:    string
  prefixes: string[]
}> = [
  {
    name: 'Calculus — Differentiation', emoji: "∂",
    prefixes: ['MA-CALC-D01','MA-CALC-D02','MA-CALC-D03','MA-CALC-D04','MA-CALC-D05',
               'MA-CALC-D06','MA-CALC-D07','MA-CALC-D08','MA-CALC-D09','MA-CALC-D10',
               'MA-CALC-D11','MA-CALC-D12'],
  },
  {
    name: 'Calculus — Integration', emoji: "∫",
    prefixes: ['MA-CALC-I01','MA-CALC-I02','MA-CALC-I03','MA-CALC-I04','MA-CALC-I05',
               'MA-CALC-I06','MA-CALC-I07','MA-CALC-I08','MA-CALC-I09','MA-CALC-I10',
               'MA-CALC-I11','MA-CALC-I12'],
  },
  {
    name: 'Trigonometry', emoji: "△",
    prefixes: ['MA-TRIG-01','MA-TRIG-02','MA-TRIG-03','MA-TRIG-04','MA-TRIG-05',
               'MA-TRIG-06','MA-TRIG-07','MA-TRIG-08','MA-TRIG-09'],
  },
  {
    name: 'Exponential & Logarithms', emoji: "eˣ",
    prefixes: ['MA-EXP-01','MA-EXP-02','MA-EXP-03','MA-EXP-04','MA-EXP-05','MA-EXP-06'],
  },
  {
    name: 'Functions', emoji: "f(x)",
    prefixes: ['MA-FUNC-01','MA-FUNC-02','MA-FUNC-03','MA-FUNC-04','MA-FUNC-05',
               'MA-FUNC-06','MA-FUNC-07','MA-FUNC-08','MA-FUNC-09'],
  },
  {
    name: 'Algebra', emoji: "x²",
    prefixes: ['MA-ALG-01','MA-ALG-02','MA-ALG-03','MA-ALG-04',
               'MA-ALG-05','MA-ALG-06','MA-ALG-07','MA-ALG-08'],
  },
  {
    name: 'Statistics & Probability', emoji: "σ",
    prefixes: ['MA-STAT-01','MA-STAT-02','MA-STAT-03','MA-STAT-04','MA-STAT-05','MA-STAT-06',
               'MA-PROB-01','MA-PROB-02','MA-PROB-03','MA-PROB-04','MA-PROB-05'],
  },
  {
    name: 'Financial Mathematics', emoji: "$",
    prefixes: ['MA-FIN-01','MA-FIN-02','MA-FIN-03','MA-FIN-04','MA-FIN-05'],
  },
  {
    name: 'Coordinate Geometry', emoji: "⊙",
    prefixes: ['MA-COORD-01','MA-COORD-02','MA-COORD-03','MA-COORD-04','MA-COORD-05'],
  },
  {
    name: 'Extension Topics', emoji: "★",
    prefixes: ['MA-EXT-01','MA-EXT-02','MA-EXT-03','MA-EXT-04',
               'MA-EXT-05','MA-EXT-06','MA-EXT-07','MA-EXT-08'],
  },
]
