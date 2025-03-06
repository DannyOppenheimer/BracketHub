import { useState, useRef, useEffect } from "react";

export default function PanZoomCanvas({ type, children }) {
    const containerRef = useRef(null);
    const contentRef = useRef(null);

    const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });
    const [canvasHeight, setCanvasHeight] = useState("80vh"); // Dynamic height
    const [initialized, setInitialized] = useState(false); // Tracks if initial alignment is done

    useEffect(() => {
        const adjustHeightAndAlignTopLeft = () => {
            if (!containerRef.current || !contentRef.current) return;

            const content = contentRef.current.getBoundingClientRect();

            let newHeight = 0
            // Set the height dynamically based on content size
            if (type == 'pick') {
                newHeight = Math.max(200, Math.min(content.height + 50, 600)); // Min: 200px, Max: 80vh
            } else if (type == 'create') {
                newHeight = 600 // Min: 200px, Max: 80vh
            }


            setCanvasHeight(`${newHeight}px`);

            // Only align top-left on first render
            if (!initialized) {
                setTransform({ scale: 1, x: 0, y: 0 });
                setInitialized(true);
            }
        };

        adjustHeightAndAlignTopLeft();
        window.addEventListener("resize", adjustHeightAndAlignTopLeft);

        return () => {
            window.removeEventListener("resize", adjustHeightAndAlignTopLeft);
        };
    }, []); // Runs only on mount, no longer depends on children

    useEffect(() => {
        const handleWheel = (event) => {
            event.preventDefault();
            if (event.ctrlKey || event.metaKey) {
                // Handle pinch-to-zoom with trackpad
                const zoomSpeed = 0.05;
                let newScale = transform.scale - event.deltaY * zoomSpeed;
                newScale = Math.min(Math.max(0.5, newScale), 3); // Restrict zoom range
                setTransform((prev) => ({ ...prev, scale: newScale }));
            } else {
                // Handle two-finger panning
                setTransform((prev) => ({
                    ...prev,
                    x: prev.x - event.deltaX,
                    y: prev.y - event.deltaY,
                }));
            }
        };

        const container = containerRef.current;
        if (container) container.addEventListener("wheel", handleWheel, { passive: false });

        return () => {
            if (container) container.removeEventListener("wheel", handleWheel);
        };
    }, [transform]);

    const handleMouseDown = (event) => {
        setIsDragging(true);
        setLastMouse({ x: event.clientX, y: event.clientY });
    };

    const handleMouseMove = (event) => {
        if (!isDragging) return;
        const dx = event.clientX - lastMouse.x;
        const dy = event.clientY - lastMouse.y;
        setTransform((prev) => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
        setLastMouse({ x: event.clientX, y: event.clientY });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    return (
        <div
            ref={containerRef}
            className="relative overflow-hidden w-full bg-gray-200 border border-gray-400"
            style={{ height: canvasHeight, maxHeight: "80vh", width: "97%", margin: "0 auto", boxShadow: "0 0 5px rgba(70, 70, 70, 0.5)" }} // Dynamically set height
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <div
                ref={contentRef}
                className={`absolute ${isDragging ? "cursor-grabbing" : "cursor-grab"} transition-transform`}
                onMouseDown={handleMouseDown}
                style={{
                    transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                    backgroundColor: "white",

                    display: "flex",
                    justifyContent: "flex-start", // Align content to top-left
                    alignItems: "flex-start",
                    position: "relative",
                }}
            >
                {children}
            </div>
        </div>
    );
}