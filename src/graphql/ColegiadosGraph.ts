import { client3 } from "@/client";
import { FormColegiado } from "@/types"
import { gql } from "graphql-request";

export const createColegiado = async (values: FormColegiado, id: string) => {

    if (id === "new") {

        const queryCreate_d_examen_lab = gql`
            mutation Create_persona($data: personaInput!) {
                create_persona(data: $data) {
                    per_id
                }
            }
            `;
        try {
            const { create_persona }: {
                create_persona: {
                    per_id: string
                }
            } = await client3.request(queryCreate_d_examen_lab, { data: values });
            return {
                data: create_persona,
                success: true,
                msg: 'Se ha creado el Item: ' + create_persona.per_id
            }

        } catch (error) {
            // Verifica si el error tiene la estructura esperada
            if (error instanceof Error && 'response' in error) {
                const { response } = error as {
                    response: {
                        errors: { message: string }[]
                    }
                };
                return {
                    data: null,
                    success: false,
                    msg: response.errors[0].message
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