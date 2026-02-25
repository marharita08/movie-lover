import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { MediaType } from "@/const";

import { MediaDetails } from "./MediaDetails";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("@/components", () => ({
  LoadingOverlay: () => <div data-testid="loading-overlay" />,
  ErrorState: ({ onRetry }: { onRetry: () => void }) => (
    <div data-testid="error-state">
      <button onClick={onRetry}>Retry</button>
    </div>
  ),
  Button: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick: () => void;
  }) => <button onClick={onClick}>{children}</button>,
}));

const movieMedia = {
  title: "Inception",
  tagline: "Your mind is the scene of the crime",
  overview: "A thief who steals corporate secrets...",
  genres: [{ id: 1, name: "Action" }],
  releaseDate: "2010-07-16",
  runtime: 148,
  voteAverage: 8.8,
  status: "Released",
  posterPath: "/poster.jpg",
  backdropPath: "/backdrop.jpg",
  productionCountries: [{ name: "USA" }],
  imdbId: "tt1375666",
};

const tvMedia = {
  name: "Breaking Bad",
  tagline: "",
  overview: "A high school chemistry teacher...",
  genres: [{ id: 2, name: "Drama" }],
  firstAirDate: "2008-01-20",
  lastAirDate: "2013-09-29",
  numberOfSeasons: 5,
  numberOfEpisodes: 62,
  voteAverage: 9.5,
  status: "Ended",
  posterPath: null,
  backdropPath: null,
  productionCountries: [],
  imdbId: null,
};

describe("MediaDetails", () => {
  const refetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows LoadingOverlay when isLoading is true", () => {
    render(
      <MediaDetails
        media={undefined}
        type={MediaType.MOVIE}
        isLoading={true}
        error={null}
        refetch={refetch}
      />,
    );
    expect(screen.getByTestId("loading-overlay")).toBeInTheDocument();
  });

  it("shows ErrorState when error is present", () => {
    render(
      <MediaDetails
        media={undefined}
        type={MediaType.MOVIE}
        isLoading={false}
        error={new Error("Not found")}
        refetch={refetch}
      />,
    );
    expect(screen.getByTestId("error-state")).toBeInTheDocument();
  });

  it("shows ErrorState when media is null", () => {
    render(
      <MediaDetails
        media={null}
        type={MediaType.MOVIE}
        isLoading={false}
        error={null}
        refetch={refetch}
      />,
    );
    expect(screen.getByTestId("error-state")).toBeInTheDocument();
  });

  it("calls refetch when retry is clicked", () => {
    render(
      <MediaDetails
        media={null}
        type={MediaType.MOVIE}
        isLoading={false}
        error={new Error("Error")}
        refetch={refetch}
      />,
    );
    fireEvent.click(screen.getByText("Retry"));
    expect(refetch).toHaveBeenCalled();
  });

  it("shows movie title", () => {
    render(
      <MediaDetails
        media={movieMedia as never}
        type={MediaType.MOVIE}
        isLoading={false}
        error={null}
        refetch={refetch}
      />,
    );
    expect(screen.getByText("Inception")).toBeInTheDocument();
  });

  it("shows TV show name", () => {
    render(
      <MediaDetails
        media={tvMedia as never}
        type={MediaType.TV}
        isLoading={false}
        error={null}
        refetch={refetch}
      />,
    );
    expect(screen.getByText("Breaking Bad")).toBeInTheDocument();
  });

  it("shows runtime for movie", () => {
    render(
      <MediaDetails
        media={movieMedia as never}
        type={MediaType.MOVIE}
        isLoading={false}
        error={null}
        refetch={refetch}
      />,
    );
    expect(screen.getByText("2h 28min")).toBeInTheDocument();
  });

  it("shows release date for movie", () => {
    render(
      <MediaDetails
        media={movieMedia as never}
        type={MediaType.MOVIE}
        isLoading={false}
        error={null}
        refetch={refetch}
      />,
    );
    expect(screen.getByText("16 Jul 2010")).toBeInTheDocument();
  });

  it("shows numberOfSeasons and numberOfEpisodes for TV show", () => {
    render(
      <MediaDetails
        media={tvMedia as never}
        type={MediaType.TV}
        isLoading={false}
        error={null}
        refetch={refetch}
      />,
    );
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("62")).toBeInTheDocument();
  });

  it("shows imdb link for movie", () => {
    render(
      <MediaDetails
        media={movieMedia as never}
        type={MediaType.MOVIE}
        isLoading={false}
        error={null}
        refetch={refetch}
      />,
    );
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      expect.stringContaining("tt1375666"),
    );
  });

  it("does not show imdb link when imdbId is null", () => {
    render(
      <MediaDetails
        media={tvMedia as never}
        type={MediaType.TV}
        isLoading={false}
        error={null}
        refetch={refetch}
      />,
    );
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("shows placeholder when no poster", () => {
    render(
      <MediaDetails
        media={tvMedia as never}
        type={MediaType.TV}
        isLoading={false}
        error={null}
        refetch={refetch}
      />,
    );
    expect(screen.getByText("No Image")).toBeInTheDocument();
  });

  it("navigates back on Back button click", () => {
    render(
      <MediaDetails
        media={movieMedia as never}
        type={MediaType.MOVIE}
        isLoading={false}
        error={null}
        refetch={refetch}
      />,
    );
    fireEvent.click(screen.getByText("Back"));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
