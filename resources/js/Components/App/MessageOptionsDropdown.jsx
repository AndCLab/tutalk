import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Fragment } from "react";
import axios from "axios";
import { useEventBus } from "@/EventBus";
import { useEffect, useState } from "react";

export default function MessageOptionsDropdown({ message }) {
    const [messages, setMessages] = useState([]);
    const {emit} = useEventBus();

    // For Testing 
    // useEffect(() => {
    //     console.log("message from props:", message);
    // }, [message]);

    const onMessageDelete = () => {
        console.log("Delete message");
        axios
            .delete(route("message.destroy", message.id))
            .then((res) => {
                emit("message.deleted", { message, prevMessage: res.data.message });
    
                // Update local messages state
                setMessages((prevMessages) => {
                    const updatedMessages = prevMessages.filter((msg) => msg.id !== message.id);
                    
                    // Check if there are remaining messages
                    if (updatedMessages.length === 0) {
                        // Handle the case where the conversation is now empty
                        // console.log("The conversation is now empty.");
                        // You might want to set a state for the empty conversation here
                    }
                    
                    return updatedMessages;
                });
            })
            .catch((err) => {
                console.error(err);
            });
    };
    

    return (
        <div className="absolute right-full top-1/2 -translate-y-1/2 hover:text-gray-100 z-10">
            <Menu as="div" className="relative inline-block text-left">
                <div>
                    <Menu.Button className="flex justify-center items-center w-8 h-8 rounded-full hover:bg-gray-800 hover:opacity-50">
                        <EllipsisVerticalIcon className="h-5 w-5"/>
                    </Menu.Button>
                </div>
                <Transition 
                    as={Fragment} 
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95">
                        <Menu.Items className="absolute right-0 mt-2 w-24 rounded-md bg-emerald-950 shadow-lg z-[100]">
                            <div className="px-1 py-1">
                                <Menu.Item>
                                    {({ active }) => (
                                        <button onClick={onMessageDelete} className={`${active ? "bg-black/30 text-white" : "text-gray-100"} group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                                            <TrashIcon className="w-4 h-4 mr-2" />
                                            Delete
                                        </button>
                                    )}
                                </Menu.Item>
                            </div>
                        </Menu.Items>
                </Transition>
            </Menu>
        </div>
    );
}