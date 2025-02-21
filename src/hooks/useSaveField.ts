import { useState } from "react";
import { client3 } from "@/client";
import { gql } from "graphql-request";
import { isValidImage, uploadImage } from "@/graphql/WebGraph";

export const useSaveField = (id: string, imagePreview: File | null, setImagePreview: (file: File | null) => void) => {
    const [saving, setSaving] = useState(false);

    const saveField = async (fieldName: string, value: unknown) => {
        setSaving(true); // Mostrar indicador de guardado
        try {
            if (fieldName === "web_img" && imagePreview) {
                if (!isValidImage(imagePreview)) {
                    setSaving(false); // Ocultar indicador de guardado
                    return {
                        data: null,
                        success: false,
                        msg: "Invalid file type. Only images are allowed.",
                    };
                }
                const fileUrl = await uploadImage(imagePreview);
                value = fileUrl;
                setImagePreview(null); // Limpiar la imagen previa después de subirla
            }

            await client3.request<{
                update_web?: { web_id: number };
            }>(
                gql`
                    mutation Update_web(
                        $webId: Int!
                        $fieldName: String!
                        $value: String
                    ) {
                        update_web(web_id: $webId, fieldName: $fieldName, value: $value) {
                            web_id
                        }
                    }
                `,
                {
                    webId: +id, // Asegurarte de convertir `id` a número si es necesario
                    fieldName: fieldName, // Sin comillas adicionales
                    value: String(value), // Asegúrate de convertir el valor a string si es necesario
                }
            );
        } catch (error) {
            console.error(`Error al guardar el campo ${fieldName}:`, error);
            console.log(saving);
        } finally {
            setSaving(false); // Ocultar indicador de guardado
        }
    };

    return { saveField, saving };
};
