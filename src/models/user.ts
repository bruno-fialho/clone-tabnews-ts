import { database } from "@/infra/database";
import { NotFoundError, ValidationError } from "@/infra/errors";
import { password } from "./password";

export interface UserInputValues {
  username: string;
  email: string;
  password: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

async function create(userInputValues: UserInputValues): Promise<User> {
  async function validateUniqueEmail(email: string): Promise<void> {
    const results = await database.query({
      text: `
        SELECT
          email
        FROM
          users
        WHERE
          LOWER(email) = LOWER($1)
        ;`,
      values: [email],
    });

    if (results.rowCount > 0) {
      throw new ValidationError({
        message: "O email informado já está sendo utilizado.",
        action: "Utilize outro email para realizar o cadastro.",
      });
    }
  }

  async function validateUniqueUsername(username: string): Promise<void> {
    const results = await database.query({
      text: `
        SELECT
          username
        FROM
          users
        WHERE
          LOWER(username) = LOWER($1)
        ;`,
      values: [username],
    });

    if (results.rowCount > 0) {
      throw new ValidationError({
        message: "O username informado já está sendo utilizado.",
        action: "Utilize outro username para realizar o cadastro.",
      });
    }
  }

  async function hashPasswordInObject(userInputValues: UserInputValues) {
    const hashedPassword = await password.hash(userInputValues.password);
    userInputValues.password = hashedPassword;
  }

  async function runInsertQuery(
    userInputValues: UserInputValues,
  ): Promise<User> {
    const results = await database.query({
      text: `
        INSERT INTO 
          users (username, email, password) 
        VALUES 
          ($1, $2, $3)
        RETURNING
          *
        ;`,
      values: [
        userInputValues.username,
        userInputValues.email,
        userInputValues.password,
      ],
    });

    return results.rows[0];
  }

  await validateUniqueEmail(userInputValues.email);
  await validateUniqueUsername(userInputValues.username);
  await hashPasswordInObject(userInputValues);

  const newUser = await runInsertQuery(userInputValues);
  return newUser;
}

async function findOneByUsername(username: string): Promise<User> {
  async function runSelectQuery(usernameValue: string): Promise<User> {
    const results = await database.query({
      text: `
        SELECT
          *
        FROM
          users
        WHERE
          LOWER(username) = LOWER($1)
        LIMIT
          1
        ;`,
      values: [usernameValue],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "O username informado não foi encontrado no sistema.",
        action: "Verifique se o username está digitado corretamente.",
      });
    }

    return results.rows[0];
  }

  const userFound = await runSelectQuery(username);

  return userFound;
}

export const user = {
  create,
  findOneByUsername,
};
