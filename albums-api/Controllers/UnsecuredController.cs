using Microsoft.Data.SqlClient;
using System.Data;
using System.Runtime.Serialization.Formatters.Binary;
using System.Text;
using System.Threading;

namespace UnsecureApp.Controllers
{
    public class MyController
    {

        public string? ReadFile(string userInput)
        {
            using FileStream fileStream = OpenFileStream(userInput);

            return ReadFirstChunk(fileStream);
        }

        public async Task<string?> ReadFileAsync(string userInput, CancellationToken cancellationToken = default)
        {
            await using FileStream fileStream = OpenFileStream(userInput);

            return await ReadFirstChunkAsync(fileStream, cancellationToken);
        }

        public int GetProduct(string productName)
        {
            using SqlConnection connection = CreateConnection();
            using SqlCommand sqlCommand = CreateProductCommand(productName);
            using SqlDataReader reader = sqlCommand.ExecuteReader();

            return reader.GetInt32(0);
        }

        public async Task<int> GetProductAsync(string productName, CancellationToken cancellationToken = default)
        {
            using SqlConnection connection = CreateConnection();
            using SqlCommand sqlCommand = CreateProductCommand(productName);
            using SqlDataReader reader = await sqlCommand.ExecuteReaderAsync(cancellationToken);

            return await reader.GetFieldValueAsync<int>(0, cancellationToken);
        }

        public void GetObject()
        {
            try
            {
                CallToStringOnNullObject();
            }
            catch (Exception e)
            {
                LogException(e);
            }
        
        }

        private static FileStream OpenFileStream(string path)
        {
            return File.Open(path, FileMode.Open);
        }

        private static string? ReadFirstChunk(Stream stream)
        {
            byte[] buffer = CreateReadBuffer();
            UTF8Encoding encoding = CreateUtf8Encoding();

            while (stream.Read(buffer, 0, buffer.Length) > 0)
            {
                return DecodeBuffer(encoding, buffer);
            }

            return null;
        }

        private static async Task<string?> ReadFirstChunkAsync(Stream stream, CancellationToken cancellationToken)
        {
            byte[] buffer = CreateReadBuffer();
            UTF8Encoding encoding = CreateUtf8Encoding();

            while (await stream.ReadAsync(buffer.AsMemory(0, buffer.Length), cancellationToken) > 0)
            {
                return DecodeBuffer(encoding, buffer);
            }

            return null;
        }

        private static byte[] CreateReadBuffer()
        {
            return new byte[1024];
        }

        private static UTF8Encoding CreateUtf8Encoding()
        {
            return new UTF8Encoding(true);
        }

        private static string DecodeBuffer(UTF8Encoding encoding, byte[] buffer)
        {
            return encoding.GetString(buffer);
        }

        private SqlConnection CreateConnection()
        {
            return new SqlConnection(connectionString);
        }

        private static SqlCommand CreateProductCommand(string productName)
        {
            return new SqlCommand
            {
                CommandText = BuildGetProductQuery(productName),
                CommandType = CommandType.Text,
            };
        }

        private static string BuildGetProductQuery(string productName)
        {
            return "SELECT ProductId FROM Products WHERE ProductName = '" + productName + "'";
        }

        private static void CallToStringOnNullObject()
        {
            object? o = null;
            o!.ToString();
        }

        private static void LogException(Exception exception)
        {
            Console.WriteLine(exception.ToString());
        }

        private string connectionString = "";
    }
}