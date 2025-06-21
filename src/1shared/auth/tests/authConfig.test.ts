import { authorizeByCredential, createSession, createJWT } from "../model/authConfig";

import { getCredentials, getUser } from "@/2entities/user";

// Мокируем модуль работы с пользователями
jest.mock("@/2entities/user", () => ({
  getCredentials: jest.fn(),
  getUser: jest.fn(),
}));

describe("Авторизация пользователя", () => {
  const validCredentials = {
    username: "testuser",
    password: "correctpassword",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("должен возвращать null при отсутствии credentials", async () => {
    const result = await authorizeByCredential(undefined);
    expect(result).toBeNull();
  });

  it("должен возвращать null при неверном пароле", async () => {
    (getCredentials as jest.Mock).mockResolvedValueOnce({
      id: "1",
      username: "testuser",
      password: "hashedpassword",
    });

    const result = await authorizeByCredential({
      ...validCredentials,
      password: "wrongpassword",
    });

    expect(result).toBeNull();
    expect(getCredentials).toHaveBeenCalledWith("testuser");
  });

  it("должен возвращать пользователя при верных credentials", async () => {
    (getCredentials as jest.Mock).mockResolvedValueOnce({
      id: "1",
      username: "testuser",
      password: "correctpassword",
    });

    const result = await authorizeByCredential(validCredentials);

    expect(result).toEqual({
      id: "1",
      username: "testuser",
    });
  });

  it("должен выбрасывать ошибку для несуществующего пользователя", async () => {
    const errorText = `Credentials for ${validCredentials.username} not exist`;

    (getCredentials as jest.Mock).mockRejectedValueOnce(new Error(errorText));

    await expect(authorizeByCredential(validCredentials)).rejects.toThrow(errorText);
  });
});

describe("Создание JWT токена", () => {
  it("должен объединять токен и данные пользователя", async () => {
    const token = { sub: "123", exp: 3600 };
    const user = { id: "1", username: "test" };

    const result = await createJWT({ token, user } as any);

    expect(result).toEqual({
      sub: "123",
      exp: 3600,
      id: "1",
      username: "test",
    });
  });
});

describe("Создание сессии", () => {
  it("должен создавать сессию с данными пользователя", async () => {
    (getUser as jest.Mock).mockResolvedValueOnce({
      id: "1",
      username: "testuser",
      email: "test@example.com",
    });

    const session = { expires: "2025-01-01" };
    const token = { id: "1" };

    const result = await createSession({
      session,
      token,
    } as any);

    expect(result).toEqual({
      expires: "2025-01-01",
      user: {
        id: "1",
        username: "testuser",
        email: "test@example.com",
      },
    });
    expect(getUser).toHaveBeenCalledWith(1);
  });
});
