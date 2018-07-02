import { Injectable } from '@angular/core';
import * as encoding from 'text-encoding';

@Injectable()
export class WebusbSerivce {

    private device;

    connect = async function(callback){
        this.getPairedDevice()
        .then(() => {
            if(!this.device) {
                // this.getDeviceSelector();
                // this.getDeviceSelector().then(
                //     (device) => {this.device = device}
                // );
            } else {
                // this.device = device;
            }
        })
        .then(() => this.device.selectConfiguration(1)) // Select configuration #1 for the device.
        .then(() => this.device.claimInterface(2)) // Request exclusive control over interface #2.
        .then(() => this.device.controlTransferOut({
            requestType: 'class',
            recipient: 'interface',
            request: 0x22,
            value: 0x01,
            index: 0x02})) // Ready to receive data 
        .then(() => this.device.transferOut(4, new encoding.TextEncoder().encode('Hey')))
        .then(() => {
            this.readLoop(callback);
        })
        .catch(error => { 
            console.error(error); 
        });
    }

    sendData = async (data: string) => {
        this.device.transferOut(
            4,
            new encoding.TextEncoder().encode(data)
        );
    }

    readLoop = async function(callback) {
        this.device.transferIn(5, 64)
            .then(async (result) => {
                var decoder = new encoding.TextDecoder();
                callback(decoder.decode(result.data));
                await this.readLoop(callback);
            }, error => {
                console.error(error);
            });
    }

    getPairedDevice = function() {
        return navigator.usb.getDevices()
        .then(devices => {
            if (devices.length) {
                this.device = devices[0];
                return this.device.open(); // Begin a session.
            } else {
                return false;
            }
        });
    }

    getDeviceSelector = () => {
        return navigator.usb.requestDevice({ filters: [{ vendorId: 0x2341 }] })
        .then(selectedDevice => {
            this.device = selectedDevice;
            return this.device.open(); // Begin a session.
        })
    }
}