namespace GameStore.Api.DTOs;

public record GameDto (
    int Id,
    string Title,
    string Genre,
    decimal Price,
    DateOnly ReleaseDate
);
