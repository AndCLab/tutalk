<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Http\Requests\StoreGroupRequest;
use App\Http\Requests\UpdateGroupRequest;
use App\Jobs\DeleteGroupJob;

class GroupController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreGroupRequest $request)
    {
        $data = $request->validated();
        $data['owner_id'] = $request->user()->id;
        
        $user_ids = $data['user_ids'] ?? [];
        $group = Group::create($data);
        $group->users()->attach(array_unique([$request->user()->id, ...$user_ids]));

        return redirect()->back();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateGroupRequest $request, Group $group)
{
    // Check if the current user is authorized to update the group
    if ($group->owner_id !== $request->user()->id) {
        abort(403, 'Unauthorized action.');
    }

    $data = $request->validated();
    $user_ids = $data['user_ids'] ?? [];
    unset($data['owner_id']);
    $group->update($data);

    // Removes all users and attaches new users
    $group->users()->detach();
    $group->users()->attach(array_unique([$request->user()->id, ...$user_ids]));

    return redirect()->back();
}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Group $group)
    {
        // Check if user is owner of the group
        if ($group->owner_id !== auth()->id()) {
            abort(403);   
        }

        DeleteGroupJob::dispatch($group);

        return response()->json(['message' => 'Deleting messages from group...']);
    }
}
