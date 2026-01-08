'use client'

import { useState, Fragment } from 'react'

interface Signup {
  id: string
  name: string
  email: string
  company: string | null
  role: string | null
  company_size: string | null
  llm_score: number | null
  position: number | null
  status: string
  scoring_metadata: {
    reasons?: string[]
    red_flags?: string[]
    confidence?: number
    decision?: string
  } | null
  created_at: string
  answer_problem: string | null
  answer_workflow: string | null
  answer_alternatives: string | null
  answer_success: string | null
  answer_source: string | null
}

interface SignupsTableProps {
  signups: Signup[]
  waitlistName: string
}

type SortField = 'position' | 'llm_score' | 'created_at' | 'name'
type SortOrder = 'asc' | 'desc'

// SortIcon component moved outside to avoid recreation on each render
const SortIcon = ({ field, sortField, sortOrder }: { field: SortField; sortField: SortField; sortOrder: SortOrder }) => {
  if (sortField !== field) {
    return (
      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    )
  }
  return sortOrder === 'asc' ? (
    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
  ) : (
    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}

export default function SignupsTable({ signups, waitlistName }: SignupsTableProps) {
  const [sortField, setSortField] = useState<SortField>('position')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [expandedSignup, setExpandedSignup] = useState<string | null>(null)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder(field === 'llm_score' ? 'desc' : 'asc')
    }
  }

  const sortedSignups = [...signups].sort((a, b) => {
    let aVal: string | number | null = a[sortField]
    let bVal: string | number | null = b[sortField]
    
    // Handle nulls
    if (aVal === null) aVal = sortOrder === 'asc' ? Infinity : -Infinity
    if (bVal === null) bVal = sortOrder === 'asc' ? Infinity : -Infinity
    
    // Date comparison
    if (sortField === 'created_at') {
      aVal = new Date(aVal).getTime()
      bVal = new Date(bVal).getTime()
    }
    
    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
    return 0
  })

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      approved: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      waitlist: 'bg-blue-100 text-blue-800',
      rejected: 'bg-red-100 text-red-800',
    }
    return styles[status] || 'bg-gray-100 text-gray-800'
  }

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'text-gray-400'
    if (score >= 92) return 'text-green-600 font-semibold'
    if (score >= 80) return 'text-yellow-600 font-semibold'
    return 'text-gray-600'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  if (signups.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-4xl mb-4">📭</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No signups yet</h3>
        <p className="text-gray-600">
          Share your waitlist URL to start collecting signups!
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('position')}
              >
                <div className="flex items-center gap-1">
                  Position
                  <SortIcon field="position" sortField={sortField} sortOrder={sortOrder} />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-1">
                  Name
                  <SortIcon field="name" sortField={sortField} sortOrder={sortOrder} />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Size
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('llm_score')}
              >
                <div className="flex items-center gap-1">
                  Score
                  <SortIcon field="llm_score" sortField={sortField} sortOrder={sortOrder} />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('created_at')}
              >
                <div className="flex items-center gap-1">
                  Date
                  <SortIcon field="created_at" sortField={sortField} sortOrder={sortOrder} />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedSignups.map((signup) => (
              <Fragment key={signup.id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-lg font-semibold text-gray-900">
                      #{signup.position ?? '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {signup.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{signup.email}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{signup.company || '—'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{signup.role || '—'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{signup.company_size || '—'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm ${getScoreColor(signup.llm_score)}`}>
                      {signup.llm_score !== null ? `${signup.llm_score}/100` : 'Scoring...'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(signup.status)}`}>
                      {signup.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(signup.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => setExpandedSignup(expandedSignup === signup.id ? null : signup.id)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      {expandedSignup === signup.id ? 'Hide' : 'View Details'}
                    </button>
                  </td>
                </tr>
                {expandedSignup === signup.id && (
                  <tr className="bg-gray-50">
                    <td colSpan={10} className="px-6 py-4">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Responses</h4>
                        
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              What problem are you trying to solve?
                            </p>
                            <p className="text-sm text-gray-600">
                              {signup.answer_problem || 'No answer'}
                            </p>
                          </div>
                          
                          <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              How would you use {waitlistName} in your workflow?
                            </p>
                            <p className="text-sm text-gray-600">
                              {signup.answer_workflow || 'No answer'}
                            </p>
                          </div>
                          
                          <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              What alternatives have you tried?
                            </p>
                            <p className="text-sm text-gray-600">
                              {signup.answer_alternatives || 'No answer'}
                            </p>
                          </div>
                          
                          <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              What would success look like?
                            </p>
                            <p className="text-sm text-gray-600">
                              {signup.answer_success || 'No answer'}
                            </p>
                          </div>
                          
                          <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              How did you hear about us?
                            </p>
                            <p className="text-sm text-gray-600">
                              {signup.answer_source || 'No answer'}
                            </p>
                          </div>
                        </div>

                        {signup.scoring_metadata && (
                          <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                            <h5 className="font-medium text-gray-900 mb-2">AI Scoring Details</h5>
                            <div className="grid gap-2 text-sm">
                              {signup.scoring_metadata.reasons && signup.scoring_metadata.reasons.length > 0 && (
                                <div>
                                  <span className="text-gray-600">Reasons: </span>
                                  <span className="text-gray-900">{signup.scoring_metadata.reasons.join(', ')}</span>
                                </div>
                              )}
                              {signup.scoring_metadata.red_flags && signup.scoring_metadata.red_flags.length > 0 && (
                                <div>
                                  <span className="text-gray-600">Red Flags: </span>
                                  <span className="text-red-600">{signup.scoring_metadata.red_flags.join(', ')}</span>
                                </div>
                              )}
                              {signup.scoring_metadata.confidence !== undefined && (
                                <div>
                                  <span className="text-gray-600">Confidence: </span>
                                  <span className="text-gray-900">{Math.round(signup.scoring_metadata.confidence * 100)}%</span>
                                </div>
                              )}
                              {signup.scoring_metadata.decision && (
                                <div>
                                  <span className="text-gray-600">Decision: </span>
                                  <span className="text-gray-900">{signup.scoring_metadata.decision.replace('_', ' ')}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
