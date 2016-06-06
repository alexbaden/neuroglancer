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

import {Disposable} from 'neuroglancer/util/disposable';
import {AttributeIndex} from 'neuroglancer/webgl/shader';

export type BufferType = number;
export type WebGLDataType = number;
export type WebGLBufferUsage = number;
export class Buffer implements Disposable {
  buffer: WebGLBuffer;
  constructor(public gl: WebGLRenderingContext, public bufferType?: BufferType) {
    this.gl = gl;
    this.buffer = gl.createBuffer();
    if (this.bufferType === undefined) {
      this.bufferType = gl.ARRAY_BUFFER;
    }
  }

  bind() { this.gl.bindBuffer(this.bufferType, this.buffer); }

  bindToVertexAttrib(
      location: AttributeIndex, componentsPerVertexAttribute: number,
      attributeType: WebGLDataType = this.gl.FLOAT, normalized = false, stride = 0, offset = 0) {
    this.bind();
    this.gl.enableVertexAttribArray(location);
    this.gl.vertexAttribPointer(
        location, componentsPerVertexAttribute, attributeType, normalized, stride, offset);
  }

  setData(data: ArrayBufferView, usage?: WebGLBufferUsage) {
    let gl = this.gl;
    if (usage === undefined) {
      usage = gl.STATIC_DRAW;
    }
    this.bind();
    gl.bufferData(this.bufferType, data, usage);
  }

  dispose() {
    this.gl.deleteBuffer(this.buffer);
    this.buffer = null;
    this.gl = null;
  }

  static fromData(
      gl: WebGLRenderingContext, data: ArrayBufferView, bufferType?: BufferType,
      usage?: WebGLBufferUsage) {
    let buffer = new Buffer(gl, bufferType);
    buffer.setData(data, usage);
    return buffer;
  }
};
