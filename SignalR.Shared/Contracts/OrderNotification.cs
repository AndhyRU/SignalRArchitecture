namespace SignalR.Shared.Contracts;

public sealed record OrderNotification(
    int OrderId,
    string Status,
    DateTimeOffset UpdatedAt);