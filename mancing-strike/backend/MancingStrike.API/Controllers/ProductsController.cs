using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MongoDB.Driver;
using MancingStrike.API.Models;
using MancingStrike.API.Services;

namespace MancingStrike.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly MongoDBService _mongoService;

        public ProductsController(MongoDBService mongoService)
        {
            _mongoService = mongoService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? category, [FromQuery] string? search)
        {
            var filter = Builders<Product>.Filter.Empty;

            if (!string.IsNullOrEmpty(category))
                filter &= Builders<Product>.Filter.Eq(p => p.Category, category);

            if (!string.IsNullOrEmpty(search))
                filter &= Builders<Product>.Filter.Regex(p => p.Name, new MongoDB.Bson.BsonRegularExpression(search, "i"));

            var products = await _mongoService.Products.Find(filter).ToListAsync();
            return Ok(products);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var product = await _mongoService.Products.Find(p => p.Id == id).FirstOrDefaultAsync();
            if (product == null)
                return NotFound(new { message = "Produk tidak ditemukan" });

            return Ok(product);
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Create([FromBody] Product product)
        {
            try
            {
                // Validasi input
                if (string.IsNullOrEmpty(product.Name))
                    return BadRequest(new { message = "Nama produk harus diisi" });

                if (product.Price <= 0)
                    return BadRequest(new { message = "Harga produk harus lebih dari 0" });

                if (product.Stock < 0)
                    return BadRequest(new { message = "Stok tidak boleh negatif" });

                product.Id = null; // Biarkan MongoDB generate ID
                product.CreatedAt = DateTime.UtcNow;
                await _mongoService.Products.InsertOneAsync(product);
                return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Terjadi kesalahan saat membuat produk", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Update(string id, [FromBody] Product product)
        {
            try
            {
                // Cek apakah produk ada
                var existingProduct = await _mongoService.Products.Find(p => p.Id == id).FirstOrDefaultAsync();
                if (existingProduct == null)
                    return NotFound(new { message = "Produk tidak ditemukan" });

                // Set ID dari parameter
                product.Id = id;

                // Replace product
                var result = await _mongoService.Products.ReplaceOneAsync(p => p.Id == id, product);

                if (result.MatchedCount == 0)
                    return NotFound(new { message = "Produk tidak ditemukan" });

                return Ok(product);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Terjadi kesalahan saat update produk", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Delete(string id)
        {
            try
            {
                var result = await _mongoService.Products.DeleteOneAsync(p => p.Id == id);

                if (result.DeletedCount == 0)
                    return NotFound(new { message = "Produk tidak ditemukan" });

                return Ok(new { message = "Produk berhasil dihapus" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Terjadi kesalahan saat hapus produk", error = ex.Message });
            }
        }
    }
}
