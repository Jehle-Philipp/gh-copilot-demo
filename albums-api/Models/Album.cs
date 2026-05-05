namespace albums_api.Models
{
    public record Album(int Id, string Title, Artist Artist, int year, double Price, string Image_url)
    {
        private static readonly List<Album> _albums = new()
        {
            new Album(1, "You, Me and an App Id", new Artist("Daprize", new DateTime(1998, 3, 10), "Seattle, USA"), 2024, 10.99, "https://aka.ms/albums-daprlogo"),
            new Album(2, "Seven Revision Army", new Artist("The Blue-Green Stripes", new DateTime(1992, 7, 24), "Austin, USA"), 2024, 13.99, "https://aka.ms/albums-containerappslogo"),
            new Album(3, "Scale It Up", new Artist("KEDA Club", new DateTime(1995, 11, 2), "Dublin, Ireland"), 2024, 13.99, "https://aka.ms/albums-kedalogo"),
            new Album(4, "Lost in Translation", new Artist("MegaDNS", new DateTime(1990, 1, 18), "Amsterdam, Netherlands"), 2023, 12.99, "https://aka.ms/albums-envoylogo"),
            new Album(5, "Lock Down Your Love", new Artist("V is for VNET", new DateTime(1989, 9, 6), "London, UK"), 2022, 12.99, "https://aka.ms/albums-vnetlogo"),
            new Album(6, "Sweet Container O' Mine", new Artist("Guns N Probeses", new DateTime(1987, 5, 30), "Los Angeles, USA"), 2021, 14.99, "https://aka.ms/albums-containerappslogo")
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
            return _albums.Where(a => a.year == targetYear).ToList();
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
