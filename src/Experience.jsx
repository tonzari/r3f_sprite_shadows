import { useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useRef } from 'react'
import './App.css'
import AnimatedSpriteMesh from './AnimatedSpriteMesh'

export default function Experience(){

    const pointLight = useRef()
    let elapsedTime = 0

    useFrame((state) => {
        elapsedTime = state.clock.getElapsedTime()
        pointLight.current.position.x = Math.sin(elapsedTime * 0.2) * 8
    })

    return(
        <>
            <OrbitControls />

            <directionalLight 
                castShadow
                intensity={0.3}
                position={[3,3,3]}
                shadow-mapSize={2048}
                shadow-bias={-.01}
            />

            <pointLight
                ref={pointLight}
                castShadow
                color={"white"}
                intensity={50}
                position={[-5,4,5]}
                shadow-mapSize={2048}
                shadow-camera-near={ 1 }
                shadow-camera-far={ 30 }
            />

            <AnimatedSpriteMesh
                sprite={'/squidward.png'}
                fps={12}
                columnCount={8}
                rowCount={3}
                startFrame={5}
                endFrame={12}
                loop={false}
                position={[0.5,0.7,0]}
                scale={0.6}
                onClick={()=>{console.log("squidward!")}}
            />

            <AnimatedSpriteMesh
                sprite={'/bmo.png'}
                fps={24}
                columnCount={14}
                rowCount={1}
                endFrame={14}
                position={[-0.3,0.9,0.4]}
                scale={0.6}
            />

            <mesh
                castShadow
                receiveShadow
                scale={5}
                rotation={[-Math.PI/2,0,0]}
            >
                <planeGeometry />
                <meshStandardMaterial />
            </mesh>

            <mesh
                castShadow
                receiveShadow
                position={[0,0,0.4]}
                scale={[2,1.2,0.3]}
            >
                <boxGeometry />
                <meshStandardMaterial color={"grey"}/>
            </mesh>

            <mesh
                castShadow
                receiveShadow
                position={[0,0,-.5]}
                scale={[5,5,0.4]}
            >
                <boxGeometry />
                <meshStandardMaterial color={"white"}/>
            </mesh>
        </>
    )
}