import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import SDKObject from './SDKObject';
export default class Roomba extends SDKObject {
    private roomba;
    private frontSensor;
    private moveFrames;
    private rotation;
    constructor(assets: MRE.AssetContainer);
    private createRoomba;
    private moveRoomba;
    private sleep;
    private stopMoving;
    private createSensors;
    updateButtons(): void;
    welcomeUser(user: MRE.User): void;
}
//# sourceMappingURL=Roomba.d.ts.map