import { client3 } from "@/client";
import { gql } from "graphql-request";



interface Persona {
    per_id: number;
    per_nombre: string;
    per_appat: string;
    per_apmat: string;
    per_nro_doc: string;
    per_st?: string;
    colegiados: {
        col_id: number;
        col_nro_cop: string;
        col_st: string;
    }[];
}

interface DataQuery {
    getAll_persona: {
        edges: {
            cursor: string;
            node: Persona;
        }[];
        pageInfo: {
            hasNextPage: boolean;
            endCursor: string | null;
        };
    };
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

interface IPeriodo {
    getAll_periodos: [
        {
            period_id: number;
            period_anio: number;
            period_cuota: number;
        }
    ]
}


export const PeriodoGql = async () => {

    const queryPeriodo = gql`
        {
			getAll_periodos {
				period_id
				period_anio
                period_cuota
			}
		}
    `;

    try {
        const data: IPeriodo = await client3.request(queryPeriodo);
        return {
            data: data.getAll_periodos,
            success: true,
            msg: 'Se ha encontrado ' + data.getAll_periodos.length + ' registros'
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
export const searchPersonaGql = async (values: unknown) => {

    const search_colegio = gql`
            {
                getAll_persona(
                    first: 50,
                    filter: ${values ? `"${values}"` : null}
                ) {
                    edges {
                        cursor
                        node {
                            per_id
                            per_nombre
                            per_appat
                            per_apmat
                            per_nro_doc
                            colegiados {
                                col_id
                                col_nro_cop
                                col_st
                            }
                        }
                    }
                    pageInfo {
                        hasNextPage
                        endCursor
                    }
                }
            }
    `;

    try {
        const data: DataQuery = await client3.request(search_colegio);
        return {
            data: data.getAll_persona.edges.map((edge) => edge.node),
            success: true,
            msg: 'Se ha encontrado ' + data.getAll_persona.edges.length + ' registros'
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