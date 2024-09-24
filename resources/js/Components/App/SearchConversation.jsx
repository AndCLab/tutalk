import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/solid";

export default function SearchConversation({ authUser, options, onConversationCreate }) {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);  // Track the selected user

    // Filter users based on query
    const filteredUsers = 
        query === "" 
            ? []  // No users shown when query is empty
            : options.filter((user) => 
                user.name
                    .toLowerCase()
                    .replace(/\s+/g, "")
                    .includes(query.toLowerCase().replace(/\s+/g, ""))
            );

    // Handle the user selection
    const onSelectedUser = (user) => {
        setSelectedUser(user);       // Update the selected user
        setQuery("");                // Clear the search input
        setIsOpen(false);            // Close the dropdown

        // Trigger the parent callback to create a conversation
        if (onConversationCreate) {
            onConversationCreate(authUser.id, user.id);  // Pass both user IDs to create a conversation
        }
    };

    // Handle input change and toggle dropdown visibility
    const handleInputChange = (event) => {
        const inputValue = event.target.value;
        setQuery(inputValue);
        setIsOpen(inputValue.trim() !== "");  // Open dropdown only if input is not empty
    };

    return (
        <>
            <Combobox value={selectedUser} onChange={onSelectedUser}>
                <div className="relative mt-1">
                    <div className="relative w-full cursor-default overflow-hidden rounded-lg text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-teal-300 sm:text-sm">
                        <Combobox.Input 
                            className="border-gray-300 dark:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm mt-1 block w-full"
                            displayValue={() => (selectedUser ? selectedUser.name : "")}
                            placeholder="Search users to chat..."
                            value={query}  // Bind input value to query
                            onChange={handleInputChange}  // Handle input change
                        />
                        <Combobox.Button 
                            className="absolute inset-y-0 right-0 flex items-center pr-2"
                            onClick={() => setIsOpen(!isOpen)}  // Toggle dropdown visibility
                        >
                            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                        </Combobox.Button>
                    </div>

                    {/* Only show the options if the query is not empty and isOpen is true */}
                    {isOpen && query && (
                        <Transition
                            as={Fragment}
                            show={isOpen}  // Control dropdown visibility
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                            afterLeave={() => setQuery("")}
                        >
                            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-900 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                                {filteredUsers.length === 0 && query !== "" ? (
                                    <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                                        Nothing found.
                                    </div>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <Combobox.Option 
                                            key={user.id} 
                                            value={user} 
                                            className={({ active }) =>
                                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                    active ? "bg-teal-600 text-white" : "bg-gray-900 text-gray-100"
                                                }`                    
                                            }
                                        >
                                            {({ selected, active }) => (
                                                <>
                                                    <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                                                        {user.name}
                                                    </span>
                                                    {selected && (
                                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white">
                                                            <CheckIcon className="h-5 w-5" aria-hidden="true"/>
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </Combobox.Option>
                                    ))
                                )}
                            </Combobox.Options>
                        </Transition>
                    )}
                </div>
            </Combobox>
        </>
    );
}
