using System;
using GameStore.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace GameStore.Api.Data;

public static class DataExtensions
{
    public static void MigrateDB(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<DataContext>();

        dbContext.Database.Migrate();
    }

    public static void AddGameStoreDB(this WebApplicationBuilder builder)
    {
        var connString = builder.Configuration.GetConnectionString("GameStore");
        builder.Services.AddSqlite<DataContext>(
            connString,
            optionsAction: options => options.UseSeeding((context, _) =>
            {
                if (!context.Set<Genre>().Any())
                {
                    context.Set<Genre>().AddRange(
                        new Genre { Name = "Adventure"},
                        new Genre { Name = "Metroidvania"},
                        new Genre { Name = "Horror"},
                        new Genre { Name = "Action"},
                        new Genre { Name = "Puzzle"}
                    );

                    context.SaveChanges();
                }
            })
        );
    }
}
