const node_path = require('child_process').execSync('npm root -g').toString().trim();
const PETH = require(node_path+"/kha_plugins_engine_task_handler");

const run = async () => {

  const cwd = process.cwd();
  const taskData = await PETH.getTaskData();
  // Example of getting data from an API, Check https://github.com/kha-cloud/plugins_engine_task_handler for documentation
  // const testContent = await PETH.utils.$dataCaller("get", "@PA/testzz");

  const sleep = (ms) => { return new Promise(resolve => setTimeout(resolve, ms)); };
  
  sleep(7000);
  
  await PETH.setTaskResult({
    cwd,
    taskData,
    // testContent,
  });
}

run();