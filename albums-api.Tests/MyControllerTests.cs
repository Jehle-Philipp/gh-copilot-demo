using UnsecureApp.Controllers;

namespace albums_api.Tests;

public class MyControllerTests
{
    [Fact]
    public void ReadFile_ValidFile_ReturnsFileContent()
    {
        // Arrange
        var controller = new MyController();
        var filePath = Path.GetTempFileName();
        const string expectedContent = "album-data";
        File.WriteAllText(filePath, expectedContent);

        try
        {
            // Act
            var result = controller.ReadFile(filePath);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(expectedContent, result!.TrimEnd('\0'));
        }
        finally
        {
            File.Delete(filePath);
        }
    }

    [Fact]
    public void ReadFile_InvalidFile_ThrowsFileNotFoundException()
    {
        // Arrange
        var controller = new MyController();
        var missingFile = Path.Combine(Path.GetTempPath(), $"missing-{Guid.NewGuid()}.txt");

        // Act + Assert
        Assert.Throws<FileNotFoundException>(() => controller.ReadFile(missingFile));
    }

    [Fact]
    public void GetObject_DoesNotThrow()
    {
        // Arrange
        var controller = new MyController();

        // Act
        var exception = Record.Exception(() => controller.GetObject());

        // Assert
        Assert.Null(exception);
    }

    [Fact]
    public void GetProduct_WhenCommandHasNoConnection_ThrowsInvalidOperationException()
    {
        // Arrange
        var controller = new MyController();

        // Act + Assert
        Assert.Throws<InvalidOperationException>(() => controller.GetProduct("Test"));
    }
}
