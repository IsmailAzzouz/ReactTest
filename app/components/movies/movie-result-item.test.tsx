import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import { MovieResultItem } from "./movie-result-item";

describe("MovieResultItem", () => {
  const createMovie = (overrides = {}) => ({
    imdbID: "id-123",
    title: "Batman Begins",
    year: "2005",
    type: "movie",
    poster: "poster.jpg",
    ...overrides,
  });

  it("renders the movie title, year, and uppercase type", () => {
    const movie = createMovie();
    render(
      <MemoryRouter>
        <MovieResultItem movie={movie} />
      </MemoryRouter>
    );

    expect(screen.getByText("Batman Begins")).toBeDefined();
    expect(screen.getByText("2005")).toBeDefined();

    const avatar = screen.getByRole("img", { name: "Batman Begins" });
    expect(avatar).toBeDefined();
  });

  it("shows the fallback initial when poster is unavailable", () => {
    const movie = createMovie({ title: "Guardians", poster: "N/A" });
    render(
      <MemoryRouter>
        <MovieResultItem movie={movie} />
      </MemoryRouter>
    );

    const fallbackInitial = screen
      .getAllByText("G")
      .find((element) => element.classList.contains("MuiAvatar-root"));
    expect(fallbackInitial).toBeDefined();
  });

  it("uses a question mark when the title is empty", () => {
    const movie = createMovie({
      title: "   ",
      poster: "N/A",
      year: "",
      type: "",
    });
    render(
      <MemoryRouter>
        <MovieResultItem movie={movie} />
      </MemoryRouter>
    );

    const fallbackInitial = screen
      .getAllByText("?")
      .find((element) => element.classList.contains("MuiAvatar-root"));
    expect(fallbackInitial).toBeDefined();
    expect(screen.getByText("Untitled")).toBeDefined();
    expect(screen.getByText("UNKNOWN")).toBeDefined();
  });
});
