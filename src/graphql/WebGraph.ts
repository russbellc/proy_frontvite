import { client3 } from "@/client";
// import { FormWeb } from "@/types";
import axiosClient from "@/client/axiosClient";
import { gql } from "graphql-request";

export interface FormWeb {
    web_id?:        number;
    web_categoria: number;
    web_titulo:    string;
    web_mini_desc: string;
    web_desc:      string;
    web_img:       string;
    web_st:        number;
    web_galeria:   WebGaleria[];
  }
  
  export interface WebGaleria {
    gal_id:  number;
    gal_img: string;
  }

interface Icategoria {
    getAll_web_categoria: [
        {
            cat_id: number,
            cat_nombre: string,
        }
    ]
}

interface Icreate_web {
    create_web: {
        web_id: number;
    }
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

export const isValidImage = (image: File) => {
    const validMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    return image.type && validMimeTypes.includes(image.type);
};

export const uploadImage = async (image: File) => {
    const formData = new FormData();
    formData.append("file", image);
    try {
        const uploadResponse = await axiosClient.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return uploadResponse.data.fileUrl;
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        throw new Error('Error al subir el archivo: ' + errorMsg);
    }
};

export const createWeb = async (dataForm: FormWeb, image: File, allImages: File[]) => {
    // console.log("Datos del formulario:", dataForm);
    // console.log("Archivo de imagen:", image);
    // console.log("Tipo MIME del archivo:", image.type);
    // console.log("AllImages :", allImages.length);

    if (!isValidImage(image)) {
        // console.error("Tipo de archivo no válido:", image.type);
        return {
            data: null,
            success: false,
            msg: 'Invalid file type. Only images are allowed.'
        };
    }

    if (dataForm.web_mini_desc.length > 45) {
        return {
            data: null,
            success: false,
            msg: 'La mini descripción no puede exceder los 45 caracteres'
        };
    }

    const mutationWeb = gql`
        mutation Mutation($web: webForm!) {
            create_web(web: $web) {
                web_id
            }
        }
    `;

    try {
        const fileUrl = await uploadImage(image);
        dataForm.web_img = fileUrl;

        const web_galeria = await Promise.all(allImages.map(async (img, index) => {
            if (!isValidImage(img)) {
                console.error("Tipo de archivo no válido:", img.type);
                throw new Error('Invalid file type in allImages. Only images are allowed.');
            }
            const gal_img = await uploadImage(img);
            return { gal_id: index, gal_img };
        }));

        const webData = { ...dataForm, web_galeria };
        delete webData.web_id; // Eliminar el campo web_id

        const data: Icreate_web = await client3.request(mutationWeb, { web: webData });

        return {
            data: data.create_web,
            success: true,
            msg: 'Imagen subida correctamente'
        };
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error al crear web:', errorMsg);
        return {
            data: null,
            success: false,
            msg: 'Error al crear web: ' + errorMsg
        };
    }
}