import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcryptjs";
import { beforeEach, describe, expect, it } from "vitest";
import { AuthenticateUseCase } from "./authenticate-usecase";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe("Authenticate Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository);
  });

  it("should be able to authenticate", async () => {
    await usersRepository.create({
      name: "John Doe",
      email: "john@hotmail.com",
      password_hash: await hash("admin123@", 6),
    });

    const { user } = await sut.execute({
      email: "john@hotmail.com",
      password: "admin123@",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should not be able authenticate with wrong email", async () => {
    await expect(() =>
      sut.execute({
        email: "john@hotmail.com",
        password: "admin123@",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not be able authenticate with wrong password", async () => {
    await usersRepository.create({
      name: "John Doe",
      email: "john@hotmail.com",
      password_hash: await hash("12345678", 6),
    });

    await expect(() =>
      sut.execute({
        email: "john@hotmail.com",
        password: "admin123@",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
