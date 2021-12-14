import PriorityQueue from "./priority_queue.js";

export default function sjf(info) {
  let obj_to_return = {};
  obj_to_return.info = [...info];
  info.sort((a, b) => a.arrival_time - b.arrival_time);
  let schedule = (sch, process, prev_finish_time) => {
    let cpu_start_time = prev_finish_time;
    if (process.arrival_time > prev_finish_time) {
      cpu_start_time = process.arrival_time;
    }
    let obj_to_push = {
      process,
      cpu_start_time,
      cpu_end_time: cpu_start_time + process.burst_time,
      turnaround_time:
        cpu_start_time + process.burst_time - process.arrival_time,
      response_time: cpu_start_time - process.arrival_time,
      waiting_time:
        cpu_start_time +
        process.burst_time -
        process.arrival_time -
        process.burst_time,
    };
    sch.push(obj_to_push);
    return obj_to_push.cpu_end_time;
  };
  obj_to_return.schedule = [];
  let pq = new PriorityQueue((p1, p2) => p2.burst_time - p1.burst_time);
  let prev_finish_time = info[0].arrival_time;
  let cur_to_consider = 0;
  while (cur_to_consider < info.length) {
    while (
      cur_to_consider < info.length &&
      info[cur_to_consider].arrival_time <= prev_finish_time
    ) {
      pq.push(info[cur_to_consider]);
      cur_to_consider++;
    }
    if (cur_to_consider < info.length && !pq.isEmpty()) {
      prev_finish_time = schedule(
        obj_to_return.schedule,
        pq.pop(),
        prev_finish_time
      );
    } else if (cur_to_consider < info.length && pq.isEmpty()) {
      prev_finish_time = info[cur_to_consider].arrival_time;
    }
  }
  while (!pq.isEmpty()) {
    prev_finish_time = schedule(
      obj_to_return.schedule,
      pq.pop(),
      prev_finish_time
    );
  }
  obj_to_return.turnaround_times = {};
  obj_to_return.response_times = {};
  obj_to_return.waiting_times = {};
  for (let sch of obj_to_return.schedule) {
    obj_to_return.turnaround_times[sch.process.process_name] =
      sch.turnaround_time;
    obj_to_return.response_times[sch.process.process_name] = sch.response_time;
    obj_to_return.waiting_times[sch.process.process_name] = sch.waiting_time;
  }
  obj_to_return.avg_turnaround_time = obj_to_return.schedule.reduce(
    (acc, cur, index, arr) => acc + cur.turnaround_time / arr.length,
    0
  );
  obj_to_return.avg_response_time = obj_to_return.schedule.reduce(
    (acc, cur, index, arr) => {
      return acc + cur.response_time / arr.length;
    },
    0
  );
  obj_to_return.avg_waiting_time = obj_to_return.schedule.reduce(
    (acc, cur, index, arr) => {
      return acc + cur.waiting_time / arr.length;
    },
    0
  );
  return obj_to_return;
}
