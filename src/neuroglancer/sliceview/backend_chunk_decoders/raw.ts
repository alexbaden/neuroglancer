/**
 * @license
 * Copyright 2016 Google Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {VolumeChunk} from 'neuroglancer/sliceview/backend';
import {DataType, DATA_TYPE_BYTES} from 'neuroglancer/sliceview/base';
import {prod3} from 'neuroglancer/util/geom';
import {postProcessRawData} from 'neuroglancer/sliceview/backend_chunk_decoders/postprocess';

export function decodeRawChunk(chunk: VolumeChunk, response: ArrayBuffer) {
  let {spec} = chunk.source;
  let {dataType} = spec;
  let numElements = prod3(chunk.chunkDataSize);
  let bytesPerElement = DATA_TYPE_BYTES[dataType];
  let expectedBytes = numElements * bytesPerElement;
  if (expectedBytes !== response.byteLength) {
    throw new Error(`Raw-format chunk is ${response.byteLength} bytes, but ${numElements} * ${bytesPerElement} = ${expectedBytes} bytes are expected.`);
  }
  let data: ArrayBufferView;
  switch (dataType) {
  case DataType.UINT8:
    data = new Uint8Array(response);
    break;
  case DataType.FLOAT32:
    data = new Float32Array(response);
    break;
  case DataType.UINT32:
  case DataType.UINT64:
    data = new Uint32Array(response);
    break;
  }
  postProcessRawData(chunk, data);
}
