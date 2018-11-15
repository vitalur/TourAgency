

const getPost = () => {
  return fetch(`https://jsonplaceholder.typicode.com/pots`)
    .then(res => res.json())
    .then(req => console.log(req))
}

fetch('/todo/meterla',{
  method: 'POST',
  body: JSON.stringify( {task: self.refs.task.value} ),
  headers: {"Content-Type": "application/json"}
})
  .then(function(response){
    return response.json()
  }).then(function(body){
  console.log(body);
  alert(self.refs.task.value)
});


fetch('/todo/meterla',{
  method: 'POST',
  body:{
    task: self.refs.task.value
  }
})
  .then(function(response){
    return response.json()
  }).then(function(body){
  console.log(body);
  alert(self.refs.task.value)
});