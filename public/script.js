const API_BASE = "http://localhost:3000"; 
const token = localStorage.getItem("token");

// LOGOUT 
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "/login.html";
  });
}

// PERFIL 
async function fetchProfile() {
  try {
    const res = await fetch(`${API_BASE}/user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    if (res.ok) {
      document.getElementById("user-info").innerText =
        `¡Bienvenido ${data.user.email}! ✨`;
    } else {
      console.error("Error perfil:", data);
    }
  } catch (err) {
    console.error("Error fetchProfile:", err);
  }
}

// ORDENES
const ordersContainer = document.getElementById("orders-container");
async function fetchOrders() {
  try {
    const res = await fetch(`${API_BASE}/orders/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    if (!res.ok) {
      ordersContainer.innerHTML = `<p>${data.message || data.error}</p>`;
      return;
    }

    renderOrders(data.orders);
  } catch (err) {
    console.error("Error fetchOrders:", err);
    ordersContainer.innerHTML = `<p>Error al cargar las órdenes</p>`;
  }
}

function renderOrders(orders) {
  if (!orders || orders.length === 0) {
    ordersContainer.innerHTML = "<p>No hay órdenes en el carrito.</p>";
    return;
  }

  ordersContainer.innerHTML = orders
    .map(
      (order) => `
    <div class="card">
      <img 
        src="${order.imagenUrl}" 
        alt="Imagen" 
        onerror="this.onerror=null; this.src='https://via.placeholder.com/300x200?text=Imagen+no+disponible';"/>

      <p><strong>Tema:</strong> ${order.tema}</p>
      <p><strong>Artista:</strong> ${order.artista}</p>
      <p><strong>Estado:</strong> ${order.estado}</p>
      <p><strong>Precio:</strong> $${order.precio}</p>

      <div class="actions">
        <button onclick="editOrder('${order.id}')">Editar</button>
        <button onclick="deleteOrder('${order.id}')">Eliminar</button>
      </div>
    </div>
  `
    )
    .join("");
}

async function deleteOrder(id) {
  try {
    const res = await fetch(`${API_BASE}/orders/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    console.log("Delete response:", data);
    fetchOrders();
  } catch (err) {
    console.error("Error deleteOrder:", err);
  }
}

async function editOrder(id) {
  const newTema = prompt("Nuevo tema:");
  const newArtista = prompt("Nuevo artista:");
  const newImageUrl = prompt("Nueva URL de imagen:");
  const newFecha = prompt("Nueva fecha (YYYY-MM-DD):");

  if (!newTema || !newArtista || !newImageUrl) {
    alert("Campos obligatorios incompletos");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/orders/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        tipoImagen: "foto_personal", // simplificado por ahora
        imagenUrl: newImageUrl,
        tema: newTema,
        artista: newArtista,
        fecha: newFecha || "",
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(JSON.stringify(data.errors || data.error));
      return;
    }

    alert("Orden editada con éxito");
    fetchOrders();
  } catch (err) {
    console.error("Error editOrder:", err);
    alert("Error al editar la orden");
  }
}

// CREAR ORDEN 
const orderForm = document.getElementById("order-form");
if (orderForm) {
  orderForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const tipoImagen = document.getElementById("tipoImagen").value;
    const imageUrl = document.getElementById("imageUrl").value;
    const tema = document.getElementById("tema").value;
    const artista = document.getElementById("artista").value;
    const fecha = document.getElementById("fecha").value;

    console.log("Datos enviados:", { tipoImagen, imageUrl, tema, artista, fecha });

    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tipoImagen,
          imagenUrl: imageUrl,
          tema,
          artista,
          fecha,
        }),
      });

      const data = await res.json();
      console.log("Respuesta backend:", data);

      const msg = document.getElementById("order-message");
      if (!res.ok) {
        msg.innerText = JSON.stringify(data.errors || data.error);
        return;
      }

      msg.innerText = "Orden creada con éxito";
      orderForm.reset();
      fetchOrders();
    } catch (err) {
      document.getElementById("order-message").innerText = "Error al crear la orden";
      console.error(err);
    }
  });
}
// LOGIN 
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMsg = document.getElementById("login-error");

    try {
      const res = await fetch(`${API_BASE}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (errorMsg) errorMsg.innerText = data.error || data.message || "Credenciales incorrectas";
        return;
      }

      localStorage.setItem("token", data.token);
      window.location.href = "/index.html";
    } catch (err) {
      console.error(err);
      if (errorMsg) errorMsg.innerText = "Error de conexión";
    }
  });
}

// CHECK LOGIN
function checkLogin() {
  const token = localStorage.getItem("token");

  // Solo redirigimos si estamos en index.html y no hay token
  if (!token && window.location.pathname !== "/login.html") {
    window.location.href = "/login.html";
  }
}

checkLogin(); // Llamamos al cargar la página

// INICIAL 
if (token) {
  fetchProfile();
  fetchOrders();
}