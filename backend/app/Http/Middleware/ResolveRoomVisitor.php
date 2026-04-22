<?php

namespace App\Http\Middleware;

use App\Models\RoomVisitor;
use Closure;
use Illuminate\Http\Request;

class ResolveRoomVisitor
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->header('X-Room-Token');

        if (!$token) {
            return response()->json(['message' => 'Room access token required.'], 401);
        }

        $visitor = RoomVisitor::where('access_token', $token)->first();

        if (!$visitor) {
            return response()->json(['message' => 'Invalid room access token.'], 401);
        }

        if (!$visitor->room || !$visitor->room->isAccessible()) {
            return response()->json(['message' => 'This room is no longer available.'], 403);
        }

        $request->attributes->set('room_visitor', $visitor);
        $request->attributes->set('data_room', $visitor->room);

        return $next($request);
    }
}
