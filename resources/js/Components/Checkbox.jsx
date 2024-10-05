export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'bg-transparent backdrop-blur-lg border border-gray-200 rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500 ' + 
                className
            }
        />
    );
}
