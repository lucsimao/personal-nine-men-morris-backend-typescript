export interface ChatRepository {
  listenToChat<T>(
    event: string,
    callback: (response: T) => Promise<void>,
  ): Promise<void>;

  updateChat<T>(event: string, chat: T): Promise<void>;
}
