using GameStore.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace GameStore.Api.Data;

public class DataContext(DbContextOptions<DataContext> options)
 : DbContext(options)
{
    public DbSet<Game> Games => Set<Game>(); 
    public DbSet<Genre> Genres => Set<Genre>();
}
