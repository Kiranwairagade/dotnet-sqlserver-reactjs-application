namespace backend.DTOs
{
    public class TokenRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty; // Optional: If you're sending the old token
    }
}
