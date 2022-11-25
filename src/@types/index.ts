export interface webhookMessage {
    message: Message
    to: string
    sessionId: string
    from: string
    businessId: string
}

export interface Message {
    text: Text
    type: string
    timestamp: number,
    image?: {
        id: string,
        mime_type: string
    }
    interactive?: {
        list_reply?: {
            "id": string,
            "title": string
        },
        type: "list_reply",
        button_reply: {
            "id": string,
            "title": string
        }
    }
}

export interface products {
    "designNo": string,
    "size": string,
    "price": string,
    "category": string,
    "inStock": boolean,
    "productImages": string,
    "createdAt"?: {
        "$date": string
    }
}

export interface Text {
    body: string
}

export interface textMessage {
    sessionId: string,
    "to": string,
    "from": string | undefined,
    "message": {
        "text": string
    },
    list?: {
        heading: string,
        options: ListOption[]
    }
}

interface ListOption {
    "tag": string,
    "title": string,
    "description": string
}