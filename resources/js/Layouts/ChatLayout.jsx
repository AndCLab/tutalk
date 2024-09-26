import ConversationItem from '@/Components/App/ConversationItem';
import GroupModal from '@/Components/App/GroupModal';
import TextInput from "@/Components/TextInput";
import { useEventBus } from '@/EventBus';
import { PencilSquareIcon } from '@heroicons/react/24/solid';
import { usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";

const ChatLayout = ({ children }) => {
    const page = usePage();
    const conversations = page.props.conversations;
    const selectedConversation = page.props.selectedConversation;
    const [localConversations, setLocalConversations] = useState([]);
    const [sortedConversations, setSortedConversations] = useState([]); 
    const [onlineUsers, setOnlineUsers] = useState({});
    const [showGroupModal, setShowGroupModal] = useState(false);
    const {on} = useEventBus();

    const isUserOnline = (userId) => onlineUsers[userId];

    // For testing/debugging
    // useEffect(() => {
    //     console.log("conversation from props:", conversations);
    // }, [conversations]);
    

    const onSearch = (ev) => {
        const search = ev.target.value.toLowerCase();
        setLocalConversations(
            conversations.filter((conversation) => {
                return conversation.name.toLowerCase().includes(search);
            })
        )
    }

    const messageCreated = (message) => {
        setLocalConversations((oldUsers) => {
            return oldUsers.map((u) => {
                // If message is for user
                if ( message.receiver_id && !u.is_group && (u.id == message.sender_id || u.id == message.receiver_id)) {
                    u.last_message = message.message;
                    u.last_message_date = message.created_at;
                    return u;
                }
                // If message is for group
                if ( message.group_id && u.is_group && u.id == message.group_id) {
                    u.last_message = message.message;
                    u.last_message_date = message.created_at;
                    return u
                }
                return u;
            });
        });
    };

    const messageDeleted = ({ prevMessage }) => {
        if (!prevMessage) {
            return;
        }
        messageCreated(prevMessage);
    };
    
    useEffect(() => {
        const offCreated = on("message.created", messageCreated);
        const offDeleted = on("message.deleted", messageDeleted);
        return () => {
            offCreated();
            offDeleted();
        };
    }, [on]);

    useEffect(() => {
        setSortedConversations(
            localConversations.sort((a,b) => {
                if (a.blocked_at && b.blocked_at) {
                    return a.blocked_at > b.blocked_at ? 1 : -1;
                } else if (a.blocked_at){
                    return 1;
                } else if (b.blocked_at){
                    return -1;
                }

                if(a.last_message_date && b.last_message_date) {
                    return b.last_message_date.localeCompare(
                        a.last_message_date
                    );
                } else if (a.last_message_date){
                    return -1;
                } else if (b.last_message_date){
                    return 1;
                } else {
                    return 0;
                }
            })
        );
    }, [localConversations]);

    useEffect(() => {
        setLocalConversations(conversations);
    }, [conversations]);

    useEffect(() => {
        Echo.join('online')
            .here((users) => {
                const onlineUsersObj = Object.fromEntries(
                    users.map((user) => [user.id, user])
                );

                setOnlineUsers((prevOnlineUsers) => {
                    return { ...prevOnlineUsers, ...onlineUsersObj };
                });
            })
            .joining((user) => {
                setOnlineUsers((prevOnlineUsers) => {
                    const updatedUsers = { ...prevOnlineUsers };
                    updatedUsers[user.id] = user;
                    return updatedUsers;
                });
            })
            .leaving((user) => {
                setOnlineUsers((prevOnlineUsers) => {
                    const updatedUsers = { ...prevOnlineUsers };
                    delete updatedUsers[user.id];
                    return updatedUsers;
                });
            })
            .error((error) => {
                console.log("error", error);
            })
        return () => {
            Echo.leave("online");
        }
    }, []);

    return (
        <>
        <div className="flex-1 w-full flex overflow-hidden">

            <div className={`transition-all w-full sm:w-[220px] md:w-[420px] bg-emerald-900 border-r-2 border-r-emerald-950 flex flex-col overflow-hidden ${selectedConversation ? "-ml-[100%] sm:ml-0" : ""}`}>
                <div className="flex p-3">
                    <TextInput onKeyUp={onSearch} placeholder="Search Tutee" className="w-full h-8"/>
                    <div className="tooltip tooltip-left pt-1" data-tip="Create new Group">
                        <button 
                            onClick={(ev) => setShowGroupModal(true)} 
                            className="text-gray-100 hover:text-gray-400"
                        >
                            <PencilSquareIcon className="w-4 h-4 inline-block ml-2"/>
                        </button>
                    </div>
                </div>
                <div className="flex-1 overflow-auto bg-emerald-800 border-2 border-emerald-900">
                    {sortedConversations && sortedConversations.map((conversation) => (
                        (<ConversationItem 
                            key={`${conversation.is_group ? "group_" : "user_"}${conversation.id}`}
                            conversation={conversation}
                            online={!!isUserOnline(conversation.id)}
                            selectedConversation={selectedConversation}
                        />)
                    ))}
                </div>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
                {children}
            </div>
        </div>
        <GroupModal 
            show={showGroupModal} 
            onClose={() =>setShowGroupModal(false)} 
        />
        </>
    );
}

export default ChatLayout;