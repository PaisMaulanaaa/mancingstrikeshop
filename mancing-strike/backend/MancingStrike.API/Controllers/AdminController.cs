using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MongoDB.Driver;
using MancingStrike.API.Models;
using MancingStrike.API.Services;

namespace MancingStrike.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "admin")]
    public class AdminController : ControllerBase
    {
        private readonly MongoDBService _mongoService;

        public AdminController(MongoDBService mongoService)
        {
            _mongoService = mongoService;
        }

        [HttpGet("orders")]
        public async Task<IActionResult> GetAllOrders([FromQuery] string? status)
        {
            var filter = string.IsNullOrEmpty(status)
                ? Builders<Order>.Filter.Empty
                : Builders<Order>.Filter.Eq(o => o.Status, status);

            var orders = await _mongoService.Orders.Find(filter).SortByDescending(o => o.CreatedAt).ToListAsync();
            return Ok(orders);
        }

        [HttpPut("orders/{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(string id, [FromBody] UpdateStatusDto dto)
        {
            var update = Builders<Order>.Update.Set(o => o.Status, dto.Status);
            var result = await _mongoService.Orders.UpdateOneAsync(o => o.Id == id, update);

            if (result.MatchedCount == 0)
                return NotFound(new { message = "Pesanan tidak ditemukan" });

            return Ok(new { message = "Status pesanan berhasil diupdate" });
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStatistics()
        {
            var totalProducts = await _mongoService.Products.CountDocumentsAsync(Builders<Product>.Filter.Empty);
            var totalOrders = await _mongoService.Orders.CountDocumentsAsync(Builders<Order>.Filter.Empty);
            var pendingOrders = await _mongoService.Orders.CountDocumentsAsync(o => o.Status == "pending");
            var completedOrders = await _mongoService.Orders.CountDocumentsAsync(o => o.Status == "completed");

            var orders = await _mongoService.Orders.Find(Builders<Order>.Filter.Empty).ToListAsync();
            var totalRevenue = orders.Where(o => o.Status == "completed").Sum(o => o.TotalPrice);

            return Ok(new
            {
                totalProducts,
                totalOrders,
                pendingOrders,
                completedOrders,
                totalRevenue
            });
        }

        [HttpGet("customers")]
        public async Task<IActionResult> GetCustomers()
        {
            var customers = await _mongoService.Users.Find(u => u.Role == "customer").ToListAsync();
            return Ok(customers.Select(u => new { u.Id, u.Name, u.Email, u.CreatedAt }));
        }
    }

    public class UpdateStatusDto
    {
        public string Status { get; set; } = string.Empty;
    }
}