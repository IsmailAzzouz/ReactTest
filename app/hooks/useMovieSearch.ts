import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const OMDB_ENDPOINT = "http://www.omdbapi.com/?apikey=827057cf&s=";

export interface MovieSummary {
  imdbID: string;
  title: string;
  year: string;
  type: string;
  poster: string;
}

interface OmdbMovie {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;
  Poster: string;
}

interface OmdbResponse {
  Search?: OmdbMovie[];
  Error?: string;
  Response: "True" | "False";
}

const toMovieSummary = (movie: OmdbMovie): MovieSummary => ({
  imdbID: movie.imdbID,
  title: movie.Title,
  year: movie.Year,
  type: movie.Type,
  poster: movie.Poster,
});

export interface MovieSearchResult {
  movies: MovieSummary[];
  isLoading: boolean;
  error: string | null;
  refetch(): void;
}

/**
 * Fetches movies from the OMDb API whenever the provided title changes.
 * Returns the movie list, loading state, error message, and a refetch handler.
 */
export function useMovieSearch(title: string): MovieSearchResult {
  const [movies, setMovies] = useState<MovieSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const latestTitle = useRef(title);
  const controllerRef = useRef<AbortController | null>(null);

  const normalizedTitle = useMemo(() => title.trim(), [title]);

  const fetchMovies = useCallback(async (currentTitle: string) => {
    controllerRef.current?.abort();

    if (!currentTitle) {
      setMovies([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${OMDB_ENDPOINT}${encodeURIComponent(currentTitle)}`, {
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data: OmdbResponse = await response.json();

      if (data.Response === "False") {
        setMovies([]);
        setError(data.Error ?? "No movies found.");
        return;
      }

      setMovies((data.Search ?? []).map(toMovieSummary));
    } catch (err) {
      if (controller.signal.aborted) return;

      const message = err instanceof Error ? err.message : "Unknown error occurred.";
      setError(message);
      setMovies([]);
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    latestTitle.current = normalizedTitle;
    void fetchMovies(normalizedTitle);

    return () => controllerRef.current?.abort();
  }, [normalizedTitle, fetchMovies]);

  const refetch = useCallback(() => {
    void fetchMovies(latestTitle.current);
  }, [fetchMovies]);

  return {
    movies,
    isLoading,
    error,
    refetch,
  };
}
