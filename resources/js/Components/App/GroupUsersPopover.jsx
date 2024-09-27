import { Popover, Transition } from "@headlessui/react";
import { UserIcon } from "@heroicons/react/24/solid";
import  { Fragment, useEffect } from "react";
import UserAvatar from "./UserAvatar";
import { Link } from "@inertiajs/react";
import { formatUserType } from "@/helpers";

export default function GroupUsersPopover({ users = [] }) {

    // For Testing Purposes
    // useEffect(() => {
    //     console.log("users from users []:", users);
    // }, [users]);

    return (
        <Popover className="relative z-10">
            {({ open }) =>  (
                <>
                    <Popover.Button className={`${ open ? "text-gray-200" : "tex-gray-400"} hover:text-gray-200 text-xs right-0 focus:outline-none`}>
                        {users.length} members
                    </Popover.Button>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <Popover.Panel className="absolute right-0 z-20 mt-3 w-[240px] px-4 sm:px-0">
                            <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
                                <div className="bg-gray-800 py-2">
                                    {users.map((user) => (
                                        <Link
                                            href={route("chat.user", user.id)}
                                            key={user.id}
                                            className="flex items-center gap-2 py-2 px-3 hover:bg-black/30"
                                        >
                                             <div className="text-xs text-white flex flex-col">
                                                <span>{user.name}</span>
                                                <span className="text-gray-400 text-xs">
                                                    {formatUserType(user.user_type)}
                                                </span>
                                             </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    );
}
