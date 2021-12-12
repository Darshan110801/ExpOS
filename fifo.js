export default function fifo(info) {
  let obj_to_return = {};
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
    };
    sch.push(obj_to_push);
    return obj_to_push.cpu_end_time;
  };
  obj_to_return.schedule = [];
  let prev_finish_time = info[0].arrival_time;
  for (let process of info) {
    prev_finish_time = schedule(
      obj_to_return.schedule,
      process,
      prev_finish_time
    );
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
  return obj_to_return;
}
