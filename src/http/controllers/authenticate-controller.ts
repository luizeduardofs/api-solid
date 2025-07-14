import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { InvalidCredentialsError } from "@/usecases/errors/invalid-credentials-error";
import { makeAuthenticateUseCase } from "@/usecases/factories/make-authenticate-usecase";

export async function authenticate(
  request: FastifyRequest,
  replay: FastifyReply
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  });

  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const authenticateUseCase = makeAuthenticateUseCase();

    await authenticateUseCase.execute({ email, password });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return replay.status(400).send({ message: error.message });
    }
    throw error;
  }

  return replay.status(200).send();
}
