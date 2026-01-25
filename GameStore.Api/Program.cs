using GameStore.Api.DTOs;
using Microsoft.AspNetCore.Http.HttpResults;

const string GetGameEndpointName = "GetGame";

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

List<GameDto> games = [
    new (1, "The Witcher 3", "RPG", 39.99m, new DateOnly(2015, 5, 18)),
    new (2, "Cyberpunk 2077", "RPG", 59.99m, new DateOnly(2020, 12, 10)),
    new (3, "Minecraft", "Sandbox", 26.95m, new DateOnly(2011, 11, 18))
];


app.MapGet("/games", () => games);


app.MapGet("/games/{id}", (int id) => games.Find( g => g.Id == id))
    .WithName(GetGameEndpointName);

app.MapPost("/games", (CreateGameDto newGame) =>
{
    GameDto game = new (
        games.Count + 1,
        newGame.Title,
        newGame.Genre,
        newGame.Price,
        newGame.ReleaseDate
    );

    games.Add(game);

    return Results.CreatedAtRoute(GetGameEndpointName, new {id = game.Id}, game);
});

app.MapPut("/games/{id}", (int id, UpdateGameDto updatedGame) =>
{
    var index = games.FindIndex( g => g.Id == id);
    games[index] = new (
        id,
        updatedGame.Title,
        updatedGame.Genre,
        updatedGame.Price,
        updatedGame.ReleaseDate
    );

    return Results.NoContent();
});

app.MapDelete("/games/{id}", (int id) =>
{
    games.RemoveAll( g => g.Id == id);
    
    return Results.NoContent();
});

app.Run();
