import * as THREE from 'three'
import { useFrame, useLoader } from "@react-three/fiber"
import { TextureLoader } from "three"
import { useEffect, useRef } from 'react'

export default function AnimatedSpriteMesh({sprite, columnCount, rowCount, startFrame = 1, endFrame, fps = 12, loop = true, playOnLoad = true, clickToPlay = false, lookAtCam = false, alphaTest = 0.5, ...props}) {
    
    // VARIABLES - - - - - - - - - - - - - - - - - - - - 
    
    const texture = useLoader(TextureLoader, sprite)
    const plane = useRef()

    const msPerFrame = 1000 / fps

    const textureHeight = texture.source.data.height
    const textureWidth = texture.source.data.width

    const frameSize = {
        x: textureWidth / columnCount, 
        y: textureHeight / rowCount
    }

    const ratioHeightToWidth = frameSize.y/frameSize.x

    let isPlaying = playOnLoad
    let currentFrame = startFrame
    let nextFrameTime = 0
    
    // FUNCTIONS - - - - - - - - - - - - - - - - - - - - 

    function play() {
        isPlaying = true
        currentFrame = startFrame
    }

    function handleClick(e) {
        if(clickToPlay && !isPlaying) { play() }
        if(props.onClick) { props.onClick(e) }
    }

    function UpdateFrame() {       
        texture.offset = getSpriteOffsetVec2(currentFrame, rowCount, columnCount)
        
        if (currentFrame < endFrame) {
            currentFrame++
            return
        }
    
        if (loop) {
            currentFrame = startFrame
            return
        }
        
        isPlaying = false
    }

    // HOOKS - - - - - - - - - - - - - - - - - - - - - - 

    // init
    useEffect(() => {
        // enable wrapping, crop, set first frame
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapt = THREE.RepeatWrapping
        texture.repeat.set(1/columnCount,1/rowCount)
        texture.offset = getSpriteOffsetVec2(startFrame, rowCount, columnCount)

        // If parent passed a scale, use it
        const scaleMultiplier = props.scale ? props.scale : 1
        
        plane.current.scale.set(
            scaleMultiplier,
            scaleMultiplier * ratioHeightToWidth,
            scaleMultiplier
        )
    }, []);
        
    useFrame((state) => {
        if(lookAtCam) {
            plane.current.lookAt(state.camera.position)
        }

        if(!isPlaying) return 

        if(window.performance.now() >= nextFrameTime) {
            UpdateFrame()
            nextFrameTime = window.performance.now() + msPerFrame
        }
    })

    return (
      <>
        <mesh 
            ref={plane} 
            castShadow 
            {...props} 
            onClick={handleClick}
        >
            <planeGeometry />
            <meshStandardMaterial
                map={texture}
                side={THREE.DoubleSide}
                alphaTest={alphaTest}
            />
        </mesh>
      </>
    );
}



function getSpriteOffsetVec2(frameNumber, rows, columns) {
    let result = new THREE.Vector2

    // Convert framePosition to zero-index
    const index = frameNumber - 1

    // Calculate row and column (0-indexed)
    const row = Math.floor(index / columns)
    const column = index % columns

    // Calculate the size of each tile in percentages
    const tileSizeWidth = 1 / columns
    const tileSizeHeight = 1 / rows

    // Calculate coordinates
    // For x, it's straightforward as the origin is at the bottom left
    const x = column * tileSizeWidth

    // For y, we need to invert the row as the origin is at the bottom
    const y = (rows - 1 - row) * tileSizeHeight

    result.setX(x)
    result.setY(y)

    return result
}