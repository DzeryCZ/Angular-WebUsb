interface Navigator {
    usb: {
        getDevices(): any,
        requestDevice(args: Object): any
    }
}