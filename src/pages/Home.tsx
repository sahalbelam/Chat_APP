import CreateRoom from '@/components/CreateRoom'
import JoinRoom from '@/components/JoinRoom'

const Home = () => {
  return (
    <div className='h-screen flex justify-center items-center'>
        <CreateRoom />
        <JoinRoom />
    </div>
  )
}

export default Home
