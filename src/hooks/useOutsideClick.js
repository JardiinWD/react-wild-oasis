import { useEffect, useRef } from "react";

export function useOutsideClick(handler, listenCapturing = true) {

    // Chose the Ref
    const ref = useRef()

    useEffect(function () {
        // Event Listener
        function handleClick(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                handler()
            }
        }

        // Listener on click
        document.addEventListener('click', handleClick, listenCapturing)

        // Remove event on click
        return () => document.removeEventListener('click', handleClick, listenCapturing)

    }, [handler, listenCapturing])

    return ref;
}