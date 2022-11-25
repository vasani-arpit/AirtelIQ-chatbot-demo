import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Controller, Get, Middleware, Post } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { payloadCheck, validationMiddleware } from '../middlewares';
import { checkImage, downloadImage, sendCategoryList, sendImages, sendTextMessage } from '../utils';
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
                    await sendTextMessage(messageObject.from, "Hi, 🙋‍♂️ Welcome to our whatsapp store. If you have any image of our product then you can directly send it to us and we will provide you with more details of that product.", messageObject.sessionId)
                    await sendCategoryList(messageObject.from, "Please choose category to start browsing our store", messageObject.sessionId)
                    break;

                default:
                    await sendTextMessage(messageObject.from, "Echo " + messageObject.message.text.body, messageObject.sessionId)
                    break;
            }
        } else if (messageObject.message.type == "interactive") {
            // THis is a list reply
            if (messageObject.message.interactive?.type == "list_reply") {
                let categoryRequest = messageObject.message.interactive?.list_reply.title
                const productsForRequestedCategory = products.filter(p => p.category == categoryRequest)
                console.log("Products found ==>", productsForRequestedCategory.length)
                await sendImages(messageObject.businessId, messageObject.from, messageObject.sessionId, productsForRequestedCategory)

            } else {
                await sendTextMessage(messageObject.from, "Sorry !!  Can't understand your message.", messageObject.sessionId)
                await sendCategoryList(messageObject.from, "Please choose category to start browsing our store", messageObject.sessionId)
            }

        } else {
            // couldn't understand your message
            await sendTextMessage(messageObject.from, "Sorry !!  Can't understand your message.", messageObject.sessionId)
            await sendCategoryList(messageObject.from, "Please choose category to start browsing our store", messageObject.sessionId)
        }

    }

}