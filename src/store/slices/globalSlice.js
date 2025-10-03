import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import i18n from "@i18n";
import { getCurrentCountry, setCurrentCountry } from "@utils/countryManager";
import { getCurrentLanguage, setCurrentLanguage } from "@utils/languageManager";
import { getCurrentCart, addItemToCart, removeItemFromCart, clearCart as clearCartStorage } from "@utils/cartManager";
import api from "@api/axios";
import { getStoredCountries, setStoredCountries } from "@utils/countriesManager";

// 🎯 Agregar al carrito
export const addToCart = createAsyncThunk(
  "global/addToCart",
  async ({ item, isAuthenticated }, { rejectWithValue }) => {
    const result = await addItemToCart(item, isAuthenticated);
    if (!result.added) return rejectWithValue("Ya tienes esta versión del curso en tu carrito");
    if (result.replaced) return "Versión actualizada en el carrito";
    return "Se añadió correctamente al carrito";
  }
);

// 🗑 Eliminar del carrito
export const removeFromCart = createAsyncThunk("global/removeFromCart", async ({ course_uuid, isAuthenticated }) => {
  await removeItemFromCart(course_uuid, isAuthenticated);
  return course_uuid;
});

// 🧼 Limpiar carrito
export const clearCart = createAsyncThunk("global/clearCart", async () => {
  clearCartStorage();
  return [];
});

// 🛒 Obtener carrito desde backend
export const fetchCart = createAsyncThunk("global/fetchCart", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/cart/list");
    return data?.data?.items || [];
  } catch {
    return rejectWithValue("No se pudo obtener el carrito");
  }
});

// 🌍 Obtener países (una vez, desde backend o localStorage)
export const fetchCountries = createAsyncThunk("global/fetchCountries", async (_, { rejectWithValue }) => {
  try {
    const stored = getStoredCountries();
    if (stored) return stored;

    const { data } = await api.get("/general/countries");
    const countries = data?.data || [];
    setStoredCountries(countries);
    return countries;
  } catch {
    return rejectWithValue("No se pudo obtener la lista de países");
  }
});

const initialState = {
  country: getCurrentCountry() || "PE",
  language: i18n.language || getCurrentLanguage() || "es",
  cart: getCurrentCart(),
  cartMessage: null,
  countries: getStoredCountries() || [],
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setCountry(state, action) {
      state.country = action.payload;
      setCurrentCountry(action.payload);
    },
    setLanguage(state, action) {
      state.language = action.payload;
      setCurrentLanguage(action.payload);
    },
    clearCartMessage(state) {
      state.cartMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cart = getCurrentCart();
        state.cartMessage = {
          id: Date.now(),
          type: "success",
          content: action.payload,
        };
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.cartMessage = {
          id: Date.now(),
          type: "info",
          content: action.payload,
        };
      })
      .addCase(removeFromCart.fulfilled, (state) => {
        state.cart = getCurrentCart();
        state.cartMessage = {
          id: Date.now(),
          type: "info",
          content: "Curso eliminado del carrito",
        };
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.cart = [];
        state.cartMessage = {
          id: Date.now(),
          type: "info",
          content: "Carrito limpiado",
        };
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.countries = action.payload;
      });
  },
});

export const { setCountry, setLanguage, clearCartMessage } = globalSlice.actions;

export default globalSlice.reducer;
