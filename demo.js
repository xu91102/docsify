const visits = ["first", "second", "first"];
const versions = ["before", "after"];
const frames = versions.map((id) => document.getElementById(id));
const results = document.getElementById("results");
const status = document.getElementById("status");
const run = document.getElementById("run");
let sequence = 0;

async function renderedCode(frame, visit) {
  const deadline = Date.now() + 10000;
  while (Date.now() < deadline) {
    const document = frame.contentDocument;
    const code = document?.querySelector("#main pre code");
    if (code && document.documentElement.dataset.renderedRoute === "/" + visit + "/") {
      return code.textContent.trim();
    }
    await new Promise((resolve) => setTimeout(resolve, 40));
  }
  throw new Error("Docsify did not finish rendering /" + visit + "/");
}

function append(visit, expected, values) {
  const row = results.insertRow();
  for (const value of ["/" + visit + "/", expected, ...values]) {
    const cell = row.insertCell();
    cell.textContent = value;
    if (cell.cellIndex > 1) cell.dataset.correct = String(value === expected);
  }
}

run.addEventListener("click", async () => {
  run.disabled = true;
  results.replaceChildren();
  delete status.dataset.result;
  status.textContent = "Running the navigation in both Docsify instances…";
  sequence += 1;
  try {
    const all = [];
    frames.forEach((frame, i) => {
      frame.src = versions[i] + ".html?run=" + sequence + "#/first/";
    });
    for (const [index, visit] of visits.entries()) {
      if (index > 0) frames.forEach((frame) => {
        frame.contentWindow.location.hash = "#/" + visit + "/";
      });
      const values = await Promise.all(frames.map((frame) => renderedCode(frame, visit)));
      const expected = 'const example = "' + visit + '";';
      append(visit, expected, values);
      all.push(values);
    }
    const expected = visits.map((visit) => 'const example = "' + visit + '";');
    const stale = all[1][0] === expected[0] && all[0][0] === expected[0] && all[2][0] === expected[2];
    const fixed = all.every((value, i) => value[1] === expected[i]);
    status.dataset.result = stale && fixed ? "reproduced" : "unexpected";
    status.textContent = stale && fixed
      ? "Reproduced. Develop shows the first snippet on /second/. The PR shows the expected snippet on every visit."
      : "The observed output differs from the expected before/after result.";
  } catch (error) {
    status.dataset.result = "error";
    status.textContent = error.message;
  } finally {
    run.disabled = false;
  }
});
