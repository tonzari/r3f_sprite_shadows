import * as THREE from 'three'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useRef } from 'react'
import './App.css'
import Squidward from './Squidward'

export default function Experience(){

    const pointLight = useRef()
    const colorMap = useLoader(TextureLoader, '/drsimi.png')
    const normalMap = useLoader(TextureLoader, '/drsimi_normal.png')

    useFrame((state) => {
        const elapsedTime = state.clock.getElapsedTime()
        pointLight.current.position.x = Math.sin(elapsedTime * 0.2) * 8

        // expirementing with uv offset animation
        // const vec2 = new THREE.Vector2
        // vec2.setY(Math.sin(elapsedTime))
        // colorMap.offset = vec2
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

            {/* Dr. Simi */}
            <mesh
                castShadow
                position={[0,0.7,0]}
                >
                <planeGeometry />
                <meshStandardMaterial
                    map={colorMap}
                    normalMap={normalMap}
                    side={THREE.DoubleSide}
                    alphaTest={0.5}
                />
            </mesh>

            <Squidward path={'/squidward.png'} columnCount={8} rowCount={3} frameCount={18} position={[1,0.7,0]}/>

            <Squidward path={'/bmo.png'} columnCount={14} rowCount={1} frameCount={14} position={[-0.6,0.9,0.4]}/>

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