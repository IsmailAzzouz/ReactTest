import type { Route } from "./+types/search";
import type { FormEvent } from "react";
import { useState } from "react";

import { Alert, Box, Button, Container, List, Stack, TextField, Typography } from "@mui/material";

import { MovieResultItem } from "../components/movies/movie-result-item";
import { useMovieSearch } from "../hooks/useMovieSearch";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Search Movies" },
    {
      name: "description",
      content: "Search for a movie title using the Material UI form.",
    },
  ];
}

export default function SearchRoute() {
  const [query, setQuery] = useState("");
  const [lastSearch, setLastSearch] = useState("");
  const { movies, isLoading, error } = useMovieSearch(lastSearch);
  const hasResults = movies.length > 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setLastSearch("");
      return;
    }
    setLastSearch(trimmedQuery);
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        py: 6,
      }}
    >
      <Stack spacing={4}>
        <Stack spacing={1}>
          <Typography variant="h6">Search movies</Typography>
        </Stack>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              fullWidth
              label="Movie Title"
              variant="outlined"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{ minWidth: { xs: "100%", sm: 140 } }}
            >
              Search
            </Button>
          </Stack>
        </Box>
        <Box>
          <Stack spacing={2}>
            <Typography variant="h6">
              {lastSearch ? `Results for "${lastSearch}"` : "Search results"}
            </Typography>
            {error ? (
              <Alert severity="error">{error}</Alert>
            ) : hasResults ? (
              <List disablePadding>
                {movies.map((movie) => (
                  <MovieResultItem key={movie.imdbID} movie={movie} />
                ))}
              </List>
            ) : lastSearch ? (
              <Alert severity="info">No matches for "{lastSearch}". Try another title.</Alert>
            ) : (
              <Typography variant="body1" color="text.secondary">
                Results will appear here after you search for a movie.
              </Typography>
            )}
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}
