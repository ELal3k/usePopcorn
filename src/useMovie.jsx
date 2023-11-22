import { useState, useEffect } from "react"
// eslint-disable-next-line react-refresh/only-export-components
const KEY = "24dd88d3"
export function useMovie(query) {
  const [movies, setMovies] = useState([])

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const controller = new AbortController()
    async function fetchMovies() {
      try {
        setIsLoading(true)
        setError("")

        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          {
            signal: controller.signal,
          }
        )

        if (!res.ok) {
          throw new Error("Something went wrong with fetching movies")
        }

        const data = await res.json()
        if (data.Response === "False") {
          throw new Error("No movies found")
        }
        setMovies(data.Search)
        setError("")
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message)
        }
      } finally {
        setIsLoading(false)
      }
    }

    if (query.length < 3) {
      setMovies([])
      setError("")
      return
    }

    fetchMovies()

    return () => {
      controller.abort()
      setError("")
    }
  }, [query])
  return {
    movies,
    isLoading,
    error,
  }
}
