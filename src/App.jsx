import { Canvas } from '@react-three/fiber'
import './App.css'
import Experience from './Experience'

function App() {

  return <>
    <Canvas
      camera={{near:0.5, far:10}}
      shadows
      gl={{ preserveDrawingBuffer: true }}
      eventSource={document.getElementById('root')}
      eventPrefix="client"
    >
      <Experience />
    </Canvas>
  </>
}

export default App
