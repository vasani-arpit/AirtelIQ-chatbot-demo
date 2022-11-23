import { textMessage } from "../@types";

var axios = require('axios');
const AIRTEL_CRED = process.env.AIRTEL_CRED
const AIRTEL_PHONE = process.env.AIRTEL_PHONE


const sendRequest = async (data: textMessage) => {

    const config = {
        method: 'post',
        url: 'https://iqwhatsapp.airtel.in:443/gateway/airtel-xchange/basic/whatsapp-manager/v1/session/send/text',
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

    return await sendRequest(data)
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

    return await sendRequest(data)
}




export const delay = async (time: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, time)
    })
}