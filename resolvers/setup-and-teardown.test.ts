// import { ChildProcess } from "child_process";
// import child_process from "child_process";
// import path from "path";

// let kubectlProcess: any;

// before("Setup testing environment...", async () => {
//   kubectlProcess = child_process.exec(
//     "kubectl port-forward service/postgres-test-service 5432:5432", { shell: "/bin/bash" } 
//   );
// });

// after("Terminating testing environment...", async () => {
//   kubectlProcess.kill(0);
//   console.log("TERMINATED");
// });
