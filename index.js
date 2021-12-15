import fifo from "./fifo.js";
import display_graphically from "./display.js";
import sjf from "./sjf.js";
import srtf from "./srtf.js";
console.log("Hello World");
let html_entries = document.querySelector(".entries");
let js_entries = [];
let cur_id = 0;
let cur_theme = "dark";

const policies = ["FIFO", "SJF", "SRTF", "RR", "MLFQ", "Priority Based"];

let policy = "FIFO";

let policy_selectors = [...document.querySelectorAll(".policy-selector")];
let tq_input_tag = document.querySelector(".time-quanta-ip");
tq_input_tag.style.display = "none";

tq_input_tag
  .querySelector("input")
  .addEventListener("change", (e) =>
    e.currentTarget.value < 1
      ? (e.currentTarget.value = 1)
      : (e.currentTarget.value = e.currentTarget.value)
  );
let theme_selectors = {
  playground: {
    dark: "playground",
    "info-dark": "info-playground",
    "dark-primary": "playground-primary",
    "body-dark": "body-playground",
    "time-title-dark": "time-title-playground",
    "border-dark": "border-playground",
    "processwise-dark": "processwise-playground",
    "net-results-dark": "net-results-playground",
    "tq-dark": "tq-playground",
  },
  dark: {
    playground: "dark",
    "info-playground": "info-dark",
    "playground-primary": "dark-primary",
    "body-playground": "body-dark",
    "time-title-playground": "time-title-dark",
    "border-playground": "border-dark",
    "processwise-playground": "processwise-dark",
    "net-results-playground": "net-results-dark",
    "tq-playground": "tq-dark",
  },
};
document.querySelector(".all-info").style = "display:none;";
function apply_to_tag(tag, specifications) {
  for (let specification_name in specifications) {
    tag[specification_name] = specifications[specification_name];
  }
  return tag;
}
function addClasses(tag, list) {
  tag.classList = list;
  return tag;
}
function createDataRow(cur_id) {
  let div = document.createElement("div");
  div = addClasses(div, ["data-row"]);
  div.id = "R" + cur_id;
  div.innerHTML = `<div class='process'><h5  class='ip text-center'>${
    "P" + cur_id
  }</h5></div>
      <div class='arrival-time'><input type='number' class='ip' allign ='center' placeholder='Arrival time in sec.'></div>
      <div class='burst-time'><input type='number' class='ip' allign ='center' placeholder='Burst time in sec.'></div>`;

  [...div.querySelectorAll(".arrival-time .ip,.burst-time .ip")].map((ele) => {
    ele.addEventListener("change", () => {
      if (ele.value < 0) {
        ele.value = 0;
      }
      ele.value = parseInt(ele.value);
    });
  });

  return div;
}
function toggle_theme(name) {
  if (name == cur_theme) return;
  let theme_eles = [...document.querySelectorAll(".theme-sel")];

  if (cur_theme == "dark") {
    cur_theme = "playground";
    for (let i = 0; i < theme_eles.length; i++) {
      let classes = [...theme_eles[i].classList];
      for (let j = 0; j < classes.length; j++) {
        if (Object.keys(theme_selectors.playground).includes(classes[j])) {
          classes[j] = theme_selectors.playground[classes[j]];
        }
      }
      theme_eles[i].classList = classes.join(" ");
    }
  } else if (cur_theme == "playground") {
    cur_theme = "dark";
    for (let i = 0; i < theme_eles.length; i++) {
      let classes = [...theme_eles[i].classList];
      for (let j = 0; j < classes.length; j++) {
        if (Object.keys(theme_selectors.dark).includes(classes[j])) {
          classes[j] = theme_selectors.dark[classes[j]];
          break;
        }
      }
      theme_eles[i].classList = classes.join(" ");
    }
  }
}
[...document.querySelectorAll(".theme")].map((theme_button, index) => {
  theme_button.addEventListener("click", (e) => {
    toggle_theme(e.currentTarget.innerHTML.toLowerCase());
  });
});
for (let i = 0; i < 3; i++) {
  cur_id++;
  html_entries.appendChild(createDataRow(cur_id));
}
console.log(policy_selectors);
policy_selectors.map((selector, index) => {
  selector.addEventListener("click", () => {
    policy = policies[index];
    policies[index] == "RR"
      ? (tq_input_tag.style.display = "")
      : (tq_input_tag.style.display = "none");

    document.getElementById("policy").innerHTML =
      "Scheduling Policy - " + policies[index];
  });
});

document.getElementById("add-row").addEventListener("click", () => {
  cur_id++;
  html_entries.appendChild(createDataRow(cur_id));
});

document.getElementById("remove-row").addEventListener("click", () => {
  if (cur_id == 0) return;
  html_entries.removeChild(html_entries.querySelector("#R" + cur_id--));
});

console.log(document.querySelector(".arrival-time .ip").value.length);

let info = [];
document.querySelector(".submit-button").addEventListener("click", () => {
  let data_rows = [...document.querySelectorAll(".data-row")];
  info = [];
  let allOK = true;
  document.querySelector(".message").innerHTML = "";
  let input_checker = (data_row) => {
    let process_name = data_row.querySelector(".process .ip").innerHTML;
    let arrival_time = parseInt(
      data_row.querySelector(".arrival-time .ip").value
    );
    let burst_time = parseInt(data_row.querySelector(".burst-time .ip").value);
    if (!process_name) process_name = "p" + (index + 1);
    if (!arrival_time) {
      arrival_time = 0;
      data_row.querySelector(".arrival-time .ip").value = 0;
    }
    if (!burst_time) {
      burst_time = 0;
      data_row.querySelector(".burst-time .ip").value = 0;
      document.querySelector(".message").innerHTML = "**Burst time can't be 0.";
      if (allOK) alert("Burst time can't be 0 for a process");
      allOK = false;
      return;
    }
    info.push({
      process_name,
      arrival_time,
      burst_time,
    });
  };

  for (let data_row of data_rows) {
    input_checker(data_row);
  }
  if (allOK) {
    switch (policy) {
      case "FIFO":
        console.log(policy);
        let fifofied_data = fifo(info);
        console.log(fifofied_data);
        display_graphically(fifofied_data);
        break;
      case "SJF":
        console.log(policy);
        let sjffied_data = sjf(info);
        console.log(sjffied_data);
        display_graphically(sjffied_data);
        console.log(info);
        break;
      case "SRTF":
        console.log(policy);
        console.log(info);
        let srtffied_data = srtf(info);
        console.log(srtffied_data);
        display_graphically(srtffied_data);
        break;
      case "RR":
        console.log(policy);
        let obj_to_pass = {
          info: [...info],
          time_quanta:
            tq_input_tag.querySelector("input").value == ""
              ? 5
              : parseInt(tq_input_tag.querySelector("input").value),
        };
        console.log(obj_to_pass);
        break;
      case "MLFQ":
        console.log(policy);
        console.log(info);
        break;
      case "Priority Based":
        console.log(policy);
        console.log(info);
        break;
    }
  }
});
