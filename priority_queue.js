export default class PriorityQueue {
  constructor(comparator) {
    this.heap = [];
    this.len = 0;
    this.comparator = comparator;
  }

  push(ele) {
    if (this.len == 0) {
      this.heap.push(ele);
      this.len += 1;
    } else {
      this.heap.push(ele);
      let cur_index = this.len;
      this.len++;
      let stop = false;
      while (cur_index > 0 && !stop) {
        let par_index = Math.floor((cur_index - 1) / 2);
        if (this.comparator(this.heap[cur_index], this.heap[par_index]) > 0) {
          let temp = this.heap[cur_index];
          this.heap[cur_index] = this.heap[par_index];
          this.heap[par_index] = temp;
          cur_index = par_index;
        } else {
          stop = true;
        }
      }
    }
  }
  isEmpty() {
    return this.len === 0;
  }
  top() {
    return this.heap[0];
  }
  size() {
    return this.len;
  }
  pop() {
    let ele_popped = this.heap[0];
    this.heap.shift();
    this.len--;
    if (this.len === 0) {
      return ele_popped;
    } else {
      this.heap.unshift(this.heap.pop());
      let cur_index = 0;
      let stop = false;
      while (cur_index < this.len && !stop) {
        let child_ind1 = 2 * cur_index + 1;
        let child_ind2 = 2 * cur_index + 2;

        let max_ind = cur_index;
        if (
          child_ind1 < this.len &&
          this.comparator(this.heap[child_ind1], this.heap[max_ind]) > 0
        ) {
          max_ind = child_ind1;
        }
        if (
          child_ind2 < this.len &&
          this.comparator(this.heap[child_ind2], this.heap[max_ind]) > 0
        ) {
          max_ind = child_ind2;
        }
        if (max_ind === cur_index) {
          stop = true;
        } else {
          let temp = this.heap[max_ind];
          this.heap[max_ind] = this.heap[cur_index];
          this.heap[cur_index] = temp;
          cur_index = max_ind;
        }
      }
    }
    return ele_popped;
  }
}
