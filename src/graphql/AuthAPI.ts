import client2 from "@/client/client2"
import { UserLoginForm } from "@/types"
import { gql } from "@apollo/client";

interface AuthResponseGraphQL {
    data: {
        login: {
            token: string;
            user: {
                usu_id: string;
                usu_correo: string;
                usu_nombre: string;
            };
        }
    }
}

//autenticacion de usuario con swr y graphql
export const authenticateUser = async (formData: UserLoginForm) => {

    const { email, password } = formData

    const AuthUserGQL = gql`
        mutation Login {
            login(data: { usu_correo: "${email}", usu_password: "${password}" }) {
                token
                user {
                    usu_id
                    usu_correo
                    usu_nombre
                }
            }
        }
    `;
    try {
        const { data: { login: { token, user } } }: AuthResponseGraphQL = await client2.mutate({ mutation: AuthUserGQL })
        localStorage.setItem('token', token)
        return user
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message)
            throw new Error(error.message)
        }
    }
}

/*
{
  "data": {
    "login": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiTmxOcGh6TDF0VTl5dVhkakNiOUpWMjRoNCIsImlhdCI6MTcyMzAwMTc5NSwiZXhwIjoxNzMwNzc3Nzk1fQ.XQcD0L99Pry9AturFauG0l2kCtATMuC3-CZLkDVBH3Y",
      "user": {
        "usu_id": "NlNphzL1tU9yuXdjCb9JV24h4",
        "usu_correo": "russbellc@gmail.com",
        "usu_nombre": "MIKAIL RUSSBELL CASTRO JARA"
      }
    }
  }
}
*/



//autenticacion de usuario con swr y graphql
export const validateUser = async (formData: UserLoginForm) => {
    try {
        console.log(formData)
    } catch (error) {
        console.log(error)
    }
}