namespace GameStore.Api.DTOs;

public record UpdateGameDto(
    string Title,
    string Genre,
    decimal Price,
    DateOnly ReleaseDate
);
