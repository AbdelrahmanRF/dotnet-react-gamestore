using GameStore.Api.Data;
using GameStore.Api.DTOs;
using GameStore.Api.Models;
using Microsoft.EntityFrameworkCore;
namespace GameStore.Api.Endpoints;

public static class GamesEndpoints
{
    const string GetGameEndpointName = "GetGame";

    public static void MapGamesEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("games");

        group.MapGet("/", async (DataContext dbContext) 
            => await dbContext.Games
            .Include(game => game.Genre)
                .Select(game => new GameSummaryDto (
                    game.Id,
                    game.Title,
                    game.Genre!.Name,
                    game.Price,
                    game.ReleaseDate
                ))
                .AsNoTracking()
                .ToListAsync()
        );

        group.MapGet("/{id}", async (int id, DataContext dbContext) =>
        {
            var game = await dbContext.Games.FindAsync(id);

            return game is null ? Results.NotFound() : Results.Ok( 
                new GameDetailsDTO (
                    game.Id,
                    game.Title,
                    game.GenreId,
                    game.Price,
                    game.ReleaseDate
                )
            );
        })
        .WithName(GetGameEndpointName);

        group.MapPost("/", async (CreateGameDto newGame, DataContext dbContext) =>
        {
            Game game = new ()
            {
                Title = newGame.Title,
                GenreId = newGame.GenreId,
                Price = newGame.Price,
                ReleaseDate = newGame.ReleaseDate
            };

            dbContext.Games.Add(game);
            await dbContext.SaveChangesAsync();

            GameDetailsDTO gameDto = new (
                game.Id,
                game.Title,
                game.GenreId,
                game.Price,
                game.ReleaseDate
            );  

            return Results.CreatedAtRoute(GetGameEndpointName, new { id = gameDto.Id }, gameDto);
        });

        group.MapPut("/{id}", async (int id, UpdateGameDto updatedGame, DataContext dbContext) =>
        {
            var existingGame = await dbContext.Games.FindAsync(id);

            if (existingGame is null)
                return Results.NotFound();

            existingGame.Title = updatedGame.Title;
            existingGame.GenreId = updatedGame.GenreId;
            existingGame.Price = updatedGame.Price;
            existingGame.ReleaseDate = updatedGame.ReleaseDate;

            await dbContext.SaveChangesAsync();

            return Results.NoContent();
        });

        group.MapDelete("/{id}", async (int id, DataContext dbContext) =>
        {
            await dbContext.Games
                .Where(game => game.Id == id)
                .ExecuteDeleteAsync();
            
            return Results.NoContent();
        });

    }
}
