
// JwtMiddleware.cs (Fixed async warning)
using backend.Services; // ✅ Ensure correct namespace for IAuthService
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

public class JwtMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IConfiguration _configuration;

    public JwtMiddleware(RequestDelegate next, IConfiguration configuration)
    {
        _next = next;
        _configuration = configuration;
    }

    public async Task Invoke(HttpContext context, IAuthService authService)
    {
        var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

        if (!string.IsNullOrEmpty(token))
            await AttachUserToContext(context, authService, token);

        await _next(context);
    }

    private async Task AttachUserToContext(HttpContext context, IAuthService authService, string token)
    {
        try
        {
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"] ?? "");
            var principal = new JwtSecurityTokenHandler().ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false
            }, out _);

            var userId = int.Parse(principal.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            context.User = new ClaimsPrincipal(new ClaimsIdentity(principal.Claims, "jwt"));
        }
        catch (Exception)
        {
            // Log error
        }
        await Task.CompletedTask; // Explicitly mark as async
    }
}