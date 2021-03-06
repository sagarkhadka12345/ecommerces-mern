import React, { useState, useEffect } from "react";
import { Item, Token } from "../types/types";
import { cartEndPoint } from "../Apis";
import image from "../images/ab.jpeg";
import jwt from "jsonwebtoken";
import swal from "sweetalert2";

import axios from "axios";
const username = "sagarkhadka12345";

const ProductCard = (props: Item) => {
  const [cart, setCart] = useState({});
  const [quantity, setQuantity] = useState<number>(1);
  const upDateCartEndPoint = `${cartEndPoint}/update`;
  const findCartEndPoint = `${cartEndPoint}/findCart/${username}`;
  const [price, setPrice] = useState<number>(0);
  // useEffect(() => {
  //   axios.get(findCartEndPoint).then((res) => { setCart(res.data);  setQuantity(props.quantity)})
  // }, [findCartEndPoint])

  const handleClick = () => {
    setQuantity(quantity + 1);
  };
  const addToCart = async () => {
    await axios
      .post(
        upDateCartEndPoint,
        {
          item: {
            name: props.name,
            seller: props.seller,
            sellerId: props.sellerId,
            price: props.price,
            type: props.type,
            quantity: quantity,
            productId: props.productId,
          },
        },
        {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        }
      )
      .then((res) =>
        swal.fire({
          icon: "success",
          html: "The item has been added to the cart successfully",
          showCloseButton: true,
        })
      )
      .catch((res) => {
        swal.fire({
          icon: "error",
          html: "Please login before adding to the cart",
          showCloseButton: true,
        });
      });
  };

  return (
    <div>
      <div className="cart flex flex-col p-3 m-2  bg-white rounded-md hover:bg-gray-300  shadow-md">
        <img className="img" src={image}></img>
        <div className="flex justify-between px-2 py-1">
          <div className="img-container p-2 my-2">{props.name}</div>
          <div className="price p-2 my-2 text-amber-600"> ${props.price}</div>
        </div>
        <div className="seller-container px-4 pb-2 text-indigo-500">
          {" "}
          Seller: &nbsp; {props.seller}
        </div>
        <div className="flex justify-between p-2 py-4 mb-2 relative">
          <div className="quantity px-2  tex-indigo-500 ">
            Quantiy: {quantity}{" "}
            <button
              className="text-2xl absolute left-[6.5rem] top-[.7rem] border-2 border-gray-200 px-1"
              onClick={handleClick}
            >
              +
            </button>{" "}
          </div>
          <div className="type px-2 text-indigo-500 ">{props.type}</div>
        </div>

        <button
          className="p-2 w-max bg-indigo-300 hover:bg-indigo-400 hover:text-black mx-auto shadow-lg"
          onClick={addToCart}
        >
          Set to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
