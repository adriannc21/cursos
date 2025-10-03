import "./ShoppingCart.css";
import { useEffect, useState } from "react";
import { useAuth } from "@contexts/AuthContext";
import { fetchCart, removeFromCart } from "@store/slices/globalSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faCartShopping, faTicket } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import api from "@api/axios";

function ShoppingCart() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const cart = useSelector((state) => state.global.cart);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [discount, setDiscount] = useState({
    amount: 0,
    type_id: null,
    label: null,
    course_uuid: null,
  });
  const [loadingCoupon, setLoadingCoupon] = useState(false);

  const currencyMatch = cart[0]?.price.match(/^[^\d]+/);
  const currency = currencyMatch ? currencyMatch[0].trim() : "";

  const subtotal = cart.reduce((sum, item) => {
    const priceNumber = parseFloat(item.price.replace(/[^0-9.,]/g, "").replace(",", "."));
    return sum + priceNumber;
  }, 0);

  let total = subtotal;

  if (discount.amount > 0) {
    if (discount.course_uuid) {
      const target = cart.find((c) => c.course_uuid === discount.course_uuid);
      if (target) {
        const targetPrice = parseFloat(target.price.replace(/[^0-9.,]/g, "").replace(",", "."));
        if (discount.type_id === 1) total -= discount.amount;
        if (discount.type_id === 2) total -= targetPrice * (discount.amount / 100);
      }
    } else {
      if (discount.type_id === 1) total = subtotal - discount.amount;
      if (discount.type_id === 2) total = subtotal - subtotal * (discount.amount / 100);
    }
  }

  if (total < 0) total = 0;

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchCart());
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    if (!window.Culqi) return;

    const publicKey = import.meta.env.VITE_CULQI_PUBLIC_KEY;
    if (!publicKey) return;

    window.Culqi.publicKey = publicKey;
    window.Culqi.settings({
      title: "K3D LAB",
      currency: "PEN",
      amount: Math.round(total * 100),
    });

    window.Culqi.options({
      lang: "es",
      installments: false,
      paymentMethods: {
        tarjeta: true,
        yape: false,
        agente: false,
        bancaMovil: false,
        billetera: false,
        cuotealo: false,
      },
      style: {
        logo: "https://cursos.krear3d.com/k3dlab-culqi.png",
        bannerColor: "#000000",
        buttonBackground: "#ff6600",
      },
    });

    window.culqi = async function () {
      if (!window.Culqi.token) return;

      const tokenId = window.Culqi.token.id;
      const email = window.Culqi.token.email;

      if (!window.Culqi3DS) return;

      if (window.Culqi3DS.reset) {
        window.Culqi3DS.reset();
      }

      window.Culqi3DS.publicKey = publicKey;
      window.Culqi3DS.settings = {
        charge: {
          totalAmount: Math.round(total * 100),
          currency: "PEN",
          returnUrl: window.location.origin + "/carrito-de-compras",
        },
        card: { email },
      };

      const deviceId = await window.Culqi3DS.generateDevice();

      const res = await api.post("/cart/checkout", {
        token: tokenId,
        device_finger_print_id: deviceId,
        coupon_code: appliedCoupon || null,
      });

      if (res.status === 201) {
        window.Culqi.close();
        setShowSuccessModal(true);
        dispatch(fetchCart());
        return;
      }

      if (res.status === 200) {
        window.Culqi.close();

        const on3DSMessage = async (event) => {
          if (!event.data) return;

          const response = event.data;

          if (response.loading) return;

          if (response.error) {
            console.error("❌ Error en autenticación 3DS:", response.error);
            window.removeEventListener("message", on3DSMessage);
            return;
          }

          if (response.parameters3DS) {
            try {
              const res3ds = await api.post("/cart/checkout/3ds", {
                token: tokenId,
                device_finger_print_id: deviceId,
                authentication_3DS: response.parameters3DS,
              });

              if (res3ds.status === 201) {
                setShowSuccessModal(true);
                dispatch(fetchCart());
              }
            } catch (err) {
              console.error("❌ Error procesando autenticación 3DS:", err);
            }

            window.removeEventListener("message", on3DSMessage);
          }
        };

        window.addEventListener("message", on3DSMessage);
        window.Culqi3DS.initAuthentication(tokenId);
      }
    };
  }, [dispatch, total]);

  const handleCheckout = (e) => {
    e.preventDefault();
    if (!window.Culqi) return;
    window.Culqi.open();
  };

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setLoadingCoupon(true);

    try {
      const code = couponInput.trim();
      const res = await api.get(`/coupon/code/${code}`);
      const { success, data } = res.data;

      if (success && data) {
        if (data.course_uuid) {
          const found = cart.find((c) => c.course_uuid === data.course_uuid);
          if (!found) {
            setDiscount({ amount: 0, type_id: null, label: null, course_uuid: null });
            return;
          }
        }

        setDiscount({
          amount: data.amount,
          type_id: data.type_id,
          label: data.label,
          course_uuid: data.course_uuid,
        });

        setAppliedCoupon(code);
      } else {
        setDiscount({ amount: 0, type_id: null, label: null, course_uuid: null });
      }
    } catch (err) {
      console.error("❌ Error validando cupón:", err);
      setDiscount({ amount: 0, type_id: null, label: null, course_uuid: null });
    } finally {
      setLoadingCoupon(false);
    }
  };

  return (
    <div className="page-shoppingcart">
      <div className="coverage">
        {cart.length === 0 ? (
          <div className="empty-car">
            <div className="car">
              <FontAwesomeIcon className="icon" icon={faCartShopping} />
            </div>
            <p className="title">¡TU CARRITO ESTÁ VACÍO!</p>
            <p className="flow">
              Parece que aún no te has decidido por ningún curso. Explora nuestra tienda y encuentra contenido
              increíble.
            </p>
            <Link className="btn-return" to="/cursos">
              Volver a la tienda
            </Link>
          </div>
        ) : (
          <div className="container">
            <div className="principal">
              <p className="title-p">Carrito de Compras</p>
              <table>
                <thead>
                  <tr>
                    <th colSpan="2">Curso</th>
                    <th>Precio</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div className="image">
                          <img src={item.thumbnail} alt={item.title} />
                        </div>
                      </td>
                      <td className="title">
                        <p>{item.title}</p>
                      </td>
                      <td>{item.price}</td>
                      <td className="icon">
                        <FontAwesomeIcon
                          className="i"
                          icon={faTrashCan}
                          onClick={() =>
                            dispatch(
                              removeFromCart({
                                course_uuid: item.course_uuid,
                                isAuthenticated,
                              })
                            )
                          }
                          style={{ cursor: "pointer" }}
                        />
                      </td>
                    </tr>
                  ))}

                  {discount.amount > 0 && (
                    <tr className="coupon-row">
                      <td>
                        <div className="image cup">
                          <FontAwesomeIcon className="icon" icon={faTicket} />
                        </div>
                      </td>
                      <td className="title">
                        <p>
                          Cupón: <strong>{appliedCoupon}</strong>
                          {discount.type_id === 2 && ` (${discount.label})`}
                        </p>
                      </td>
                      <td>
                        - {currency}{" "}
                        {discount.course_uuid
                          ? (() => {
                              const target = cart.find((c) => c.course_uuid === discount.course_uuid);
                              if (!target) return "0.00";
                              const targetPrice = parseFloat(target.price.replace(/[^0-9.,]/g, "").replace(",", "."));
                              return discount.type_id === 1
                                ? discount.amount.toFixed(2)
                                : (targetPrice * (discount.amount / 100)).toFixed(2);
                            })()
                          : discount.type_id === 1
                          ? discount.amount.toFixed(2)
                          : (subtotal * (discount.amount / 100)).toFixed(2)}
                      </td>
                      <td className="icon">
                        <FontAwesomeIcon
                          className="i"
                          icon={faTrashCan}
                          onClick={() => {
                            setDiscount({ amount: 0, type_id: null, label: null, course_uuid: null });
                            setAppliedCoupon("");
                          }}
                          style={{ cursor: "pointer" }}
                        />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="options">
                <input
                  className="in-c"
                  type="text"
                  placeholder="Código de cupón"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                />
                <button className="btn-c" onClick={handleApplyCoupon} disabled={loadingCoupon}>
                  {loadingCoupon ? "Validando..." : "Aplicar Cupón"}
                </button>
              </div>
            </div>

            <div className="cart-info">
              <div className="details">
                <p className="subt">Resumen del Pedido</p>
                <div className="cants">
                  <div className="psubt">
                    <p>Subtotal</p>
                    <p>
                      {currency} {subtotal.toFixed(2)}
                    </p>
                  </div>

                  {discount.amount > 0 && (
                    <div className="pdiscount">
                      <p>
                        Cupón: <span className="cu">{appliedCoupon}</span>
                      </p>
                      <p>
                        - {currency}{" "}
                        {discount.course_uuid
                          ? (() => {
                              const target = cart.find((c) => c.course_uuid === discount.course_uuid);
                              if (!target) return "0.00";
                              const targetPrice = parseFloat(target.price.replace(/[^0-9.,]/g, "").replace(",", "."));
                              return discount.type_id === 1
                                ? discount.amount.toFixed(2)
                                : (targetPrice * (discount.amount / 100)).toFixed(2);
                            })()
                          : discount.type_id === 1
                          ? discount.amount.toFixed(2)
                          : (subtotal * (discount.amount / 100)).toFixed(2)}
                      </p>
                    </div>
                  )}

                  <div className="ptotal">
                    <p>Total</p>
                    <p>
                      {currency} {total.toFixed(2)}
                    </p>
                  </div>
                </div>
                <button
                  id="btn_pagar"
                  className="btn-buy hover-op"
                  onClick={(e) => {
                    if (!isAuthenticated) setShowLoginModal(true);
                    else handleCheckout(e);
                  }}
                >
                  Pagar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showSuccessModal && (
        <div className="modal-success">
          <div className="modal-success-content">
            <p className="modal-success-title">¡Compra realizada!</p>
            <p className="modal-success-text">
              Gracias por tu compra. Revisa tu correo o perfil para acceder a tu curso.
            </p>
            <div className="modal-success-buttons">
              <Link to="/perfil" className="btn btn-view-courses hover-op">
                Ver mis cursos
              </Link>
            </div>
          </div>
        </div>
      )}

      {showLoginModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p className="title">Inicia sesión para continuar</p>
            <p className="flow">Para proceder con tu compra, debes iniciar sesión.</p>
            <div className="buttons">
              <Link to="/iniciar-sesion" className="btn login hover-op">
                Iniciar sesión
              </Link>
              <button className="btn cancel hover-op" onClick={() => setShowLoginModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShoppingCart;
