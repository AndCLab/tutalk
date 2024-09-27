import { Link, usePage } from "@inertiajs/react";
import UserAvatar from "./UserAvatar";
import GroupAvatar from "./GroupAvatar";
import UserOptionsDropdown from "./UserOptionsDropdown";
import { formatMessageDateShort } from "@/helpers";
import { useEffect } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const ConversationItem = ({conversation, selectedConversation=null, online=null}) => {
    const page = usePage();
    const currentUser = page.props.auth.user;

    // For Testing Purposes
    // useEffect(() => {
    //     console.log("conversation from props:", conversation);
    // }, [conversation]);

    let classes = "border-transparent";
    if (selectedConversation) {
        if (!selectedConversation.is_group && !conversation.is_group && selectedConversation.id == conversation.id) {
            classes = "border-blue-500 bg-black/20";
        }
        if (selectedConversation.is_group && conversation.is_group && selectedConversation.id == conversation.id) {
            classes = "border-blue-500 bg-black/20";
        }
    }
    return (
        <Link href={conversation.is_group ? route("chat.group", conversation) : route("chat.user", conversation)}
        preserveState
        className={"pr-2 conversation-item flex items-center gap-2 p-2 text-gray-100 transition-all cursor-pointer border-1-4 border-emerald-900 hover:bg-gray-100"
        + classes}>
            {conversation.is_user && (
                <UserAvatar user={conversation} online={online}/>
            )}
            {conversation.is_group && <GroupAvatar/>}
            <div className={`flex-1 text-xs max-w-full overflow-hidden` + (conversation.is_user && conversation.blocked_at ? "opacity-50" : "")}>
                <div className="flex gap-1 justify-between items-center">
                    <div className="flex items-center gap-1">
                        <h3 className="text-base font-semibold overflow-hidden text-nowrap text-ellipsis">{conversation.name}</h3>
                        {conversation.verify_status && (
                            <CheckCircleIcon className="w-4 h-4 text-green-500"/>
                        )}
                    </div>
                    {conversation.last_message_date && (<span className="text-nowrap opacity-80 text-gray-300">{ formatMessageDateShort(conversation.last_message_date) }</span>)}
                </div>
                {conversation.last_message && (
                    <p className="text-xs text-nowrap overflow-hidden text-ellipsis opacity-80 text-gray-300">
                        {conversation.last_message}
                    </p>
                )}
                
                {conversation.last_message_date && conversation.last_message === null && (
                    <p className="text-xs text-nowrap overflow-hidden text-ellipsis opacity-80 text-gray-300">
                        Sent an attachment.
                    </p>
                )}
            </div>
            {conversation.is_user && (
                <UserOptionsDropdown conversation={conversation}/>
            )}
            {conversation.is_group && (
                <UserOptionsDropdown/>
            )}
        </Link>
    );
};

export default ConversationItem;