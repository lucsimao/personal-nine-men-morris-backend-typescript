import { Chat } from './Chat';

const makeSut = () => {
  const sut = new Chat();

  return { sut };
};

describe('Chat', () => {
  test('should add message', () => {
    const { sut } = makeSut();

    sut.addMessage({ hour: new Date(), message: 'message', user: 'user' });

    expect(sut.getChatHistory()[0]).toEqual({
      hour: expect.anything(),
      message: 'message',
      user: 'user',
    });
  });
});
