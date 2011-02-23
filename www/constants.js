"use strict";

//Chunk parameters
const CHUNK_X_S		= 4;
const CHUNK_Y_S		= 4;
const CHUNK_Z_S		= 4;

const CHUNK_XY_S	= CHUNK_X_S + CHUNK_Y_S;

const CHUNK_X_STEP	= 1;
const CHUNK_Y_STEP	= (1 << CHUNK_X_S);
const CHUNK_Z_STEP	= (1 << CHUNK_XY_S);

const CHUNK_X		= (1<<CHUNK_X_S);
const CHUNK_Y		= (1<<CHUNK_Y_S);
const CHUNK_Z		= (1<<CHUNK_Z_S);

const CHUNK_X_MASK	= CHUNK_X - 1;
const CHUNK_Y_MASK	= CHUNK_Y - 1;
const CHUNK_Z_MASK	= CHUNK_Z - 1;

const CHUNK_SIZE	= CHUNK_X * CHUNK_Y * CHUNK_Z;

const CHUNK_DIMS	= [ CHUNK_X, CHUNK_Y, CHUNK_Z ];

//Network precision
const NET_COORD_PRECISION 	= 64;
const NET_DIVIDE			= 1.0 / NET_COORD_PRECISION;

//Network header size
const NET_HEADER_SIZE		= 30;


//Entity type codes
const PLAYER_ENTITY		= 1;
const MONSTER_ENTITY	= 2;

//Rates for the different game intervals
const GAME_TICK_RATE		= 80;
const GAME_DRAW_RATE		= 40;
const GAME_SHADOW_RATE		= 80;
const GAME_HEARTBEAT_RATE	= 160;

//A fixed delay on the ping, always added
const PING_DELAY		= 5;

//Action event codes
const ACTION_DIG_START		= 0;
const ACTION_DIG_STOP		= 1;
const ACTION_USE_ITEM		= 2;

//Action target codes
const TARGET_NONE			= 0;
const TARGET_BLOCK			= 1;
const TARGET_ENTITY			= 2;
const TARGET_RAY			= 3;
const TARGET_HAS_ITEM		= (1<<7);

const DIG_RADIUS			= 5;


const EV_START				= 0;
const EV_SET_BLOCK			= 1;
const EV_FETCH_CHUNK		= 2;
const EV_VB_UPDATE			= 3;
const EV_CHUNK_UPDATE		= 4;
const EV_PRINT				= 5;
const EV_FORGET_CHUNK		= 6;
const EV_SET_THROTTLE		= 7;
const EV_VB_COMPLETE		= 8;
const EV_SET_NON_PENDING	= 9;

const VB_GEN_RATE		 	= 30;
const FETCH_RATE			= 100;

const MAX_PENDING_CHUNKS	= 25;
const MAX_VB_UPDATES		= 3;

