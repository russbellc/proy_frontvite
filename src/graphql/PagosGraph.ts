import { client3 } from "@/client";
import { gql } from "graphql-request";


interface Icreate_persona {
    create_persona: {
        per_id: number;
    }
}

interface IError {
    errors?: Error[] | undefined;
    data?: Data;
}

interface Data {
    create_persona: null;
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
export const createPago = async (values: unknown, id: string) => {
    console.log(values)
    console.log(id)
    if (id === "new") {
            const queryCreate_d_examen_lab = gql`
                mutation Create_persona($data: personaForm!) {
                    create_persona(data: $data) {
                        per_id
                    }
                }
                `;
    
            console.log(values)
            try {
                const data: Icreate_persona = await client3.request(queryCreate_d_examen_lab, { data: values });
                console.log(data)
                return {
                    data: data.create_persona,
                    success: true,
                    msg: 'Se ha creado el Item: ' + data.create_persona.per_id
                }
    
            } catch (error) {
                // Verifica si el error tiene la estructura esperada
                if (error instanceof Error && 'response' in error) {
                    console.log(error)
                    const { errors } = error as IError;
                    // console.log('Error al crear el Item: ' + errors?.map((e) => e.message).join(', '))
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
    
        } else {
            console.log("update")
        }
}