import { client3 } from "@/client";
import { FormWeb } from "@/types";
import axiosClient from "@/client/axiosClient";
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

const isValidImage = (image: File) => {
    const validMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    return image.type && validMimeTypes.includes(image.type);
};

const uploadImage = async (image: File) => {
    const formData = new FormData();
    formData.append("file", image);

    try {
        console.log("Enviando solicitud de subida de archivo...");
        const uploadResponse = await axiosClient.post('/upload', formData);

        console.log("Respuesta de la subida de archivo:", uploadResponse.data);
        return uploadResponse.data.fileUrl;
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error al subir el archivo:', errorMsg);
        throw new Error('Error al subir el archivo: ' + errorMsg);
    }
};

export const createWeb = async (dataForm: FormWeb, image: File, allImages: File[]) => {
    console.log("Datos del formulario:", dataForm);
    console.log("Archivo de imagen:", image);
    console.log("Tipo MIME del archivo:", image.type);
    console.log("AllImages :", allImages.length);

    if (!isValidImage(image)) {
        console.error("Tipo de archivo no válido:", image.type);
        return {
            data: null,
            success: false,
            msg: 'Invalid file type. Only images are allowed.'
        };
    }

    try {
        const fileUrl = await uploadImage(image);
        dataForm.web_img = fileUrl;

        // const allImageUrls = await Promise.all(allImages.map(async (img) => {
        //     if (!isValidImage(img)) {
        //         console.error("Tipo de archivo no válido:", img.type);
        //         throw new Error('Invalid file type in allImages. Only images are allowed.');
        //     }
        //     return await uploadImage(img);
        // }));

        return {
            // data: { ...dataForm, allImageUrls },
            data: { ...dataForm },
            success: true,
            msg: 'Imagen subida correctamente'
        };
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error al subir el archivo:', errorMsg);
        return {
            data: null,
            success: false,
            msg: 'Error al subir el archivo: ' + errorMsg
        };
    }
}