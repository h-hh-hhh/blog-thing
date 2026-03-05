/// <reference types="bun-types" />

// Allow importing the Bun SQLite built-in without TS complaints.
declare module 'bun:sqlite';

// bcryptjs ships its own types; suppress missing type lib resolution complaints.
declare module 'bcryptjs';
