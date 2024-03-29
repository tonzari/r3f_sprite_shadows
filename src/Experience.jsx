import { useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense, useRef } from 'react'
import { Perf } from 'r3f-perf'
import AnimatedSpriteMesh from './AnimatedSpriteMesh'

export default function Experience(){

    const pointLight = useRef()
    const pointLight2 = useRef()

    let elapsedTime = 0

    useFrame((state) => {
        elapsedTime = state.clock.getElapsedTime()
        pointLight.current.position.x = Math.sin(elapsedTime * 0.2) * 8
        pointLight2.current.position.x = Math.sin(elapsedTime * 0.1) * 4
        
    })

    return(
        <>
            <Perf position={'bottom-left'} />

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

            <pointLight
                ref={pointLight2}
                castShadow
                color={"white"}
                intensity={50}
                position={[-5,4,-4]}
                shadow-mapSize={2048}
                shadow-camera-near={ 1 }
                shadow-camera-far={ 30 }
            />

            <Suspense>
                <AnimatedSpriteMesh
                    sprite={'/squidward.png'}
                    fps={12}
                    columnCount={8}
                    rowCount={3}
                    startFrame={1}
                    endFrame={18}
                    loop={false}
                    position={[0.5,0.7,0]}
                    scale={0.6}
                    onClick={()=>{console.log("squidward!")}}
                    clickToPlay
                />
            </Suspense>

            <Suspense>
                <AnimatedSpriteMesh
                    sprite={'/bmo.png'}
                    fps={24}
                    columnCount={14}
                    rowCount={1}
                    endFrame={14}
                    position={[-0.3,0.9,0.4]}
                    scale={0.6}
                    clickToPlay
                    playOnLoad={false}
                    loop={false}
                    allowRetrigger
                />
            </Suspense>
            <Suspense>
                <AnimatedSpriteMesh
                    sprite={'/procreateTest.png'}
                    fps={24}
                    columnCount={6}
                    rowCount={10}
                    endFrame={59}
                    position={[2,2,-1]}
                    scale={2}
                    loop={false}
                />
            </Suspense>
            <Suspense>
                <AnimatedSpriteMesh
                    sprite={'/SpriteSheetx0.2/procreateTest.png'}
                    fps={24}
                    columnCount={10}
                    rowCount={6}
                    endFrame={59}
                    position={[0,2,-1]}
                    scale={2}
                    loop={false}
                    playOnLoad={false}
                    clickToPlay
                />
            </Suspense>

            <Suspense>
                <AnimatedSpriteMesh
                    sprite={'/SpriteSheetx0.5/procreateTest.png'}
                    fps={24}
                    columnCount={4}
                    rowCount={15}
                    endFrame={59}
                    position={[-2,2,-1]}
                    scale={2}
                    playOnLoad={false}
                    clickToPlay
                    loop={false}
                />
            </Suspense>
             

            <mesh
                castShadow
                receiveShadow
                scale={8}
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
                position={[0,-1,-.5]}
                scale={[5,5,0.4]}
            >
                <boxGeometry />
                <meshStandardMaterial color={"white"}/>
            </mesh>

            <mesh
                castShadow
                receiveShadow
                position={[0,4.6,-.5]}
                scale={[5,5,0.4]}
            >
                <boxGeometry />
                <meshStandardMaterial color={"white"}/>
            </mesh>
        </>
    )
}