import { client3 } from "@/client";
import { gql } from "graphql-request";

interface Icategoria {
    getAll_web_categoria: [
        {
            cat_id: number,
            cat_nombre: string,
        }
    ]
}

interface IError {
    errors?: Error[] | undefined;
    data?: {
        getAll_web_categoria: {
            cat_id: number;
            cat_nombre: string;
        }[]
    };
}

interface Error {
    message: string;
    locations: Location[];
    path: string[];
    extensions: Extensions;
}

interface Extensions {
    code: string;
    stacktrace: string[];
}

interface Location {
    line: number;
    column: number;
}

export const CategoriasGql = async () => {
    const queryPeriodo = gql`
            {
                getAll_web_categoria {
                    cat_id
                    cat_nombre
                }
            }
        `;

    try {
        const data: Icategoria = await client3.request(queryPeriodo);
        return {
            data: data.getAll_web_categoria,
            success: true,
            msg: 'Se ha encontrado ' + data.getAll_web_categoria.length + ' registros'
        }
    } catch (error) {
        // Verifica si el error tiene la estructura esperada
        if (error instanceof Error && 'response' in error) {
            console.log(error)
            const { errors } = error as IError;
            return {
                data: null,
                success: false,
                msg: 'Error al crear el Item: ' + errors?.map((e) => e.message).join(', ')
            };
        } else {
            return {
                data: null,
                success: false,
                msg: 'Error desconocido.' + error
            };
        }
    }
}