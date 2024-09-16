import { usePage } from "@inertiajs/react";
import ReactMarkdown from "react-markdown";
import React from "react";
import UserAvatar from "./UserAvatar";
import { formatMessageDateLong } from "@/helpers";
import MessageAttachments from "./MessageAttachments";
import { isImage, isVideo, isAudio } from "../../helpers"; // Import helpers to check for media types

const MessageItem = ({ message, attachmentClick }) => {
    const currentUser = usePage().props.auth.user;

    // Check if message contains attachments (i.e., images or videos)
    const hasAttachments = message.attachments && message.attachments.length > 0;

    // Check if attachments include images or videos
    const hasImageOrVideo = message.attachments.some(attachment => isImage(attachment) || isVideo(attachment));

     // Check if attachments include audio
     const hasAudio = message.attachments.some(attachment => isAudio(attachment));

    return (
        <div className={`chat ${message.sender_id === currentUser.id ? "chat-end" : "chat-start"}`}>
            <UserAvatar user={message.sender} />
            <div className="chat-header">
            {message.sender_id !== currentUser.id && (
                <span>{message.sender.name}</span>
            )}
            {message.sender_id !== currentUser.id && (
                <time className={`text-xs opacity-50 text-gray-800 ml-2`}>
                    {formatMessageDateLong(message.created_at)}
                </time>
            )}

            {/* Render chat-bubble only if there are no media attachments */}
            {!hasAttachments && (
                <div className={`chat-bubble relative ${message.sender_id === currentUser.id ? "chat-bubble-success" : ""} max-w-xl`}>
                    <div className="chat-message">
                        {/* Render text content */}
                        <div className="chat-message-content m-w-full">
                            <ReactMarkdown>{message.message}</ReactMarkdown>
                        </div>
                    </div>
                </div>
            )}

            {/* Handle media attachments like images or videos without chat bubble */}
            {hasAttachments && hasImageOrVideo && (
                <div className="chat-image max-w-screen-sm">
                    <MessageAttachments
                        attachments={message.attachments}
                        attachmentClick={attachmentClick}
                        className="rounded-sm"
                    />
                </div>
            )}

            {/* Handle non-visual media attachments*/}
            {hasAttachments && !hasImageOrVideo && (
                <div className={`chat-bubble max-w-full`}>
                    <div className="chat-message">
                        <MessageAttachments
                            attachments={message.attachments}
                            attachmentClick={attachmentClick}
                            className="rounded-sm"
                        />
                    </div>
                </div>
            )}
            </div>

            {/* User timestamp after message/attachment */}
            {message.sender_id === currentUser.id && (
                <time className={`text-xs opacity-50 text-gray-800 ml-2`}>
                    {formatMessageDateLong(message.created_at)}
                </time>
            )}
        </div>
    );
};

export default MessageItem;
