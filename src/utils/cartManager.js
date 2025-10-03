import api from "@api/axios";

const CART_KEY = "cart";

// 🛒 Obtener carrito actual desde localStorage
export const getCurrentCart = () => {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
};

// 💾 Guardar carrito en localStorage
export const setCurrentCart = (cart) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

// 🧹 Limpiar el carrito local por completo
export const clearCart = () => {
  localStorage.removeItem(CART_KEY);
  console.log("🧼 Carrito local limpiado.");
};

// 🔍 Obtener lista del carrito remoto
const getRemoteCart = async () => {
  try {
    const { data } = await api.get("/cart/list");
    return data?.data?.items || [];
  } catch (err) {
    console.error("❌ Error al consultar /cart/list:", err);
    return [];
  }
};

// ➕ Agregar ítem al carrito
export const addItemToCart = async (item, isAuthenticated = false) => {
  const minimalItem = {
    course_uuid: item.course_uuid,
    is_lite: item.is_lite,
  };

  if (isAuthenticated) {
    const remoteCart = await getRemoteCart();
    const remoteItem = remoteCart.find((c) => c.course_uuid === item.course_uuid);

    if (remoteItem) {
      if (remoteItem.is_lite === item.is_lite) {
        console.log(`⚠️ Ya existe en backend: uuid=${item.course_uuid}, lite=${item.is_lite}`);
        return { added: false };
      } else {
        try {
          await api.post("/cart/add", { items: [minimalItem] }); // ✅ solo uuid + is_lite
          console.log(`🔁 Reemplazado en backend por nueva versión: uuid=${item.course_uuid}, lite=${item.is_lite}`);
          return { added: true, replaced: true };
        } catch (err) {
          console.error("❌ Error al reemplazar en backend:", err);
          return { added: false, error: true };
        }
      }
    }

    try {
      await api.post("/cart/add", { items: [minimalItem] }); // ✅ solo uuid + is_lite
      console.log("🛒 Agregado al backend.");
      return { added: true };
    } catch (err) {
      console.error("❌ Error al agregar al backend:", err);
      return { added: false, error: true };
    }
  } else {
    const cart = getCurrentCart();
    const existsLocal = cart.find((c) => c.course_uuid === item.course_uuid);

    if (existsLocal) {
      if (existsLocal.is_lite === item.is_lite) {
        console.log(`⚠️ Ya existe misma versión local: uuid=${item.course_uuid}, lite=${item.is_lite}`);
        return { added: false };
      } else {
        const updatedCart = cart.map((c) => (c.course_uuid === item.course_uuid ? item : c));
        setCurrentCart(updatedCart);
        console.log(`🔁 Reemplazado local por nueva versión: uuid=${item.course_uuid}, lite=${item.is_lite}`);
        return { added: true, replaced: true };
      }
    }

    const updatedCart = [...cart, item];
    setCurrentCart(updatedCart);
    console.log(`✅ Agregado al cart local: uuid=${item.course_uuid}, lite=${item.is_lite}`);
    return { added: true };
  }
};

// ❌ Eliminar ítem del carrito
export const removeItemFromCart = async (course_uuid, isAuthenticated = false) => {
  if (isAuthenticated) {
    try {
      await api.post("/cart/delete", { course_uuid });
      console.log("❌ Eliminado del cart backend.");
    } catch (err) {
      console.error("❌ Error al eliminar del backend:", err);
    }
  } else {
    const cart = getCurrentCart();
    const updatedCart = cart.filter((item) => item.course_uuid !== course_uuid);
    setCurrentCart(updatedCart);
    console.log(`🗑️ Eliminado del cart local: uuid=${course_uuid}`);
  }
};
