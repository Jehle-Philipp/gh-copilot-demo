namespace albums_api.Models
{
    public record Album(int Id, string Title, int ArtistId, int GenreId, int? ReleaseYear)
    {
        private static readonly List<Album> _albums = new()
        {
            new Album(1, "You, Me and an App Id", 1, 6, 2024),
            new Album(2, "Seven Revision Army", 2, 1, 2024),
            new Album(3, "Scale It Up", 3, 6, 2024),
            new Album(4, "Lost in Translation", 4, 3, 2023),
            new Album(5, "Lock Down Your Love", 5, 2, 2022),
            new Album(6, "Sweet Container O' Mine", 6, 1, 2021)
        };

        public static List<Album> GetAll()
        {
            return new List<Album>(_albums);
        }

        public static Album? GetById(int id)
        {
            return _albums.FirstOrDefault(a => a.Id == id);
        }

        public static List<Album> GetByYear(int targetYear)
        {
            return _albums.Where(a => a.ReleaseYear == targetYear).ToList();
        }

        public static Album Create(Album album)
        {
            var nextId = _albums.Count == 0 ? 1 : _albums.Max(a => a.Id) + 1;
            var createdAlbum = album with { Id = nextId };
            _albums.Add(createdAlbum);
            return createdAlbum;
        }

        public static Album? Update(int id, Album album)
        {
            var existingIndex = _albums.FindIndex(a => a.Id == id);
            if (existingIndex < 0)
            {
                return null;
            }

            var updatedAlbum = album with { Id = id };
            _albums[existingIndex] = updatedAlbum;
            return updatedAlbum;
        }

        public static bool Delete(int id)
        {
            var removedCount = _albums.RemoveAll(a => a.Id == id);
            return removedCount > 0;
        }
    }
}
