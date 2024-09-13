import ChatLayout from '@/Layouts/ChatLayout';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useRef, useState, useEffect, useCallback } from 'react';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';
import ConversationHeader from '@/Components/App/ConversationHeader';
import MessageItem from '@/Components/App/MessageItem';
import MessageInput from '@/Components/App/MessageInput';
import AttachmentPreviewModal from '@/Components/App/AttachmentPreviewModal';
import { useEventBus } from '@/EventBus';

function Home({ selectedConversation = null, messages = null }) {
    const [localMessages, setLocalMessages] = useState([]);
    const [noMoreMessages, setNoMoreMessages] = useState(false);
    const [scrollFromBottom, setScrollFromBottom] = useState(0);
    const loadMoreIntersect = useRef(null);
    const messagesCtrRef = useRef(null);
    const [showAttachmentPreview, setShowAttachmentPreview] = useState(false);
    const [previewAttachment, setPreviewAttachment] = useState({});
    const { on } = useEventBus();

    const messageCreated = (message) => {
        if (selectedConversation && selectedConversation.is_group && selectedConversation.id == message.group_id) {
            setLocalMessages((prevMessages) => [...prevMessages, message]);
        }

        if (selectedConversation && selectedConversation.is_user && (selectedConversation.id == message.sender_id || selectedConversation.id == message.receiver_id)) {
            setLocalMessages((prevMessages) => [...prevMessages, message]);
        }
    };

    const loadMoreMessages = useCallback(() => {
        console.log('Loading more messages... ', noMoreMessages); 
        if(noMoreMessages) {
            // debugger;       // for testing purposes (remove when finished)          
            return;
        }
        // Find the first message object
        const firstMessage = localMessages[0];
        axios.get(route("message.loadOlder", firstMessage.id))
            .then(({ data }) => {
                if (data.data.length === 0) {
                    console.log('No more messages.');
                    setNoMoreMessages(true);
                    return;
                }
                // Calculate how much is scrolled from bottom and scroll to the same position from bottom after messages are loaded
                const scrollHeight = messagesCtrRef.current.scrollHeight;
                const scrollTop = messagesCtrRef.current.scrollTop;
                const clientHeight = messagesCtrRef.current.clientHeight;
                const tmpScrollFromBottom = scrollHeight - scrollTop - clientHeight;
                console.log("tmpScrollFromBottom ", tmpScrollFromBottom);
                setScrollFromBottom(scrollHeight - scrollTop - clientHeight);
                setLocalMessages((prevMessages) => {
                    return [...data.data.reverse(), ...prevMessages];
                });
            });
    }, [localMessages, noMoreMessages]);

    const onAttachmentClick = (attachments, ind) => {
        setPreviewAttachment({
            attachments,
            ind,
        });
        setShowAttachmentPreview(true);
    };

    useEffect(() => {
        setTimeout(() => {
            if (messagesCtrRef.current){
                messagesCtrRef.current.scrollTop = messagesCtrRef.current.scrollHeight;
            }
        }, 10);

        const offCreated = on('message.created', messageCreated);
        setScrollFromBottom(0);
        setNoMoreMessages(false);

        return () => {
            offCreated();
        };
    }, [selectedConversation]);

    useEffect(() => {
        setLocalMessages(messages ? messages.data.reverse() : []);
    }, [messages]);

    useEffect(() => {
        // Scroll from bottom after messages are loaded
        if (messagesCtrRef.current && scrollFromBottom !== null) {
            messagesCtrRef.current.scrollTop = 
                messagesCtrRef.current.scrollHeight - 
                messagesCtrRef.current.offsetHeight - 
                scrollFromBottom;
        }
        if (noMoreMessages) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => 
                entries.forEach(
                    (entry) => entry.isIntersecting && loadMoreMessages()
                ),
            {
                rootMargin: "0px 0px 250px 0px",
            }
        );
        if (loadMoreIntersect.current) {
            setTimeout(() => {
                observer.observe(loadMoreIntersect.current);
            }, 100);
        }
        return () => {
            observer.disconnect();
        };
    }, [localMessages]);

    return (
        <>
            {!messages && (
                <div className="felx flex-col gap-8 justify-center items-center text-center h-full opacity-35 pt-24">
                    <div className="text-2xl md:text-4xl p-16 text-gray-800">
                        Please select conversation to see messages
                    </div>
                    <ChatBubbleLeftRightIcon className="w-32 h-32 inline-block" />
                </div>
            )}
            {messages && (
                <>  
                    {/* Non-scrollable Header */}
                    <ConversationHeader 
                        selectedConversation={selectedConversation}
                    />

                    {/* Messages || Main Scrollable Area */}
                    <div ref={messagesCtrRef} className="flex-1 overflow-y-auto p-5">
                        {/* No messages section */}
                        {localMessages.length === 0 && (
                        <div className="flex justify-center items-center h-full">
                            <div className="text-lg text-slate-200">
                                No messages found
                            </div>
                        </div>
                        )}
                        {/* Messages exists */}
                        {localMessages.length > 0 && (
                            <div className="flex-1 flex-col">
                                <div ref={loadMoreIntersect}></div>
                                {localMessages.map((message) => (
                                    <MessageItem key={message.id} message={message} attachmentClick={onAttachmentClick}/>    
                                ))}
                            </div>
                        )}
                    </div>
                    <MessageInput conversation={selectedConversation} />
                </>
            )}

            {previewAttachment.attachments && (
                <AttachmentPreviewModal 
                    attachments={previewAttachment.attachments}
                    index={previewAttachment.ind}
                    show={showAttachmentPreview}
                    onClose={() => setShowAttachmentPreview(false)}
                />
            )}
        </>
    );
}

Home.layout = (page) => {
    return (
        <AuthenticatedLayout user={page.props.auth.user}>
            <ChatLayout children={page} />
        </AuthenticatedLayout>
    );
};

export default Home;