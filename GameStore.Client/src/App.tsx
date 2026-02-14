import { useState, useEffect } from 'react';
import './App.css';

interface Genre {
  id: number;
  name: string;
}

interface Game {
  id: number;
  title: string;
  genre: string;
  price: number;
  releaseDate: string;
}

interface GameDetails {
  id: number;
  title: string;
  genreId: number;
  price: number;
  releaseDate: string;
}

interface GameFormData {
  title: string;
  genreId: number;
  price: number;
  releaseDate: string;
}

function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<GameDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<GameFormData>({
    title: '',
    genreId: 0,
    price: 0,
    releaseDate: new Date().toISOString().split('T')[0]
  });


  useEffect(() => {
    fetchGames();
    fetchGenres();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await fetch('api/games');
      const data = await response.json();
      setGames(data);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await fetch('api/genres');
      const data = await response.json();
      setGenres(data);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const openModal = (game?: GameDetails) => {
    if (game) {
      setEditingGame(game);
      setFormData({
        title: game.title,
        genreId: game.genreId,
        price: game.price,
        releaseDate: game.releaseDate
      });
    } else {
      setEditingGame(null);
      setFormData({
        title: '',
        genreId: genres[0]?.id || 0,
        price: 0,
        releaseDate: new Date().toISOString().split('T')[0]
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingGame(null);
    setFormData({
      title: '',
      genreId: 0,
      price: 0,
      releaseDate: new Date().toISOString().split('T')[0]
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = editingGame
        ? `api/games/${editingGame.id}`
        : `api/games`;
      
      const method = editingGame ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchGames();
        closeModal();
      }
    } catch (error) {
      console.error('Error saving game:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this game?')) return;

    try {
      await fetch(`api/games/${id}`, {
        method: 'DELETE',
      });
      await fetchGames();
    } catch (error) {
      console.error('Error deleting game:', error);
    }
  };

  const handleEdit = async (id: number) => {
    try {
      const response = await fetch(`api/games/${id}`);
      const gameDetails: GameDetails = await response.json();
      openModal(gameDetails);
    } catch (error) {
      console.error('Error fetching game details:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <div className="header-content">
            <h1 className="title">
              <span className="title-main">Game Store</span>
              <span className="title-sub">Management System</span>
            </h1>
            <button className="btn-new" onClick={() => openModal()}>
              <span className="btn-icon">+</span>
              New Game
            </button>
          </div>
        </header>

        <div className="table-container">
          <table className="games-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Genre</th>
                <th>Price</th>
                <th>Release Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {games.length === 0 ? (
                <tr>
                  <td colSpan={5} className="empty-state">
                    No games found. Click "New Game" to add one.
                  </td>
                </tr>
              ) : (
                games.map((game, index) => (
                  <tr key={game.id} style={{ animationDelay: `${index * 0.05}s` }}>
                    <td className="game-title">{game.title}</td>
                    <td>
                      <span className="genre-badge">{game.genre}</span>
                    </td>
                    <td className="price">${game.price.toFixed(2)}</td>
                    <td className="date">{formatDate(game.releaseDate)}</td>
                    <td className="actions">
                      <button
                        className="btn-action btn-edit"
                        onClick={() => handleEdit(game.id)}
                        title="Edit"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M11.333 2.00004C11.5081 1.82494 11.716 1.68605 11.9447 1.59129C12.1735 1.49653 12.4187 1.44775 12.6663 1.44775C12.914 1.44775 13.1592 1.49653 13.3879 1.59129C13.6167 1.68605 13.8246 1.82494 13.9997 2.00004C14.1748 2.17513 14.3137 2.383 14.4084 2.61178C14.5032 2.84055 14.552 3.08575 14.552 3.33337C14.552 3.58099 14.5032 3.82619 14.4084 4.05497C14.3137 4.28374 14.1748 4.49161 13.9997 4.66671L4.99967 13.6667L1.33301 14.6667L2.33301 11L11.333 2.00004Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button
                        className="btn-action btn-delete"
                        onClick={() => handleDelete(game.id)}
                        title="Delete"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M2 4H3.33333H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M5.33301 4.00004V2.66671C5.33301 2.31309 5.47348 1.97395 5.72353 1.7239C5.97358 1.47385 6.31272 1.33337 6.66634 1.33337H9.33301C9.68663 1.33337 10.0258 1.47385 10.2758 1.7239C10.5259 1.97395 10.6663 2.31309 10.6663 2.66671V4.00004M12.6663 4.00004V13.3334C12.6663 13.687 12.5259 14.0261 12.2758 14.2762C12.0258 14.5262 11.6866 14.6667 11.333 14.6667H4.66634C4.31272 14.6667 3.97358 14.5262 3.72353 14.2762C3.47348 14.0261 3.33301 13.687 3.33301 13.3334V4.00004H12.6663Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingGame ? 'Edit Game' : 'New Game'}</h2>
              <button className="btn-close" onClick={closeModal}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  minLength={2}
                  maxLength={50}
                  placeholder="Enter game title"
                />
              </div>

              <div className="form-group">
                <label htmlFor="genre">Genre</label>
                <select
                  id="genre"
                  value={formData.genreId}
                  onChange={(e) => setFormData({ ...formData, genreId: parseInt(e.target.value) })}
                  required
                >
                  <option value="">Select a genre</option>
                  {genres.map((genre) => (
                    <option key={genre.id} value={genre.id}>
                      {genre.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">Price</label>
                  <input
                    type="number"
                    id="price"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    required
                    min={1}
                    max={100}
                    step={0.01}
                    placeholder="0.00"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="releaseDate">Release Date</label>
                  <input
                    type="date"
                    id="releaseDate"
                    value={formData.releaseDate}
                    onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : editingGame ? 'Update Game' : 'Create Game'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;