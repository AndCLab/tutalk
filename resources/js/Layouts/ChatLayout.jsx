import ConversationItem from '@/Components/App/ConversationItem';
import GroupModal from '@/Components/App/GroupModal';
import TextInput from "@/Components/TextInput";
import SearchConversation from '@/Components/App/SearchCOnversation';
import { useEventBus } from '@/EventBus';
import { PencilSquareIcon } from '@heroicons/react/24/solid';
import { router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";

const ChatLayout = ({ children }) => {
    const page = usePage();
    const conversations = page.props.conversations;
    const selectedConversation = page.props.selectedConversation;
    const [localConversations, setLocalConversations] = useState([]);
    const [sortedConversations, setSortedConversations] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState({});
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]); // Store selected users from UserPicker
    const { on } = useEventBus();
    const users = conversations.filter((c) => !c.is_group);

    const isUserOnline = (userId) => onlineUsers[userId];

    // Filter for conversations with messages
    const filteredConversations = localConversations.filter(
        (conversation) => conversation.last_message !== null
    );

    const messageCreated = (message) => {
        setLocalConversations((oldUsers) => {
            return oldUsers.map((u) => {
                if (message.receiver_id && !u.is_group && (u.id == message.sender_id || u.id == message.receiver_id)) {
                    u.last_message = message.message;
                    u.last_message_date = message.created_at;
                    return u;
                }
                if (message.group_id && u.is_group && u.id == message.group_id) {
                    u.last_message = message.message;
                    u.last_message_date = message.created_at;
                    return u;
                }
                return u;
            });
        });
    };

    const messageDeleted = ({ prevMessage }) => {
        if (!prevMessage) return;
        messageCreated(prevMessage);
    };

    useEffect(() => {
        const offCreated = on("message.created", messageCreated);
        const offDeleted = on("message.deleted", messageDeleted);
        const offModalShow = on("GroupModal.show", (group) => {
            setShowGroupModal(true);
        });
        const offGroupDelete = on("group.deleted", ({id, name}) => {
            setLocalConversations((oldConversations) => {
                return oldConversations.filter((con) => con.id != id);
            });
            // emit('toast.show', `Group ${name} was deleted`);
            if (!selectedConversation || selectedConversation.is_group && selectedConversation.id == id) {
                router.visit(route("dashboard"));
            }
        });

        return () => {
            offCreated();
            offDeleted();
            offModalShow();
            offGroupDelete();
        };
    }, [on]);

    useEffect(() => {
        setSortedConversations(
            filteredConversations.sort((a, b) => {
                if (a.last_message_date && b.last_message_date) {
                    return b.last_message_date.localeCompare(a.last_message_date);
                }
                return 0;
            })
        );
    }, [localConversations]);

    useEffect(() => {
        setLocalConversations(conversations);
    }, [conversations]);

    // Handle selected users from UserPicker
    const handleUserSelect = (users) => {
        setSelectedUsers(users);
    };

    useEffect(() => {
        Echo.join('online')
            .here((users) => {
                const onlineUsersObj = Object.fromEntries(
                    users.map((user) => [user.id, user])
                );
                setOnlineUsers((prevOnlineUsers) => ({ ...prevOnlineUsers, ...onlineUsersObj }));
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
            });
        return () => {
            Echo.leave("online");
        };
    }, []);

    return (
        <>
            <div className="flex-1 w-full flex overflow-hidden">
                <div className={`transition-all w-full sm:w-[220px] md:w-[420px] bg-emerald-900 border-r-2 border-r-emerald-950 flex flex-col overflow-hidden ${selectedConversation ? "-ml-[100%] sm:ml-0" : ""}`}>
                    <div className="flex p-2">
                        <SearchConversation 
                            value={selectedUsers} 
                            options={users}
                            onSelect={handleUserSelect} 
                        />
                        <div className="tooltip tooltip-left pt-1" data-tip="Create new Group">
                            <button onClick={() => setShowGroupModal(true)} className="text-gray-100 hover:text-gray-400">
                                <PencilSquareIcon className="w-4 h-4 inline-block ml-2"/>
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-auto bg-emerald-800 border-2 border-emerald-900">
                        {sortedConversations.map((conversation) => (
                            <ConversationItem 
                                key={`${conversation.is_group ? "group_" : "user_"}${conversation.id}`}
                                conversation={conversation}
                                online={!!isUserOnline(conversation.id)}
                                selectedConversation={selectedConversation}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex-1 flex flex-col overflow-hidden">
                    {children}
                </div>
            </div>
            <GroupModal show={showGroupModal} onClose={() => setShowGroupModal(false)} />
        </>
    );
}

export default ChatLayout;
