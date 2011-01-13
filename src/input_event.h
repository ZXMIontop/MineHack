#ifndef INPUT_EVENT_H
#define INPUT_EVENT_H

#include <cstdio>
#include <string>
#include <cstdint>

#include "login.h"
#include "session.h"
#include "chunk.h"

#define CHAT_LINE_MAX_LEN	128

namespace Game
{
	//Different input events
	enum class InputEventType : uint16_t
	{
		NoEvent 	= 0,
	
		PlayerTick	= 1,
		DigBlock	= 2,
		PlaceBlock	= 3,
		Chat		= 4,
		
		//Internal event types, first 256 values used for network events
		PlayerJoin	= 0x100,
		PlayerLeave,
	};
	
	
	struct DigEvent
	{
		int x, y, z;
		
		int extract(void* buf, size_t len);
	};
		
	struct PlayerEvent
	{
		int x, y, z;
		float pitch, yaw;
		int input_state;

		int extract(void* buf, size_t len);
	};
	
	struct BlockEvent
	{
		int x, y, z;
		Block b;
		
		int extract(void* buf, size_t len);
	};

	struct JoinEvent
	{
		char name[USERNAME_MAX_LEN];
		
		int extract(void* buf, size_t len);
	};
	
	struct LeaveEvent
	{
		int extract(void* buf, size_t len);
	};
	
	
	struct ChatEvent
	{
		uint8_t len;
		char msg[CHAT_LINE_MAX_LEN];
		
		int extract(void* buf, size_t len);
	};
		
	struct InputEvent
	{
		InputEventType		type;
		Server::SessionID 	session_id;
		
		union
		{
			DigEvent	dig_event;
			JoinEvent	join_event;
			PlayerEvent player_event;
			LeaveEvent	leave_event;
			BlockEvent	block_event;
			ChatEvent	chat_event;
		};
		
		
		//Extracts an input event from the stream
		int extract(
			void* buf, 
			size_t buf_len);
	};
	
	
};

#endif
