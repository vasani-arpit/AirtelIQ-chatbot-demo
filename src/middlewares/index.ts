//TODO: check the key in the header is matching with one we have in env

import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { webhookMessage } from "src/@types";
import { body, validationResult } from 'express-validator';


export const validationMiddleware = [
    body('to').notEmpty(),
    body('from').notEmpty(),
    body('sessionId').notEmpty(),
    body('message').notEmpty()
]


export async function payloadCheck(req: Request, res: Response, next: NextFunction) {

    try {
        var errorValidation = validationResult(req);
        if (!errorValidation.isEmpty()) {
            console.log("Webhook received. Didn't passed the validation.", req.body)
            return res.status(StatusCodes.OK).json({ message: "Thanks" });
        }
        next()
    } catch (error) {
        // if there is any error it should be logged here
        console.error(error)
        return res.status(StatusCodes.OK).json({
            message: 'Thanks'
        })
    }

}