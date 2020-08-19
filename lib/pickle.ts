import Constants from './utils/constants';
import PickleIterator from './pickleIterator';

class Pickle {
	private buffer: Buffer;
	private header: Buffer;
	private headerSize: number;
	private capacityAfterHeader: number;
	private writeOffset: number;

	constructor(buffer: Buffer) {
		this.buffer = buffer;
	}

	public initEmpty() {
		this.header = new Buffer(0);
		this.headerSize = Constants.getSizeUInt32();
		this.capacityAfterHeader = 0;
		this.writeOffset = 0;
		this.resize(Constants.getPayloadUnit());
		this.setPayloadSize(0);
	}

	public initFromBuffer(buffer: Buffer) {
		this.header = buffer;
		this.headerSize = buffer.length - this.getPayloadSize();
		this.capacityAfterHeader = Constants.getCapacityReadOnly();
		this.writeOffset = 0;

		if (this.headerSize > buffer.length || this.headerSize !== Constants.alignInt(this.headerSize, Constants.getSizeUInt32())) {
			this.headerSize = 0;
		}

		if (this.headerSize === 0) {
			this.header = new Buffer(0);
		}
	}

	public createIterator() {
		return new PickleIterator(this);
	}

	public toBuffer() {
		return this.header.slice(0, this.headerSize + this.getPayloadSize());
	}

	public writeBool(value: boolean) {
		return this.writeInt(value ? 1 : 0);
	}

	public writeInt(value: number) {
		return this.writeBytes(value, Constants.getSizeInt32(), Buffer.prototype.writeInt32LE);
	}

	public writeUInt32(value: number) {
		return this.writeBytes(value, Constants.getSizeUInt32(), Buffer.prototype.writeUInt32LE);
	}

	public writeInt64(value: number) {
		return this.writeBytes(value, Constants.getSizeInt64(), Buffer.prototype.writeInt64LE);
	}

	public writeUInt64(value: number) {
		return this.writeBytes(value, Constant.getSizeUInt64(), Buffer.prototype.writeUInt64LE);
	}

	public writeFloat(value: number) {
		return this.writeBytes(value, Constants.getSizeFloat(), Buffer.prototype.writeFloatLE);
	}

	public writeDouble(value: number) {
		return this.writeBytes(value, Constants.getSizeDouble(), Buffer.prototype.writeDoubleLE);
	}

	public writeString(value: string) {
		const length = Buffer.byteLength(value, 'utf8');

		if (!this.writeInt(length)) {
			return false;
		}

		return this.writeBytes(value, length);
	}

	public setPayloadSize(payloadSize: number) {
		return this.header.writeUInt32LE(payloadSize, 0);
	}

	public getPayloadSize() {
		return this.header.readUInt32LE(0);
	}

	private writeBytes(data: number, length: number, method?: () => number) {
		const dataLength = Constants.alignInt(length, Constants.getSizeUInt32);
		const newSize = this.writeOffset + dataLength;

		if (newSize > this.capacityAfterHeader) {
			this.resize(Math.max(this.capacityAfterHeader * 2, newSize));
		}
		
		if (method) {
			method.call(this.header, data, this.headerSize + this.writeOffset);
		} else {
			this.header.write(data, this.headerSize, this.writeOffset, length);
		}

		const endOffset = this.headerSize + this.writeOffset + length;
		this.header.fill(0, endOffset, endOffset + dataLength - length);
		this.setPayloadSize(newSize);
		this.writeOffset = newSize;

		return true;
	}

	private resize(newCapacity: number) {
		const newCapacity = alignInt(newCapacity, Constants.getPayloadUnit());
		this.header = Buffer.concat([this.header, new Buffer(newCapacity)]);
		this.capacityAfterHeader = newCapacity;
	}
}

export default Pickle;
