export default class Constants {
	// size of various number types
	public readonly sizeInt32 = 4;
	public readonly sizeUInt32 = 4;
	public readonly sizeInt64 = 8;
	public readonly sizeUInt64 = 8;
	public readonly sizeFloat = 4;
	public readonly sizeDouble = 8;

	// allocation granularity of the payload
	public readonly payloadUnit = 64;

	// largets number in js
	public readonly capacityReadOnly = 9007199254740992;

	// aligns 'i' by rounding it up to the next multiple of alignment
	public alignInt(i: number, alignment: number) {
		return i + (alignment - (i % alignment)) % alignment;	
	}
	
}
