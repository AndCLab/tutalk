import { Fragment, useState, useEffect, useRef } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/solid";
import ConversationItem from './ConversationItem'; // Import ConversationItem
import { usePage } from "@inertiajs/react"; // Import to handle Inertia navigation

export default function SearchConversation({ value, options, onSelect }) {
    const [selected, setSelected] = useState(value);
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);  // Ref to track the component container
    const { route } = usePage(); // Access Inertia.js route function

    const filteredConversations =
        query === ""
            ? []
            : options.filter((conversation) =>
                conversation.name
                    .toLowerCase()
                    .replace(/\s+/g, "")
                    .includes(query.toLowerCase().replace(/\s+/g, ""))
            );

    // Handle conversation selection
    const onSelected = (conversation) => {
        setSelected(conversation);
        onSelect(conversation);

        // Navigate to the selected conversation
        window.location.href = conversation.is_group 
            ? route("chat.group", conversation) 
            : route("chat.user", conversation);

        setQuery("");             
        setIsOpen(false);          
    };

    // Handle input change and toggle dropdown
    const handleInputChange = (event) => {
        const inputValue = event.target.value;
        setQuery(inputValue);
        setIsOpen(inputValue.trim() !== ""); // Open dropdown only if there is input
    };

    // Close dropdown when clicking outside the component
    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                setIsOpen(false);  // Close the dropdown
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);

    return (
        <>
            <div className="relative w-full z-10" ref={ref}>
                <input
                    className="border-gray-300 rounded-md shadow-sm block h-10 w-full"
                    placeholder="Search conversations..."
                    value={query}
                    onChange={handleInputChange}
                />
                <button
                    className="absolute inset-y-0 right-0 flex items-center pr-2"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                </button>

                {isOpen && query && (
                    <Transition
                        as={Fragment}
                        show={isOpen}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="absolute max-h-96 w-full overflow-auto rounded-md bg-emerald-900 py-1 text-base shadow-lg ring-1 ring-black/5 z-[100]">
                            {filteredConversations.length === 0 ? (
                                <div className="relative cursor-default select-none px-4 py-2 z-50 text-gray-700">
                                    Nothing found.
                                </div>
                            ) : (
                                filteredConversations.map((conversation) => (
                                    <div key={conversation.id} onClick={() => onSelected(conversation)}>
                                        <ConversationItem 
                                            conversation={conversation} 
                                            selectedConversation={selected} 
                                            online={conversation.online} // Assuming you have online status
                                        />
                                    </div>
                                ))
                            )}
                        </div>
                    </Transition>
                )}
            </div>
        </>
    );
}
