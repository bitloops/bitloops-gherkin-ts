import { TextEncoder } from 'util';
import { decoder } from './lib/src/decoder.js';

const encode = new TextEncoder().encode;
const decode = decoder;
const d = decoder;

export { decode, d, encode };
