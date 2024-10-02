import { Menu, Transition } from '@headlessui/react';
import { PencilSquareIcon, TrashIcon, QuestionMarkCircleIcon, EllipsisVerticalIcon, ArrowLeftEndOnRectangleIcon } from '@heroicons/react/24/solid';
import { Fragment } from 'react';
import { useEventBus } from '@/EventBus';
import axios from 'axios';

const GroupOptionsDropdown = ({ selectedConversation, isOwner }) => {
    const { emit } = useEventBus();

    const onDeleteGroup = () => {
        if (!window.confirm("Are you sure you want to delete this group?")) {
            return;
        }

        axios
            .delete(route("group.destroy", selectedConversation.id))
            .then((res) => {
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const onLeaveGroup = () => {
        if (!window.confirm("Are you sure you want to leave this group?")) {
            return;
        }
    
        axios
            .delete(route("group.leave", selectedConversation.id))
            .then((res) => {
                console.log(res.data);
                // Optionally redirect or refresh the page
            })
            .catch((err) => {
                console.log(err.response.data);
            });
    };

    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <Menu.Button className="flex justify-center items-center w-8 h-8 rounded-full hover:bg-emerald-950 hover:opacity-50">
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
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg z-50">
                    <div className="px-1 py-1">
                        {/* View Description Option */}
                        <Menu.Item>
                            {({ active }) => (
                                <button onClick={() => emit("GroupDescription.show", selectedConversation.description)} className={`${active ? "bg-black/30 text-emerald-700" : "text-emerald-800"} group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                                    <QuestionMarkCircleIcon className="mr-2 h-4 w-4" />
                                    View Description
                                </button>
                            )}
                        </Menu.Item>
                        
                        {!isOwner && (
                            <Menu.Item>
                                {({ active }) => (
                                    <button onClick={onLeaveGroup} className={`${active ? "bg-black/30 text-red-600" : "text-red-600"} group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                                        <ArrowLeftEndOnRectangleIcon className="mr-2 h-4 w-4" />
                                        Leave Group
                                    </button>
                                )}
                            </Menu.Item>
                        )}

                        {/* Edit and Delete options for owner */}
                        {isOwner && (
                            <>
                                <Menu.Item>
                                    {({ active }) => (
                                        <button onClick={() => emit("GroupModal.show", selectedConversation)} className={`${active ? "bg-black/30 text-emerald-700" : "text-emerald-800"} group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                                            <PencilSquareIcon className="mr-2 h-4 w-4" />
                                            Edit Group
                                        </button>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <button onClick={onDeleteGroup} className={`${active ? "bg-black/30 text-red-600" : "text-red-600"} group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                                            <TrashIcon className="mr-2 h-4 w-4" />
                                            Delete Group
                                        </button>
                                    )}
                                </Menu.Item>
                            </>
                        )}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
};

export default GroupOptionsDropdown;
