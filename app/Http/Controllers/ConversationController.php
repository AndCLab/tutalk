<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use Illuminate\Http\Request;

class ConversationController extends Controller
{
    public function index(Request $request)
    {
        $perPage = 10; 
        // Get conversations with pagination
        $conversations = Conversation::paginate($perPage);
        
        return response()->json($conversations);
    }

    public function loadOlderItems(ConversationItem $conversationItem)
{
    // Check if the conversation is a group or direct chat
    if ($conversationItem->conversation->is_group) {
        // If it's a group conversation, load older items based on group_id
        $items = ConversationItem::where('created_at', '<', $conversationItem->created_at)
            ->where('conversation_id', $conversationItem->conversation_id)
            ->latest()
            ->paginate(10);
    } else {
        // If it's a direct conversation, load older items between the two users
        $items = ConversationItem::where('created_at', '<', $conversationItem->created_at)
            ->where('conversation_id', $conversationItem->conversation_id)
            ->latest()
            ->paginate(10);
    }

    // Return a paginated collection of the conversation items
    return ConversationItemResource::collection($items);
}

}
