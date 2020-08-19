import Pickle from './pickle';
import Constants from './utils/constants';

export default class PickleIterator {
	private payload: Buffer;
	private parloadOffset: number;
	private readIndex: number;
	private endIndex: number;

	constructor(pickle) {
		this.payload = pickle.header;
		this.payloadOffset = pickle.headerSize;
		this.readIndex = 0;
		this.endIndex = pickle.getPayloadSize();
	}

	public readBool() {
		return this.readInt() !== 0;
	}

	public readInt() {
		return this.readBytes(Constants.getSizeInt32(), Buffer.prototype.readInt32LE);
	}

	public readUInt32() {
		return this.readBytes(Constants.getSizeUInt32(), Buffer.prototype.readUInt32LE);
	}

	public readInt64() {
		return this.readBytes(Constants.getSizeInt64(), Buffer.prototype.readInt64LE);
	}

	public readUInt64() {
		return this.readBytes(Constants.getSizeUInt64(), Buffer.prototype.readUInt64LE);
	}

	public readFloat() {
		return this.readBytes(Constants.getSizeFloat(), Buffer.prototype.readFloatLE);
	}

	public readDouble() {
		return this.readBytes(Constants.getSizeDouble(), Buffer.prototype.readDoubleLE);
	}

	public readString() {
		return this.readBytes(this.readInt()).toString();
	}

	private readBytes(length: number, method?: () => number) {
		const readPayloatOffset = this.getReadPayloadOffsetAndAdvance(length);

		if (method == undefined) {
			return this.payload.slice(readPayloadOffset, readPayloadOffset + length);
		}

		return method.call(this.payload, readPayloadOffset, length);
	}

	private getReadPayloadOffsetAndAdvance(length: number) {
		if (length > this.endIndex - this.readIndex) {
			this.readIndex = this.endIndex;
			throw new Error('Failed to read data with length of ' + length);
		}

		const readPayloadOffset = this.payloadOffset + this.readIndex;
		this.advance(length);

		return readPayloadOffset;
	}

	private advance(size: number) {
		const alignedSize = Constants.alignInt(Constants.getSizeUInt32());

		if (this.endIndex - this.readIndex < alignedSize) {
			this.readIndex = this.endIndex;
		} else {
			this.readIndex += alignedSize;
		}
	}
}
