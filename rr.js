export default function rr(data) {
  let obj_to_return = {};
  let info = data.info;
  let burst_times = {};
  let time_quanta = data.time_quanta;
  for (let process of info) {
    burst_times[process.process_name] = process.burst_time;
  }
  info.map((process, index, info_copy) => {
    process.remaining_time = process.burst_time;
  });
  obj_to_return.info = [...info];
  info.sort((a, b) => a.arrival_time - b.arrival_time);
  obj_to_return.schedule = [];
  let cur_time = info[0].arrival_time;
  let q = [];
  let proc_to_cons = 0;

  let schedule = (sch, process, prev_finish_time, time_quanta) => {
    let cpu_start_time = prev_finish_time;
    let to_be_deleted = false;
    if (process.arrival_time > prev_finish_time) {
      cpu_start_time = process.arrival_time;
    }
    let cpu_end_time =
      process.remaining_time >= time_quanta
        ? cpu_start_time + time_quanta
        : cpu_start_time + process.remaining_time;
    if (process.remaining_time <= time_quanta) {
      to_be_deleted = true;
    }
    let obj_to_push = {
      cpu_start_time,
      cpu_end_time,
    };
    process.remaining_time -= cpu_end_time - cpu_start_time;
    obj_to_push.process = process;
    sch.push(obj_to_push);

    return { cpu_end_time: obj_to_push.cpu_end_time, to_be_deleted };
  };

  while (proc_to_cons < info.length) {
    while (
      proc_to_cons < info.length &&
      info[proc_to_cons].arrival_time <= cur_time
    ) {
      q.push(info[proc_to_cons]);
      proc_to_cons++;
    }
    if (proc_to_cons < info.length) {
      while (
        q.length !== 0 &&
        proc_to_cons < info.length &&
        cur_time < info[proc_to_cons].arrival_time
      ) {
        let obj_returned = schedule(
          obj_to_return.schedule,
          q[0],
          cur_time,
          time_quanta
        );
        cur_time = obj_returned.cpu_end_time;
        while (
          proc_to_cons < info.length &&
          info[proc_to_cons].arrival_time <= cur_time
        ) {
          q.push(info[proc_to_cons]);
          proc_to_cons++;
        }
        if (!obj_returned.to_be_deleted) q.push(q.shift());
        else q.shift();
      }
      if (q.length === 0) {
        cur_time = info[proc_to_cons].arrival_time;
      }
    }
  }
  while (q.length != 0) {
    let obj_returned = schedule(
      obj_to_return.schedule,
      q[0],
      cur_time,
      time_quanta
    );
    cur_time = obj_returned.cpu_end_time;
    if (!obj_returned.to_be_deleted) q.push(q.shift());
    else q.shift();
  }
  console.log(obj_to_return.schedule);
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
