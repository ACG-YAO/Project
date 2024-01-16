import { BaseMap } from '../BaseMap.js';
import { Water } from 'three/addons/objects/Water.js';
import * as THREE from 'three';

export class RandomGeneratedMap extends BaseMap {
    constructor(mazeSize, numRewards, exclusionZoneSize, scaleSize) {
        super(mazeSize, numRewards, exclusionZoneSize, scaleSize);
        this.minimumDistance = 10;
        this.displayDistance = 20;
        this.MapTypes = {
            LAND: 0,
            ROAD: 1,
            REWARD: 2,
            START: 3,
            WATER: 4,
            USED: 5
        };
        this.waterObjectsList = [];
        this.agentLocation = null;
    }

    initialize() {
        this.generateMazeWithRewards();
        this.findWater();
        this.createGroundGrid();
        this.placeObjects(this.Reward, this.findReward());
        this.placeObjects(this.Fence, this.findYFence());
        this.placeObjects(this.ReversedFence, this.findXFence());
        this.placeOthers(this.Dog, this.findDrinkingYDog());
        this.placeOthers(this.ReversedDog, this.findDrinkingXDog());
        let zones = this.findDrinkingYDog();
        this.placeOthers(this.Grass, this.offsetZones(zones, 0.2, 0.2));
        this.placeOthers(this.Grass, this.offsetZones(zones, 0.3, 0.5));
        this.placeOthers(this.Grass, this.offsetZones(zones, 0.4, 0.2));
        this.placeOthers(this.Grass, this.offsetZones(zones, 0.5, 0.4));
        this.placeOthers(this.Grass, this.offsetZones(zones, 0.6, 0.2));
        this.placeOthers(this.Grass, this.offsetZones(zones, 0.8, 0.1));
        zones = this.findDrinkingXDog();
        this.placeOthers(this.Grass, this.offsetZones(zones, 0.2, 0.2));
        this.placeOthers(this.Grass, this.offsetZones(zones, 0.3, 0.5));
        this.placeOthers(this.Grass, this.offsetZones(zones, 0.4, 0.2));
        this.placeOthers(this.Grass, this.offsetZones(zones, 0.5, 0.4));
        this.placeOthers(this.Grass, this.offsetZones(zones, 0.6, 0.2));
        this.placeOthers(this.Grass, this.offsetZones(zones, 0.8, 0.1));
        this.placeOthers(this.Inn, this.findInn());
        this.placeOthers(this.Tree, this.findTree());
        // this.placeDogs(this.Dog, this.findWalkingDog());
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
        const textureLoader = new THREE.TextureLoader();
        const roadTexture = textureLoader.load('Textures/Road.jpg');
        const landTexture = textureLoader.load('Textures/Land.jpg');
        const waterTexture = textureLoader.load('Textures/Water.jpg', function (texture) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        });

        for (let i = -this.halfSize; i < this.halfSize; i++) {
            for (let j = -this.halfSize; j < this.halfSize; j++) {
                let geometry, material, mesh;
                switch (this.maze[j + this.halfSize][i + this.halfSize]) {
                    case this.MapTypes.LAND:
                        geometry = new THREE.PlaneGeometry(this.scaleSize, this.scaleSize);
                        material = new THREE.MeshBasicMaterial({ map: landTexture, side: THREE.DoubleSide });
                        mesh = new THREE.Mesh(geometry, material);
                        break;
                    case this.MapTypes.ROAD:
                    case this.MapTypes.START:
                    case this.MapTypes.REWARD:
                        geometry = new THREE.PlaneGeometry(this.scaleSize, this.scaleSize);
                        material = new THREE.MeshBasicMaterial({ map: roadTexture, side: THREE.DoubleSide });
                        mesh = new THREE.Mesh(geometry, material);
                        break;
                    case this.MapTypes.WATER:
                        const waterGeometry = new THREE.PlaneGeometry(this.scaleSize, this.scaleSize);
                        const water = new Water(waterGeometry, {
                            textureWidth: 512,
                            textureHeight: 512,
                            waterNormals: waterTexture,
                            sunDirection: new THREE.Vector3(0, 0, 0),
                            sunColor: 0xffffff,
                            waterColor: 0x00bfff,
                            distortionScale: 0.4
                        });
                        water.rotation.x = - Math.PI / 2;
                        water.position.set(i * this.scaleSize, 0.01 , j * this.scaleSize);
                        this.scene.add(water);
                        this.waterObjectsList.push(water);
                        this.allObjectsList.push(water);
                        break;
                }

                if (this.maze[j + this.halfSize][i + this.halfSize] != this.MapTypes.WATER) {
                    mesh.position.set(i * this.scaleSize, 0, j * this.scaleSize);
                    mesh.rotateX(Math.PI / 2);
                    this.scene.add(mesh);
                    this.allObjectsList.push(mesh);
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
            this.allObjectsList.push(object);
        });
    }

    placeOthers(name, list) {
        list.forEach(center => {
            const object = new name(this.scene, (gltf) => {
                gltf.scene.position.set(this.scaleSize * (center.x - this.halfSize), 0, this.scaleSize * (center.y - this.halfSize));
                this.scene.add(gltf.scene);
            });
            while (!object.getLoadPromise()) { }
            this.otherObejectsList.push(object);
            this.allObjectsList.push(object);
        });
    }

    findDrinkingYDog() {
        const zones = [];
        let y = 0;
        for (let y_ = 1; y_ < this.maze.length-1; y_+=2) {
            for (let x = 1; x < this.maze[y_].length-1; x+=2) {
                    if (this.maze[y_][x] === this.MapTypes.LAND && this.maze[y_+1][x] === this.MapTypes.WATER) {
                        y = y_ + 0.33;
                    zones.push({ x, y });
                    this.maze[y_][x] = this.MapTypes.USED;
                }
            }
        }
        return zones;
    }

    findDrinkingXDog() {
        const zones = [];
        let x = 0;
        for (let y = 1; y < this.maze.length-1; y+=2) {
            for (let x_ = 1; x_ < this.maze[y].length-1; x_+=2) {
                    if (this.maze[y][x_] === this.MapTypes.LAND && this.maze[y][x_+1] === this.MapTypes.WATER) {
                        x = x_ + 0.33;
                    zones.push({ x, y });
                    this.maze[y][x_] = this.MapTypes.USED;
                }
            }
        }
        return zones;
    }

    findInn() {
        const zones = [];
        for (let y = 1; y < this.maze.length-1; y+=1) {
            for (let x = 1; x < this.maze[y].length-1; x+=1) {
                    if (this.maze[y][x] === this.MapTypes.LAND &&
                        this.maze[y+1][x] === this.MapTypes.LAND &&
                        this.maze[y][x+1] === this.MapTypes.LAND &&
                        this.maze[y+1][x+1] === this.MapTypes.LAND &&
                        Math.random() < 0.25
                        ) {
                    this.maze[y][x] = this.MapTypes.USED;
                    this.maze[y+1][x] = this.MapTypes.USED;
                    this.maze[y][x+1] = this.MapTypes.USED;
                    this.maze[y+1][x+1] = this.MapTypes.USED;
                    zones.push({ x, y });
                }
            }
        }
        return this.offsetZones(zones, 0.45, 0.3);
    }

    findTree() {
        const zones = [];
        for (let y = 1; y < this.maze.length-1; y+=1) {
            for (let x = 1; x < this.maze[y].length-1; x+=1) {
                    if (this.maze[y][x] === this.MapTypes.LAND &&
                        this.maze[y+1][x] === this.MapTypes.LAND &&
                        this.maze[y][x+1] === this.MapTypes.LAND &&
                        this.maze[y+1][x+1] === this.MapTypes.LAND &&
                        Math.random() < 0.9
                        ) {
                    this.maze[y][x] = this.MapTypes.USED;
                    zones.push({ x, y });
                }
            }
        }
        return this.offsetZones(zones, 0.45, 0.3);
    }

    findWalkingDog() {
        const zones = [];
        for (let y = 1; y < this.maze.length-1; y+=2) {
            for (let x = 1; x < this.maze[y].length-1; x+=2) {
                let count = 0;
                if (this.maze[y][x+1] === this.MapTypes.LAND) { count++; }
                if (this.maze[y][x] === this.MapTypes.LAND) { count++; }
                if (this.maze[y][x-1] === this.MapTypes.LAND) { count++; }
                if (this.maze[y+1][x+1] === this.MapTypes.LAND) { count++; }
                if (this.maze[y+1][x] === this.MapTypes.LAND) { count++; }
                if (this.maze[y+1][x-1] === this.MapTypes.LAND) { count++; }
                if (this.maze[y-1][x+1] === this.MapTypes.LAND) { count++; }
                if (this.maze[y-1][x-1] === this.MapTypes.LAND) { count++; }
                if (this.maze[y-1][x-1] === this.MapTypes.LAND) { count++; }
                if (this.maze[y][x] === this.MapTypes.LAND && count > 4) {
                    console.log(x);
                    console.log(y);
                    console.log('hhh');
                    zones.push({ x, y });
                }
            }
        }
        return zones;
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
                if (x === 0) {
                    middlePoints.push({ x: (x - 0.5), y });
                }
                if (x === this.maze[y].length - 1) {
                    middlePoints.push({ x: (x + 0.5), y });
                }
                if (this.maze[y][x] === this.MapTypes.LAND || this.maze[y][x] === this.MapTypes.WATER) {
                    if (x > 0 && (this.maze[y][x - 1] === this.MapTypes.ROAD || this.maze[y][x - 1] === this.MapTypes.REWARD || this.maze[y][x - 1] === this.MapTypes.START)) {
                        middlePoints.push({ x: (x - 0.5), y });
                    }
                    if (x < this.maze[y].length - 1 && (this.maze[y][x + 1] === this.MapTypes.ROAD || this.maze[y][x + 1] === this.MapTypes.REWARD || this.maze[y][x + 1] === this.MapTypes.START)) {
                        middlePoints.push({ x: (x + 0.5), y });
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
                if (y === 0) {
                    middlePoints.push({ x, y: (y - 0.5) });
                }
                if (y === this.maze.length - 1) {
                    middlePoints.push({ x, y: (y + 0.5) });
                }
                if (this.maze[y][x] === this.MapTypes.LAND || this.maze[y][x] === this.MapTypes.WATER) {
                    if (y > 0 && (this.maze[y - 1][x] === this.MapTypes.ROAD || this.maze[y - 1][x] === this.MapTypes.REWARD || this.maze[y - 1][x] === this.MapTypes.START)) {
                        middlePoints.push({ x, y: (y - 0.5) });
                    }
                    if (y < this.maze.length - 1 && (this.maze[y + 1][x] === this.MapTypes.ROAD || this.maze[y + 1][x] === this.MapTypes.REWARD || this.maze[y + 1][x] === this.MapTypes.START )) {
                        middlePoints.push({ x, y: (y + 0.5) });
                    }
                }
            }
        }
        return middlePoints;
    }

    findWater() {
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

    /*findWater() {
        for (let i = 24; i <= 26; i++) {
            for (let j = 24; j <= 26; j++) {
                if (this.maze[i][j] === this.MapTypes.LAND) {
                    this.maze[i][j] = this.MapTypes.WATER;
                    return;
                }
            }
        }
    }*/

    processDisplayOfObjects() {
        this.allObjectsList.forEach(object => {
            if (object.object3D) {
                const distance = Math.sqrt(Math.pow(object.object3D.position.x - this.agentLocation.x, 2) + Math.pow(object.object3D.position.z - this.agentLocation.z, 2));

                if (distance <= this.displayDistance) {
                    if (!this.scene.children.includes(object.object3D)) {
                        this.scene.add(object.object3D);
                    }
                } else {
                    if (this.scene.children.includes(object.object3D)) {
                        this.scene.remove(object.object3D);
                    }
                }
            } else {
                const distance = Math.sqrt(Math.pow(object.position.x - this.agentLocation.x, 2) + Math.pow(object.position.z - this.agentLocation.z, 2));

                if (distance <= this.displayDistance) {
                    if (!this.scene.children.includes(object)) {
                        this.scene.add(object);
                    }
                } else {
                    if (this.scene.children.includes(object)) {
                        this.scene.remove(object);
                    }
                }
            }
        });
    }

    updateAgentLocation(newLocation) {
        this.agentLocation = newLocation;
        this.processDisplayOfObjects();
    }

    offsetZones(zones, a, b) {
        return zones.map(zone => {
            return { x: zone.x + a, y: zone.y + b };
        });
    }
}

export default RandomGeneratedMap;