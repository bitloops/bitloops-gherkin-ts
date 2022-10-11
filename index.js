import { TextEncoder } from 'util';
import { decoder } from './dist/src/decoder.js';

const encode = new TextEncoder().encode;
const decode = decoder;
const d = decoder;
const e = encode;

export { decode, d, encode, e };
