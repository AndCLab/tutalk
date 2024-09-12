<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use App\Events\SocketMessage;
use App\Models\User;
use App\Models\Message;
use App\Models\Group;
use App\Models\MessageAttachment;
use App\Http\Requests\StoreMessageRequest;
use App\Http\Resources\MessageResource;
use App\Models\Conversation;


class MessageController extends Controller
{
    public function byUser(User $user)
    {
        $messages = Message::where('sender_id', auth()->id())
            ->where('receiver_id', $user->id)
            ->orWhere('sender_id', $user->id)
            ->where('receiver_id', auth()->id())
            ->latest()
            ->paginate(10);

        return inertia('Home', [
            'selectedConversation' => $user->toConversationArray(),
            'messages' => MessageResource::collection($messages),
        ]);
        
    }

    public function byGroup(Group $group)
    {
        $messages = Message::where('group_id', $group->id)
            ->latest()
            ->paginate(10);

        return inertia('Home', [
            'selectedConversation' => $group->toConversationArray(),
            'messages' => MessageResource::collection($messages),
        ]);
    }

    public function loadOlder(Message $message)
    {
        // Load messages that are older than the given message, sorted by latest
        if($message->group_id) {
            $messages = Message::where('created_at', '<', $message->created_at)
                ->where('group_id', $message->group_id)
                ->latest()
                ->paginate(10);
        } else {
            $messages = Message::where('created_at', '<', $message->created_at)
                ->where(function ($query) use ($message) {
                    $query->where('sender_id', $message->sender_id)
                        ->where('receiver_id', $message->receiver_id)
                        ->orWhere('sender_id', $message->receiver_id)
                        ->where('receiver_id', $message->sender_id);
                })
                ->latest()
                ->paginate(10);
        }
        return MessageResource::collection($messages);
    }

    public function store(StoreMessageRequest $request)
    {
        $data = $request->validated();
    \Log::info('Request Data: ', $data);
        $data['sender_id'] = auth()->id();
        $receiverId = $data['receiver_id'] ?? null;
        $groupId = $data['group_id'] ?? null;

        $files = $data['attachments'] ?? [];

        $message = Message::create($data);
        $attachments = [];

        if ($files) {
            // Iterate the attachments array if file exists
            foreach($files as $file) {
                $directory = 'attachments/' . Str::random(32);
                Storage::makeDirectory($directory);
                $model = [
                    'message_id' => $message->id,
                    'name' => $file->getClientOriginalName(),
                    'mime' => $file->getClientMimeType(),
                    'size' => $file->getSize(),
                    'path' => $file->store($directory, 'public'),
                ];
                $attachment = MessageAttachment::create($model);
                $attachments[] = $attachment;
            }
            // Store the file in attachments array inside message model
            $message->attachments = $attachments;
        }
        // Update the converstaion when new message exists for user/group
        if ($receiverId) {
            Conversation:: updateConversationWithMessage($receiverId, auth()->id(), $message); 
        }
        if ($groupId) {
            Group::updateGroupWithMessage($groupId, $message);
        }
        //Implement socket to create real-time event when messages are sent
        SocketMessage::dispatch($message);
        return new MessageResource($message);
    }

    public function destroy(Message $message)
    {
        // Check if the user is the onwer of the message
        if($message->sender_id !== auth()->id()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $message->delete();
        return response('', 204);
    }
}

