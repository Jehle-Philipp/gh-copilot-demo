namespace albums_api.Models
{
    public record Artist(int Id, string Name, int? Age, string? Nationality)
    {
        private static readonly List<Artist> _artists = new()
        {
            new Artist(1, "Daprize", 26, "USA"),
            new Artist(2, "The Blue-Green Stripes", 32, "USA"),
            new Artist(3, "KEDA Club", 29, "Ireland"),
            new Artist(4, "MegaDNS", 34, "Netherlands"),
            new Artist(5, "V is for VNET", 37, "UK"),
            new Artist(6, "Guns N Probeses", 39, "USA")
        };

        public static List<Artist> GetAll() => new List<Artist>(_artists);

        public static Artist? GetById(int id) => _artists.FirstOrDefault(a => a.Id == id);
    }
}
