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

export class Float64ArrayBuilder {
  length = 0;
  data: Float64Array;

  constructor (initialCapacity: number = 16) {
    this.data = new Float64Array(initialCapacity);
  }

  resize(newLength: number) {
    let {data} = this;
    if (newLength > data.length) {
      let newData = new Float64Array(Math.max(newLength, data.length * 2));
      newData.set(data.subarray(0, this.length));
      this.data = newData;
    }
    this.length = newLength;
  }

  get view () {
    let {data} = this;
    return new Float64Array(data.buffer, data.byteOffset, this.length);
  }

  shrinkToFit () {
    this.data = new Float64Array(this.view);
  }

  clear () {
    this.length = 0;
  }

  appendArray (other: ArrayLike<number>) {
    let {length} = this;
    this.resize(length + other.length);
    this.data.set(other, length);
  }
};
