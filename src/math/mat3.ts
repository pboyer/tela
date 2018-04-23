import { Mat4 } from "./mat4"

export interface Mat3 {
    [position: number]: number;
}

export function copy(m: Mat3, dst : Mat3 = null): Mat3 {
    dst = dst || new Array<number>(9);

    dst[0] = m[0];
    dst[1] = m[1];
    dst[2] = m[2];

    dst[3] = m[3];
    dst[4] = m[4];
    dst[5] = m[5];

    dst[6] = m[6];
    dst[7] = m[7];
    dst[8] = m[8];

    return dst;
}

export function ident(dst: Mat3 = null): Mat3 {
    dst = dst || new Array<number>(9);

    dst[0] = 1;
    dst[1] = 0;
    dst[2] = 0;

    dst[3] = 0;
    dst[4] = 1;
    dst[5] = 0;

    dst[6] = 0;
    dst[7] = 0;
    dst[8] = 1;

    return dst;
}

export function translate(x: number, y: number, dst : Mat3 = null): Mat3 {
    dst = dst || new Array<number>(9);

    dst[0] = 1;
    dst[1] = 0;
    dst[2] = 0;

    dst[3] = 0;
    dst[4] = 1;
    dst[5] = 0;

    dst[6] = x;
    dst[7] = y;
    dst[8] = 1;

    return dst;
}

export function scale(x: number, y: number, dst : Mat3 = null): Mat3 {
    dst = dst || new Array<number>(9);

    dst[0] = x;
    dst[1] = 0;
    dst[2] = 0;

    dst[3] = 0;
    dst[4] = y;
    dst[5] = 0;

    dst[6] = 0;
    dst[7] = 0;
    dst[8] = 1;

    return dst;
}

export function mult(a : Mat3, b : Mat3) : Mat3 {
    let a00 = a[0 * 3 + 0];
    let a01 = a[0 * 3 + 1];
    let a02 = a[0 * 3 + 2];
    let a10 = a[1 * 3 + 0];
    let a11 = a[1 * 3 + 1];
    let a12 = a[1 * 3 + 2];
    let a20 = a[2 * 3 + 0];
    let a21 = a[2 * 3 + 1];
    let a22 = a[2 * 3 + 2];
    let b00 = b[0 * 3 + 0];
    let b01 = b[0 * 3 + 1];
    let b02 = b[0 * 3 + 2];
    let b10 = b[1 * 3 + 0];
    let b11 = b[1 * 3 + 1];
    let b12 = b[1 * 3 + 2];
    let b20 = b[2 * 3 + 0];
    let b21 = b[2 * 3 + 1];
    let b22 = b[2 * 3 + 2];
    
    return [
        b00 * a00 + b01 * a10 + b02 * a20,
        b00 * a01 + b01 * a11 + b02 * a21,
        b00 * a02 + b01 * a12 + b02 * a22,
        b10 * a00 + b11 * a10 + b12 * a20,
        b10 * a01 + b11 * a11 + b12 * a21,
        b10 * a02 + b11 * a12 + b12 * a22,
        b20 * a00 + b21 * a10 + b22 * a20,
        b20 * a01 + b21 * a11 + b22 * a21,
        b20 * a02 + b21 * a12 + b22 * a22,
    ];
}

export function to4(a : Mat3, dst : Mat4 = null) : Mat4 {
    dst = dst || new Array<number>(16);

    dst[0] = a[0];
    dst[1] = a[1];
    dst[2] = a[2];
    dst[3] = 0;
    
    dst[4] = a[3];
    dst[5] = a[4];
    dst[6] = a[5];
    dst[7] = 0;
    
    dst[8] = 0;
    dst[9] = 0;
    dst[10] = 1;
    dst[11] = 0;

    dst[12] = a[6];
    dst[13] = a[7];
    dst[14] = 0;
    dst[15] = 1;

    return dst;
}

