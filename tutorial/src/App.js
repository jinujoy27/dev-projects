
const user = {
  name: 'Jinu George',
  imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
  imageSize: 90,
};


function Greeting(){
  return <h5>This is Jinu Joy starting with react project</h5>
}


export default function Profile() {
  if(user){

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
        }}/>
    </>
  )
} else {
      return <Greeting></Greeting>
  }
}