import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon, XMarkIcon } from "@heroicons/react/24/solid";

export default function UserPicker({ value, options, onSelect }) {
    const [selected, setSelected] = useState(value);
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);  // Track dropdown open state

    const filteredPeople = 
        query === "" 
            ? []  // No users shown when query is empty
            : options.filter((person) => 
                person.name
                    .toLowerCase()
                    .replace(/\s+/g, "")
                    .includes(query.toLowerCase().replace(/\s+/g, ""))
            );
    
    // Handle user selection
    const onSelected = (persons) => {
        setSelected(persons);      // Update selected state
        onSelect(persons);         // Trigger the parent callback
        setQuery("");              // Clear the input box after a user is selected
        setIsOpen(false);          // Close the dropdown
    };

    // Remove selected user
    const removeUser = (user) => {
        const updatedSelected = selected.filter((person) => person.id !== user.id);
        setSelected(updatedSelected);
        onSelect(updatedSelected);
    };

    // Close dropdown if the query is empty or no users match
    const handleInputChange = (event) => {
        const inputValue = event.target.value;
        setQuery(inputValue);
        if (inputValue.trim() === "") {
            setIsOpen(false);  // Close dropdown if input is empty
        } else {
            setIsOpen(true);  // Open dropdown if input has a value
        }
    };

    return (
        <>
            <Combobox value={selected} onChange={onSelected} multiple>
                <div className="relative mt-1">
                    <div className="relative w-full cursor-default overflow-hidden rounded-lg text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-teal-300 sm:text-sm">
                        <Combobox.Input 
                            className="border-gray-300 dark:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm mt-1 block w-full"
                            displayValue={() => ""}
                            placeholder="Select users..."
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
                                {filteredPeople.length === 0 && query !== "" ? (
                                    <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                                        Nothing found.
                                    </div>
                                ) : (
                                    filteredPeople.map((person) => (
                                        <Combobox.Option 
                                            key={person.id} 
                                            value={person} 
                                            className={({ active }) =>
                                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                    active ? "bg-teal-600 text-white" : "bg-gray-900 text-gray-100"
                                                }`                    
                                            }
                                        >
                                            {({ selected, active }) => (
                                                <>
                                                    <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                                                        {person.name}
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

            {/* Display selected users with an 'x' icon for removal */}
            {selected && selected.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                    {selected.map((person) => (
                        <div key={person.id} className="flex items-center bg-emerald-700 text-white rounded-full px-3 py-1">
                            {person.name}
                            <button
                                className="ml-2 text-white hover:text-gray-200"
                                onClick={() => removeUser(person)}
                            >
                                <XMarkIcon className="h-4 w-4" aria-hidden="true" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
