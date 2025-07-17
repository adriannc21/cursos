import "./ShoppingCart.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
function ShoppingCart() {
  return (
    <div className="page-shoppingcart">
      <div className="con">
        <div className="container">
          <div className="principal">
            <p className="title-p">Carrito de Compras</p>
            <table>
              <tr>
                <th colspan="2">Curso</th>
                <th>Precio</th>
                <th></th>
              </tr>
              <tr>
                <td>
                  <div className="image">
                    <img src="/img-course.webp" alt="curso" />
                  </div>
                </td>
                <td className="title">
                  <p>Curso de Impresion</p>
                </td>
                <td>S/ 90.00</td>
                <td className="icon">
                  <FontAwesomeIcon className="i" icon={faTrashCan} />
                </td>
              </tr>
              <tr>
                <td>
                  <div className="image">
                    <img src="/img-course.webp" alt="curso" />
                  </div>
                </td>
                <td className="title">
                  <p>Curso de Impresion</p>
                </td>
                <td>S/ 90.00</td>
                <td className="icon">
                  <FontAwesomeIcon className="i" icon={faTrashCan} />
                </td>
              </tr>
            </table>
            <div className="options">
              <button>Regresar</button>
            </div>
          </div>
          <div className="cart-info">
            <div className="details">
              <p className="subt">Resumen del Pedido</p>
              <div className="cants">
                <div className="psubt">
                  <p>Subtotal</p>
                  <p>S/ 90.00</p>
                </div>
                <div className="ptotal">
                  <p>Total</p>
                  <p>S/ 90.00</p>
                </div>
              </div>
              <div className="btn-buy">Pagar</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCart;
