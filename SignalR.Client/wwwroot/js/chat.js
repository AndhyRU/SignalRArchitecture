"use strict";
const connection = 
   new signalR.HubConnectionBuilder()
   .withUrl("https://localhost:7001/chatHub")
   .withAutomaticReconnect()
   .build();

const sendButton =
    document.getElementById("sendButton");
const status =
    document.getElementById("status");
const messagesList =
    document.getElementById("messagesList");

connection.on("ReceiveMessage", (message) => 
    {
        const item = document.createElement("li");

        const hora = new Date(message.sentAt)
        .toLocaleTimeString();
        
        item.textContent =
        `${message.user}: ${message.message} (${hora})`;
        messagesList.appendChild(item);
    });

connection.on("OrderUpdated", (notification) => {
    const item = document.createElement("li");

    const hora = new Date(notification.updatedAt)
        .toLocaleTimeString();

    item.textContent =
        `Pedido #${notification.orderId}: ${notification.status} (${hora})`;

    ordersList.appendChild(item);
});    


connection.onreconnecting(() => {
status.textContent = "Reconectando...";
sendButton.disabled = true;
updateOrderButton.disabled = true;
});

connection.onreconnected(() => {
status.textContent = "Conectado";
sendButton.disabled = false;
updateOrderButton.disabled = false;
});

async function startConnection() 
{
    try 
    {
        await connection.start();
        status.textContent = "Conectado";
        sendButton.disabled = false;
        updateOrderButton.disabled = false;
    } 

    catch (error) 
    {
        status.textContent = "Error de conexión";
        console.error(error);
        sendButton.disabled = true;
        updateOrderButton.disabled = true;
    }
}

sendButton.addEventListener("click", async () => {
const user = document
.getElementById("userInput").value.trim();
const message = document
.getElementById("messageInput").value.trim();

if (!user || !message) {
alert("Completa el usuario y el mensaje.");
return;
}

if (connection.state !==
signalR.HubConnectionState.Connected) {
alert("No existe una conexión activa.");
return;
}

try {
await connection.invoke(
"SendMessage", user, message);
document.getElementById("messageInput")
.value = "";
} catch (error) {
console.error(
"No se pudo enviar el mensaje:", error);
}
});
startConnection();

const orderIdInput = document.getElementById("orderId");
const orderStatusInput = document.getElementById("orderStatus");
const updateOrderButton = document.getElementById("updateOrderButton");
const ordersList = document.getElementById("ordersList");

updateOrderButton.addEventListener("click", async () => {
    const orderId = Number(orderIdInput.value);
    const status = orderStatusInput.value;

    if (!Number.isInteger(orderId) || orderId <= 0) {
        alert("Introduce un número de pedido válido.");
        return;
    }

    try {
        await connection.invoke("UpdateOrder", orderId, status);
    } catch (error) {
        alert("Error al actualizar el pedido: " + error.message);
    }
});

