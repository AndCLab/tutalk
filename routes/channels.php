<?php

use Illuminate\Support\Facades\Broadcast;
use App\Http\Resources\UserResource;
use App\Models\User;

Broadcast::channel('online', function (User $user) {
    return $user ? new UserResource($user) : null;
});

// defines one-to-one channel
Broadcast::channel('message.user.{userId1}-{userId2}', function (User $user, int $userId1, int $userId2) {
    // If current user id is equal to either userId1 or userId2, allow access to channel/conversation
    return $user->id === $userId1 || $user->id === $userId2 ? $user : null;
});

//defines by-group channel
Broadcast::channel('message.group.{groupId}', function (User $user, int $groupId) {
    // If current user is a member of the group with the selected groupId, allow access to channel/group
    return $user->groups->contains('id', $groupId) ? $user : null;
});

Broadcast::channel('group.deleted.{groupId}', function (User $user, int $groupId){
    return $user->groups->contains('id', $groupId);
});
