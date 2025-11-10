namespace MancingStrike.API.Models.DTOs
{
    public class CreateOrderDto
    {
        public List<OrderItemDto> Items { get; set; } = new();
        public string ShippingAddress { get; set; } = string.Empty;
    }

    public class OrderItemDto
    {
        public string ProductId { get; set; } = string.Empty;
        public int Quantity { get; set; }
    }
}