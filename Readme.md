## 🟢 automation-sample — Automated Task Runner

### 📘 Description

A small Node.js project that demonstrates how to create scheduled background tasks. It fetches sample data, cleans it, and logs results at fixed intervals using `node-cron`.

### 🚀 Features

- Runs tasks automatically on schedule
- Fetches and processes JSON data
- Includes error handling and console output

### ⚙️ Tech Stack

Node.js, Axios, Node-cron

### ▶️ Run Locally

```bash
git clone https://github.com/<yourusername>/automation-sample.git
cd automation-sample
npm install
node index.js
```

### 📂 Project Structure

```
automation-sample/
├─ index.js
├─ package.json
└─ logs/
```

### 🖥️ Terminal Demo

```
$ node index.js
2025-11-22T03:37:21.253Z [init] schedule="*/5 * * * *"
2025-11-22T03:37:21.262Z [run] start
+------+--------------------------------------------+---------+
|   ID | Title                                      |   Words |
+------+--------------------------------------------+---------+
|    1 | sunt aut facere repellat provident occaeca |      23 |
|    2 | qui est esse                               |      31 |
|    3 | ea molestias quasi exercitationem repellat |      26 |
|    4 | eum et est occaecati                       |      28 |
|    5 | nesciunt quas odio                         |      23 |
+------+--------------------------------------------+---------+
2025-11-22T03:37:21.941Z [ok] items=100 avgWords=24 top=["sunt aut facere repellat provident occaecati excepturi optio reprehenderit","qui est esse","ea molestias quasi exercitationem repellat qui ipsa sit aut"]
```

Tip: set a custom schedule with `CRON_SCHEDULE`, e.g. `CRON_SCHEDULE="* * * * *" node index.js`.
