import { usePage } from "@inertiajs/react";
import ReactMarkdown from "react-markdown";
import React from "react";
import UserAvatar from "./UserAvatar";
import { formatMessageDateLong } from "@/helpers";
import MessageAttachments from "./MessageAttachments";
import { isImage, isVideo, isAudio } from "../../helpers"; // Import helpers to check for media types
import MessageOptionsDropdown from "./MessageOptionsDropdown";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const MessageItem = ({ message, attachmentClick }) => {
    const currentUser = usePage().props.auth.user;

    // Check if message contains attachments (i.e., images or videos)
    const hasAttachments = message.attachments && message.attachments.length > 0;

    // Check if attachments include images or videos
    const hasImageOrVideo = message.attachments.some(attachment => isImage(attachment) || isVideo(attachment));

     // Check if attachments include audio
     const hasAudio = message.attachments.some(attachment => isAudio(attachment));

     // Check if sender is verified (based on `tutor_verification_status` in the UserResource)
    const isVerified = message.sender.tutor_verification_status === 'verified';
    // console.log('message sender', message.sender);
    
    return (
        <div className={`chat ${message.sender_id === currentUser.id ? "chat-end pt-3 pl-11" : "chat-start pr-11"}`}>
            <UserAvatar user={message.sender} />
            <div className="chat-header">
            <div className="flex items-center space-x-1">
                    {message.sender_id !== currentUser.id && (
                        <span>{message.sender.name}</span>
                    )}
                    {/* Show verified icon if the user is verified */}
                    {(message.sender_id !== currentUser.id && isVerified) && (
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    )}
                    {message.sender_id !== currentUser.id && (
                        <time className={`text-xs opacity-50 text-gray-800`}>
                            {formatMessageDateLong(message.created_at)}
                        </time>
                    )}
                </div>

                {/* Render chat-bubble only if there are no media attachments */}
                {!hasAttachments && (
                    <div className={`chat-bubble relative ${message.sender_id === currentUser.id ? "chat-bubble-success" : ""} max-w-xl`}>

                        {message.sender_id === currentUser.id && (
                            <MessageOptionsDropdown message={message} />
                        )}

                        <div className="chat-message text-base">
                            {/* Render text content */}
                            <div className="chat-message-content m-w-full">
                                <ReactMarkdown>{message.message}</ReactMarkdown>
                            </div>
                        </div>
                    </div>
                )}

                {/* Handle media attachments like images or videos without chat bubble */}
                {hasAttachments && hasImageOrVideo && (
                    <div className={`chat-bubble bg-transparent ${message.sender_id === currentUser.id ? "chat-bubble-success" : ""} max-w-full`}>
                        {message.sender_id === currentUser.id && (
                            <MessageOptionsDropdown message={message} />
                        )}
                        <div className="chat-image max-w-screen-sm">
                            <MessageAttachments
                                attachments={message.attachments}
                                attachmentClick={attachmentClick}
                                className="rounded-sm"
                            />
                        </div>
                    </div>
                )}

                {/* Handle non-visual media attachments */}
                {hasAttachments && !hasImageOrVideo && (
                    <div className={`chat-bubble bg-transparent pl-1 border-2 border-emerald-700 ${message.sender_id === currentUser.id ? "chat-bubble-success" : ""} max-w-xl`}>
                        {message.sender_id === currentUser.id && (
                            <MessageOptionsDropdown message={message} />
                        )}
                        <div className="chat-message">
                            <MessageAttachments
                                attachments={message.attachments}
                                attachmentClick={attachmentClick}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* User timestamp after message/attachment */}
            {message.sender_id === currentUser.id && (
                <time className={`text-xs opacity-50 text-gray-800 ml-2 pt-1`}>
                    {formatMessageDateLong(message.created_at)}
                </time>
            )}
        </div>
    );
};

export default MessageItem;
