<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\User;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'avatar',
        'fname',
        'lname',
        'name',
        'email',
        'email_verified_at',
        'password',
        'address',
        'zip_code',
        'phone_prefix',
        'phone_number',
        'is_stepper',
        'user_type',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function tutors()
    {
        return $this->hasMany(Tutor::class);
    }

    public function tutees()
    {
        return $this->hasMany(Tutee::class);
    }

    public function fields()
    {
        return $this->hasMany(Fields::class);
    }

    public function groups()
    {
        return $this->belongsToMany(Group::class, 'group_users');
    }

    public function tutor()
    {
        return $this->hasOne(Tutor::class, 'user_id');
    }  

    public static function getUsersExceptUser(User $user)
    {
        $userId = $user->id;
        $query = User::select(['users.*', 'messages.message as last_message', 'messages.created_at as last_message_date'])
            ->where('users.id', '!=', $userId)
            ->when(!$user->is_admin, function ($query) {
                $query->whereNull('users.blocked_at');
            })
            ->leftJoin('conversations', function ($join) use ($userId) {
                $join->on('conversations.user_id1', '=', 'users.id')
                    ->where('conversations.user_id2', '=', $userId)
                    ->orWhere(function ($query) use ($userId){
                        $query->on('conversations.user_id2', '=', 'users.id')
                            ->where('conversations.user_id1', '=', $userId);
                    });
            })
            ->leftJoin('messages', 'messages.id', '=', 'conversations.last_message_id')
            ->orderByRaw('IFNULL(users.blocked_at, 1)')
            ->orderBy('messages.created_at', 'desc')
            ->orderBy('users.name')
            ;

            // dd($query->toSql());
            return $query->get();
    }

    public function toConversationArray() 
    {
        return [
            'id' => $this->id,
            'fname' => $this->fname,
            'lname' => $this->lname,
            'name' => $this->name,
            'is_group' => false,
            'is_user' => true,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'blocked_at' => $this->blocked_at,
            'last_message' => $this->last_message,
            'last_message_date' => $this->last_message_date ? ($this->last_message_date . ' UTC') : null,
            'user_type' => $this->user_type,
            'verify_status' => $this->tutor ? $this->tutor->verify_status === 'verified' : false,
        ];
    }
}
