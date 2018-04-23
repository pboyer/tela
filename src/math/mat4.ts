import { Vec2 } from "./vec2"

export interface Mat4 {
    [position: number]: number;
}

export function copy(m: Mat4, dst: Mat4 = null): Mat4 {
    dst = dst || new Array<number>(16);

    dst[0] = m[0];
    dst[1] = m[1];
    dst[2] = m[2];
    dst[3] = m[3];

    dst[4] = m[4];
    dst[5] = m[5];
    dst[6] = m[6];
    dst[7] = m[7];

    dst[8] = m[8];
    dst[9] = m[9];
    dst[10] = m[10];
    dst[11] = m[11];

    dst[12] = m[12];
    dst[13] = m[13];
    dst[14] = m[14];
    dst[15] = m[15];

    return dst;
}

export function ident(dst: Mat4 = null): Mat4 {
    dst = dst || new Array<number>(16);

    dst[0] = 1;
    dst[1] = 0;
    dst[2] = 0;
    dst[3] = 0;

    dst[4] = 0;
    dst[5] = 1;
    dst[6] = 0;
    dst[7] = 0;

    dst[8] = 0;
    dst[9] = 0;
    dst[10] = 1;
    dst[11] = 0;

    dst[12] = 0;
    dst[13] = 0;
    dst[14] = 0;
    dst[15] = 1;

    return dst;
}

export function translate(x: number, y: number, z: number, dst: Mat4 = null): Mat4 {
    dst = dst || new Array<number>(16);

    dst[0] = 1;
    dst[1] = 0;
    dst[2] = 0;
    dst[3] = 0;

    dst[4] = 0;
    dst[5] = 1;
    dst[6] = 0;
    dst[7] = 0;

    dst[8] = 0;
    dst[9] = 0;
    dst[10] = 1;
    dst[11] = 0;

    dst[12] = x;
    dst[13] = y;
    dst[14] = z;
    dst[15] = 1;

    return dst;
}

export function ortho(left : number, right : number, bottom : number, top : number, near : number, far : number, dst : Mat4 = null) : Mat4 {
    dst = dst || new Array<number>(16);

    dst[0]  = 2 / (right - left);
    dst[1]  = 0;
    dst[2]  = 0;
    dst[3]  = 0;

    dst[4]  = 0;
    dst[5]  = 2 / (top - bottom);
    dst[6]  = 0;
    dst[7]  = 0;

    dst[8]  = 0;
    dst[9]  = 0;
    dst[10] = -1 / (far - near);
    dst[11] = 0;

    dst[12] = (right + left) / (left - right);
    dst[13] = (top + bottom) / (bottom - top);
    dst[14] = -near / (near - far);
    dst[15] = 1;

    return dst;
}

export function invert(m : Mat4, dst : Mat4 = null) : Mat4 {
    dst = dst || new Array<number>(16);

    let m00 = m[0 * 4 + 0];
    let m01 = m[0 * 4 + 1];
    let m02 = m[0 * 4 + 2];
    let m03 = m[0 * 4 + 3];
    let m10 = m[1 * 4 + 0];
    let m11 = m[1 * 4 + 1];
    let m12 = m[1 * 4 + 2];
    let m13 = m[1 * 4 + 3];
    let m20 = m[2 * 4 + 0];
    let m21 = m[2 * 4 + 1];
    let m22 = m[2 * 4 + 2];
    let m23 = m[2 * 4 + 3];
    let m30 = m[3 * 4 + 0];
    let m31 = m[3 * 4 + 1];
    let m32 = m[3 * 4 + 2];
    let m33 = m[3 * 4 + 3];
    let tmp_0  = m22 * m33;
    let tmp_1  = m32 * m23;
    let tmp_2  = m12 * m33;
    let tmp_3  = m32 * m13;
    let tmp_4  = m12 * m23;
    let tmp_5  = m22 * m13;
    let tmp_6  = m02 * m33;
    let tmp_7  = m32 * m03;
    let tmp_8  = m02 * m23;
    let tmp_9  = m22 * m03;
    let tmp_10 = m02 * m13;
    let tmp_11 = m12 * m03;
    let tmp_12 = m20 * m31;
    let tmp_13 = m30 * m21;
    let tmp_14 = m10 * m31;
    let tmp_15 = m30 * m11;
    let tmp_16 = m10 * m21;
    let tmp_17 = m20 * m11;
    let tmp_18 = m00 * m31;
    let tmp_19 = m30 * m01;
    let tmp_20 = m00 * m21;
    let tmp_21 = m20 * m01;
    let tmp_22 = m00 * m11;
    let tmp_23 = m10 * m01;

    let t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
        (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
    let t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
        (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
    let t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
        (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
    let t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
        (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

    let d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

    dst[ 0] = d * t0;
    dst[ 1] = d * t1;
    dst[ 2] = d * t2;
    dst[ 3] = d * t3;
    dst[ 4] = d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
            (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30));
    dst[ 5] = d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
            (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30));
    dst[ 6] = d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
            (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30));
    dst[ 7] = d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
            (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20));
    dst[ 8] = d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
            (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33));
    dst[ 9] = d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
            (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33));
    dst[10] = d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
            (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33));
    dst[11] = d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
            (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23));
    dst[12] = d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
            (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22));
    dst[13] = d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
            (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02));
    dst[14] = d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
            (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12));
    dst[15] = d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
            (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02));

    return dst;
}

export function mult(a : Mat4, b : Mat4, dst : Mat4 = null) : Mat4 {
    dst = dst || new Array<number>(16);

    let a00 = a[0];
    let a01 = a[1];
    let a02 = a[2];
    let a03 = a[3];
    let a10 = a[ 4 + 0];
    let a11 = a[ 4 + 1];
    let a12 = a[ 4 + 2];
    let a13 = a[ 4 + 3];
    let a20 = a[ 8 + 0];
    let a21 = a[ 8 + 1];
    let a22 = a[ 8 + 2];
    let a23 = a[ 8 + 3];
    let a30 = a[12 + 0];
    let a31 = a[12 + 1];
    let a32 = a[12 + 2];
    let a33 = a[12 + 3];
    let b00 = b[0];
    let b01 = b[1];
    let b02 = b[2];
    let b03 = b[3];
    let b10 = b[ 4 + 0];
    let b11 = b[ 4 + 1];
    let b12 = b[ 4 + 2];
    let b13 = b[ 4 + 3];
    let b20 = b[ 8 + 0];
    let b21 = b[ 8 + 1];
    let b22 = b[ 8 + 2];
    let b23 = b[ 8 + 3];
    let b30 = b[12 + 0];
    let b31 = b[12 + 1];
    let b32 = b[12 + 2];
    let b33 = b[12 + 3];

    dst[ 0] = a00 * b00 + a10 * b01 + a20 * b02 + a30 * b03;
    dst[ 1] = a01 * b00 + a11 * b01 + a21 * b02 + a31 * b03;
    dst[ 2] = a02 * b00 + a12 * b01 + a22 * b02 + a32 * b03;
    dst[ 3] = a03 * b00 + a13 * b01 + a23 * b02 + a33 * b03;
    dst[ 4] = a00 * b10 + a10 * b11 + a20 * b12 + a30 * b13;
    dst[ 5] = a01 * b10 + a11 * b11 + a21 * b12 + a31 * b13;
    dst[ 6] = a02 * b10 + a12 * b11 + a22 * b12 + a32 * b13;
    dst[ 7] = a03 * b10 + a13 * b11 + a23 * b12 + a33 * b13;
    dst[ 8] = a00 * b20 + a10 * b21 + a20 * b22 + a30 * b23;
    dst[ 9] = a01 * b20 + a11 * b21 + a21 * b22 + a31 * b23;
    dst[10] = a02 * b20 + a12 * b21 + a22 * b22 + a32 * b23;
    dst[11] = a03 * b20 + a13 * b21 + a23 * b22 + a33 * b23;
    dst[12] = a00 * b30 + a10 * b31 + a20 * b32 + a30 * b33;
    dst[13] = a01 * b30 + a11 * b31 + a21 * b32 + a31 * b33;
    dst[14] = a02 * b30 + a12 * b31 + a22 * b32 + a32 * b33;
    dst[15] = a03 * b30 + a13 * b31 + a23 * b32 + a33 * b33;

    return dst;
}

export function dot(m : Mat4, v : Vec2, dst : Vec2 = null) : Vec2 {
    dst = dst || new Array<number>(2);

    var v0 = v[0];
    var v1 = v[1];
    var v2 = 0;
    var d = v0 * m[0 * 4 + 3] + v1 * m[1 * 4 + 3] + v2 * m[2 * 4 + 3] + m[3 * 4 + 3];

    dst[0] = (v0 * m[0 * 4 + 0] + v1 * m[1 * 4 + 0] + v2 * m[2 * 4 + 0] + m[3 * 4 + 0]) / d;
    dst[1] = (v0 * m[0 * 4 + 1] + v1 * m[1 * 4 + 1] + v2 * m[2 * 4 + 1] + m[3 * 4 + 1]) / d;
    // dst[2] = (v0 * m[0 * 4 + 2] + v1 * m[1 * 4 + 2] + v2 * m[2 * 4 + 2] + m[3 * 4 + 2]) / d;

    return dst;
}