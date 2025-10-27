import React, { useEffect, useMemo, useState } from 'react'

import UserTable from './components/UserTable'

export default function App() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // UI state
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState('first_name')
  const [sortDir, setSortDir] = useState('asc')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(6)
  const [filterDomain, setFilterDomain] = useState('')
  const [filterFirstLetter, setFilterFirstLetter] = useState('')

  useEffect(() => {
    let cancelled = false
    async function fetchAll() {
      setLoading(true)
      setError(null)
      try {
        const first = await fetch('https://reqres.in/api/users?page=1').then(r => r.json())
        const totalPages = first.total_pages || 1
        let results = first.data || []
        if (totalPages > 1) {
          const rest = await Promise.all(
            Array.from({ length: totalPages - 1 }, (_, i) => i + 2).map(p =>
              fetch(`https://reqres.in/api/users?page=${p}`).then(r => r.json())
            )
          )
          rest.forEach(r => {
            results = results.concat(r.data || [])
          })
        }
        if (!cancelled) {
          setUsers(results)
        }
      } catch (err) {
        console.error(err)
        if (!cancelled) setError('Failed to load users')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchAll()
    return () => {
      cancelled = true
    }
  }, [])

  const domains = useMemo(() => {
    const s = new Set(users.map(u => u.email.split('@')[1] || ''))
    return Array.from(s).filter(Boolean)
  }, [users])

  // Filtering, searching, sorting
  const processed = useMemo(() => {
    let out = [...users]
    if (search.trim()) {
      const q = search.toLowerCase()
      out = out.filter(u => (`${u.first_name} ${u.last_name}`.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)))
    }
    if (filterDomain) {
      out = out.filter(u => u.email.endsWith('@' + filterDomain))
    }
    if (filterFirstLetter) {
      out = out.filter(u => u.first_name.toLowerCase().startsWith(filterFirstLetter.toLowerCase()))
    }
    out.sort((a, b) => {
      const A = (a[sortKey] || '').toString().toLowerCase()
      const B = (b[sortKey] || '').toString().toLowerCase()
      if (A < B) return sortDir === 'asc' ? -1 : 1
      if (A > B) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return out
  }, [users, search, sortKey, sortDir, filterDomain, filterFirstLetter])

  const totalPages = Math.max(1, Math.ceil(processed.length / pageSize))
  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [totalPages])

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize
    return processed.slice(start, start + pageSize)
  }, [processed, page, pageSize])

  return (
    <div className="container">
      <header>
        <h1>User Directory</h1>
        <p className="subtitle">Fetches users from <code>https://reqres.in/api/users</code></p>
      </header>

      <section className="controls">
        <div className="row">
          <input
            aria-label="Search"
            placeholder="Search by name or email"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
          />

          <select value={sortKey} onChange={e => setSortKey(e.target.value)}>
            <option value="first_name">First name</option>
            <option value="last_name">Last name</option>
            <option value="email">Email</option>
          </select>
          <button onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}>{sortDir === 'asc' ? '▲' : '▼'}</button>

          <select value={filterDomain} onChange={e => { setFilterDomain(e.target.value); setPage(1) }}>
            <option value="">All domains</option>
            {domains.map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          <select value={filterFirstLetter} onChange={e => { setFilterFirstLetter(e.target.value); setPage(1) }}>
            <option value="">All first letters</option>
            {Array.from(new Set(users.map(u => u.first_name[0].toUpperCase()))).sort().map(l => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>

          <label className="small">Per page:
            <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1) }}>
              <option value={3}>3</option>
              <option value={6}>6</option>
              <option value={12}>12</option>
            </select>
          </label>
        </div>
      </section>

      <main>
        {loading ? (
          <div className="spinner" role="status">Loading…</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <>
            <UserTable users={paginated} />

            <div className="pagination">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pn => (
                <button key={pn} onClick={() => setPage(pn)} className={pn === page ? 'active' : ''}>{pn}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</button>
            </div>

            <div className="summary">Showing {processed.length} results — page {page} of {totalPages}</div>
          </>
        )}
      </main>

      <footer>
        <small>Small demo app — data from reqres.in</small>
      </footer>
    </div>
  )
}

