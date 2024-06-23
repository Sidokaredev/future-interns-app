import mitt from "mitt";

type Events = {
  onDataUpdated: string
}

const _KMEmitter = mitt<Events>();

const promise = () => new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(alert('logging success'))
  }, 5000)
})

_KMEmitter.on('onDataUpdated', (activity: string) => {
  promise();
})

export default _KMEmitter;
