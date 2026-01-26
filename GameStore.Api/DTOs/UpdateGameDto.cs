using System.ComponentModel.DataAnnotations;
using GameStore.Api.Attributes;

namespace GameStore.Api.DTOs;

public record UpdateGameDto(
    [Required][StringLength(50, MinimumLength = 2)] string Title,
    [Required][MaxLength(20)] string Genre,
    [Required][Range(1, 100)] decimal Price,
    [Required][DateRange] DateOnly ReleaseDate
);
