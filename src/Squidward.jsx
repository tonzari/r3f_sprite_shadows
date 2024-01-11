import * as THREE from 'three'
import { useLoader } from "@react-three/fiber"
import { TextureLoader } from "three"
import { useEffect, useRef } from 'react'

export default function Squidward({path, columnCount, rowCount, frameCount, msPerFrame = 83.3, ...props}) {
    const colorMap = useLoader(TextureLoader, path)
    const plane = useRef()

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

        const scaleMultiplier = 0.6
        
        plane.current.scale.set(
            scaleMultiplier,
            scaleMultiplier * ratioHeightToWidth,
            scaleMultiplier
        )

        let counterX = 0
        let offsetX = 0
        let counterY = 1
        let offsetY = 0

        const ignoreSpacePercentage = ((rowCount * columnCount) - frameCount) * ((frameSize.x/mapWidth) / 1.0) + (frameSize.x/mapWidth) / 1.0
        console.log(ignoreSpacePercentage)
        const intervalId = window.setInterval(() => {

            // uv offset animation
            const offsetPercentVec2 = new THREE.Vector2
            offsetX = (frameSize.x/mapWidth) * counterX / 1.0
            offsetY = 1.0 - (counterY/rowCount)

            offsetPercentVec2.setX(offsetX)
            offsetPercentVec2.setY(offsetY)
            colorMap.offset = offsetPercentVec2

            console.log(offsetPercentVec2)

            counterX++

            if(offsetX >= 1.0 - frameSize.x/mapWidth) { // if on last column of any row
                
                if(counterY <= rowCount) {
                    counterY++
                }

                if(offsetY <= 0) {
                    counterY = 1
                }
                
                counterX = 0
            } else if(counterY == rowCount && offsetX >= 1.0 - ignoreSpacePercentage) { // if on last row and beyond last frame of grid
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
                position={props.position}
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