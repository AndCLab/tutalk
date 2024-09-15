import { usePage } from "@inertiajs/react";
import ReactMarkdown from "react-markdown";
import React from "react";
import UserAvatar from "./UserAvatar";
import { formatMessageDateLong } from "@/helpers";
import MessageAttachments from "./MessageAttachments";

const MessageItem = ({ message, attachmentClick }) => {
    const currentUser = usePage().props.auth.user;

    // Check if message contains attachments (i.e., images)
    const hasAttachments = message.attachments && message.attachments.length > 0;

    return (
        <div className={`chat ${message.sender_id === currentUser.id ? "chat-end" : "chat-start"}`}>
            <UserAvatar user={message.sender} />
            <div className="chat-header">
                {message.sender_id !== currentUser.id ? message.sender.name : ""}
                <time className="text-xs opacity-70 text-gray-800 ml-2">
                    {formatMessageDateLong(message.created_at)}
                </time>
            </div>

            {/* Apply chat-bubble and success styles only if no attachments */}
            {!hasAttachments && (
                <div className={`chat-bubble relative ${message.sender_id === currentUser.id ? "chat-bubble-success" : ""}`}>
                    <div className="chat-message">
                        {/* Render text content */}
                        <div className="chat-message-content">
                            <ReactMarkdown>{message.message}</ReactMarkdown>
                        </div>
                    </div>
                </div>
            )}

            {/* Render attachments without chat-bubble or success styles */}
            {hasAttachments && (
                <div className="chat-image max-w-96">
                    <MessageAttachments 
                        attachments={message.attachments} 
                        attachmentClick={attachmentClick} 
                        className="rounded-sm"
                    />
                </div>
            )}
        </div>
    );
};

export default MessageItem;
