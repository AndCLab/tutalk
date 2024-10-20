import TextAreaInput from "@/Components/TextAreaInput";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import TextInput from "@/Components/TextInput";
import SecondaryButton from "@/Components/SecondaryButton";
import PrimaryButton from "@/Components/PrimaryButton";
import UserPicker from "@/Components/App/UserPicker";
import { useForm, usePage } from "@inertiajs/react";
import { useEventBus } from "@/EventBus";
import { useEffect, useState } from "react";
import EditTextInput from "../EditTextInput";

export default function GroupModal({ show = false, onClose = () => {} }) {
    const page = usePage();
    const conversations = page.props.conversations;
    const { on, emit } = useEventBus();
    const [group, setGroup] = useState({});
    const { data, setData, processing, reset, post, put, errors } = useForm({
        id: "",
        name: "",
        description: "",
        user_ids: [],
    });
    const users = conversations.filter((c) => !c.is_group);

    const createOrUpdateGroup = (e) => {
        e.preventDefault();
        if (group.id) {
            put(route("group.update", group.id), {
                data: {
                    name: data.name,
                    description: data.description,
                    user_ids: data.user_ids,
                },
                onSuccess: () => {
                    closeModal();
                    emit("toast.show", `Group "${data.name}" was updated successfully!`); // Emit success toast for update
                },
                onError: () => {
                    emit("toast.show", `Failed to update group "${data.name}".`); // Emit error toast if needed
                },
            });
            return;
        }
        post(route("group.store"), {
            data: {
                name: data.name,
                description: data.description,
                user_ids: data.user_ids,
            },
            onSuccess: () => {
                closeModal();
                emit("toast.show", `Group "${data.name}" was created successfully!`); // Emit success toast for creation
            },
            onError: () => {
                emit("toast.show", `Failed to create group "${data.name}".`); // Emit error toast if needed
            },
        });
    };

    const closeModal = () => {
        reset();
        onClose();
    };

    useEffect(() => {
        return on("GroupModal.show", (group) => {
            setData({
                name: group.name,
                description: group.description,
                user_ids: group.users
                    .filter((u) => group.owner_id !== u.id)
                    .map((u) => u.id),
            });
            setGroup(group);
        });
    }, [on]);

    return (
        <Modal show={show} onClose={closeModal}>
            <form onSubmit={createOrUpdateGroup} className="p-6 overflow-y-auto">
                <h2 className="text-xl font-medium text-gray-900 dark:text-emerald-800">
                    {group.id ? `Edit Group "${group.name}"` : "Create new Group"}
                </h2>
                <div className="mt-8">
                    <InputLabel htmlFor="name" value="Name" />
                    <EditTextInput 
                        id="name" 
                        className="mt-1 block w-full" 
                        value={data.name}  
                        onChange={(e) => setData("name", e.target.value)}
                        required
                    />
                    <InputError className="mt-2" message={errors.description} />
                </div>
                <div className="mt-8">
                    <InputLabel htmlFor="description" value="Description" />
                    <EditTextInput 
                        id="description" 
                        className="mt-1 block w-full" 
                        value={data.description} 
                        onChange={(e) => setData("description", e.target.value)}  
                    />
                    <InputError className="mt-2" message={errors.description} />
                </div>

                <div className="mt-4">
                    <InputLabel value="Select Users" />
                    <UserPicker 
                        value={
                            users.filter(
                                (u) => 
                                    group.owner_id !== u.id && 
                                    data.user_ids.includes(u.id)
                            ) || []
                        }
                        options={users}
                        onSelect={(users) =>
                            setData(
                                "user_ids", 
                                users.map((u) => u.id)
                            )
                        }
                    />
                    <InputError className="mt-2" message={errors.user_ids} />
                </div>

                <div className="mt-6 flex justify-end">
                    <SecondaryButton onClick={closeModal}>
                        Cancel
                    </SecondaryButton>
                    <PrimaryButton className="ms-3" disabled={processing}>
                        {group.id ? "Update" : "Create"}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
