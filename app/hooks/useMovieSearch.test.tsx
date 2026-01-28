import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useMovieSearch } from "./useMovieSearch";

const originalFetch = globalThis.fetch;

const createFetchMock = (responseData: unknown, ok = true) =>
  vi.fn(() =>
    Promise.resolve({
      ok,
      json: () => Promise.resolve(responseData),
    }),
  ) as unknown as typeof fetch;

describe("useMovieSearch", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    globalThis.fetch = originalFetch;
  });

  it("fetches movies and maps them when a title is provided", async () => {
    const response = {
      Response: "True",
      Search: [
        {
          imdbID: "tt0372784",
          Title: "Batman Begins",
          Year: "2005",
          Type: "movie",
          Poster: "poster.jpg",
        },
      ],
    };

    const fetchMock = createFetchMock(response);
    globalThis.fetch = fetchMock;

    const { result, rerender } = renderHook(({ title }) => useMovieSearch(title), {
      initialProps: { title: "" },
    });

    rerender({ title: "batman begins" });

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(fetchMock).toHaveBeenCalledWith(
      "http://www.omdbapi.com/?apikey=827057cf&s=batman%20begins",
      expect.objectContaining({ signal: expect.any(Object) }),
    );
    expect(result.current.error).toBeNull();
    expect(result.current.movies).toEqual([
      {
        imdbID: "tt0372784",
        title: "Batman Begins",
        year: "2005",
        type: "movie",
        poster: "poster.jpg",
      },
    ]);
  });

  it("captures API errors when OMDb responds negatively", async () => {
    const response = {
      Response: "False",
      Error: "Movie not found!",
    };

    const fetchMock = createFetchMock(response);
    globalThis.fetch = fetchMock;

    const { result, rerender } = renderHook(({ title }) => useMovieSearch(title), {
      initialProps: { title: "" },
    });

    rerender({ title: "unknown film" });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.movies).toEqual([]);
    expect(result.current.error).toBe("Movie not found!");
  });

  it("clears movies without issuing a fetch when the title becomes empty", async () => {
    const response = {
      Response: "True",
      Search: [
        {
          imdbID: "tt0848228",
          Title: "The Avengers",
          Year: "2012",
          Type: "movie",
          Poster: "poster.jpg",
        },
      ],
    };

    const fetchMock = createFetchMock(response);
    globalThis.fetch = fetchMock;

    const { result, rerender } = renderHook(({ title }) => useMovieSearch(title), {
      initialProps: { title: "" },
    });

    rerender({ title: "avengers" });
    await waitFor(() => expect(result.current.movies).toHaveLength(1));

    rerender({ title: "" });
    await waitFor(() => expect(result.current.movies).toHaveLength(0));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result.current.error).toBeNull();
  });
});
