export default class WorkerFactory {
    constructor(workerFunction) {
      const workerCode = workerFunction.toString();
      
      const workerBlob = new Blob([`(${workerCode})()`]);
      let ret = new Worker(URL.createObjectURL(workerBlob));
      
      return ret;
    }
  }