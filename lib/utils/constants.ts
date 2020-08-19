export default Constants {
	// size of various number types
	private sizeInt32 = 4;
	private sizeUInt32 = 4;
	private sizeInt64 = 8;
	private sizeUInt64 = 8;
	private sizeFloat = 4;
	private sizeDouble = 8;

	// allocation granularity of the payload
	private payloadUnit = 64;

	// largets number in js
	private capacityReadOnly = 9007199254740992;

	// aligns 'i' by rounding it up to the next multiple of alignment
	public alignInt(i: number, alignment: number) {
		return i + (alignment - (i % alignment)) % alignment;	
	}
	
	// getter functions
	public getSizeInt32() {
		return this.sizeInt32;
	}

	public getSizeUInt32() {
		return this.sizeUInt32;
	}

	public getSizeInt64() {
		return this.sizeInt64;
	}

	public getSizeUInt64() {
		return this.sizeUInt64;
	}

	public getSizeFloat() {
		return this.sizeFloat;
	}

	public getSizeDouble() {
		retun this.sizeDouble();
	}

	public getPayloadUnit() {
		return this.payloadUnit;
	}

	public getCapacityReadOnly() {
		return this.capacityReadOnly;
	}
}
