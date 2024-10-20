import { useState, useEffect } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useEventBus } from '@/EventBus';
import Toast from '@/Components/App/Toast';

export default function Authenticated({ header, children }) {
    const page = usePage();
    const user = page.props.auth.user;
    const conversations = page.props.conversations;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const { emit } = useEventBus();

    useEffect(() => {
        // Emit loading conversations toast on component mount
        emit('toast.show', "Loading conversations...");

        if (!conversations || conversations.length === 0) {
            console.log("No conversations to listen for.");
            return; // Exit the effect if there are no conversations
        }
    
        conversations.forEach((conversation) => {
            let channel = `message.group.${conversation.id}`;
            if (conversation.is_user) {
                channel = `message.user.${[
                    parseInt(user.id),
                    parseInt(conversation.id),
                ]
                .sort((a, b) => a - b)
                .join("-")}`;
            }
    
            Echo.private(channel)
                .error((error) => {
                    console.error(error);
                })
                .listen("SocketMessage", (e) => {
                    console.log("SocketMessage", e);
                    const message = e.message;
    
                    // Emit new message event if the conversation is not selected
                    emit("message.created", message);
                    if (message.sender_id === user.id) {
                        return;
                    }
                    emit("newMessageNotification", {
                        user: message.sender,
                        group_id: message.group_id,
                        message: message.message || `Shared ${
                            message.attachments.length === 1
                                ? "an attachment"
                                : message.attachments.length + " attachments"
                        }`,
                    });
                });
    
            if (conversation.is_group) {
                Echo.private(`group.deleted.${conversation.id}`)
                    .listen("GroupDeleted", (e) => {
                        console.log("GroupDeleted", e);
                        emit("group.deleted", { id: e.id, name: e.name });
                    })
                    .error((error) => {
                        console.error(error);
                    });
            }
        });

        // Emit a success toast after loading conversations
        emit('toast.show', "Conversations loaded successfully!");

        // Cleanup listener when component unmounts or conversations change
        return () => {
            Echo.leaveChannel();
        };
    }, [conversations, user, emit]);
    
    return (
        <>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-100 flex flex-col h-screen">
                <nav className="bg-emerald-900 dark:bg-emerald-950">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex">
                                <div className="flex text-gray-100">
                                    <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                                        <h1 className="text-3xl text-white font-bold font-anton">TUTALK</h1>
                                    </NavLink>
                                </div>
                            </div>

                            <div className="hidden sm:flex sm:items-center sm:ms-6">
                                <div className="ms-3 relative">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-emerald-800 dark:text-gray-100 bg-white dark:bg-emerald-950 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150"
                                                >
                                                    {user.name}

                                                    <svg
                                                        className="ms-2 -me-0.5 h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content>
                                            <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                            <Dropdown.Link href={route('logout')} method="post" as="button">
                                                Log Out
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            </div>

                            <div className="-me-2 flex items-center sm:hidden">
                                <button
                                    onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-800 dark:text-gray-800 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-900 focus:text-gray-500 dark:focus:text-gray-400 transition duration-150 ease-in-out"
                                >
                                    <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                        <path
                                            className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                        <path
                                            className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                        <div className="text-gray-100 pt-2 pb-3 space-y-1">
                            <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                                Dashboard
                            </ResponsiveNavLink>
                        </div>

                        <div className="pt-4 pb-1 border-t border-gray-200 dark:border-gray-600">
                            <div className="px-4">
                                <div className="font-medium text-base text-gray-800 dark:text-gray-800">{user.name}</div>
                                <div className="font-medium text-sm text-gray-800">{user.email}</div>
                            </div>

                            <div className="mt-3 space-y-1">
                                <ResponsiveNavLink href={route('profile.edit')}>Profile</ResponsiveNavLink>
                                <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                    Log Out
                                </ResponsiveNavLink>
                            </div>
                        </div>
                    </div>
                </nav>

                {header && (
                    <header className="bg-white dark:bg-gray-800 shadow">
                        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>
                    </header>
                )}

                {children}
            </div>
            <Toast />
        </>
    );
}
