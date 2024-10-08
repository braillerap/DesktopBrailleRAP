// src/workers/myWorker.worker.js
export default () => {
    self.addEventListener('message', (event) => { /* eslint-disable-line no-restricted-globals */
      const data = event.data;
      const result = performIntensiveTask(data);
      const ret = {type: 'result', data: result};
      self.postMessage(ret); /* eslint-disable-line no-restricted-globals */
    });
  
    function performIntensiveTask(data) {
      
        for (let i = 0; i < 100; i++)
        {
            let c = 0;
            for (let j = 0; j < 100000000; j++)
            {
                c = j + i;
            }    
            const ret = {type: 'pending', data: c};
            self.postMessage(ret); /* eslint-disable-line no-restricted-globals */
        }

    }
  };