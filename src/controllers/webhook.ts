import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Controller, Get, Middleware, Post } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { payloadCheck, validationMiddleware } from '../middlewares';
import { sendTextMessage } from '../utils';
import { webhookMessage } from '../@types';


@Controller('webhook')
export class webhookController {

    @Get('')
    private getAll(req: Request, res: Response) {
        Logger.Info(req.body, true);
        return res.status(StatusCodes.OK).json({
            message: 'get_all_called',
        });
    }


    @Post()
    @Middleware([...validationMiddleware, payloadCheck])
    private async add(req: Request, res: Response) {
        // Logging the body to see what I am getting 
        Logger.Info(req.body, true);
        //replying with 200 OK so that WA won't call the webhook again
        res.status(StatusCodes.OK).json({
            message: 'add_called',
        });

        const messageObject = req.body as webhookMessage
        await sendTextMessage(messageObject.from, "Echo " + messageObject.message, messageObject.sessionId)

    }

}