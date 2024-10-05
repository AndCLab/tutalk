import { forwardRef, useEffect, useRef } from 'react';

export default forwardRef(function TextInput({ type = 'text', className = '', isFocused = false, ...props }, ref) {
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={
                'bg-transparent backdrop-blur-lg border border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-lg ' +
                'border-opacity-50 placeholder-gray-500 text-emerald-800 ' +
                className
            }
            ref={input}
        />
    );
});
