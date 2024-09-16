import {
    PaperClipIcon,
    ArrowDownTrayIcon,
    PlayCircleIcon,
} from "@heroicons/react/24/solid";
import { isAudio, isImage, isPDF, isPreviewable, isVideo } from "../..//helpers";

const MessageAttachments = ({ attachments, attachmentClick }) => {
    // Determine if there is only one attachment
    const isSingleAttachment = attachments.length === 1;

    return (
        <>
            {attachments.length > 0 && (
                <div className="mt-2 flex flex-wrap justify-end gap-1">
                    {attachments.map((attachment, ind) => (
                        <div
                            key={attachment.id}
                            className={`group flex flex-col items-center justify-center text-gray-500 relative cursor-pointer 
                                ${isAudio(attachment) ? "w-84" : isSingleAttachment ? "w-96" : "w-44"} aspect-square bg-blue-100
                            `}
                        >
                            {/* Download Button */}
                            <a
                                onClick={(ev) => ev.stopPropagation()} // Prevent triggering attachmentClick
                                download
                                href={attachment.url}
                                className="z-20 opacity-100 group-hover:opacity-100 transition-all w-8 h-8 flex items-center justify-center text-gray-100 bg-gray-700 rounded absolute right-0 top-0 cursor-pointer hover:bg-gray-800"
                            >
                                <ArrowDownTrayIcon className="w-4 h-4" />
                            </a>

                            {/* Attachment Preview */}
                            <div
                                onClick={(ev) => attachmentClick(attachments, ind)} // Handles the preview click
                                className="relative w-full h-full flex items-center justify-center"
                            >
                                {isImage(attachment) && (
                                    <img
                                        src={attachment.url}
                                        className="object-contain aspect-square bg-gray-800"
                                    />
                                )}

                                {isVideo(attachment) && (
                                    <div className="relative flex justify-center items-center">
                                        <PlayCircleIcon className="z-20 absolute w-16 h-16 text-white opacity-70" />
                                        <div className="absolute left-0 top-0 max-w-96 h-auto bg-black/50 z-10"></div>
                                        <video src={attachment.url} className="w-full h-full object-cover"></video>
                                    </div>
                                )}

                                {isAudio(attachment) && (
                                    <div className="relative flex justify-center items-center">
                                        <audio src={attachment.url} controls></audio>
                                    </div>
                                )}

                                {isPDF(attachment) && (
                                    <div className="relative flex justify-center items-center">
                                        <iframe
                                            src={attachment.url}
                                            className="w-full h-full"
                                        ></iframe>
                                    </div>
                                )}

                                {!isPreviewable(attachment) && (
                                    <div className="flex flex-col justify-center items-center">
                                        <PaperClipIcon className="w-10 h-10 mb-3" />
                                        <small className="text-center overflow-hidden text-ellipsis">
                                            {attachment.name}
                                        </small>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default MessageAttachments;
