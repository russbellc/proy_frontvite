import { useState, useEffect } from "react";

function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState<boolean>(false);

    useEffect(() => {
        const mediaQueryList = window.matchMedia(query);

        const listener = (event: MediaQueryListEvent) => {
            setMatches(event.matches);
        };

        // Establecer el estado inicial
        setMatches(mediaQueryList.matches);

        // Escuchar cambios
        mediaQueryList.addEventListener("change", listener);

        // Limpiar el listener al desmontar
        return () => {
            mediaQueryList.removeEventListener("change", listener);
        };
    }, [query]);

    return matches;
}

export default useMediaQuery;
