using System;
using System.Collections.Generic;

namespace backend.Models
{
    public class ChatRequest
    {
        public string Query { get; set; } = string.Empty;
        public string ConversationId { get; set; } = string.Empty;
    }

    public class ChatResponse
    {
        public string Text { get; set; } = string.Empty;
        public bool RequiresAuthentication { get; set; }
        public List<ChatSuggestion> Suggestions { get; set; } = new List<ChatSuggestion>();
        public object Data { get; set; } = string.Empty;
    }

    public class ChatSuggestion
    {
        public string Text { get; set; } = string.Empty;
        public string Action { get; set; } = string.Empty;
    }

    public class ChatConversation
    {
        public string Id { get; set; } = string.Empty;
        public List<ChatMessage> Messages { get; set; } = new List<ChatMessage>();
        public DateTime CreatedAt { get; set; }
        public DateTime LastUpdated { get; set; }
    }

    public class ChatMessage
    {
        public string Role { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
    }
}