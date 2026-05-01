
/*
import { useState } from "react";

const users1 = [{
  name: 'Jinu George',
  imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
  imageSize: 90,
},
{
  name: 'Jinu Joy',
  imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
  imageSize: 100,
}
];

function Image({user, count, onClick}) {
  console.log("user", user.name)
  
  return (
    <>
      <h1>{user.name}</h1>
      <img
        className="avatar"
        src={user.imageUrl}
        alt={'Photo of ' + user.name}
        style={{
          width: user.imageSize,
          height: user.imageSize
        }} 
        onClick={onClick}/>
        <h4>And u touched me {count} times</h4>
    </>
  )
}

export default function Profile() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }
 return (
  users1.map(user => {
    return (<><Image user={user} count={count} onClick={handleClick}/></>)
  })
 )
}
  */ 
// Counters that update together with Multiple data in an array -----------------------------------------------------------------------------------------------------------------


import { useState } from "react";

const products = [
  { title: 'Cabbage', isFruit: false, id: 1 },
  { title: 'Garlic', isFruit: false, id: 2 },
  { title: 'Apple', isFruit: true, id: 3 },
];

function Lists(){
  return (
    products.map(product => {
     return <li key={product.id} style={{color : product.id % 2 ? "Red" : "Green"}}> {product.title} </li>
    })
  )
}

function Greeting() {
  return <h5>This is Jinu Joy starting with react project</h5>
}

const users = [{
  name: 'Jinu George',
  imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
  imageSize: 90,
},
{
  name: 'Jinu Joy',
  imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
  imageSize: 100,
}
];

function Image({user}) {
  console.log("user", user.name)
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }
   return (
    <>
      <h1>{user.name}</h1>
      <img
        className="avatar"
        src={user.imageUrl}
        alt={'Photo of ' + user.name}
        style={{
          width: user.imageSize,
          height: user.imageSize
        }} 
        onClick={handleClick}/>
        <h4>And u touched me {count} times</h4>
    </>
  )
}

export default function Profile() {
 return (
  users.map(user => {
    return (<><Image user={user}/></>)
  })
 )
  // Conditional rendering
  return (
  <div>
     {users ? (<Image />) : (<Greeting />)}
    <ul><Lists /></ul>
  </div>
  )
}