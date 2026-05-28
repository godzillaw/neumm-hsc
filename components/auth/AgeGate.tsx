'use client'

import { useState } from 'react'

interface Props {
  onComplete: (birthYear: number, isMinor: boolean) => void
  onUnder13: () => void
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function getDaysInMonth(month: number, year: number): number {
  if (!month || !year) return 31
  return new Date(year, month, 0).getDate()
}

export default function AgeGate({ onComplete, onUnder13 }: Props) {
  const now = new Date()
  const currentYear = now.getFullYear()

  const [day,   setDay]   = useState('')
  const [month, setMonth] = useState('')
  const [year,  setYear]  = useState('')
  const [error, setError] = useState<string | null>(null)

  const yearOptions = Array.from({ length: 96 }, (_, i) => currentYear - 5 - i)
  const daysInMonth = month && year ? getDaysInMonth(parseInt(month), parseInt(year)) : 31
  const dayOptions  = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const d = parseInt(day)
    const m = parseInt(month)
    const y = parseInt(year)

    if (!d || !m || !y) {
      setError('Please select your full date of birth.')
      return
    }

    // Validate real date
    const dob = new Date(y, m - 1, d)
    if (dob.getDate() !== d || dob.getMonth() !== m - 1 || dob.getFullYear() !== y) {
      setError('Please enter a valid date.')
      return
    }

    // Calculate age
    const today = new Date()
    let age = today.getFullYear() - y
    const hadBirthday = (
      today.getMonth() + 1 > m ||
      (today.getMonth() + 1 === m && today.getDate() >= d)
    )
    if (!hadBirthday) age--

    if (age < 13) {
      // Log the block attempt
      void fetch('/math-nsw/app/api/auth/age-gate-block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      }).catch(() => {})
      onUnder13()
      return
    }

    const isMinor = age < 18
    onComplete(y, isMinor)
  }

  return (
    <div>
      <h3 style={{ color: '#0D3349', fontWeight: 900, fontSize: 17, marginBottom: 6, marginTop: 0 }}>
        What is your date of birth?
      </h3>
      <p style={{ color: '#6B7280', fontSize: 13, marginBottom: 20, lineHeight: 1.5 }}>
        We need to verify your age to comply with our age eligibility requirements.
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1.5fr', gap: 10, marginBottom: 16 }}>
          {/* Day */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#374151', marginBottom: 4 }}>Day</label>
            <select
              value={day}
              onChange={e => setDay(e.target.value)}
              style={{
                width: '100%', padding: '10px 8px', fontSize: 14,
                border: '1.5px solid #E5E7EB', borderRadius: 10,
                outline: 'none', background: 'white', fontFamily: 'inherit',
              }}
            >
              <option value="">Day</option>
              {dayOptions.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Month */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#374151', marginBottom: 4 }}>Month</label>
            <select
              value={month}
              onChange={e => setMonth(e.target.value)}
              style={{
                width: '100%', padding: '10px 8px', fontSize: 14,
                border: '1.5px solid #E5E7EB', borderRadius: 10,
                outline: 'none', background: 'white', fontFamily: 'inherit',
              }}
            >
              <option value="">Month</option>
              {MONTHS.map((m, i) => (
                <option key={m} value={i + 1}>{m}</option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#374151', marginBottom: 4 }}>Year</label>
            <select
              value={year}
              onChange={e => setYear(e.target.value)}
              style={{
                width: '100%', padding: '10px 8px', fontSize: 14,
                border: '1.5px solid #E5E7EB', borderRadius: 10,
                outline: 'none', background: 'white', fontFamily: 'inherit',
              }}
            >
              <option value="">Year</option>
              {yearOptions.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div style={{
            background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10,
            padding: '10px 14px', fontSize: 13, color: '#B91C1C', marginBottom: 14,
          }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          style={{
            width: '100%', padding: '12px', borderRadius: 12,
            background: '#185FA5', color: 'white',
            fontWeight: 900, fontSize: 14, border: 'none', cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Continue →
        </button>
      </form>
    </div>
  )
}
