import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { PrismaUsersRepository } from "@/repositories/prisma-users-repository";
import { RegisterUseCase } from "@/usecases/register-usecase";

export async function register(request: FastifyRequest, replay: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
  });

  const { name, email, password } = registerBodySchema.parse(request.body);

  try {
    const usersRepository = new PrismaUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    await registerUseCase.execute({ name, email, password });
  } catch (error) {
    return replay.status(409).send();
  }

  return replay.status(201).send();
}
