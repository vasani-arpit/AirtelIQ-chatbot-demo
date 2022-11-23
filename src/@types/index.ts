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
    timestamp: number
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