namespace GameStore.Api.DTOs;

public record CreateGameDto(
    string Title,
    string Genre,
    decimal Price,
    DateOnly ReleaseDate
);
