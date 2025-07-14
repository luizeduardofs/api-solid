import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { compare } from "bcryptjs";
import { beforeEach, describe, expect, it } from "vitest";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";
import { RegisterUseCase } from "./register-usecase";

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe("Register Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(usersRepository);
  });

  it("should be able to register", async () => {
    const { user } = await sut.execute({
      name: "John Doe",
      email: "john@hotmail.com",
      password: "admin123@",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should hash user password upon registration", async () => {
    const { user } = await sut.execute({
      name: "John Doe",
      email: "john@hotmail.com",
      password: "admin123@",
    });

    const isPasswordCorrectlyHashed = await compare(
      "admin123@",
      user.password_hash
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("should not be able to register with same email twice", async () => {
    const email = "john@hotmail.com";

    await sut.execute({
      name: "John Doe",
      email,
      password: "admin123@",
    });

    await expect(() =>
      sut.execute({
        name: "John Doe",
        email,
        password: "admin123@",
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
