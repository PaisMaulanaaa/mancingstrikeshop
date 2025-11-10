using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using BCrypt.Net;
using MancingStrike.API.Models;
using MancingStrike.API.Models.DTOs;
using MancingStrike.API.Services;

namespace MancingStrike.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly MongoDBService _mongoService;
        private readonly JwtService _jwtService;

        public AuthController(MongoDBService mongoService, JwtService jwtService)
        {
            _mongoService = mongoService;
            _jwtService = jwtService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            var existingUser = await _mongoService.Users
                .Find(u => u.Email == dto.Email).FirstOrDefaultAsync();

            if (existingUser != null)
                return BadRequest(new { message = "Email sudah terdaftar" });

            var user = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = "customer",
                CreatedAt = DateTime.UtcNow
            };

            await _mongoService.Users.InsertOneAsync(user);

            var token = _jwtService.GenerateToken(user);

            return Ok(new
            {
                message = "Registrasi berhasil",
                token,
                user = new { user.Id, user.Name, user.Email, user.Role }
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _mongoService.Users
                .Find(u => u.Email == dto.Email).FirstOrDefaultAsync();

            if (user == null)
                return Unauthorized(new { message = "Email atau password salah" });

            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return Unauthorized(new { message = "Email atau password salah" });

            var token = _jwtService.GenerateToken(user);

            return Ok(new
            {
                message = "Login berhasil",
                token,
                user = new { user.Id, user.Name, user.Email, user.Role }
            });
        }
    }
}
