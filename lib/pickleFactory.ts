import Pickle from './pickle';

export default class PickleFactory {
	public createEmpty() {
		return new Pickle();
	}

	public createFromBuffer(buffer: Buffer) {
		return new Pickle(buffer);
	}
}
