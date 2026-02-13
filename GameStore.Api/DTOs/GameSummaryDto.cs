namespace GameStore.Api.DTOs;

public record GameSummaryDto (
    int Id,
    string Title,
    string Genre,
    decimal Price,
    DateOnly ReleaseDate
);
