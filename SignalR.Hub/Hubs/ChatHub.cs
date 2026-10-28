using Microsoft.AspNetCore.SignalR; 
using SignalR.Shared.Contracts;

namespace SignalR.HubServer.Hubs;

public sealed class ChatHub 
    : Microsoft.AspNetCore.SignalR.Hub 
{ public async Task SendMessage( 
    string user, string message)
     {  
        if (string.IsNullOrWhiteSpace(user) || string.IsNullOrWhiteSpace(message)) 
        { 
            throw new HubException(  "El usuario y el mensaje son obligatorios."); 
            
        }

        user = user.Trim(); 
        message = message.Trim();

        if (user.Length > 40 || message.Length > 1000) 
        { 
            throw new HubException( "El mensaje supera el límite permitido."); 
        }

        var chatMessage = new ChatMessage( 
            user, 
            message,
            DateTimeOffset.UtcNow);

        await Clients.All.SendAsync( "ReceiveMessage", chatMessage); 
     }   // cierra el método 
 public async Task UpdateOrder(int orderId, string status)
 {
    if (orderId <= 0 || string.IsNullOrWhiteSpace(status))
    {
        throw new HubException("Los datos del pedido son obligatorios.");
    }

    status = status.Trim();

    if (status != "Pendiente" &&
        status != "En preparación" &&
        status != "Enviado" &&
        status != "Entregado")
    {
        throw new HubException("Estado del pedido no válido.");
    }

    var notification = new OrderNotification(
        orderId,
        status,
        DateTimeOffset.UtcNow);

    await Clients.All.SendAsync(
        "OrderUpdated",
        notification);
 } 
 
}   // cierra la clase

