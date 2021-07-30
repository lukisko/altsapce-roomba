import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import { Quaternion, Vector3 } from '@microsoft/mixed-reality-extension-sdk';
import SDKObject from './SDKObject';
import Sensor from './Sensor';

export default class Roomba extends SDKObject {
    private roomba: MRE.Actor;
    private frontSensor: Sensor;
    private moveFrames: MRE.AnimationData;
    private rotation: MRE.Quaternion;
    public constructor(assets: MRE.AssetContainer) {
        super(assets);
        this.rotation = MRE.Quaternion.FromEulerAngles(0, 0, 0);
        this.createRoomba();
        this.createSensors(this.roomba);
        //this.setRoombaAnim();
        this.moveRoomba(50);

        // setTimeout(()=> this.stopMoving(),3000);

    }

    private createRoomba() {
        this.roomba = MRE.Actor.CreateFromLibrary(super.getContext(), {
            resourceId: 'artifact:1766806184817328618',
            actor: {
                transform: {
                    local: {
                        scale: { x: 0.4, y: 0.4, z: 0.4 },
                        position: { x: 0, y: 0, z: 0 }
                    }
                },
            }
        });
        this.roomba.subscribe("transform");
        //this.roomba.collider.layer = MRE.CollisionLayer.Navigation
        //this.createSensors(this.roomba);
    }

    private moveRoomba(distance: number): Promise<void> {
        //this.roomba.transform.local.position = new Vector3(0,0,5);
        const velocity = 0.4;
        const duration = Math.abs(distance / velocity);
        //console.log("started moving1");
        //this.roomba.targetingAnimationsByName.get("clean").play();
        //return;
        let targetPoint = new Vector3(0, 0, distance);
        targetPoint.rotateByQuaternionToRef(this.rotation, targetPoint);
        targetPoint = targetPoint.addInPlace(this.roomba.transform.app.position);
        const prom = new Promise<void>((resolve, reject) => {
            this.roomba.animateTo({
                transform: {
                    local: {
                        position: {
                            x: targetPoint.x,
                            y: targetPoint.y,
                            z: targetPoint.z
                        }
                    }
                }
            }, duration, MRE.AnimationEaseCurves.Linear)
                .then(() => {
                    //console.log("great, it finished");
                    resolve();
                });
        });
        return prom;
    }

    private sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private async stopMoving() {
        if (this.roomba) {
            this.roomba.targetingAnimations.forEach((value) => {
                value.stop();
            })
        }
        await this.sleep(100);
        //console.log(this.roomba.transform.app.position.z);
        await this.moveRoomba(-0.3);
        await this.sleep(100);

        const theNewRotation = MRE.Quaternion.RotationYawPitchRoll(2 * Math.random() * Math.PI, 0, 0);
        //console.log(theNewRotation.y);
        MRE.Animation.AnimateTo(super.getContext(), this.roomba,
            {
                destination: {//TODO change to random
                    transform: { app: { rotation: theNewRotation } }
                },
                duration: 1
            }).then(() => {
                this.rotation = theNewRotation;
                this.moveRoomba(50);
            })

    }

    private createSensors(parent: MRE.Actor): void {
        this.frontSensor = new Sensor(super.getAssets(), {
            x: 0,
            y: 0.05,
            z: 0.8
        }, {
            x: 0.03,
            y: 0.03,
            z: 0.03
        }, parent, {
            x: 0,
            y: 0,
            z: 0,
            w: 1
        });
        this.frontSensor.setActionOnHit(this.stopMoving.bind(this));
    }

    updateButtons(): void {
        //throw new Error('Method not implemented.');
    }
    welcomeUser(user: MRE.User): void {
        //throw new Error('Method not implemented.');
    }

}
