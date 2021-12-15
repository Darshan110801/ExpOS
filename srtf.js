import PriorityQueue from "./priority_queue.js";
export default function srtf(info) {
  let obj_to_return = {};
  obj_to_return.info = [...info];
  info.sort((a, b) => a.arrival_time - b.arrival_time);
  let burst_times = {};
  for (let process of info) {
    burst_times[process.process_name] = process.burst_time;
  }
  for (var i = 0; i < info.length; i++) {
    let v = info[i].burst_time;

    info[i].remaining_time = v;
  }

  obj_to_return.schedule = [];
  let cur_time = info[0].arrival_time;
  let pq = new PriorityQueue((a, b) => b.remaining_time - a.remaining_time);
  let proc_to_cons = 0;

  let schedule = (sch, process, prev_finish_time, stop_time) => {
    let cpu_start_time = prev_finish_time;
    if (process.arrival_time > prev_finish_time) {
      cpu_start_time = process.arrival_time;
    }
    let obj_to_push = {
      cpu_start_time,
      cpu_end_time: stop_time
        ? stop_time
        : cpu_start_time + process.remaining_time,
    };
    sch.push(obj_to_push);
    if (stop_time) {
      process.remaining_time -= stop_time - cpu_start_time;
    } else {
      process.remaining_time = 0;
    }
    obj_to_push.process = process;
    return obj_to_push.cpu_end_time;
  };

  while (proc_to_cons < info.length) {
    while (
      proc_to_cons < info.length &&
      info[proc_to_cons].arrival_time <= cur_time
    ) {
      pq.push(info[proc_to_cons]);
      proc_to_cons++;
    }
    if (proc_to_cons < info.length) {
      while (
        !pq.isEmpty() &&
        info[proc_to_cons].arrival_time - cur_time >= pq.top().remaining_time
      ) {
        cur_time = schedule(obj_to_return.schedule, pq.pop(), cur_time);
      }
      if (pq.isEmpty()) {
        cur_time = info[proc_to_cons].arrival_time;
      } else if (
        info[proc_to_cons].arrival_time - cur_time <
        pq.top().remaining_time
      ) {
        cur_time = schedule(
          obj_to_return.schedule,
          pq.top(),
          cur_time,
          info[proc_to_cons].arrival_time
        );
      }
    }
  }
  while (!pq.isEmpty()) {
    cur_time = schedule(obj_to_return.schedule, pq.pop(), cur_time);
  }
  obj_to_return.schedule = obj_to_return.schedule.filter(
    (a) => a.cpu_start_time != a.cpu_end_time
  );
  obj_to_return.turnaround_times = {};
  obj_to_return.response_times = {};

  obj_to_return.waiting_times = {};
  for (let i = 0; i < obj_to_return.schedule.length; i++) {
    if (
      obj_to_return.response_times[
        obj_to_return.schedule[i].process.process_name
      ] === undefined
    ) {
      obj_to_return.response_times[
        obj_to_return.schedule[i].process.process_name
      ] =
        obj_to_return.schedule[i].cpu_start_time -
        obj_to_return.schedule[i].process.arrival_time;
    }
  }
  for (let i = obj_to_return.schedule.length - 1; i >= 0; i--) {
    if (
      obj_to_return.turnaround_times[
        obj_to_return.schedule[i].process.process_name
      ] === undefined
    ) {
      obj_to_return.turnaround_times[
        obj_to_return.schedule[i].process.process_name
      ] =
        obj_to_return.schedule[i].cpu_end_time -
        obj_to_return.schedule[i].process.arrival_time;
    }
  }
  for (let process in obj_to_return.turnaround_times) {
    obj_to_return.waiting_times[process] =
      obj_to_return.turnaround_times[process] - burst_times[process];
  }
  obj_to_return.avg_turnaround_time =
    obj_to_return.avg_response_time =
    obj_to_return.avg_waiting_time =
      0;
  for (let process of info) {
    obj_to_return.avg_response_time +=
      obj_to_return.response_times[process.process_name] / info.length;
    obj_to_return.avg_turnaround_time +=
      obj_to_return.turnaround_times[process.process_name] / info.length;
    obj_to_return.avg_waiting_time +=
      obj_to_return.waiting_times[process.process_name] / info.length;
  }
  return obj_to_return;
}
