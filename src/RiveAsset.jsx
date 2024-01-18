import * as THREE from 'three'
import { Html } from '@react-three/drei'
import { EventType, useRive } from '@rive-app/react-canvas'
import { useEffect } from 'react';

// Experiment 01/17/2024
// Failure.
// Main issues:
// - occlusion doesn't work - it flickers and doesn't occlude
// - shadows: will not respond to canvas and alpha

export default function RiveAsset({riveAsset}){

    const {rive, RiveComponent } = useRive({
        src: riveAsset,
        artboard: 'Main',
        stateMachines: 'sm',
        autoplay: true
    })

    const onRiveEventReceived = (riveEvent) => {  
            console.log("event", riveEvent);  
        };

    useEffect(()=>{
        if(rive) {
            rive.on(EventType.RiveEvent, onRiveEventReceived)
        }
    },[rive])

    return (
        <Html 
            className='rive-content' 
            transform
            castShadow
            receiveShadow
            material={<meshPhysicalMaterial side={THREE.DoubleSide} opacity={0.5}/>}
        >
            <h1>Hello</h1>
            <div className='rive-wrapper'>
                <RiveComponent />
            </div>
        </Html>
    )
}