import * as THREE from 'three'
import { useLoader } from "@react-three/fiber"
import { TextureLoader } from "three"
import { useEffect, useRef } from 'react'

export default function AnimatedSpriteMesh({sprite, columnCount, rowCount, endFrame, fps = 12, ...props}) {
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
        colorMap.wrapS = THREE.RepeatWrapping
        colorMap.wrapt = THREE.RepeatWrapping
        colorMap.repeat.set(1/columnCount,1/rowCount)

        const scaleMultiplier = props.scale ? props.scale : 0.6
        
        plane.current.scale.set(
            scaleMultiplier,
            scaleMultiplier * ratioHeightToWidth,
            scaleMultiplier
        )

        let counterX = 0
        let offsetX = 0
        let counterY = 1
        let offsetY = 0

        const ignoreSpacePercentage = ((rowCount * columnCount) - endFrame) * ((frameSize.x/mapWidth) / 1.0) + (frameSize.x/mapWidth) / 1.0

        const intervalId = window.setInterval(() => {

            // uv offset animation
            const offsetPercentVec2 = new THREE.Vector2
            offsetX = (frameSize.x/mapWidth) * counterX / 1.0
            offsetY = 1.0 - (counterY/rowCount)

            offsetPercentVec2.setX(offsetX)
            offsetPercentVec2.setY(offsetY)
            colorMap.offset = offsetPercentVec2

            counterX++

            // if on last column of any row
            if(offsetX >= 1.0 - frameSize.x/mapWidth) { 
                
                if(counterY <= rowCount) {
                    counterY++
                }

                if(offsetY <= 0) {
                    counterY = 1
                }
                
                counterX = 0
            // if on last row and beyond last frame of grid
            } else if(counterY == rowCount && offsetX >= 1.0 - ignoreSpacePercentage) { 
                counterY = 1
                counterX = 0  
            }


        }, msPerFrame);
    
        return () => {
          window.clearInterval(intervalId);
        };
      }, []);

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