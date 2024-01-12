import * as THREE from 'three'
import { useFrame, useLoader } from "@react-three/fiber"
import { TextureLoader } from "three"
import { useEffect, useRef } from 'react'

export default function AnimatedSpriteMesh({sprite, columnCount, rowCount, startFrame = 1, endFrame, fps = 12, loop = true, lookAtCam = false, ...props}) {
    
    const colorMap = useLoader(TextureLoader, sprite)
    const plane = useRef()

    const msPerFrame = 1000 / fps

    const mapHeight = colorMap.source.data.height
    const mapWidth = colorMap.source.data.width

    const frameSize = {
            x: mapWidth / columnCount, 
            y: mapHeight / rowCount
        }

    const ratioHeightToWidth = frameSize.y/frameSize.x

    useEffect(() => {
        // crop and allow looping/wrapping
        colorMap.wrapS = THREE.RepeatWrapping
        colorMap.wrapt = THREE.RepeatWrapping
        colorMap.repeat.set(1/columnCount,1/rowCount)

        // If user passed a scale, use it
        const scaleMultiplier = props.scale ? props.scale : 1
        plane.current.scale.set(
            scaleMultiplier,
            scaleMultiplier * ratioHeightToWidth,
            scaleMultiplier
        )

        let spriteTileIndex = startFrame

        const intervalId = window.setInterval(() => {

            colorMap.offset = getSpriteTileCoords(spriteTileIndex, rowCount, columnCount)
            
            if(spriteTileIndex < endFrame) {
                spriteTileIndex++
            } else if(loop) {
                spriteTileIndex = 1
            }

        }, msPerFrame);
        
        // clean up!
        return () => {
          window.clearInterval(intervalId);
        };
      }, []);

      useFrame((state) => {
        if(lookAtCam) {
            plane.current.lookAt(state.camera.position)
        }
      })

    return <>
            <mesh
                ref={plane}
                castShadow
                {...props}
            >
                <planeGeometry />
                <meshStandardMaterial
                    map={colorMap}
                    side={THREE.DoubleSide}
                    alphaTest={0.5}
                />
            </mesh>
    </>
}

function getSpriteTileCoords(frameNumber, rows, columns) {
    let result = new THREE.Vector2

    // Convert framePosition to zero-index
    const index = frameNumber - 1;

    // Calculate row and column (0-indexed)
    const row = Math.floor(index / columns);
    const column = index % columns;

    // Calculate the size of each tile in percentages
    const tileSizeWidth = 1 / columns;
    const tileSizeHeight = 1 / rows;

    // Calculate coordinates
    // For x, it's straightforward as the origin is at the bottom left
    const x = column * tileSizeWidth;

    // For y, we need to invert the row as the origin is at the bottom
    const y = (rows - 1 - row) * tileSizeHeight;

    result.setX(x)
    result.setY(y)

    return result
}