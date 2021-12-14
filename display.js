export default function display_graphically(data) {
  let timeline_div = document.getElementById("timeline");
  timeline_div.innerHTML = "";
  let { schedule } = data;

  let net_timespan =
    schedule[schedule.length - 1].cpu_end_time - schedule[0].cpu_start_time;
  let colors = [
    "red",
    "yellow",
    "blueviolet",
    "orange",
    "indigo",
    "blue",
    "skyblue",
    "grey",
  ];
  let hash_colors = {};
  for (let ele of schedule) {
    if (!hash_colors[ele.process.process_name]) {
      hash_colors[ele.process.process_name] =
        colors[Math.floor(Math.random() * colors.length)];
    }
  }
  schedule.map((fragment, index, sch_copy) => {
    if (
      index > 0 &&
      sch_copy[index - 1].cpu_end_time < sch_copy[index].cpu_start_time
    ) {
      let frag_div = document.createElement("div");
      frag_div.style.backgroundColor = "red";
      frag_div.style.width = `${
        ((sch_copy[index].cpu_start_time - sch_copy[index - 1].cpu_end_time) *
          100) /
        net_timespan
      }%`;
      frag_div.innerHTML = `<p class='text-center' style='margin-top:80px'>${
        sch_copy[index - 1].cpu_end_time
      } - ${sch_copy[index].cpu_start_time}<br>${"!!CPU idle!!"}</p>`;
      timeline_div.appendChild(frag_div);
    }
    let frag_div = document.createElement("div");
    frag_div.style.backgroundColor =
      colors[parseInt(fragment.process.process_name.slice(1))];
    frag_div.style.width = `${
      ((fragment.cpu_end_time - fragment.cpu_start_time) * 100) / net_timespan
    }%`;
    frag_div.innerHTML = `<p class='text-center' style='margin-top:80px'>${fragment.cpu_start_time} - ${fragment.cpu_end_time}<br>${fragment.process.process_name}</p>`;
    timeline_div.appendChild(frag_div);
  });
  document.querySelector(".all-info").style = "";
  document.querySelector(".tt").innerHTML = "Turnaround Times";
  document.querySelector(".rt").innerHTML = "Response Times";
  document.querySelector(".wt").innerHTML = "Waiting Times";
  let tt_cont = document.querySelector(".tt-calc .processwise");
  let rt_cont = document.querySelector(".rt-calc .processwise");
  let wt_cont = document.querySelector(".wt-calc .processwise");
  let rt_str, wt_str;
  let tt_str = (rt_str = wt_str = "<br>");
  console.log(data);
  data.info.map((proc, index, array) => {
    tt_str += `
      ${proc.process_name}
      -
      ${data.turnaround_times[proc.process_name]}
      <br>`;
    wt_str += `
      ${proc.process_name} 
       - 
      ${data.waiting_times[proc.process_name]} 
      <br>`;
    rt_str += `
      ${proc.process_name} 
       - 
      ${data.response_times[proc.process_name]} 
      <br>`;
  });
  tt_str += "<br>";
  rt_str += "<br>";
  rt_str += "<br>";
  tt_cont.innerHTML = tt_str;
  rt_cont.innerHTML = rt_str;
  wt_cont.innerHTML = wt_str;
  let ul_results = document.querySelector(".list-results");
  ul_results.innerHTML =
    `<li><b>Average Turnaround Time - ${
      Math.round(data.avg_turnaround_time * 1000) / 1000
    }</b></li><br>` +
    `<li><b>Average Response Time - ${
      Math.round(data.avg_response_time * 1000) / 1000
    }</b></li><br>` +
    `<li></b>Average Waiting Time - ${
      Math.round(data.avg_waiting_time * 1000) / 1000
    }</b></li>`;
}
