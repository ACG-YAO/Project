import { BaseMap } from '../BaseMap.js';
import { Water } from 'three/addons/objects/Water.js';
import * as THREE from 'three';

export class RandomGeneratedMap extends BaseMap {
    constructor(mazeSize, numRewards, exclusionZoneSize, scaleSize) {
        super(mazeSize, numRewards, exclusionZoneSize, scaleSize);
        this.minimumDistance = 10;
        this.MapTypes = {
            LAND: 0,
            ROAD: 1,
            REWARD: 2,
            START: 3,
            WATER: 4
        };
        this.waterObjectsList = [];
    }

    initialize() {
        this.generateMazeWithRewards();
        this.findWater();
        this.createGroundGrid();
        this.placeObjects(this.Reward, this.findReward());
        this.placeObjects(this.Fence, this.findYFence());
        this.placeObjects(this.ReversedFence, this.findXFence());
    }

    createRandomPath(start, end) {
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const dist = Math.abs(dx) + Math.abs(dy);
        let steps = 0;

        let current = { ...start };
        while ((current.x !== end.x || current.y !== end.y) && steps < dist * 2) {

            this.maze[current.y][current.x] = this.MapTypes.ROAD;

            if (Math.random() < 0.5 && current.x !== end.x) {
                current.x += Math.sign(dx);
            } else if (current.y !== end.y) {
                current.y += Math.sign(dy);
            }
            steps++;
        }

        this.maze[end.y][end.x] = this.MapTypes.ROAD;
    }

    generateMazeWithRewards() {
        const excludeStart = this.halfSize - this.exclusionZoneSize / 2;
        const excludeEnd = this.halfSize + this.exclusionZoneSize / 2;
        function isInExclusionZone(x, y) {
            return x >= excludeStart && x < excludeEnd && y >= excludeStart && y < excludeEnd;
        }
        const rewards = [];
        while (rewards.length < this.numRewards) {
            const x = Math.floor(Math.random() * this.mazeSize);
            const y = Math.floor(Math.random() * this.mazeSize);
            
            const isFarEnough = rewards.every((reward) => {
                return Math.abs(reward.x - x) + Math.abs(reward.y - y) > this.minimumDistance;
            });

            if (!isInExclusionZone(x, y) && isFarEnough) {
                rewards.push({ x, y });
            }
        }
        

        let current = { x: this.halfSize, y: this.halfSize }; 

        rewards.forEach(reward => {
            this.createRandomPath(current, reward);
            current = reward;
        });

        rewards.forEach(reward => this.maze[reward.y][reward.x] = this.MapTypes.REWARD);
        this.maze[this.halfSize][this.halfSize] = this.MapTypes.START;
    }

    createGroundGrid() {
        for (let i = -this.halfSize; i < this.halfSize; i++) {
            for (let j = -this.halfSize; j < this.halfSize; j++) {
                let geometry, material, mesh;
                switch (this.maze[j + this.halfSize][i + this.halfSize]) {
                    case this.MapTypes.LAND:
                        geometry = new THREE.PlaneGeometry(this.scaleSize, this.scaleSize);
                        material = new THREE.MeshBasicMaterial({ color: new THREE.Color('white'), side: THREE.DoubleSide });
                        mesh = new THREE.Mesh(geometry, material);
                        break;
                    case this.MapTypes.ROAD:
                    case this.MapTypes.START:
                        geometry = new THREE.PlaneGeometry(this.scaleSize, this.scaleSize);
                        material = new THREE.MeshBasicMaterial({ color: new THREE.Color('gray'), side: THREE.DoubleSide });
                        mesh = new THREE.Mesh(geometry, material);
                        break;
                    case this.MapTypes.REWARD:
                        geometry = new THREE.PlaneGeometry(this.scaleSize, this.scaleSize);
                        material = new THREE.MeshBasicMaterial({ color: new THREE.Color('gold'), side: THREE.DoubleSide });
                        mesh = new THREE.Mesh(geometry, material);
                        break;
                    case this.MapTypes.WATER:
                        const waterGeometry = new THREE.PlaneGeometry(this.scaleSize, this.scaleSize);
                        const water = new Water(waterGeometry, {
                            textureWidth: 2048,
                            textureHeight: 2048,
                            waterNormals: new THREE.TextureLoader().load('Textures/Water.jpg', function (texture) {
                                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                            }),
                            sunDirection: new THREE.Vector3(0, 0, 0),
                            sunColor: 0xffffff,
                            waterColor: 0x00bfff,
                            distortionScale: 0.4
                        });
                        water.rotation.x = - Math.PI / 2;
                        water.position.set(i * this.scaleSize, 0.01 , j * this.scaleSize);
                        this.scene.add(water);
                        this.waterObjectsList.push(water);
                        break;
                }

                if (this.maze[j + this.halfSize][i + this.halfSize] != this.MapTypes.WATER) {
                    mesh.position.set(i * this.scaleSize, 0, j * this.scaleSize);
                    mesh.rotateX(Math.PI / 2);
                    this.scene.add(mesh);
                }
            }
        }
    }


    placeObjects(name, list) {
        list.forEach(center => {
            const object = new name(this.scene, (gltf) => {
                gltf.scene.position.set(this.scaleSize * (center.x - this.halfSize), 0, this.scaleSize * (center.y - this.halfSize));
                this.scene.add(gltf.scene);
            });
            while (!object.getLoadPromise()) { }
            this.fixedObjectsList.push(object);
        });
    }

    findReward() {
        const zones = [];
        for (let y = 0; y < this.maze.length; y++) {
            for (let x = 0; x < this.maze[y].length; x++) {
                if (this.maze[y][x] === this.MapTypes.REWARD) {
                    zones.push({ x, y });
                }
            }
        }
        return zones;
    }

    
    findXFence() {
        const middlePoints = [];
        for (let y = 0; y < this.maze.length; y++) {
            for (let x = 0; x < this.maze[y].length; x++) {
                if (this.maze[y][x] === this.MapTypes.LAND || this.maze[y][x] === this.MapTypes.WATER) {
                    if (x === 0 || (x > 0 && (this.maze[y][x - 1] === this.MapTypes.ROAD || this.maze[y][x - 1] === this.MapTypes.REWARD || this.maze[y][x - 1] === this.MapTypes.START))) {
                        middlePoints.push({ x: (x - 0.65), y });
                    }
                    if (x === this.maze[y].length - 1 || (x < this.maze[y].length - 1 && (this.maze[y][x + 1] === this.MapTypes.ROAD || this.maze[y][x + 1] === this.MapTypes.REWARD || this.maze[y][x + 1] === this.MapTypes.START))) {
                        middlePoints.push({ x: (x + 0.35), y });
                    }
                }
            }
        }
        return middlePoints;
    }

    findYFence() {
        const middlePoints = [];

        for (let y = 0; y < this.maze.length; y++) {
            for (let x = 0; x < this.maze[y].length; x++) {
                if (this.maze[y][x] === this.MapTypes.LAND || this.maze[y][x] === this.MapTypes.WATER) {
                    if (y === 0 || (y > 0 && (this.maze[y - 1][x] === this.MapTypes.ROAD || this.maze[y - 1][x] === this.MapTypes.REWARD || this.maze[y - 1][x] === this.MapTypes.START))) {
                        middlePoints.push({ x, y: (y - 0.7) });
                    }
                    if (y === this.maze.length - 1 || (y < this.maze.length - 1 && (this.maze[y + 1][x] === this.MapTypes.ROAD || this.maze[y + 1][x] === this.MapTypes.REWARD || this.maze[y + 1][x] === this.MapTypes.START ))) {
                        middlePoints.push({ x, y: (y + 0.3) });
                    }
                }
            }
        }
        return middlePoints;
    }

    findLargeArea() {
        const zones = [];
        const largesize = 2;
        const largehalfSize = Math.floor(largesize / 2);
        
        for (let y = largehalfSize; y < this.maze.length - largehalfSize; y++) {
            for (let x = largehalfSize; x < this.maze[y].length - largehalfSize; x++) {
                let isAllZero = true;
                
                for (let i = -largehalfSize; i <= largehalfSize; i++) {
                    for (let j = -largehalfSize; j <= largehalfSize; j++) {
                        if (this.maze[y + i][x + j] !== this.MapTypes.LAND) {
                            isAllZero = false;
                            break;
                        }
                    }
                    if (!isAllZero) break;
                }

                if (isAllZero) {
                    for (let i = -largehalfSize; i <= largehalfSize; i++) {
                        for (let j = -largehalfSize; j <= largehalfSize; j++) {
                            this.maze[y + i][x + j] = this.MapTypes.WATER;
                        }
                    }
                    zones.push({ x, y });
                }
            }
        }
        return zones;
    }

    findWater() {
        for (let i = 24; i <= 26; i++) {
            for (let j = 24; j <= 26; j++) {
                if (this.maze[i][j] === this.MapTypes.LAND) {
                    this.maze[i][j] = this.MapTypes.WATER;
                    return;
                }
            }
        }
    }
}

export default RandomGeneratedMap;