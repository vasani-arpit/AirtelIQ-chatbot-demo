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