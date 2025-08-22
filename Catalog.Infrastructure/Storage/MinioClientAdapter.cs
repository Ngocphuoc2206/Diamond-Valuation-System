using Minio;
using Minio.DataModel.Args;
using System.IO;
using System.Threading.Tasks;

namespace Catalog.Infrastructure.Storage
{
    public class MinioClientAdapter
    {
        private readonly IMinioClient _client;

        public MinioClientAdapter(string endpoint, string accessKey, string secretKey)
        {
            _client = new MinioClient()
                .WithEndpoint(endpoint)
                .WithCredentials(accessKey, secretKey)
                .Build(); // Trả về IMinioClient
        }

        public async Task UploadAsync(string bucketName, string objectName, Stream stream)
        {
            bool found = await _client.BucketExistsAsync(new BucketExistsArgs().WithBucket(bucketName));

            if (!found)
                await _client.MakeBucketAsync(new MakeBucketArgs().WithBucket(bucketName));

            await _client.PutObjectAsync(new PutObjectArgs()
                .WithBucket(bucketName)
                .WithObject(objectName)
                .WithStreamData(stream)
                .WithObjectSize(stream.Length));
        }

        public async Task<Stream> DownloadAsync(string bucketName, string objectName)
        {
            var ms = new MemoryStream();
            await _client.GetObjectAsync(new GetObjectArgs()
                .WithBucket(bucketName)
                .WithObject(objectName)
                .WithCallbackStream(s => s.CopyTo(ms)));
            ms.Position = 0;
            return ms;
        }

        public async Task DeleteAsync(string bucketName, string objectName)
        {
            await _client.RemoveObjectAsync(new RemoveObjectArgs()
                .WithBucket(bucketName)
                .WithObject(objectName));
        }
    }
}
