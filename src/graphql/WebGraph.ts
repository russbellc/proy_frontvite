import { client3 } from "@/client";
import { FormWeb } from "@/types";
import axios from "axios";
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

export const createWeb = async (dataForm: FormWeb, image: File) => {
    console.log("Datos del formulario:", dataForm);
    console.log("Archivo de imagen:", image);
    console.log("Tipo MIME del archivo:", image.type);

    // Verificar que el archivo es una imagen
    const validMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!image.type || !validMimeTypes.includes(image.type)) {
        console.error("Tipo de archivo no válido:", image.type);
        return {
            data: null,
            success: false,
            msg: 'Invalid file type. Only images are allowed.'
        };
    }

    const formData = new FormData();
    formData.append("file", image);

    try {
        console.log("Enviando solicitud de subida de archivo...");
        const uploadResponse = await axios.post('http://localhost:4000/api/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true, // Asegúrate de incluir las credenciales si es necesario
        });

        console.log("Respuesta de la subida de archivo:", uploadResponse.data);

        if (uploadResponse.data.fileUrl) {
            dataForm.web_img = uploadResponse.data.fileUrl; // Actualiza la URL de la imagen en los datos del formulario
        }

        return {
            data: dataForm,
            success: true,
            msg: 'Imagen subida correctamente'
        };
    } catch (error) {
        console.error('Error al subir el archivo:', error);
        return {
            data: null,
            success: false,
            msg: 'Error al subir el archivo: ' + (error instanceof Error ? error.message : 'Unknown error')
        };
    }
}