import { prisma } from '.prisma/client';
import axios from 'axios';
import prismaClient from '../prisma/';
import { sign } from 'jsonwebtoken'
/**
 * Receber code(string)
 * Recuperar o access_token no github
 * Recurar infos do user no GitHub
 * verificar se o usuario existe no nDB
 * se existir gerar um token para ele
 * se nao existir = Criar no DB e gera um token
 * retornar o token com as infos do user
 */

interface IAccessTokenResponse {
  access_token: string;

}

interface IUserResponse {
  avatar_url: string,
  login: string,
  id: number,
  name: string,
}

class AuthenticationUserService {
  async execute( code: string ) {
    const url = "https://github.com/login/oauth/access_token";

    const {data: accessTokenResponse} = await axios.post<IAccessTokenResponse>( url, null, {
      params: {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      headers: {
        "Accept": "application/json"
      }
    })

    const response = await axios.get<IUserResponse>("https://api.github.com/user", {
      headers: {
        authorization: `Bearer ${accessTokenResponse.access_token}`,
      },
    } );

    const { login, name, avatar_url, id } = response.data;

    let user =  await prismaClient.user.findFirst({
      where: {
        github_id: id
      }
    })

    if(!user) {
      await prismaClient.user.create({
        data: {
          github_id: id,
          login: login,
          avatar_url: avatar_url,
          name: name,
        }
      })
    }

    const token = sign(
      {
        user: {
          user: user.name,
          avatar_url: user.avatar_url,
          id: user.id
        }
      },
      process.env.JWT_SECRET,
      {
        subject: user.id,
        expiresIn: "1d"
      }
    )

    return { token, user };
  }
}

export { AuthenticationUserService }