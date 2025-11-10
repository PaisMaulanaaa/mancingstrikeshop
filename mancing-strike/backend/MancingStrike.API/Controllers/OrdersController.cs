using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MongoDB.Driver;
using System.Security.Claims;
using MancingStrike.API.Models;
using MancingStrike.API.Models.DTOs;
using MancingStrike.API.Services;

namespace MancingStrike.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly MongoDBService _mongoService;

        public OrdersController(MongoDBService mongoService)
        {
            _mongoService = mongoService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userName = User.FindFirst(ClaimTypes.Name)?.Value;
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;

            var order = new Order
            {
                UserId = userId!,
                CustomerName = userName!,
                CustomerEmail = userEmail!,
                ShippingAddress = dto.ShippingAddress,
                Items = new List<OrderItem>(),
                Status = "pending",
                CreatedAt = DateTime.UtcNow
            };

            decimal totalPrice = 0;

            foreach (var item in dto.Items)
            {
                var product = await _mongoService.Products.Find(p => p.Id == item.ProductId).FirstOrDefaultAsync();
                if (product == null || product.Stock < item.Quantity)
                    return BadRequest(new { message = $"Produk {item.ProductId} tidak tersedia" });

                order.Items.Add(new OrderItem
                {
                    ProductId = product.Id!,
                    ProductName = product.Name,
                    Price = product.Price,
                    Quantity = item.Quantity
                });

                totalPrice += product.Price * item.Quantity;

                // Update stock
                var update = Builders<Product>.Update.Inc(p => p.Stock, -item.Quantity);
                await _mongoService.Products.UpdateOneAsync(p => p.Id == product.Id, update);
            }

            order.TotalPrice = totalPrice;
            await _mongoService.Orders.InsertOneAsync(order);

            return Ok(new { message = "Pesanan berhasil dibuat", order });
        }

        [HttpGet("my-orders")]
        public async Task<IActionResult> GetMyOrders()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var orders = await _mongoService.Orders.Find(o => o.UserId == userId).ToListAsync();
            return Ok(orders);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var order = await _mongoService.Orders.Find(o => o.Id == id).FirstOrDefaultAsync();
            if (order == null)
                return NotFound(new { message = "Pesanan tidak ditemukan" });

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            if (role != "admin" && order.UserId != userId)
                return Forbid();

            return Ok(order);
        }

        [HttpPut("{id}/cancel")]
        public async Task<IActionResult> CancelOrder(string id)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                // Cari pesanan
                var order = await _mongoService.Orders.Find(o => o.Id == id).FirstOrDefaultAsync();
                if (order == null)
                    return NotFound(new { message = "Pesanan tidak ditemukan" });

                // Validasi: hanya pemilik pesanan yang bisa membatalkan
                if (order.UserId != userId)
                    return Forbid();

                // Validasi: hanya pesanan dengan status 'pending' yang bisa dibatalkan
                if (order.Status != "pending")
                    return BadRequest(new { message = "Hanya pesanan dengan status 'Menunggu Konfirmasi' yang dapat dibatalkan" });

                // Kembalikan stok produk
                foreach (var item in order.Items)
                {
                    var update = Builders<Product>.Update.Inc(p => p.Stock, item.Quantity);
                    await _mongoService.Products.UpdateOneAsync(p => p.Id == item.ProductId, update);
                }

                // Update status pesanan menjadi 'cancelled'
                var orderUpdate = Builders<Order>.Update.Set(o => o.Status, "cancelled");
                await _mongoService.Orders.UpdateOneAsync(o => o.Id == id, orderUpdate);

                return Ok(new { message = "Pesanan berhasil dibatalkan dan stok produk telah dikembalikan" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Terjadi kesalahan saat membatalkan pesanan", error = ex.Message });
            }
        }
    }
}