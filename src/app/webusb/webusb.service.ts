import { Injectable } from '@angular/core';
import * as encoding from 'text-encoding';

var device;

@Injectable()
export class WebusbSerivce {
    
    connect = async function (callback) {
        this.getPairedDevice()
        .then(() => {
            if(!device) {
                // this.getDeviceSelector().then(
                //     (device) => {this.device = device}
                // );
            } else {
                // this.device = device;
            }
        })
        .then(() => device.selectConfiguration(1)) // Select configuration #1 for the device.
        .then(() => device.claimInterface(2)) // Request exclusive control over interface #2.
        .then(() => device.controlTransferOut({
            requestType: 'class',
            recipient: 'interface',
            request: 0x22,
            value: 0x01,
            index: 0x02})) // Ready to receive data
        .then(() => {
            this.readLoop(callback)
        })
        .catch(error => { 
            console.error(error); 
        });
    }

    readLoop = async function(callback){
        device.transferIn(5, 64)
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
                device = devices[0];
                return device.open(); // Begin a session.
            } else {
                return false;
            }
        });
    }

    getDeviceSelector = function() {
        return navigator.usb.requestDevice({ filters: [{ vendorId: 0x2341 }] })
        .then(selectedDevice => {
            device = selectedDevice;
            return device.open(); // Begin a session.
        })
    }
}