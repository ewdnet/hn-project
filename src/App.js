import React, { useState, useEffect, useRef } from 'react'

function App() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState()
  // Pagination
  const [currPage, setCurrPage] = useState(1)
  const [itemsOnPage] = useState(4)

  const url = 'http://hn.algolia.com/api/v1/'
  const queryParams = 'search?query='
  // const queryParams = 'search?tags=front_page'
  const inputValueRef = useRef()

  useEffect(() => {
    const fetchNews = async () => {
      const endpoint = `${url}${queryParams}${searchQuery}`
      try {
        setLoading(true)
        const res = await fetch(endpoint, { cache: 'no-cache' })
        if (res.ok) {
          const data = await res.json()
          // console.log(data)
          setNews(data.hits)
          setLoading(false)
        } else {
          alert('Schlimme Sache!')
        }
      } catch (e) {
        alert(e.message)
      }
    }
    fetchNews()
  }, [searchQuery])

  const searching = event => {
    event.preventDefault()
    setSearchQuery(inputValueRef.current.value)
    inputValueRef.current.value = null
    setCurrPage(1)
  }

  const spinner = () => (
    <p className="uk-text-center">
      <span className="uk-text-warning" data-uk-spinner="ratio: 12"></span>
    </p>
  )

  // get current Post
  const lastItem = currPage * itemsOnPage
  const firstItem = lastItem - itemsOnPage
  const currItems = news.slice(firstItem, lastItem)
  // Change page
  // const paginate = pageNumber => setCurrPage(pageNumber)

  const pageNumbers = []

  for (let i = 1; i <= Number(news.length / itemsOnPage); i++) {
    pageNumbers.push(i)
  }

  const items = () => (
    <>
      <ol className="uk-child-width-1-2@m" id={`page-${currPage}`} data-uk-grid="masonry: true">
        {currItems.map(item => (
          <li key={item.objectID} data-uk-scrollspy="cls: uk-animation-fade">
            <div className="uk-card uk-card-small uk-card-primary uk-card-body">
              <h3 className="uk-h4">{item.title}</h3>
              <p>
                <span className="uk-margin-small-right uk-icon" data-uk-icon="calendar"></span>
                <span>{new Date(item.created_at_i * 1000).toLocaleString('en-US')}</span>
              </p>
              <p className="uk-flex uk-flex-middle uk-flex-between">
                <span>
                  <span className="uk-margin-small-right uk-icon" data-uk-icon="user"></span>
                  {item.author}
                </span>
                <span>
                  {item.url ? (
                    <a href={item.url} data-uk-tooltip={`title: ${item.url}`}>
                      <span className="uk-margin-small-right uk-icon" data-uk-icon="link"></span>Link
                    </a>
                  ) : (
                    ' '
                  )}
                </span>
              </p>
            </div>
          </li>
        ))}
      </ol>
      <ul className="uk-pagination uk-flex-center">
        {pageNumbers.map(number => (
          <li key={number} className={currPage === number ? 'uk-active' : ''}>
            <a onClick={() => setCurrPage(number)} href={`#page-${number}`}>
              {number}
            </a>
          </li>
        ))}
      </ul>
    </>
  )

  const noResults = () => (
    <div>
      <h3>Search for "{searchQuery}"</h3>
      <p>No results for the searching term!</p>
    </div>
  )

  return (
    <>
      <header className="uk-section uk-padding-remove-top" data-uk-scrollspy="cls: uk-animation-slide-top-small">
        <div className="uk-container uk-container-xsmall uk-flex uk-flex-middle uk-padding-small">
          <h1 className="uk-h4 uk-margin-remove-bottom uk-margin-small-right">Hacker News</h1>
          <form onSubmit={searching} className="uk-flex-auto uk-flex uk-flex-middle">
            <input ref={inputValueRef} className="uk-input uk-flex-auto" type="text" placeholder="Search Hacker News ..." />
            <button className="uk-button uk-button-default" type="submit">
              Search
            </button>
          </form>
        </div>
        <nav className="uk-container uk-container-xsmall uk-flex uk-flex-middle uk-flex-center">
          <button
            onClick={() => {
              setSearchQuery('&tags=front_page')
              setCurrPage(1)
            }}
            className="uk-button uk-button-link uk-padding-small"
          >
            front
          </button>
          <button
            onClick={() => {
              setSearchQuery('&tags=story')
              setCurrPage(1)
            }}
            className="uk-button uk-button-link uk-padding-small"
          >
            story
          </button>
          <button
            onClick={() => {
              setSearchQuery('&tags=show_hn')
              setCurrPage(1)
            }}
            className="uk-button uk-button-link uk-padding-small"
          >
            show
          </button>
        </nav>
      </header>
      <main className="uk-container uk-container-xsmall uk-flex-auto">
        <article className="uk-width-exppand">
          {(loading && spinner()) || items()}
          {news.length === 0 && noResults()}
        </article>
      </main>
      <footer className="uk-section uk-section-primary uk-padding-small">
        <p className="uk-container uk-text-center">
          <small>
            <span className="uk-margin-small-right uk-icon" data-uk-icon="user"></span>Emil | WDPT#006 - NOV 2021
          </small>
        </p>
      </footer>
    </>
  )
}

export default App
