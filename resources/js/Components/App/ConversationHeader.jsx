import { Link, usePage } from "@inertiajs/react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import UserAvatar from "./UserAvatar";
import GroupAvatar from "./GroupAvatar";

const ConversationHeader = ({ selectedConversation }) => {

    return (
        <>
            {selectedConversation && (
                <div className="p-3 flex justify-between items-center border-b-2 border-emerald-900 bg-emerald-900">
                    <div className="flex items-center gap-3">
                        <Link href={route("dashboard")} className="inline-block sm:hidden">
                            <ArrowLeftIcon className="w-6" />
                        </Link>
                        {selectedConversation.is_user && (
                            <UserAvatar user={selectedConversation} />
                        )}
                        {selectedConversation.is_group && <GroupAvatar />}
                        <div className="flex">
                            <h3 className="text-gray-100">{selectedConversation.name}</h3>
                            {selectedConversation.is_group && (
                                <p className="pl-4 pt-1 opacity-60 text-xs text-gray-100">
                                    {selectedConversation.users.length} members
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ConversationHeader;