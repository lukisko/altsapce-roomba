import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import SDKObject from './SDKObject';

const testing = false; //just to show the sensor if testing/ debuging

export default class Sensor extends SDKObject {
	private sensorActor: MRE.Actor;
	private callAfterHit: () => void;
	private onTriger: number;
	public constructor(assets: MRE.AssetContainer, position: MRE.Vector3Like,
		size: MRE.Vector3Like, parent: MRE.Actor, rotation: MRE.QuaternionLike) {
		super(assets);
		this.onTriger = 0;
		this.makeSensor(position, size, parent.id, rotation);
	}

	public makeSensor(position: MRE.Vector3Like, size: MRE.Vector3Like,
		parentId: MRE.Guid, rotation: MRE.QuaternionLike) {
		this.sensorActor = MRE.Actor.CreatePrimitive(super.getAssets(), {
			definition: {
				shape: MRE.PrimitiveShape.Box,
				dimensions: size
			},
			addCollider: true,
			actor: {
				parentId: parentId,
				transform: {
					local: {
						position: {
							x: position.x,
							y: position.y * 0.7,
							z: position.z
						},
						rotation: rotation
					}
				},
				appearance: {
					enabled: testing
				},
				collider: {
					geometry: {
						shape: MRE.ColliderType.Box,
						size: size
					},
					isTrigger: true,
					enabled: true,
					eventSubscriptions: ["trigger-enter", "trigger-exit"]
				},
				rigidBody: {
					detectCollisions: true,
					enabled: true,
					useGravity: false
				}
			}
		});
		this.sensorActor.subscribe("rigidbody");
		this.sensorActor.subscribe("collider");
		this.sensorActor.collider.onTrigger("trigger-enter", () => {
			//console.log("trigger-enter");
			this.onTriger++;
		});
		this.sensorActor.collider.onTrigger("trigger-exit", () => {
			this.onTriger--;
			if (this.isOnTriger()) {
				this.callAfterHit();
			}
			//console.log("trigger-exit");
		});

		this.makeBoundary(position, parentId);
		for (let i = 0; i < 1; i++) {
			MRE.Actor.CreatePrimitive(super.getAssets(), {
				definition: {
					shape: MRE.PrimitiveShape.Sphere,
					dimensions: {
						x: 0.2, y: 0.2, z: 0.2
					},
				},
				addCollider: true,
				actor: {
					transform: { local: { position: { x: 0, y: 0.04, z: 0.33 } } },
					rigidBody: {
						enabled: true,
						useGravity: true
					},
					appearance: {
						enabled: testing
					}
				}
			});
		}
	}

	private makeTestingBoundary(position: MRE.Vector3Like, parentId: MRE.Guid) {
		MRE.Actor.CreatePrimitive(super.getAssets(), {
			definition: {
				shape: MRE.PrimitiveShape.Sphere,
				dimensions: {
					x: 0.6, y: 0.6, z: 0.6
				},
			},
			addCollider: true,
			actor: {
				parentId: parentId,
				transform: { local: { position: { x: 0, y: 0.12, z: 0.75 } } },
				appearance: {
					enabled: true
				}
			}
		});
	}

	private makeBoundary(position: MRE.Vector3Like, parentId: MRE.Guid) {
		const width = 0.48;
		const heightRatio = 2.2;
		//side
		MRE.Actor.CreatePrimitive(super.getAssets(), {
			definition: {
				shape: MRE.PrimitiveShape.Cylinder,
				dimensions: { x: 0.02, y: 0.02, z: 0.2 },
			},
			addCollider: true,
			actor: {
				parentId: parentId,
				transform: {
					local: { position: { x: width / 2, y: position.y * heightRatio * 1.2, z: 0.8 } }
				},
				appearance: {
					enabled: testing
				}
			}
		});
		//other side
		MRE.Actor.CreatePrimitive(super.getAssets(), {
			definition: {
				shape: MRE.PrimitiveShape.Cylinder,
				dimensions: { x: 0.02, y: 0.02, z: 0.2 },
			},
			addCollider: true,
			actor: {
				parentId: parentId,
				transform: {
					local: { position: { x: - width / 2, y: position.y * heightRatio * 1.2, z: 0.8 } }
				},
				appearance: {
					enabled: testing
				}
			}
		});
		//front
		MRE.Actor.CreatePrimitive(super.getAssets(), {
			definition: {
				shape: MRE.PrimitiveShape.Cylinder,
				dimensions: { x: 0.2, y: 0.02, z: 0.02 },
			},
			addCollider: true,
			actor: {
				parentId: parentId,
				transform: {
					local: { position: { x: 0, y: position.y * heightRatio * 1.2, z: 1 } }
				},
				appearance: {
					enabled: testing
				}
			}
		});
		//bottom
		MRE.Actor.CreatePrimitive(super.getAssets(), {
			definition: {
				shape: MRE.PrimitiveShape.Cylinder,
				dimensions: { x: 0.2, y: 0.02, z: 0.02 },
			},
			addCollider: true,
			actor: {
				parentId: parentId,
				transform: {
					local: { position: { x: 0, y: position.y * -0.1, z: 0.8 } }
				},
				appearance: {
					enabled: testing
				}
			}
		});
	}

	public setActionOnHit(functi: () => void) {
		this.callAfterHit = functi;
	}

	public isOnTriger(): boolean {
		return this.onTriger === 0;
	}

	updateButtons(): void {
		//nothing to do
	}
	welcomeUser(user: MRE.User): void {
		//nothing to do
	}

}
