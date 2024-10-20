import { useState, Fragment } from "react";
import {
    PaperClipIcon,
    PhotoIcon,
    FaceSmileIcon,
    HandThumbUpIcon,
    PaperAirplaneIcon,
    XCircleIcon,
} from "@heroicons/react/24/solid";
import NewMessageInput from "./NewMessageInput";
import axios from 'axios';
import EmojiPicker from "emoji-picker-react";
import { Popover, Transition } from '@headlessui/react';
import { isAudio, isImage } from "@/helpers";
import AttachmentPreview from "./AttachmentPreview";
import CustomAudioPlayer from "./CustomAudioPlayer";
import { BeatLoader } from 'react-spinners'; 
import { useEventBus } from "@/EventBus";

const MessageInput = ({ conversation = null }) => {
    const [newMessage, setNewMessage] = useState("");
    const [inputErrorMessage, setInputErrorMessage] = useState("");
    const [messageSending, setMessageSending] = useState(false);
    const [chosenFiles, setChosenFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const { emit } = useEventBus();

    const onFileChange = (ev) => {
        const files = ev.target.files;
        const updatedFiles = [...files].map((file) => {
            return {
                file: file,
                url: URL.createObjectURL(file),
            };
        });
        ev.target.value = null;
        setChosenFiles((prevFiles) => {
            return [...prevFiles, ...updatedFiles];
        });
    };

    const onSendClick = () => {
        if (messageSending) {
            return;
        }
    
        if (newMessage.trim() === "" && chosenFiles.length === 0) {
            emit('toast.show', "Message cannot be empty.");
            return;
        }
        
        const formData = new FormData();
        chosenFiles.forEach((file) => {
            formData.append("attachments[]", file.file);
        });
        formData.append("message", newMessage);
        
        if (conversation.is_user) {
            formData.append("receiver_id", conversation.id);
        } else if (conversation.is_group) {
            formData.append("group_id", conversation.id);  
        }
    
        const hasAttachments = chosenFiles.length > 0; // Check for attachments
        setMessageSending(true);
    
        // Only show the upload progress toast if there are attachments
        if (hasAttachments) {
            emit('toast.show', "Uploading your attachments...");
        }
    
        axios.post(route("message.store"), formData, {
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadProgress(percentCompleted); // Update local state
    
                // Emit progress, only if there are attachments
                if (hasAttachments) {
                    emit('toast.uploadProgress', {
                        message: `Upload Progress: ${percentCompleted}%`,
                        uuid: 'upload-progress-toast',  // Fixed UUID for upload progress
                    });
                }
            }
        })
        .then((response) => {
            setNewMessage("");
            setMessageSending(false);
            setChosenFiles([]);
            emit('toast.show', "Message sent successfully!");  // Emit success toast
        })
        .catch((error) => {
            setMessageSending(false);
            setChosenFiles([]);
            const message = error?.response?.data?.message || "An error occurred while sending the message";
            emit('toast.show', message);
        });
    }
    

    const onLikeClick = () => {
        if(messageSending) {
            return;
        }
        const data = { 
            message: "👍", 
        }
        if (conversation.is_user) {
            data["receiver_id"] = conversation.id;
        } else if (conversation.is_group) {
            data["group_id"] = conversation.id;  
        } 
        axios.post(route("message.store"), data);
    }

    return (
        <div className="flex flex-wrap items-center border-t-2 border-gray-300 bg-gray-300 py-3">
            {/* Attachments and Image Upload Section */}
            <div className="xs:flex:none xs:order-1 p-2">
                <button className="p-1 text-gray-600 hover:text-emerald-700 relative">
                    <PaperClipIcon className="hidden sm:block w-6" />
                    <input 
                        type="file"
                        multiple
                        onChange={onFileChange}
                        className="absolute left-0 top-0 right-0 bottom-0 z-0 opacity-0 cursor-pointer"
                    />
                </button>
                <button className="p-1 text-gray-600 hover:text-emerald-700 relative">
                    <PhotoIcon className="hidden sm:block w-6" />
                    <input 
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={onFileChange}
                        className="absolute left-0 top-0 right-0 bottom-0 z-0 opacity-0 cursor-pointer pointer-events-all"
                    />
                </button>
            </div>

            {/* Message Input and Send Button */}
            <div className="order-1 px-3 xs:p-0 min-w-[220px] xs:order-2 flex-1 relative">
                <div className="flex">
                    <NewMessageInput 
                        value={newMessage}
                        onSend={onSendClick}
                        onChange={(ev) => setNewMessage(ev.target.value)}
                    />
                    <button onClick={onSendClick} disabled={messageSending} className="hover:bg-emerald-700 hover:border-emerald-700 border-emerald-800 bg-emerald-800 btn btn-info rounded-full hover:text-green-800 ml-3">
                        {!messageSending && (
                            <div className="flex items-center">
                                <span className="hidden sm:inline text-gray-100 pr-2">Send</span>
                                <PaperAirplaneIcon className="w-6 fill-gray-100" />
                            </div>  
                        )}
                        {/* Loading Spinner */}
                        {messageSending && (
                            <div className="flex items-center justify-center mt-2">
                                <BeatLoader color="#4CAF50" loading={messageSending} size={10} />
                            </div>
                        )}
                    </button>
                </div>
                

                {inputErrorMessage && (
                    <p className="text-xs text-red-400">{inputErrorMessage}</p>
                )}
                <div className="flex flex-wrap gap-1 mt-2">
                    {chosenFiles.map((file) => (
                        <div key={file.file.name} 
                            className={`relative flex justify-between cursor-pointer ${!isImage(file.file) ? " w-[240px " : ""}`}
                        >
                            {isImage(file.file) && (
                                <img 
                                    src={file.url}
                                    alt=""
                                    className="w-16 h-16 object-cover"
                                />
                            )}
                            {isAudio(file.file) && (
                                <CustomAudioPlayer
                                    file={file}
                                    showVolume={false}    
                                />
                            )}
                            {!isAudio(file.file) && !isImage(file.file) && (
                                <AttachmentPreview file={file} />
                            )}
                            <button
                                onClick={() => 
                                    setChosenFiles(
                                        chosenFiles.filter(
                                            (f) => f.file.name !== file.file.name
                                        )
                                    )
                                }
                                className="absolute w-6 h-6 rounded-full bg-gray-800 opacity-70 hover:opacity-100 -right-2-top-2 text-gray-300 hover:text-gray-100 z-10"
                            >
                                <XCircleIcon className="w-6 opacity-40" /> 
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Emojis and Reactions Section */}
            <div className="order-3 xs:order-3 p-2 flex">
                <Popover className="hidden sm:block relative">
                    <Popover.Button className="p-1 text-gray-600 hover:text-emerald-700">
                        <FaceSmileIcon className="w-6 h-6" />
                    </Popover.Button>
                    <Popover.Panel className="absolute z-10 right-0 bottom-full">
                        <EmojiPicker theme="dark" onEmojiClick={ev => setNewMessage(newMessage + ev.emoji)} />
                    </Popover.Panel>
                </Popover>
                <button onClick={onLikeClick} className="p-1 text-gray-600 hover:text-emerald-700">
                    <HandThumbUpIcon className="hidden sm:block w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export default MessageInput;
