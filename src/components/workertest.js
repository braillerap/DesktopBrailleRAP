// src/workers/myWorker.worker.js
export default () => {
    /*
    self.addEventListener('message', (event) => { 
      const data = event.data;
      
      console.log ("in worker");
      
      const result = performIntensiveTask(data);
      const ret = {type: 'result', data: result};
      
      
      
      self.postMessage(ret); 
    });
    */
   console.log ("worker started");
  
    self.onmessage = (event) => { /* eslint-disable-line no-restricted-globals */
        const data = event.data;
      
      console.log ("in worker");
      
      const result = performIntensiveTask(data);
      const ret = {type: 'result', data: result};
      
      
      
      self.postMessage(ret); /* eslint-disable-line no-restricted-globals */
    }
    function performIntensiveTask(data) {
      
        let i;
        for (i = 0; i < 10000; i++)
        {
            let c = 0;
            for (let j = 0; j < 10000000; j++)
            {
                c = j + i;
            }    
            const ret = {type: 'pending', data: i};
            self.postMessage(ret); /* eslint-disable-line no-restricted-globals */
        }
        return i;
    }
  };