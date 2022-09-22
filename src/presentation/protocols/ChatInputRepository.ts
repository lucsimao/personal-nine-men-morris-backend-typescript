export interface ChatInputRepository {
  listenToChat<T>(callback: (response: T) => Promise<void>): Promise<void>;
  updateChat<T>(chat: T): Promise<void>;
}
