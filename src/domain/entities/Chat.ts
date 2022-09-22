export interface ChatMessage {
  user: string;
  message: string;
  hour: Date;
}

export class Chat {
  private readonly chatHistory: ChatMessage[];

  constructor() {
    this.chatHistory = [];
  }

  public addMessage(chatMessage: ChatMessage): void {
    this.chatHistory.push(chatMessage);
  }

  public getChatHistory(): ChatMessage[] {
    return [...this.chatHistory];
  }
}
