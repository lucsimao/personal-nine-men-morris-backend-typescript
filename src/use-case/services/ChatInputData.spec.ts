import { ChatInputData } from './ChatInputData';
import { ChatRepository } from './protocols/ChatRepository';
import { Logger } from './protocols/Logger';

const makeChatRepository = (): jest.Mocked<ChatRepository> => ({
  listenToChat: jest.fn(),
  updateChat: jest.fn(),
});

const makeLogger = (): jest.Mocked<Logger> => ({
  error: jest.fn(),
  info: jest.fn(),
  warning: jest.fn(),
});

const makeSut = () => {
  const chatRepository = makeChatRepository();
  const logger = makeLogger();
  const sut = new ChatInputData(chatRepository, logger);

  return { sut, chatRepository };
};

describe('Chat Input Data', () => {
  it('should listen to chat', async () => {
    const { sut, chatRepository } = makeSut();

    await sut.listenToChat(async () => undefined);

    expect(chatRepository.listenToChat).toBeCalledWith(
      'chat',
      expect.any(Function),
    );
  });

  it('should update chat', async () => {
    const { sut, chatRepository } = makeSut();

    await sut.updateChat(async () => undefined);

    expect(chatRepository.updateChat).toBeCalledWith(
      'chat',
      expect.any(Function),
    );
  });
});
