import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/search.tsx"),
    route("movie/:id", "routes/movie-details.tsx"),
] satisfies RouteConfig;
