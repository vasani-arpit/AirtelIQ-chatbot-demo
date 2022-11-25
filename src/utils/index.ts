import { products, textMessage } from "../@types";
import { writeFileSync } from "fs";
import fetch from 'node-fetch';
import { exec } from "child_process";

import axios from 'axios';
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

    try {
        let response = await fetch(`https://iqwhatsapp.airtel.in:443/gateway/airtel-xchange/basic/whatsapp-manager/v1/download/media?mediaId=${imageId}&businessId=${businessID}`, {
            headers: {
                'Authorization': 'Basic ' + AIRTEL_CRED
            }
        });
        const data = await response.json()
        // console.log(data)
        const fileName = +new Date()
        // console.log(Object.keys(response.data))
        if (data.contentType.subtype != "jpeg") {
            await sendTextMessage(to, `😟 Sorry ! We only support jpeg images.`, sessionId)
            return null
        }
        // save image to media folder
        writeFileSync(`media/${fileName}.jpg`, data.bytes, 'base64');
        return `media/${fileName}.jpg`
    } catch (error) {
        console.error(error)
        await sendTextMessage(to, `😟 Sorry ! There was an error. Please try after sometime.`, sessionId)
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
            "heading": "Categories",
            "options": [
                {
                    "tag": "1",
                    "title": "👗 Frock",
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


export const checkImage = async (filePath: string) => {
    // haha. Can't share this code publicly. this has all the magic into it
    return new Promise((resolve, reject) => {
        exec(__dirname + "/checkimage " + filePath, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(stdout);
        });
    })

}

export const sendImages = async (businessId: string, to: string, sessionId: string, products: products[]) => {

    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        console.log("Upload product", product.category, product.designNo)
        var FormData = require('form-data');
        var fs = require('fs');
        var data = new FormData();
        data.append('file', fs.createReadStream(product.productImages), product.productImages);
        data.append('type', 'IMAGE');
        data.append('businessId', businessId);

        let mediaId = await fetch('https://iqwhatsapp.airtel.in:443/gateway/airtel-xchange/basic/whatsapp-manager/v1/session/media', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + AIRTEL_CRED
            },
            body: data // Here, stringContent or bufferContent would also work
        }).then(res => res.json())
        console.log(mediaId)
        await sendImageMessageWithButtons(mediaId.mediaId, to, sessionId, product)

    }

}



export const delay = async (time: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, time)
    })
}

async function sendImageMessageWithButtons(mediaId: string, to: string, sessionId: string, product: products) {
    console.log("Sending image message")
    var data = JSON.stringify({
        "sessionId": sessionId,
        "to": to,
        "from": AIRTEL_PHONE,
        "mediaAttachment": {
            "type": "IMAGE",
            "id": mediaId,
            "caption": " "
        },
        "message": {
            "text": `${product.category}\nprice: ₹${product.price}`
        },
        "buttons": [
            {
                "tag": "N",
                "title": "Explore More"
            },
            {
                "tag": "Y",
                "title": "Order Now"
            }
        ]
    });

    var config = {
        method: 'post',
        url: 'https://iqwhatsapp.airtel.in:443/gateway/airtel-xchange/basic/whatsapp-manager/v1/session/send/interactive/buttons',
        headers: {
            'Authorization': 'Basic ' + AIRTEL_CRED,
            'Content-Type': 'application/json'
        },
        data: data
    };

    return await axios(config).catch(console.error)

}
