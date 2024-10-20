import { useEventBus } from "@/EventBus";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Toast({ }) {
    const [toasts, setToasts] = useState([]);
    const { on } = useEventBus();

    useEffect(() => {
        on('toast.show', (message) => {
            const uuid = uuidv4();
            setToasts((oldToasts) => [...oldToasts, { message, uuid }]);
            setTimeout(() => {
                setToasts((oldToasts) => oldToasts.filter((toast) => toast.uuid !== uuid));
            }, 5000);
        });

        on('toast.uploadProgress', (toastData) => {
            setToasts((oldToasts) => {
                const existingToastIndex = oldToasts.findIndex(toast => toast.uuid === toastData.uuid);

                if (existingToastIndex !== -1) {
                    const updatedToasts = [...oldToasts];
                    updatedToasts[existingToastIndex] = toastData;
                    return updatedToasts;
                }

                return [...oldToasts, toastData];
            });
        });
    }, [on]);

    return (
        <div className="toast min-w-[280px]">
            {toasts.map((toast, index) => (
                <div key={toast.uuid} className="alert alert-success py-3 px-4 text-gray-100 rounded-md">
                    <span>{toast.message}</span>
                </div>
            ))}
        </div>
    );
}
