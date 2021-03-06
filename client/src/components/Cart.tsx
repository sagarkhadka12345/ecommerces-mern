import React, { useState, useEffect, useRef } from "react";
import { cartEndPoint, orderEndPoint } from "../Apis";
import axios from "axios";
import { Cart, CartItem } from "../types/types";
import image from "../images/ab.jpeg";
import swal from "sweetalert2";

interface received {
  0: {
    items: Array<CartItem>;
  };
}

const CartComponent: React.FC = (): JSX.Element => {
  //states
  const [cart, setCart] = useState<Cart[]>([]);
  // const [carts, setCarts] = useState<received>();
  // const [totalQtyState, setTotalQty] = useState<number>(0);
  // const [totalPriceState, setTotalPrice] = useState<number>(0);
  // const [checkout, setCheckOut] = useState(false);
  const [productId, setProductId] = useState<string>("");
  const [orderItem, setOrderItem] = useState<any[]>([]);

  //api points
  // const upDateCartEndPoint = `${cartEndPoint}/update/${username}`
  // const emptyCartEndPoint = `${cartEndPoint}/deleteCart/${username}`
  const findCartEndPoint = `${cartEndPoint}/findCart`;
  const removeItemEndPoint = `${cartEndPoint}/remove`;

  //some variables for the data
  let totalQty = 0;

  let totalPrice = 0;

  useEffect(() => {
    axios
      .get(findCartEndPoint, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        return setCart(res.data);
      });
  }, []);

  const remove = () => {
    axios.post(
      removeItemEndPoint,
      {
        productId: productId,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    if (productId != "") {
      window.location.reload();
    }

    // window.location.reload()
  };
  const emptyCartEndPoint = `${cartEndPoint}/emptyCart`;
  const createOrderEndPoint = `${orderEndPoint}/createOrder`;

  // const checkout = () => {};
  const isInitialMount = useRef(true);
  const item = cart.map((data: any) => data.items as any);

  async function check() {
    await axios
      .post(
        createOrderEndPoint,
        {
          items: item[0],
          totalPrice: totalPrice,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .catch((err) => console.log(err));

    await axios.post(
      emptyCartEndPoint,
      { username: "" },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    window.location.reload();
  }

  // useEffect(() => {
  //   if (isInitialMount.current) {
  //     isInitialMount.current = false;
  //   } else {
  //     const work = async () => {
  //       await axios
  //         .post(
  //           createOrderEndPoint,
  //           {
  //             items: orderItem,
  //             totalPrice: totalPriceState,
  //           },
  //           {
  //             headers: {
  //               Authorization: "Bearer " + localStorage.getItem("token"),
  //             },
  //           }
  //         )
  //         .catch((err) => console.log(err));

  //       await axios.post(
  //         emptyCartEndPoint,
  //         { username: "" },
  //         {
  //           headers: {
  //             Authorization: "Bearer " + localStorage.getItem("token"),
  //           },
  //         }
  //       );
  //       window.location.reload();
  //     };
  //     work();
  //   }
  // }, [totalQtyState, totalPriceState, carts]);

  const checkOutHandler = async () => {
    swal
      .fire({
        html: "<p>Do you really want to check out</p>",
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          check();
        } else if (result.isDenied) {
          return window.location.reload();
        }
      });
  };

  if (cart.length > 0) {
    return (
      <div className="border p-2 bg-gray-100 h-[100vh] pb-12 ">
        Cart:
        {cart.map((data: Cart, index) => (
          <div key={index} className="pb-16">
            <div
              key={index}
              className="item my-2 py-2 px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  m-2 shadow-sm"
            >
              {data.items.map((data: CartItem, index) => (
                <div key={index} className="border border-2  bg-white">
                  <div className="m-2 relative flex flex-col">
                    <img
                      className="itemImage my-2"
                      src={image}
                      alt="image not Found"
                    ></img>
                    <div
                      className="absolute sm:right-1 md:right-0 top-1 hover:cursor-pointer text-xl"
                      onClick={() => {
                        setProductId(data.productId);
                        remove();
                      }}
                    >
                      X
                    </div>
                  </div>
                  <div className="flex justify-between mx-2 items-center">
                    <div className="itemName my-2 ">{data.name}</div>
                    <div className="itemPrice my-2">${data.price}</div>
                  </div>

                  <div className="itemQty my-2 mb-4  mx-2">
                    Quantity: {data.quantity}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col justify-center items-center">
              <div className="totalQty py-2">
                TotalQuantity:
                {
                  (totalQty = data.items.reduce((currentSum, value) => {
                    return (currentSum += value.quantity);
                  }, 0))
                }
              </div>
              <div className="totalPrice py-2">
                TotalPrice:
                {
                  (totalPrice = data.items.reduce((currentPrice, value) => {
                    return (currentPrice += value.price * value.quantity);
                  }, 0))
                }
              </div>

              <button
                onClick={() => {
                  checkOutHandler();
                }}
              >
                Check out
              </button>
            </div>
            {}
          </div>
        ))}
      </div>
    );
  } else {
    return (
      <div>
        <div> Please login First </div>
      </div>
    );
  }
};
export default CartComponent;
