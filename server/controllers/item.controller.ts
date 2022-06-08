import express, { NextFunction, Request, Response } from "express"
import { ItemModel } from "../Models/item.model";
import mongoose from "mongoose";
import { findItemsBySellerService  } from "../service/item.service";
import {findItemsByTypeService} from "../service/item.service"




export const createItemHandler = async (req: Request, res: Response) => {
    const {name, sellerId, price, type} = req.body

    const Item = await ItemModel.create({
        _id: new mongoose.Types.ObjectId(),
        name, sellerId,price,type

    })
    return Item.save()
        .then(() => {
            res.send({Item})
        })
        .catch((err: any) => {
            if (err.code === 1000) {
                return res.send("Item already created")
            }
            return res.send(err.message).status(200)
        })
}

export const findAllItems = async (req:Request, res:Response) =>{
 
  const item = await ItemModel.find()
  return res.status(200).send(item)


}
export const findItem = async (req:Request, res:Response) =>{
    const{itemId} = req.params;
    const item = await ItemModel.find({
        _id:itemId
    })
    return res.status(200).send(item);
}

export const findItemsBySeller =async (req:Request, res:Response) => {
    const {sellerId} = req.params;
    const item = await findItemsBySellerService(sellerId)
    return res.status(200).send(item)
    
}

export const findItemsByType = async (req:Request, res:Response) => {
    const {typeId} = req.params;
    const item = await findItemsByTypeService(typeId)
    return res.status(200).send(item)


    
}






