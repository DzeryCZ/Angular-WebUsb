interface Navigator {
    usb: {
        getDevices(): any,
        requestDevice(args: Object): any,
        addEventListener(name: string, args: Object):any
    }
}