import { Injectable } from '@angular/core';
import * as encoding from 'text-encoding';
import { isThenableType } from '../../../node_modules/tsutils';

@Injectable()
export class WebusbSerivce {

    private device;
    private readCallbacks: Array<(data: string) => void> = new Array();
    public isConnected = true;

    constructor() {
        navigator.usb.addEventListener('connect', event => {
            this.connectToPairedDevice();
        });
        navigator.usb.addEventListener('disconnect', event => {
            this.isConnected= false;
        });
    }

    connectToPairedDevice = function() {
        let connectedDevice = this.getPairedDevice();
        this.postConnectActions(connectedDevice);
    }

    connectToNewDevice = function() {
        let connectedDevice = this.getDeviceSelector();
        this.postConnectActions(connectedDevice);
    }

    postConnectActions = function(connectedDevice){
        connectedDevice
        .then(() => this.device.selectConfiguration(1)) // Select configuration #1 for the device.
        .then(() => this.device.claimInterface(2)) // Request exclusive control over interface #2.
        .then(() => this.device.controlTransferOut({
            requestType: 'class',
            recipient: 'interface',
            request: 0x22,
            value: 0x01,
            index: 0x02})) // Ready to receive data 
        .then(() => {
            this.readLoop(64);
        })
        .then(() => {
            this.isConnected = true;
            console.log(this.device.configuration.interfaces[2].alternate.endpoints[1].packetSize);
        })
        .catch(error => { 
            console.error(error); 
            this.isConnected = false;
        });
    }

    registerReadCallback = function(callback) {
        this.readCallbacks.push(callback);
    }

    sendString = async (data: string) => {
        let dataToSend = new encoding.TextEncoder().encode(data);
        this.sendDataToDevice(dataToSend);
    }

    sendSymbol = async (symbol: number) => {
        let dataToSend = new Uint8Array(1);
        dataToSend.fill(symbol);
        this.sendDataToDevice(dataToSend);
    }

    sendDataToDevice = async (data:Uint8Array) => {
        this.device.transferOut(
            4,
            data
        );
    }

    readLoop = async function(length: number) {
        var data = '';
        while (this.isConnected) { // @todo - disconnection crashes the app
            var result = await this.readOneLine(length);
            data += result;
            if (result === '') {
                console.log(data);
                this.readCallbacks.forEach(callback => {
                    callback(data);
                });
                break;
            } 
        }
        this.readLoop(length);
    }

    readOneLine = async function(length: number) {
        var data = '';
        await this.device.transferIn(5, length)
            .then(async (result) => {
                var decoder = new encoding.TextDecoder();
                data = decoder.decode(result.data);
            }, error => {
                console.error(error);
            });
        return data;
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

    getDeviceSelector = function() {
        return navigator.usb.requestDevice({ filters: [] }) // filters: [{ vendorId: 0x2341 }]
        .then(selectedDevice => {
            this.device = selectedDevice;
            return this.device.open(); // Begin a session.
        })
    }

    getDeviceName = function() {
        if (this.device) {
            return this.device.productName;
        }
    }

    disconnect = function() {
        this.device.close();
        this.isConnected = false;
    }
}