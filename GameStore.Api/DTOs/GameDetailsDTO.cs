namespace GameStore.Api.DTOs;

public record GameDetailsDTO (
    int Id,
    string Title,
    int GenreId,
    decimal Price,
    DateOnly ReleaseDate
);
