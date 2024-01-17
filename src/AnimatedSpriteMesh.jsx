import * as THREE from 'three'
import { useFrame, useLoader } from "@react-three/fiber"
import { TextureLoader } from "three"
import { useEffect, useRef, useState } from 'react'

export default function AnimatedSpriteMesh({sprite, columnCount, rowCount, startFrame = 1, endFrame, fps = 12, loop = true, playOnLoad = true, clickToPlay = false, lookAtCam = false, ...props}) {
    
    const texture = useLoader(TextureLoader, sprite)
    const plane = useRef()

    const msPerFrame = 1000 / fps

    const mapHeight = texture.source.data.height
    const mapWidth = texture.source.data.width

    const frameSize = {
            x: mapWidth / columnCount, 
            y: mapHeight / rowCount
        }

    const ratioHeightToWidth = frameSize.y/frameSize.x

    const [isPlaying, setIsPlaying] = useState(playOnLoad)

    function play() {
        setIsPlaying(true)
    }

    function handleClick(e) {
        if(clickToPlay) { play() }
        if(props.onClick) { props.onClick(e) }
    }

    // init
    useEffect(() => {
        // crop and allow looping/wrapping
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapt = THREE.RepeatWrapping
        texture.repeat.set(1/columnCount,1/rowCount)

        // If parent passed a scale, use it
        const scaleMultiplier = props.scale ? props.scale : 1
        
        plane.current.scale.set(
            scaleMultiplier,
            scaleMultiplier * ratioHeightToWidth,
            scaleMultiplier
        )
      }, []);

      // update on isPlaying state change
      useEffect(() => {
        texture.offset = getSpriteTileCoords(startFrame, rowCount, columnCount)

        let currentFrame = startFrame

        const updateFrame = () => {
            if (!isPlaying) return;
        
            if (currentFrame < endFrame) {
                texture.offset = getSpriteTileCoords(currentFrame, rowCount, columnCount)
                currentFrame++;
                return;
            }
        
            if (loop) {
                currentFrame = startFrame;
                return;
            }
        
            setIsPlaying(false);
        }
        

        const intervalId = window.setInterval(updateFrame, msPerFrame);
        
        return () => {
          window.clearInterval(intervalId); // clean up!
        }
      }, [isPlaying]);

      useFrame((state) => {
        if(lookAtCam) {
            plane.current.lookAt(state.camera.position)
        }
      })

    return (
      <>
        <mesh ref={plane} castShadow {...props} onClick={handleClick}>
        <planeGeometry />
        <meshStandardMaterial
            map={texture}
            side={THREE.DoubleSide}
            alphaTest={0.5}
        />
        </mesh>
      </>
    );
}



function getSpriteTileCoords(frameNumber, rows, columns) {
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