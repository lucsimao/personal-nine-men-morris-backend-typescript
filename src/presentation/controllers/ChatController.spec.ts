import { ChatService } from '../../domain/services/ChatService';
import { Logger } from '../../use-case/services/protocols/Logger';
import { ChatController } from './ChatControlller';

const makeLogger = (): jest.Mocked<Logger> => ({
  info: jest.fn(),
  warning: jest.fn(),
  error: jest.fn(),
});

const makeChatInputRepository = (): jest.Mocked<ChatService> => ({
  listenToChat: jest.fn(),
  updateChat: jest.fn(),
});

const makeSut = () => {
  const playerChatRepository = makeChatInputRepository();
  const logger = makeLogger();
  const sut = new ChatController(playerChatRepository, logger);

  return { sut, playerChatRepository };
};

describe('Chat Controller', () => {
  test('should start chat listener', async () => {
    const { sut, playerChatRepository } = makeSut();

    await sut.start();

    expect(playerChatRepository.listenToChat).toBeCalledWith(
      expect.any(Function),
    );
  });

  test('should start chat correct listener', async () => {
    const { sut, playerChatRepository } = makeSut();
    playerChatRepository.listenToChat.mockImplementationOnce(async callback => {
      void callback?.({});
    });

    await sut.start();

    expect(playerChatRepository.updateChat).toBeCalled;
  });
});
