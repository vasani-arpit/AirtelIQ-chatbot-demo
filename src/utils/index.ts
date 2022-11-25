import { textMessage } from "../@types";
import { writeFileSync } from "fs";

var axios = require('axios');
const AIRTEL_CRED = process.env.AIRTEL_CRED
const AIRTEL_PHONE = process.env.AIRTEL_PHONE


const sendMessage = async (data: textMessage) => {

    let url = 'https://iqwhatsapp.airtel.in:443/gateway/airtel-xchange/basic/whatsapp-manager/v1/session/send/text'
    if (data.list != undefined) {
        url = 'https://iqwhatsapp.airtel.in:443/gateway/airtel-xchange/basic/whatsapp-manager/v1/session/send/interactive/list'
    }

    const config = {
        method: 'post',
        url,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + AIRTEL_CRED
        },
        data: data
    }

    return await axios(config)
}

export const sendTextMessage = async (to: string, message: string, sessionId: string) => {

    const data: textMessage = {
        sessionId,
        "to": to,
        "from": AIRTEL_PHONE,
        "message": {
            "text": message
        }
    }

    return await sendMessage(data)
}

export const downloadImage = async (to: string, imageId: string, businessID: string, sessionId: string) => {

    const config = {
        method: 'get',
        url: `https://iqwhatsapp.airtel.in:443/gateway/airtel-xchange/basic/whatsapp-manager/v1/download/media?mediaId=${imageId}&businessId=${businessID}`
    };

    try {
        const response = await axios(config)
        const fileName = +new Date()
        if (response.data.contentType.subtype != "jpeg") {
            await sendTextMessage(to, `😟 Sorry ! We only support jpeg images.`, sessionId)
            return null
        }
        // save image to media folder
        writeFileSync(`media/${fileName}.jpg`, response.data.bytes, 'base64');
        return `media/${fileName}.jpg`
    } catch (error) {
        return null
    }


}

export const sendCategoryList = async (to: string, message: string, sessionId: string) => {

    const data: textMessage = {
        sessionId,
        to,
        "from": AIRTEL_PHONE,
        "message": {
            "text": message
        },
        "list": {
            "heading": "categories",
            "options": [
                {
                    "tag": "1",
                    "title": "👗 Frock",
                    "description": ""
                },
                {
                    "tag": "2",
                    "title": "👕 Crop Top",
                    "description": ""
                },
                {
                    "tag": "3",
                    "title": "👖 Plazzo",
                    "description": ""
                },
                {
                    "tag": "4",
                    "title": "🩳 Shorts",
                    "description": ""
                }
            ]
        }
    }

    return await sendMessage(data)
}




export const delay = async (time: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, time)
    })
}