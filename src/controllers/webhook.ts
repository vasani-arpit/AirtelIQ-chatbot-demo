import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Controller, Get, Middleware, Post } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { payloadCheck, validationMiddleware } from '../middlewares';
import { checkImage, downloadImage, sendCategoryList, sendTextMessage } from '../utils';
import { webhookMessage } from '../@types';
import { products } from '../utils/products.json'



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
        // Logger.Info(req.body, true);
        console.log(JSON.stringify(req.body))
        //replying with 200 OK so that WA won't call the webhook again
        res.status(StatusCodes.OK).json({
            message: 'add_called',
        });

        const messageObject = req.body as webhookMessage

        if (messageObject.message.type == "image" && messageObject.message.image != undefined) {
            // downloadoing the image
            await sendTextMessage(messageObject.from, "Please wait while I check your image.😊", messageObject.sessionId)
            const filePath = await downloadImage(messageObject.from, messageObject.message.image.id, messageObject.businessId, messageObject.sessionId)
            console.log({ filePath })
            // Check the image if it belongs to our products
            if (filePath) {
                const results = await checkImage("./" + filePath)
                // send message if they want to buy it or want to explore other products
            }
        } else if (messageObject.message.type == "text") {
            switch (messageObject.message.text.body) {
                case "hy":
                case "hi":
                case "hii":
                case "Hi":
                case "yo":
                    await sendTextMessage(messageObject.from, "Hi, 🙋‍♂️ Welcome to our whatsapp store.", messageObject.sessionId)
                    await sendCategoryList(messageObject.from, "Please choose category to start browsing our store", messageObject.sessionId)

                    break;

                default:
                    await sendTextMessage(messageObject.from, "Echo " + messageObject.message.text.body, messageObject.sessionId)
                    break;
            }
        } else {
            // couldn't understand your message
            await sendTextMessage(messageObject.from, "Sorry !!  Can't understand your message.", messageObject.sessionId)
            await sendCategoryList(messageObject.from, "Please choose category to start browsing our store", messageObject.sessionId)
        }

    }

}