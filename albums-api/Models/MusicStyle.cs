namespace albums_api.Models
{
    public record Genre(int Id, string Name, string? Description)
    {
        private static readonly List<Genre> _genres = new()
        {
            new Genre(1, "Rock", "Guitar-driven music with strong rhythms"),
            new Genre(2, "Pop", "Mainstream popular music"),
            new Genre(3, "Jazz", "Improvisation-based music with swing rhythms"),
            new Genre(4, "Hip-Hop", "Rhythmic music with rap vocals"),
            new Genre(5, "Classical", "Orchestral and chamber music traditions"),
            new Genre(6, "Electronic", "Synthesizer and computer-generated music")
        };

        public static List<Genre> GetAll() => new List<Genre>(_genres);

        public static Genre? GetById(int id) => _genres.FirstOrDefault(g => g.Id == id);
    }
}
