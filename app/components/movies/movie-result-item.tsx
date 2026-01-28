import Avatar from "@mui/material/Avatar";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

import type { MovieSummary } from "../../hooks/useMovieSearch";

export interface MovieResultItemProps {
  movie: MovieSummary;
}

export function MovieResultItem({ movie }: MovieResultItemProps) {
  const posterSrc = movie.poster !== "N/A" ? movie.poster : undefined;
  const trimmedTitle = movie.title.trim();
  const fallbackInitial = trimmedTitle.charAt(0).toUpperCase() || "?";
  const primaryText = trimmedTitle || "Untitled";
  const secondaryText = movie.year || "UNKNOWN";

  return (
    <ListItem alignItems="flex-start" disableGutters sx={{ py: 1 }}>
      <ListItemAvatar>
        <Avatar
          variant="rounded"
          src={posterSrc}
          alt={movie.title}
          sx={{ width: 56, height: 80, fontWeight: 600 }}
        >
          {fallbackInitial}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        sx={{ px: 2 }}
        primary={
          <Typography variant="subtitle1" component="span" fontWeight={600}>
            {primaryText}
          </Typography>
        }
        secondary={
          <Typography variant="body2" color="text.secondary">
            {secondaryText}
          </Typography>
        }
      />
    </ListItem>
  );
}
